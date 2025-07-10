"use client"

import { upvoteComment, downvoteComment, giftComment } from "./api/CommentActions"
import { emojis, Comment, reply } from "@/types/Comments"
import { useState, useEffect, useRef, useCallback } from "react"
import { Smile, ArrowBigUp, ArrowBigDown, IndianRupee, ChevronDown, SendHorizonal, ReplyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/useAuthStore"
import { mockComments as DebugComments } from "./debugTools/CommentGenerator"

const mockComments: Comment[] = DebugComments


interface CommentsSectionProps {
  isOpen: boolean
  onClose: () => void
  videoId: string | null
  longVideosOnly: boolean
}

export default function CommentsSection({ isOpen, onClose, videoId, longVideosOnly }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [comment, setComment] = useState("")
  const [openReplies, setOpenReplies] = useState<{ [key: string]: reply[] }>({})
  const [loadingReplies, setLoadingReplies] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const token = useAuthStore((state) => state.token)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // 👇 Wrap it in useCallback
  const fetchComments = useCallback(async () => {
    if (!token || !videoId) {
      console.warn("No token or videoId provided, using mock comments");
      setComments(mockComments);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interaction/videos/${videoId}/comments?videoType=${longVideosOnly ? "long" : "short"}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      console.log("Fetched comments", data)
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [token, longVideosOnly, videoId]); // ✅ Add necessary dependencies


  useEffect(() => {
    if (isOpen && videoId) {
      fetchComments();
    }
  }, [isOpen, videoId, fetchComments]); // ✅ now stable

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // ✅ fetchComments not needed here


  const fetchReplies = async (commentID: string) => {
    if (openReplies[commentID]) {
      // Already loaded replies, toggle visibility
      setOpenReplies(prev => {
        const newReplies = { ...prev }
        delete newReplies[commentID]
        return newReplies
      })
      return
    }

    try {
      setLoadingReplies(commentID)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interaction/videos/${videoId}/comments/${commentID}/replies`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      const data = await response.json()
      setOpenReplies(prev => ({ ...prev, [commentID]: data }))
    } catch (error) {
      console.error("Error fetching replies:", error)
    } finally {
      setLoadingReplies(null)
    }
  }


  const AddReply = async (commentID: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interaction/videos/${videoId}/comments/${commentID}/replies`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "content": "This is a reply",
          "videoType": longVideosOnly ? "long" : "short"
        }),
      })

      const data = await response.json()
      console.log("Reply added:", data)

    } catch (error) {
      console.error("Error fetching replies:", error)
    } finally {
      setLoadingReplies(null)
    }
  }


  const handleUpvote = async (commentID: string) => {
    try {
      const data = await upvoteComment({
        token,
        commentId: commentID,
        videoId,
        videoType: longVideosOnly ? "long" : "short"
      });

      setComments(prev =>
        prev.map(comment =>
          comment._id === commentID
            ? { ...comment, upvotes: data.upvotes, downvotes: data.downvotes, upvoted: !comment.upvoted, downvoted: false }
            : comment
        )
      );
    } catch (err) {
      console.error("Upvote error:", err);
    }
  };

  const handleDownvote = async (commentID: string) => {
    try {
      const data = await downvoteComment({
        token,
        commentId: commentID,
        videoId,
        videoType: longVideosOnly ? "long" : "short"
      });

      setComments(prev =>
        prev.map(comment =>
          comment._id === commentID
            ? { ...comment, upvotes: data.upvotes, downvotes: data.downvotes, downvoted:!comment.downvoted, upvoted: false}
            : comment
        )
      );
    } catch (err) {
      console.error("Downvote error:", err);
    }
  };

  const handleGiftComment = async (commentID: string) => {
    const amount = prompt("Enter amount to gift:");
    const giftNote = prompt("Add a note (optional):");

    if (!amount || isNaN(Number(amount))) {
      alert("Invalid amount.");
      return;
    }

    try {
      await giftComment({
        token,
        commentId: commentID,
        videoId,
        videoType: longVideosOnly ? "long" : "short",
        amount: Number(amount),
        giftNote: giftNote || ""
      });

      alert("Gift sent!");
      setComments(prev =>
        prev.map(comment =>
          comment._id === commentID
            ? { ...comment, donations: comment.donations + Number(amount) }
            : comment
        )
      );
    } catch (err) {
      console.error("Gift error:", err);
      alert("Failed to gift comment.");
    }
  };

  const handleSendComment = async () => {
    if (!token || !videoId || !comment.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interaction/comment`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          videoId,
          "videoType": longVideosOnly ? "long" : "short",
          "comment": comment
        }),
      })


      if (!response.ok) {
        throw new Error("Failed to post comment")
      }
      console.log(response)
      const newComment = await response.json()
      setComments(prev => [newComment, ...prev])
      setComment("")
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addEmoji = (emoji: string) => {
    setComment((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  if (!isOpen) return null

  return (
    <div className="comments-section open flex flex-col h-[80vh] ">
      {/* Header */}
      <div className="flex items-center justify-center p-3 lg:p-4 flex-col bg-[#1A1A1A] rounded-t-3xl">
        <div className="w-20 h-1 bg-white/80 rounded-full mx-auto my-2 hover:bg-white/60 transition-colors" />
        <h3 className="text-base text-[24px] font-semibold ">Comments</h3>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4 bg-[#1A1A1A]">
        {comments.map((comment) => (
          <div key={comment._id} className="space-y-2">
            {/* Main Comment */}
            {comment.videoId == videoId ?
              <div className="flex space-x-2 lg:space-x-3">
                <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
                  <AvatarImage src={comment.user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs lg:text-sm">{comment.user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 lg:space-x-2 mb-1">
                    <span className="font-medium text-sm lg:text-base truncate font-poppins text-[#B0B0B0]">{comment.user?.name || "Anonymous User"}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm lg:text-base leading-relaxed">{comment.content}</p>

                  <div className="flex">
                    <button onClick={() => fetchReplies(comment._id)} className="flex items-center" >
                      <span className="text-xs text-muted-foreground ">
                        View replies ({comment.replies})</span>
                      <ChevronDown />
                    </button>
                    {/*<button onClick={() => AddReply(comment._id)} className="flex items-center" >
                      <ReplyIcon />
                    </button>*/}
                  </div>
                  {openReplies[comment._id] && (
                    <div className="ml-10 space-y-2 mt-2">
                      {(!Array.isArray(openReplies[comment._id])) ? (
                        <p className="text-xs text-muted-foreground">No replies yet.</p>
                      ) : (
                        openReplies[comment._id].map(reply => (
                          <div key={reply._id} className="flex space-x-2">
                            <Avatar className="w-7 h-7">
                              <AvatarImage src={reply.user?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{reply.user?.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-1 mb-1">
                                <span className="font-medium text-xs">{reply.user.name}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(reply.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {loadingReplies === comment._id && (
                    <p className="text-xs text-muted-foreground ml-10">Loading replies...</p>
                  )}
                </div>
                <div className="flex">
                  <button onClick={() => handleGiftComment(comment._id)} className="flex flex-col items-center pt-1">
                    <IndianRupee size={18} />{comment.donations}
                  </button>
                  <button onClick={() => handleUpvote(comment._id)} className="flex flex-col items-center">
                    {comment.upvoted ? <ArrowBigUp size={24} color="[#B0B0B0]" fill="#B0B0B0"/> : <ArrowBigUp size={24} color="#B0B0B0" />}{comment.upvotes}
                  </button>
                  <button onClick={() => handleDownvote(comment._id)} className="flex flex-col items-center">
                    {comment.downvoted ? <ArrowBigDown size={24} color="[#B0B0B0]" fill="#B0B0B0"/> : <ArrowBigDown size={24} color="#B0B0B0" />}{comment.downvotes}
                  </button>
                </div>
              </div> : ''}</div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="p-3 lg:p-4 border-t border-border bg-[#1A1A1A]">
        <div className="flex space-x-2 lg:space-x-3">
          <div className="flex-1 relative">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[40px] lg:min-h-[40px] max-h-[120px] resize-none pr-16 lg:pr-20 text-sm lg:text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendComment()
                }
              }}
              disabled={isLoading}
            />

            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <div className="relative" ref={emojiPickerRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-8 w-8 lg:h-6 lg:w-6 p-0"
                >
                  <Smile size={16} className="lg:w-4 lg:h-4" />
                </Button>

                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <div className="grid grid-cols-6 gap-1">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          className="text-lg hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                size="sm"
                onClick={handleSendComment}
                disabled={!comment.trim() || isLoading}
                className="h-8 w-8 lg:h-6 lg:w-6 p-0 bg-transparent"
              >
                <SendHorizonal size={14} className="lg:w-4 lg:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


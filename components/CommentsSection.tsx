"use client"

import { emojis, Comment, reply } from "@/types/Comments"
import { useState, useEffect, useRef } from "react"
import { Smile, ArrowBigUp, ArrowBigDown, IndianRupee, ChevronDown, SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/useAuthStore"
import { timeStamp } from "console"
import { mockComments as DebugComments} from "./debugTools/CommentGenerator"
import { mockReplies as DebugReplies} from "./debugTools/ReplyGenerator"

const mockComments: Comment[] = DebugComments

const mockReplies: reply[] = DebugReplies

interface CommentsSectionProps {
  isOpen: boolean
  onClose: () => void
  videoId: string | null
}

export default function CommentsSection({ isOpen, onClose, videoId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [comment, setComment] = useState("")
  const [openReplies, setOpenReplies] = useState<{ [key: string]: reply[] }>({})
  const [loadingReplies, setLoadingReplies] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const token = useAuthStore((state) => state.token)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && videoId) {
      fetchComments()
    }
  }, [isOpen, videoId])

  // Add click outside handler for emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchComments = async () => {
    //if (!token || !videoId) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comments`, {
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      //if (!response.ok) {
      //  throw new Error("Failed to fetch comments")
      //}

      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }


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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comments/${commentID}/replies`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      const data = await response.json()
      setOpenReplies(prev => ({ ...prev, [commentID]: data }))

    // Use mock data
    //const filteredReplies = mockReplies.filter(reply => reply.parentId === commentID)
    //setLoadingReplies(commentID)
    // Simulate network delay (optional)
    //await new Promise(res => setTimeout(res, 500))
    //setOpenReplies(prev => ({ ...prev, [commentID]: filteredReplies }))

    } catch (error) {
      console.error("Error fetching replies:", error)
    } finally {
      setLoadingReplies(null)
    }
  }


  const handleSendComment = async () => {
    if (!token || !videoId || !comment.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comment`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: comment }),
      })


      if (!response.ok) {
        throw new Error("Failed to post comment")
      }

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
        {mockComments.map((comment) => (
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
                    <span className="font-medium text-sm lg:text-base truncate">{comment.user?.name || "Anonymous User"}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm lg:text-base leading-relaxed">{comment.content}</p>
                  <button onClick={() => fetchReplies(comment._id)} className="flex items-center" >
                    <span className="text-xs text-muted-foreground ">
                      View replies ({comment.replies})</span>
                    <ChevronDown />
                  </button>
                  {openReplies[comment._id] && (
                    <div className="ml-10 space-y-2 mt-2">
                      {openReplies[comment._id].length === 0 ? (
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
                  <button className="flex flex-col items-center pt-1">
                    <IndianRupee size={18} />{comment.donations}
                  </button>
                  <button className="flex flex-col items-center">
                    <ArrowBigUp size={24} />{comment.upVotes}
                  </button>
                  <button className="flex flex-col items-center">
                    <ArrowBigDown size={24} />{comment.downVotes}
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


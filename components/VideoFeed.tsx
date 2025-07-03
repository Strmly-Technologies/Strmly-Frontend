"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Heart, MessageCircle, Maximize, ChevronDown, Link as LinkIcon, Send, IndianRupee, HashIcon, MoreHorizontal, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CommentsSection from "./CommentsSection"
import VideoMoreMenu from "./VideoMoreMenu"
import { useAuthStore } from "@/store/useAuthStore"
import { api } from "@/lib/api"
import { FaWhatsapp, FaInstagram, FaTelegram, FaSnapchat, FaTwitter, FaFacebook } from "react-icons/fa"

const mockVideos = [
  {
    id: 1,
    type: "long",
    user: {
      name: "Tech Creator",
      username: "@techcreator",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "Building a Startup from Scratch - Complete Guide",
    description: "Learn how to build a successful startup from the ground up, covering everything from idea validation to funding and scaling. This comprehensive guide will walk you through every step of the process, from ideation to launch.",
    community: "Startup Community",
    series: "Entrepreneur Series",
    episodes: [
      { id: 1, videoURL: "/MockVideos/video.mp4" },
      { id: 2, videoURL: "/MockVideos/video2.mp4" },
      { id: 3, videoURL: "/MockVideos/video3.mp4" },
      { id: 4, videoURL: "/MockVideos/video4.mp4" },
    ],
    currentEpisode: 1,
    duration: "15:42",
    progress: 35,
    likes: 89500,
    comments: 892,
    shares: 234,
    earnings: 1200,
    videoUrl: "/MockVideos/video.mp4",
  },
  {
    id: 2,
    type: "long",
    user: {
      name: "Code Master",
      username: "@codemaster",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "React vs Next.js - Which Should You Choose?",
    description: "Complete comparison of React and Next.js frameworks, diving deep into their features, performance, and best use cases for modern web development. This is a very comprehensive guide, perfect for developers looking to make informed decisions.",
    community: "Developer Community",
    series: "Web Dev Masterclass",
    episodes: [
      { id: 1, videoURL: "/MockVideos/video2.mp4" },
      { id: 2, videoURL: "/MockVideos/video.mp4" },
      { id: 3, videoURL: "/MockVideos/video4.mp4" },
      { id: 4, videoURL: "/MockVideos/video3.mp4" },
      { id: 5, videoURL: "/MockVideos/video2.mp4" },
    ],
    currentEpisode: 1,
    duration: "22:15",
    progress: 60,
    likes: 67000,
    comments: 445,
    shares: 123,
    earnings: 890,
    videoUrl: "/MockVideos/video.mp4",
  },

  {
    id: 3,
    type: "short",
    user: {
      name: "Code Master",
      username: "@codemaster",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "React vs Next.js - Which Should You Choose?",
    description: "Complete comparison of React and Next.js frameworks, diving deep into their features, performance, and best use cases for modern web development. This is a very comprehensive guide, perfect for developers looking to make informed decisions.",
    community: "Developer Community",
    duration: "22:15",
    progress: 60,
    likes: 6700,
    comments: 4450,
    shares: 127,
    earnings: 899,
    videoUrl: "/MockVideos/video3.mp4",
  },

  {
    id: 4,
    type: "short",
    user: {
      name: "Code Master",
      username: "@codemaster",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    title: "React vs Next.js - Which Should You Choose?",
    description: "Complete comparison of React and Next.js frameworks, diving deep into their features, performance, and best use cases for modern web development. This is a very comprehensive guide, perfect for developers looking to make informed decisions.",
    community: "Developer Community",
    duration: "22:15",
    progress: 60,
    likes: 6680,
    comments: 745,
    shares: 673,
    earnings: 190,
    videoUrl: "/MockVideos/video4.mp4",
  },
]
interface VideoFeedProps {
  longVideoOnly?: boolean
  ChangeVideoProgress:(value: number | ((prev: number) => number)) => void
  Muted: boolean
}

const socialPlatforms = [
  { name: "WhatsApp", icon: FaWhatsapp, color: "text-green-500" },
  { name: "Instagram", icon: FaInstagram, color: "text-pink-500" },
  { name: "Telegram", icon: FaTelegram, color: "text-blue-500" },
  { name: "Snapchat", icon: FaSnapchat, color: "text-yellow-500" },
  { name: "Twitter", icon: FaTwitter, color: "text-blue-400" },
  { name: "Facebook", icon: FaFacebook, color: "text-blue-600" },
]

interface Video {
  _id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  type: "short" | "long"
  status: "DRAFT" | "PROCESSING" | "PUBLISHED" | "FAILED" | "PRIVATE"
  user: {
    id: string
    name: string
    username: string
    avatar: string
  }
  likes: number
  comments: number
  shares: number
  views: number
  earnings: number
  progress?: number
  community?: string
  series?: string
  currentEpisode?: number
  episodes?: Array<{
    id: number
    videoURL: string
  }>
  tags?: string[]
  isLiked: boolean
  createdAt: string // Ensure createdAt is part of the interface
}

// Utility function to truncate description by words
const truncateWords = (text: string, maxWords: number) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
};


export default function VideoFeed({ longVideoOnly = false, ChangeVideoProgress, Muted}: VideoFeedProps) {

  const [videos, setVideos] = useState<Video[]>([])
  // currentVideo is no longer directly used for playback logic but can be for other UI purposes.
  const [currentVideo, setCurrentVideo] = useState(0) // Still present, but not used in fullscreen logic anymore
  const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>({})
  const manuallyPausedRef = useRef<Record<string, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [currentEpisodeMap, setCurrentEpisodeMap] = useState<Record<string, number>>({});
  // Updated videoRefs to store element and ID
  const videoRefs = useRef<Array<{ element: HTMLVideoElement | null; id: string }>>([])
  const [showShareOptions, setShowShareOptions] = useState(false)
  const token = useAuthStore((state) => state.token)
  const [showFullDescriptionMap, setShowFullDescriptionMap] = useState<Record<string, boolean>>({});
  const commentsRef = useRef<HTMLDivElement>(null)
  const shareOptionsRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({})
  const { user } = useAuthStore()

  // Ref to hold the current playingStates, so it's stable within useCallback
  const playingStatesRef = useRef(playingStates);
  useEffect(() => {
    playingStatesRef.current = playingStates;
  }, [playingStates]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!token) {
          console.error("No authentication token found")
          //return
        }

        //const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`, {
        //  credentials: "include",
        //  headers: {
        //    "Authorization": `Bearer ${token}`,
        //   "Content-Type": "application/json"
        //  },
        //})
        //if (!response.ok) {
        //  throw new Error(`Failed to fetch videos: ${response.status} ${response.statusText}`)
        //}
        //const data = await response.json()
        //console.log("Raw API response data:", data) // <<<--- CHECK THIS IN CONSOLE

        // Transform the data to match the Video interface
        //const transformedVideos = data.map((video: any) => ({
        const transformedVideos = mockVideos.map((video: any) => ({
          _id: video.id,
          title: video.title || "Untitled Video", // This line tries to get the title
          description: video.description || "",   // This line tries to get the description
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl || "",
          type: video.type,
          status: video.status || "PUBLISHED",
          user: {
            id: video.userId,
            name: video.user?.name || "Anonymous",
            username: video.user?.username || "@anonymous",
            avatar: video.user?.avatar || "/placeholder.svg"
          },
          likes: video.likes || 0,
          comments: video.comments || 0,
          shares: video.shares || 0,
          views: video.views || 0,
          earnings: video.earnings || 0,
          progress: 0,
          isLiked: video.isLiked || false,
          tags: video.tags || [],
          createdAt: video.createdAt,
          community: video.community || null,
          series: video.series || null,
          currentEpisode: video.currentEpisode || 1,
          episodes: video.episodes || []
        }))
        console.log("Transformed videos data (check title/description here):", transformedVideos) // <<<--- CHECK THIS IN CONSOLE
        setVideos(transformedVideos)

        //Initialize episodes]
        const initialEpisodeMap: Record<string, number> = {}
        transformedVideos.forEach((v) => {
          initialEpisodeMap[v._id] = v.currentEpisode || 1
        })
        setCurrentEpisodeMap(initialEpisodeMap)
        // Check following status for each user
        const followingStatuses = await Promise.all(
          transformedVideos.map(async (v: Video) => {
            if (v.user.id === user?.id) return { id: v.user.id, isFollowing: false }
            const isFollowing = await api.isFollowing(user?.id || "", v.user.id)
            return { id: v.user.id, isFollowing }
          })
        )

        setFollowingMap(prev => ({
          ...prev,
          ...Object.fromEntries(followingStatuses.map(s => [s.id, s.isFollowing]))
        }))
      } catch (error) {
        console.error("Error fetching videos:", error)
      }
    }
    fetchVideos()
  }, [token, user?.id])

  const filteredVideos = longVideoOnly
    ? videos.filter(video => video.type === "long" && video.status === "PUBLISHED")
    : videos.filter(video => video.type === "short" && video.status === "PUBLISHED")

  const handleVideoAction = async (action: string, videoId: string) => {
    if (!token) {
      console.error("No authentication token found")
      //return
    }

    if (action === "like") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/like`, {
          method: 'POST',
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })

        if (!response.ok) {
          throw new Error("Failed to toggle like")
        }

        const data = await response.json()

        // Update the video's like count and liked state
        setVideos(prevVideos =>
          prevVideos.map(video =>
            video._id === videoId
              ? {
                ...video,
                likes: data.liked ? video.likes + 1 : video.likes - 1,
                isLiked: data.liked
              }
              : video
          )
        )
      } catch (error) {
        console.error("Error toggling like:", error)
      }
    } else if (action === "comment") {
      setSelectedVideoId(videoId)
      setShowComments(true)
    } else if (action === "more") {
      setSelectedVideoId(videoId)
      setShowMoreMenu(true)
    } else {
      console.log(`${action} video ${videoId}`)
    }
  }

  // CORRECTED: handleFullscreen now uses playingStatesRef to find the active video
  const handleFullscreen = async () => {
    const currentlyPlayingVideoRef = videoRefs.current.find(ref => playingStatesRef.current[ref.id]);
    const currentVideoEl = currentlyPlayingVideoRef?.element;

    if (!currentVideoEl) {
      console.log('No video is currently playing to go fullscreen.');
      return;
    }

    try {
      if (!isFullscreen) {
        // Request fullscreen on the video element
        if (currentVideoEl.requestFullscreen) {
          await currentVideoEl.requestFullscreen()
        } else if ((currentVideoEl as any).webkitRequestFullscreen) {
          await (currentVideoEl as any).webkitRequestFullscreen()
        } else if ((currentVideoEl as any).mozRequestFullScreen) {
          await (currentVideoEl as any).mozRequestFullScreen()
        } else if ((currentVideoEl as any).msRequestFullscreen) {
          await (currentVideoEl as any).msRequestFullscreen()
        }
        setIsFullscreen(true)

        // Lock orientation to landscape when entering fullscreen
        if (typeof screen !== 'undefined' && screen.orientation) {
          try {
            await (screen.orientation as any).lock('landscape')
          } catch (error) {
            console.log('Orientation lock not supported')
          }
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitExitFullscreen()
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
        setIsFullscreen(false)

        // Unlock orientation when exiting fullscreen
        if (typeof screen !== 'undefined' && screen.orientation) {
          try {
            await (screen.orientation as any).unlock()
          } catch (error) {
            console.log('Orientation unlock not supported')
          }
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  // Add video playback state management
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause all videos when page is not visible
        videoRefs.current.forEach((ref) => {
          if (ref.element) {
            ref.element.pause()
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )
      setIsFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Handle video intersection for auto-play/pause
  const intersectionObserverCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const videoRef = videoRefs.current.find(ref => ref.element === entry.target)
      if (videoRef?.element) {
        if (entry.isIntersecting) {
          // Don't auto-play if manually paused
          if (manuallyPausedRef.current[videoRef.id]) return;

          // Pause others
          videoRefs.current.forEach(otherRef => {
            if (otherRef.element && otherRef.id !== videoRef.id && playingStatesRef.current[otherRef.id]) {
              otherRef.element.pause();
              setPlayingStates(prev => ({ ...prev, [otherRef.id]: false }));
            }
          });
          videoRef.element.play().catch(error => {
            console.log('Autoplay prevented:', error);
          });
          setPlayingStates(prev => ({ ...prev, [videoRef.id]: true }));
        } else {
          // When scrolled out, pause and reset manual pause status
          videoRef.element.pause();
          manuallyPausedRef.current[videoRef.id] = false;
          setPlayingStates(prev => ({ ...prev, [videoRef.id]: false }));
        }

      }
    });
  }, [setPlayingStates]); // setPlayingStates is a stable reference

  useEffect(() => {
    const observer = new IntersectionObserver(intersectionObserverCallback, {
      threshold: 0.5, // Trigger when 50% of the video is visible
    })

    videoRefs.current.forEach((ref) => {
      if (ref.element) {
        observer.observe(ref.element)
      }
    })

    return () => {
      videoRefs.current.forEach((ref) => {
        if (ref.element) {
          observer.unobserve(ref.element)
        }
      })
      observer.disconnect()
    }
  }, [filteredVideos, intersectionObserverCallback]) // Re-run if filteredVideos change


  const handleShare = (platform: string, videoId: string) => {
    const videoUrl = `https://strmly.com/video/${videoId}`
    const shareText = "Check out this video on Strmly!"

    switch (platform.toLowerCase()) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + videoUrl)}`)
        break
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}`)
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(videoUrl)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`)
        break
      case "instagram":
        // Instagram doesn't support direct sharing via URL
        copyLink(videoId)
        alert("Instagram doesn't support direct sharing. Link copied to clipboard!")
        break
      case "snapchat":
        // Snapchat doesn't support direct sharing via URL
        copyLink(videoId)
        alert("Snapchat doesn't support direct sharing. Link copied to clipboard!")
        break
      default:
        copyLink(videoId)
    }
  }

  const copyLink = (videoId: string) => {
    const videoUrl = `https://strmly.com/video/${videoId}`
    navigator.clipboard.writeText(videoUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
  }

  // Modified togglePlay to handle pausing other videos
  const togglePlay = (videoId: string, index: number) => {
    const videoRef = videoRefs.current[index];
    if (!videoRef?.element) return;

    const video = videoRef.element;

    if (!video.paused) {
      video.pause();
      setPlayingStates(prev => ({ ...prev, [videoId]: false }));
    } else {
      videoRefs.current.forEach(ref => {
        if (ref.element && ref.id !== videoId && !ref.element.paused) {
          ref.element.pause();
          setPlayingStates(prev => ({ ...prev, [ref.id]: false }));
        }
      });
      video.play().catch(err => {
        console.warn("Autoplay failed:", err);
      });

      setPlayingStates(prev => ({ ...prev, [videoId]: true }));
    }
  };

  const PauseAndPlay = (videoId: string, index: number) => {
    const videoRef = videoRefs.current[index];
    if (!videoRef?.element) return;

    const video = videoRef.element;

    if (video.paused) {
      manuallyPausedRef.current[videoId] = false; // not paused by user anymore
      video.play();
      setPlayingStates(prev => ({ ...prev, [videoId]: true }));
    } else {
      manuallyPausedRef.current[videoId] = true; // user paused manually
      video.pause();
      setPlayingStates(prev => ({ ...prev, [videoId]: false }));
    }
  };



  // Add click outside handler for comments, share options, AND description
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close comments section
      if (commentsRef.current && !commentsRef.current.contains(event.target as Node)) {
        setShowComments(false)
      }

      // Close share options
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
        setShowShareOptions(false)
      }

      // Collapse description if clicked outstide
      if (descriptionRef.current) {
        // Check if any description is currently expanded
        const isAnyDescriptionExpanded = Object.values(showFullDescriptionMap).some(Boolean);
        // If a description is expanded AND the click is outside the descriptionRef
        if (isAnyDescriptionExpanded && !descriptionRef.current.contains(event.target as Node)) {
          setShowFullDescriptionMap({});
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFullDescriptionMap])


  const handleFollow = async (targetUserId: string) => {
    try {
      const result = await api.followUser(targetUserId)
      setFollowingMap(prev => ({
        ...prev,
        [targetUserId]: result.following
      }))
    } catch (error) {
      console.error("Error following user:", error)
    }
  }

  const toggleFullDescription = (videoId: string) => {
    setShowFullDescriptionMap(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const DEFAULT_WORD_LIMIT = 20;

  return (
    <>
      {/* Increased padding-bottom to account for mobile nav */}
      <div className={`h-screen overflow-y-scroll snap-y snap-mandatory ${isFullscreen ? "fullscreen-video" : ""} pt-14 pb-16`}>

        {filteredVideos.map((video, index) => (
          <div key={video._id} className="h-screen snap-start relative bg-black">
            {/* Video Background */}
            <div className="absolute inset-0">
              <video
                ref={(el) => {
                  if (el) { // Ensure element exists before assigning
                    videoRefs.current[index] = { element: el, id: video._id };
                  }
                }}
                src={video.episodes?.find(e => e.id === currentEpisodeMap[video._id])?.videoURL || video.videoUrl}
                poster={video.thumbnailUrl}
                className={`w-full h-full object-cover ${isFullscreen ? 'object-contain' : ''}`}
                playsInline
                muted={Muted}
                onPlay={() => setPlayingStates(prev => ({ ...prev, [video._id]: true }))}
                onPause={() => setPlayingStates(prev => ({ ...prev, [video._id]: false }))}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default video controls if any
                  PauseAndPlay(video._id, index);
                }}
                onTimeUpdate={(e) => {
                  const videoEl = e.currentTarget;
                  const percent = (videoEl.currentTime / videoEl.duration) * 100;
                  ChangeVideoProgress(percent)
                }}
                onEnded={() => {
                  const nextIndex = index + 1;
                  const nextRef = videoRefs.current[nextIndex]?.element;
                  if (nextRef) {
                    nextRef.scrollIntoView({ behavior: "smooth", block: "center" });
                    setTimeout(() => {
                      nextRef.play().catch((err) => {
                        console.warn("Autoplay failed:", err);
                      });
                    }, 500); // Small delay for scroll finish
                  }
                }}
              />
              {/* Video Progress Bar 
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700/40 z-40">
                <div
                  className="h-full bg-[#F1C40F] transition-all duration-300"
                  style={{ width: `${progressMap[video._id] || 0}%` }}
                />
              </div>*/}

              {/* Play/Pause overlay buttons */}
              {!playingStates[video._id] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                </div>
              )}
            </div>

            {/* Right Side Actions - YouTube Shorts style */}
            <div className="video-actions flex flex-col items-center justify-end h-full py-4 space-y-0">
              <div className="flex flex-col items-center">
                <Button
                  onClick={() => handleVideoAction("like", video._id)}
                  className={`bg-transparent text-white rounded-full hover:bg-transparent p-1 ${video.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  <Heart size={36} className={video.isLiked ? 'fill-current' : ''} />
                </Button>
                <span className="text-white text-xs font-medium mt-1">
                  {video.likes > 1000 ? `${(video.likes / 1000).toFixed(0)}K` : video.likes}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <Button
                  onClick={() => handleVideoAction("comment", video._id)}
                  className="bg-transparent text-white hover:text-primary rounded-full hover:bg-transparent p-1"
                >
                  <MessageCircle size={36} />

                </Button>
                <span className="text-white text-xs font-medium mt-1">
                  {video.comments > 1000 ? `${(video.comments / 1000).toFixed(1)}K` : video.comments}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <Button
                  onClick={() => {
                    setSelectedVideoId(video._id)
                    setShowShareOptions(!showShareOptions)
                  }}
                  className="bg-transparent text-white hover:text-primary rounded-full hover:bg-transparent p-1"
                >
                  <Send size={36} />
                </Button>
                <span className="text-white text-xs font-medium mt-1">{video.shares}</span>
              </div>

              <div className="flex flex-col items-center">
                <Button
                  onClick={() => handleVideoAction("save", video._id)}
                  className="bg-transparent text-white hover:text-primary rounded-full hover:bg-transparent p-1"
                >
                  <IndianRupee size={36} />
                </Button>
                <span className="text-white text-xs font-medium mt-1">
                  {video.earnings > 1000 ? `${(video.earnings / 1000).toFixed(1)}K` : video.earnings}
                </span>
              </div>

              {/* More Menu */}
              <div className="flex flex-col items-center">
                <Button
                  onClick={() => handleVideoAction("more", video._id)}
                  className="bg-transparent text-white hover:text-primary hover:bg-transparent p-1"
                >
                  <MoreHorizontal size={36} />
                </Button>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 pb-18 sm:pb-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent max-h-[50vh] overflow-y-auto">
              {/* Community and Series Info */}
              <div className="mb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {video.community && (
                      <Badge variant="secondary" className="bg-transparent text-white text-[20px] flex gap-3">
                        <div className="flex">
                          <HashIcon size={24} color="yellow" />
                          {video.community}
                        </div><img src='/assets/MiscIcons/FollowButton.svg' />
                      </Badge>
                    )}

                  </div>
                </div>


                <div className="flex items-center space-x-2">
                  {/*{video.series && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white">
                      <Users size={12} className="mr-1" />
                      {video.series}
                    </Badge>
                  )}*/}

                  {video.type === "long" && video.episodes && video.episodes.length > 0 && (
                    <>
                      <div className="flex items-start gap-3 mt-4 w-full">
                        {/* Avatar + Add Button */}
                        <div className="relative">
                          <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src={video.user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{video.user?.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Main Info */}
                        <div className="flex flex-col flex-1 w-full">
                          {/* Name + Follow */}
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-semibold text-[20px]">{video.user?.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white border border-white rounded-half px-2 py-0.5 text-[16px] font-medium hover:bg-white/10 h-auto min-h-0"
                            >
                              Follow
                            </Button>
                          </div>

                          {/* Title + Episode + Paid (left + right) */}
                          <div className="w-full flex items-center justify-between mt-1">
                            {/* Left: DEATH + Ep Dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-white text-xs uppercase tracking-wider font-bold">{video.title.substring(0, 20)}{video.title.length > 20 ? "..." : ""}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white border border-white rounded-full px-2 py-0 text-xs font-medium hover:bg-white/10 h-auto min-h-0"
                                  >
                                    Ep : {video.currentEpisode}
                                    <ChevronDown size={12} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" className="w-32">
                                  {video.episodes?.map((episode) => (
                                    <DropdownMenuItem
                                      key={episode.id}
                                      className="flex justify-between cursor-pointer"
                                      onClick={() => {
                                        video.currentEpisode = episode.id;
                                        setCurrentEpisodeMap((prev) => ({
                                          ...prev,
                                          [video._id]: episode.id,
                                        }));
                                      }}
                                    >
                                      <span>Episode : {episode.id}</span>
                                      <span>{video.currentEpisode == episode.id ? <img src='./assets/MiscIcons/TickMark.svg' className="w-5 h-5"/> : ""}</span>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Right: Paid Badge */}
                            {true && (
                              <Badge
                                variant="secondary"
                                className="bg-transparent text-[#F1C40F] text-[16px] font-bold px-2 border-white rounded-md"
                              >
                                Paid
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {video.type === "long" && !video.episodes && (
                    <>
                      <div className="flex items-start gap-3 mt-4 w-full">
                        {/* Avatar + Add Button */}
                        <div className="relative">
                          <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src={video.user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{video.user?.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Main Info */}
                        <div className="flex flex-col flex-1 w-full">
                          {/* Name + Follow */}
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-semibold text-[20px]">{video.user?.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white border border-white rounded-half px-2 py-0.5 text-[16px] font-medium hover:bg-white/10 h-auto min-h-0"
                            >
                              Follow
                            </Button>
                          </div>

                          {/* Title + Paid (left + right) */}
                          <div className="w-full flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-xs uppercase tracking-wider font-bold">{video.title.substring(0, 20)}{video.title.length > 20 ? "..." : ""}</span>
                            </div>

                            {/* Right: Paid Badge */}
                            {true && (
                              <Badge
                                variant="secondary"
                                className="bg-transparent text-[#F1C40F] text-[16px] font-bold px-2 border-white rounded-md"
                              >
                                Paid
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {video.type === "short" && (
                    <>
                      <div className="flex items-start gap-3 mt-4 w-full">
                        {/* Avatar + Add Button */}
                        <div className="relative">
                          <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src={video.user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{video.user?.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Main Info */}
                        <div className="flex flex-col flex-1 w-full">
                          {/* Name + Follow */}
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-semibold text-[20px]">{video.user?.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white border border-white rounded-half px-2 py-0.5 text-[16px] font-medium hover:bg-white/10 h-auto min-h-0"
                            >
                              Follow
                            </Button>
                          </div>

                          {/* Title + Paid (left + right) */}
                          <div className="w-full flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-xs uppercase tracking-wider font-bold">{video.title.substring(0, 20)}{video.title.length > 20 ? "..." : ""}</span>
                            </div>

                            {/* Right: Paid Badge */}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>


              <div className="flex items-center space-x-2 mb-1">

                {video.user.id && video.user.id !== user?.id && (
                  <Button
                    size="sm"
                    variant={followingMap[video.user.id] ? "outline" : "default"}
                    className={`text-xs px-0 py-0 ${followingMap[video.user.id]
                      ? "bg-transparent border border-white text-white hover:bg-white hover:text-black"
                      : "bg-white text-black hover:bg-white/90"
                      }`}
                    onClick={() => handleFollow(video.user.id)}
                  >
                    {followingMap[video.user.id] ? "Following" : "Follow"}
                  </Button>
                )}
              </div>

              <div className="mb-1 text-left flex justify-between" ref={descriptionRef}>
                {/* Show more button if the number of words exceeds the actual limit*/}
                {video.description && video.description.split(/\s+/).length > DEFAULT_WORD_LIMIT && (
                  <button
                    onClick={() => toggleFullDescription(video._id)}
                    className="text-xs text-white/80 hover:text-white mt-1"
                  ><p className="text-white/90 text-xs text-left">
                      {showFullDescriptionMap[video._id] ? video.description : truncateWords(video.description, DEFAULT_WORD_LIMIT)}
                    </p>
                  </button>
                  
                )}
                {/* Fullscreen button for long videos */}
                {video.type === "long" && (
                <div className="flex flex-col items-right z-50">
                  <Button
                    onClick={handleFullscreen}
                    className="bg-transparent text-white hover:text-primary rounded-full p-1"
                  >
                    <Maximize size={36} />
                  </Button>
                </div>)}
              </div>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, tagIndex) => ( // Changed index to tagIndex to avoid conflict
                    <span
                      key={tagIndex}
                      className="text-xs text-white/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comments Section */}
      <div ref={commentsRef}>
        <CommentsSection isOpen={showComments} onClose={() => setShowComments(false)} videoId={selectedVideoId} />
      </div>

      {/* Share Options */}
      {showShareOptions && selectedVideoId && (
        <div ref={shareOptionsRef} className="fixed right-16 top-1/2 transform -translate-y-1/2 bg-background rounded-lg shadow-lg p-4 space-y-4 min-w-[280px] z-50">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => copyLink(selectedVideoId)}
          >
            <LinkIcon size={16} className="mr-2" />
            {isCopied ? "Copied!" : "Copy Link"}
          </Button>

          <div className="grid grid-cols-3 gap-4">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform.name.toLowerCase(), selectedVideoId)}
                className="flex flex-col items-center space-y-1"
              >
                <platform.icon className={`w-8 h-8 ${platform.color}`} />
                <span className="text-white text-xs">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video More Menu */}
      <VideoMoreMenu isOpen={showMoreMenu} onClose={() => setShowMoreMenu(false)} videoId={selectedVideoId} videoRefs={{
        current: Object.fromEntries(
          videoRefs.current.map(({ id, element }) => [id, element])
        ),
      }} />
    </>
  )
}


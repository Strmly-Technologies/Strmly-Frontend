"use client"
import { useVideoActions } from "@/lib/utils"
import { Video } from "@/types/VideoFeed"
import { fetchAndTransformVideos, getFollowingMap } from "@/lib/utils"
import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown, Link as LinkIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CommentsSection from "./CommentsSection"
import VideoMoreMenu from "./VideoMoreMenu"
import { useAuthStore } from "@/store/useAuthStore"
import { FaWhatsapp, FaInstagram, FaTelegram, FaSnapchat, FaTwitter, FaFacebook } from "react-icons/fa"
import { AddShare, toggleLike } from "./api/VideoFeed"

const socialPlatforms = [
  { name: "WhatsApp", icon: FaWhatsapp, color: "text-green-500" },
  { name: "Instagram", icon: FaInstagram, color: "text-pink-500" },
  { name: "Telegram", icon: FaTelegram, color: "text-blue-500" },
  { name: "Snapchat", icon: FaSnapchat, color: "text-yellow-500" },
  { name: "Twitter", icon: FaTwitter, color: "text-blue-400" },
  { name: "Facebook", icon: FaFacebook, color: "text-blue-600" },
]

// Utility function to truncate description by words
const truncateWords = (text: string, maxWords: number) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
};

interface VideoFeedProps {
  longVideoOnly?: boolean
  ChangeVideoProgress: (value: number | ((prev: number) => number)) => void
  Muted: boolean
}

export default function VideoFeed({ longVideoOnly = false, ChangeVideoProgress, Muted }: VideoFeedProps) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [videoSpeed, setVideoSpeed] = useState(1)
  const [showFullDescriptionMap, setShowFullDescriptionMap] = useState<Record<string, boolean>>({});
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({})
  const { handleFollow, toggleFullDescription } = useVideoActions(setFollowingMap, setShowFullDescriptionMap);
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>({})
  const manuallyPausedRef = useRef<Record<string, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showPaidMenu, setShowPaidMenu] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [currentEpisodeMap, setCurrentEpisodeMap] = useState<Record<string, number>>({});
  // Updated videoRefs to store element and ID
  const videoRefs = useRef<Array<{ element: HTMLVideoElement | null; id: string }>>([])
  const [showShareOptions, setShowShareOptions] = useState(false)
  const token = useAuthStore((state) => state.token)
  const commentsRef = useRef<HTMLDivElement>(null)
  const shareOptionsRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore()
  const [isFollowing, setisFollowing] = useState(false)

  useEffect(() => {
    const localRefs = [...videoRefs.current]; // clone it

    localRefs.forEach((ref) => {
      if (ref.element) {
        ref.element.playbackRate = videoSpeed;
      }
    });

    return () => {
      localRefs.forEach((ref) => {
        if (ref.element) {
          // safely clean up
        }
      });
    };
  }, [videoSpeed, videos]);
  

  const loadMore = useCallback(async () => {
    if (loading || !token || reachedEnd) return;
    setLoading(true);

    try {
      const page = offset + 1;
      const newVideos = await fetchAndTransformVideos(
        token,
        page,
        1,
        longVideoOnly ? "long" : "short"
      );

      if (newVideos.length === 0) {
        console.log("No more videos to load");
        setReachedEnd(true);
      }

      console.log("transformed data:", newVideos);
      setVideos((prev) => [...prev, ...newVideos]);
      setOffset((prev) => prev + newVideos.length);

      const episodeMap: Record<string, number> = {};
      newVideos.forEach((v) => {
        v.videoUrl = "/MockVideos/video.mp4";
        const defaultEpId = v.episodes?.[0]?.id ?? 1;
        episodeMap[v._id] = defaultEpId;
      });
      setCurrentEpisodeMap((prev) => ({ ...prev, ...episodeMap }));

      const followingMap = await getFollowingMap(user?.id || "", newVideos);
      setFollowingMap((prev) => ({ ...prev, ...followingMap }));
    } catch (err) {
      console.error("Failed to load more videos", err);
    } finally {
      setLoading(false);
    }
  }, [loading, token, reachedEnd, offset, longVideoOnly, user?.id]); // ← add all dependencies

  useEffect(() => {
    if (!loadMoreRef.current || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Load more videos triggered");
          loadMore();
        }
      },
      { threshold: 1.0, rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loadMoreRef, loading, loadMore]);


  // Ref to hold the current playingStates, so it's stable within useCallback
  const playingStatesRef = useRef(playingStates);
  useEffect(() => {
    playingStatesRef.current = playingStates;
  }, [playingStates]);


  useEffect(() => {
    const fetchVideos = async () => {
      if (!token) {
        console.error("No authentication token found");
        setInitialLoading(false); // still stop loading1
        return;
      }

      try {
        const transformedVideos = await fetchAndTransformVideos(token, 1, 1, longVideoOnly ? "long" : "short");

        console.table(transformedVideos.map(video => ({
          id: video._id,
          Description: video.description,
          URL: video.videoUrl
        }))) // Log the transformed videos for debugging
        


        setVideos(transformedVideos);
        setOffset(transformedVideos.length);

        const episodeMap: Record<string, number> = {};
        transformedVideos.forEach((v) => {
          episodeMap[v._id] = v.episodes?.[0]?.id ?? 1;
        });
        setCurrentEpisodeMap(episodeMap);

        const followingMap = await getFollowingMap(user?.id || "", transformedVideos);
        setFollowingMap((prev) => ({ ...prev, ...followingMap }));
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setInitialLoading(false); // ✅ stop loading regardless
      }
    };

    setVideos([]);
    setOffset(0);
    setInitialLoading(true); // ✅ start loading
    fetchVideos();
  }, [token, user?.id, longVideoOnly]);

  const filteredVideos = videos
  const handleVideoAction = async (action: string, videoId: string) => {
    if (!token) {
      console.error("No authentication token found")
      return
    }

if (action === "like") {
  try {
    console.log("Sending like for video:", videoId, longVideoOnly ? "long" : "short");

    const data = await toggleLike(token, videoId, longVideoOnly ? "long" : "short");

    console.log(data);
    
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video._id === videoId
          ? {
              ...video,
              likes: data.likes,
              isLiked: data.isLiked,
            }
          : video
      )
    );
    console.log(videos.map(video =>
        video._id === videoId
          ? {
              ...video,
              likes: data.likes,
              isLiked: true,
            }
          : video
      ))
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

  // HandleFullscreen functionality to toggle fullscreen mode
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
    const refsSnapshot = [...videoRefs.current]; // take snapshot once

    const observer = new IntersectionObserver(intersectionObserverCallback, {
      threshold: 0.5, // Trigger when 50% of the video is visible
    })

    refsSnapshot.forEach((ref) => {
      if (ref.element) {
        observer.observe(ref.element);
      }
    });

    return () => {
      refsSnapshot.forEach((ref) => {
        if (ref.element) {
          observer.unobserve(ref.element)
        }
      })
      observer.disconnect()
    }
  }, [filteredVideos, intersectionObserverCallback]) // Re-run if filteredVideos change


  const handleShare = async(platform: string, videoId: string) => {
    if (!token) {
      console.error("No authentication token found")
      return
    }
    const videoUrl = `https://strmly.com/video/${videoId}`
    const shareText = "Check out this video on Strmly!"

    const data = await AddShare(token, videoId, longVideoOnly ? "long" : "short");
    console.log(data)

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

  const copyLink = async (videoId: string) => {
  if (!token) {
      console.error("No authentication token found")
      return
    }
    const data = await AddShare(token, videoId, longVideoOnly ? "long" : "short");
    const videoUrl = `https://strmly.com/video/${videoId}`
    navigator.clipboard.writeText(videoUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
  }

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



  //Click to open and close comments section,share and description menus.
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

  const DEFAULT_WORD_LIMIT = 15;

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        <Loader2Icon className="ml-2 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Increased padding-bottom to account for mobile nav */}
      <div className={`h-screen scrollbar-hide overflow-auto snap-y snap-mandatory ${isFullscreen ? "fullscreen-video" : ""} pb-16`}>

        {filteredVideos.map((video: Video, index) => (
          <div key={video._id} className="h-screen snap-start relative bg-black" ref={index === filteredVideos.length - 1 ? loadMoreRef : null}>
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
              {/* Play/Pause overlay buttons */}
              {!playingStates[video._id] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                </div>
              )}
            </div>

            {/* Right Side Actions - YouTube Shorts style */}
            <div className="video-actions flex flex-col items-center justify-end h-full py-4 space-y-0 mb-8">
              <div className="flex flex-col items-center">
                <Button
                  onClick={() => handleVideoAction("like", video._id)}
                  className={`bg-transparent text-white rounded-full hover:bg-transparent p-1 shadow-none`}
                >
                  {video.isLiked ? <img alt="icon" src='./assets/SidebarIcons/Like.svg' /> : <img alt="icon" src='./assets/SidebarIcons/UnLike.svg' />}
                </Button>
                <span className="text-white text-xs font-medium mt-1">
                  {video.likes > 1000 ? `${(video.likes / 1000).toFixed(0)}K` : video.likes}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <Button
                  onClick={() => handleVideoAction("comment", video._id)}
                  className="bg-transparent text-white hover:text-primary rounded-full hover:bg-transparent p-1 shadow-none"
                >
                  <img alt="icon" src='./assets/SidebarIcons/Comments.svg' />

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
                  className="bg-transparent text-white hover:text-primary rounded-full hover:bg-transparent p-1 shadow-none"
                >
                  <img alt="icon" src='./assets/SidebarIcons/Share.svg' />
                </Button>
                <span className="text-white text-xs font-medium mt-1">{video.shares}</span>
              </div>

              <div className="flex flex-col items-center">
                <Button
                  onClick={() => handleVideoAction("save", video._id)}
                  className="bg-transparent text-white hover:text-primary rounded-full hover:bg-transparent p-1 shadow-none"
                >
                  <img alt="icon" src='./assets/SidebarIcons/Rupee.svg' />
                </Button>
                <span className="text-white text-xs font-medium mt-1 shadow-none">
                  {video.earnings > 1000 ? `${(video.earnings / 1000).toFixed(1)}K` : video.earnings}
                </span>
              </div>

              {/* More Menu */}
              <div className="flex flex-col items-center">
                <Button
                  onClick={() => handleVideoAction("more", video._id)}
                  className="bg-transparent text-white hover:text-primary rounded-full hover:bg-transparent p-1 shadow-none"
                >
                  <img alt="icon" src='./assets/SidebarIcons/More.svg' />
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
                      <Badge variant="secondary" className="bg-transparent text-white text-[20px] flex gap-3 font-poppins">
                        <div className="flex">
                          <span className="text-[#F1C40F]">#</span>{video.community}
                        </div><img alt="icon" src='/assets/MiscIcons/FollowButton.svg' />
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

                  {longVideoOnly && video.episodes && video.episodes.length > 0 && (
                    <>
                      <div className="w-full font-poppins">

                        {/* Top Row: Avatar + Name + Follow */}
                        <div className="flex gap-3 mt-1 w-full px-1 items-center pb-1">
                          {/* Avatar */}
                          <div className="relative">
                          <a href={`./profile/${video.user?.id}`} className="flex items-center">
                            <Avatar className="w-9 h-9">
                              <AvatarImage src={video.user?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{video.user?.name[0]}</AvatarFallback>
                            </Avatar>
                          </a>
                          </div>

                          {/* Name + Follow */}
                          <div className="flex flex-col flex-1 w-full">
                            <div className="flex items-center gap-2">
                              <a href={`./profile/${video.user?.id}`}>
                                <h3 className="text-white text-[20px]">{video.user?.name}</h3>
                              </a>{user ?
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFollow(video.user?.id || "", user)}
                                className="text-white border border-white rounded-half px-2 py-0.5 text-[16px] font-medium hover:bg-white/10 h-auto min-h-0"
                              >
                                Follow
                              </Button> : <p>Login To follow</p>}
                            </div>
                          </div>
                        </div>
                        {/* Bottom Row: Title + Ep Dropdown + Paid */}
                        <div className="flex items-center justify-between px-1">
                          {/* Leftmost Title + Ep Dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-white uppercase tracking-wider text-[15px]">
                              {video.title.substring(0, 20)}{video.title.length > 20 ? "..." : ""}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white border border-white rounded-full px-2 py-0 text-xs font-medium hover:bg-white/10 h-auto min-h-0"
                                >
                                  Ep : {currentEpisodeMap[video._id] || 1}
                                  <ChevronDown size={12} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="top" className="w-32">
                                {video.episodes?.map((episode) => (
                                  <DropdownMenuItem
                                    key={episode.id}
                                    className="flex justify-between cursor-pointer"
                                    onClick={() => {
                                      if (currentEpisodeMap[video._id] === episode.id) {
                                        setCurrentEpisodeMap((prev) => ({
                                          ...prev,
                                          [video._id]: episode.id,
                                        }));
                                      }
                                    }}
                                  >
                                    <span>Episode : {episode.id}</span>
                                    <span>
                                      {currentEpisodeMap[video._id] === episode.id ? (
                                        <img alt="icon" src="./assets/MiscIcons/TickMark.svg" className="w-5 h-5" />
                                      ) : (
                                        ""
                                      )}
                                    </span>
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

                    </>
                  )}
                  {longVideoOnly && !(video.episodes ? video.episodes.length > 0 : false) && (
                    <>
                      <div className="w-full font-poppins">

                        {/* Top Row: Avatar + Name + Follow */}
                        <div className="flex gap-3 mt-1 w-full px-1 items-center pb-1">
                          {/* Avatar */}
                          <div className="relative">
                          <a href={`./profile/${video.user?.id}`} className="flex items-center">
                            <Avatar className="w-9 h-9">
                              <AvatarImage src={video.user?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{video.user?.name[0]}</AvatarFallback>
                            </Avatar>
                          </a>
                          </div>

                          {/* Name + Follow */}
                          <div className="flex flex-col flex-1 w-full">
                            <div className="flex items-center gap-2">
                              <a  className="flex items-center" href={`./profile/${video.user?.id}`}>
                                <h3 className="text-white text-[20px]">{video.user?.name}</h3>
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white border border-white rounded-half px-2 py-0.5 text-[16px] font-medium hover:bg-white/10 h-auto min-h-0"
                              >
                                Follow
                              </Button>
                            </div>
                          </div>
                        </div>
                        {/* Bottom Row: Title + Ep Dropdown + Paid */}
                        <div className="flex items-center justify-between px-1">
                          {/* Leftmost Title + Ep Dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-white text-[15px] uppercase tracking-wider">
                              {video.title.substring(0, 20)}{video.title.length > 20 ? "..." : ""}
                            </span>
                          </div>

                          {/* Right: Paid Badge */}
                          {video.type === "Paid" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button onClick={() => setShowPaidMenu(!showPaidMenu)}
                                variant="ghost"
                                size="sm"
                                className="text-[#F1C40F] border border-white rounded-half px-2 py-0.5 text-[16px] font-medium hover:bg-white/10 h-auto min-h-0"
                              >
                                Paid
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="top" className="w-95 mr-4 bg-transparent border-none rounded-[16px] p-0">
                                <DropdownMenuItem
                                  className="flex justify-between cursor-pointer font-poppins text-[18px] bg-[#222222] p-2"
                                  onClick={() => { /* Add code here */ }}
                                >
                                  <span>Full Series</span>
                                  <span>₹29</span>
                                </DropdownMenuItem>
                                <div className="w-full h-[1px] bg-white opacity-25"></div>
                                <DropdownMenuItem
                                  className="flex justify-between cursor-pointer font-poppins text-[18px] bg-[#222222] p-2"
                                  onClick={() => { /* Add code here */ }}
                                >
                                  <span>Creator Pass</span>
                                  <span>₹99/Month</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {(!longVideoOnly) && (
                    <>
                      <div className="w-full font-poppins">
                        {/* Top Row: Avatar + Name + Follow */}
                        <div className="flex gap-3 mt-1 w-full px-1 items-center pb-1">
                          {/* Avatar */}
                          <div className="relative">
                          <a href={`./profile/${video.user?.id}`} className="flex items-center">
                            <Avatar className="w-9 h-9">
                              <AvatarImage src={video.user?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{video.user?.name[0]}</AvatarFallback>
                            </Avatar>
                          </a>
                          </div>

                          {/* Name + Follow */}
                          <div className="flex flex-col flex-1 w-full">
                            <div className="flex items-center gap-2">
                              <a  className="flex items-center" href={`./profile/${video.user?.id}`}>
                                <h3 className="text-white text-[20px]">{video.user?.name}</h3>
                              </a>
                              {user ? <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFollow(video.user?.id || "", user)}
                                className="text-white border border-white rounded-half px-2 py-0.5 text-[16px] font-medium hover:bg-white/10 h-auto min-h-0"
                              >
                                Follow
                              </Button> : <p>Login To follow</p>}
                            </div>
                          </div>
                        </div>
                        {/* Bottom Row: Title + Ep Dropdown + Paid */}
                        <div className="flex items-center justify-between px-1">
                          {/* Leftmost Title + Ep Dropdown */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-white text-[15px] uppercase tracking-wider">
                              {video.title.substring(0, 35)}{video.title.length > 40 ? "..." : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>


              {/*<div className="flex items-center space-x-2 mb-1">

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
              </div>*/}

              <div className="mb-1 text-left flex justify-between" ref={descriptionRef}>
                {/* Show more button if the number of words exceeds the actual limit*/}
                {video.description && (
                  <button
                    onClick={() => toggleFullDescription(video._id)}
                    className="text-xs text-white/80 hover:text-white mt-1 w-full pr-1">
                    <div className={`relative overflow-hidden ${!showFullDescriptionMap[video._id] ? 'h-auto max-h-[2rem]' : ''}`}>
                      <p
                        className={`text-white text-[13px] text-left pb-1 leading-tight ${!showFullDescriptionMap[video._id] ? 'fade-text' : ''
                          }`}
                      >
                        {showFullDescriptionMap[video._id]
                          ? video.description
                          : truncateWords(video.description, DEFAULT_WORD_LIMIT)}
                      </p>
                    </div>

                  </button>

                )}
                {/* Fullscreen button for long videos */}
                {longVideoOnly && (
                  <div className="flex flex-col items-right mt-auto">
                    <Button
                      onClick={handleFullscreen}
                      className="bg-transparent text-white hover:text-primary rounded-full p-1"
                    >
                      <img alt="icon" src='./assets/MiscIcons/Fullscreen.svg' className="w-4 h-4" />
                    </Button>
                  </div>)}
              </div>

              {/* Tags */}
              {/*video.tags && video.tags.length > 0 && (
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
              )*/}
            </div>
          </div>
        ))}

      </div>


      {/* Comments Section */}
      <div ref={commentsRef}>
        <CommentsSection isOpen={showComments} onClose={() => setShowComments(false)} videoId={selectedVideoId} longVideosOnly={longVideoOnly}/>
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
      {token? <VideoMoreMenu isOpen={showMoreMenu} onClose={() => setShowMoreMenu(false)} videoId={selectedVideoId} longVideosOnly={longVideoOnly} token={token} setVideoSpeed={setVideoSpeed} videoRefs={{
        current: Object.fromEntries(
          videoRefs.current.map(({ id, element }) => [id, element])
        ),
      }} /> : null}
    </>
  )
}


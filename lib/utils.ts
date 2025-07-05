import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Video } from "@/types/VideoFeed"
import { api } from "./api"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//limit:Maximum number of videos to fetch
//page:Page number for pagination 
//videoType:Type of videos to fetch (short or long)
//token:Authentication token for the API

export const fetchAndTransformVideos = async (token: string, page: number, limit: number, videoType: string ): Promise<Video[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const response = await fetch(`${API_URL}/api/videos`, {
  method: "POST",
  credentials: "include",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: videoType,
    page: page,
    limit: limit,
  }),
})

  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const transformedVideos: Video[] = data.map((video: Video) => ({
    _id: video._id,
    title: video.title || "Untitled Video",
    description: video.description || "",
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl || "",
    type: video.type,
    userid : video.userid, 
    user: {
      id: video.user.id,
      name: video.user?.name || "Anonymous",
      avatar: video.user?.avatar || "/placeholder.svg",
    },
    likes: video.likes || 0,
    comments: video.comments || 0,
    shares: video.shares || 0,
    views: video.views || 0,
    earnings: video.earnings || 0,
    isLiked: video.isLiked || false,
    tags: video.tags || [],
    createdAt: video.createdAt,
    community: video.community || null,
    series: video.series || null,
    episodes: video.episodes || [],
  }))

  return transformedVideos
}


export const getFollowingMap = async (
  userId: string,
  videos: Video[]
): Promise<Record<string, boolean>> => {
  const statuses = await Promise.all(
    videos.map(async (video) => {
      if (video.user.id === userId) return { id: video.user.id, isFollowing: false }
      const following = await api.isFollowing(userId, video.user.id)
      return { id: video.user.id, isFollowing: following }
    })
  )

  return Object.fromEntries(statuses.map((s) => [s.id, s.isFollowing]))
}

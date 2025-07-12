import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Video } from "@/types/VideoFeed"
import { api } from "./api"
import dotenv from "dotenv"
import { Notification } from "@/types/Notification"
import { User } from "@/types/User"
import { getFollowStatus } from "@/components/api/FollowUser"
dotenv.config()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//limit:Maximum number of videos to fetch
//page:Page number for pagination 
//videoType:Type of videos to fetch (short or long)
//token:Authentication token for the API

export const fetchAndTransformVideos = async (token: string, page: number, limit: number, videoType: string, userId:string): Promise<Video[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  
  const response = await fetch(`${API_URL}/api/v1/videos/trending?page=${page}&limit=${limit}&type=${videoType}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  })

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Unauthorized access. Please log in again.")
    }
    throw new Error(`Failed to load Videos: ${response.status} ${response.statusText}`)
  }

  try {
    const data = await response.json();
    console.log("Fetched raw data:", data);
    
    const transformedVideos: Video[] = data.data.map((video: any) => {
      const likedBy: string[] = video.liked_by || []
      console.log(likedBy)
        return {
        _id: video._id,
        title: video.name || "Untitled Video",
        description: video.description || "",
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl || "",
        type: video.type || "Free",
        userid: video.created_by?._id,
        user: {
          id: video.created_by?._id,
          name: video.created_by?.username || "Anonymous",
          avatar: video.created_by?.profilePicture || "/placeholder.svg"
        },
        likes: video.likes || 0,
        comments: video.comments?.length || 0,
        shares: video.shares || 0,
        views: video.views || 0,
        earnings: video.earned_till_date || 0,
        isLiked: Array.isArray(video.liked_by) ? video.liked_by.includes(userId) : false,
        tags: [video.genre, video.language].filter(Boolean),
        createdAt: video.createdAt,
        community: null,
        series: video.series || null,
        episodes: []
      }
    });

    return transformedVideos;

  }
  catch (error) {
    console.error("Error parsing JSON response:", error);
    throw new Error("Failed to parse video data");

  }
}


export const getFollowingMap = async (
  userId: string,
  videos: Video[]
): Promise<Record<string, boolean>> => {
  const statuses = await Promise.all(
    videos.map(async (video) => {
      if (video.user.id === userId) return { id: video.user.id, isFollowing: false }
      const following = await getFollowStatus(userId, video.user.id)
      return { id: video.user.id, isFollowing: following.isFollowing }
    })
  )

  return Object.fromEntries(statuses.map((s) => [s.id, s.isFollowing]))
}

export function useVideoActions(
  setFollowingMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setShowFullDescriptionMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) {
  const handleFollow = async (targetUserId: string, user:User) => {
    try {
      const result = await api.followUser(targetUserId, user);
      console.log("Follow result:", result);
      setFollowingMap(prev => ({
        ...prev,
        [targetUserId]: result.following
      }));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (targetUserId: string, user:User) => {
    try {
      const result = await api.unfollowUser(targetUserId, user);
      console.log("Unfollow result:", result);
      setFollowingMap(prev => ({
        ...prev,
        [targetUserId]: result.un
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const toggleFullDescription = (videoId: string) => {
    setShowFullDescriptionMap(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  return { handleFollow,handleUnfollow, toggleFullDescription };
}


export const fetchAndTransformNotifications = async (token: string, activeTab: string): Promise<Notification[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const response = await fetch(`${API_URL}/api/v1/user/notifications`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      { 
        "group":activeTab == "revenue" ? "revenue" : "non-revenue", 
      })
  })

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Unauthorized access. Please log in again.")
    }
    throw new Error(`Failed to load notifications: ${response.status} ${response.statusText}`)
  }

  try {
    const data = await response.json()
    console.log("Fetched notification:")
    console.table(data.notifications)

    const transformedNotifications: Notification[] = data.notifications.map((notification: any) => ({
      _id: notification._id,
      content: notification.message || "",
      timestamp: notification.createdAt,
      read: notification.isRead || false,
      avatar: notification.profilePicture || "/placeholder.svg",
    }))

    return transformedNotifications
  } catch (error) {
    console.error("Error parsing JSON response:", error)
    throw new Error("Failed to parse notification data")
  }
}

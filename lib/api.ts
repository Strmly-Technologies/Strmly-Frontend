import { useAuthStore } from "@/store/useAuthStore"
import { User } from "@/types/User"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const api = {
  // User profile
  async getUserProfile() {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Failed to fetch user profile")
    return response.json()
  },

  async getUserByUsername(username: string) {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/api/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error("Failed to fetch user")
    return response.json()
  },

  async updateProfile(data: any) {
    const token = useAuthStore.getState().token
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string)
      }
    })

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!response.ok) throw new Error("Failed to update profile")
    return response.json()
  },

  // Follow operations
  async followUser(userId: string, user:User) {
    const token = useAuthStore.getState().token
    console.log("Following user:", userId, user)
    const response = await fetch(`${API_URL}/api/v1/user/follow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'followUserId':user.id,
        user: {
          id: userId
        },
      }),
    })
    if (!response.ok) throw new Error("Failed to follow user")
    return response.json()
  },

    // UnFollow operations
  async unfollowUser(userId: string, user:User) {
    const token = useAuthStore.getState().token
    console.log("Unfollowing user:", userId, user)
    const response = await fetch(`${API_URL}/api/v1/user/unfollow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'followUserId':user.id,
        user: {
          id: userId
        },
      }),
    })
    if (!response.ok) throw new Error("Failed to follow user")
    return response.json()
  },


  async getFollowers(userId: string, page = 1, limit = 20) {
    const token = useAuthStore.getState().token
    const response = await fetch(
      `${API_URL}/api/users/${userId}/followers?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!response.ok) throw new Error("Failed to fetch followers")
    return response.json()
  },

  async getFollowing(userId: string, page = 1, limit = 20) {
    const token = useAuthStore.getState().token
    const response = await fetch(
      `${API_URL}/api/users/${userId}/following?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!response.ok) throw new Error("Failed to fetch following")
    return response.json()
  },

  async isFollowing(userId: string, targetUserId: string) {
    const token = useAuthStore.getState().token
    const response = await fetch(
      `${API_URL}/api/v1/user/following`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, targetUserId }),
      }
    )
    if (!response.ok) throw new Error("Failed to check following status")
    return response.json()
  },

  // User videos
  async getUserVideos(userId: string, page = 1, limit = 20) {
    const token = useAuthStore.getState().token
    const response = await fetch(
      `${API_URL}/api/users/${userId}/videos?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!response.ok) throw new Error("Failed to fetch user videos")
    return response.json()
  },
} 
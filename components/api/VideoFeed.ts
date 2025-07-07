// utils/api.js

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchVideos = async (token : string) => {
  try {
    const response = await fetch(`${API_URL}/api/videos`, {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch videos")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching videos:", error)
    throw error
  }
}

export const toggleLike = async (token : string, videoId : string) => {
  try {
    const response = await fetch(`${API_URL}/api/videos/${videoId}/like`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to toggle like")
    }

    return await response.json() // { liked: true/false }
  } catch (error) {
    console.error("Error toggling like:", error)
    throw error
  }
}

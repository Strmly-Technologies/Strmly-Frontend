// utils/api.js

const API_URL = process.env.BACKEND_URL

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

export const toggleLike = async (token: string, videoId: string, videoType: string) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/interaction/like`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId, videoType }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle like");
    }
    return await response.json(); // { liked: true/false }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

export const AddShare = async (token: string, videoId: string, videoType: string) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/interaction/share`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId, videoType }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle dislike");
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error sharing:", error);
    throw error;
  }
}
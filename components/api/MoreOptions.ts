export const SaveVideo = async ({ token, commentId, videoId, videoType }: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interaction/save`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
        commentId,
        videoId,
        videoType
    })
  });

  if (!res.ok) throw new Error("Failed to save video");
  return await res.json();
};

export const SaveStatus = async ({ token, commentId, videoId, videoType }: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interaction/saved/status`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "videoId": videoId,
        "videoType": videoType
    })
  });

  if (!res.ok){
    const errorData = await res.json();
    console.error("Save status error:", errorData);
    throw new Error("Failed to check save status");
  } 
  const data = await res.json();
  console.log("Save status response:", data);
  return data;
};
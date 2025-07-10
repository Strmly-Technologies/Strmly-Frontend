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
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFollowStatus(targetUserId: string, token: string) {
  const res = await fetch(`${API_URL}/api/v1/user/following`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", 
    },body: JSON.stringify({
      targetUserId,
    })
  });
  if (!res.ok) throw new Error("Failed to get follow status");

  const data = await res.json(); // Expected: { following: [array of users] }

  const isFollowing = data.following.some((user: any) => user._id === targetUserId);

  return { isFollowing };
}

export async function followUser(targetUserId: string, user: any, token: string) {
  const res = await fetch(`${API_URL}/api/v1/user/follow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      followUserId: targetUserId,
      user: {
        id: user.id,
      },
    }),
  });

  if (!res.ok) throw new Error("Follow request failed");
  return await res.json();
}

export async function unfollowUser(targetUserId: string, user: any, token: string) {
  const res = await fetch(`${API_URL}/api/v1/users/unfollow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      followUserId: targetUserId,
      user: {
        id: user.id,
      },
    }),
  });

  if (!res.ok) throw new Error("Unfollow request failed");
  return await res.json();
}
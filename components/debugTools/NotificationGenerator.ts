import { Notification } from "@/types/Notification"

const sampleContents = [
  "Someone liked your comment",
  "New reply on your video",
  "You got a new follower!",
  "Your comment received a donation",
  "Someone mentioned you in a comment"
]

export const mockNotifications: Notification[] = Array.from({ length: 50 }, (_, i) => {
  const randomContent = sampleContents[Math.floor(Math.random() * sampleContents.length)]
  const randomVideoId = (Math.floor(Math.random() * 4) + 1).toString()

  return {
    _id: `${Date.now()}-${i}`, // unique ID
    group: i % 2 === 0 ? "revenue" : "non-revenue",
    type: i % 3 === 0 ? "gifting" : "video upvote",
    content: randomContent,
    videoId: randomVideoId,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(), // within 24 hrs
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${Math.floor(Math.random() * 50)}`,
    read: Math.random() > 0.5,
    URL: i % 2 === 0 ? `/api/v1/videos/${randomVideoId}` : `/api/v1/users/user${Math.floor(Math.random() * 10)}`,
  }
})
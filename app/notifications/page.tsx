"use client"

import MobileBottomNav from "@/components/MobileBottomNav"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"


const sampleContents = [
  "Someone liked your comment",
  "New reply on your video",
  "You got a new follower!",
  "Your comment received a donation",
  "Someone mentioned you in a comment"
]

const mockNotifications: Notification[] = Array.from({ length: 50 }, (_, i) => {
  const randomContent = sampleContents[Math.floor(Math.random() * sampleContents.length)]
  const randomVideoId = (Math.floor(Math.random() * 4) + 1).toString()

  return {
    _id: `${Date.now()}-${i}`, // unique ID
    content: randomContent,
    videoId: randomVideoId,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(), // within 24 hrs
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${Math.floor(Math.random() * 50)}`,
    read: Math.random() > 0.5,
  }
})

interface Notification {
  _id: string
  content: string
  videoId: string
  timestamp: string
  avatar: string
  read: boolean
}

export default function LongVideosPage() {

  return (
    <div className="h-screen">
      <MobileBottomNav progress={0} />
      <div className="flex items-center justify-center p-3 lg:p-4 flex-col bg-[#1A1A1A]">
        <div className="w-20 h-1 bg-white/80 rounded-full mx-auto my-2 hover:bg-white/60 transition-colors" />
        <h3 className="text-base text-[24px] font-semibold ">Notifications</h3>
      </div>
      {
        mockNotifications.map((Notification) => (<div key={Notification._id} className="p-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] transition-colors flex items-start space-x-3 shadow-sm mt-1">
  <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
    <AvatarImage  className="rounded-full" src={Notification.avatar || "/placeholder.svg"} />
    <AvatarFallback className="text-xs">U</AvatarFallback>
  </Avatar><div className="flex-1 min-w-0 relative"> {/* Make this relative for positioning */}
  {/* Red dot in top-right if notification is unread */}
 {Notification.read ? '': <div className="absolute top-0 right-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-red-500 rounded-full"/>}

  {/* Date & other content */}
  <div className="flex items-center justify-between mb-1">
    <span className="text-xs text-muted-foreground">
      {new Date(Notification.timestamp).toLocaleDateString()}
    </span>
  </div>
    <p className="text-sm lg:text-base text-gray-300 leading-relaxed">
      {Notification.content}
    </p>
  </div>
</div>

        ))
      }
    </div>
  )
}

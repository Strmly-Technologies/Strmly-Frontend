"use client"

import Sidebar from "@/components/Sidebar"
import TopHeader from "@/components/TopHeader"
import VideoFeed from "@/components/VideoFeed"

export default function LongVideosPage() {
  return (
    <div className="h-screen">
      <TopHeader/>
      <VideoFeed longVideoOnly={true} />
    </div>
  )
}

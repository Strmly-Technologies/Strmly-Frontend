"use client"

import MobileBottomNav from "@/components/MobileBottomNav"
import TopHeader from "@/components/TopHeader"
import VideoFeed from "@/components/VideoFeed"

export default function LongVideosPage() {
  return (
    <div className="h-screen">
      <MobileBottomNav/>
      <TopHeader/>
      <VideoFeed longVideoOnly={true} />
    </div>
  )
}

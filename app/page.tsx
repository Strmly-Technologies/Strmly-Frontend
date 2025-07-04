"use client"

import { useAuthStore } from "@/store/useAuthStore"
import VideoFeed from "@/components/VideoFeed"
import MobileBottomNav from "@/components/MobileBottomNav"
import TopHeader from "@/components/TopHeader"
import { fa } from "zod/v4/locales"
import { useState } from "react"

export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const [videoProgress, setProgress] = useState(0);
  const [Muted, setIsMuted] = useState(true);
  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="h-screen">
        <MobileBottomNav progress={videoProgress}/>
        <TopHeader Muted={Muted} setMuted={setIsMuted}/>
        <VideoFeed longVideoOnly={false} ChangeVideoProgress={setProgress} Muted={Muted}/>
      </div>

    
  )
}

"use client"

import { useAuthStore } from "@/store/useAuthStore"
import VideoFeed from "@/components/VideoFeed"
import MobileBottomNav from "@/components/MobileBottomNav"
import TopHeader from "@/components/TopHeader"
import { fa } from "zod/v4/locales"

export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="h-screen">
        <MobileBottomNav/>
        <TopHeader/>
        <VideoFeed longVideoOnly={false} />
      </div>

    
  )
}

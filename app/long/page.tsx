"use client"

import MobileBottomNav from "@/components/MobileBottomNav"
import TopHeader from "@/components/TopHeader"
import VideoFeed from "@/components/VideoFeed"
import { useState } from "react";

export default function LongVideosPage() {

  const [videoProgress, setProgress] = useState(0);
  const [Muted, setIsMuted] = useState(true);

  return (
    <div className="h-screen">
      <MobileBottomNav progress={videoProgress}/>
      <TopHeader Muted={Muted} setMuted={setIsMuted}/>
      <VideoFeed longVideoOnly={true} ChangeVideoProgress={setProgress} Muted={Muted}/>
    </div>
  )
}

"use client"

import { Dispatch, SetStateAction } from "react";
import { Wallet, Bell, VolumeOff, Volume2Icon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface HeaderProps {
  Muted:boolean
  setMuted:Dispatch<SetStateAction<boolean>>
}

export default function TopHeader({Muted,setMuted}:HeaderProps) {

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-transparent z-40 lg:ml-64">
      <div className="flex items-center justify-between p-3 lg:p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
          <Link href="/wallet">
              <img src='./assets/HeaderIcons/Wallet.svg' className="relative w-8 h-8 mt-1 lg:w-8 lg:h-8" />
          </Link>
          <button onClick={() => setMuted(!Muted)}>
            {Muted ? <VolumeOff size={28}/> : <Volume2Icon size={30}/>}
          </button>
          </div>
          <Link href='/notifications'>
          <img src='./assets/HeaderIcons/Notification.svg' className="w-7 h-7 lg:w-6 lg:h-6 mr-2 mt-1" />
            <div className="absolute -top-0 -right-0 mr-5 mt-4 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
          </Link>
            
        </div>
      </div>
    </div>
  )
}
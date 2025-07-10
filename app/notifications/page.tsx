"use client"

import { Notification } from "@/types/Notification"
import { useEffect, useState } from "react"
import MobileBottomNav from "@/components/MobileBottomNav"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { mockNotifications as debugNotifications } from "@/components/debugTools/NotificationGenerator"
import { fetchAndTransformNotifications } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"

const mockNotifications = debugNotifications

export default function LongVideosPage() {
  const [activeTab, setActiveTab] = useState("Non Revenue")
  const tabs = [
    { id: "Non Revenue", label: "Non Revenue" },
    { id: "Revenue", label: "Revenue" },
  ];
  const token = useAuthStore((state) => state.token)
  const [data, setData] = useState<Notification[]>([])
  useEffect(() => {
    const loadNotifications = async () => {
      if (!token) {
        console.warn("No token found, using mock notifications")
        setData(mockNotifications)
        return
      }

      try {
        const notifications = await fetchAndTransformNotifications(token, activeTab)
        setData(notifications)
      } catch (error) {
        console.error("Failed to load notifications", error)
      }
    }

    loadNotifications()
  }, [token,activeTab])

  return (
    <div className="h-screen">
      <MobileBottomNav progress={0} />
      <div className="flex items-center justify-center p-3 lg:p-4 flex-col bg-[#1A1A1A]">
        <h3 className="text-base text-[24px] font-semibold">Notifications</h3>
      </div>
      {/* Tabs */}
      <div className="bg-black min-h-screen text-white pl-3">
        {/* Custom Tab Buttons */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex space-x-6 mb-4 border-b border-white/10 pb-2 min-w-max justify-around p-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative text-sm font-medium transition-colors duration-200 ${activeTab === tab.id ? 'text-white' : 'text-white'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-2 left-0 w-full h-[2px] bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {
        data.map((notification: Notification) => (
          <div
            key={notification._id}
            className="p-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] transition-colors flex items-start space-x-3 shadow-sm mt-1"
          >
            <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
              <AvatarImage className="rounded-full" src={notification.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 relative">
              {!notification.read && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-[#F1C40F] rounded-full" />
              )}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm lg:text-base text-gray-300 leading-relaxed">
                {notification.content}
              </p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { icon: "/assets/NavIcons/play.svg", activeIcon:"/assets/NavIcons/play-active.svg",label: "Home", href: "/" },
    { icon: "/assets/NavIcons/longVideo.svg", activeIcon:"/assets/NavIcons/longVideo-active.svg", label: "Long", href: "/long" },
    { icon: "/assets/NavIcons/addVideo.svg", activeIcon:"/assets/NavIcons/addVideo.svg", label: "Upload", href: "/upload" },
    { icon: "/assets/NavIcons/search.svg", activeIcon:"/assets/NavIcons/search.svg", label: "Search", href: "/search" },
    { icon: "assets/NavIcons/profileIcon.svg", activeIcon:"assets/NavIcons/profileIcon.svg", label: "Profile", href: "/profile" },
  ]

  return (
    <div className="mobile-bottom-nav items-center justify-center fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-border z-50 lg:hidden">
      <div className="flex items-center justify-around w-full p-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 min-w-0 flex-1 max-w-20"
              )}
            >
              <img
                src={isActive? item.activeIcon : item.icon}
                alt={item.label}
                className={cn("w-6 h-6 mb-1", isActive && "")}
              />
              {/* <span className="text-xs font-medium truncate w-full text-center">{item.label}</span> */}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

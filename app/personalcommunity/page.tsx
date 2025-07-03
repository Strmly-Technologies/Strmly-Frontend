"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Grid,
  Video,
  Bookmark,
  MapPin,
  LinkIcon,
  Calendar,
  Users,
  BarChart3,
  Edit,
  History,
  List,
  LogOut,
  Heart,
  Eye,
  IndianRupee,
  PlayIcon,
  HeartIcon,
  BookmarkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import UserList from "@/components/UserList";
import ProfileTopbar from "../profile/_components/ProfileTopbar";

const profileData = {
  id: 1,
  name: "Tech Entrepreneurs",
  description: "A community for tech entrepreneurs to share ideas and network",
  image: "/placeholder.svg?height=60&width=60",
  banner: "/placeholder.svg?height=200&width=400",
  followers: 12500,
  creators: 12500,
  videos: 1250,
  category: "Business",
  isPrivate: false,
  isJoined: true,
  communityFee: 30,
  role: "member",
  tags: ["startup", "technology", "business"],
  owner: {
    name: "John Doe",
    avatar: "/placeholder.svg?height=32&width=32",
  },
};

export default function PersonalCommunitiesPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const { user, isLoggedIn, token, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push("/auth");
  };

  const fetchUserVideos = async () => {
    if (!userData?.id) return;
    setIsLoadingVideos(true);
    try {
      const data = await api.getUserVideos(userData.id);
      const transformedVideos = data.map((video: any) => ({
        _id: video._id,
        title: video.title,
        description: video.description || "",
        thumbnail: video.thumbnailUrl || "/placeholder.svg",
        likes: video.likesCount || 0,
        views: video.viewsCount || 0,
        createdAt: video.createdAt,
      }));
      setVideos(transformedVideos);
    } catch (err) {
      console.error("Error fetching user videos:", err);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="h-48 relative">
        <ProfileTopbar hashtag={true} name={profileData.name} handleLogout={handleLogout} />
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl px-6 -mt-20 relative">
        <div className="flex flex-col items-center md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <Avatar className="size-24 border-4 border-background">
              <AvatarImage src={profileData.image} alt={profileData.name} />
              <AvatarFallback>{profileData.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-muted-foreground">By @{profileData.owner.name}</p>
                {profileData.isPrivate && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Private
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 items-center">
          <div
            className="cursor-pointer flex flex-col gap-1 items-center hover:text-primary"
            onClick={() => setActiveTab("followers")}
          >
            {/* <span className="font-bold text-lg">{profileData.followers}</span>{" "} */}
            <span className="font-bold text-lg">3.4M</span>{" "}
            <span className="text-muted-foreground text-lg">Followers</span>
          </div>
          <div
            className="cursor-pointer flex flex-col gap-1 items-center hover:text-primary"
            onClick={() => setActiveTab("following")}
          >
            {/* <span className="font-bold text-lg">{profileData.following}</span>{" "} */}
            <span className="font-bold text-lg">102</span>{" "}
            <span className="text-muted-foreground text-lg">Community</span>
          </div>
          <div
            className="cursor-pointer flex flex-col gap-1 items-center hover:text-primary"
            onClick={() => setActiveTab("posts")}
          >
            {/* <span className="font-bold text-lg">{profileData.posts}</span>{" "} */}
            <span className="font-bold text-lg">800</span>{" "}
            <span className="text-muted-foreground text-lg">Posts</span>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-2 mt-5 md:mt-0">
          <Button className="px-4 bg-[#F1C40F] py-2 text-primary-foreground rounded-md">
            Edit Community
          </Button>
          <Button className="px-4 bg-[#F1C40F] py-2 text-primary-foreground rounded-md">
            View Analytics
          </Button>
        </div>

        {/* Bio */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-xs">{profileData.description}</p>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b">
          <div className="flex space-x-8 items-center justify-between">
            <button
              className={`pb-4 flex items-center justify-center ${
                activeTab === "posts"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              <PlayIcon className="size-7 text-black cursor-pointer"/>
            </button>
            <button
              className={`pb-4 flex items-center justify-center ${
                activeTab === "clips"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("clips")}
            >
              <Video className="size-7 text-black cursor-pointer"/>
            </button>
            <button
              className={`pb-4 flex items-center justify-center ${
                activeTab === "likes"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("likes")}
            >
              <HeartIcon className="size-7 text-black cursor-pointer"/>
            </button>
            <button
              className={`pb-4 flex items-center justify-center ${
                activeTab === "saved"
                  ? "border-b-2 border-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              <BookmarkIcon className="size-7 text-black cursor-pointer"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
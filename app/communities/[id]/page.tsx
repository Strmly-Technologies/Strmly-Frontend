"use client";

import { useEffect, useState } from "react";
import {
  Video,
  IndianRupee,
  PlayIcon,
  HeartIcon,
  BookmarkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ProfileTopbar from "@/app/profile/_components/ProfileTopbar";
import { toast } from "sonner";
import { useGenerateThumbnails } from "@/utils/useGenerateThumbnails";

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

export default function OthersCommunitiesPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [communityData, setCommunityData] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const { user, isLoggedIn, token, logout } = useAuthStore();
  const router = useRouter();

  const params = useParams();

  const id = params?.id;

  const thumbnails = useGenerateThumbnails(
    videos.map((video) => ({
      id: video._id,
      url: video.videoUrl,
    }))
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchUserVideos = async () => {
      // if (!communityData.id) return;
      setIsLoadingVideos(true);
      try {
        const params = new URLSearchParams();
        params.append("type", activeTab);
        console.log(activeTab);

        const response = await fetch(
          `/api/communities/video-by-id?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user profile");
        }

        console.log("videos");
        console.log(data);

        // const transformedVideos = data.map((video: any) => ({
        //   _id: video._id,
        //   title: video.title,
        //   description: video.description || "",
        //   thumbnail: video.thumbnailUrl || "/placeholder.svg",
        //   likes: video.likesCount || 0,
        //   views: video.viewsCount || 0,
        //   createdAt: video.createdAt,
        // }));
        // setVideos(transformedVideos);
      } catch (err) {
        console.error("Error fetching user videos:", err);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    if (token) {
      fetchUserVideos();
    }
  }, [isLoggedIn, activeTab, router, token]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Login API call
        const response = await fetch(`/api/communities/by-id?id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user profile");
        }

        console.log(data);
        setCommunityData(data);
      } catch (error) {
        console.log(error);
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [isLoggedIn, router, id, token]);

  return (
    <div className="min-h-screen bg-background px-6">
      {/* Cover Image */}

      {!isLoading && (
        <div className="h-48 relative">
          <ProfileTopbar hashtag={true} name={communityData?.name} />
        </div>
      )}

      {isLoading ? (
        <div className="w-full h-96 flex items-center justify-center -mt-20 relative">
          <div className="w-8 h-8 border-4 border-[#F1C40F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-4xl -mt-20 relative">
          <div className="flex flex-col items-center md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex flex-col items-center w-full">
              <Avatar className="size-24 border-4 border-background">
                <AvatarImage
                  src={communityData?.profile_photo || profileData.image}
                  alt={"community-icon"}
                />
                <AvatarFallback>
                  {communityData?.name[0] || profileData.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center w-full">
                <p className="text-muted-foreground">
                  By @
                  {communityData?.founder?.username || profileData.owner.name}
                </p>
                {profileData.isPrivate && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Private
                  </span>
                )}
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
              <span className="font-bold text-lg">
                {communityData?.followers?.length}
              </span>{" "}
              <span className="text-muted-foreground text-md">Followers</span>
            </div>
            <div
              className="cursor-pointer flex flex-col gap-1 items-center hover:text-primary"
              onClick={() => setActiveTab("following")}
            >
              {/* <span className="font-bold text-lg">{profileData.following}</span>{" "} */}
              <span className="font-bold text-lg">
                {communityData?.creators.length}
              </span>{" "}
              <span className="text-muted-foreground text-md">Creators</span>
            </div>
            <div
              className="cursor-pointer flex flex-col gap-1 items-center hover:text-primary"
              onClick={() => setActiveTab("posts")}
            >
              {/* <span className="font-bold text-lg">{profileData.posts}</span>{" "} */}
              <span className="font-bold text-lg">
                {communityData?.total_uploads}
              </span>{" "}
              <span className="text-muted-foreground text-md">Videos</span>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full items-center justify-center gap-2 mt-5 md:mt-0">
            <Button
              variant={"outline"}
              className="px-4 rounded-md bg-transparent border-gray-400"
            >
              Follow
            </Button>

            <Button
              variant={"outline"}
              className="px-4 rounded-md bg-transparent border-gray-400"
            >
              {communityData?.community_fee_type === "free" ? (
                "Free"
              ) : (
                <>
                  Join at <IndianRupee className="size-5" />
                  {communityData?.community_fee_amount}/month
                </>
              )}
            </Button>
          </div>

          {/* Bio */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <p className="text-muted-foreground text-xs">
              {communityData?.bio}
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b">
            <div className="flex space-x-8 items-center justify-between">
              <button
                className={`pb-4 flex items-center justify-center ${
                  activeTab === "clips"
                    ? "border-b-2 border-primary font-medium"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("clips")}
              >
                <PlayIcon
                  className={`size-7 cursor-pointer ${
                    activeTab == "clips" && "fill-white"
                  }`}
                />
              </button>
              <button
                className={`pb-4 flex items-center justify-center ${
                  activeTab === "long"
                    ? "border-b-2 border-primary font-medium"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("long")}
              >
                <Video
                  className={`size-7 cursor-pointer ${
                    activeTab == "long" && "fill-white"
                  } `}
                />
              </button>
              <button
                className={`pb-4 flex items-center justify-center ${
                  activeTab === "likes"
                    ? "border-b-2 border-primary font-medium"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("likes")}
              >
                <HeartIcon
                  className={`size-7 cursor-pointer ${
                    activeTab == "likes" && "fill-white"
                  }`}
                />
              </button>
              <button
                className={`pb-4 flex items-center justify-center ${
                  activeTab === "saved"
                    ? "border-b-2 border-primary font-medium"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("saved")}
              >
                <BookmarkIcon
                  className={`size-7 cursor-pointer ${
                    activeTab == "saved" && "fill-white"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoadingVideos ? (
        <div className="w-full h-96 flex items-center justify-center -mt-20 relative">
          <div className="w-8 h-8 border-4 border-[#F1C40F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === "clips" ? (
            <div className="flex flex-col gap-2 mt-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="w-full h-[100svh] sm:h-[90vh] relative rounded-lg overflow-hidden bg-black"
                >
                  {thumbnails[video._id] ? (
                    <img
                      src={thumbnails[video._id]}
                      alt="video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      Loading...
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black"
                >
                  {thumbnails[video._id] ? (
                    <img
                      src={thumbnails[video._id]}
                      alt="video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      Loading...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

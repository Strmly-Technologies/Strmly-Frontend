"use client";

import { useState, useEffect } from "react";
import { MapPin, LinkIcon, Calendar, PlayIcon, Video, HeartIcon, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProfileTopbar from "../_components/ProfileTopbar";
import { useGenerateThumbnails } from "@/utils/useGenerateThumbnails";

const mockPosts = [
  { id: 1, image: "/placeholder.svg?height=300&width=300", type: "image" },
  { id: 2, image: "/placeholder.svg?height=300&width=300", type: "video" },
  { id: 3, image: "/placeholder.svg?height=300&width=300", type: "image" },
  { id: 4, image: "/placeholder.svg?height=300&width=300", type: "video" },
  { id: 5, image: "/placeholder.svg?height=300&width=300", type: "image" },
  { id: 6, image: "/placeholder.svg?height=300&width=300", type: "video" },
];

export default function ProfileIdPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const { user, isLoggedIn, token, logout } = useAuthStore();
  const router = useRouter();

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
      setIsLoadingVideos(true);
      try {
        const params = new URLSearchParams();
        params.append("type", activeTab);
        console.log(activeTab);

        const response = await fetch(
          `/api/user/profile/videos?${params.toString()}`,
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
  }, [isLoggedIn, router, token, activeTab]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Login API call
        const response = await fetch("/api/user/profile", {
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

        console.log(data.user);
        setUserData(data.user);
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
  }, [isLoggedIn, router, token]);

  const profileData = {
    name: userData?.name || "User",
    email: userData?.email || "",
    image:
      userData?.avatar ||
      userData?.image ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
    username: userData?.username || userData?.email?.split("@")[0] || "user",
    bio: userData?.bio || "Welcome to my profile! 👋",
    location: userData?.location || "Not specified",
    website: userData?.website || "",
    joinedDate: new Date(userData?.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    coverImage:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=200&fit=crop",
    followers: userData?.stats?.followersCount || 0,
    following: userData?.stats?.followingCount || 0,
    posts: userData?.stats?.videosCount || 0,
    isVerified: userData?.isVerified || false,
  };

  // setUserData(profileData);

  return (
    <div className="min-h-screen bg-background px-6">
      {/* Cover Image */}

      {userData && (
        <div className="h-48 relative">
          <ProfileTopbar hashtag={false} name={userData?.username} />
        </div>
      )}

      {/* Profile Info */}
      {isLoading ? (
        <div className="w-full h-96 flex items-center justify-center -mt-20 relative">
          <div className="w-8 h-8 border-4 border-[#F1C40F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-4xl -mt-28 relative">
          <div className="flex flex-col items-center md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Avatar className="size-24 border-4 border-background">
                <AvatarImage
                  src={userData?.profile_photo || profileData.image}
                  alt={"profile_photo"}
                />
                <AvatarFallback>
                  {userData?.username[0] || profileData.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-2 items-center justify-center font-poppins">
                <p className="text-muted-foreground">
                  @{userData?.username || profileData.username}
                </p>
                {(userData?.creator_profile?.verification_status !=
                  "unverified" ||
                  profileData.isVerified) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-1 items-center">
            <div
              className="cursor-pointer flex flex-col gap-1 items-center hover:text-primary"
              onClick={() => router.push("/communities?type=followers")}
            >
              {/* <span className="font-bold text-lg">{profileData.followers}</span>{" "} */}
              <span className="font-poppins text-lg">
                {userData?.followers.length}M
              </span>{" "}
              <span className="text-muted-foreground text-md">Followers</span>
            </div>
            <Button
              onClick={() => router.push("/communities")}
              className="px-4 bg-[#F1C40F] py-2 font-poppins rounded-md"
            >
              Follow
            </Button>
            <Button className="px-4 bg-[#F1C40F] font-poppins py-2 rounded-md">
              Access at ₹{userData?.creator_profile?.creator_pass_price}/m
            </Button>
          </div>

          <div className="flex flex-wrap w-full text-lg items-center font-poppins justify-center gap-2 mt-5 md:mt-0">
            <Button
              variant={"outline"}
              className="px-4 py-2 border-muted-foreground rounded-md"
            >
              #{"Edit"}
            </Button>
            <Button
              variant={"outline"}
              className="px-4 py-2 border-muted-foreground rounded-md"
            >
              #{"Fun"}
            </Button>
          </div>

          {/* Bio */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <p className="text-muted-foreground font-poppins text-center">
              {userData?.bio}
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-muted-foreground">
              {/* {profileData.location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profileData.location}
                </span>
              )} */}
              {profileData.website && (
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary flex items-center"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  {profileData.website}
                </a>
              )}
              {/* <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Joined{" "}
                {userData?.createdAt &&
                  (format(new Date(userData?.createdAt), "MMMM yyyy") ||
                    profileData.joinedDate)}
              </span> */}
            </div>
          </div>
        </div>
      )}

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
            <PlayIcon
              className={`size-7 cursor-pointer ${
                activeTab == "posts" && "fill-white"
              }`}
            />
          </button>
          <button
            className={`pb-4 flex items-center justify-center ${
              activeTab === "clips"
                ? "border-b-2 border-primary font-medium"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("clips")}
          >
            <Video
              className={`size-7 cursor-pointer ${
                activeTab == "clips" && "fill-white"
              }`}
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

      {isLoadingVideos ? (
        <div className="w-full h-96 flex items-center justify-center -mt-20 relative">
          <div className="w-8 h-8 border-4 border-[#F1C40F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === "clips" ? (
            <div className="flex flex-col gap-2">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="w-full h-[100svh] sm:h-[90vh] relative rounded-lg overflow-hidden"
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
            <div className="grid grid-cols-3 sm:grid-cols-4">
              {videos.map((video, index) => {
                const isLastInMobileRow = (index + 1) % 3 === 0; // for mobile (3 cols)
                const isLastItem = index === videos.length - 2;

                return (
                  <div
                    key={video._id}
                    className={`relative aspect-[12/16] overflow-hidden border-white 
          ${isLastInMobileRow || isLastItem ? "border-r" : ""}`}
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
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

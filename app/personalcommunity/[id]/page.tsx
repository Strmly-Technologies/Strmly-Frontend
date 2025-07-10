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
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import UserList from "@/components/UserList";
import { toast } from "sonner";
import ProfileTopbar from "@/app/profile/_components/ProfileTopbar";

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

export default function PersonalCommunitiesPage() {
    const [activeTab, setActiveTab] = useState("posts");
    const [communityData, setUserCommunityData] = useState<any>(null);
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
            setIsLoadingVideos(true);
            try {
                const searchVideo = new URLSearchParams();
                searchVideo.append("type", activeTab);
                // searchVideo.append("id", id);
                console.log(activeTab);

                const response = await fetch(
                    `/api/user/personalcommunity/videos?${searchVideo.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch user profile");
                }

                console.log("videos");
                console.log(data);

                setVideos(data.videos);

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
                const response = await fetch(
                    `/api/user/personalcommunity/profile?id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch user profile");
                }

                console.log(data)

                setUserCommunityData(data);
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
    }, [isLoggedIn, id, router, token]);

    return (
        <div className="min-h-screen px-6">
            {/* Cover Image */}
            {!isLoading && (
                <div className="h-48 relative">
                    <ProfileTopbar hashtag={true} name={communityData?.name} />
                </div>
            )}

            {/* Profile Info */}

            {isLoading ? (
                <div className="w-full h-96 flex items-center justify-center -mt-20 relative">
                    <div className="w-8 h-8 border-4 border-[#F1C40F] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="max-w-4xl -mt-20 relative">
                    <div className="flex flex-col items-center md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                        <div className="relative flex items-center flex-col">
                            <Avatar className="size-24 border-4 border-background">
                                <AvatarImage
                                    src={communityData?.profile_photo}
                                    alt={"community-icon"}
                                />
                                <AvatarFallback>{communityData?.name[0]}</AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="text-muted-foreground">
                                    By @{communityData?.founder?.username}
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
                            <span className="font-bold text-md">
                                {communityData?.creators?.length}
                            </span>{" "}
                            <span className="text-muted-foreground text-lg">Creators</span>
                        </div>
                        <div
                            className="cursor-pointer flex flex-col gap-1 items-center hover:text-primary"
                            onClick={() => setActiveTab("posts")}
                        >
                            {/* <span className="font-bold text-lg">{profileData.posts}</span>{" "} */}
                            <span className="font-bold text-md">
                                {communityData?.total_uploads}
                            </span>{" "}
                            <span className="text-muted-foreground text-lg">Videos</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 w-full items-center justify-center gap-2 mt-5 md:mt-0">
                        <Button
                            onClick={() => router.push(`/personalcommunity/edit/${id}`)}

                            className="px-4 bg-[#F1C40F] text-black rounded-md"
                        >
                            Edit Community
                        </Button>

                        <Button
                            onClick={() => router.push("/profile/dashboard")}
                            className="px-4 bg-[#F1C40F] text-black rounded-md"
                        >
                            View Analytics
                        </Button>
                    </div>

                    {/* Bio */}
                    <div className="mt-6 flex flex-col items-center justify-center">
                        <p className="text-muted-foreground text-xs">
                            {communityData?.bio}
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}

            <div className="mt-8 border-b">
                <div className="flex space-x-8 items-center justify-between">
                    <button
                        className={`pb-4 flex items-center justify-center ${activeTab === "posts"
                                ? "border-b-2 border-primary font-medium"
                                : "text-muted-foreground"
                            }`}
                        onClick={() => setActiveTab("posts")}
                    >
                        <PlayIcon
                            className={`size-7 cursor-pointer ${activeTab == "posts" && "fill-white"
                                }`}
                        />
                    </button>
                    <button
                        className={`pb-4 flex items-center justify-center ${activeTab === "clips"
                                ? "border-b-2 border-primary font-medium"
                                : "text-muted-foreground"
                            }`}
                        onClick={() => setActiveTab("clips")}
                    >
                        <Video
                            className={`size-7 cursor-pointer ${activeTab == "clips" && "fill-white"
                                }`}
                        />
                    </button>
                    <button
                        className={`pb-4 flex items-center justify-center ${activeTab === "likes"
                                ? "border-b-2 border-primary font-medium"
                                : "text-muted-foreground"
                            }`}
                        onClick={() => setActiveTab("likes")}
                    >
                        <HeartIcon
                            className={`size-7 cursor-pointer ${activeTab == "likes" && "fill-white"
                                }`}
                        />
                    </button>
                    <button
                        className={`pb-4 flex items-center justify-center ${activeTab === "saved"
                                ? "border-b-2 border-primary font-medium"
                                : "text-muted-foreground"
                            }`}
                        onClick={() => setActiveTab("saved")}
                    >
                        <BookmarkIcon
                            className={`size-7 cursor-pointer ${activeTab == "saved" && "fill-white"
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

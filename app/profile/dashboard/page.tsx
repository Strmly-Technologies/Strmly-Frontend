"use client";

import { useEffect, useState } from "react";
import { Clock, IndianRupee } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Topbar from "./_components/Topbar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const mockAnalytics = {
  totalViews: 125000,
  totalLikes: 8500,
  totalFollowers: 12500,
  totalEarnings: 2450.75,
  monthlyGrowth: {
    views: 15.2,
    likes: 8.7,
    followers: 12.3,
    earnings: 23.1,
  },
};

const mockAnalysisData = {
  totalRevenue: 125000,
  gifting: 85000,
  commentsPrice: 15000,
  contentBuy: 20000,
  creatorPass: 5000,
  trends: {
    totalRevenue: 12.5,
    gifting: 8.2,
    commentsPrice: 3.1,
    contentBuy: 5.7,
    creatorPass: 1.8,
  },
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "analysis">(
    "overview"
  );

  const [overviewData, setOverviewData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isLoggedIn, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push("/login");
      return;
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (activeTab == "analysis") {
      const fetchAnalyticsData = async () => {
        try {
          // Login API call
          const response = await fetch("/api/dashboard/Analytics", {
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
          // setAnalyticsData(data.earnings);
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
        fetchAnalyticsData();
      }
    } else {
      const fetchOverviewData = async () => {
        try {
          // Login API call
          const response = await fetch("/api/dashboard/Overview", {
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
          // setOverviewData(data.interactions);
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
        fetchOverviewData();
      }
    }
  }, [activeTab, token]);

  return (
    <div className="p-4 pb-20 md:pb-4 max-w-6xl">
      <Topbar />

      {/* Tab Navigation */}
      <div className="w-full grid grid-cols-2 border-b mt-20">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "overview"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "analysis"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("analysis")}
        >
          Analysis
        </button>
      </div>

      {isLoading ? (
        <div className="w-full h-96 flex items-center justify-center -mt-20 relative">
          <div className="w-8 h-8 border-4 border-[#F1C40F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTab === "overview" ? (
        /* Overview Content */
        <div className="border-2 flex flex-col gap-5 p-4 rounded-lg mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-2">
                  <h2 className="text-xl font-semibold">Overview</h2>
                  <h2 className="flex text-2xl items-center font-semibold">
                    <Clock className="size-4" />
                  </h2>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Select value={timeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-full border text-muted-foreground"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Views</span>
              <div className="text-md font-bold">
                {mockAnalytics.totalViews.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Likes</span>
              <div className="text-md font-bold">
                {mockAnalytics.totalLikes.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Followers</span>
              <div className="text-md font-bold">
                {mockAnalytics.totalFollowers.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Earnings</span>
              <div className="text-md font-bold">
                {mockAnalytics.totalEarnings.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Analysis Content */
        <div className="border-2 flex flex-col gap-5 p-4 rounded-lg mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold">Revenue</h2>
                  <h2 className="flex text-2xl items-center font-semibold">
                    <IndianRupee className="size-7" />
                    {mockAnalysisData.totalRevenue.toLocaleString()}
                  </h2>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Select value={timeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-full border text-muted-foreground"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-md font-medium">Gifting</span>
              <div className="flex items-center gap-1">
                <span className="text-md font-bold">
                  <IndianRupee className="inline size-4" />
                  {mockAnalysisData.gifting.toLocaleString()}
                </span>
                {/* <span className="text-xs text-green-500">
                  +{mockAnalysisData.trends.gifting}%
                </span> */}
              </div>
            </div>

            <div className="flex items-center justify-between gap-1">
              <span className="text-md font-medium">Comments</span>
              <div className="flex gap-1">
                <span className="text-md font-bold">
                  <IndianRupee className="inline size-4" />
                  {mockAnalysisData.commentsPrice.toLocaleString()}
                </span>
                {/* <span className="text-xs text-green-500">
                  +{mockAnalysisData.trends.commentsPrice}%
                </span> */}
              </div>
            </div>

            <div className="flex items-center justify-between gap-1">
              <span className="text-md font-medium">Content Buy</span>
              <div className="flex items-baseline gap-1">
                <span className="text-md font-bold">
                  <IndianRupee className="inline size-4" />
                  {mockAnalysisData.contentBuy.toLocaleString()}
                </span>
                {/* <span className="text-xs text-green-500">
                  +{mockAnalysisData.trends.contentBuy}%
                </span> */}
              </div>
            </div>

            <div className="flex items-center justify-between gap-1">
              <span className="text-md font-medium">Creator Pass</span>
              <div className="flex items-baseline gap-1">
                <span className="text-md font-bold">
                  <IndianRupee className="inline size-4" />
                  {mockAnalysisData.creatorPass.toLocaleString()}
                </span>
                {/* <span className="text-xs text-green-500">
                  +{mockAnalysisData.trends.creatorPass}%
                </span> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

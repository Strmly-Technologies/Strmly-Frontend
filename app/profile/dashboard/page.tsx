"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  Eye,
  Heart,
  DollarSign,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Topbar from "./_components/Topbar";
import { Button } from "@/components/ui/button";

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

const mockRecentVideos = [
  {
    id: 1,
    title: "Building a Startup from Scratch",
    views: 15420,
    likes: 892,
    earnings: 125.5,
    uploadDate: "2024-01-15",
  },
  {
    id: 2,
    title: "React vs Next.js Comparison",
    views: 8930,
    likes: 445,
    earnings: 89.3,
    uploadDate: "2024-01-12",
  },
  {
    id: 3,
    title: "Entrepreneur Mindset Tips",
    views: 12100,
    likes: 678,
    earnings: 98.75,
    uploadDate: "2024-01-10",
  },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="p-4 pb-20 md:pb-4 max-w-6xl">
      <Topbar />


      {/* Analytics Overview */}
      <div className="border-2 flex flex-col gap-5 mt-32 p-2 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Estimate revenue</h2>
              <h2 className="flex text-2xl items-center font-semibold"><IndianRupee className="size-7"/>0.03</h2>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Select value={timeRange} onValueChange={setTimeRange}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Views</span>

            <div className="text-md font-bold">
              {mockAnalytics.totalViews.toLocaleString()}
            </div>
            {/* <div className="flex items-center text-xs text-green-600">
            <ArrowUpRight size={12} className="mr-1" />+{mockAnalytics.monthlyGrowth.views}% from last month
          </div> */}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Likes</span>

            <div className="text-md font-bold">
              {mockAnalytics.totalLikes.toLocaleString()}
            </div>
            {/* <div className="flex items-center text-xs text-green-600">
            <ArrowUpRight size={12} className="mr-1" />+{mockAnalytics.monthlyGrowth.likes}% from last month
          </div> */}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Followers</span>

            <div className="text-md font-bold">
              {mockAnalytics.totalFollowers.toLocaleString()}
            </div>
            {/* <div className="flex items-center text-xs text-green-600">
            <ArrowUpRight size={12} className="mr-1" />+{mockAnalytics.monthlyGrowth.followers}% from last month
          </div> */}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Earnings</span>

            <div className="text-md font-bold">
              ${mockAnalytics.totalEarnings.toFixed(2)}
            </div>
            {/* <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight size={12} className="mr-1" />+{mockAnalytics.monthlyGrowth.earnings}% from last month
            </div> */}
          </div>
        </div>
      </div>

      <div className="w-full absolute left-0 bottom-20">
        <Button className="rounded-xl bg-[#F1C40F] w-full">
          Withdraw now
        </Button>
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"
import { Plus, Users, Crown, Shield, Star, Search,Home, Heart,ChevronLeft} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/navigation';
import { useIsMobile } from "@/hooks/useIsMobile"
import { useAuthStore } from "@/store/useAuthStore" 






// Followers (users who follow you)
const mockFollowers = [
  { id: 1, name: "Alice Johnson", avatar: "https://i.pravatar.cc/40?img=11", mutual: "12 mutuals" },
  { id: 2, name: "Bob Smith", avatar: "https://i.pravatar.cc/40?img=12", mutual: "5 mutuals" },
  { id: 3, name: "Caroline Lee", avatar: "https://i.pravatar.cc/40?img=13", mutual: "8 mutuals" },
  { id: 4, name: "David Chen", avatar: "https://i.pravatar.cc/40?img=14", mutual: "3 mutuals" },
  { id: 5, name: "Eva Martínez", avatar: "https://i.pravatar.cc/40?img=15", mutual: "20 mutuals" },
];

// Following (users you follow)
const mockFollowing = [
  {
    id: 1,
    name: "Kevin Patel",
    username: "kevin.patel",
    avatar: "https://i.pravatar.cc/40?img=21",
    followers: "3.4M",
  },
  {
    id: 2,
    name: "Laura García",
    username: "laura.g",
    avatar: "https://i.pravatar.cc/40?img=22",
    followers: "2.1M",
  },
  {
    id: 3,
    name: "Marcus Brown",
    username: "marcus.b",
    avatar: "https://i.pravatar.cc/40?img=23",
    followers: "1.9M",
  },
  {
    id: 4,
    name: "Nina Williams",
    username: "nina.w",
    avatar: "https://i.pravatar.cc/40?img=24",
    followers: "4.7M",
  },
  {
    id: 5,
    name: "Omar Ali",
    username: "omar.ali",
    avatar: "https://i.pravatar.cc/40?img=25",
    followers: "980K",
  },
];


// Communities created by the user
const mockCreatedCommunities = [
  {
    id: 6,
    name: "Product Builders",
    avatar: "https://i.pravatar.cc/60?img=60",
    banner: "https://picsum.photos/seed/product/400/200",
    members: 3200,
    posts: 450,
    category: "Technology",
    isPrivate: false,
    isJoined: true,
    role: "creator",
    tags: ["product", "build", "startup"],
    owner: {
      name: "Rohan",
      avatar: "https://i.pravatar.cc/32?img=60",
    },
  },
  {
    id: 7,
    name: "AI Innovators",
    avatar: "https://i.pravatar.cc/60?img=61",
    banner: "https://picsum.photos/seed/ai/400/200",
    members: 6400,
    posts: 980,
    category: "Technology",
    isPrivate: false,
    isJoined: true,
    role: "creator",
    tags: ["AI", "ML", "future"],
    owner: {
      name: "ramesh",
      avatar: "https://i.pravatar.cc/32?img=61",
    },
  },
];

const mockFollowedCommunities = [
  {
    id: 1,
    name: "AI Builders",
    avatar: "https://i.pravatar.cc/60?img=30",
    followers: "4.5M",
    creator: {
      username: "rahul.ai",
      avatar: "https://i.pravatar.cc/32?img=31",
    },
  },
  {
    id: 2,
    name: "Health Hackers",
    avatar: "https://i.pravatar.cc/60?img=32",
    followers: "2.1M",
    creator: {
      username: "wellness.jane",
      avatar: "https://i.pravatar.cc/32?img=33",
    },
  },
  {
    id: 3,
    name: "Crypto Gurus",
    avatar: "https://i.pravatar.cc/60?img=34",
    followers: "3.2M",
    creator: {
      username: "crypto.king",
      avatar: "https://i.pravatar.cc/32?img=35",
    },
  },
];

const mockCommunities = [
  {
    id: 1,
    name: "Tech Entrepreneurs",
    description: "A place for founders and builders to share startup stories, tips, and resources.",
    avatar: "https://i.pravatar.cc/60?img=12",
    banner: "https://picsum.photos/seed/tech/400/200",
    creators: 240,                     
    followers: 12400,                 
    category: "Business",
    isPrivate: false,
    isJoined: true,
    role: "member",
    tags: ["startup", "entrepreneurship", "networking"],
    owner: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/32?img=11",
    },
  },
  {
    id: 2,
    name: "React Developers",
    description: "Discuss React patterns, hooks, libraries and ecosystem best practices.",
    avatar: "https://i.pravatar.cc/60?img=22",
    banner: "https://picsum.photos/seed/react/400/200",
    creators: 180,
    followers: 8600,
    category: "Technology",
    isPrivate: false,
    isJoined: false,
    role: null,
    tags: ["react", "javascript", "frontend"],
    owner: {
      name: "Bob Smith",
      avatar: "https://i.pravatar.cc/32?img=12",
    },
  },
  {
    id: 3,
    name: "Health & Wellness",
    description: "Share tips, articles, and personal journeys around health and wellbeing.",
    avatar: "https://i.pravatar.cc/60?img=32",
    banner: "https://picsum.photos/seed/health/400/200",
    creators: 95,
    followers: 15800,
    category: "Lifestyle",
    isPrivate: false,
    isJoined: true,
    role: "admin",
    tags: ["wellness", "fitness", "mindfulness"],
    owner: {
      name: "Caroline Lee",
      avatar: "https://i.pravatar.cc/32?img=13",
    },
  },
  {
    id: 4,
    name: "Startup Founders",
    description: "Private community for verified startup founders to collaborate and mentor.",
    avatar: "https://i.pravatar.cc/60?img=42",
    banner: "https://picsum.photos/seed/founders/400/200",
    creators: 35,
    followers: 420,
    category: "Business",
    isPrivate: true,
    isJoined: false,
    role: null,
    tags: ["founder", "exclusive", "fundraising"],
    owner: {
      name: "David Chen",
      avatar: "https://i.pravatar.cc/32?img=14",
    },
  },
  {
    id: 5,
    name: "Design Thinkers",
    description: "For UI/UX designers to share case studies, prototyping tips, and feedback.",
    avatar: "https://i.pravatar.cc/60?img=52",
    banner: "https://picsum.photos/seed/design/400/200",
    creators: 150,
    followers: 7400,
    category: "Design",
    isPrivate: false,
    isJoined: true,
    role: "moderator",
    tags: ["ux", "ui", "prototyping"],
    owner: {
      name: "Eva Martínez",
      avatar: "https://i.pravatar.cc/32?img=15",
    },
  },
];


const mockMyCommunities = mockCommunities.filter((c) => c.isJoined);

const mockAllCommunities = mockCommunities;



export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useIsMobile()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("my-community")
  const router = useRouter();
  const [submittedQuery, setSubmittedQuery] = useState("")
  const categories = ["all", "Technology", "Business", "Education", "Entertainment", "Lifestyle"]
   function handleSearch(q: string) {
    setSubmittedQuery(q.trim())
  }
  const filteredCommunities = mockCommunities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || community.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const joinedCommunities = mockCommunities.filter((c) => c.isJoined)
   const user = useAuthStore((s) => s.user)
   const currentUser = { name: "Rahul Gupta" }

    const tabs = [
  { id: "my-community", label: "My  Community" },
  { id: "community", label: "Community" },
  { id: "followers", label: "Followers" },
  { id: "following", label: "Following" },
   { id: "creater", label: "Creater" },
];

if(isMobile){
    return (
       <div className="bg-black text-white pl-2 pt-4 pr-3  min-h-screen md:hidden">
      <div className="flex flex-col h-full">
    <div className="relative flex items-center justify-center font-poppins">
      <div className="mr-auto">
        <button onClick={() => router.back()}>
          <ChevronLeft size={28} />
        </button>
      </div>
      <h1 className="text-xl absolute left-1/2 -translate-x-1/2 "> {currentUser.name}</h1>
    </div>

      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
  <div className="flex space-x-6 mb-0.5 border-b border-white/10 pb-2 min-w-max">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`relative text-sm font-medium transition-colors duration-200 ${
          activeTab === tab.id ? 'text-white' : 'text-white'
        }`}
      >
        {tab.label}
        {activeTab === tab.id && (
          <span className="absolute bottom-2 left-0 w-full h-[2px] bg-white rounded-full" />
        )}
      </button>
    ))}

  </div>
</div>
  {/* 🔍 Search Bar Section */}
<div className=" mb-4 relative">
  <Search
    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
    size={20}
  />
  <Input
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
    className="pl-10 text-sm bg-transparent border border-white rounded-full text-white placeholder:text-white w-full"
  />
</div>

{activeTab === "my-community" && (
  <div className="flex-1 flex flex-col bg-black px-1 pt-1 pb-6 mt-1">

    {/* Scrollable List */}
  <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-1">
  {mockMyCommunities
    .filter((community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((community) => (
      <div
        key={community.id}
        className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-[#121212]"
      >
        {/* Left Section - Avatar + Name */}
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={community.avatar} />
            <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white leading-4">
              {community.name}
            </span>
          </div>
        </div>

        {/* Right Section - Creators, Followers, Edit */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">5K</p>
            <p className="text-[11px] text-gray-400">Creators</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-white">3.4M</p>
            <p className="text-[11px] text-gray-400">Followers</p>
          </div>
         <Button
  className="text-[13px] px-5 py-2 h-auto min-h-0 leading-none font-medium text-black rounded-md"
  style={{ backgroundColor: "#F1C40F" }}
>
  Edit
</Button>


        </div>
      </div>
    ))}
</div>
    {/* Create Button pinned to bottom */}
   <div className="pt-60 mt-11">
  <Link href="/communities/create">
    <Button className="w-full bg-yellow-400 text-black text-sm font-medium py-2 rounded-md hover:bg-yellow-300">
      Create Community
    </Button>
  </Link>
</div>
  </div>
)}

{activeTab === "community" && (
  <div className="flex-1 flex flex-col px-2 pt-4 pb-6">
    <div className="space-y-3">
      {mockAllCommunities
        .filter((community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((community) => (
          <div
            key={community.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-[#121212] hover:bg-white/5 transition-colors"
          >
            {/* Left: Avatar + Name */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={community.avatar} />
                <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-white">{community.name}</p>
              </div>
            </div>

            {/* Right: Creators and Followers side by side */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {community.creators?.toLocaleString?.() || "—"}
                </p>
                <p className="text-xs text-gray-400">Creators</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {community.followers?.toLocaleString?.() || "—"}
                </p>
                <p className="text-xs text-gray-400">Followers</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
)}

{activeTab === "following" && (
  <div className="flex-1 flex flex-col px-2 pt-4 pb-6">
    <div className="space-y-3">
      {mockFollowedCommunities
        .filter((community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((community) => (
          <div
            key={community.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-[#121212] hover:bg-white/5 transition-colors"
          >
            {/* Left side: Community Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={community.avatar} />
                <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-white">{community.name}</p>
                <p className="text-xs text-gray-400">@{community.creator.username}</p>
              </div>
            </div>

            {/* Right side: Follower Count */}
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{community.followers}</p>
              <p className="text-xs text-gray-400">Followers</p>
            </div>
          </div>
        ))}
    </div>
  </div>
)}

{activeTab === "followers" && (
  <div className="flex-1 flex flex-col px-2 pt-4 pb-6">
    <div className="space-y-3">
      {mockFollowers
        .filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-[#121212]"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-white/70">{user.mutual}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
)}
{activeTab === "creater" && (
  <div className="flex-1 flex flex-col px-2 pt-4 pb-6">
    <div className="space-y-3">
      {mockCreatedCommunities
        .filter((community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((community) => (
          <div
            key={community.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-[#121212]"
          >
            {/* Left: Community avatar + name + creator username */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={community.avatar} />
                <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-white">
                  {community.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-white/70">
                  <p className="text-xs">@{community.owner.name}</p>
                </div>
              </div>
            </div>

            {/* Right: Follower count */}
            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                {community.members.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Followers</p>
            </div>
          </div>
        ))}
    </div>
  </div>
)}
      </div>
      </div>
    )
  }
  // return (
  //   <div className="p-4 pb-20 md:pb-4">
  //     {/* Header */}
  //     <div className="flex items-center justify-between mb-6">
  //       <h1 className="text-3xl font-bold">Communities</h1>
  //       <Link href="/communities/create">
  //         <Button>
  //           <Plus size={16} className="mr-2" />
  //           Create Community
  //         </Button>
  //       </Link>
  //     </div>

  //     {/* Search and Filters */}
  //     <div className="space-y-4 mb-6">
  //       <div className="relative">
  //         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
  //         <Input
  //           placeholder="Search communities..."
  //           value={searchQuery}
  //           onChange={(e) => setSearchQuery(e.target.value)}
  //           className="pl-10"
  //         />
  //       </div>

  //       <div className="flex space-x-2 overflow-x-auto pb-2">
  //         {categories.map((category) => (
  //           <Button
  //             key={category}
  //             variant={selectedCategory === category ? "default" : "outline"}
  //             size="sm"
  //             onClick={() => setSelectedCategory(category)}
  //             className="whitespace-nowrap"
  //           >
  //             {category === "all" ? "All Categories" : category}
  //           </Button>
  //         ))}
  //       </div>
  //     </div>

  //     <Tabs value={activeTab} onValueChange={setActiveTab}>
  //       <TabsList className="grid w-full grid-cols-3">
  //         <TabsTrigger value="discover">Discover</TabsTrigger>
  //         <TabsTrigger value="joined">My Communities</TabsTrigger>
  //         <TabsTrigger value="trending">Trending</TabsTrigger>
  //       </TabsList>

  //       <TabsContent value="discover" className="space-y-4">
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //           {filteredCommunities.map((community) => (
  //             <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
  //               <div className="relative h-32">
  //                 <Image
  //                   src={community.banner || "/placeholder.svg"}
  //                   alt={community.name}
  //                   fill
  //                   className="object-cover"
  //                 />
  //                 {community.isPrivate && (
  //                   <Badge className="absolute top-2 right-2 bg-yellow-500">
  //                     <Shield size={12} className="mr-1" />
  //                     Private
  //                   </Badge>
  //                 )}
  //               </div>

  //               <CardContent className="p-4">
  //                 <div className="flex items-start space-x-3 mb-3">
  //                   <Avatar className="w-12 h-12">
  //                     <AvatarImage src={community.avatar || "/placeholder.svg"} />
  //                     <AvatarFallback>{community.name[0]}</AvatarFallback>
  //                   </Avatar>
  //                   <div className="flex-1 min-w-0">
  //                     <h3 className="font-semibold truncate">{community.name}</h3>
  //                     <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
  //                   </div>
  //                 </div>

  //                 <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
  //                   <span className="flex items-center">
  //                     <Users size={14} className="mr-1" />
  //                     {community.members.toLocaleString()} members
  //                   </span>
  //                   <span>{community.posts} posts</span>
  //                 </div>

  //                 <div className="flex flex-wrap gap-1 mb-3">
  //                   {community.tags.slice(0, 3).map((tag) => (
  //                     <Badge key={tag} variant="secondary" className="text-xs">
  //                       #{tag}
  //                     </Badge>
  //                   ))}
  //                 </div>

  //                 <div className="flex items-center justify-between">
  //                   <div className="flex items-center space-x-2">
  //                     <Avatar className="w-5 h-5">
  //                       <AvatarImage src={community.owner.avatar || "/placeholder.svg"} />
  //                       <AvatarFallback>{community.owner.name[0]}</AvatarFallback>
  //                     </Avatar>
  //                     <span className="text-xs text-muted-foreground">by {community.owner.name}</span>
  //                   </div>

  //                   {community.isJoined ? (
  //                     <Button size="sm" variant="outline">
  //                       Joined
  //                     </Button>
  //                   ) : (
  //                     <Button size="sm">{community.isPrivate ? "Request" : "Join"}</Button>
  //                   )}
  //                 </div>
  //               </CardContent>
  //             </Card>
  //           ))}
  //         </div>
  //       </TabsContent>

  //       <TabsContent value="joined" className="space-y-4">
  //         {joinedCommunities.length > 0 ? (
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //             {joinedCommunities.map((community) => (
  //               <Card key={community.id} className="overflow-hidden">
  //                 <div className="relative h-32">
  //                   <Image
  //                     src={community.banner || "/placeholder.svg"}
  //                     alt={community.name}
  //                     fill
  //                     className="object-cover"
  //                   />
  //                   <div className="absolute top-2 left-2">
  //                     {community.role === "owner" && (
  //                       <Badge className="bg-yellow-500">
  //                         <Crown size={12} className="mr-1" />
  //                         Owner
  //                       </Badge>
  //                     )}
  //                     {community.role === "admin" && (
  //                       <Badge className="bg-blue-500">
  //                         <Shield size={12} className="mr-1" />
  //                         Admin
  //                       </Badge>
  //                     )}
  //                     {community.role === "moderator" && (
  //                       <Badge className="bg-green-500">
  //                         <Star size={12} className="mr-1" />
  //                         Moderator
  //                       </Badge>
  //                     )}
  //                   </div>
  //                 </div>

  //                 <CardContent className="p-4">
  //                   <div className="flex items-start space-x-3 mb-3">
  //                     <Avatar className="w-12 h-12">
  //                       <AvatarImage src={community.avatar || "/placeholder.svg"} />
  //                       <AvatarFallback>{community.name[0]}</AvatarFallback>
  //                     </Avatar>
  //                     <div className="flex-1 min-w-0">
  //                       <h3 className="font-semibold truncate">{community.name}</h3>
  //                       <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
  //                     </div>
  //                   </div>

  //                   <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
  //                     <span className="flex items-center">
  //                       <Users size={14} className="mr-1" />
  //                       {community.members.toLocaleString()} members
  //                     </span>
  //                     <span>{community.posts} posts</span>
  //                   </div>

  //                   <Link href={`/communities/${community.id}`}>
  //                     <Button className="w-full">View Community</Button>
  //                   </Link>
  //                 </CardContent>
  //               </Card>
  //             ))}
  //           </div>
  //         ) : (
  //           <div className="text-center py-12">
  //             <Users size={48} className="mx-auto text-muted-foreground mb-4" />
  //             <h3 className="text-lg font-semibold mb-2">No communities yet</h3>
  //             <p className="text-muted-foreground mb-4">Join communities to connect with like-minded people</p>
  //             <Button onClick={() => setActiveTab("discover")}>Discover Communities</Button>
  //           </div>
  //         )}
  //       </TabsContent>

  //       <TabsContent value="trending" className="space-y-4">
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //           {mockCommunities
  //             .sort((a, b) => b.members - a.members)
  //             .map((community, index) => (
  //               <Card key={community.id} className="overflow-hidden">
  //                 <div className="relative h-32">
  //                   <Image
  //                     src={community.banner || "/placeholder.svg"}
  //                     alt={community.name}
  //                     fill
  //                     className="object-cover"
  //                   />
  //                   <Badge className="absolute top-2 left-2 bg-orange-500">#{index + 1} Trending</Badge>
  //                 </div>

  //                 <CardContent className="p-4">
  //                   <div className="flex items-start space-x-3 mb-3">
  //                     <Avatar className="w-12 h-12">
  //                       <AvatarImage src={community.avatar || "/placeholder.svg"} />
  //                       <AvatarFallback>{community.name[0]}</AvatarFallback>
  //                     </Avatar>
  //                     <div className="flex-1 min-w-0">
  //                       <h3 className="font-semibold truncate">{community.name}</h3>
  //                       <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
  //                     </div>
  //                   </div>

  //                   <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
  //                     <span className="flex items-center">
  //                       <Users size={14} className="mr-1" />
  //                       {community.members.toLocaleString()} members
  //                     </span>
  //                     <span className="text-green-600">+{Math.floor(Math.random() * 100)} today</span>
  //                   </div>

  //                   <Button className="w-full" size="sm">
  //                     {community.isJoined ? "Joined" : "Join"}
  //                   </Button>
  //                 </CardContent>
  //               </Card>
  //             ))}
  //         </div>
  //       </TabsContent>
  //     </Tabs>
  //   </div>
  // )
}

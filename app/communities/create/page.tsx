"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Camera, Users, Lock, Globe, Shield, Crown, Upload, X, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"

const categories = [
  "Technology",
  "Business",
  "Education",
  "Entertainment",
  "Lifestyle",
  "Sports",
  "Music",
  "Art",
  "Gaming",
  "Health",
  "Travel",
  "Food",
]

const communityTypes = [
  {
    value: "open",
    label: "Open Community",
    description: "Anyone can join and participate",
    icon: <Globe size={20} className="text-blue-500" />,
  },
  {
    value: "approval",
    label: "Approval Required",
    description: "Members need approval to join",
    icon: <Shield size={20} className="text-amber-500" />,
  },
  {
    value: "invite",
    label: "Invite Only",
    description: "Members can only join by invitation",
    icon: <Lock size={20} className="text-rose-500" />,
  },
]

export default function CreateCommunityPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [communityData, setCommunityData] = useState({
    name: "",
    description: "",
    category: "",
    type: "open",
    avatar: null as File | null,
    banner: null as File | null,
    rules: [""] as string[],
    tags: [] as string[],
    allowVideoUploads: true,
    allowLiveStreams: true,
    moderationLevel: "medium",
    welcomeMessage: "",
  })

  const [tagInput, setTagInput] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setCommunityData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: "avatar" | "banner", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCommunityData((prev) => ({ ...prev, [field]: file }))
    }
  }

  const addRule = () => {
    setCommunityData((prev) => ({
      ...prev,
      rules: [...prev.rules, ""],
    }))
  }

  const updateRule = (index: number, value: string) => {
    setCommunityData((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) => (i === index ? value : rule)),
    }))
  }

  const removeRule = (index: number) => {
    setCommunityData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !communityData.tags.includes(tagInput.trim())) {
      setCommunityData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCommunityData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleCreateCommunity = () => {
    console.log("Creating community:", communityData)
    // API call to create community
    alert("Community created successfully!")
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return communityData.name.trim() !== "" && communityData.description.trim() !== ""
      case 2:
        return communityData.category !== "" && communityData.type !== ""
      case 3:
        return communityData.rules.some((rule) => rule.trim() !== "")
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 bg-black">
      {/* Header */}
     <div className="sticky top-0 bg-black backdrop-blur-sm border-b border-gray-800 z-10 shadow-sm">
  <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
    <div className="flex items-center space-x-3">
      <Link href="/communities">
        <button  className="rounded-full text-white">
          <ChevronLeft size={28} />
        </button>
      </Link>
      <h1 className="text-lg font-semibold text-white">Create Community</h1>
    </div>
  </div>
  <div className="flex justify-end pr-3">
  <div className="flex items-center space-x-3">
    <span className="pl-15 text-sm text-gray-400 font-medium">
      Step {currentStep} of 4
    </span>
    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
        style={{ width: `${(currentStep / 4) * 100}%` }}
      />
    </div>
  </div>
</div>

</div>

      <div className="max-w-2xl mx-auto p-4 pb-16 space-y-8 bg-black">
        {/* Step 1: Basic Information */}
     {currentStep === 1 && (
  <Card className="border border-gray-800 bg-[#0B0B0F] shadow-lg rounded-xl overflow-hidden">
    <CardContent className="p-6 space-y-8">
      {/* Banner Upload */}
      <div>
        <Label className="text-gray-200 font-medium mb-2 block">Community Banner</Label>
        <div className="relative h-44 bg-gray-900 rounded-xl overflow-hidden border-2 border-dashed border-gray-700 hover:border-yellow-400 transition-colors">
          {communityData.banner ? (
            <Image
              src={URL.createObjectURL(communityData.banner) || "/placeholder.svg"}
              alt="Banner preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
              <Upload size={32} />
              <p className="text-sm">Upload banner image</p>
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 bg-white/90 text-black backdrop-blur-sm shadow-md hover:bg-white"
            onClick={() => document.getElementById("banner-upload")?.click()}
          >
            <Camera size={16} className="mr-2" />
            {communityData.banner ? "Change Banner" : "Upload Banner"}
          </Button>
          <input
            id="banner-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload("banner", e)}
            className="hidden"
          />
        </div>
      </div>

      {/* Avatar and Basic Info */}
      <div className="flex items-start space-x-5">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-gray-900 shadow-lg">
            <AvatarImage
              src={communityData.avatar ? URL.createObjectURL(communityData.avatar) : "/placeholder.svg"}
              className="bg-gray-800"
            />
            <AvatarFallback className="bg-gray-800">
              <Users size={32} className="text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="secondary"
            size="sm"
            className="absolute -bottom-1 -right-1 rounded-full w-9 h-9 p-0 bg-white text-black shadow-md hover:bg-white"
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            <Camera size={16} />
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload("avatar", e)}
            className="hidden"
          />
        </div>

        <div className="flex-1 space-y-5">
          <div>
            <Label htmlFor="name" className="text-gray-200 font-medium mb-2 block">
              Community Name *
            </Label>
            <Input
              id="name"
              value={communityData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter community name"
              className="py-5 px-4 text-base rounded-lg bg-black text-white border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-200 font-medium mb-2 block">
              Description *
            </Label>
            <Textarea
              id="description"
              value={communityData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what your community is about..."
              rows={4}
              className="rounded-lg bg-black text-white border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 min-h-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Yellow Continue Button */}
      <div className="pt-4">
       
      </div>
    </CardContent>
  </Card>
)}
        {/* Step 2: Category and Privacy */}
        {currentStep === 2 && (
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
              <CardTitle className="text-xl font-bold text-gray-800">Category & Privacy</CardTitle>
              <p className="text-sm text-gray-500">Define your community's focus and access</p>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Category *</Label>
                <Select value={communityData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="py-5 px-4 text-base rounded-lg border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-lg border border-gray-200">
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category.toLowerCase()}
                        className="px-4 py-3 hover:bg-gray-50 focus:bg-gray-50"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Community Type *</Label>
                <RadioGroup value={communityData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <div className="space-y-3">
                    {communityTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`flex items-start space-x-4 p-5 border rounded-xl transition-all ${
                          communityData.type === type.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                          className="mt-0.5 text-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={type.value}
                            className="flex items-center font-medium text-gray-800 cursor-pointer"
                          >
                            <span className="mr-3">{type.icon}</span>
                            <span>{type.label}</span>
                          </Label>
                          <p className="text-sm text-gray-600 mt-2 ml-8">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Tags</Label>
                <div className="flex space-x-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags to help people find your community"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="py-5 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Button onClick={addTag} disabled={!tagInput.trim()} className="px-6">
                    Add
                  </Button>
                </div>
                {communityData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {communityData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1.5"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Rules and Guidelines */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
              <CardTitle className="text-xl font-bold text-gray-800">Community Rules</CardTitle>
              <p className="text-sm text-gray-500">Set clear guidelines to maintain a healthy community environment</p>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div>
                <Label className="text-gray-700 font-medium mb-3 block">Community Rules</Label>
                <div className="space-y-3">
                  {communityData.rules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-gray-100 text-gray-800 font-medium rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <Input
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        placeholder={`Enter rule #${index + 1}`}
                        className="py-4 px-4 text-base rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      {communityData.rules.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRule(index)}
                          className="rounded-lg w-10 h-10 p-0 flex-shrink-0"
                        >
                          <X size={18} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={addRule}
                  className="mt-4 px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                  disabled={communityData.rules.length >= 10}
                >
                  + Add Rule
                </Button>
              </div>

              <div>
                <Label htmlFor="welcomeMessage" className="text-gray-700 font-medium mb-2 block">
                  Welcome Message
                </Label>
                <Textarea
                  id="welcomeMessage"
                  value={communityData.welcomeMessage}
                  onChange={(e) => handleInputChange("welcomeMessage", e.target.value)}
                  placeholder="Welcome new members with a friendly message..."
                  rows={4}
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[120px]"
                />
                <p className="text-sm text-gray-500 mt-2">
                  This message will be sent to new members when they join your community
                </p>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-3 block">Moderation Level</Label>
                <RadioGroup
                  value={communityData.moderationLevel}
                  onValueChange={(value) => handleInputChange("moderationLevel", value)}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-center space-x-4 p-4 border rounded-xl transition-all ${
                      communityData.moderationLevel === "low"
                        ? "border-amber-300 bg-amber-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem
                      value="low"
                      id="low"
                      className="text-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <Label htmlFor="low" className="flex-1 cursor-pointer">
                      <p className="font-medium text-gray-800">Low - Minimal moderation</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Members have more freedom, with basic content restrictions
                      </p>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-4 p-4 border rounded-xl transition-all ${
                      communityData.moderationLevel === "medium"
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem
                      value="medium"
                      id="medium"
                      className="text-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <Label htmlFor="medium" className="flex-1 cursor-pointer">
                      <p className="font-medium text-gray-800">Medium - Balanced moderation</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Standard moderation with clear rules and enforcement
                      </p>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-4 p-4 border rounded-xl transition-all ${
                      communityData.moderationLevel === "high"
                        ? "border-rose-300 bg-rose-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem
                      value="high"
                      id="high"
                      className="text-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                    <Label htmlFor="high" className="flex-1 cursor-pointer">
                      <p className="font-medium text-gray-800">High - Strict moderation</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Strict enforcement with proactive monitoring and restrictions
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Features and Review */}
        {currentStep === 4 && (
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
              <CardTitle className="text-xl font-bold text-gray-800">Features & Review</CardTitle>
              <p className="text-sm text-gray-500">Finalize settings and create your community</p>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div>
                <Label className="text-gray-700 font-medium mb-3 block">Community Features</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                    <div>
                      <p className="font-medium text-gray-800">Allow Video Uploads</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Members can upload videos to the community
                      </p>
                    </div>
                    <Switch
                      checked={communityData.allowVideoUploads}
                      onCheckedChange={(checked) => handleInputChange("allowVideoUploads", checked)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                    <div>
                      <p className="font-medium text-gray-800">Allow Live Streams</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Members can host live streams in the community
                      </p>
                    </div>
                    <Switch
                      checked={communityData.allowLiveStreams}
                      onCheckedChange={(checked) => handleInputChange("allowLiveStreams", checked)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Review Summary */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-gray-800 mb-4">Community Summary</h4>
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-14 h-14 border-2 border-white shadow">
                      <AvatarImage
                        src={communityData.avatar ? URL.createObjectURL(communityData.avatar) : "/placeholder.svg"}
                        className="bg-gray-200"
                      />
                      <AvatarFallback className="bg-gray-200">
                        <Users size={24} className="text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg text-gray-900">{communityData.name}</p>
                      <p className="text-gray-600">{communityData.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-blue-100">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Category</span>
                        <p className="font-medium text-gray-800">{communityData.category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Type</span>
                        <p className="font-medium text-gray-800">
                          {communityTypes.find((t) => t.value === communityData.type)?.label}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Rules</span>
                        <p className="font-medium text-gray-800">
                          {communityData.rules.filter((r) => r.trim()).length} active rules
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Tags</span>
                        <p className="font-medium text-gray-800">
                          {communityData.tags.length} tags added
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Previous
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext()}
              style={{ backgroundColor: "#F1C40F" }}
              className={`ml-auto px-8 py-3 rounded-lg ${
                !canProceedToNext()
                  ? "bg-gray-300"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              }`}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleCreateCommunity}
              className="ml-auto px-8 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
              size="lg"
              style={{ backgroundColor: "#F1C40F" }}
            >
              <Crown size={18} className="mr-2" />
              Create Community
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
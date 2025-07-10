"use client"
import { useEffect, useState, useRef } from "react"
import { X, Gauge, Bookmark, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SaveVideo, UnSaveVideo, SaveStatus } from "./api/MoreOptions"

interface VideoMoreMenuProps {
  isOpen: boolean
  onClose: () => void
  videoId: string | null
  videoRefs: React.MutableRefObject<{ [id: string]: HTMLVideoElement | null }>
  setVideoSpeed: (value: number | ((prev: number) => number)) => void
  longVideosOnly: boolean
  token: string
}

export default function VideoMoreMenu({ isOpen, onClose, videoId, videoRefs, setVideoSpeed, longVideosOnly, token }: VideoMoreMenuProps) {
  //const Status = SaveStatus({ token, commentId: videoId, videoId, videoType: longVideosOnly ? "long" : "short" })
  const [saved, setSaved] = useState(false)
  const [speed, setSpeed] = useState("1")

  const HandleSave = async () => {
    if (!token || !videoId) return;

    try {
      const data = await SaveVideo({
        token,
        commentId: videoId,
        videoId,
        videoType: longVideosOnly ? "long" : "short"
      });

      // Optionally re-check status from backend, or just toggle:
      setSaved(prev => !prev);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  
  const HandleUnSave = async () => {
    if (!token || !videoId) return;

    try {
      const data = await UnSaveVideo({
        token,
        commentId: videoId,
        videoId,
        videoType: longVideosOnly ? "long" : "short"
      });
      
      // Optionally re-check status from backend, or just toggle:
      setSaved(prev => !prev);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!videoId || !token) return;

      try {
        const { isSaved } = await SaveStatus({
          token,
          commentId: videoId,
          videoId,
          videoType: longVideosOnly ? "long" : "short"
        });
        setSaved(isSaved);
      } catch (err) {
        console.error("Error checking save status:", err);
      }
    };

    checkSavedStatus();
  }, [videoId, token, longVideosOnly]);



  useEffect(() => {
    // Load saved state from localStorage or set default
    setVideoSpeed(parseFloat(speed));

  }, [speed, setVideoSpeed])

  useEffect(() => {
    if (videoId && videoRefs.current[videoId]) {
      videoRefs.current[videoId]!.playbackRate = parseFloat(speed);
    }
  }, [speed, videoId, videoRefs]);

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-background rounded-t-2xl w-full max-w-md p-4 lg:p-6 space-y-3 lg:space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base lg:text-lg font-semibold text-yellow-500 font-poppins">Video Options</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2 lg:p-3">
            <X size={18} className="lg:w-5 lg:h-5" />
          </Button>
        </div>

        {/* Save Settings */}
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={saved? HandleUnSave : HandleSave}
            className="w-full justify-start text-sm lg:text-base py-2 lg:py-3 font-poppins"
          >
            <Bookmark size={14} className="mr-2 lg:w-4 lg:h-4 font-poppins" />
            {saved ? "Remove from Saved" : "Save Video"}
          </Button>
        </div>

        <Separator />

        {/* Speed Settings */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Gauge size={14} className="lg:w-4 lg:h-4" />
            <span className="font-medium text-sm lg:text-base font-poppins">Playback Speed</span>
          </div>
          <Select value={speed} onValueChange={setSpeed}>
            <SelectTrigger className="text-sm lg:text-base font-poppins">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.25">0.25x</SelectItem>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">Normal</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
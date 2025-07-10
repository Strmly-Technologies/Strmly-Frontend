"use client";

import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

type CameraTopbarProps = {
  onToggleCountdownSlider: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedImage: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  duration: number;
  setDuration: (val: number) => void;
  isRecording: boolean;
  countdown: boolean;
  maxLimit: number;
  setShowTracks: (val: boolean) => void;
  setShowEffects: (val: boolean) => void;
};

const CameraTopbar = ({
  onToggleCountdownSlider,
  fileInputRef,
  selectedImage,
  onFileChange,

  duration,
  setDuration,
  isRecording,
  countdown,
  maxLimit,
  setShowTracks,
  setShowEffects,
}: CameraTopbarProps) => {
  const router = useRouter();
  const [showSlider, setShowSlider] = useState<boolean>(false);

  return (
    <div className="flex w-full items-center justify-between ml-5 mt-2">
      <div className="w-full cursor-pointer" onClick={() => router.back()}>
        <X className="size-7 text-white" />
      </div>

      <div className="relative right-5 w-full">
        <div className="grid grid-cols-2 gap-2 items-center">
          {/* <Button type="button" className="bg-transparent w-full" variant="link">
            <img className="size-5" alt="vector" src="/assets/UploadPageIcons/Vector.png" />
          </Button>
          <Button type="button" className="bg-transparent text-white w-full" variant="link">
            <div className="text-xs font-semibold">
              <span className="text-lg">1</span>x
            </div>
          </Button> */}

          {/* Timer Button */}
          <Button
            className="bg-transparent"
            variant="link"
            onClick={() => {
              setShowSlider(!showSlider);
              setShowTracks(false);
              setShowEffects(false);
            }}
          >
            <img className="size-6 focus:bg-red-500 rounded-full" alt="timer" src="/assets/UploadPageIcons/timmer.png" />
          </Button>

          <Button
            type="button"
            className="bg-transparent text-white w-full"
            variant="link"
            onClick={onToggleCountdownSlider}
          >
            <Clock className="size-8" />
          </Button>
        </div>
      </div>


      <div className="w-full flex justify-end relative right-10">
        <div
          className="size-16 rounded-lg bg-gray-700/50 flex items-center justify-center cursor-pointer hover:bg-gray-600/50 transition-colors duration-200 overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Selected preview" className="size-full object-cover" />
          ) : (
            <img
              className="size-full object-cover"
              alt="Gallery"
              src="/assets/UploadPageIcons/Galery.png"
            />
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Timer Slider */}
      {showSlider && (
        <div className="absolute top-16 left-20 z-20 bg-black/60 p-2 rounded-xl">
          <input
            type="range"
            min="5"
            max={maxLimit}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-40"
            disabled={isRecording || countdown}
          />
          <div className="text-white text-sm text-center mt-1">{duration}s</div>
        </div>
      )}
    </div>
  );
};

export default CameraTopbar;
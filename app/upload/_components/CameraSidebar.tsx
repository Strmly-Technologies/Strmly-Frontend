"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

type Props = {
  duration: number;
  setDuration: (val: number) => void;
  isRecording: boolean;
  countdown: boolean;
  maxLimit: number;
  showTracks: boolean;
  setShowTracks: (val: boolean) => void;
  showEffects: boolean;
  setShowEffects: (val: boolean) => void;
};

const CameraSidebar = ({
  duration,
  setDuration,
  isRecording,
  countdown,
  maxLimit,
  showTracks,
  setShowTracks,
  showEffects,
  setShowEffects,
}: Props) => {
  const [showSlider, setShowSlider] = useState<boolean>(false);

  return (
    <div className="relative">
      <div className="flex flex-col items-center gap-5">
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
          <img className="size-8" alt="timer" src="/assets/UploadPageIcons/timmer.png" />
        </Button>

        {/* Music Button */}
        <Button
          className="bg-transparent"
          variant="link"
          onClick={() => {
            setShowTracks(!showTracks);
            setShowSlider(false);
            setShowEffects(false);
          }}
        >
          <img className="size-7" alt="music" src="/assets/UploadPageIcons/Music.png" />
        </Button>

        {/* Effects Button */}
        <Button
          className="bg-transparent"
          variant="link"
          onClick={() => {
            setShowEffects(!showEffects);
            setShowSlider(false);
            setShowTracks(false);
          }}
        >
          <img className="size-7" alt="effect" src="/assets/UploadPageIcons/effect.png" />
        </Button>
      </div>

      {/* Timer Slider */}
      {showSlider && (
        <div className="absolute top-0 left-16 z-20 bg-black/60 p-2 rounded-xl">
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

      {/* Music Tracks (Placeholder) */}
      {showTracks && (
        <div className="absolute top-0 left-16 z-20 bg-black/60 text-white p-2 rounded-xl w-40">
          <p className="text-sm">🎵 Choose a track</p>
          <ul className="text-xs space-y-1 mt-1">
            <li>Track 1</li>
            <li>Track 2</li>
            <li>Track 3</li>
          </ul>
        </div>
      )}

      {/* Effects (Placeholder) */}
      {showEffects && (
        <div className="absolute top-0 left-16 z-20 bg-black/60 text-white p-2 rounded-xl w-40">
          <p className="text-sm">✨ Effects</p>
          <ul className="text-xs space-y-1 mt-1">
            <li>Blur</li>
            <li>Sepia</li>
            <li>Glow</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CameraSidebar;
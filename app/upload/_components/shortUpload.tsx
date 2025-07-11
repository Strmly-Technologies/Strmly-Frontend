"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import CountdownTimer from "./CountdownTimer";
import VideoPreview from "./VideoPreview";
import Image from "next/image";
import { PauseIcon, CameraIcon } from "lucide-react";
import CameraSidebar from "./CameraSidebar";
import CameraTopbar from "./CameraTopbar";

const MAX_LIMIT = 61;

type ShortVideoUploadProps = {
  switchVideo: boolean;
  isShowBottom: (val: boolean) => void;
};

const ShortVideoUpload = ({ switchVideo, isShowBottom  }: ShortVideoUploadProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [duration, setDuration] = useState(10);
  const [countdown, setCountdown] = useState(false);
  const [progress, setProgress] = useState(0);

  const [showSlider, setShowSlider] = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [flipCamera, setFlipCamera] = useState(false);

  const [showCountdownSlider, setShowCountdownSlider] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(
    async (mode: "user" | "environment" = "user") => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: true,
        });

        stopCamera(); // Safe to call here since it's memoized
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (error) {
        console.error("Camera access error:", error);
      }
    },
    [stopCamera]
  );

  const toggleCamera = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFlipCamera(!flipCamera);
    stopCamera();
    setFacingMode(newMode);
    startCamera(newMode);
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startRecording = () => {
    if (!stream) return;
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    const localChunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) localChunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(localChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const file = new File([blob], "recorded-video.webm", {
        type: "video/webm",
      });

      setVideoURL(url);
      setVideoFile(file);
      setChunks([]);
    };

    recorder.start();
    setChunks(localChunks);
    setIsRecording(true);
    startProgress(duration);

    setTimeout(() => stopRecording(), duration * 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setProgress(0);
  };

  const startProgress = (duration: number) => {
    const interval = 100;
    const totalSteps = (duration * 1000) / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      setProgress((current / totalSteps) * 100);
      if (current >= totalSteps) clearInterval(timer);
    }, interval);
  };

  const reset = () => {
    setVideoURL(null);
    setVideoFile(null);
    setIsRecording(false);
    setCountdown(false);
    setProgress(0);
    startCamera(facingMode);
  };

  const handleCountdownFinish = () => {
    setCountdown(false);
    startRecording();
  };

  const handleStartClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setCountdown(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];

      if (selectedFile.type !== "video/mp4") {
        alert("Only MP4 videos are supported.");
        return;
      }

      const videoUrl = URL.createObjectURL(selectedFile);
      setVideoURL(videoUrl);
      setVideoFile(selectedFile);
    }
  };


  return (
    <div className="relative w-full h-full bg-card overflow-hidden flex items-center justify-center">
      {!videoURL ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />

          {countdown && (
            <div className="absolute z-20 text-white text-6xl font-bold animate-pulse">
              <CountdownTimer
                seconds={countdownSeconds}
                onComplete={handleCountdownFinish}
              />
            </div>
          )}

          {/* <div className="absolute top-96 left-2 z-20">
            <CameraSidebar
              duration={duration}
              setDuration={setDuration}
              isRecording={isRecording}
              countdown={countdown}
              maxLimit={MAX_LIMIT}
              showTracks={showTracks}
              setShowTracks={setShowTracks}
              showEffects={showEffects}
              setShowEffects={setShowEffects}
            />
          </div> */}

          <div className="absolute top-5 w-full z-20">
            <CameraTopbar
              duration={duration}
              setDuration={setDuration}
              isRecording={isRecording}
              countdown={countdown}
              maxLimit={MAX_LIMIT}
              onToggleCountdownSlider={() =>
                setShowCountdownSlider((prev) => !prev)
              }
              setShowTracks={setShowTracks}
              setShowEffects={setShowEffects}
              fileInputRef={fileInputRef}
              selectedImage={selectedImage}
              onFileChange={handleFileChange}
            />
          </div>

          <button
            className={`absolute flex items-center justify-center bottom-10 right-5 z-30 ${flipCamera ? "bg-[#B0B0B0]" : "bg-card"} rounded-full`}
            onClick={toggleCamera}
            disabled={isRecording}
            aria-label="Flip Camera"
          >
            <Image src={'/flip.png'} alt="camera-icon" width={20} height={20} />
          </button>

          <div className="absolute bottom-28 z-10 w-full flex flex-col items-center space-y-4">
            <button
              type="button"
              onClick={handleStartClick}
              className={`text-lg cursor-pointer flex justify-center`}
              disabled={countdown}
            >
              {isRecording ? (
                <div className="bg-primary rounded-full p-2">
                  <PauseIcon className="size-12 text-white" />
                </div>
              ) : (
                !countdown && (
                  <Image
                    width={70}
                    height={70}
                    alt="start recording"
                    src={"/assets/UploadPageIcons/Icon.png"}
                  />
                )
              )}
            </button>
          </div>

          {isRecording && (
            <div className="w-full h-full">
              <Progress value={progress} className="w-full h-1 bg-white/20" />
            </div>
          )}

          {showCountdownSlider && (
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 p-2 rounded-xl">
              <input
                type="range"
                min="1"
                max="10"
                value={countdownSeconds}
                onChange={(e) => setCountdownSeconds(parseInt(e.target.value))}
                className="w-40"
                disabled={isRecording}
              />
              <div className="text-white text-sm text-center mt-1">
                Start in: {countdownSeconds}s
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="top-0 h-full">
          <VideoPreview
          isShowBottom={isShowBottom}
            videoFile={videoFile}
            videoURL={videoURL}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
};

export default ShortVideoUpload;

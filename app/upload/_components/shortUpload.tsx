"use client";

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import CountdownTimer from "./CountdownTimer";
import VideoPreview from "./VideoPreview";
import Image from "next/image";
import { PauseIcon } from "lucide-react";
import CameraSidebar from "./CameraSidebar";
import CameraTopbar from "./CameraTopbar";

const MAX_LIMIT = 61;

const ShortVideoUpload = ({ switchVideo }: { switchVideo: boolean }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [duration, setDuration] = useState(10);
  const [countdown, setCountdown] = useState(false);
  const [progress, setProgress] = useState(0);

  const [showSlider, setShowSlider] = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  const [showCountdownSlider, setShowCountdownSlider] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

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
      setVideoURL(url);
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
    setIsRecording(false);
    setCountdown(false);
    setProgress(0);

    // Restart camera stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((newStream) => {
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    });
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
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex items-center justify-center">
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
              <CountdownTimer seconds={3} onComplete={handleCountdownFinish} />
            </div>
          )}

          <div className="absolute top-96 left-2 z-20">
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
          </div>
          <div className="absolute top-16 w-full z-20">
            <CameraTopbar
              onToggleCountdownSlider={() => setShowCountdownSlider((prev) => !prev)}
              fileInputRef={fileInputRef}
              selectedImage={selectedImage}
              onFileChange={handleFileChange}
            />
          </div>

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
              ) : 
              !countdown &&
                <Image
                  width={70}
                  height={70}
                  alt="start recording"
                  src={"/assets/UploadPageIcons/Icon.png"}
                />
              }
            </button>
          </div>

          {isRecording && (
            <div className="w-full h-full">
              <Progress value={progress} className="w-full h-1 bg-white/20" />
            </div>
          )}

          {showCountdownSlider && (
            <div className="absolute top-52 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 p-2 rounded-xl">
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
          <VideoPreview videoURL={videoURL} onReset={reset} />
        </div>
      )}
    </div>
  );
};

export default ShortVideoUpload;
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ShortVideoForm from "./ShortVideoForm";

type Props = {
  videoURL: string;
  videoFile: File | null;
  onReset: () => void;
  isShowBottom: (val: boolean) => void;
};

const VideoPreview = ({ videoFile, videoURL, onReset, isShowBottom  }: Props) => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <ShortVideoForm videoFile={videoFile} videoURL={videoURL} onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="w-full h-[80dvh] flex flex-col items-center justify-center bg-card">
      <video
        src={videoURL}
        controls
        autoPlay
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-20 text-sm font-poppins flex justify-center gap-4">
        <Button className="text-sm h-[15px]" onClick={onReset} variant="destructive">
          Discard
        </Button>
        
        <Button className="text-sm h-[15px]" onClick={() => {setShowForm(true); isShowBottom(false)}}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;
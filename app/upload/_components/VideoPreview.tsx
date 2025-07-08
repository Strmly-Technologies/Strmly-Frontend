import { Button } from "@/components/ui/button";
import { useState } from "react";
import ShortVideoForm from "./ShortVideoForm";

type Props = {
  videoURL: string;
  onReset: () => void;
};

const VideoPreview = ({ videoURL, onReset }: Props) => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <ShortVideoForm videoURL={videoURL} onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="w-full h-[80dvh] flex flex-col items-center justify-center bg-black">
      <video
        src={videoURL}
        controls
        autoPlay
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-24 flex justify-center gap-4">
        <Button variant="default" onClick={() => setShowForm(true)}>
          Next
        </Button>
        <Button onClick={onReset} variant="secondary">
          Discard
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;
import { Button } from "@/components/ui/button";


type Props = {
  videoURL: string;
  onReset: () => void;
};

const VideoPreview = ({ videoURL, onReset }: Props) => {
  const saveVideo = (e:any) => {
    // const a = document.createElement("a");
    // a.href = videoURL;
    // a.download = "recorded-video.webm";
    // a.click();
    console.log(e)
  };

  return (
    <div className="w-full h-[80dvh] flex flex-col items-center justify-center bg-black">
      <video
        src={videoURL}
        controls
        autoPlay
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-24 flex justify-center gap-4">
        <Button onClick={saveVideo} variant="default">
          Save
        </Button>
        <Button onClick={onReset} variant="secondary">
          Discard
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;
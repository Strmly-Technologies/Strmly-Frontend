"use client";
import { useState } from "react";
import LongVideoUpload from "./_components/longUpload";
import DesktopPage from "./_components/mainCode";
import SwitchUpload from "./_components/SwitchUpload";
import CameraSidebar from "./_components/CameraSidebar";
import ShortVideoUpload from "./_components/shortUpload";
import CameraTopbar from "./_components/CameraTopbar";

const UploadPage = () => {
  const [switchVideo, setSwitchVideo] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  return (
    <div className="relative">
      <div className="hidden md:block">
        <DesktopPage />
      </div>

      <div className="md:hidden h-[100dvh] overflow-hidden space-y-4">
        {switchVideo ? (
          <LongVideoUpload />
        ) : (
          <ShortVideoUpload switchVideo={switchVideo} isShowBottom={setShowBottom}/>
        )}
      </div>

      {!switchVideo && (
        <>
          <div className="absolute top-[40%] left-2 z-20">
            {/* <CameraSidebar/> */}
          </div>
          <div className="absolute top-[8%] w-full z-20">
            {/* <CameraTopbar/> */}
          </div>
        </>
      )}

      {showBottom && (
        <>
          <div
            className={`fixed w-full z-20 bottom-0 mb-10 ${
              switchVideo && "border-t"
            }`}
          >
            <SwitchUpload
              switchVideo={switchVideo}
              setSwitchVideo={setSwitchVideo}
            />
          </div>

          <div className={`flex w-full}`}>
            <div className={`flex items-center justify-center w-full`}>
              <div className={`bg-white h-2 w-32 rounded-xl`}></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadPage;

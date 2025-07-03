'use client'
import { useState } from "react";
import LongVideoUpload from "./_components/longUpload"
import DesktopPage from "./_components/mainCode"
import SwitchUpload from "./_components/SwitchUpload";
import CameraSidebar from "./_components/CameraSidebar";
import ShortVideoUpload from "./_components/shortUpload";
import CameraTopbar from "./_components/CameraTopbar";


const UploadPage = () => {
  const [switchVideo, setSwitchVideo] = useState(false);

  return (
    <div className="relative">
      <div className="hidden md:block">
        <DesktopPage/>
      </div>

      <div className="md:hidden h-[100dvh] overflow-hidden space-y-4">
        {
          switchVideo ?
          <LongVideoUpload/>
          :
          <ShortVideoUpload switchVideo={switchVideo}/>
        }
      </div>

      {
        !switchVideo &&
        <>
        <div className="absolute top-[40%] left-2 z-20">
          {/* <CameraSidebar/> */}
        </div>
        <div className="absolute top-[8%] w-full z-20">
          {/* <CameraTopbar/> */}
        </div>
        </>
      }

      <div className={`fixed w-full z-20 bottom-0 mb-10 ${switchVideo && 'border-t'}`}>
        <SwitchUpload switchVideo={switchVideo} setSwitchVideo={setSwitchVideo}/>
      </div>

      <div className={`absolute bottom-0 w-full ${switchVideo ? 'bg-white' : 'bg-black'}}`}>
        <div className={`${switchVideo ? 'bg-white' : 'bg-black'} flex items-end justify-center h-8 w-full`}>
          <div className={`${switchVideo ? 'bg-black' : 'bg-white'} h-1 w-32 rounded-xl`}>

          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage

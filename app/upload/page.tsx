'use client'
import { useState } from "react";
import LongVideoUpload from "./_components/longUpload"
import DesktopPage from "./_components/mainCode"
import SwitchUpload from "./_components/SwitchUpload";


const UploadPage = () => {
  const [switchVideo, setSwitchVideo] = useState(false);

  return (
    <div className="relative">
      <div className="hidden md:block">
        <DesktopPage/>
      </div>

      <div className="md:hidden space-y-4">
        <LongVideoUpload/>
      </div>

      <div className="fixed bottom-16 border-t w-full">
        <SwitchUpload switchVideo={switchVideo} setSwitchVideo={setSwitchVideo}/>
      </div>
    </div>
  )
}

export default UploadPage
"use client"
import { Button } from '@/components/ui/button'
import React from 'react'

type SwitchUploadProps = {
  switchVideo: boolean;
  setSwitchVideo: React.Dispatch<React.SetStateAction<boolean>>;
};

const SwitchUpload = ({switchVideo, setSwitchVideo}: SwitchUploadProps) => {

  return (
    <div className='flex items-center justify-center w-full gap-5'>
        <Button className={`font-semibold text-md ${!switchVideo ? 'text-white underline duration-300 transition-all ease-in-out' : 'text-black'}`} onClick={()=> setSwitchVideo(!switchVideo)} variant={'link'}>
            Short
        </Button>

        <Button className={`font-semibold black:text-white text-black text-md ${switchVideo ? 'text-black underline duration-300 transition-all ease-in-out' : 'text-white'}`} onClick={()=> setSwitchVideo(!switchVideo)} variant={'link'}>
            Long
        </Button>
    </div>
  )
}

export default SwitchUpload
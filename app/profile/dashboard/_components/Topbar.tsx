import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Topbar = ({content}: {content: string}) => {
  const router = useRouter();
  
  return (
    <div className='mx-4 relative top-2 font-poppins'>
        <div className='flex items-center w-full justify-between'>
            <Image 
              onClick={()=> router.back()}
              width={14} height={14} src={'/assets/Back.png'} alt='arrow_back' 
            />

            {/* Heading */}
            <div>
                <span className='text-xl text-white'>{content}</span>
            </div>

            <div className=''></div>
            
        </div>
    </div>
  )
}

export default Topbar
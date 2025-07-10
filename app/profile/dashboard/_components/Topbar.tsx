import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Topbar = () => {
  const router = useRouter();
  
  return (
    <div className='mx-4 relative top-6'>
        <div className='flex items-center justify-between'>
            <Image 
              onClick={()=> router.back()}
              width={20} height={20} src={'/assets/Back.png'} alt='arrow_back' className='text-black' 
            />

            {/* Heading */}
            <div>
                <span className='text-xl font-semibold'>Dashboard</span>
            </div>

            <div className='flex items-center gap-2'>
                <div className=''></div>
            </div>
        </div>
    </div>
  )
}

export default Topbar
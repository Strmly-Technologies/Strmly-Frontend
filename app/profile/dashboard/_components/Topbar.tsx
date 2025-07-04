import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Topbar = () => {
  return (
    <div className='mx-4 relative top-16'>
        <div className='flex items-center justify-between'>
            <Image width={30} height={20} src={'/assets/Back.png'} alt='arrow_back' className='border text-black' />

            <div>
                <span className='text-xl font-semibold'>Dashboard</span>
            </div>

            <div className='flex items-center gap-2'>
                <MoreHorizontal className='size-7'/>
            </div>
        </div>
    </div>
  )
}

export default Topbar
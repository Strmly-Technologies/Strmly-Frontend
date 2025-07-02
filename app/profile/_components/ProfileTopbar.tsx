import { ArrowLeftIcon, Bookmark, MoreHorizontal } from 'lucide-react'
import React from 'react'

const ProfileTopbar = () => {
  return (
    <div className='mx-4 relative top-16'>
        <div className='flex items-center justify-between'>
            <ArrowLeftIcon className='size-7' />

            <div>
                <span className='text-lg font-semibold'>Rahul Gupta</span>
            </div>

            <div className='flex items-center gap-2'>
                <Bookmark className='size-7'/>
                <MoreHorizontal className='size-7'/>
            </div>
        </div>
    </div>
  )
}

export default ProfileTopbar
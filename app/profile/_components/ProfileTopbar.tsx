import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, MoreHorizontal, LogOut } from 'lucide-react'
import React, { useState } from 'react'

interface ProfileTopbarProps {
  hashtag: boolean;
  name: string;
  handleLogout: () => void;
}

const ProfileTopbar = ({ hashtag, name, handleLogout }: ProfileTopbarProps) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className='mx-4 relative top-16'>
      <div className='flex items-center justify-between'>
        <ArrowLeftIcon className='size-7' />

        <div>
          <span className='text-lg font-semibold'>
            {hashtag && <span className='text-[#F1C40F]'>#</span>} {name}
          </span>
        </div>

        <div className='flex items-center gap-2 relative'>
          {/* Mobile Logout Button (hidden on desktop) */}
          

          {/* Desktop Dropdown */}
          <div className='md:hidden relative'>
            <MoreHorizontal 
              className='size-7 cursor-pointer'
              onClick={() => setShowDropdown(!showDropdown)}
            />
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10">
                <div 
                  className="py-1"
                  onClick={() => setShowDropdown(false)}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileTopbar
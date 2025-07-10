import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MoreHorizontal, LogOut } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

interface ProfileTopbarProps {
  hashtag: boolean;
  name: string;
}

const ProfileTopbar = ({ hashtag, name }: ProfileTopbarProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      // Call your logout API route
      const response = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear the auth store
      logout();

      // Redirect to login page
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setShowDropdown(false);
    }
  };

  return (
    <div className="mx-4 relative top-16">
      <div className="flex items-center justify-between">
        <Image
          onClick={() => router.back()}
          width={16}
          height={16}
          src={"/assets/Back.png"}
          alt="arrow_back"
          className="text-black"
        />

        <div>
          <span className="text-lg font-semibold">
            {hashtag && <span className="text-[#F1C40F]">#</span>} {name}
          </span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Desktop Dropdown */}
          <div className="md:hidden relative">
            <MoreHorizontal
              className="size-7 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10">
                <div className="py-1" onClick={() => setShowDropdown(false)}>
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
  );
};

export default ProfileTopbar;

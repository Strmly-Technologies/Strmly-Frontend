"use client"


import { useAuthStore } from "@/store/useAuthStore";
import EditForm from "../_components/EditForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function EditProfilePage() {
  
  const {user, token, isLoggedIn} = useAuthStore();
  const router = useRouter()

  const defaultValues = {
    username: user?.username || "", // hardcoded or fetched on server
    bio: "",
    profile_photo: user?.username?.charAt(0) || "", // optional
  };

  // useEffect(()=>{
  //   if(!isLoggedIn || !user || !token) router.push('/login');

  // }, [user, isLoggedIn, token]);

  return (
    <EditForm defaultValues={defaultValues} />
  )
  
}
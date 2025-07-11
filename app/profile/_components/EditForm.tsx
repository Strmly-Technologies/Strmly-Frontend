"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { Loader2, PencilIcon, CalendarIcon, MoveLeft } from "lucide-react";
import { profileFormSchema } from "@/lib/schemas/ProfileSchema";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";


const EditForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, token, isLoggedIn } = useAuthStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      bio: user?.bio || "",
      dob: user?.dob ? new Date(user.dob) : null,
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.image || null
  );

  useEffect(()=>{
    if(!isLoggedIn || !user || !token) router.push('/login');

  }, [user, isLoggedIn, token]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("bio", data.bio);

      if (data.dob) {
        formData.append("date_of_birth", data.dob.toISOString());
      }

      if (data.profile_photo) {
        formData.append("profile_photo", data.profile_photo);
      }

      const response = await fetch("/api/user/profile/edit", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
      // useAuthStore.getState().setUser(response.user);
      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } catch (error) {
      toast.error("There was an error updating your profile.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-20 my-10 mx-10">
      <div className="flex relative font-poppins items-center w-full justify-between">
        <Image
          onClick={() => router.back()}
          width={16}
          height={16}
          src={"/assets/Back.png"}
          alt="arrow_back"
          className="text-card"
        />
        <h2 className="text-xl text-[#F1C40F] font-semibold">
          Update Your Profile
        </h2>
        <div></div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md"
        >
          <div className="flex flex-col items-center justify-center">
            <Avatar className="size-28">
              <AvatarImage src={previewImage || ""} />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="relative -top-12 left-5 space-y-1">
              <Button
                type="button"
                variant="outline"
                className="rounded-full bg-card"
                onClick={() => fileInputRef.current?.click()}
              >
                <PencilIcon />
              </Button>
              <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          handleImageChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date (optional)</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      autoFocus
                      captionLayout="dropdown-years" // This adds year/month dropdowns
                      defaultMonth={
                        field.value ||
                        new Date(new Date().getFullYear() - 20, 0)
                      } // Default to 20 years ago
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="flex gap-2 text-card font-poppins w-full bg-[#F1C40F]"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditForm;

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { onBoardingFormSchema } from "@/lib/schemas/onBoardingSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2Icon, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// List of available interests
const INTERESTS = [
  "Technology",
  "Sports",
  "Music",
  "Travel",
  "Food",
  "Gaming",
  "Fitness",
];

const OnBoardingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequired, setIsRequired] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, token, isLoggedIn } = useAuthStore();

  const router = useRouter();

  useEffect(()=>{
    if(user && user.isOnboarded && isLoggedIn){
      router.back();
    } else if(!isLoggedIn){
      router.back()
    }
    setIsRequired(false);
  }, [token, isLoggedIn])

  const form = useForm<z.infer<typeof onBoardingFormSchema>>({
    resolver: zodResolver(onBoardingFormSchema),
    defaultValues: {
      username: "",
      bio: "",
      interests: [],
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  async function onSubmit(data: z.infer<typeof onBoardingFormSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("bio", data.bio);
      formData.append("dob", data.dob.toISOString());
      formData.append("interests", JSON.stringify(data.interests));

      if (data.profile_photo) {
        formData.append("profile_photo", data.profile_photo);
      }

      const response = await fetch("/api/onboarding", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to submit onboard data");
      }

      toast.success("Profile updated successfully");
      setTimeout(()=>{
        router.push('/')
      }, 500);
    } catch (error) {
      toast.error("There was an error while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-20 my-10 mx-10">
      {isRequired ? (
        <div className="w-full h-96 flex items-center justify-center -mt-20 relative">
          <div className="w-8 h-8 border-4 border-[#F1C40F] border-t-transparent rounded-full animate-spin" />
        </div>
      ):
      <>
      <div>
        <h2 className="text-xl text-[#F1C40F] font-semibold">
          Get Onboard With Us
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md"
        >
          <div className="flex flex-col items-center justify-center">
            <Avatar className="size-28">
              <AvatarImage src={previewImage || ""} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="relative -top-12 left-5 space-y-1">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
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
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Date Of Birth</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      autoFocus
                      captionLayout="dropdown-years" // This enables year dropdown
                      defaultMonth={field.value || new Date(new Date().getFullYear() - 20, 0)} // Default to 20 years ago
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={() => (
              <FormItem className="ml-4">
                <div className="grid grid-cols-2 gap-2 justify-between items-center">
                  {INTERESTS.map((interest) => (
                    <FormField
                      key={interest}
                      control={form.control}
                      name="interests"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={interest}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                className="border-[#F1C40F]"
                                checked={field.value?.includes(interest)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, interest])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== interest
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {interest}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="flex gap-2 items-center w-full text-black bg-[#F1C40F]"
          >
            {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Save & continue
          </Button>
        </form>
      </Form>
      </>
    }
    </div>
  );
};

export default OnBoardingForm;

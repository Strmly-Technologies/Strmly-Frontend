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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { Loader2, PencilIcon } from "lucide-react";
import { profileFormSchema } from "@/lib/schemas/ProfileSchema";
import { toast } from "sonner";

interface ProfileFormProps {
  defaultValues?: Partial<z.infer<typeof profileFormSchema>>;
}

const EditPage = ({ defaultValues }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: defaultValues?.username || "",
      bio: defaultValues?.bio || "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    defaultValues?.profile_photo || null
  );

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
      if (data.profile_photo) {
        formData.append("profile_photo", data.profile_photo);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("There was an error updating your profile.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-20 my-10">
      <div>
        <h2 className="text-xl font-semibold text-primary">Update Your Profile</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex  flex-col items-center justify-center">
            <Avatar className="size-28">
              <AvatarImage src={previewImage || ""} />
              <AvatarFallback>
                {defaultValues?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="relative -top-12 left-5 space-y-1">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <PencilIcon className=""/>
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

          <Button type="submit" disabled={isLoading} className="flex gap-2 w-full bg-[#F1C40F]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditPage;

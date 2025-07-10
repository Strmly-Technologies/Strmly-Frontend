"use client";

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
import { editCommunitySchema } from "@/lib/schemas/editCommunitySchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const EditCommunityForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {token, isLoggedIn} = useAuthStore();
    
  const params = useParams();
  const communityId = params.id;

  const form = useForm<z.infer<typeof editCommunitySchema>>({
    resolver: zodResolver(editCommunitySchema),
    defaultValues: {
      newName: "",
      bio: "",
    },
  });

  
  async function onSubmit(data: z.infer<typeof editCommunitySchema>) {
    setIsLoading(true);

    try {
      const results = [];

      if (data.bio) {
        results.push(
          fetch("/api/user/personalcommunity/edit", {
            method: "PUT",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ bio: data.bio, communityId }),
            credentials: 'include'
          })
        );
      }

      if (data.newName) {
        results.push(
          fetch("/api/user/personalcommunity/edit", {
            method: "PUT",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ name: data.newName, communityId }),
            credentials: 'include'
          })
        );
      }

      const responses = await Promise.all(results);
      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("Community updated successfully");
        router.push("/profile");
      } else {
        toast.error("Some updates failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-20 my-10 mx-10">
      <h2 className="text-xl text-[#F1C40F] font-semibold">
        Edit Your Community
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="newName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter new name (optional)" {...field} />
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
                    placeholder="Update bio (optional)"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
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
            Update Community
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditCommunityForm;

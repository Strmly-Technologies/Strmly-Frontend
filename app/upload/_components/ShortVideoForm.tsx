"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  community: z.string().min(1, "Community is required"),
  tags: z.string().optional(),
  newCommunityName: z.string().optional(),
  newCommunityDescription: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.community === "create-new" && !data.newCommunityName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["newCommunityName"],
      message: "Community name is required",
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

type ShortVideoFormProps = {
  videoURL: string;
  videoBlob: Blob;
  onBack: () => void;
};

const ShortVideoForm = ({ videoURL, videoBlob, onBack }: ShortVideoFormProps) => {
  const [showCreateCommunityFields, setShowCreateCommunityFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, isLoggedIn, token } = useAuthStore();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      community: "",
      tags: "",
      newCommunityName: "",
      newCommunityDescription: "",
    },
  });

  const selectedCommunity = form.watch("community");

  useEffect(() => {
    setShowCreateCommunityFields(selectedCommunity === "create-new");
  }, [selectedCommunity]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "short-video.mp4");
      formData.append("description", data.description);
      formData.append("community", data.community);
      if (data.tags) formData.append("tags", data.tags);
      
      if (data.community === "create-new") {
        formData.append("newCommunityName", data.newCommunityName || "");
        formData.append("newCommunityDescription", data.newCommunityDescription || "");
      }

      // Append additional data to FormData
        formData.append("user", JSON.stringify(user));

      const response = await fetch("/api/upload/long", {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      
      toast("Upload successful");

      router.push(`/video/${result.videoId}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast("Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-black text-white p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">Video Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Preview */}
        <div className="h-64 md:h-96">
          <video
            src={videoURL}
            controls
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter video description (min 10 characters)"
                      rows={4}
                      {...field}
                      className="rounded-xl bg-gray-900 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Community Select */}
            <FormField
              control={form.control}
              name="community"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select community" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      <SelectItem value="general" className="hover:bg-gray-800">
                        Owned
                      </SelectItem>
                      <SelectItem value="premium" className="hover:bg-gray-800">
                        Joined
                      </SelectItem>
                      <SelectItem value="create-new" className="hover:bg-gray-800 text-yellow-400">
                        + Create New Community
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Community Creation Fields */}
            {showCreateCommunityFields && (
              <>
                <FormField
                  control={form.control}
                  name="newCommunityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Community name"
                          {...field}
                          className="rounded-xl bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newCommunityDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Community description (optional)"
                          rows={2}
                          {...field}
                          className="rounded-xl bg-gray-900 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Tags (Optional) */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Add tags (comma separated, optional)"
                      {...field}
                      className="rounded-xl bg-gray-900 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : 
               showCreateCommunityFields ? "Create Community & Upload Video" : "Upload Video"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ShortVideoForm;
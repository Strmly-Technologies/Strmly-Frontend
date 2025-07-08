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

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  community: z.string().min(1, "Community is required"),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ShortVideoFormProps = {
  videoURL: string;
  onBack: () => void;
};

const ShortVideoForm = ({ videoURL, onBack }: ShortVideoFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      community: "",
      tags: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    console.log("Video URL:", videoURL);
    // Add your API call here
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select community" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      <SelectItem value="general" className="hover:bg-gray-800">
                        General
                      </SelectItem>
                      <SelectItem value="premium" className="hover:bg-gray-800">
                        Premium
                      </SelectItem>
                      <SelectItem value="exclusive" className="hover:bg-gray-800">
                        Exclusive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            >
              Upload Video
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ShortVideoForm;
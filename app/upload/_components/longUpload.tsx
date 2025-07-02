import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";

// Schema with validation
const formSchema = z.object({
  type: z.string().min(1, "Type is required"),
  episode: z.string().min(1, "Episode is required"),
  title: z.string().min(1, "Title is required"),
  series: z.string().min(1, "Series is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  community: z.string().min(1, "Community is required"),
  genre: z.string().min(1, "Genre is required"),
  access: z.string().min(1, "Access type is required"),
  price: z.string(),
  videoFile: z.instanceof(File).optional(),
  thumbnailFile: z
    .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      })
      .optional(),
  videoType: z.string().min(1, "Video Type type is required"),
  language: z.string().min(1, "Language is required"),
  Tags: z.string().min(1, "tag is required"),
  ageRestriction: z.string().min(1, "age restriction is required"),
});

type FormValues = z.infer<typeof formSchema>;

const LongVideoUpload = () => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      episode: "",
      title: "",
      series: "",
      description: "",
      community: "",
      genre: "",
      access: "",
      price: "",
    },
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "image") => {
      const file = e.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        if (type === "video") {
          form.setValue("videoFile", file);
          setVideoPreview(previewUrl);
        } else {
          form.setValue("thumbnailFile", file);
          setImagePreview(previewUrl);
        }
      }
    },
    [form]
  );

  const handleRemoveFile = (type: "video" | "image") => {
    if (type === "video") {
      form.setValue("videoFile", undefined);
      setVideoPreview(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
    } else {
      form.setValue("thumbnailFile", undefined);
      setImagePreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Handle form submission
      console.log("Form data:", data);
      // Add your API call here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mx-5 mt-5">
        <X className="size-5" />

        <h2>New Video</h2>

        {currentStep === 1 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            variant={"link"}
            className="text-yellow-400"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStep(currentStep - 1)}
            variant={"link"}
            className="text-yellow-400"
          >
            Back
          </Button>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="m-4">
          {currentStep === 1 && (
            <div className="space-y-3">
              {/* Video Upload & Preview */}
              <div className="h-52">
                <Input
                  id="video"
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "video")}
                />

                <div className="h-full flex items-center justify-center border rounded-lg">
                  {videoPreview ? (
                    <div className="relative">
                      <video
                        src={videoPreview}
                        controls
                        className="rounded-md border"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                      <X
                        className="absolute top-1 right-1 cursor-pointer text-black hover:text-red-500 bg-white rounded-full"
                        onClick={() => handleRemoveFile("video")}
                      />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      variant={"outline"}
                      className="rounded-xl"
                    >
                      Upload File
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 items-center gap-2">
                {/* Type Dropdown */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="series">Series</SelectItem>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="documentary">
                            Documentary
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Episode Dropdown */}
                <FormField
                  control={form.control}
                  name="episode"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="Select episode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i + 1} value={`Episode ${i + 1}`}>
                              Episode {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Title Input */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
                        {...field}
                        className="h-14 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Series Input */}
              <FormField
                control={form.control}
                name="series"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter series name"
                        {...field}
                        className="h-14 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Textarea */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description (min 10 characters)"
                        rows={3}
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 space-y-1 grid-rows-2 items-center gap-2">
                {/* Community Dropdown */}
                <FormField
                  control={form.control}
                  name="community"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="Select community" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Genre Dropdown */}
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="action">Action</SelectItem>
                          <SelectItem value="comedy">Comedy</SelectItem>
                          <SelectItem value="drama">Drama</SelectItem>
                          <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                          <SelectItem value="fantasy">Fantasy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Access Dropdown */}
                <FormField
                  control={form.control}
                  name="access"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="Select access type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="subscription">
                            Subscription
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Dropdown (conditional) */}
                {form.watch("access") !== "free" && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="rounded-xl">
                            <SelectTrigger>
                              <SelectValue placeholder="Select price" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="4.99">$4.99</SelectItem>
                            <SelectItem value="9.99">$9.99</SelectItem>
                            <SelectItem value="14.99">$14.99</SelectItem>
                            <SelectItem value="19.99">$19.99</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              {/* Thumbnail Upload and preview  */}
              <div className="space-y-2 h-52">
                <Input
                  id="image"
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "image")}
                />

                <div className="h-full flex items-center justify-center border rounded-lg">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || ""}
                        alt="Thumbnail Preview"
                        className="rounded-md border"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                      <X
                        className="absolute top-1 right-1 cursor-pointer text-red-500 bg-white rounded-full"
                        onClick={() => handleRemoveFile("image")}
                      />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      variant={"outline"}
                      className="rounded-xl"
                    >
                      Upload Thumbnail
                    </Button>
                  )}
                </div>
              </div>

              {/* Type Dropdown */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="Video type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single Video</SelectItem>
                        <SelectItem value="series">Series</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Episode Dropdown */}
              <FormField
                control={form.control}
                name="episode"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="multiple">Multiple</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 items-center gap-2">
                {/* Type Dropdown */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="Tags" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="series">Series</SelectItem>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="documentary">
                            Documentary
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Episode Dropdown */}
                <FormField
                  control={form.control}
                  name="episode"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="Age restriction" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i + 1} value={`Episode ${i + 1}`}>
                              Episode {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="bg-[#F1C40F] w-full my-10">
                Submit
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default LongVideoUpload;

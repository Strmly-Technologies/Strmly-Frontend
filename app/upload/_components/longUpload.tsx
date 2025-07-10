import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

// Updated schema with required videoFile and new community fields
const formSchema = z
  .object({
    // Required fields
    type: z.string().min(1, "Type is required"),
    title: z.string().min(1, "Title is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    community: z.string().min(1, "Community is required"),
    genre: z.string().min(1, "Genre is required"),
    access: z.string().min(1, "Access type is required"),
    videoFile: z.instanceof(File, { message: "Video file is required" }),
    language: z.string().min(1, "Language is required"),
    age_restriction: z.string().min(1, "Age restriction is required"),

    // Optional fields
    series: z.string().optional(),
    price: z.string().optional(),
    thumbnailFile: z
      .instanceof(File)
      .refine((file) => !file || file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      })
      .optional(),
    newCommunityName: z.string().optional(),
    newCommunityDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only require new community fields if creating new community
    if (data.community === "create" && !data.newCommunityName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newCommunityName"],
        message: "Community name is required when creating new community",
      });
    }

    // Only require price if access is paid
    if (data.access === "paid" && !data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Price is required for paid access",
      });
    }

    // Only require series if type is series
    if (data.type === "series" && !data.series) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["series"],
        message: "Series is required for series type",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

const LongVideoUpload = () => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCreateCommunityFields, setShowCreateCommunityFields] =
    useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { user, token, isLoggedIn } = useAuthStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      title: "",
      series: "",
      description: "",
      community: "",
      newCommunityName: "",
      newCommunityDescription: "",
      genre: "",
      access: "",
      price: "",
      language: "",
      age_restriction: "",
    },
  });

  const watchType = form.watch("type");
  const watchAccess = form.watch("access");
  const watchCommunity = form.watch("community");

  useEffect(() => {
    setShowCreateCommunityFields(watchCommunity === "create");
  }, [watchCommunity]);

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
      form.setValue("videoFile", undefined as any); // Force clear required field
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
      const formData = new FormData();

      // Required fields
      formData.append("type", data.type);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("community", data.community);
      formData.append("genre", data.genre);
      formData.append("access", data.access);
      formData.append("language", data.language);
      formData.append("age_restriction", data.age_restriction);
      formData.append("videoType", 'long');

      // Optional fields
      if (data.series) formData.append("series", data.series);
      if (data.price) formData.append("price", data.price);
      if (data.newCommunityName)
        formData.append("newCommunityName", data.newCommunityName);
      if (data.newCommunityDescription)
        formData.append(
          "newCommunityDescription",
          data.newCommunityDescription
        );

      // File uploads
      if (data.videoFile) formData.append("videoFile", data.videoFile);
      if (data.thumbnailFile)
        formData.append("thumbnailFile", data.thumbnailFile);

      // Optional: Auth (if you have user/token)
      formData.append("user", JSON.stringify(user));

      const response = await fetch("/api/upload/long", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      toast("✅ Video uploaded successfully!");

      // Clear form & state
      form.reset();
      setVideoPreview(null);
      setImagePreview(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
      setCurrentStep(1);
      setShowNewSeriesInput(false);
      setShowCreateCommunityFields(false);
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast("Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mx-5 mt-5">
        <X onClick={() => router.back()} className="size-5" />
        <h2>New Video</h2>
        {currentStep === 1 ? (
          <Button
            onClick={async () => {
              const valid = await form.trigger([
                "type",
                "title",
                "description",
                "community",
                "genre",
                "access",
                "videoFile",
              ]);

              if (valid) {
                setCurrentStep(currentStep + 1);
              }
            }}
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
              {/* Video Upload & Preview (Required) */}
              <div className="h-52">
                <Input
                  id="video"
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "video")}
                  required
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
                      Upload Video (Required)
                    </Button>
                  )}
                </div>
                {form.formState.errors.videoFile && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.videoFile.message}
                  </p>
                )}
              </div>

              {/* Type Dropdown */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== "series") {
                          form.setValue("series", "");
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="movie">Single</SelectItem>
                        <SelectItem value="series">Series</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Series Input - Only shown when type is "series" */}
              {watchType === "series" && (
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="series"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-2">
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="rounded-xl flex-1">
                                <SelectValue placeholder="Select series" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="series1">
                                  Series 1
                                </SelectItem>
                                <SelectItem value="series2">
                                  Series 2
                                </SelectItem>
                                <SelectItem value="series3">
                                  Series 3
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() =>
                              setShowNewSeriesInput(!showNewSeriesInput)
                            }
                          >
                            {showNewSeriesInput ? "Cancel" : "New Series"}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showNewSeriesInput && (
                    <Input
                      placeholder="Enter new series name"
                      className="h-14 rounded-xl"
                      onChange={(e) => form.setValue("series", e.target.value)}
                    />
                  )}
                </div>
              )}

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

              {/* Community Dropdown with Create Option */}
              <FormField
                control={form.control}
                name="community"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowCreateCommunityFields(value === "create");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="Select community" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="owned">Owned Communities</SelectItem>
                        <SelectItem value="joined">
                          Joined Communities
                        </SelectItem>
                        <SelectItem value="create" className="text-yellow-400">
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
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="newCommunityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Community name (required)"
                            {...field}
                            className="h-14 rounded-xl"
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
                            className="rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
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
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== "paid") {
                            form.setValue("price", "");
                          }
                        }}
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
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Dropdown (conditional) */}
                {watchAccess === "paid" && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter price in USD"
                            {...field}
                            className="rounded-xl"
                            min={1}
                          />
                        </FormControl>
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
              {/* Thumbnail Upload and preview */}
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
                {form.formState.errors.thumbnailFile && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.thumbnailFile.message}
                  </p>
                )}
              </div>

              {/* Language Dropdown */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age Restriction Dropdown */}
              <FormField
                control={form.control}
                name="age_restriction"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="Select age restriction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3-10">3-10</SelectItem>
                        <SelectItem value="10-15">10-15</SelectItem>
                        <SelectItem value="15-20">15-20</SelectItem>
                        <SelectItem value="21-30">21-30</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-[#F1C40F] w-full my-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Submit"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default LongVideoUpload;

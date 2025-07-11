import { z } from "zod";

export const onBoardingFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  uniqueId: z
    .string()
    .min(3, { message: "Unique ID must be at least 3 characters." })
    .max(20, { message: "Unique ID must not exceed 20 characters." }),

  bio: z.string().max(160).optional(),
  profile_photo: z.any().optional(), // For file upload
  dob: z.date({
    required_error: "Date of birth is required",
  }),
  interests: z.array(z.string()).min(2, {
    message: "You must select at least 2 interests",
  }),
});

export type ProfileFormValues = z.infer<typeof onBoardingFormSchema>;

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
  bio: z.string().max(160).min(4),
  profile_photo: z.any().optional(), // For file upload
  dob: z.date({
    required_error: "Date of birth is required",
  }),
  interests: z.array(z.string())
    .min(2, {
      message: "You must select at least 2 interests",
    }),
});

export type ProfileFormValues = z.infer<typeof onBoardingFormSchema>;
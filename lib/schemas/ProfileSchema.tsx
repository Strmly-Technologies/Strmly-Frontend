import { z } from "zod";

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  bio: z.string().max(160).min(4),
  dob: z.date().optional().nullable(), // Make dob optional and nullable
  profile_photo: z.any().optional(), // For file upload
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

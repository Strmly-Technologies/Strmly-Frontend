// lib/schemas/communityFormSchema.ts
import { z } from "zod";

export const communityFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  type: z.string().min(1, "Type is required"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than zero"),
  fee_description: z
    .string()
    .min(5, "Fee description must be at least 5 characters"),
});

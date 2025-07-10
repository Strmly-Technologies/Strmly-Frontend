// lib/schemas/editCommunitySchema.ts
import { z } from "zod";

export const editCommunitySchema = z.object({
  newName: z.string().optional(),
  bio: z.string().optional(),
});

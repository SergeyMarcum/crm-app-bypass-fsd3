// src/shared/lib/schemas.ts
import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  full_name: z.string().nullable(),
  email: z.string().email().nullable(),
  role_id: z.number(),
  avatar: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

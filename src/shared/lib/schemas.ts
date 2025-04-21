// src/shared/lib/schemas.ts
import * as z from "zod";

export const userSchema = z.object({
  id: z.number(),
  full_name: z.string().nullable(),
  email: z.string().email().nullable(),
  role_id: z.number(),
  status_id: z.number().nullable(),
});

export type User = z.infer<typeof userSchema>;

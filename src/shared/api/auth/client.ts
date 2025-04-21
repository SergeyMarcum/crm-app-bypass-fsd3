// src/shared/api/auth/client.ts
import { axios } from "../axios";
import { z } from "zod";
import { userSchema } from "@shared/lib/schemas";

const loginResponseSchema = z.object({
  user: userSchema,
  session_code: z.string(),
});

export const authApi = {
  login: async (credentials: { login: string; password: string }) => {
    const response = await axios.post("/login", credentials);
    return loginResponseSchema.parse(response.data);
  },
};

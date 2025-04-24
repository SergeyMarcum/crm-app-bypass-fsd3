// src/shared/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Имя пользователя обязательно"),
  password: z.string().min(1, "Требуется пароль"),
  domain: z.string().min(1, "Требуется домен"),
  rememberMe: z.boolean().optional(),
  isTestMode: z.boolean().optional(),
});

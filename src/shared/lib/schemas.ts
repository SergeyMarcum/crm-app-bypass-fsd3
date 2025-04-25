// src/shared/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
  domain: z.string().min(1, "Выберите домен"),
  rememberMe: z.boolean().optional(),
  isTestMode: z.boolean().optional(),
});

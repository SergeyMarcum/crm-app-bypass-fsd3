// src/shared/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Логин обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
  domain: z.string().min(1, "Выберите домен"),
  rememberMe: z.boolean(),
});

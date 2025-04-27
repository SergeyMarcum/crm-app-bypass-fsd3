// src/shared/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
  domain: z.string().min(1, "Выберите домен"),
  rememberMe: z.boolean().optional(),
  isTestMode: z.boolean().optional(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    role_id: z.number(),
  }),
});

export const domainListSchema = z.record(z.string());

// src/shared/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
  domain: z.string().min(1, "Выберите домен"),
  rememberMe: z.boolean().optional(),
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

export const userSchema = z.object({
  id: z.number(),
  full_name: z.string().nullable(),
  company: z.string().nullable(),
  email: z.string().nullable(),
  role_id: z.number(),
  status_id: z.number().nullable(),
  domain: z.string().nullable(),
  name: z.string(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  phone: z.string().nullable(),
});

export const companyUsersResponseSchema = z.object({
  users: z.array(userSchema),
  departments: z.array(z.string()),
});

export const editUserSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  full_name: z.string(),
  position: z.string(),
  company: z.string(),
  department: z.string(),
  email: z.string(),
  phone: z.string(),
  role_id: z.number(),
  status_id: z.number(),
});

export const currentUserSchema = userSchema;

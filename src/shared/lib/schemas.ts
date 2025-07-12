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
    id: z.string(), // ID в ответе на логин может быть строкой
    name: z.string(),
    role_id: z.number(),
  }),
});

export const domainListSchema = z.record(z.string());

export const userSchema = z.object({
  id: z.number().optional().nullable(), // ИСПРАВЛЕНО: 'id' теперь опциональный и может быть null
  login: z.string().optional().nullable(),
  system_login: z.string().optional().nullable(),
  full_name: z.string().nullable(),
  company: z.string().nullable(),
  email: z.string().nullable(),
  role_id: z.number(),
  status_id: z.number().nullable().optional(),
  domain: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
});

export const companyUsersResponseSchema = z.object({
  users: z.array(userSchema),
  departments: z.array(z.string()),
});

export const editUserSchema = z.object({
  user_id: z.number(),
  name: z.string().optional(),
  full_name: z.string().optional(),
  position: z.string().optional(),
  company: z.string().optional(),
  department: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  role_id: z.number().optional(),
  status_id: z.number().optional(),
});

export const currentUserSchema = userSchema;
// src/shared/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
  domain: z.string().min(1, "Выберите домен"),
  rememberMe: z.boolean().optional(),
});

export const loginResponseSchema = z.object({
  status: z.string(),
  token: z.string(),
  user: z.object({
    login: z.string(),
    system_login: z.string(),
    full_name: z.string().nullable(),
    position: z.string().nullable(),
    email: z.string().nullable(),
    department: z.string().nullable(),
    company: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    photo: z.string().nullable(),
    role_id: z.number(),
    user_id: z.number(), // Соответствует API
  }),
});

export const domainListSchema = z.record(z.string());

export const userSchema = z.object({
  id: z.number().nullable(),
  login: z.string().optional().nullable(),
  system_login: z.string().optional().nullable(),
  full_name: z.string().nullable(),
  company: z.string().nullable(),
  email: z.string().nullable(),
  role_id: z.number(),
  status_id: z.number().nullable(),
  domain: z.string().nullable(),
  name: z.string().nullable(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
  user_id: z.number().optional(), // Добавлено для поддержки API
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

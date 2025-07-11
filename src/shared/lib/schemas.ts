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

// *** ИЗМЕНЕННАЯ userSchema ***
export const userSchema = z.object({
  // Поля, которые отсутствуют в auth_user из localStorage, сделаны необязательными.
  // Поле 'login' добавлено, так как оно присутствует в auth_user.
  id: z.number().optional(), // id отсутствует в auth_user из консоли, делаем необязательным
  login: z.string(), // Добавляем поле 'login', так как оно присутствует
  system_login: z.string().optional(), // 'system_login' также присутствует, делаем необязательным на всякий случай
  full_name: z.string().nullable(),
  company: z.string().nullable(),
  email: z.string().nullable(),
  role_id: z.number(),
  status_id: z.number().nullable().optional(), // status_id отсутствует, делаем необязательным
  domain: z.string().nullable().optional(), // domain отсутствует, делаем необязательным
  name: z.string().optional(), // name отсутствует (вместо него 'login'), делаем необязательным
  position: z.string().nullable(),
  department: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable().optional(), // address присутствует, но можно сделать необязательным, если не всегда есть
  photo: z.string().nullable().optional(), // photo присутствует, но можно сделать необязательным
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

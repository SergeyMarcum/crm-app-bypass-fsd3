// src/entities/user/types.ts
export interface User {
  id?: number | null; // Изменено: может быть опциональным и null для согласованности со схемой
  full_name: string | null;
  company: string | null;
  email: string | null;
  role_id: number;
  status_id: number | null; // Теперь без 'undefined' чтобы соответствовать схеме
  domain: string | null;
  name: string | null;
  position: string | null;
  department: string | null;
  phone: string | null;
  login?: string | null;
  system_login?: string | null;
  address?: string | null;
  photo?: string | null;
  tech_support_email?: string | null; // Добавлено новое поле
}

export interface NormalizedUser {
  id: number;
  fullName: string;
  department: string;
  email: string;
  phone: string;
  accessRights: string;
  status: string;
  company: string;
  position: string;
  name: string;
  photo: string | null;
  [key: string]: unknown;
}

export interface EditUserPayload {
  user_id: number;
  name: string;
  full_name: string;
  position: string;
  company: string;
  department: string;
  email: string;
  phone: string;
  role_id: number;
  status_id: number;
}

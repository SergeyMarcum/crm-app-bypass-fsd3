// src/entities/user/types.ts
export interface User {
  id: number;
  full_name: string | null;
  company: string | null;
  email: string | null;
  role_id: number;
  status_id: number | null;
  domain: string | null;
  name: string;
  position: string | null;
  department: string | null;
  phone: string | null;
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

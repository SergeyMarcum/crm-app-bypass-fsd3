// src/features/auth/types.ts

export interface User {
  id: number | null;
  full_name: string | null;
  company: string | null;
  email: string | null;
  role_id: number;
  status_id: number | null;
  domain: string | null;
  name: string | null;
  position: string | null;
  department: string | null;
  phone: string | null;
  login?: string | null;
  system_login?: string | null;
  address?: string | null;
  photo?: string | null;
  tech_support_email?: string | null;
}

export interface Credentials {
  username: string;
  password: string;
  domain: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  status: "OK" | "ERROR";
  token: string;
  user: User;
}

export interface Domain {
  id: string; // Например, "orenburg" или "irf"
  name: string; // Например, "Оренбургский филиал (тестовый)"
}

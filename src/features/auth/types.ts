// src/features/auth/types.ts
export interface Credentials {
  username: string;
  password: string;
  domain: string;
  rememberMe?: boolean;
}

export interface User {
  login: string;
  system_login: string;
  full_name: string;
  position: string;
  email: string;
  department: string;
  company: string;
  phone: string;
  address: string;
  photo: string | null;
  role_id: number;
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

// src/features/auth/types.ts
export interface Credentials {
  username: string;
  password: string;
  domain: string;
  rememberMe?: boolean;
}

export interface Domain {
  id: string;
  name: string;
}

export interface User {
  id: number | null;
  login: string | null;
  system_login: string | null;
  full_name: string | null;
  position: string | null;
  email: string | null;
  department: string | null;
  company: string | null;
  phone: string | null;
  address: string | null;
  photo: string | null;
  role_id: number;
  status_id: number | null;
  domain: string | null;
  name: string | null;
}

export interface AuthResponse {
  status: string;
  token: string;
  user: {
    login: string;
    system_login: string;
    full_name: string | null;
    position: string | null;
    email: string | null;
    department: string | null;
    company: string | null;
    phone: string | null;
    address: string | null;
    photo: string | null;
    role_id: number;
    user_id: number; // Соответствует API
  };
}

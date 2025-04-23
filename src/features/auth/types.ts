// src/features/auth/types.ts
export interface Credentials {
  username: string;
  password: string;
  domain: string;
}

export interface User {
  username: string;
  role_id: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  domain: string | null;
  sessionCode: string | null;
}

export interface ApiError {
  code: number;
  message: string;
}

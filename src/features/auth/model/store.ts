// src/features/auth/model/store.ts
import { create } from "zustand";
import { authApi } from "@shared/api/auth/client";

interface User {
  id: number;
  full_name: string;
  email: string | null;
  role_id: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { login: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    const response = await authApi.login(credentials);
    set({
      user: response.user,
      isAuthenticated: true,
    });
    localStorage.setItem("session_code", response.session_code);
  },
  logout: () => {
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
}));

// src/features/auth/model/store.ts
import { create } from "zustand";

interface AuthState {
  user: { id: number; name: string } | null;
  isAuthenticated: boolean;
  login: (credentials: { login: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Логика авторизации через API
    set({ user: { id: 1, name: "User" }, isAuthenticated: true });
  },
  logout: () => {
    localStorage.clear();
    sessionStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
}));

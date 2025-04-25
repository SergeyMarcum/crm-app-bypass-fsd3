// src/features/auth/model/store.ts
import { create } from "zustand";
import { authApi } from "@shared/api/auth";

interface User {
  id: string;
  name: string;
  role_id: number;
}

interface Domain {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  domains: Domain[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: {
    username: string;
    password: string;
    domain: string;
    rememberMe: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: (
    domain: string,
    username: string,
    session_code: string
  ) => Promise<void>;
  fetchDomains: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  domains: [],
  isLoading: false,
  error: null,
  isAuthenticated: false,
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem("token", response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("login error:", err.message);
      set({
        isLoading: false,
        error: err.message.includes("Network Error")
          ? "Сервер недоступен. Проверьте подключение или настройки CORS."
          : "Ошибка авторизации",
      });
      throw err;
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: "Ошибка при выходе" });
      throw err;
    }
  },
  checkSession: async (domain, username, session_code) => {
    set({ isLoading: true });
    try {
      const response = await authApi.checkSession(
        domain,
        username,
        session_code
      );
      localStorage.setItem("token", response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: "Ошибка проверки сессии" });
      throw err;
    }
  },
  fetchDomains: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiResponse = await authApi.getDomainList();
      const domains: Domain[] = Object.entries(apiResponse).map(
        ([id, name]) => ({
          id,
          name: String(name),
        })
      );
      const limitedDomains = domains.slice(0, 10);
      console.log("fetchDomains: Transformed domains:", limitedDomains);
      set({ domains: limitedDomains, isLoading: false });
    } catch (err: any) {
      console.error("fetchDomains error:", err.message);
      set({
        isLoading: false,
        error: err.message.includes("Network Error")
          ? "Сервер недоступен. Проверьте подключение или настройки CORS."
          : "Не удалось загрузить домены. Попробуйте позже.",
      });
      throw err;
    }
  },
  initAuth: async () => {
    set({ isLoading: true });
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const response = await authApi.checkAuth();
        set({
          user: response.user,
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));

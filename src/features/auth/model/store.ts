// src/features/auth/model/store.ts
import { create } from "zustand";
import { authApi } from "@shared/api/auth";
import { loginResponseSchema, domainListSchema } from "@shared/lib/schemas";

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
  isSessionChecking: boolean;
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
  isSessionChecking: false,
  error: null,
  isAuthenticated: false,
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const parsedResponse = loginResponseSchema.parse(response);
      localStorage.setItem("session_token", parsedResponse.token);
      if (credentials.rememberMe) {
        localStorage.setItem("auth_domain", credentials.domain);
      }
      set({
        user: parsedResponse.user,
        token: parsedResponse.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message.includes("Network Error")
          ? "Сервер недоступен. Проверьте подключение или настройки CORS."
          : "Не удалось войти. Проверьте логин, пароль или настройки сервера.";
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
      localStorage.removeItem("session_token");
      localStorage.removeItem("auth_domain");
      set({
        user: null,
        token: null,
        domains: [],
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
      const parsedResponse = loginResponseSchema.parse(response);
      localStorage.setItem("session_token", parsedResponse.token);
      set({
        user: parsedResponse.user,
        token: parsedResponse.token,
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
      const parsedDomains = domainListSchema.parse(apiResponse);
      const domains: Domain[] = Object.entries(parsedDomains).map(
        ([id, name]) => ({
          id,
          name: String(name),
        })
      );
      const limitedDomains = domains.slice(0, 10);
      console.log("fetchDomains: Transformed domains:", limitedDomains);
      set({ domains: limitedDomains, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message.includes("Network Error")
          ? "Сервер недоступен. Проверьте подключение или настройки CORS."
          : "Не удалось загрузить домены. Попробуйте позже.";
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  initAuth: async () => {
    set({ isSessionChecking: true });
    try {
      const storedToken = localStorage.getItem("session_token");
      if (storedToken) {
        const response = await authApi.checkAuth();
        const parsedResponse = loginResponseSchema.parse(response);
        set({
          user: parsedResponse.user,
          token: storedToken,
          isAuthenticated: true,
          isSessionChecking: false,
        });
      } else {
        set({ isSessionChecking: false });
      }
    } catch {
      localStorage.removeItem("session_token");
      set({ isSessionChecking: false });
    }
  },
}));

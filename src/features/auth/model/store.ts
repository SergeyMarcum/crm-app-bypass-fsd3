// src/features/auth/model/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@shared/api/auth";
import { AuthResponse, Domain, User, Credentials } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  domains: Domain[];
  isLoading: boolean;
  isSessionChecking: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchDomains: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      domains: [],
      isLoading: false,
      isSessionChecking: false,
      error: null,
      isAuthenticated: false,

      login: async ({ username, password, domain, rememberMe }) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user }: AuthResponse = await authApi.login({
            username,
            password,
            domain,
          });
          set({ user, token, isAuthenticated: true, isLoading: false });
          localStorage.setItem("session_token", token);
          if (rememberMe) {
            localStorage.setItem("auth_domain", domain);
          }
        } catch (error) {
          set({ isLoading: false, error: "Ошибка авторизации" });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Даже при ошибке принудительно очищаем всё
        }
        localStorage.removeItem("session_token");
        localStorage.removeItem("auth_domain");
        set({
          user: null,
          token: null,
          domains: [],
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      fetchDomains: async () => {
        set({ isLoading: true, error: null });
        try {
          const raw = await authApi.getDomainList();
          const domains = Object.entries(raw).map(([id, name]) => ({
            id,
            name: String(name),
          }));
          set({ domains, isLoading: false });
        } catch {
          set({ isLoading: false, error: "Ошибка загрузки доменов" });
          throw new Error("Ошибка загрузки доменов");
        }
      },

      initAuth: async () => {
        set({ isSessionChecking: true });
        try {
          const storedToken = localStorage.getItem("session_token");
          if (storedToken) {
            const { user }: AuthResponse = await authApi.checkAuth();
            set({
              user,
              token: storedToken,
              isAuthenticated: true,
              isSessionChecking: false,
            });
          } else {
            set({ isSessionChecking: false });
          }
        } catch {
          localStorage.removeItem("session_token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isSessionChecking: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// src/features/auth/model/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@shared/api/auth"; // Предполагается, что authApi уже использует VITE_API_URL
import { AuthResponse, Domain, User, Credentials } from "../types";
import { storage } from "@shared/lib/storage"; // Импорт storage

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
          storage.set("session_token", token);
          storage.set("username", username); // Сохраняем логин пользователя
          storage.set("auth_user", JSON.stringify(user)); // Сохраняем объект пользователя

          if (rememberMe) {
            storage.set("auth_domain", domain);
          }
        } catch (error) {
          set({ isLoading: false, error: "Ошибка авторизации" });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          // Даже при ошибке принудительно очищаем всё
          console.error("Ошибка при выходе из системы через API:", error);
        } finally {
          storage.remove("session_token");
          storage.remove("auth_domain");
          storage.remove("username"); // Удаляем логин пользователя
          storage.remove("auth_user"); // Удаляем объект пользователя

          set({
            user: null,
            token: null,
            domains: [],
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
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
        } catch (error) {
          set({ isLoading: false, error: "Ошибка загрузки доменов" });
          throw error; // Перебрасываем ошибку для дальнейшей обработки, если необходимо
        }
      },

      initAuth: async () => {
        set({ isSessionChecking: true });
        try {
          const storedToken = storage.get("session_token");
          const storedUser = storage.get("auth_user");
          if (storedToken && storedUser) {
            set({
              user: JSON.parse(storedUser),
              token: storedToken,
              isAuthenticated: true,
              isSessionChecking: false,
            });
          } else {
            set({ isSessionChecking: false });
          }
        } catch (error) {
          console.error("Ошибка при инициализации аутентификации:", error);
          storage.remove("session_token");
          storage.remove("auth_domain");
          storage.remove("username");
          storage.remove("auth_user");
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
// src/features/auth/model/store.ts
import { create } from "zustand";
import { authApi } from "@shared/api/auth";
import { User, Domain, AuthResponse } from "../types";
import { storage } from "@shared/lib/storage";

interface AuthState {
  user: User | null;
  token: string | null;
  domains: Domain[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fetchDomains: () => Promise<void>;
  initAuth: () => Promise<void>;
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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  domains: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,

  fetchDomains: async () => {
    set({ isLoading: true, error: null });
    try {
      const domainList: Record<string, string> = await authApi.getDomainList();
      console.log("Получение ответов доменов:", domainList);
      const domains: Domain[] = Object.entries(domainList).map(
        ([id, name]) => ({
          id,
          name,
        })
      );
      if (domains.length === 0) {
        console.log("Нет доменов из API, используем запасной вариант");
        domains.push({ id: "orenburg", name: "Оренбург" });
      }
      set({ domains, isLoading: false });
    } catch (error) {
      console.error("Ошибка выборки доменов:", error);
      set({
        domains: [{ id: "orenburg", name: "Оренбург" }],
        error: "Не удалось получить домены",
        isLoading: false,
      });
    }
  },

  initAuth: async () => {
    const token = storage.get("auth_token");
    const user = storage.get("auth_user");
    const domain = storage.get("auth_domain");
    console.log("initAuth:", { token, user, domain });

    if (token && user && domain) {
      try {
        const parsedUser: User = JSON.parse(user);
        set({ token, user: parsedUser, isAuthenticated: true });
        console.log("Сессия восстановлена:", {
          user: parsedUser.login,
          domain,
        });
      } catch (error) {
        console.error("Не удалось восстановить сеанс:", error);
        set({ error: "Не удалось восстановить сеанс", isAuthenticated: false });
        storage.remove("auth_token");
        storage.remove("auth_user");
        storage.remove("auth_domain");
      }
    } else {
      console.log("Данные авторизации не найдены в локальном хранилище");
    }
  },

  login: async ({ username, password, domain, rememberMe }) => {
    console.log("Вход в систему вызывается с помощью:", {
      username,
      domain,
      rememberMe,
    });
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await authApi.login({
        username,
        password,
        domain,
      });
      console.log("Ответ API для входа в систему:", response);
      if (response.status === "OK") {
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
        console.log("Вход в систему успешный, isAuthenticated:", true);
        // Временно сохраняем всегда для теста
        storage.set("auth_token", response.token);
        storage.set("auth_user", JSON.stringify(response.user));
        storage.set("auth_domain", domain);
        console.log("Данные сохраняются в локальном хранилище:", {
          token: response.token,
          user: response.user.login,
          domain,
          rememberMe,
        });
      } else {
        console.error("Вход в систему не удался, ответ:", response);
        set({ error: "Вход в систему не удался", isLoading: false });
      }
    } catch (error) {
      console.error("Ошибка входа в систему:", error);
      set({
        error: "Неверные учетные данные или ошибка сервера",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    console.log("Выход из системы вызывается из:", new Error().stack);
    try {
      await authApi.logout();
      set({ user: null, token: null, isAuthenticated: false });
      storage.remove("auth_token");
      storage.remove("auth_user");
      storage.remove("auth_domain");
      console.log("Вышел из системы, локальное хранилище очищено");
    } catch (error) {
      console.error("Ошибка выхода из системы:", error);
      set({ error: "Выход из системы не удался" });
    }
  },

  checkSession: async (domain, username, session_code) => {
    try {
      await authApi.checkSession({ domain, username, session_code });
      console.log("Проверка сеанса успешна");
    } catch (error) {
      console.error("Ошибка проверки сеанса:", error);
      set({ error: "Проверка сеанса не удалась" });
    }
  },
}));

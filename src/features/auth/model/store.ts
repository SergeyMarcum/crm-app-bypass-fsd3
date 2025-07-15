// src/features/auth/model/store.ts
import { create, StateCreator } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { authApi } from "@shared/api/auth";
import { AuthResponse, Domain, User, Credentials } from "../types";
import { storage } from "@shared/lib/storage";

interface AuthState {
  user: User | null;
  token: string | null;
  domains: Domain[];
  isLoading: boolean;
  isSessionChecking: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isTestMode: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchDomains: () => Promise<void>;
  initAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setIsTestMode: (mode: boolean) => void;
}

type PersistedAuthState = Pick<AuthState, "token" | "user" | "isAuthenticated">;

const customStorage: PersistStorage<PersistedAuthState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

const authStateCreator: StateCreator<
  AuthState,
  [],
  [["zustand/persist", PersistedAuthState]]
> = (set, _get) => ({
  user: null,
  token: null,
  domains: [],
  isLoading: false,
  isSessionChecking: false,
  error: null,
  isAuthenticated: false,
  isTestMode: false,

  login: async ({ username, password, domain, rememberMe }) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user }: AuthResponse = await authApi.login({
        username,
        password,
        domain,
      });
      // Нормализуем user_id в id для соответствия типу User
      const normalizedUser: User = {
        id: user.user_id,
        login: user.login,
        system_login: user.system_login,
        full_name: user.full_name,
        position: user.position,
        email: user.email,
        department: user.department,
        company: user.company,
        phone: user.phone,
        address: user.address,
        photo: user.photo,
        role_id: user.role_id,
        status_id: null, // API /login не возвращает status_id
        domain: domain, // Используем domain из credentials
        name: user.full_name, // Предполагаем, что name совпадает с full_name
      };
      set({
        user: normalizedUser,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      storage.set("session_token", token);
      storage.set("username", username);
      storage.set("auth_user", JSON.stringify(normalizedUser));
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
      console.error("Ошибка при выходе из системы через API:", error);
    } finally {
      storage.remove("session_token");
      storage.remove("auth_domain");
      storage.remove("username");
      storage.remove("auth_user");

      set({
        user: null,
        token: null,
        domains: [],
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isTestMode: false,
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
      throw error;
    }
  },

  initAuth: async () => {
    set({ isSessionChecking: true });
    try {
      const storedToken = storage.get("session_token");
      const storedUser = storage.get("auth_user");
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        // Нормализуем user_id в id
        const normalizedUser: User = {
          ...userData,
          id: userData.user_id ?? userData.id ?? null,
          status_id: userData.status_id ?? null,
          domain: userData.domain ?? null,
          name: userData.name ?? userData.full_name ?? null,
        };
        set({
          user: normalizedUser,
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
        isTestMode: false,
      });
    }
  },

  updateUser: (userData) => {
    set((state) => {
      const updatedUser = { ...state.user, ...userData } as User;
      storage.set("auth_user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  setIsTestMode: (mode: boolean) => set({ isTestMode: mode }),
});

export const useAuthStore = create<AuthState>()(
  persist(authStateCreator, {
    name: "auth-storage",
    storage: customStorage,
    partialize: (state) => ({
      token: state.token,
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }),
  })
);

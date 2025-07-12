// src/features/auth/model/store.ts
import { create, StateCreator } from "zustand"; // Import StateCreator
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
  isTestMode: boolean; // Flag for test mode
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchDomains: () => Promise<void>;
  initAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setIsTestMode: (mode: boolean) => void; // Setter for test mode
}

// 1. Define the type of the state that will actually be persisted.
// This matches what `partialize` will return.
type PersistedAuthState = Pick<AuthState, "token" | "user" | "isAuthenticated">;

// 2. Create a custom storage object that correctly handles JSON serialization/deserialization
// for Zustand's `persist` middleware, wrapping `localStorage`.
const customStorage: PersistStorage<PersistedAuthState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    // `persist` expects the stored item to be a `StorageValue` object,
    // which contains the `state` and `version`.
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    // `value` here is the `StorageValue` object that `persist` provides.
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

// 3. Define the StateCreator for the core store logic explicitly.
// The generic parameters are:
//   - T: The full state type (AuthState)
//   - Mps: Middleware that *precede* this StateCreator (none here, so [])
//   - Mcs: Middleware that *wrap* this StateCreator (here, persist middleware which handles PersistedAuthState)
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
      set({ user, token, isAuthenticated: true, isLoading: false });
      storage.set("session_token", token);
      storage.set("username", username);
      storage.set("auth_user", JSON.stringify(user));
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
  persist(
    authStateCreator, // Pass the explicitly typed StateCreator here
    {
      name: "auth-storage", // Unique name for persistence
      storage: customStorage, // Use the custom storage object defined above
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // `isTestMode` is typically a runtime flag and not persisted
      }),
    }
  )
);
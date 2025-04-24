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
      console.log("Fetch domains response:", domainList);
      const domains: Domain[] = Object.entries(domainList).map(
        ([id, name]) => ({
          id,
          name,
        })
      );
      if (domains.length === 0) {
        console.log("No domains from API, using fallback");
        domains.push({ id: "orenburg", name: "Оренбург" });
      }
      set({ domains, isLoading: false });
    } catch (error) {
      console.error("Fetch domains error:", error);
      set({
        domains: [{ id: "orenburg", name: "Оренбург" }],
        error: "Failed to fetch domains",
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
        console.log("Session restored:", { user: parsedUser.login, domain });
      } catch (error) {
        console.error("Failed to restore session:", error);
        set({ error: "Failed to restore session", isAuthenticated: false });
        storage.remove("auth_token");
        storage.remove("auth_user");
        storage.remove("auth_domain");
      }
    } else {
      console.log("No auth data found in localStorage");
    }
  },

  login: async ({ username, password, domain, rememberMe }) => {
    console.log("Login called with:", { username, domain, rememberMe });
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await authApi.login({
        username,
        password,
        domain,
      });
      console.log("Login API response:", response);
      if (response.status === "OK") {
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
        console.log("Login successful, isAuthenticated:", true);
        // Временно сохраняем всегда для теста
        storage.set("auth_token", response.token);
        storage.set("auth_user", JSON.stringify(response.user));
        storage.set("auth_domain", domain);
        console.log("Data saved to localStorage:", {
          token: response.token,
          user: response.user.login,
          domain,
          rememberMe,
        });
      } else {
        console.error("Login failed, response:", response);
        set({ error: "Login failed", isLoading: false });
      }
    } catch (error) {
      console.error("Login error:", error);
      set({ error: "Invalid credentials or server error", isLoading: false });
    }
  },

  logout: async () => {
    console.log("Logout called from:", new Error().stack);
    try {
      await authApi.logout();
      set({ user: null, token: null, isAuthenticated: false });
      storage.remove("auth_token");
      storage.remove("auth_user");
      storage.remove("auth_domain");
      console.log("Logged out, localStorage cleared");
    } catch (error) {
      console.error("Logout error:", error);
      set({ error: "Logout failed" });
    }
  },

  checkSession: async (domain, username, session_code) => {
    try {
      await authApi.checkSession({ domain, username, session_code });
      console.log("Session check successful");
    } catch (error) {
      console.error("Session check error:", error);
      set({ error: "Session check failed" });
    }
  },
}));

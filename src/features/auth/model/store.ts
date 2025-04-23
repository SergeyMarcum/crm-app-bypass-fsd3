// src/features/auth/model/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/shared/api/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; role_id: number } | null;
  domain: string | null;
  sessionCode: string | null;
  login: (credentials: {
    username: string;
    password: string;
    domain: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      domain: null,
      sessionCode: null,
      login: async (credentials) => {
        console.log("Starting login with credentials:", credentials);
        const response = await authApi.login(credentials);
        set({
          isAuthenticated: true,
          user: { username: credentials.username, role_id: response.role_id },
          domain: credentials.domain,
          sessionCode: response.sessionCode,
        });
      },
      logout: async () => {
        await authApi.logout();
        set({
          isAuthenticated: false,
          user: null,
          domain: null,
          sessionCode: null,
        });
      },
      checkSession: async () => {
        const { user, domain, sessionCode } = get();
        console.log("Checking session with:", { user, domain, sessionCode });
        if (!user || !domain || !sessionCode) {
          console.log("No session data found");
          set({
            isAuthenticated: false,
            user: null,
            domain: null,
            sessionCode: null,
          });
          throw new Error("No session data");
        }
        await authApi.checkSession({
          username: user.username,
          domain,
          sessionCode,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

// src/features/auth/hooks/use-auth.ts
import { useAuthStore } from "@/features/auth/model/store";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/shared/api/auth";

export const useAuth = () => {
  const { isAuthenticated, login, logout, checkSession } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (credentials: {
    username: string;
    password: string;
    domain: string;
  }) => {
    await login(credentials);
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fetchDomains = async () => {
    return await authApi.getDomainList();
  };

  const verifySession = async () => {
    try {
      await checkSession();
    } catch (error) {
      console.error("Session verification failed:", error);
      throw error; // Let the caller handle the error
    }
  };

  return {
    isAuthenticated,
    handleLogin,
    handleLogout,
    checkSession,
    fetchDomains,
    verifySession, // Added verifySession
  };
};

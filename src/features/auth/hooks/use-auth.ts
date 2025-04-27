// src/features/auth/hooks/use-auth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@features/auth/model/store";

export function useAuth() {
  const {
    user,
    token,
    domains,
    isLoading,
    isSessionChecking,
    isAuthenticated,
    error,
    login,
    logout,
    checkSession,
    fetchDomains,
  } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (domains.length === 0 && !isLoading) {
      console.log("useAuth: Fetching domains");
      fetchDomains();
    }
  }, [fetchDomains, domains.length, isLoading]);

  useEffect(() => {
    if (user && isAuthenticated) {
      console.log("useAuth: Redirecting to /dashboard after login");
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  console.log("useAuth state:", {
    domains,
    isLoading,
    isSessionChecking,
    error,
  });

  return {
    user,
    token,
    domains,
    isLoading,
    isSessionChecking,
    error,
    login,
    logout,
    checkSession,
    fetchDomains,
  };
}

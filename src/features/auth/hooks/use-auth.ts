// src/features/auth/hooks/use-auth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../model/store";

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
    fetchDomains,
    initAuth,
  } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (domains.length === 0 && !isLoading) {
      fetchDomains();
    }
  }, [domains.length, isLoading, fetchDomains]);

  useEffect(() => {
    if (user && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  return {
    user,
    token,
    domains,
    isLoading,
    isSessionChecking,
    isAuthenticated,
    error,
    login,
    logout,
    fetchDomains,
    initAuth,
  };
}

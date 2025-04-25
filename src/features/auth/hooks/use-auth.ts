// src/features/auth/hooks/use-auth.ts
import { useEffect } from "react";
import { useAuthStore } from "../model/store";

export const useAuth = () => {
  const {
    user,
    token,
    domains,
    isLoading,
    error,
    fetchDomains,
    login,
    logout,
    checkSession,
  } = useAuthStore();

  useEffect(() => {
    console.log("useAuth: Получение доменов");
    fetchDomains();
  }, [fetchDomains]);

  console.log("состояние useAuth:", { domains, isLoading, error });

  return {
    user,
    token,
    domains,
    isLoading,
    error,
    login,
    logout,
    checkSession,
  };
};

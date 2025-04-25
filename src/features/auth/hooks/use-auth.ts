// src/features/auth/hooks/use-auth.ts
import { useEffect } from "react";
import { useAuthStore } from "@features/auth/model/store";

export function useAuth() {
  const {
    user,
    token,
    domains,
    isLoading,
    error,
    login,
    logout,
    checkSession,
    fetchDomains,
  } = useAuthStore();

  useEffect(() => {
    if (domains.length === 0 && !isLoading) {
      console.log("useAuth: Fetching domains");
      fetchDomains();
    }
  }, [fetchDomains, domains.length, isLoading]);

  console.log("useAuth state:", { domains, isLoading, error });

  return {
    user,
    token,
    domains,
    isLoading,
    error,
    login,
    logout,
    checkSession,
    fetchDomains,
  };
}

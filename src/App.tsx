// src/App.tsx
import { useEffect } from "react";
import type { JSX } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@features/auth/model/store";
import { AppRoutes } from "@app/routes";
import { AppInit } from "@app/init";

export function App(): JSX.Element {
  const { isAuthenticated, initAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log("App: initAuth called, current path:", location.pathname);
    initAuth();
  }, [initAuth]);

  console.log(
    "App render, isAuthenticated:",
    isAuthenticated,
    "path:",
    location.pathname
  );

  return (
    <AppInit>
      <AppRoutes />
    </AppInit>
  );
}

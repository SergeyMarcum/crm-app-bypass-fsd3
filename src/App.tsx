// src/App.tsx
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@features/auth/model/store";
import { AppRoutes } from "@app/routes";
import { AppInit } from "@app/init";

export function App() {
  const { isAuthenticated, initAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log("App initAuth called, current path:", location.pathname);
    initAuth();
  }, [initAuth]); // Убрана зависимость location.pathname

  console.log(
    "App render, isAuthenticated:",
    isAuthenticated,
    "path:",
    location.pathname
  );

  return (
    <AppInit>
      {isAuthenticated ? (
        <AppRoutes />
      ) : (
        <>
          {console.log("App: Redirecting to /login")}
          <Navigate to="/login" replace />
        </>
      )}
    </AppInit>
  );
}

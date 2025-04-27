// src/App.tsx
import { useEffect } from "react";
import { useAuthStore } from "@features/auth/model/store";
import { AppRoutes } from "@app/routes";
import { AppInit } from "@app/init";
import { CircularProgress, Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { JSX } from "react";

export function App(): JSX.Element {
  const { isSessionChecking, initAuth } = useAuthStore();

  useEffect(() => {
    console.log("App: initAuth called");
    initAuth();
  }, [initAuth]);

  if (isSessionChecking) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppInit>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </AppInit>
  );
}

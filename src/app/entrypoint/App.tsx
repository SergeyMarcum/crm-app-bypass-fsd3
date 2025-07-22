// src/App.tsx
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useAuthStore } from "@features/auth/model/store";
import { useThemeStore } from "@shared/processes/theme/store";
import { getTheme } from "@shared/config/theme";
import { AppRoutes } from "@app/routes";
import { AppInit } from "@app/init";
import { CircularProgress, Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { JSX } from "react";

export function App(): JSX.Element {
  const { isSessionChecking, initAuth } = useAuthStore();
  const { themeMode } = useThemeStore();

  useEffect(() => {
    console.log("App: initAuth called");
    initAuth();
  }, [initAuth]);

  if (isSessionChecking) {
    return (
      <ThemeProvider theme={getTheme(themeMode)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "var(--mui-palette-background-default)",
          }}
        >
          <CircularProgress sx={{ color: "var(--mui-palette-primary-main)" }} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <AppInit>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme={themeMode === "dark" ? "dark" : "light"}
          toastStyle={{
            backgroundColor: "var(--mui-palette-background-paper)",
            color: "var(--mui-palette-text-primary)",
          }}
          progressClassName="toast-progress"
        />
      </AppInit>
    </ThemeProvider>
  );
}

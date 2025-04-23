// src/app/index.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation, BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/shared/config/theme";
import ErrorBoundary from "./error-boundary";

const AppContent = () => {
  const { isAuthenticated, checkSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        await checkSession();
        console.log(
          "Session check completed, isAuthenticated:",
          isAuthenticated
        );
      } catch (error) {
        console.error("Session check failed:", error);
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsCheckingSession(false);
      }
    };

    verifySession();
  }, [checkSession, navigate, location]);

  if (isCheckingSession) {
    return <div>Loading...</div>; // Показываем индикатор загрузки, пока проверяется сессия
  }

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

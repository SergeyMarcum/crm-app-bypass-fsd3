// src/app/init.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
// Temporarily remove ErrorBoundary
// import { ErrorBoundary } from '@/shared/ui/error-boundary';

export const AppInit = () => {
  const { verifySession } = useAuth();
  const navigate = useNavigate();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      console.log("Starting session check");
      try {
        await verifySession();
      } catch (error) {
        console.log("Session check failed:", error);
        navigate("/login", { replace: true });
      } finally {
        console.log("Session check completed, isCheckingSession: false");
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, [verifySession, navigate]);

  if (isCheckingSession) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
};

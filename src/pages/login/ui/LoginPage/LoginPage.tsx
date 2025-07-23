// src/pages/login/ui/LoginPage/LoginPage.tsx
import { ReactElement, useEffect } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import { LoginForm } from "@features/auth/ui/login-form";
import { useAuth } from "@features/auth/hooks/use-auth";

export function LoginPage(): ReactElement {
  const { isSessionChecking, initAuth } = useAuth();

  useEffect(() => {
    initAuth(); // Проверка токена при монтировании
  }, [initAuth]);

  if (isSessionChecking) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Авторизация
      </Typography>
      <LoginForm />
    </Container>
  );
}

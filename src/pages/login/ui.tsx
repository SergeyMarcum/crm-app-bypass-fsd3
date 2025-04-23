// src/pages/login/ui.tsx
import * as React from "react";
import { LoginForm } from "@/features/auth/ui/login-form";
import { LoginLayout } from "@/widgets/layout";
import { Container, Typography } from "@mui/material";
import { Logo } from "@shared/ui/Logo"; // Без .tsx

export const LoginPage = (): React.ReactNode => {
  console.log("Rendering LoginPage");
  return (
    <LoginLayout>
      <Container maxWidth="sm">
        <Logo />
        <Typography variant="h4" gutterBottom align="center">
          Авторизация
        </Typography>
        <LoginForm />
      </Container>
    </LoginLayout>
  );
};

// src/pages/login/ui.tsx
import { ReactElement } from "react";
import { LoginForm } from "@features/auth/ui/login-form";
import { Container, Typography } from "@mui/material";

export function LoginPage(): ReactElement {
  console.log("Rendering LoginPage");
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Авторизация
      </Typography>
      <LoginForm />
    </Container>
  );
}

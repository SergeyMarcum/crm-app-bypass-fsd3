// src/pages/login.tsx
import { ReactElement } from "react";
import { LoginForm } from "@features/auth/ui/login-form";
import { Typography } from "@mui/material";

export const LoginPage = (): ReactElement => {
  console.log("Рендеринг LoginPage");
  return (
    <>
      <Typography>Auth!!!</Typography>
      <LoginForm />;
    </>
  );
};

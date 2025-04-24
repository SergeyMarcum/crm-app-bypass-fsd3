// src/pages/login.tsx
import { ReactElement } from "react";
import { LoginForm } from "@features/auth/ui/login-form";

export const LoginPage = (): ReactElement => {
  console.log("LoginPage render");
  return <LoginForm />;
};

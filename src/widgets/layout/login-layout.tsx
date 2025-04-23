// src/widgets/layout/login-layout.tsx
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface LoginLayoutProps {
  children: ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {children}
    </Box>
  );
};

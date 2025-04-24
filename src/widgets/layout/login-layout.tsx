// src/widgets/layout/login-layout.tsx
import { ReactElement } from "react";
import { Box } from "@mui/material";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps): ReactElement {
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
      <main>{children}</main>
    </Box>
  );
}

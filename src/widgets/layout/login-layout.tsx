// src/widgets/layout/login-layout.tsx
import { ReactElement } from "react";
import { Box, Typography } from "@mui/material";

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
      <Typography>123</Typography>
      <main>{children}</main>
    </Box>
  );
}

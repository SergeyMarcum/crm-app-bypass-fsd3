// src/app/layout/login-layout.tsx
import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Logo } from "@shared/ui/Logo";

export function LoginLayout(): ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Logo />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

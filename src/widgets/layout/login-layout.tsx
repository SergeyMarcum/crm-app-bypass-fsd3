// src/widgets/layout/login-layout.tsx
import { Box } from "@mui/material";

export const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {children}
    </Box>
  );
};

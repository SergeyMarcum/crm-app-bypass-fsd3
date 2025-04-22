// src/widgets/layout/login-layout.tsx
import { Box } from "@mui/material";
import { ReactNode } from "react";

export const LoginLayout = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      {children}
    </Box>
  );
};

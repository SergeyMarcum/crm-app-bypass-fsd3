// src/shared/ui/Logo.tsx
import * as React from "react";
import { Box, BoxProps } from "@mui/material";

interface LogoProps extends BoxProps {}

export function Logo({ sx, ...props }: LogoProps): React.ReactNode {
  return (
    <Box
      component="img"
      src="/logo.png"
      alt="CRM App Logo"
      sx={{
        height: 40,
        mx: 1,
        my: 0.5,
        filter: (theme) =>
          theme.palette.mode === "dark" ? "brightness(1.2)" : "none",
        ...sx,
      }}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        console.error("Logo image failed to load:", e);
        e.currentTarget.src = "/fallback-logo.png";
      }}
      {...props}
    />
  );
}

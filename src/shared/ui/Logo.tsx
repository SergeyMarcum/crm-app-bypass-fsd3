// src/shared/ui/Logo.tsx
import * as React from "react";
import { Box } from "@mui/material";

export function Logo(): React.ReactNode {
  console.log("Rendering Logo");
  return (
    <Box
      component="img"
      src="/logo.png" // Предполагается, что logo.png находится в public/
      alt="CRM App Logo"
      sx={{ height: 40, mx: 2 }}
      onError={(e) => {
        console.error("Logo image failed to load:", e);
        e.currentTarget.src = "/fallback-logo.png"; // Запасной путь
      }}
    />
  );
}

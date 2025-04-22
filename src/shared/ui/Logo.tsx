// src/shared/ui/Logo.tsx

import { Box } from "@mui/material";
// Замените на путь к вашему логотипу, если он есть
import logo from "@assets/images/logo.png";

export function Logo(): JSX.Element {
  return (
    <Box
      component="img"
      src={logo}
      alt="CRM App Logo"
      sx={{ height: 40, mx: 2 }}
    />
  );
}

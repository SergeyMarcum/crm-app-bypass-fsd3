// src/app/init.tsx
import { ThemeProvider } from "@mui/material";
import { theme } from "@shared/config/theme";

export const AppInit = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

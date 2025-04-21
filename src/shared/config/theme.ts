// src/shared/config/theme.ts
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});

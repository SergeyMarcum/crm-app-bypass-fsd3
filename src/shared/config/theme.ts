// src/shared/config/theme.ts
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Синий для основных элементов
    },
    secondary: {
      main: "#dc004e", // Красный для акцентов
    },
    background: {
      default: "#f5f5f5", // Светлый фон
      paper: "#ffffff", // Белый для карточек
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Отключение uppercase
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
  },
});

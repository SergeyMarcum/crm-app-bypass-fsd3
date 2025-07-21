// src/shared/config/theme.ts
import { createTheme, ThemeOptions, Theme } from "@mui/material";
import { Interpolation } from "@mui/system";

// Расширение PaletteOptions для поддержки neutral
declare module "@mui/material/styles" {
  interface PaletteOptions {
    neutral?: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }
  // Расширение Palette для поддержки neutral
  interface Palette {
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }
}

const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#0079c2",
      light: "#4db0e4",
      dark: "#005799",
      contrastText: "#ffffff",
      50: "#e0f2fb",
      100: "#b3ddf3",
      200: "#80c7ec",
      300: "#4db0e4",
      400: "#269fdc",
      500: "#0079c2",
      600: "#006bb0",
      700: "#005799",
      800: "#004280",
      900: "#003766",
    },
    secondary: {
      main: "#dc004e",
      light: "#f73378",
      dark: "#9a0036",
      contrastText: "#ffffff",
      50: "#fce4ec",
      100: "#f8bbd0",
      200: "#f48fb1",
      300: "#f06292",
      400: "#ec407a",
      500: "#e91e63",
      600: "#d81b60",
      700: "#c2185b",
      800: "#ad1457",
      900: "#880e4f",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
      50: "#e8f5e9",
      100: "#c8e6c9",
      200: "#a5d6a7",
      300: "#81c784",
      400: "#66bb6a",
      500: "#4caf50",
      600: "#43a047",
      700: "#388e3c",
      800: "#2e7d32",
      900: "#1b5e20",
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
      50: "#e1f5fe",
      100: "#b3e5fc",
      200: "#81d4fa",
      300: "#4fc3f7",
      400: "#29b6f6",
      500: "#03a9f4",
      600: "#039be5",
      700: "#0288d1",
      800: "#0277bd",
      900: "#01579b",
    },
    warning: {
      main: "#f57c00",
      light: "#ff9800",
      dark: "#e65100",
      50: "#fff3e0",
      100: "#ffe0b2",
      200: "#ffcc80",
      300: "#ffb74d",
      400: "#ffa726",
      500: "#ff9800",
      600: "#fb8c00",
      700: "#f57c00",
      800: "#ef6c00",
      900: "#e65100",
    },
    error: {
      main: "#f04438",
      light: "#f97970",
      dark: "#de3024",
      contrastText: "#ffffff",
      50: "#fef3f2",
      100: "#fee4e2",
      200: "#ffcdc9",
      300: "#fdaaa4",
      400: "#f97970",
      500: "#f04438",
      600: "#de3024",
      700: "#bb241a",
      800: "#9a221a",
      900: "#80231c",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
      disabled: "#bdbdbd",
    },
    divider: "#e0e0e0",
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    common: {
      black: "#000000",
      white: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h1: { fontSize: "3.5rem", fontWeight: 500, lineHeight: 1.2 },
    h2: { fontSize: "3rem", fontWeight: 500, lineHeight: 1.2 },
    h3: { fontSize: "2.25rem", fontWeight: 500, lineHeight: 1.2 },
    h4: { fontSize: "2rem", fontWeight: 500, lineHeight: 1.2 },
    h5: { fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.2 },
    h6: { fontSize: "1.125rem", fontWeight: 500, lineHeight: 1.2 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.57 },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: "none",
    },
    caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.66 },
    subtitle1: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.57 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.57 },
    overline: { fontSize: "0.75rem", fontWeight: 500, lineHeight: 2.5 },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  shadows: [
    "none",
    "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    "0px 1px 5px rgba(0, 0, 0, 0.2)",
    "0px 1px 8px rgba(0, 0, 0, 0.2)",
    "0px 1px 10px rgba(0, 0, 0, 0.2)",
    "0px 1px 14px rgba(0, 0, 0, 0.2)",
    "0px 1px 18px rgba(0, 0, 0, 0.2)",
    "0px 2px 16px rgba(0, 0, 0, 0.2)",
    "0px 3px 14px rgba(0, 0, 0, 0.2)",
    "0px 3px 16px rgba(0, 0, 0, 0.2)",
    "0px 4px 18px rgba(0, 0, 0, 0.2)",
    "0px 4px 20px rgba(0, 0, 0, 0.2)",
    "0px 5px 22px rgba(0, 0, 0, 0.2)",
    "0px 5px 24px rgba(0, 0, 0, 0.2)",
    "0px 5px 26px rgba(0, 0, 0, 0.2)",
    "0px 6px 28px rgba(0, 0, 0, 0.2)",
    "0px 6px 30px rgba(0, 0, 0, 0.2)",
    "0px 6px 32px rgba(0, 0, 0, 0.2)",
    "0px 7px 34px rgba(0, 0, 0, 0.2)",
    "0px 7px 36px rgba(0, 0, 0, 0.2)",
    "0px 8px 38px rgba(0, 0, 0, 0.2)",
    "0px 8px 40px rgba(0, 0, 0, 0.2)",
    "0px 8px 42px rgba(0, 0, 0, 0.2)",
    "0px 9px 44px rgba(0, 0, 0, 0.2)",
    "0px 9px 46px rgba(0, 0, 0, 0.2)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
        text: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(0.5, 1),
            "& .MuiButton-endIcon": {
              marginLeft: theme.spacing(0.5),
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.2)",
          borderBottom: "none",
          backgroundColor: "#005799",
          color: "#ffffff",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            color: theme.palette.text.secondary, // #757575 for light theme
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }: { theme: Theme }) =>
          ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[16],
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: "320px",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(1, 2),
            fontSize: theme.typography.body1.fontSize,
            lineHeight: theme.typography.body1.lineHeight,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "&.Mui-disabled": {
              color: theme.palette.text.disabled,
              pointerEvents: "none",
              opacity: theme.palette.action.disabledOpacity,
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            backgroundColor: theme.palette.divider,
            margin: theme.spacing(1, 0),
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiList: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(1, 0),
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            minWidth: "32px",
            color: theme.palette.text.primary,
            "& svg": {
              fontSize: theme.typography.body1.fontSize,
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[1],
            borderRadius: "20px",
            backgroundImage: "none",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(2),
          }) as Interpolation<{ theme: Theme }>,
        title: ({ theme }: { theme: Theme }) =>
          ({
            fontSize: theme.typography.h6.fontSize,
            fontWeight: theme.typography.h6.fontWeight,
            lineHeight: theme.typography.h6.lineHeight,
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(2),
            "&:last-child": {
              paddingBottom: theme.spacing(2),
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(2),
            justifyContent: "flex-end",
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            width: 48,
            height: 48,
            fontSize: theme.typography.body1.fontSize,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[8],
            "& svg": {
              fontSize: "1.5rem",
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
  },
};

const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#4db0e4",
      light: "#80c7ec",
      dark: "#006bb0",
      contrastText: "#ffffff",
      50: "#e0f2fb",
      100: "#b3ddf3",
      200: "#80c7ec",
      300: "#4db0e4",
      400: "#269fdc",
      500: "#0079c2",
      600: "#006bb0",
      700: "#005799",
      800: "#004280",
      900: "#003766",
    },
    secondary: {
      main: "#f48fb1",
      light: "#fce4ec",
      dark: "#f06292",
      contrastText: "#ffffff",
      50: "#fce4ec",
      100: "#f8bbd0",
      200: "#f48fb1",
      300: "#f06292",
      400: "#ec407a",
      500: "#e91e63",
      600: "#d81b60",
      700: "#c2185b",
      800: "#ad1457",
      900: "#880e4f",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
      50: "#e8f5e9",
      100: "#c8e6c9",
      200: "#a5d6a7",
      300: "#81c784",
      400: "#66bb6a",
      500: "#4caf50",
      600: "#43a047",
      700: "#388e3c",
      800: "#2e7d32",
      900: "#1b5e20",
    },
    info: {
      main: "#29b6f6",
      light: "#4fc3f7",
      dark: "#0288d1",
      50: "#e1f5fe",
      100: "#b3e5fc",
      200: "#81d4fa",
      300: "#4fc3f7",
      400: "#29b6f6",
      500: "#03a9f4",
      600: "#039be5",
      700: "#0288d1",
      800: "#0277bd",
      900: "#01579b",
    },
    warning: {
      main: "#ffa726",
      light: "#ffb74d",
      dark: "#f57c00",
      50: "#fff3e0",
      100: "#ffe0b2",
      200: "#ffcc80",
      300: "#ffb74d",
      400: "#ffa726",
      500: "#ff9800",
      600: "#fb8c00",
      700: "#f57c00",
      800: "#ef6c00",
      900: "#e65100",
    },
    error: {
      main: "#f04438",
      light: "#f97970",
      dark: "#de3024",
      contrastText: "#ffffff",
      50: "#fef3f2",
      100: "#fee4e2",
      200: "#ffcdc9",
      300: "#fdaaa4",
      400: "#f97970",
      500: "#f04438",
      600: "#de3024",
      700: "#bb241a",
      800: "#9a221a",
      900: "#80231c",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
      disabled: "#78909c",
    },
    divider: "#455a64",
    neutral: {
      50: "#eceff1",
      100: "#cfd8dc",
      200: "#b0bec5",
      300: "#90a4ae",
      400: "#78909c",
      500: "#607d8b",
      600: "#546e7a",
      700: "#455a64",
      800: "#37474f",
      900: "#263238",
    },
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    common: {
      black: "#000000",
      white: "#ffffff",
    },
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  spacing: lightTheme.spacing,
  zIndex: lightTheme.zIndex,
  shadows: [
    "none",
    "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    "0px 1px 5px rgba(0, 0, 0, 0.4)",
    "0px 1px 8px rgba(0, 0, 0, 0.4)",
    "0px 1px 10px rgba(0, 0, 0, 0.4)",
    "0px 1px 14px rgba(0, 0, 0, 0.4)",
    "0px 1px 18px rgba(0, 0, 0, 0.4)",
    "0px 2px 16px rgba(0, 0, 0, 0.4)",
    "0px 3px 14px rgba(0, 0, 0, 0.4)",
    "0px 3px 16px rgba(0, 0, 0, 0.4)",
    "0px 4px 18px rgba(0, 0, 0, 0.4)",
    "0px 4px 20px rgba(0, 0, 0, 0.4)",
    "0px 5px 22px rgba(0, 0, 0, 0.4)",
    "0px 5px 24px rgba(0, 0, 0, 0.4)",
    "0px 5px 26px rgba(0, 0, 0, 0.4)",
    "0px 6px 28px rgba(0, 0, 0, 0.4)",
    "0px 6px 30px rgba(0, 0, 0, 0.4)",
    "0px 6px 32px rgba(0, 0, 0, 0.4)",
    "0px 7px 34px rgba(0, 0, 0, 0.4)",
    "0px 7px 36px rgba(0, 0, 0, 0.4)",
    "0px 8px 38px rgba(0, 0, 0, 0.4)",
    "0px 8px 40px rgba(0, 0, 0, 0.4)",
    "0px 8px 42px rgba(0, 0, 0, 0.4)",
    "0px 9px 44px rgba(0, 0, 0, 0.4)",
    "0px 9px 46px rgba(0, 0, 0, 0.4)",
  ],
  components: {
    ...lightTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.4)",
          borderBottom: "none",
          backgroundColor: "#78909c",
          color: "#ffffff",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            color: theme.palette.neutral[100], // #cfd8dc for dark theme
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[1],
            borderRadius: "20px",
            backgroundImage: "none",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(2),
          }) as Interpolation<{ theme: Theme }>,
        title: ({ theme }: { theme: Theme }) =>
          ({
            fontSize: theme.typography.h6.fontSize,
            fontWeight: theme.typography.h6.fontWeight,
            lineHeight: theme.typography.h6.lineHeight,
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(2),
            "&:last-child": {
              paddingBottom: theme.spacing(2),
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(2),
            justifyContent: "flex-end",
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            width: 48,
            height: 48,
            fontSize: theme.typography.body1.fontSize,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[8],
            "& svg": {
              fontSize: "1.5rem",
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
  },
};

export const getTheme = (mode: "light" | "dark" | "system") => {
  const isDarkMode =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  return createTheme(isDarkMode ? darkTheme : lightTheme);
};

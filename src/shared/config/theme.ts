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
}

const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#0079c2", // --mui-palette-primary-main
      light: "#4db0e4", // --mui-palette-primary-light
      dark: "#005799", // --mui-palette-primary-dark
      contrastText: "#ffffff", // --mui-palette-primary-contrastText
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
      main: "#dc004e", // --mui-palette-secondary-main
      light: "#f73378", // --mui-palette-secondary-light
      dark: "#9a0036", // --mui-palette-secondary-dark
      contrastText: "#ffffff", // --mui-palette-secondary-contrastText
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
      main: "#f04438", // --mui-palette-error-main
      light: "#f97970", // --mui-palette-error-light
      dark: "#de3024", // --mui-palette-error-dark
      contrastText: "#ffffff", // --mui-palette-error-contrastText
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
      primary: "#212121", // --mui-palette-text-primary
      secondary: "#757575", // --mui-palette-text-secondary
      disabled: "#bdbdbd", // --mui-palette-text-disabled
    },
    divider: "#e0e0e0", // --mui-palette-divider
    neutral: {
      50: "#fafafa", // --mui-palette-neutral-50
      100: "#f5f5f5", // --mui-palette-neutral-100
      200: "#eeeeee", // --mui-palette-neutral-200
      300: "#e0e0e0", // --mui-palette-neutral-300
      400: "#bdbdbd", // --mui-palette-neutral-400
      500: "#9e9e9e", // --mui-palette-neutral-500
      600: "#757575", // --mui-palette-neutral-600
      700: "#616161", // --mui-palette-neutral-700
      800: "#424242", // --mui-palette-neutral-800
      900: "#212121", // --mui-palette-neutral-900
    },
    background: {
      default: "#f5f5f5", // --mui-palette-background-default
      paper: "#ffffff", // --mui-palette-background-paper
    },
    common: {
      black: "#000000", // --mui-palette-common-black
      white: "#ffffff", // --mui-palette-common-white
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif", // --mui-font-body1
    h1: {
      fontSize: "3.5rem", // --mui-font-h1
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "3rem", // --mui-font-h2
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "2.25rem", // --mui-font-h3
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "2rem", // --mui-font-h4
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1.5rem", // --mui-font-h5
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: "1.125rem", // --mui-font-h6
      fontWeight: 500,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1rem", // --mui-font-body1
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem", // --mui-font-body2
      fontWeight: 400,
      lineHeight: 1.57,
    },
    button: {
      fontSize: "0.875rem", // --mui-font-button
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem", // --mui-font-caption
      fontWeight: 400,
      lineHeight: 1.66,
    },
    subtitle1: {
      fontSize: "1rem", // --mui-font-subtitle1
      fontWeight: 500,
      lineHeight: 1.57,
    },
    subtitle2: {
      fontSize: "0.875rem", // --mui-font-subtitle2
      fontWeight: 500,
      lineHeight: 1.57,
    },
    overline: {
      fontSize: "0.75rem", // --mui-font-overline
      fontWeight: 500,
      lineHeight: 2.5,
    },
  },
  shape: {
    borderRadius: 8, // --mui-shape-borderRadius
  },
  spacing: 8, // --mui-spacing
  zIndex: {
    mobileStepper: 1000, // --mui-zIndex-mobileStepper
    fab: 1050, // --mui-zIndex-fab
    speedDial: 1050, // --mui-zIndex-speedDial
    appBar: 1100, // --mui-zIndex-appBar
    drawer: 1200, // --mui-zIndex-drawer
    modal: 1300, // --mui-zIndex-modal
    snackbar: 1400, // --mui-zIndex-snackbar
    tooltip: 1500, // --mui-zIndex-tooltip
  },
  shadows: [
    "none", // --mui-shadows-0
    "0px 1px 2px rgba(0, 0, 0, 0.2)", // --mui-shadows-1
    "0px 1px 5px rgba(0, 0, 0, 0.2)", // --mui-shadows-2
    "0px 1px 8px rgba(0, 0, 0, 0.2)", // --mui-shadows-3
    "0px 1px 10px rgba(0, 0, 0, 0.2)", // --mui-shadows-4
    "0px 1px 14px rgba(0, 0, 0, 0.2)", // --mui-shadows-5
    "0px 1px 18px rgba(0, 0, 0, 0.2)", // --mui-shadows-6
    "0px 2px 16px rgba(0, 0, 0, 0.2)", // --mui-shadows-7
    "0px 3px 14px rgba(0, 0, 0, 0.2)", // --mui-shadows-8
    "0px 3px 16px rgba(0, 0, 0, 0.2)", // --mui-shadows-9
    "0px 4px 18px rgba(0, 0, 0, 0.2)", // --mui-shadows-10
    "0px 4px 20px rgba(0, 0, 0, 0.2)", // --mui-shadows-11
    "0px 5px 22px rgba(0, 0, 0, 0.2)", // --mui-shadows-12
    "0px 5px 24px rgba(0, 0, 0, 0.2)", // --mui-shadows-13
    "0px 5px 26px rgba(0, 0, 0, 0.2)", // --mui-shadows-14
    "0px 6px 28px rgba(0, 0, 0, 0.2)", // --mui-shadows-15
    "0px 6px 30px rgba(0, 0, 0, 0.2)", // --mui-shadows-16
    "0px 6px 32px rgba(0, 0, 0, 0.2)", // --mui-shadows-17
    "0px 7px 34px rgba(0, 0, 0, 0.2)", // --mui-shadows-18
    "0px 7px 36px rgba(0, 0, 0, 0.2)", // --mui-shadows-19
    "0px 8px 38px rgba(0, 0, 0, 0.2)", // --mui-shadows-20
    "0px 8px 40px rgba(0, 0, 0, 0.2)", // --mui-shadows-21
    "0px 8px 42px rgba(0, 0, 0, 0.2)", // --mui-shadows-22
    "0px 9px 44px rgba(0, 0, 0, 0.2)", // --mui-shadows-23
    "0px 9px 46px rgba(0, 0, 0, 0.2)", // --mui-shadows-24
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8, // --mui-shape-borderRadius
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.2)", // --mui-shadows-4
          borderBottom: "none",
          backgroundColor: "#005799", // --mui-palette-primary-dark
          color: "#ffffff", // --mui-palette-text-primary
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#ffffff", // --mui-palette-text-primary
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }: { theme: Theme }) =>
          ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[16], // --mui-shadows-16
            borderRadius: theme.shape.borderRadius, // 8px
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
            padding: theme.spacing(1, 2), // gutters: 8px 16px
            fontSize: theme.typography.body1.fontSize, // 1rem
            lineHeight: theme.typography.body1.lineHeight, // 1.5
            "&:hover": {
              backgroundColor: theme.palette.action.hover, // rgba(0, 0, 0, 0.04) или rgba(255, 255, 255, 0.04)
            },
            "&.Mui-disabled": {
              color: theme.palette.text.disabled,
              pointerEvents: "none",
              opacity: theme.palette.action.disabledOpacity, // 0.38
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            backgroundColor: theme.palette.divider,
            margin: theme.spacing(1, 0), // 8px сверху и снизу
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiList: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(1, 0), // 8px сверху и снизу
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            minWidth: "32px", // Отступ для иконки
            color: theme.palette.text.primary,
            "& svg": {
              fontSize: theme.typography.body1.fontSize, // 1rem
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
      main: "#4db0e4", // --mui-palette-primary-main
      light: "#80c7ec", // --mui-palette-primary-light
      dark: "#006bb0", // --mui-palette-primary-dark
      contrastText: "#ffffff", // --mui-palette-primary-contrastText
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
      main: "#f48fb1", // --mui-palette-secondary-main
      light: "#fce4ec", // --mui-palette-secondary-light
      dark: "#f06292", // --mui-palette-secondary-dark
      contrastText: "#ffffff", // --mui-palette-secondary-contrastText
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
      main: "#f04438", // --mui-palette-error-main
      light: "#f97970", // --mui-palette-error-light
      dark: "#de3024", // --mui-palette-error-dark
      contrastText: "#ffffff", // --mui-palette-error-contrastText
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
      primary: "#ffffff", // --mui-palette-text-primary
      secondary: "#b0bec5", // --mui-palette-text-secondary
      disabled: "#78909c", // --mui-palette-text-disabled
    },
    divider: "#455a64", // --mui-palette-divider
    neutral: {
      50: "#eceff1", // --mui-palette-neutral-50
      100: "#cfd8dc", // --mui-palette-neutral-100
      200: "#b0bec5", // --mui-palette-neutral-200
      300: "#90a4ae", // --mui-palette-neutral-300
      400: "#78909c", // --mui-palette-neutral-400
      500: "#607d8b", // --mui-palette-neutral-500
      600: "#546e7a", // --mui-palette-neutral-600
      700: "#455a64", // --mui-palette-neutral-700
      800: "#37474f", // --mui-palette-neutral-800
      900: "#263238", // --mui-palette-neutral-900
    },
    background: {
      default: "#121212", // --mui-palette-background-default
      paper: "#1d1d1d", // --mui-palette-background-paper
    },
    common: {
      black: "#000000", // --mui-palette-common-black
      white: "#ffffff", // --mui-palette-common-white
    },
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  spacing: lightTheme.spacing,
  zIndex: lightTheme.zIndex,
  shadows: [
    "none", // --mui-shadows-0
    "0px 1px 2px rgba(0, 0, 0, 0.4)", // --mui-shadows-1
    "0px 1px 5px rgba(0, 0, 0, 0.4)", // --mui-shadows-2
    "0px 1px 8px rgba(0, 0, 0, 0.4)", // --mui-shadows-3
    "0px 1px 10px rgba(0, 0, 0, 0.4)", // --mui-shadows-4
    "0px 1px 14px rgba(0, 0, 0, 0.4)", // --mui-shadows-5
    "0px 1px 18px rgba(0, 0, 0, 0.4)", // --mui-shadows-6
    "0px 2px 16px rgba(0, 0, 0, 0.4)", // --mui-shadows-7
    "0px 3px 14px rgba(0, 0, 0, 0.4)", // --mui-shadows-8
    "0px 3px 16px rgba(0, 0, 0, 0.4)", // --mui-shadows-9
    "0px 4px 18px rgba(0, 0, 0, 0.4)", // --mui-shadows-10
    "0px 4px 20px rgba(0, 0, 0, 0.4)", // --mui-shadows-11
    "0px 5px 22px rgba(0, 0, 0, 0.4)", // --mui-shadows-12
    "0px 5px 24px rgba(0, 0, 0, 0.4)", // --mui-shadows-13
    "0px 5px 26px rgba(0, 0, 0, 0.4)", // --mui-shadows-14
    "0px 6px 28px rgba(0, 0, 0, 0.4)", // --mui-shadows-15
    "0px 6px 30px rgba(0, 0, 0, 0.4)", // --mui-shadows-16
    "0px 6px 32px rgba(0, 0, 0, 0.4)", // --mui-shadows-17
    "0px 7px 34px rgba(0, 0, 0, 0.4)", // --mui-shadows-18
    "0px 7px 36px rgba(0, 0, 0, 0.4)", // --mui-shadows-19
    "0px 8px 38px rgba(0, 0, 0, 0.4)", // --mui-shadows-20
    "0px 8px 40px rgba(0, 0, 0, 0.4)", // --mui-shadows-21
    "0px 8px 42px rgba(0, 0, 0, 0.4)", // --mui-shadows-22
    "0px 9px 44px rgba(0, 0, 0, 0.4)", // --mui-shadows-23
    "0px 9px 46px rgba(0, 0, 0, 0.4)", // --mui-shadows-24
  ],
  components: {
    ...lightTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.4)", // --mui-shadows-4
          borderBottom: "none",
          backgroundColor: "#78909c", // --mui-palette-neutral-400
          color: "#ffffff", // --mui-palette-text-primary
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#ffffff", // --mui-palette-text-primary
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }: { theme: Theme }) =>
          ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[16], // --mui-shadows-16
            borderRadius: theme.shape.borderRadius, // 8px
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
            padding: theme.spacing(1, 2), // gutters: 8px 16px
            fontSize: theme.typography.body1.fontSize, // 1rem
            lineHeight: theme.typography.body1.lineHeight, // 1.5
            "&:hover": {
              backgroundColor: theme.palette.action.hover, // rgba(0, 0, 0, 0.04) или rgba(255, 255, 255, 0.04)
            },
            "&.Mui-disabled": {
              color: theme.palette.text.disabled,
              pointerEvents: "none",
              opacity: theme.palette.action.disabledOpacity, // 0.38
            },
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            backgroundColor: theme.palette.divider,
            margin: theme.spacing(1, 0), // 8px сверху и снизу
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiList: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            padding: theme.spacing(1, 0), // 8px сверху и снизу
          }) as Interpolation<{ theme: Theme }>,
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) =>
          ({
            minWidth: "32px", // Отступ для иконки
            color: theme.palette.text.primary,
            "& svg": {
              fontSize: theme.typography.body1.fontSize, // 1rem
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

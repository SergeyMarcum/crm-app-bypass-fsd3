// src/shared/processes/theme/store.ts
import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: "system",
  setThemeMode: (mode) => set({ themeMode: mode }),
}));

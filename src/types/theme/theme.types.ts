import type { ReactNode } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}
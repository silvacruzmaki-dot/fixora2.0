"use client";

import { useContext } from "react";

import { ThemeContext } from "@/context/theme/ThemeContext";
import type { ThemeContextValue } from "@/types/theme/theme.types";

export default function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useTheme debe utilizarse dentro de ThemeProvider.",
    );
  }

  return context;
}
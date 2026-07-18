"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import type {
  Theme,
  ThemeContextValue,
  ThemeProviderProps,
} from "@/types/theme/theme.types";

const THEME_STORAGE_KEY = "fixora-theme";
const THEME_CHANGE_EVENT = "fixora-theme-change";
const DEFAULT_THEME: Theme = "light";

export const ThemeContext = createContext<
  ThemeContextValue | undefined
>(undefined);

function isValidTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  return window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    const storedTheme = window.localStorage.getItem(
      THEME_STORAGE_KEY,
    );

    if (isValidTheme(storedTheme)) {
      return storedTheme;
    }
  } catch {
    // Si localStorage no está disponible, usamos el tema del sistema.
  }

  return getSystemTheme();
}

function getServerThemeSnapshot(): Theme {
  return DEFAULT_THEME;
}

function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") {
    return;
  }

  const rootElement = document.documentElement;

  rootElement.dataset.theme = theme;
  rootElement.style.colorScheme = theme;
}

function subscribeToTheme(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const systemThemeQuery = window.matchMedia(
    "(prefers-color-scheme: dark)",
  );

  const handleStorageChange = (
    event: StorageEvent,
  ): void => {
    if (event.key === THEME_STORAGE_KEY) {
      onStoreChange();
    }
  };

  const handleThemeChange = (): void => {
    onStoreChange();
  };

  const handleSystemThemeChange = (): void => {
    try {
      const storedTheme = window.localStorage.getItem(
        THEME_STORAGE_KEY,
      );

      if (!isValidTheme(storedTheme)) {
        onStoreChange();
      }
    } catch {
      onStoreChange();
    }
  };

  window.addEventListener(
    "storage",
    handleStorageChange,
  );

  window.addEventListener(
    THEME_CHANGE_EVENT,
    handleThemeChange,
  );

  systemThemeQuery.addEventListener(
    "change",
    handleSystemThemeChange,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorageChange,
    );

    window.removeEventListener(
      THEME_CHANGE_EVENT,
      handleThemeChange,
    );

    systemThemeQuery.removeEventListener(
      "change",
      handleSystemThemeChange,
    );
  };
}

export function ThemeProvider({
  children,
}: Readonly<ThemeProviderProps>) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme): void => {
      try {
        window.localStorage.setItem(
          THEME_STORAGE_KEY,
          newTheme,
        );
      } catch {
        // El cambio seguirá funcionando durante la sesión.
      }

      applyThemeToDocument(newTheme);

      window.dispatchEvent(
        new Event(THEME_CHANGE_EVENT),
      );
    },
    [],
  );

  const toggleTheme = useCallback((): void => {
    const newTheme: Theme =
      theme === "light" ? "dark" : "light";

    setTheme(newTheme);
  }, [setTheme, theme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
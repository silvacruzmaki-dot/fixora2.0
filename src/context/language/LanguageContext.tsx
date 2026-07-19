"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import type {
  Language,
  LanguageContextValue,
  LanguageProviderProps,
} from "@/types/language/language.types";

const LANGUAGE_STORAGE_KEY = "fixora-language";
const LANGUAGE_CHANGE_EVENT = "fixora-language-change";
const DEFAULT_LANGUAGE: Language = "es";

export const LanguageContext = createContext<
  LanguageContextValue | undefined
>(undefined);

function isValidLanguage(
  value: string | null,
): value is Language {
  return value === "es" || value === "en";
}

function getBrowserLanguage(): Language {
  if (typeof navigator === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return navigator.language
    .toLowerCase()
    .startsWith("en")
    ? "en"
    : "es";
}

function getLanguageSnapshot(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    const storedLanguage =
      window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      );

    if (isValidLanguage(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    // Si localStorage no está disponible,
    // se utilizará el idioma del navegador.
  }

  return getBrowserLanguage();
}

function getServerLanguageSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

function applyLanguageToDocument(
  language: Language,
): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = language;
}

function subscribeToLanguage(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (
    event: StorageEvent,
  ): void => {
    if (event.key === LANGUAGE_STORAGE_KEY) {
      onStoreChange();
    }
  };

  const handleLanguageChange = (): void => {
    onStoreChange();
  };

  window.addEventListener(
    "storage",
    handleStorageChange,
  );

  window.addEventListener(
    LANGUAGE_CHANGE_EVENT,
    handleLanguageChange,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorageChange,
    );

    window.removeEventListener(
      LANGUAGE_CHANGE_EVENT,
      handleLanguageChange,
    );
  };
}

export function LanguageProvider({
  children,
}: Readonly<LanguageProviderProps>) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    applyLanguageToDocument(language);
  }, [language]);

  const setLanguage = useCallback(
    (newLanguage: Language): void => {
      try {
        window.localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          newLanguage,
        );
      } catch {
        // El cambio seguirá funcionando
        // durante la sesión actual.
      }

      applyLanguageToDocument(newLanguage);

      window.dispatchEvent(
        new Event(LANGUAGE_CHANGE_EVENT),
      );
    },
    [],
  );

  const toggleLanguage =
    useCallback((): void => {
      const newLanguage: Language =
        language === "es" ? "en" : "es";

      setLanguage(newLanguage);
    }, [language, setLanguage]);

  const contextValue =
    useMemo<LanguageContextValue>(
      () => ({
        language,
        isSpanish: language === "es",
        isEnglish: language === "en",
        setLanguage,
        toggleLanguage,
      }),
      [
        language,
        setLanguage,
        toggleLanguage,
      ],
    );

  return (
    <LanguageContext.Provider
      value={contextValue}
    >
      {children}
    </LanguageContext.Provider>
  );
}
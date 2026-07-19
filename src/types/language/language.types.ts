import type { ReactNode } from "react";

/* =========================================================
   IDIOMAS DISPONIBLES
   ========================================================= */

export type Language = "es" | "en";

/* =========================================================
   VALOR DEL CONTEXTO DE IDIOMA
   ========================================================= */

export interface LanguageContextValue {
  language: Language;
  isSpanish: boolean;
  isEnglish: boolean;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

/* =========================================================
   PROPIEDADES DEL PROVIDER
   ========================================================= */

export interface LanguageProviderProps {
  children: ReactNode;
}

/* =========================================================
   ESTRUCTURA GENERAL DE LAS TRADUCCIONES
   ========================================================= */

export interface LanguageTranslations {
  navbar: {
    home: string;
    design: string;
    projects: string;
    software: string;
    hardware: string;
    services: string;
    about: string;
    contact: string;
    login: string;
  };

  navigation: {
    primary: string;
    mainOptions: string;
  };

  floatingMenu: {
    openMenu: string;
    closeMenu: string;
    quickSettings: string;
    lightMode: string;
    darkMode: string;
    changeToSpanish: string;
    changeToEnglish: string;
    language: string;
    settings: string;
    notifications: string;
    profile: string;
    logout: string;
  };

  mobileNavigation: {
    openMenu: string;
    closeMenu: string;
    navigationLabel: string;
  };
}

export type Translations = Record<
  Language,
  LanguageTranslations
>;
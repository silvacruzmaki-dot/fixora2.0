"use client";

import { useContext } from "react";

import { translations } from "@/constants/language/translations";
import { LanguageContext } from "@/context/language/LanguageContext";

import type {
  LanguageContextValue,
  LanguageTranslations,
} from "@/types/language/language.types";

interface UseLanguageReturn
  extends LanguageContextValue {
  t: LanguageTranslations;
}

export default function useLanguage(): UseLanguageReturn {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error(
      "useLanguage debe utilizarse dentro de LanguageProvider.",
    );
  }

  const t = translations[context.language];

  return {
    ...context,
    t,
  };
}
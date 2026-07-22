"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/context/auth/AuthContext";
import { LanguageProvider } from "@/context/language/LanguageContext";
import { ThemeProvider } from "@/context/theme/ThemeContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({
  children,
}: Readonly<ProvidersProps>) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
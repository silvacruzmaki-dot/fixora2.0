"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/context/theme/ThemeContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({
  children,
}: Readonly<ProvidersProps>) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
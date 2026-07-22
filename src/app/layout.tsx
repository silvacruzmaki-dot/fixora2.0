import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";

import SettingsRadialMenu from "@/components/organisms/floating-menu/SettingsRadialMenu";
import Navbar from "@/components/organisms/navbar/Navbar";

import Providers from "./providers";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});


const THEME_INITIALIZATION_SCRIPT = `
  (() => {
    const storageKey = "fixora-theme";

    try {
      const storedTheme =
        window.localStorage.getItem(
          storageKey,
        );

      const theme =
        storedTheme === "light" ||
        storedTheme === "dark"
          ? storedTheme
          : window.matchMedia(
                "(prefers-color-scheme: dark)",
              ).matches
            ? "dark"
            : "light";

      document.documentElement.dataset.theme =
        theme;

      document.documentElement.style.colorScheme =
        theme;
    } catch {
      document.documentElement.dataset.theme =
        "light";

      document.documentElement.style.colorScheme =
        "light";
    }
  })();
`;

export const metadata: Metadata = {
  title: {
    default: "FIXORA",
    template: "%s | FIXORA",
  },

  description:
    "FIXORA ofrece diseño, proyectos tecnológicos, software, hardware y servicios informáticos.",

  applicationName: "FIXORA",

  authors: [
    {
      name: "FIXORA",
    },
  ],

  creator: "FIXORA",
  publisher: "FIXORA",

  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              THEME_INITIALIZATION_SCRIPT,
          }}
        />
      </head>

      <body className={geist.className}>
        <Providers>
          <Navbar />

          <SettingsRadialMenu />

          {children}
        </Providers>
      </body>
    </html>
  );
}
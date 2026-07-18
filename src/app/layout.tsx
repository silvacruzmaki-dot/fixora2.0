import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";

import Navbar from "@/components/organisms/navbar/Navbar";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="es">
      <body className={geist.className}>
        <Navbar />

        {children}
      </body>
    </html>
  );
}
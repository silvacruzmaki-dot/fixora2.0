"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import useLanguage from "@/hooks/language/useLanguage";

export type AppShellChromeVisibility =
  | "auto"
  | "visible"
  | "hidden";

export interface AppShellProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  children: ReactNode;

  navbar?: ReactNode;
  floatingMenu?: ReactNode;
  footer?: ReactNode;

  chromeVisibility?: AppShellChromeVisibility;

  mainId?: string;
  mainClassName?: string;
  contentClassName?: string;

  focusContentOnNavigation?: boolean;
}

const APP_SHELL_COPY = {
  es: {
    skipToContent:
      "Saltar al contenido principal",

    mainContent:
      "Contenido principal",
  },

  en: {
    skipToContent:
      "Skip to main content",

    mainContent:
      "Main content",
  },
} as const;

/*
 * Estas rutas utilizan su propio diseño de pantalla completa
 * y no deben mostrar la navegación pública de FIXORA.
 */
const CHROMELESS_ROUTES = [
  "/iniciar-sesion",
  "/registrarse",
  "/verificar-correo",
  "/recuperar-password",
  "/restablecer-password",
  "/admin",
] as const;

function routeMatches(
  pathname: string,
  route: string,
): boolean {
  return (
    pathname === route ||
    pathname.startsWith(
      `${route}/`,
    )
  );
}

export function AppShell({
  children,

  navbar,
  floatingMenu,
  footer,

  chromeVisibility = "auto",

  mainId = "fixora-main-content",
  mainClassName = "",
  contentClassName = "",

  focusContentOnNavigation = true,

  className,
  ...containerProps
}: AppShellProps) {
  const pathname =
    usePathname();

  const mainRef =
    useRef<HTMLElement | null>(
      null,
    );

  const { language } =
    useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    APP_SHELL_COPY[
      currentLanguage
    ];

  const shouldHideChrome =
    useMemo(() => {
      if (
        chromeVisibility ===
        "hidden"
      ) {
        return true;
      }

      if (
        chromeVisibility ===
        "visible"
      ) {
        return false;
      }

      return CHROMELESS_ROUTES.some(
        (route) =>
          routeMatches(
            pathname,
            route,
          ),
      );
    }, [
      chromeVisibility,
      pathname,
    ]);

  useEffect(() => {
    if (
      !focusContentOnNavigation
    ) {
      return;
    }

    const mainElement =
      mainRef.current;

    if (!mainElement) {
      return;
    }

    /*
     * Después de cambiar de página, mueve el foco al
     * contenido principal para mejorar la navegación
     * mediante teclado y lectores de pantalla.
     */
    const animationFrame =
      window.requestAnimationFrame(
        () => {
          mainElement.focus({
            preventScroll: true,
          });
        },
      );

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );
    };
  }, [
    focusContentOnNavigation,
    pathname,
  ]);

  return (
    <div
      {...containerProps}
      className={[
        "flex min-h-screen w-full flex-col",
        "bg-white text-zinc-950",
        "dark:bg-zinc-950 dark:text-white",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-app-shell="fixora"
      data-pathname={pathname}
      data-chrome-visible={
        shouldHideChrome
          ? "false"
          : "true"
      }
    >
      {!shouldHideChrome ? (
        <a
          href={`#${mainId}`}
          className={[
            "fixed left-4 top-4 z-[9999]",
            "-translate-y-24 rounded-xl",
            "bg-emerald-600 px-4 py-3",
            "text-sm font-semibold text-white shadow-xl",
            "transition-transform",
            "focus:translate-y-0 focus:outline-none",
            "focus:ring-4 focus:ring-emerald-500/30",
          ].join(" ")}
        >
          {copy.skipToContent}
        </a>
      ) : null}

      {!shouldHideChrome &&
      navbar ? (
        <div
          className="relative z-50 shrink-0"
          data-app-shell-navbar
        >
          {navbar}
        </div>
      ) : null}

      <main
        ref={mainRef}
        id={mainId}
        tabIndex={-1}
        aria-label={
          copy.mainContent
        }
        className={[
          "relative flex min-h-0 flex-1 flex-col outline-none",
          mainClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "flex min-h-0 flex-1 flex-col",
            contentClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      </main>

      {!shouldHideChrome &&
      footer ? (
        <div
          className="relative z-20 shrink-0"
          data-app-shell-footer
        >
          {footer}
        </div>
      ) : null}

      {!shouldHideChrome &&
      floatingMenu ? (
        <div
          className="relative z-[60]"
          data-app-shell-floating-menu
        >
          {floatingMenu}
        </div>
      ) : null}
    </div>
  );
}
"use client";

import Link from "next/link";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import useLanguage from "@/hooks/language/useLanguage";

export interface AuthPageShellProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  children: ReactNode;

  showHeader?: boolean;
  showFooter?: boolean;

  contentClassName?: string;
}

const AUTH_PAGE_SHELL_COPY = {
  es: {
    homeLabel:
      "Volver al inicio",

    secureArea:
      "Área segura de FIXORA",

    securityMessage:
      "Tu información se transmite mediante una conexión protegida.",

    privacy:
      "Privacidad",

    terms:
      "Términos",
  },

  en: {
    homeLabel:
      "Back to home",

    secureArea:
      "FIXORA secure area",

    securityMessage:
      "Your information is transmitted through a protected connection.",

    privacy:
      "Privacy",

    terms:
      "Terms",
  },
} as const;

function FixoraLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="34"
      height="34"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="13"
        fill="currentColor"
        opacity="0.14"
      />

      <path
        d="M17 14h17v6H23v5h9v6h-9v9h-6V14Z"
        fill="currentColor"
      />

      <path
        d="M32.5 32.5 38 38"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />

      <path d="M9 12h11" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function AuthPageShell({
  children,

  showHeader = false,
  showFooter = true,

  contentClassName = "",

  className,

  ...containerProps
}: AuthPageShellProps) {
  const {
    language,
  } = useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    AUTH_PAGE_SHELL_COPY[
      currentLanguage
    ];

  return (
    <div
      {...containerProps}
      className={[
        "relative isolate min-h-screen overflow-hidden",
        "bg-zinc-50 text-zinc-950",
        "dark:bg-zinc-950 dark:text-white",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(13,148,136,0.10),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(13,148,136,0.08),transparent_34%)]" />

        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full border border-emerald-500/10" />

        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full border border-emerald-500/10" />

        <div className="absolute left-[14%] top-[26%] h-2 w-2 rounded-full bg-emerald-500/40" />

        <div className="absolute right-[18%] top-[18%] h-3 w-3 rounded-full bg-teal-500/30" />

        <div className="absolute bottom-[22%] left-[22%] h-2.5 w-2.5 rounded-full bg-emerald-500/30" />
      </div>

      <div className="flex min-h-screen flex-col">
        {showHeader ? (
          <header className="relative z-30 flex min-h-20 items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
            >
              <span className="text-emerald-600 dark:text-emerald-400">
                <FixoraLogo />
              </span>

              <span className="text-lg font-black tracking-[0.14em] text-zinc-950 dark:text-white">
                FIXORA
              </span>
            </Link>

            <Link
              href="/"
              className={[
                "inline-flex min-h-10 items-center gap-2 rounded-xl",
                "border border-black/10 bg-white/80 px-4 py-2",
                "text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur",
                "transition hover:border-emerald-500/40 hover:text-emerald-700",
                "focus:outline-none focus:ring-4 focus:ring-emerald-500/15",
                "dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-200",
                "dark:hover:text-emerald-400",
              ].join(" ")}
            >
              <ArrowLeftIcon />

              <span className="hidden sm:inline">
                {copy.homeLabel}
              </span>
            </Link>
          </header>
        ) : null}

        <main
          className={[
            "relative z-10 flex flex-1 items-center justify-center",
            "px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
            contentClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </main>

        {showFooter ? (
          <footer className="relative z-20 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-black/10 pt-5 text-center dark:border-white/10 sm:flex-row sm:text-left">
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="text-emerald-600 dark:text-emerald-400">
                  <LockIcon />
                </span>

                <span>
                  <strong className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {copy.secureArea}.
                  </strong>{" "}
                  {copy.securityMessage}
                </span>
              </div>

              <nav className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <Link
                  href="/privacidad"
                  className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400"
                >
                  {copy.privacy}
                </Link>

                <Link
                  href="/terminos"
                  className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400"
                >
                  {copy.terms}
                </Link>
              </nav>
            </div>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
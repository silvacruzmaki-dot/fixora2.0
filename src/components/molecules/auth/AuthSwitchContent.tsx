"use client";

import { useMemo } from "react";

import useLanguage from "@/hooks/language/useLanguage";

export type AuthSwitchMode =
  | "login"
  | "register";

export interface AuthSwitchContentProps {
  mode: AuthSwitchMode;

  onSwitchMode: (
    nextMode: AuthSwitchMode,
  ) => void;

  disabled?: boolean;
  compact?: boolean;
  showBrand?: boolean;

  controlsId?: string;

  className?: string;
}

const AUTH_SWITCH_COPY = {
  es: {
    brandDescription:
      "Soluciones tecnológicas, servicios y proyectos en un solo lugar.",

    login: {
      eyebrow:
        "¿Primera vez en FIXORA?",

      title:
        "Crea tu cuenta",

      description:
        "Regístrate para administrar tu perfil, consultar tus notificaciones y acceder a las funciones personalizadas de FIXORA.",

      action:
        "Registrarme",

      actionLabel:
        "Cambiar al formulario de registro",

      benefits: [
        "Administra tu perfil personal.",
        "Recibe alertas y notificaciones.",
        "Accede a servicios personalizados.",
      ],
    },

    register: {
      eyebrow:
        "¿Ya eres parte de FIXORA?",

      title:
        "Inicia sesión",

      description:
        "Ingresa con tu cuenta para continuar administrando tu información, preferencias y actividad dentro de FIXORA.",

      action:
        "Iniciar sesión",

      actionLabel:
        "Cambiar al formulario de inicio de sesión",

      benefits: [
        "Continúa desde donde lo dejaste.",
        "Consulta tus novedades pendientes.",
        "Mantén tus datos sincronizados.",
      ],
    },
  },

  en: {
    brandDescription:
      "Technology solutions, services, and projects in one place.",

    login: {
      eyebrow:
        "New to FIXORA?",

      title:
        "Create your account",

      description:
        "Register to manage your profile, review notifications, and access personalized FIXORA features.",

      action:
        "Register",

      actionLabel:
        "Switch to the registration form",

      benefits: [
        "Manage your personal profile.",
        "Receive alerts and notifications.",
        "Access personalized services.",
      ],
    },

    register: {
      eyebrow:
        "Already part of FIXORA?",

      title:
        "Sign in",

      description:
        "Sign in to continue managing your information, preferences, and activity within FIXORA.",

      action:
        "Sign in",

      actionLabel:
        "Switch to the sign-in form",

      benefits: [
        "Continue where you left off.",
        "Review your pending updates.",
        "Keep your information synchronized.",
      ],
    },
  },
} as const;

function FixoraSymbol() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="36"
      height="36"
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
        opacity="0.16"
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function AuthSwitchContent({
  mode,

  onSwitchMode,

  disabled = false,
  compact = false,
  showBrand = true,

  controlsId,

  className = "",
}: AuthSwitchContentProps) {
  const { language } =
    useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    AUTH_SWITCH_COPY[
      currentLanguage
    ];

  const content =
    copy[mode];

  const nextMode:
    AuthSwitchMode =
    mode === "login"
      ? "register"
      : "login";

  const benefits =
    useMemo(
      () =>
        content.benefits,
      [content.benefits],
    );

  return (
    <section
      className={[
        "relative flex h-full w-full flex-col justify-between overflow-hidden",
        compact
          ? "gap-6 p-6"
          : "gap-10 p-8 sm:p-10 lg:p-12",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-white/10"
        aria-hidden="true"
      />

      {showBrand ? (
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            <span className="text-white">
              <FixoraSymbol />
            </span>

            <span className="text-xl font-black tracking-[0.14em] text-white">
              FIXORA
            </span>
          </div>

          {!compact ? (
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
              {
                copy.brandDescription
              }
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="relative z-10 my-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">
          {content.eyebrow}
        </p>

        <h2
          className={[
            "mt-3 font-bold tracking-tight text-white",
            compact
              ? "text-2xl"
              : "text-3xl sm:text-4xl",
          ].join(" ")}
        >
          {content.title}
        </h2>

        <p
          className={[
            "mt-4 max-w-md leading-7 text-white/80",
            compact
              ? "text-sm"
              : "text-base",
          ].join(" ")}
        >
          {content.description}
        </p>

        {!compact ? (
          <ul className="mt-7 grid gap-3">
            {benefits.map(
              (benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-white/85"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-emerald-100">
                    <CheckIcon />
                  </span>

                  <span>
                    {benefit}
                  </span>
                </li>
              ),
            )}
          </ul>
        ) : null}
      </div>

      <div className="relative z-10">
        <button
          type="button"
          disabled={disabled}
          aria-label={
            content.actionLabel
          }
          aria-controls={
            controlsId
          }
          onClick={() => {
            onSwitchMode(
              nextMode,
            );
          }}
          className={[
            "group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl",
            "border border-white/40 bg-white/10 px-6 py-3",
            "text-sm font-semibold text-white backdrop-blur-sm transition",
            "hover:border-white/70 hover:bg-white/20",
            "focus:outline-none focus:ring-4 focus:ring-white/20",
            "active:scale-[0.99]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            compact
              ? "w-full"
              : "min-w-44",
          ].join(" ")}
        >
          <span>
            {content.action}
          </span>

          <span className="transition-transform group-hover:translate-x-1">
            <ArrowIcon />
          </span>
        </button>
      </div>
    </section>
  );
}
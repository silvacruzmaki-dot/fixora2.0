"use client";

import {
  useMemo,
} from "react";

import useLanguage from "@/hooks/language/useLanguage";

export type PasswordRequirementKey =
  | "minimumLength"
  | "uppercase"
  | "lowercase"
  | "number"
  | "specialCharacter";

export interface PasswordRequirementsLabels {
  title: string;

  minimumLength: string;
  uppercase: string;
  lowercase: string;
  number: string;
  specialCharacter: string;

  completed: string;
  pending: string;
  allCompleted: string;
}

export interface PasswordRequirementsProps {
  password: string;

  minimumLength?: number;

  labels?: Partial<PasswordRequirementsLabels>;

  showTitle?: boolean;
  hideCompleted?: boolean;
  compact?: boolean;

  className?: string;
}

interface PasswordRequirement {
  key: PasswordRequirementKey;
  label: string;
  completed: boolean;
}

const PASSWORD_REQUIREMENTS_COPY = {
  es: {
    title:
      "La contraseña debe incluir",

    minimumLength:
      "Al menos {count} caracteres",

    uppercase:
      "Una letra mayúscula",

    lowercase:
      "Una letra minúscula",

    number:
      "Un número",

    specialCharacter:
      "Un carácter especial",

    completed:
      "requisitos completados",

    pending:
      "requisitos pendientes",

    allCompleted:
      "La contraseña cumple todos los requisitos.",
  },

  en: {
    title:
      "The password must include",

    minimumLength:
      "At least {count} characters",

    uppercase:
      "One uppercase letter",

    lowercase:
      "One lowercase letter",

    number:
      "One number",

    specialCharacter:
      "One special character",

    completed:
      "requirements completed",

    pending:
      "requirements pending",

    allCompleted:
      "The password meets all requirements.",
  },
} as const;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
      />

      <path d="M12 8v4" />

      <path d="M12 16h.01" />
    </svg>
  );
}

export function PasswordRequirements({
  password,

  minimumLength = 8,

  labels,

  showTitle = true,
  hideCompleted = false,
  compact = false,

  className = "",
}: PasswordRequirementsProps) {
  const {
    language,
  } = useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const defaultLabels =
    PASSWORD_REQUIREMENTS_COPY[
      currentLanguage
    ];

  const resolvedLabels =
    useMemo<PasswordRequirementsLabels>(
      () => ({
        title:
          labels?.title ??
          defaultLabels.title,

        minimumLength:
          (
            labels?.minimumLength ??
            defaultLabels.minimumLength
          ).replace(
            "{count}",
            String(
              minimumLength,
            ),
          ),

        uppercase:
          labels?.uppercase ??
          defaultLabels.uppercase,

        lowercase:
          labels?.lowercase ??
          defaultLabels.lowercase,

        number:
          labels?.number ??
          defaultLabels.number,

        specialCharacter:
          labels?.specialCharacter ??
          defaultLabels.specialCharacter,

        completed:
          labels?.completed ??
          defaultLabels.completed,

        pending:
          labels?.pending ??
          defaultLabels.pending,

        allCompleted:
          labels?.allCompleted ??
          defaultLabels.allCompleted,
      }),
      [
        defaultLabels,
        labels,
        minimumLength,
      ],
    );

  const requirements =
    useMemo<PasswordRequirement[]>(
      () => [
        {
          key:
            "minimumLength",

          label:
            resolvedLabels.minimumLength,

          completed:
            password.length >=
            minimumLength,
        },

        {
          key:
            "uppercase",

          label:
            resolvedLabels.uppercase,

          completed:
            /[A-Z]/.test(
              password,
            ),
        },

        {
          key:
            "lowercase",

          label:
            resolvedLabels.lowercase,

          completed:
            /[a-z]/.test(
              password,
            ),
        },

        {
          key:
            "number",

          label:
            resolvedLabels.number,

          completed:
            /\d/.test(
              password,
            ),
        },

        {
          key:
            "specialCharacter",

          label:
            resolvedLabels.specialCharacter,

          completed:
            /[^A-Za-z0-9]/.test(
              password,
            ),
        },
      ],
      [
        minimumLength,
        password,
        resolvedLabels.lowercase,
        resolvedLabels.minimumLength,
        resolvedLabels.number,
        resolvedLabels.specialCharacter,
        resolvedLabels.uppercase,
      ],
    );

  const completedCount =
    useMemo(
      () =>
        requirements.filter(
          (
            requirement,
          ) =>
            requirement.completed,
        ).length,
      [requirements],
    );

  const pendingCount =
    requirements.length -
    completedCount;

  const allRequirementsCompleted =
    pendingCount === 0;

  const visibleRequirements =
    useMemo(
      () =>
        hideCompleted
          ? requirements.filter(
              (
                requirement,
              ) =>
                !requirement.completed,
            )
          : requirements,
      [
        hideCompleted,
        requirements,
      ],
    );

  const accessibilitySummary =
    allRequirementsCompleted
      ? resolvedLabels.allCompleted
      : `${completedCount} ${resolvedLabels.completed}. ${pendingCount} ${resolvedLabels.pending}.`;

  return (
    <section
      className={[
        "w-full rounded-xl border border-black/10 bg-zinc-50",
        "dark:border-white/10 dark:bg-zinc-950",

        compact
          ? "px-3 py-3"
          : "px-4 py-4",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={
        resolvedLabels.title
      }
    >
      {showTitle ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {
              resolvedLabels.title
            }
          </p>

          <span
            className={[
              "rounded-full px-2.5 py-1 text-[11px] font-semibold",

              allRequirementsCompleted
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
            ].join(" ")}
          >
            {completedCount}/
            {requirements.length}
          </span>
        </div>
      ) : null}

      {allRequirementsCompleted &&
      hideCompleted ? (
        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10"
            aria-hidden="true"
          >
            <CheckIcon />
          </span>

          <span>
            {
              resolvedLabels.allCompleted
            }
          </span>
        </div>
      ) : (
        <ul
          className={[
            "grid",

            showTitle
              ? "mt-3"
              : "",

            compact
              ? "gap-1.5"
              : "gap-2",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {visibleRequirements.map(
            (
              requirement,
            ) => (
              <li
                key={
                  requirement.key
                }
                className={[
                  "flex items-center gap-2 text-xs transition-colors",

                  requirement.completed
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-500 dark:text-zinc-400",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",

                    requirement.completed
                      ? "bg-emerald-500/10"
                      : "bg-zinc-200 dark:bg-zinc-800",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {requirement.completed ? (
                    <CheckIcon />
                  ) : (
                    <PendingIcon />
                  )}
                </span>

                <span
                  className={
                    requirement.completed
                      ? "font-medium"
                      : ""
                  }
                >
                  {
                    requirement.label
                  }
                </span>
              </li>
            ),
          )}
        </ul>
      )}

      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {accessibilitySummary}
      </p>
    </section>
  );
}
"use client";

import {
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type AuthFieldMessageVariant =
  | "error"
  | "success"
  | "warning"
  | "info";

export interface AuthFieldMessageProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title"
  > {
  children: ReactNode;

  variant?: AuthFieldMessageVariant;

  title?: ReactNode;
  icon?: ReactNode;

  showIcon?: boolean;
}

const VARIANT_STYLES: Record<
  AuthFieldMessageVariant,
  {
    container: string;
    icon: string;
  }
> = {
  error: {
    container:
      "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",

    icon:
      "text-red-600 dark:text-red-400",
  },

  success: {
    container:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",

    icon:
      "text-emerald-600 dark:text-emerald-400",
  },

  warning: {
    container:
      "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300",

    icon:
      "text-amber-600 dark:text-amber-400",
  },

  info: {
    container:
      "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",

    icon:
      "text-blue-600 dark:text-blue-400",
  },
};

function DefaultMessageIcon({
  variant,
}: {
  variant: AuthFieldMessageVariant;
}) {
  if (variant === "success") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
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
          r="9"
        />

        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    );
  }

  if (variant === "warning") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />

        <path d="M12 9v4" />

        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (variant === "info") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
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
          r="9"
        />

        <path d="M12 11v5" />

        <path d="M12 8h.01" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
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
        r="9"
      />

      <path d="M15 9 9 15" />

      <path d="m9 9 6 6" />
    </svg>
  );
}

export function AuthFieldMessage({
  children,

  variant = "info",

  title,
  icon,

  showIcon = true,

  className,
  role,
  "aria-live": ariaLive,

  ...messageProps
}: AuthFieldMessageProps) {
  const styles =
    VARIANT_STYLES[variant];

  const accessibilityRole =
    role ??
    (variant === "error"
      ? "alert"
      : "status");

  const liveRegion =
    ariaLive ??
    (variant === "error"
      ? "assertive"
      : "polite");

  return (
    <div
      {...messageProps}
      role={accessibilityRole}
      aria-live={liveRegion}
      aria-atomic="true"
      className={[
        "flex w-full items-start gap-3 rounded-xl border px-4 py-3",
        "text-sm leading-6",
        styles.container,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showIcon ? (
        <span
          className={[
            "mt-0.5 flex shrink-0 items-center justify-center",
            styles.icon,
          ].join(" ")}
          aria-hidden="true"
        >
          {icon ?? (
            <DefaultMessageIcon
              variant={variant}
            />
          )}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        {title ? (
          <p className="font-semibold">
            {title}
          </p>
        ) : null}

        <div
          className={
            title
              ? "mt-1"
              : ""
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
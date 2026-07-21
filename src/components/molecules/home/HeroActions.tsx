import Link from "next/link";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export interface HeroActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  primaryLabel: ReactNode;
  primaryHref: string;
  primaryIcon?: ReactNode;
  primaryAriaLabel?: string;

  secondaryLabel: ReactNode;
  secondaryHref: string;
  secondaryIcon?: ReactNode;
  secondaryAriaLabel?: string;
}

export default function HeroActions({
  primaryLabel,
  primaryHref,
  primaryIcon,
  primaryAriaLabel,

  secondaryLabel,
  secondaryHref,
  secondaryIcon,
  secondaryAriaLabel,

  className,
  ...containerProps
}: HeroActionsProps) {
  return (
    <div
      {...containerProps}
      className={[
        "flex w-full flex-col gap-3",
        "sm:w-auto sm:flex-row sm:flex-wrap",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link
        href={primaryHref}
        aria-label={primaryAriaLabel}
        className={[
          "group",
          "inline-flex min-h-12 w-full",
          "items-center justify-center gap-2.5",
          "rounded-fixora-capsule",
          "bg-fixora-green-strong",
          "px-6 py-3",
          "text-center text-sm font-semibold text-white",
          "shadow-fixora-soft",
          "transition-[background-color,transform,box-shadow]",
          "duration-300 ease-out",
          "hover:-translate-y-0.5",
          "hover:bg-fixora-green-hover",
          "hover:shadow-fixora-hover",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-fixora-focus/25",
          "active:translate-y-0",
          "sm:w-auto",
        ].join(" ")}
      >
        <span className="whitespace-nowrap">
          {primaryLabel}
        </span>

        {primaryIcon ? (
          <span
            aria-hidden="true"
            className={[
              "flex shrink-0 items-center justify-center",
              "transition-transform duration-300",
              "group-hover:translate-x-0.5",
            ].join(" ")}
          >
            {primaryIcon}
          </span>
        ) : null}
      </Link>

      <Link
        href={secondaryHref}
        aria-label={secondaryAriaLabel}
        className={[
          "group",
          "inline-flex min-h-12 w-full",
          "items-center justify-center gap-2.5",
          "rounded-fixora-capsule",
          "border border-fixora-border-strong",
          "bg-fixora-surface",
          "px-6 py-3",
          "text-center text-sm font-semibold",
          "text-fixora-text",
          "shadow-fixora-soft",
          "backdrop-blur-xl",
          "transition-[background-color,border-color,transform,box-shadow]",
          "duration-300 ease-out",
          "hover:-translate-y-0.5",
          "hover:border-fixora-green/40",
          "hover:bg-fixora-surface-hover",
          "hover:shadow-fixora-hover",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-fixora-focus/25",
          "active:translate-y-0",
          "sm:w-auto",
        ].join(" ")}
      >
        {secondaryIcon ? (
          <span
            aria-hidden="true"
            className={[
              "flex shrink-0 items-center justify-center",
              "text-fixora-green-strong",
              "transition-transform duration-300",
              "group-hover:-translate-x-0.5",
              "dark:text-fixora-green",
            ].join(" ")}
          >
            {secondaryIcon}
          </span>
        ) : null}

        <span className="whitespace-nowrap">
          {secondaryLabel}
        </span>
      </Link>
    </div>
  );
}
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export type HomeBadgeVariant =
  | "brand"
  | "blue"
  | "violet"
  | "orange"
  | "neutral";

export interface HomeBadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: HomeBadgeVariant;
}

const VARIANT_STYLES: Record<
  HomeBadgeVariant,
  string
> = {
  brand: [
    "border-fixora-green/25",
    "bg-fixora-green-soft",
    "text-fixora-green-strong",
    "dark:text-fixora-green",
  ].join(" "),

  blue: [
    "border-sky-500/20",
    "bg-sky-500/10",
    "text-sky-700",
    "dark:text-sky-300",
  ].join(" "),

  violet: [
    "border-violet-500/20",
    "bg-violet-500/10",
    "text-violet-700",
    "dark:text-violet-300",
  ].join(" "),

  orange: [
    "border-orange-500/20",
    "bg-orange-500/10",
    "text-orange-700",
    "dark:text-orange-300",
  ].join(" "),

  neutral: [
    "border-fixora-border-strong",
    "bg-fixora-surface",
    "text-fixora-text-secondary",
  ].join(" "),
};

export default function HomeBadge({
  children,
  icon,
  variant = "brand",
  className,
  ...badgeProps
}: HomeBadgeProps) {
  return (
    <span
      {...badgeProps}
      className={[
        "inline-flex max-w-full items-center gap-2",
        "rounded-fixora-capsule border",
        "px-3 py-1.5",
        "text-[0.68rem] leading-none font-semibold",
        "tracking-[0.08em]",
        "shadow-sm",
        "transition-colors duration-300",
        VARIANT_STYLES[variant],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      ) : null}

      <span className="truncate">
        {children}
      </span>
    </span>
  );
}
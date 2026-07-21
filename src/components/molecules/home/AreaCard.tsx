import Link from "next/link";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import HomeIconContainer, {
  type HomeIconContainerVariant,
} from "@/components/atoms/home/HomeIconContainer";

export type AreaCardVariant =
  | "blue"
  | "green"
  | "violet"
  | "orange";

export interface AreaCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  href: string;
  linkLabel: ReactNode;
  linkAriaLabel?: string;
  variant?: AreaCardVariant;
}

const CARD_VARIANT_STYLES: Record<
  AreaCardVariant,
  string
> = {
  blue: [
    "border-sky-500/20",
    "from-sky-50",
    "via-white",
    "to-cyan-50",
    "hover:border-sky-500/35",
    "dark:border-sky-400/15",
    "dark:from-sky-950/35",
    "dark:via-slate-900",
    "dark:to-cyan-950/25",
    "dark:hover:border-sky-400/30",
  ].join(" "),

  green: [
    "border-emerald-500/20",
    "from-emerald-50",
    "via-white",
    "to-teal-50",
    "hover:border-emerald-500/35",
    "dark:border-emerald-400/15",
    "dark:from-emerald-950/35",
    "dark:via-slate-900",
    "dark:to-teal-950/25",
    "dark:hover:border-emerald-400/30",
  ].join(" "),

  violet: [
    "border-violet-500/20",
    "from-violet-50",
    "via-white",
    "to-fuchsia-50",
    "hover:border-violet-500/35",
    "dark:border-violet-400/15",
    "dark:from-violet-950/35",
    "dark:via-slate-900",
    "dark:to-fuchsia-950/25",
    "dark:hover:border-violet-400/30",
  ].join(" "),

  orange: [
    "border-orange-500/20",
    "from-orange-50",
    "via-white",
    "to-amber-50",
    "hover:border-orange-500/35",
    "dark:border-orange-400/15",
    "dark:from-orange-950/35",
    "dark:via-slate-900",
    "dark:to-amber-950/25",
    "dark:hover:border-orange-400/30",
  ].join(" "),
};

const LINK_VARIANT_STYLES: Record<
  AreaCardVariant,
  string
> = {
  blue: [
    "text-sky-700",
    "hover:text-sky-900",
    "focus-visible:ring-sky-500/25",
    "dark:text-sky-300",
    "dark:hover:text-sky-200",
  ].join(" "),

  green: [
    "text-emerald-700",
    "hover:text-emerald-900",
    "focus-visible:ring-emerald-500/25",
    "dark:text-emerald-300",
    "dark:hover:text-emerald-200",
  ].join(" "),

  violet: [
    "text-violet-700",
    "hover:text-violet-900",
    "focus-visible:ring-violet-500/25",
    "dark:text-violet-300",
    "dark:hover:text-violet-200",
  ].join(" "),

  orange: [
    "text-orange-700",
    "hover:text-orange-900",
    "focus-visible:ring-orange-500/25",
    "dark:text-orange-300",
    "dark:hover:text-orange-200",
  ].join(" "),
};

const ICON_VARIANTS: Record<
  AreaCardVariant,
  HomeIconContainerVariant
> = {
  blue: "blue",
  green: "green",
  violet: "violet",
  orange: "orange",
};

export default function AreaCard({
  icon,
  title,
  description,
  href,
  linkLabel,
  linkAriaLabel,
  variant = "blue",
  className,
  ...cardProps
}: AreaCardProps) {
  return (
    <article
      {...cardProps}
      className={[
        "group relative flex h-full min-w-0 flex-col",
        "overflow-hidden rounded-3xl border",
        "bg-gradient-to-br",
        "p-5 sm:p-6",
        "shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "hover:shadow-xl hover:shadow-slate-950/5",
        "dark:hover:shadow-black/20",
        CARD_VARIANT_STYLES[variant],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute",
          "-right-14 -top-14",
          "h-36 w-36 rounded-full",
          "bg-current opacity-5 blur-3xl",
          "transition-opacity duration-300",
          "group-hover:opacity-10",
        ].join(" ")}
      />

      <HomeIconContainer
        variant={ICON_VARIANTS[variant]}
        size="large"
        aria-hidden="true"
        className={[
          "relative z-10",
          "transition-transform duration-300",
          "group-hover:scale-105",
        ].join(" ")}
      >
        {icon}
      </HomeIconContainer>

      <div className="relative z-10 mt-5 flex flex-1 flex-col">
        <h3
          className={[
            "text-lg font-semibold leading-snug",
            "tracking-[-0.02em]",
            "text-slate-950",
            "transition-colors duration-300",
            "dark:text-white",
            "sm:text-xl",
          ].join(" ")}
        >
          {title}
        </h3>

        <p
          className={[
            "mt-2.5 flex-1",
            "text-sm leading-relaxed",
            "text-slate-600",
            "transition-colors duration-300",
            "dark:text-slate-300",
            "sm:text-base",
          ].join(" ")}
        >
          {description}
        </p>

        <Link
          href={href}
          aria-label={linkAriaLabel}
          className={[
            "mt-5 inline-flex w-fit items-center gap-2",
            "rounded-lg",
            "text-sm font-semibold",
            "transition-colors duration-300",
            "focus-visible:outline-none",
            "focus-visible:ring-4",
            LINK_VARIANT_STYLES[variant],
          ].join(" ")}
        >
          <span>{linkLabel}</span>

          <span
            aria-hidden="true"
            className={[
              "text-base leading-none",
              "transition-transform duration-300",
              "group-hover:translate-x-1",
            ].join(" ")}
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
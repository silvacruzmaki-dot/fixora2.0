import Link from "next/link";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import HomeIconContainer, {
  type HomeIconContainerVariant,
} from "@/components/atoms/home/HomeIconContainer";

export interface ServiceCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  href?: string;
  linkLabel?: ReactNode;
  linkAriaLabel?: string;
  variant?: HomeIconContainerVariant;
  featured?: boolean;
}

export default function ServiceCard({
  icon,
  title,
  description,
  href,
  linkLabel,
  linkAriaLabel,
  variant = "brand",
  featured = false,
  className,
  ...cardProps
}: ServiceCardProps) {
  const showLink = Boolean(href && linkLabel);

  return (
    <article
      {...cardProps}
      className={[
        "group relative flex h-full min-w-0 flex-col",
        "overflow-hidden rounded-3xl border",
        "p-5 sm:p-6",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        featured
          ? [
              "border-cyan-500/25",
              "bg-gradient-to-br",
              "from-cyan-50 via-white to-emerald-50",
              "shadow-lg shadow-cyan-950/5",
              "dark:border-cyan-400/20",
              "dark:from-cyan-950/40",
              "dark:via-slate-900",
              "dark:to-emerald-950/30",
              "dark:shadow-black/20",
            ].join(" ")
          : [
              "border-slate-200/80",
              "bg-white/75",
              "shadow-sm",
              "backdrop-blur-xl",
              "hover:border-slate-300",
              "hover:shadow-xl",
              "hover:shadow-slate-950/5",
              "dark:border-white/10",
              "dark:bg-slate-900/65",
              "dark:hover:border-white/20",
              "dark:hover:shadow-black/20",
            ].join(" "),
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-12 -top-12",
          "h-32 w-32 rounded-full",
          "bg-cyan-400/10 blur-3xl",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          "dark:bg-cyan-300/10",
        ].join(" ")}
      />

      <HomeIconContainer
        variant={variant}
        size="large"
        aria-hidden="true"
        className={[
          "relative z-10",
          "transition-transform duration-300",
          "group-hover:-rotate-2 group-hover:scale-105",
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

        {showLink ? (
          <Link
            href={href as string}
            aria-label={linkAriaLabel}
            className={[
              "mt-5 inline-flex w-fit items-center gap-2",
              "rounded-lg",
              "text-sm font-semibold",
              "text-cyan-700",
              "transition-colors duration-300",
              "hover:text-cyan-900",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-cyan-500/20",
              "dark:text-cyan-300",
              "dark:hover:text-cyan-200",
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
        ) : null}
      </div>
    </article>
  );
}
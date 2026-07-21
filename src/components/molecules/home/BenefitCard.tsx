import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import HomeIconContainer, {
  type HomeIconContainerVariant,
} from "@/components/atoms/home/HomeIconContainer";

export interface BenefitCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  variant?: HomeIconContainerVariant;
  iconLabel?: string;
}

export default function BenefitCard({
  icon,
  title,
  description,
  variant = "green",
  iconLabel,
  className,
  ...cardProps
}: BenefitCardProps) {
  return (
    <article
      {...cardProps}
      className={[
        "group relative flex h-full min-w-0 flex-col",
        "overflow-hidden rounded-3xl",
        "border border-slate-200/80",
        "bg-white/75 p-5",
        "shadow-sm backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "hover:border-emerald-500/25",
        "hover:shadow-xl hover:shadow-slate-950/5",
        "dark:border-white/10",
        "dark:bg-slate-900/65",
        "dark:hover:border-emerald-400/25",
        "dark:hover:shadow-black/20",
        "sm:p-6",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute",
          "-right-16 -top-16",
          "h-40 w-40 rounded-full",
          "bg-emerald-400/10 blur-3xl",
          "opacity-0",
          "transition-opacity duration-300",
          "group-hover:opacity-100",
          "dark:bg-emerald-300/10",
        ].join(" ")}
      />

      <HomeIconContainer
        variant={variant}
        size="large"
        aria-label={iconLabel}
        aria-hidden={iconLabel ? undefined : true}
        className={[
          "relative z-10",
          "transition-transform duration-300",
          "group-hover:scale-105",
        ].join(" ")}
      >
        {icon}
      </HomeIconContainer>

      <div className="relative z-10 mt-5">
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
            "mt-2.5 text-sm leading-relaxed",
            "text-slate-600",
            "transition-colors duration-300",
            "dark:text-slate-300",
            "sm:text-base",
          ].join(" ")}
        >
          {description}
        </p>
      </div>

      <span
        aria-hidden="true"
        className={[
          "absolute bottom-0 left-0",
          "h-1 w-0",
          "bg-gradient-to-r",
          "from-emerald-500 to-cyan-500",
          "transition-all duration-300",
          "group-hover:w-full",
        ].join(" ")}
      />
    </article>
  );
}
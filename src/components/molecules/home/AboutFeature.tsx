import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import HomeIconContainer, {
  type HomeIconContainerVariant,
} from "@/components/atoms/home/HomeIconContainer";

export interface AboutFeatureProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  variant?: HomeIconContainerVariant;
  iconLabel?: string;
}

export default function AboutFeature({
  icon,
  title,
  description,
  variant = "brand",
  iconLabel,
  className,
  ...containerProps
}: AboutFeatureProps) {
  return (
    <div
      {...containerProps}
      className={[
        "group flex min-w-0 items-start gap-4",
        "rounded-2xl border border-slate-200/80",
        "bg-white/70 p-4",
        "shadow-sm backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5",
        "hover:border-slate-300",
        "hover:shadow-lg hover:shadow-slate-950/5",
        "dark:border-white/10",
        "dark:bg-slate-900/60",
        "dark:hover:border-white/20",
        "dark:hover:shadow-black/20",
        "sm:p-5",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <HomeIconContainer
        variant={variant}
        size="medium"
        aria-label={iconLabel}
        aria-hidden={iconLabel ? undefined : true}
        className={[
          "transition-transform duration-300",
          "group-hover:scale-105",
        ].join(" ")}
      >
        {icon}
      </HomeIconContainer>

      <div className="min-w-0 flex-1">
        <h3
          className={[
            "text-base font-semibold",
            "leading-snug text-slate-950",
            "transition-colors duration-300",
            "dark:text-white",
            "sm:text-lg",
          ].join(" ")}
        >
          {title}
        </h3>

        <p
          className={[
            "mt-1.5 text-sm leading-relaxed",
            "text-slate-600",
            "transition-colors duration-300",
            "dark:text-slate-300",
            "sm:text-base",
          ].join(" ")}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
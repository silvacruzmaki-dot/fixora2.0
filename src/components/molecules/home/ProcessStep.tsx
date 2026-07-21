import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import HomeIconContainer, {
  type HomeIconContainerVariant,
} from "@/components/atoms/home/HomeIconContainer";

export interface ProcessStepProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  step: string | number;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  variant?: HomeIconContainerVariant;
  iconLabel?: string;
  showConnector?: boolean;
}

export default function ProcessStep({
  step,
  title,
  description,
  icon,
  variant = "blue",
  iconLabel,
  showConnector = false,
  className,
  ...stepProps
}: ProcessStepProps) {
  return (
    <article
      {...stepProps}
      className={[
        "group relative flex h-full min-w-0 flex-col",
        "rounded-3xl border border-slate-200/80",
        "bg-white/75 p-5",
        "shadow-sm backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "hover:border-sky-500/25",
        "hover:shadow-xl hover:shadow-slate-950/5",
        "dark:border-white/10",
        "dark:bg-slate-900/65",
        "dark:hover:border-sky-400/25",
        "dark:hover:shadow-black/20",
        "sm:p-6",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showConnector ? (
        <span
          aria-hidden="true"
          className={[
            "absolute left-[calc(100%+0.25rem)] top-10",
            "hidden h-px w-[calc(100%-0.5rem)]",
            "bg-gradient-to-r",
            "from-sky-500/40 to-transparent",
            "xl:block",
          ].join(" ")}
        />
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <span
          aria-hidden="true"
          className={[
            "inline-flex h-9 min-w-9 shrink-0",
            "items-center justify-center",
            "rounded-full px-2",
            "border border-sky-500/20",
            "bg-sky-500/10",
            "text-sm font-bold text-sky-700",
            "transition-colors duration-300",
            "dark:border-sky-400/20",
            "dark:bg-sky-400/10",
            "dark:text-sky-300",
          ].join(" ")}
        >
          {step}
        </span>

        {icon ? (
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
        ) : null}
      </div>

      <div className="mt-5">
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
          "absolute bottom-0 left-6 right-6",
          "h-px origin-left scale-x-0",
          "bg-gradient-to-r",
          "from-sky-500 via-cyan-500 to-emerald-500",
          "transition-transform duration-300",
          "group-hover:scale-x-100",
        ].join(" ")}
      />
    </article>
  );
}
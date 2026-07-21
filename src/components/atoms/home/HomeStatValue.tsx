import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export type HomeStatValueVariant =
  | "brand"
  | "blue"
  | "green"
  | "violet"
  | "orange"
  | "neutral";

export type HomeStatValueSize =
  | "small"
  | "medium"
  | "large";

export type HomeStatValueAlign =
  | "left"
  | "center"
  | "right";

export interface HomeStatValueProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "prefix"> {
  value: ReactNode;
  label: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  variant?: HomeStatValueVariant;
  size?: HomeStatValueSize;
  align?: HomeStatValueAlign;
}

const VARIANT_STYLES: Record<
  HomeStatValueVariant,
  string
> = {
  brand: "text-cyan-600 dark:text-cyan-300",
  blue: "text-sky-600 dark:text-sky-300",
  green: "text-emerald-600 dark:text-emerald-300",
  violet: "text-violet-600 dark:text-violet-300",
  orange: "text-orange-600 dark:text-orange-300",
  neutral: "text-slate-950 dark:text-white",
};

const VALUE_SIZE_STYLES: Record<
  HomeStatValueSize,
  string
> = {
  small: "text-2xl sm:text-3xl",
  medium: "text-3xl sm:text-4xl",
  large: "text-4xl sm:text-5xl lg:text-6xl",
};

const LABEL_SIZE_STYLES: Record<
  HomeStatValueSize,
  string
> = {
  small: "text-xs sm:text-sm",
  medium: "text-sm sm:text-base",
  large: "text-sm sm:text-base lg:text-lg",
};

const ALIGN_STYLES: Record<
  HomeStatValueAlign,
  string
> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export default function HomeStatValue({
  value,
  label,
  prefix,
  suffix,
  variant = "brand",
  size = "medium",
  align = "center",
  className,
  ...containerProps
}: HomeStatValueProps) {
  return (
    <div
      {...containerProps}
      className={[
        "flex min-w-0 flex-col gap-1.5",
        ALIGN_STYLES[align],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex max-w-full items-baseline gap-1",
          "font-bold tracking-[-0.035em]",
          "transition-colors duration-300",
          VARIANT_STYLES[variant],
          VALUE_SIZE_STYLES[size],
        ].join(" ")}
      >
        {prefix !== undefined && prefix !== null ? (
          <span className="shrink-0">
            {prefix}
          </span>
        ) : null}

        <span className="truncate">
          {value}
        </span>

        {suffix !== undefined && suffix !== null ? (
          <span className="shrink-0">
            {suffix}
          </span>
        ) : null}
      </div>

      <span
        className={[
          "max-w-xs text-pretty",
          "font-medium leading-relaxed",
          "text-slate-600",
          "transition-colors duration-300",
          "dark:text-slate-300",
          LABEL_SIZE_STYLES[size],
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}
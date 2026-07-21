import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export type HomeIconContainerVariant =
  | "brand"
  | "blue"
  | "green"
  | "violet"
  | "orange"
  | "neutral";

export type HomeIconContainerSize =
  | "small"
  | "medium"
  | "large";

export interface HomeIconContainerProps
  extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: HomeIconContainerVariant;
  size?: HomeIconContainerSize;
  rounded?: boolean;
}

const VARIANT_STYLES: Record<
  HomeIconContainerVariant,
  string
> = {
  brand: [
    "border-cyan-500/20",
    "bg-cyan-500/10",
    "text-cyan-700",
    "dark:border-cyan-400/20",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(" "),

  blue: [
    "border-sky-500/20",
    "bg-sky-500/10",
    "text-sky-700",
    "dark:border-sky-400/20",
    "dark:bg-sky-400/10",
    "dark:text-sky-300",
  ].join(" "),

  green: [
    "border-emerald-500/20",
    "bg-emerald-500/10",
    "text-emerald-700",
    "dark:border-emerald-400/20",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(" "),

  violet: [
    "border-violet-500/20",
    "bg-violet-500/10",
    "text-violet-700",
    "dark:border-violet-400/20",
    "dark:bg-violet-400/10",
    "dark:text-violet-300",
  ].join(" "),

  orange: [
    "border-orange-500/20",
    "bg-orange-500/10",
    "text-orange-700",
    "dark:border-orange-400/20",
    "dark:bg-orange-400/10",
    "dark:text-orange-300",
  ].join(" "),

  neutral: [
    "border-slate-200",
    "bg-slate-100",
    "text-slate-700",
    "dark:border-slate-700",
    "dark:bg-slate-800",
    "dark:text-slate-200",
  ].join(" "),
};

const SIZE_STYLES: Record<
  HomeIconContainerSize,
  string
> = {
  small: [
    "h-9 w-9",
    "text-base",
  ].join(" "),

  medium: [
    "h-12 w-12",
    "text-xl",
  ].join(" "),

  large: [
    "h-14 w-14",
    "text-2xl",
    "sm:h-16 sm:w-16",
  ].join(" "),
};

export default function HomeIconContainer({
  children,
  variant = "brand",
  size = "medium",
  rounded = true,
  className,
  ...containerProps
}: HomeIconContainerProps) {
  return (
    <span
      {...containerProps}
      className={[
        "inline-flex shrink-0 items-center justify-center",
        "border",
        "shadow-sm",
        "transition-all duration-300",
        SIZE_STYLES[size],
        VARIANT_STYLES[variant],
        rounded
          ? "rounded-2xl"
          : "rounded-lg",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
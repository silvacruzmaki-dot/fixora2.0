import type { HTMLAttributes } from "react";

export type HomeDecorativeShapeVariant =
  | "brand"
  | "blue"
  | "green"
  | "violet"
  | "orange";

export type HomeDecorativeShapeSize =
  | "small"
  | "medium"
  | "large"
  | "extraLarge";

export type HomeDecorativeShapeForm =
  | "circle"
  | "blob"
  | "ring";

export interface HomeDecorativeShapeProps
  extends HTMLAttributes<HTMLSpanElement> {
  variant?: HomeDecorativeShapeVariant;
  size?: HomeDecorativeShapeSize;
  form?: HomeDecorativeShapeForm;
  blurred?: boolean;
  animated?: boolean;
}

const VARIANT_STYLES: Record<
  HomeDecorativeShapeVariant,
  string
> = {
  brand: [
    "bg-cyan-400/20",
    "dark:bg-cyan-400/15",
  ].join(" "),

  blue: [
    "bg-sky-400/20",
    "dark:bg-sky-400/15",
  ].join(" "),

  green: [
    "bg-emerald-400/20",
    "dark:bg-emerald-400/15",
  ].join(" "),

  violet: [
    "bg-violet-400/20",
    "dark:bg-violet-400/15",
  ].join(" "),

  orange: [
    "bg-orange-400/20",
    "dark:bg-orange-400/15",
  ].join(" "),
};

const SIZE_STYLES: Record<
  HomeDecorativeShapeSize,
  string
> = {
  small: "h-20 w-20",
  medium: "h-36 w-36",
  large: "h-56 w-56",
  extraLarge: "h-80 w-80 sm:h-96 sm:w-96",
};

const FORM_STYLES: Record<
  HomeDecorativeShapeForm,
  string
> = {
  circle: "rounded-full",

  blob: [
    "rounded-[38%_62%_55%_45%/45%_40%_60%_55%]",
  ].join(" "),

  ring: [
    "rounded-full",
    "border-2",
    "border-current",
    "bg-transparent",
  ].join(" "),
};

const RING_VARIANT_STYLES: Record<
  HomeDecorativeShapeVariant,
  string
> = {
  brand: "text-cyan-400/25 dark:text-cyan-300/20",
  blue: "text-sky-400/25 dark:text-sky-300/20",
  green: "text-emerald-400/25 dark:text-emerald-300/20",
  violet: "text-violet-400/25 dark:text-violet-300/20",
  orange: "text-orange-400/25 dark:text-orange-300/20",
};

export default function HomeDecorativeShape({
  variant = "brand",
  size = "medium",
  form = "circle",
  blurred = true,
  animated = false,
  className,
  ...shapeProps
}: HomeDecorativeShapeProps) {
  const variantStyles =
    form === "ring"
      ? RING_VARIANT_STYLES[variant]
      : VARIANT_STYLES[variant];

  return (
    <span
      {...shapeProps}
      aria-hidden="true"
      className={[
        "pointer-events-none absolute select-none",
        "transition-colors duration-300",
        SIZE_STYLES[size],
        FORM_STYLES[form],
        variantStyles,
        blurred && form !== "ring"
          ? "blur-3xl"
          : "",
        animated
          ? "animate-pulse motion-reduce:animate-none"
          : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
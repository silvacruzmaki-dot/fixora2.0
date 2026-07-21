import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export type HomeSectionTitleTag =
  | "h1"
  | "h2"
  | "h3";

export type HomeSectionTitleSize =
  | "hero"
  | "section"
  | "small";

export type HomeSectionTitleAlign =
  | "left"
  | "center"
  | "right";

export interface HomeSectionTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: HomeSectionTitleTag;
  size?: HomeSectionTitleSize;
  align?: HomeSectionTitleAlign;
  highlightedText?: ReactNode;
}

const SIZE_STYLES: Record<
  HomeSectionTitleSize,
  string
> = {
  hero: [
    "text-4xl",
    "sm:text-5xl",
    "lg:text-6xl",
    "xl:text-7xl",
    "leading-[1.05]",
  ].join(" "),

  section: [
    "text-3xl",
    "sm:text-4xl",
    "lg:text-5xl",
    "leading-tight",
  ].join(" "),

  small: [
    "text-2xl",
    "sm:text-3xl",
    "leading-tight",
  ].join(" "),
};

const ALIGN_STYLES: Record<
  HomeSectionTitleAlign,
  string
> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function HomeSectionTitle({
  children,
  as: TitleTag = "h2",
  size = "section",
  align = "left",
  highlightedText,
  className,
  ...titleProps
}: HomeSectionTitleProps) {
  return (
    <TitleTag
      {...titleProps}
      className={[
        "max-w-4xl",
        "text-balance",
        "font-bold",
        "tracking-[-0.035em]",
        "text-slate-950",
        "transition-colors duration-300",
        "dark:text-white",
        SIZE_STYLES[size],
        ALIGN_STYLES[align],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}

      {highlightedText ? (
        <>
          {" "}
          <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            {highlightedText}
          </span>
        </>
      ) : null}
    </TitleTag>
  );
}
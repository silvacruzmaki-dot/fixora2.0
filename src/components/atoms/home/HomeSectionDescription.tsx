import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export type HomeSectionDescriptionTag =
  | "p"
  | "div";

export type HomeSectionDescriptionSize =
  | "hero"
  | "section"
  | "small";

export type HomeSectionDescriptionAlign =
  | "left"
  | "center"
  | "right";

export interface HomeSectionDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  as?: HomeSectionDescriptionTag;
  size?: HomeSectionDescriptionSize;
  align?: HomeSectionDescriptionAlign;
}

const SIZE_STYLES: Record<
  HomeSectionDescriptionSize,
  string
> = {
  hero: [
    "text-base",
    "sm:text-lg",
    "lg:text-xl",
    "leading-relaxed",
  ].join(" "),

  section: [
    "text-sm",
    "sm:text-base",
    "lg:text-lg",
    "leading-relaxed",
  ].join(" "),

  small: [
    "text-sm",
    "sm:text-base",
    "leading-relaxed",
  ].join(" "),
};

const ALIGN_STYLES: Record<
  HomeSectionDescriptionAlign,
  string
> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function HomeSectionDescription({
  children,
  as: DescriptionTag = "p",
  size = "section",
  align = "left",
  className,
  ...descriptionProps
}: HomeSectionDescriptionProps) {
  return (
    <DescriptionTag
      {...descriptionProps}
      className={[
        "max-w-3xl",
        "text-pretty",
        "font-normal",
        "text-slate-600",
        "transition-colors duration-300",
        "dark:text-slate-300",
        SIZE_STYLES[size],
        ALIGN_STYLES[align],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </DescriptionTag>
  );
}
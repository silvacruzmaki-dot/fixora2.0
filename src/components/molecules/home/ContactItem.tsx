import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

import HomeIconContainer, {
  type HomeIconContainerVariant,
} from "@/components/atoms/home/HomeIconContainer";

export interface ContactItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
  href?: string;
  variant?: HomeIconContainerVariant;
  iconLabel?: string;
  linkAriaLabel?: string;
  openInNewTab?: boolean;
  linkProps?: Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "href" | "className"
  >;
}

export default function ContactItem({
  icon,
  label,
  value,
  href,
  variant = "brand",
  iconLabel,
  linkAriaLabel,
  openInNewTab = false,
  linkProps,
  className,
  ...containerProps
}: ContactItemProps) {
  const content = (
    <>
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
        <p
          className={[
            "text-xs font-semibold uppercase",
            "tracking-[0.08em]",
            "text-slate-500",
            "transition-colors duration-300",
            "dark:text-slate-400",
          ].join(" ")}
        >
          {label}
        </p>

        <div
          className={[
            "mt-1 break-words",
            "text-sm font-semibold leading-relaxed",
            "text-slate-950",
            "transition-colors duration-300",
            "dark:text-white",
            "sm:text-base",
          ].join(" ")}
        >
          {value}
        </div>
      </div>

      {href ? (
        <span
          aria-hidden="true"
          className={[
            "ml-auto shrink-0",
            "text-lg leading-none",
            "text-slate-400",
            "transition-all duration-300",
            "group-hover:translate-x-1",
            "group-hover:text-cyan-600",
            "dark:text-slate-500",
            "dark:group-hover:text-cyan-300",
          ].join(" ")}
        >
          →
        </span>
      ) : null}
    </>
  );

  const sharedClassName = [
    "group flex min-w-0 items-center gap-4",
    "rounded-2xl border border-slate-200/80",
    "bg-white/75 p-4",
    "shadow-sm backdrop-blur-xl",
    "transition-all duration-300 ease-out",
    "dark:border-white/10",
    "dark:bg-slate-900/65",
    href
      ? [
          "hover:-translate-y-0.5",
          "hover:border-cyan-500/25",
          "hover:shadow-lg",
          "hover:shadow-slate-950/5",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-cyan-500/20",
          "dark:hover:border-cyan-400/25",
          "dark:hover:shadow-black/20",
        ].join(" ")
      : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        {...linkProps}
        href={href}
        aria-label={linkAriaLabel}
        target={openInNewTab ? "_blank" : linkProps?.target}
        rel={
          openInNewTab
            ? "noopener noreferrer"
            : linkProps?.rel
        }
        className={sharedClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      {...containerProps}
      className={sharedClassName}
    >
      {content}
    </article>
  );
}
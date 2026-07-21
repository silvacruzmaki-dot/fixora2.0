import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export interface ProductCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  image: string | StaticImageData;
  imageAlt: string;
  title: ReactNode;
  description?: ReactNode;
  category?: ReactNode;
  price?: ReactNode;
  previousPrice?: ReactNode;
  badge?: ReactNode;
  href?: string;
  linkLabel?: ReactNode;
  linkAriaLabel?: string;
  priority?: boolean;
  featured?: boolean;
}

export default function ProductCard({
  image,
  imageAlt,
  title,
  description,
  category,
  price,
  previousPrice,
  badge,
  href,
  linkLabel,
  linkAriaLabel,
  priority = false,
  featured = false,
  className,
  ...cardProps
}: ProductCardProps) {
  const showLink = Boolean(href && linkLabel);
  const showPrice = price !== undefined && price !== null;

  return (
    <article
      {...cardProps}
      className={[
        "group relative flex h-full min-w-0 flex-col",
        "overflow-hidden rounded-3xl border",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        featured
          ? [
              "border-cyan-500/25",
              "bg-cyan-50/70",
              "shadow-lg shadow-cyan-950/5",
              "dark:border-cyan-400/20",
              "dark:bg-cyan-950/20",
              "dark:shadow-black/20",
            ].join(" ")
          : [
              "border-slate-200/80",
              "bg-white/75",
              "shadow-sm",
              "backdrop-blur-xl",
              "hover:border-cyan-500/25",
              "hover:shadow-xl",
              "hover:shadow-slate-950/5",
              "dark:border-white/10",
              "dark:bg-slate-900/65",
              "dark:hover:border-cyan-400/25",
              "dark:hover:shadow-black/20",
            ].join(" "),
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "relative aspect-square w-full",
          "overflow-hidden bg-slate-100",
          "dark:bg-slate-950",
        ].join(" ")}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={priority}
          sizes={[
            "(max-width: 640px) 92vw",
            "(max-width: 1024px) 46vw",
            "300px",
          ].join(", ")}
          className={[
            "object-contain object-center p-5",
            "transition-transform duration-700 ease-out",
            "group-hover:scale-105",
            "sm:p-6",
          ].join(" ")}
        />

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0",
            "bg-gradient-to-t",
            "from-slate-950/10",
            "via-transparent",
            "to-white/10",
            "dark:from-black/25",
            "dark:to-white/5",
          ].join(" ")}
        />

        {badge ? (
          <span
            className={[
              "absolute right-4 top-4",
              "max-w-[calc(100%-2rem)] truncate",
              "rounded-full border",
              "border-cyan-500/20",
              "bg-white/85",
              "px-3 py-1.5",
              "text-xs font-semibold",
              "text-cyan-700",
              "shadow-sm backdrop-blur-md",
              "dark:border-cyan-400/20",
              "dark:bg-slate-950/80",
              "dark:text-cyan-300",
            ].join(" ")}
          >
            {badge}
          </span>
        ) : null}

        {category ? (
          <span
            className={[
              "absolute bottom-4 left-4",
              "max-w-[calc(100%-2rem)] truncate",
              "rounded-full border",
              "border-white/30",
              "bg-slate-950/50",
              "px-3 py-1.5",
              "text-xs font-semibold text-white",
              "shadow-sm backdrop-blur-md",
            ].join(" ")}
          >
            {category}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
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

        {description ? (
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
        ) : null}

        {showPrice ? (
          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <span
              className={[
                "text-xl font-bold",
                "tracking-[-0.025em]",
                "text-cyan-700",
                "dark:text-cyan-300",
                "sm:text-2xl",
              ].join(" ")}
            >
              {price}
            </span>

            {previousPrice ? (
              <span
                className={[
                  "text-sm font-medium",
                  "text-slate-400 line-through",
                  "dark:text-slate-500",
                ].join(" ")}
              >
                {previousPrice}
              </span>
            ) : null}
          </div>
        ) : null}

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
import Image, { type StaticImageData } from "next/image";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export interface TestimonialCardProps
  extends HTMLAttributes<HTMLElement> {
  quote: ReactNode;
  authorName: ReactNode;
  authorRole?: ReactNode;
  company?: ReactNode;
  avatar?: string | StaticImageData;
  avatarAlt?: string;
  fallbackAvatar?: ReactNode;
  rating?: number;
  ratingLabel?: string;
  featured?: boolean;
}

function normalizeRating(rating: number): number {
  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.min(5, Math.max(0, Math.round(rating)));
}

export default function TestimonialCard({
  quote,
  authorName,
  authorRole,
  company,
  avatar,
  avatarAlt = "",
  fallbackAvatar,
  rating = 5,
  ratingLabel,
  featured = false,
  className,
  ...cardProps
}: TestimonialCardProps) {
  const normalizedRating = normalizeRating(rating);

  return (
    <article
      {...cardProps}
      className={[
        "group relative flex h-full min-w-0 flex-col",
        "overflow-hidden rounded-3xl border",
        "p-5 sm:p-6",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        featured
          ? [
              "border-violet-500/25",
              "bg-gradient-to-br",
              "from-violet-50",
              "via-white",
              "to-fuchsia-50",
              "shadow-lg shadow-violet-950/5",
              "dark:border-violet-400/20",
              "dark:from-violet-950/30",
              "dark:via-slate-900",
              "dark:to-fuchsia-950/20",
              "dark:shadow-black/20",
            ].join(" ")
          : [
              "border-slate-200/80",
              "bg-white/75",
              "shadow-sm",
              "backdrop-blur-xl",
              "hover:border-violet-500/25",
              "hover:shadow-xl",
              "hover:shadow-slate-950/5",
              "dark:border-white/10",
              "dark:bg-slate-900/65",
              "dark:hover:border-violet-400/25",
              "dark:hover:shadow-black/20",
            ].join(" "),
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-12 -top-12",
          "h-36 w-36 rounded-full",
          "bg-violet-400/10 blur-3xl",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          "dark:bg-violet-300/10",
        ].join(" ")}
      />

      <span
        aria-hidden="true"
        className={[
          "relative z-10",
          "text-5xl font-bold leading-none",
          "text-violet-500/25",
          "transition-colors duration-300",
          "dark:text-violet-300/20",
        ].join(" ")}
      >
        “
      </span>

      <blockquote
        className={[
          "relative z-10 mt-1 flex-1",
          "text-sm leading-relaxed",
          "text-slate-700",
          "transition-colors duration-300",
          "dark:text-slate-200",
          "sm:text-base",
        ].join(" ")}
      >
        {quote}
      </blockquote>

      {normalizedRating > 0 ? (
        <div
          role="img"
          aria-label={ratingLabel}
          className="relative z-10 mt-5 flex items-center gap-1"
        >
          {Array.from({ length: 5 }, (_, index) => {
            const isActive = index < normalizedRating;

            return (
              <span
                key={index}
                aria-hidden="true"
                className={[
                  "text-lg leading-none",
                  "transition-colors duration-300",
                  isActive
                    ? "text-amber-500 dark:text-amber-300"
                    : "text-slate-300 dark:text-slate-700",
                ].join(" ")}
              >
                ★
              </span>
            );
          })}
        </div>
      ) : null}

      <footer
        className={[
          "relative z-10 mt-5",
          "flex min-w-0 items-center gap-3",
          "border-t border-slate-200/80 pt-5",
          "dark:border-white/10",
        ].join(" ")}
      >
        <div
          className={[
            "relative flex h-12 w-12 shrink-0",
            "items-center justify-center overflow-hidden",
            "rounded-full border",
            "border-violet-500/20",
            "bg-violet-500/10",
            "text-sm font-bold uppercase",
            "text-violet-700",
            "dark:border-violet-400/20",
            "dark:bg-violet-400/10",
            "dark:text-violet-300",
          ].join(" ")}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={avatarAlt}
              fill
              sizes="48px"
              className="object-cover object-center"
            />
          ) : (
            <span aria-hidden="true">
              {fallbackAvatar}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={[
              "truncate text-sm font-semibold",
              "text-slate-950",
              "transition-colors duration-300",
              "dark:text-white",
              "sm:text-base",
            ].join(" ")}
          >
            {authorName}
          </p>

          {authorRole || company ? (
            <p
              className={[
                "mt-0.5 truncate text-xs",
                "text-slate-500",
                "transition-colors duration-300",
                "dark:text-slate-400",
                "sm:text-sm",
              ].join(" ")}
            >
              {authorRole}

              {authorRole && company ? (
                <span aria-hidden="true"> · </span>
              ) : null}

              {company}
            </p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
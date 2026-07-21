import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export interface ProjectCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  image: string | StaticImageData;
  imageAlt: string;
  title: ReactNode;
  description: ReactNode;
  category?: ReactNode;
  technologies?: readonly string[];
  href?: string;
  linkLabel?: ReactNode;
  linkAriaLabel?: string;
  priority?: boolean;
  featured?: boolean;
}

export default function ProjectCard({
  image,
  imageAlt,
  title,
  description,
  category,
  technologies = [],
  href,
  linkLabel,
  linkAriaLabel,
  priority = false,
  featured = false,
  className,
  ...cardProps
}: ProjectCardProps) {
  const showLink = Boolean(href && linkLabel);

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
              "border-orange-500/25",
              "bg-orange-50/70",
              "shadow-lg shadow-orange-950/5",
              "dark:border-orange-400/20",
              "dark:bg-orange-950/20",
              "dark:shadow-black/20",
            ].join(" ")
          : [
              "border-slate-200/80",
              "bg-white/75",
              "shadow-sm",
              "backdrop-blur-xl",
              "hover:border-orange-500/25",
              "hover:shadow-xl",
              "hover:shadow-slate-950/5",
              "dark:border-white/10",
              "dark:bg-slate-900/65",
              "dark:hover:border-orange-400/25",
              "dark:hover:shadow-black/20",
            ].join(" "),
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "relative aspect-[16/10] w-full",
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
            "380px",
          ].join(", ")}
          className={[
            "object-cover object-center",
            "transition-transform duration-700 ease-out",
            "group-hover:scale-105",
          ].join(" ")}
        />

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0",
            "bg-gradient-to-t",
            "from-slate-950/45",
            "via-slate-950/5",
            "to-transparent",
            "opacity-70",
            "transition-opacity duration-300",
            "group-hover:opacity-50",
          ].join(" ")}
        />

        {category ? (
          <span
            className={[
              "absolute left-4 top-4",
              "max-w-[calc(100%-2rem)] truncate",
              "rounded-full border",
              "border-white/30",
              "bg-slate-950/45",
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

        {technologies.length > 0 ? (
          <ul
            aria-label="Tecnologías"
            className="mt-4 flex flex-wrap gap-2"
          >
            {technologies.map((technology) => (
              <li
                key={technology}
                className={[
                  "rounded-full border",
                  "border-slate-200",
                  "bg-slate-100",
                  "px-2.5 py-1",
                  "text-xs font-medium",
                  "text-slate-700",
                  "transition-colors duration-300",
                  "dark:border-white/10",
                  "dark:bg-white/5",
                  "dark:text-slate-300",
                ].join(" ")}
              >
                {technology}
              </li>
            ))}
          </ul>
        ) : null}

        {showLink ? (
          <Link
            href={href as string}
            aria-label={linkAriaLabel}
            className={[
              "mt-5 inline-flex w-fit items-center gap-2",
              "rounded-lg",
              "text-sm font-semibold",
              "text-orange-700",
              "transition-colors duration-300",
              "hover:text-orange-900",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-orange-500/20",
              "dark:text-orange-300",
              "dark:hover:text-orange-200",
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
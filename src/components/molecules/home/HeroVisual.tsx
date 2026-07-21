import Image, {
  type StaticImageData,
} from "next/image";

import type {
  HTMLAttributes,
} from "react";

import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";

export interface HeroVisualProps
  extends HTMLAttributes<HTMLDivElement> {
  lightImage: string | StaticImageData;
  darkImage?: string | StaticImageData;
  alt: string;
  priority?: boolean;
}

export default function HeroVisual({
  lightImage,
  darkImage,
  alt,
  priority = true,
  className,
  ...containerProps
}: HeroVisualProps) {
  return (
    <div
      {...containerProps}
      className={[
        "relative mx-auto w-full",
        "max-w-[34rem]",
        "lg:max-w-[40rem]",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <HomeDecorativeShape
        variant="blue"
        size="large"
        form="circle"
        className="-left-10 top-8"
      />

      <HomeDecorativeShape
        variant="green"
        size="medium"
        form="blob"
        className="-bottom-8 right-0"
      />

      <HomeDecorativeShape
        variant="violet"
        size="small"
        form="ring"
        blurred={false}
        className="right-4 top-2"
      />

      <div
        className={[
          "relative isolate",
          "aspect-[4/3] w-full overflow-hidden",
          "rounded-[2rem]",
          "border border-slate-200/80",
          "bg-white/70",
          "p-3",
          "shadow-2xl shadow-slate-950/10",
          "backdrop-blur-xl",
          "transition-colors duration-300",
          "dark:border-white/10",
          "dark:bg-slate-900/70",
          "dark:shadow-black/30",
          "sm:p-4",
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className={[
            "absolute inset-0 -z-10",
            "bg-gradient-to-br",
            "from-sky-100/80",
            "via-white/40",
            "to-emerald-100/70",
            "dark:from-sky-950/50",
            "dark:via-slate-950/20",
            "dark:to-emerald-950/40",
          ].join(" ")}
        />

        <div
          className={[
            "relative h-full w-full overflow-hidden",
            "rounded-[1.45rem]",
            "border border-white/70",
            "bg-slate-100",
            "dark:border-white/5",
            "dark:bg-slate-950",
          ].join(" ")}
        >
          <Image
            src={lightImage}
            alt={alt}
            fill
            priority={priority}
            sizes={[
              "(max-width: 640px) 92vw",
              "(max-width: 1024px) 70vw",
              "640px",
            ].join(", ")}
            className={[
              "object-cover object-center",
              "transition-transform duration-700",
              "hover:scale-[1.02]",
              darkImage ? "dark:hidden" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />

          {darkImage ? (
            <Image
              src={darkImage}
              alt={alt}
              fill
              priority={priority}
              sizes={[
                "(max-width: 640px) 92vw",
                "(max-width: 1024px) 70vw",
                "640px",
              ].join(", ")}
              className={[
                "hidden object-cover object-center",
                "transition-transform duration-700",
                "hover:scale-[1.02]",
                "dark:block",
              ].join(" ")}
            />
          ) : null}

          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0",
              "bg-gradient-to-t",
              "from-slate-950/15",
              "via-transparent",
              "to-white/10",
              "dark:from-black/30",
              "dark:to-white/5",
            ].join(" ")}
          />
        </div>
      </div>
    </div>
  );
}
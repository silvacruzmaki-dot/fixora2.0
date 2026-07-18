import type { RadialMenuTooltipProps } from "@/types/floating-menu/floatingMenu.types";

export default function RadialMenuTooltip({
  label,
  placement = "right",
}: Readonly<RadialMenuTooltipProps>) {
  const tooltipPositionClasses =
    placement === "top"
      ? [
          "bottom-full left-1/2",
          "mb-3",
          "-translate-x-1/2 translate-y-1",
          "group-hover:translate-y-0",
          "group-focus-visible:translate-y-0",
        ].join(" ")
      : [
          "left-full top-1/2",
          "ml-3",
          "translate-x-1 -translate-y-1/2",
          "group-hover:translate-x-0",
          "group-focus-visible:translate-x-0",
        ].join(" ");

  const arrowPositionClasses =
    placement === "top"
      ? [
          "left-1/2 top-full",
          "-translate-x-1/2 -translate-y-1/2",
          "border-b border-r",
        ].join(" ")
      : [
          "right-full top-1/2",
          "translate-x-1/2 -translate-y-1/2",
          "border-b border-l",
        ].join(" ");

  return (
    <span
      role="tooltip"
      className={[
        "pointer-events-none",
        "absolute z-[120]",
        "whitespace-nowrap",
        "rounded-lg",
        "border border-fixora-border",
        "bg-fixora-surface-solid",
        "px-2.5 py-1.5",
        "text-xs font-semibold",
        "text-fixora-text",
        "shadow-fixora-navbar",
        "opacity-0",
        "transition-[opacity,transform]",
        "duration-200 ease-out",
        "group-hover:opacity-100",
        "group-focus-visible:opacity-100",
        "max-md:hidden",
        tooltipPositionClasses,
      ].join(" ")}
    >
      {label}

      <span
        aria-hidden="true"
        className={[
          "absolute",
          "h-2.5 w-2.5",
          "rotate-45",
          "border-fixora-border",
          "bg-fixora-surface-solid",
          arrowPositionClasses,
        ].join(" ")}
      />
    </span>
  );
}
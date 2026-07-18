import NavigationList from "@/components/molecules/navbar/NavigationList";

export default function NavigationCapsule() {
  return (
    <nav
      aria-label="Navegación principal"
      className={[
        "isolate",
        "flex min-h-16 w-fit shrink-0",
        "items-center justify-center",
        "overflow-visible",
        "rounded-fixora-capsule",
        "border border-fixora-border",
        "bg-fixora-surface",
        "p-2",
        "shadow-fixora-navbar",
        "backdrop-blur-xl",
        "transition-[background-color,border-color,box-shadow]",
        "duration-300 ease-out",
        "hover:border-fixora-border-strong",
      ].join(" ")}
    >
      <NavigationList />
    </nav>
  );
}
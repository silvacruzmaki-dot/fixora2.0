import type { NavigationIconProps } from "@/types/navbar/navigation.types";

export default function NavigationIcon({
  icon: Icon,
  size = 22,
  className = "",
}: Readonly<NavigationIconProps>) {
  return (
    <Icon
      aria-hidden="true"
      className={`shrink-0 ${className}`.trim()}
      size={size}
    />
  );
}
import type { IconType } from "react-icons";

import type { LanguageTranslations } from "@/types/language/language.types";

export type NavbarTranslationKey = Exclude<
  keyof LanguageTranslations["navbar"],
  "login"
>;

export interface NavigationItem {
  translationKey: NavbarTranslationKey;
  href: string;
  icon: IconType;
}

export interface ExpandableNavItemProps {
  label: string;
  href: string;
  icon: IconType;
  isActive: boolean;
  onNavigate?: () => void;
}

export interface NavigationIconProps {
  icon: IconType;
  size?: number;
  className?: string;
}

export interface MobileNavigationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface MobileOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}
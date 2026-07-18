import type { IconType } from "react-icons";

export interface NavigationItem {
  label: string;
  href: string;
  icon: IconType;
}

export interface ExpandableNavItemProps extends NavigationItem {
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
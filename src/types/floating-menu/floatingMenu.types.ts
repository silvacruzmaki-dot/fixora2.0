import type {
  TouchEvent,
  WheelEvent,
} from "react";

import type { IconType } from "react-icons";

import type { LanguageTranslations } from "@/types/language/language.types";

/* =========================================================
   ACCIONES DEL MENÚ FLOTANTE
   ========================================================= */

export type FloatingMenuAction =
  | "toggle-theme"
  | "change-language"
  | "logout";

/* =========================================================
   COLORES DE CADA BOTÓN
   ========================================================= */

export type FloatingMenuAccent =
  | "green"
  | "lime"
  | "teal"
  | "charcoal"
  | "amber"
  | "red";

/* =========================================================
   CLAVES DE TRADUCCIÓN
   ========================================================= */

export type FloatingMenuTranslationKey = Extract<
  keyof LanguageTranslations["floatingMenu"],
  | "settings"
  | "notifications"
  | "profile"
  | "logout"
>;

/* =========================================================
   POSICIÓN DEL TOOLTIP
   ========================================================= */

export type RadialMenuTooltipPlacement =
  | "top"
  | "right";

/* =========================================================
   DATOS DE CADA OPCIÓN
   ========================================================= */

export interface FloatingMenuItem {
  id: string;
  translationKey: FloatingMenuTranslationKey;
  icon: IconType;
  accent: FloatingMenuAccent;
  href?: string;
  action?: FloatingMenuAction;
  requiresAuth?: boolean;
}

/* =========================================================
   BOTÓN PRINCIPAL
   ========================================================= */

export interface FloatingMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

/* =========================================================
   FONDO DEL MENÚ MÓVIL
   ========================================================= */

export interface FloatingMenuOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

/* =========================================================
   TOOLTIP
   ========================================================= */

export interface RadialMenuTooltipProps {
  label: string;
  placement?: RadialMenuTooltipPlacement;
}

/* =========================================================
   BOTÓN RADIAL NORMAL
   ========================================================= */

export interface RadialMenuItemProps {
  item: FloatingMenuItem;
  isOpen: boolean;
  angle: number;
  radius: number;
  index: number;
  onAction: (item: FloatingMenuItem) => void;
}

/* =========================================================
   RUEDA RADIAL
   ========================================================= */

export interface RadialMenuWheelProps {
  isOpen: boolean;
  rotation: number;
  radius: number;
  onAction: (item: FloatingMenuItem) => void;
}

/* =========================================================
   BOTÓN DE TEMA
   ========================================================= */

export interface ThemeRadialButtonProps {
  isOpen: boolean;
  angle: number;
  radius: number;
  index: number;
}

/* =========================================================
   BOTÓN DE IDIOMA
   ========================================================= */

export interface LanguageRadialButtonProps {
  isOpen: boolean;
  angle: number;
  radius: number;
  index: number;
}

/* =========================================================
   MENÚ RADIAL GENERAL
   ========================================================= */

export interface RadialMenuProps {
  isOpen: boolean;
  rotation: number;
  onToggle: () => void;
  onClose: () => void;
  onRotate: (direction: number) => void;
}

/* =========================================================
   HOOK DE APERTURA Y CIERRE
   ========================================================= */

export interface UseFloatingMenuReturn {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

/* =========================================================
   HOOK DE ROTACIÓN
   ========================================================= */

export interface UseRadialRotationReturn {
  rotation: number;

  rotateMenu: (direction: number) => void;

  handleWheel: (
    event: WheelEvent<HTMLElement>,
  ) => void;

  handleTouchStart: (
    event: TouchEvent<HTMLElement>,
  ) => void;

  handleTouchMove: (
    event: TouchEvent<HTMLElement>,
  ) => void;
}
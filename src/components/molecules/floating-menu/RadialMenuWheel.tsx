"use client";

import { useMemo } from "react";

import RadialMenuItem from "@/components/atoms/floating-menu/RadialMenuItem";
import LanguageRadialButton from "@/components/molecules/floating-menu/LanguageRadialButton";
import ThemeRadialButton from "@/components/molecules/floating-menu/ThemeRadialButton";

import { floatingMenuItems } from "@/constants/floating-menu/floatingMenuItems";
import { useAuth } from "@/hooks/auth/useAuth";

import type { RadialMenuWheelProps } from "@/types/floating-menu/floatingMenu.types";

/*
 * Elementos especiales:
 * 1. Tema.
 * 2. Idioma.
 *
 * Después se agregan las opciones normales
 * permitidas según la sesión.
 */
const TOTAL_SPECIAL_ITEMS = 2;

const ROTATION_STEP = 60;

/*
 * Solo se muestran cuatro posiciones.
 * El arco comienza arriba y termina a la derecha.
 */
const VISIBLE_SLOT_ANGLES = [
  -90,
  -60,
  -30,
  0,
] as const;

const VISIBLE_ITEMS_COUNT =
  VISIBLE_SLOT_ANGLES.length;

function normalizeIndex(
  index: number,
  totalItems: number,
): number {
  if (totalItems <= 0) {
    return 0;
  }

  return (
    (index % totalItems) +
    totalItems
  ) % totalItems;
}

export default function RadialMenuWheel({
  isOpen,
  rotation,
  radius,
  onAction,
}: Readonly<RadialMenuWheelProps>) {
  const {
    isAuthenticated,
  } = useAuth();

  /*
   * Las opciones marcadas con requiresAuth
   * solo se muestran cuando existe una sesión.
   *
   * Esto oculta:
   * - Perfil.
   * - Notificaciones.
   * - Cerrar sesión.
   *
   * cuando el visitante no inició sesión.
   */
  const availableMenuItems =
    useMemo(
      () =>
        floatingMenuItems.filter(
          (item) =>
            !item.requiresAuth ||
            isAuthenticated,
        ),
      [isAuthenticated],
    );

  const totalMenuItems =
    availableMenuItems.length +
    TOTAL_SPECIAL_ITEMS;

  /*
   * Convierte los grados de rotación
   * en pasos enteros.
   */
  const rotationOffset =
    normalizeIndex(
      Math.round(
        rotation /
          ROTATION_STEP,
      ),
      totalMenuItems,
    );

  /*
   * Obtiene la posición visible
   * de cada elemento.
   */
  const getVisibleSlot = (
    itemIndex: number,
  ): number => {
    return normalizeIndex(
      itemIndex -
        rotationOffset,
      totalMenuItems,
    );
  };

  /*
   * El botón de tema ocupa el índice 0.
   */
  const themeSlot =
    getVisibleSlot(0);

  const isThemeVisible =
    themeSlot <
    VISIBLE_ITEMS_COUNT;

  /*
   * El botón de idioma ocupa el índice 1.
   */
  const languageSlot =
    getVisibleSlot(1);

  const isLanguageVisible =
    languageSlot <
    VISIBLE_ITEMS_COUNT;

  return (
    <div
      id="fixora-radial-menu"
      aria-hidden={!isOpen}
      className={[
        "pointer-events-none",
        "absolute bottom-7 left-7",
        "z-10",
        "h-0 w-0",
        "sm:bottom-8 sm:left-8",
      ].join(" ")}
    >
      <ThemeRadialButton
        isOpen={
          isOpen &&
          isThemeVisible
        }
        angle={
          isThemeVisible
            ? VISIBLE_SLOT_ANGLES[
                themeSlot
              ]
            : 0
        }
        radius={radius}
        index={themeSlot}
      />

      <LanguageRadialButton
        isOpen={
          isOpen &&
          isLanguageVisible
        }
        angle={
          isLanguageVisible
            ? VISIBLE_SLOT_ANGLES[
                languageSlot
              ]
            : 0
        }
        radius={radius}
        index={languageSlot}
      />

      {availableMenuItems.map(
        (item, index) => {
          /*
           * Tema ocupa el índice 0.
           * Idioma ocupa el índice 1.
           * Los demás elementos comienzan en 2.
           */
          const itemIndex =
            index +
            TOTAL_SPECIAL_ITEMS;

          const visibleSlot =
            getVisibleSlot(
              itemIndex,
            );

          const isItemVisible =
            visibleSlot <
            VISIBLE_ITEMS_COUNT;

          return (
            <RadialMenuItem
              key={item.id}
              item={item}
              isOpen={
                isOpen &&
                isItemVisible
              }
              angle={
                isItemVisible
                  ? VISIBLE_SLOT_ANGLES[
                      visibleSlot
                    ]
                  : 0
              }
              radius={radius}
              index={visibleSlot}
              onAction={onAction}
            />
          );
        },
      )}
    </div>
  );
}
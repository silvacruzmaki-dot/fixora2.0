"use client";

import RadialMenuItem from "@/components/atoms/floating-menu/RadialMenuItem";
import ThemeRadialButton from "@/components/molecules/floating-menu/ThemeRadialButton";
import { floatingMenuItems } from "@/constants/floating-menu/floatingMenuItems";
import type { RadialMenuWheelProps } from "@/types/floating-menu/floatingMenu.types";

const TOTAL_MENU_ITEMS = floatingMenuItems.length + 1;
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

const VISIBLE_ITEMS_COUNT = VISIBLE_SLOT_ANGLES.length;

function normalizeIndex(index: number): number {
  return (
    (index % TOTAL_MENU_ITEMS) +
    TOTAL_MENU_ITEMS
  ) % TOTAL_MENU_ITEMS;
}

export default function RadialMenuWheel({
  isOpen,
  rotation,
  radius,
  onAction,
}: Readonly<RadialMenuWheelProps>) {
  /*
   * Convierte los grados de rotación en pasos enteros.
   * Cada movimiento desplaza una opción de la rueda.
   */
  const rotationOffset = normalizeIndex(
    Math.round(rotation / ROTATION_STEP),
  );

  /*
   * Obtiene la posición visible de cada elemento.
   * Si devuelve 0, 1, 2 o 3, aparece en el arco.
   * Si devuelve 4 o 5, permanece oculto.
   */
  const getVisibleSlot = (
    itemIndex: number,
  ): number => {
    return normalizeIndex(
      itemIndex - rotationOffset,
    );
  };

  const themeSlot = getVisibleSlot(0);
  const isThemeVisible =
    themeSlot < VISIBLE_ITEMS_COUNT;

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
        isOpen={isOpen && isThemeVisible}
        angle={
          isThemeVisible
            ? VISIBLE_SLOT_ANGLES[themeSlot]
            : 0
        }
        radius={radius}
        index={themeSlot}
      />

      {floatingMenuItems.map((item, index) => {
        /*
         * El tema ocupa el índice 0.
         * Los elementos normales comienzan en 1.
         */
        const itemIndex = index + 1;
        const visibleSlot =
          getVisibleSlot(itemIndex);

        const isItemVisible =
          visibleSlot < VISIBLE_ITEMS_COUNT;

        return (
          <RadialMenuItem
            key={item.id}
            item={item}
            isOpen={isOpen && isItemVisible}
            angle={
              isItemVisible
                ? VISIBLE_SLOT_ANGLES[visibleSlot]
                : 0
            }
            radius={radius}
            index={visibleSlot}
            onAction={onAction}
          />
        );
      })}
    </div>
  );
}
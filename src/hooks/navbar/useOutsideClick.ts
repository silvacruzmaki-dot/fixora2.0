"use client";

import { useEffect, type RefObject } from "react";

type OutsideClickEvent = MouseEvent | TouchEvent;

export default function useOutsideClick<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  handler: () => void,
  isEnabled = true,
): void {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleOutsideInteraction = (
      event: OutsideClickEvent,
    ): void => {
      const element = elementRef.current;
      const target = event.target;

      if (
        !element ||
        !(target instanceof Node) ||
        element.contains(target)
      ) {
        return;
      }

      handler();
    };

    document.addEventListener(
      "mousedown",
      handleOutsideInteraction,
    );

    document.addEventListener(
      "touchstart",
      handleOutsideInteraction,
      {
        passive: true,
      },
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideInteraction,
      );

      document.removeEventListener(
        "touchstart",
        handleOutsideInteraction,
      );
    };
  }, [elementRef, handler, isEnabled]);
}
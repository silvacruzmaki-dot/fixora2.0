"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { UseFloatingMenuReturn } from "@/types/floating-menu/floatingMenu.types";

export default function useFloatingMenu(): UseFloatingMenuReturn {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback((): void => {
    setIsOpen((currentState) => !currentState);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscapeKey = (
      event: KeyboardEvent,
    ): void => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscapeKey,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscapeKey,
      );
    };
  }, [closeMenu, isOpen]);

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
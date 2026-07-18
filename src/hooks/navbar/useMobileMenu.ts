"use client";

import { useCallback, useEffect, useState } from "react";

interface UseMobileMenuReturn {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export default function useMobileMenu(): UseMobileMenuReturn {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((currentState) => !currentState);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeMenu, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 768px)");

    const handleDesktopBreakpoint = (
      event: MediaQueryListEvent,
    ) => {
      if (event.matches) {
        closeMenu();
      }
    };

    desktopMediaQuery.addEventListener(
      "change",
      handleDesktopBreakpoint,
    );

    return () => {
      desktopMediaQuery.removeEventListener(
        "change",
        handleDesktopBreakpoint,
      );
    };
  }, [closeMenu]);

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
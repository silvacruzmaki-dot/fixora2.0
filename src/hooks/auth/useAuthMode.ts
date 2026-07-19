"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import type { AuthSwitchMode } from "@/components/molecules/auth/AuthSwitchContent";

export interface UseAuthModeOptions {
  initialMode?: AuthSwitchMode;

  transitionDuration?: number;
  respectReducedMotion?: boolean;

  onModeChange?: (
    mode: AuthSwitchMode,
  ) => void;
}

export interface UseAuthModeResult {
  mode: AuthSwitchMode;

  isLoginMode: boolean;
  isRegisterMode: boolean;

  isTransitioning: boolean;

  setMode: (
    mode: AuthSwitchMode,
  ) => void;

  switchToLogin: () => void;
  switchToRegister: () => void;
  toggleMode: () => void;
}

const DEFAULT_TRANSITION_DURATION =
  520;

const REDUCED_MOTION_QUERY =
  "(prefers-reduced-motion: reduce)";

function getReducedMotionSnapshot(): boolean {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  return window.matchMedia(
    REDUCED_MOTION_QUERY,
  ).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

function subscribeToReducedMotion(
  onStoreChange: () => void,
): () => void {
  if (
    typeof window ===
    "undefined"
  ) {
    return () => {};
  }

  const mediaQuery =
    window.matchMedia(
      REDUCED_MOTION_QUERY,
    );

  const handleChange =
    () => {
      onStoreChange();
    };

  mediaQuery.addEventListener(
    "change",
    handleChange,
  );

  return () => {
    mediaQuery.removeEventListener(
      "change",
      handleChange,
    );
  };
}

export function useAuthMode({
  initialMode = "login",

  transitionDuration =
    DEFAULT_TRANSITION_DURATION,

  respectReducedMotion = true,

  onModeChange,
}: UseAuthModeOptions = {}): UseAuthModeResult {
  const [
    mode,
    setModeState,
  ] =
    useState<AuthSwitchMode>(
      initialMode,
    );

  const [
    isTransitioning,
    setIsTransitioning,
  ] = useState(false);

  const transitionTimerRef =
    useRef<number | null>(
      null,
    );

  const systemPrefersReducedMotion =
    useSyncExternalStore(
      subscribeToReducedMotion,
      getReducedMotionSnapshot,
      getReducedMotionServerSnapshot,
    );

  const prefersReducedMotion =
    respectReducedMotion &&
    systemPrefersReducedMotion;

  const clearTransitionTimer =
    useCallback(() => {
      if (
        transitionTimerRef.current ===
        null
      ) {
        return;
      }

      window.clearTimeout(
        transitionTimerRef.current,
      );

      transitionTimerRef.current =
        null;
    }, []);

  useEffect(() => {
    return () => {
      if (
        transitionTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          transitionTimerRef.current,
        );

        transitionTimerRef.current =
          null;
      }
    };
  }, []);

  const setMode =
    useCallback(
      (
        nextMode:
          AuthSwitchMode,
      ) => {
        if (
          nextMode === mode ||
          isTransitioning
        ) {
          return;
        }

        clearTransitionTimer();

        setModeState(
          nextMode,
        );

        onModeChange?.(
          nextMode,
        );

        const normalizedDuration =
          Number.isFinite(
            transitionDuration,
          )
            ? Math.max(
                0,
                transitionDuration,
              )
            : DEFAULT_TRANSITION_DURATION;

        const effectiveDuration =
          prefersReducedMotion
            ? 0
            : normalizedDuration;

        if (
          effectiveDuration === 0
        ) {
          setIsTransitioning(
            false,
          );

          return;
        }

        setIsTransitioning(
          true,
        );

        transitionTimerRef.current =
          window.setTimeout(
            () => {
              setIsTransitioning(
                false,
              );

              transitionTimerRef.current =
                null;
            },
            effectiveDuration,
          );
      },
      [
        clearTransitionTimer,
        isTransitioning,
        mode,
        onModeChange,
        prefersReducedMotion,
        transitionDuration,
      ],
    );

  const switchToLogin =
    useCallback(() => {
      setMode(
        "login",
      );
    }, [setMode]);

  const switchToRegister =
    useCallback(() => {
      setMode(
        "register",
      );
    }, [setMode]);

  const toggleMode =
    useCallback(() => {
      setMode(
        mode === "login"
          ? "register"
          : "login",
      );
    }, [
      mode,
      setMode,
    ]);

  return {
    mode,

    isLoginMode:
      mode === "login",

    isRegisterMode:
      mode === "register",

    isTransitioning,

    setMode,

    switchToLogin,
    switchToRegister,

    toggleMode,
  };
}
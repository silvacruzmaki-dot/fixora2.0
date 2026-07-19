"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { LoginForm } from "@/components/molecules/auth/LoginForm";
import { RegisterForm } from "@/components/molecules/auth/RegisterForm";

import type { AuthSwitchMode } from "@/components/molecules/auth/AuthSwitchContent";

import { AuthAnimatedPanel } from "@/components/organisms/auth/AuthAnimatedPanel";

export interface AuthCardProps {
  initialMode?: AuthSwitchMode;

  redirectTo?: string;

  onModeChange?: (
    mode: AuthSwitchMode,
  ) => void;

  className?: string;
}

const AUTH_TRANSITION_DURATION =
  520;

function getSafeRedirectPath(
  redirectTo?: string,
): string | undefined {
  if (
    !redirectTo ||
    !redirectTo.startsWith("/") ||
    redirectTo.startsWith("//") ||
    redirectTo.startsWith("/admin")
  ) {
    return undefined;
  }

  return redirectTo;
}

export function AuthCard({
  initialMode = "login",

  redirectTo,

  onModeChange,

  className = "",
}: AuthCardProps) {
  const generatedId = useId();

  const formPanelId =
    `fixora-auth-form-${generatedId}`;

  const transitionTimerRef =
    useRef<number | null>(null);

  const [
    mode,
    setMode,
  ] =
    useState<AuthSwitchMode>(
      initialMode,
    );

  const [
    isTransitioning,
    setIsTransitioning,
  ] = useState(false);

  const [
    prefersReducedMotion,
    setPrefersReducedMotion,
  ] = useState(false);

  const safeRedirectTo =
    getSafeRedirectPath(
      redirectTo,
    );

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const updateMotionPreference =
      () => {
        setPrefersReducedMotion(
          mediaQuery.matches,
        );
      };

    updateMotionPreference();

    mediaQuery.addEventListener(
      "change",
      updateMotionPreference,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateMotionPreference,
      );
    };
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
      }
    };
  }, []);

  const handleSwitchMode =
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

        if (
          transitionTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            transitionTimerRef.current,
          );
        }

        setIsTransitioning(
          true,
        );

        setMode(
          nextMode,
        );

        onModeChange?.(
          nextMode,
        );

        const transitionDuration =
          prefersReducedMotion
            ? 0
            : AUTH_TRANSITION_DURATION;

        transitionTimerRef.current =
          window.setTimeout(
            () => {
              setIsTransitioning(
                false,
              );

              transitionTimerRef.current =
                null;
            },
            transitionDuration,
          );
      },
      [
        isTransitioning,
        mode,
        onModeChange,
        prefersReducedMotion,
      ],
    );

  return (
    <section
      className={[
        "w-full max-w-6xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={
        isTransitioning
          ? true
          : undefined
      }
    >
      <div
        className={[
          "relative grid overflow-hidden rounded-[2rem]",
          "border border-black/10 bg-white shadow-2xl shadow-black/10",
          "transition-[min-height] duration-500",
          "dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/30",
          "motion-reduce:transition-none",
          "lg:block",

          mode === "login"
            ? "lg:min-h-[760px]"
            : "lg:min-h-[980px]",
        ].join(" ")}
      >
        <div
          id={formPanelId}
          className={[
            "relative z-10 order-1 flex w-full items-center bg-white",
            "px-6 py-8 sm:px-8 sm:py-10",
            "dark:bg-zinc-900",
            "lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-1/2",
            "lg:overflow-y-auto lg:px-10 lg:py-12 xl:px-14",
            "transition-transform duration-500 ease-in-out",
            "motion-reduce:transition-none",

            mode === "login"
              ? "lg:translate-x-0"
              : "lg:translate-x-full",
          ].join(" ")}
        >
          <div className="mx-auto w-full max-w-md">
            {mode ===
            "login" ? (
              <LoginForm
                redirectTo={
                  safeRedirectTo
                }
                onRequestRegister={() => {
                  handleSwitchMode(
                    "register",
                  );
                }}
              />
            ) : (
              <RegisterForm
                onRequestLogin={() => {
                  handleSwitchMode(
                    "login",
                  );
                }}
              />
            )}
          </div>
        </div>

        <div
          className={[
            "relative z-20 order-2 min-h-80 w-full",
            "bg-emerald-700",
            "lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-1/2",
            "transition-transform duration-500 ease-in-out",
            "motion-reduce:transition-none",

            mode === "login"
              ? "lg:translate-x-full"
              : "lg:translate-x-0",
          ].join(" ")}
        >
          <AuthAnimatedPanel
            mode={mode}
            controlsId={
              formPanelId
            }
            disabled={
              isTransitioning
            }
            onSwitchMode={
              handleSwitchMode
            }
          />
        </div>

        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {mode === "login"
            ? "Login form active"
            : "Registration form active"}
        </p>
      </div>
    </section>
  );
}
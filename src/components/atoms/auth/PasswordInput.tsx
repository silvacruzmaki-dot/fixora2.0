"use client";

import {
  forwardRef,
  useState,
  type MouseEvent,
} from "react";

import {
  AuthInput,
  type AuthInputProps,
} from "@/components/atoms/auth/AuthInput";

export interface PasswordInputProps
  extends Omit<
    AuthInputProps,
    "type" | "trailingElement"
  > {
  showPasswordLabel: string;
  hidePasswordLabel: string;

  defaultVisible?: boolean;
  visibilityToggleDisabled?: boolean;

  onVisibilityChange?: (
    isVisible: boolean,
  ) => void;
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput(
  {
    showPasswordLabel,
    hidePasswordLabel,

    defaultVisible = false,
    visibilityToggleDisabled = false,

    onVisibilityChange,

    disabled,

    ...inputProps
  },
  ref,
) {
  const [
    isPasswordVisible,
    setIsPasswordVisible,
  ] = useState(defaultVisible);

  const handleVisibilityToggle = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    /*
     * Evita que el botón intente enviar
     * el formulario de autenticación.
     */
    event.preventDefault();

    if (
      disabled ||
      visibilityToggleDisabled
    ) {
      return;
    }

    setIsPasswordVisible(
      (currentVisibility) => {
        const nextVisibility =
          !currentVisibility;

        onVisibilityChange?.(
          nextVisibility,
        );

        return nextVisibility;
      },
    );
  };

  const accessibilityLabel =
    isPasswordVisible
      ? hidePasswordLabel
      : showPasswordLabel;

  return (
    <AuthInput
      {...inputProps}
      ref={ref}
      type={
        isPasswordVisible
          ? "text"
          : "password"
      }
      disabled={disabled}
      trailingElement={
        <button
          type="button"
          onClick={
            handleVisibilityToggle
          }
          disabled={
            disabled ||
            visibilityToggleDisabled
          }
          aria-label={
            accessibilityLabel
          }
          title={
            accessibilityLabel
          }
          aria-pressed={
            isPasswordVisible
          }
          className={[
            "flex h-9 w-9 items-center justify-center rounded-lg",
            "text-zinc-500 transition",
            "hover:bg-zinc-100 hover:text-zinc-900",
            "focus:outline-none focus:ring-4 focus:ring-emerald-500/15",
            "dark:text-zinc-400",
            "dark:hover:bg-zinc-800 dark:hover:text-white",
            "disabled:cursor-not-allowed disabled:opacity-40",
          ].join(" ")}
        >
          {isPasswordVisible ? (
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 3l18 18" />

              <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />

              <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.4 4.1 10.5 6.1a3.7 3.7 0 0 1 0 3.8 13 13 0 0 1-2.5 3.1" />

              <path d="M6.6 6.6A13.4 13.4 0 0 0 1.5 10a3.7 3.7 0 0 0 0 4C2.6 15.9 6.5 20 12 20a10.4 10.4 0 0 0 4.1-.8" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

              <circle
                cx="12"
                cy="12"
                r="3"
              />
            </svg>
          )}
        </button>
      }
    />
  );
});

PasswordInput.displayName =
  "PasswordInput";
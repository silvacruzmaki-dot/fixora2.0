"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export interface AuthSubmitButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type"
  > {
  children: ReactNode;

  isLoading?: boolean;
  loadingText?: string;

  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;

  fullWidth?: boolean;
}

export const AuthSubmitButton = forwardRef<
  HTMLButtonElement,
  AuthSubmitButtonProps
>(function AuthSubmitButton(
  {
    children,

    isLoading = false,
    loadingText,

    leadingIcon,
    trailingIcon,

    fullWidth = true,

    disabled,
    className,

    ...buttonProps
  },
  ref,
) {
  const isDisabled =
    disabled || isLoading;

  const visibleContent =
    isLoading && loadingText
      ? loadingText
      : children;

  return (
    <button
      {...buttonProps}
      ref={ref}
      type="submit"
      disabled={isDisabled}
      aria-busy={
        isLoading
          ? true
          : undefined
      }
      className={[
        "relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-xl",
        "bg-emerald-600 px-6 py-3 text-sm font-semibold text-white",
        "shadow-lg shadow-emerald-600/15 transition",
        "hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/20",
        "focus:outline-none focus:ring-4 focus:ring-emerald-500/20",
        "active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "disabled:hover:bg-emerald-600 disabled:hover:shadow-lg",
        "disabled:active:scale-100",

        fullWidth
          ? "w-full"
          : "",

        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isLoading ? (
        <span
          className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      ) : leadingIcon ? (
        <span
          className="flex shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          {leadingIcon}
        </span>
      ) : null}

      <span>
        {visibleContent}
      </span>

      {!isLoading &&
      trailingIcon ? (
        <span
          className="flex shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});

AuthSubmitButton.displayName =
  "AuthSubmitButton";
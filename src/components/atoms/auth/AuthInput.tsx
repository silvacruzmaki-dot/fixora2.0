"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export interface AuthInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size"
  > {
  label: string;

  errorMessage?: string;
  helperText?: string;

  leadingIcon?: ReactNode;
  trailingElement?: ReactNode;

  containerClassName?: string;
  inputClassName?: string;

  requiredIndicator?: boolean;
}

export const AuthInput = forwardRef<
  HTMLInputElement,
  AuthInputProps
>(function AuthInput(
  {
    id,
    label,

    errorMessage,
    helperText,

    leadingIcon,
    trailingElement,

    containerClassName = "",
    inputClassName = "",

    requiredIndicator = true,

    required,
    disabled,

    className,

    "aria-describedby":
      ariaDescribedBy,

    ...inputProps
  },
  ref,
) {
  const generatedId = useId();

  const inputId =
    id ?? `auth-input-${generatedId}`;

  const helperTextId =
    `${inputId}-helper`;

  const errorMessageId =
    `${inputId}-error`;

  const descriptionIds = [
    ariaDescribedBy,

    helperText && !errorMessage
      ? helperTextId
      : undefined,

    errorMessage
      ? errorMessageId
      : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const hasLeadingIcon =
    leadingIcon !== undefined &&
    leadingIcon !== null;

  const hasTrailingElement =
    trailingElement !== undefined &&
    trailingElement !== null;

  return (
    <div
      className={`grid w-full gap-2 ${containerClassName}`}
    >
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-zinc-800 dark:text-zinc-200"
      >
        {label}

        {required &&
        requiredIndicator ? (
          <span
            className="ml-1 text-red-500"
            aria-hidden="true"
          >
            *
          </span>
        ) : null}
      </label>

      <div className="relative">
        {hasLeadingIcon ? (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center text-lg text-zinc-400"
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        ) : null}

        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          required={required}
          disabled={disabled}
          aria-invalid={
            errorMessage
              ? true
              : undefined
          }
          aria-describedby={
            descriptionIds ||
            undefined
          }
          className={[
            "h-12 w-full rounded-xl border bg-white text-sm text-zinc-950 outline-none transition",
            "placeholder:text-zinc-400",
            "dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500",
            "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 disabled:opacity-70",
            "dark:disabled:bg-zinc-900 dark:disabled:text-zinc-500",

            hasLeadingIcon
              ? "pl-12"
              : "pl-4",

            hasTrailingElement
              ? "pr-12"
              : "pr-4",

            errorMessage
              ? [
                  "border-red-500",
                  "focus:border-red-500",
                  "focus:ring-4",
                  "focus:ring-red-500/10",
                  "dark:border-red-500",
                ].join(" ")
              : [
                  "border-black/10",
                  "focus:border-emerald-500",
                  "focus:ring-4",
                  "focus:ring-emerald-500/10",
                  "dark:border-white/10",
                ].join(" "),

            className ?? "",
            inputClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {hasTrailingElement ? (
          <div className="absolute inset-y-0 right-0 flex w-12 items-center justify-center">
            {trailingElement}
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <p
          id={errorMessageId}
          role="alert"
          className="text-xs font-medium leading-5 text-red-600 dark:text-red-400"
        >
          {errorMessage}
        </p>
      ) : helperText ? (
        <p
          id={helperTextId}
          className="text-xs leading-5 text-zinc-500 dark:text-zinc-400"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

AuthInput.displayName =
  "AuthInput";
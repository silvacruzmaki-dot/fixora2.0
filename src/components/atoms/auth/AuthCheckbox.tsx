"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export interface AuthCheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
  > {
  label: ReactNode;

  helperText?: string;
  errorMessage?: string;

  containerClassName?: string;
  checkboxClassName?: string;

  requiredIndicator?: boolean;
}

export const AuthCheckbox = forwardRef<
  HTMLInputElement,
  AuthCheckboxProps
>(function AuthCheckbox(
  {
    id,
    label,

    helperText,
    errorMessage,

    containerClassName = "",
    checkboxClassName = "",

    requiredIndicator = true,

    required,
    disabled,

    className,

    "aria-describedby":
      ariaDescribedBy,

    ...checkboxProps
  },
  ref,
) {
  const generatedId = useId();

  const checkboxId =
    id ?? `auth-checkbox-${generatedId}`;

  const helperTextId =
    `${checkboxId}-helper`;

  const errorMessageId =
    `${checkboxId}-error`;

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

  return (
    <div
      className={`grid w-full gap-2 ${containerClassName}`}
    >
      <label
        htmlFor={checkboxId}
        className={[
          "flex items-start gap-3",
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer",
        ].join(" ")}
      >
        <input
          {...checkboxProps}
          ref={ref}
          id={checkboxId}
          type="checkbox"
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
            "mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border",
            "accent-emerald-600 outline-none transition",
            "focus:ring-4 focus:ring-emerald-500/15",
            "disabled:cursor-not-allowed",

            errorMessage
              ? "border-red-500"
              : "border-black/20 dark:border-white/20",

            className ?? "",
            checkboxClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        <span className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
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
        </span>
      </label>

      {errorMessage ? (
        <p
          id={errorMessageId}
          role="alert"
          className="pl-8 text-xs font-medium leading-5 text-red-600 dark:text-red-400"
        >
          {errorMessage}
        </p>
      ) : helperText ? (
        <p
          id={helperTextId}
          className="pl-8 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

AuthCheckbox.displayName =
  "AuthCheckbox";
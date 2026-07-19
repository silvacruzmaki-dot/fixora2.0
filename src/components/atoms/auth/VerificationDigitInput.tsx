"use client";

import {
  forwardRef,
  type ChangeEvent,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";

export interface VerificationDigitInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "onPaste"
    | "onKeyDown"
    | "maxLength"
    | "inputMode"
    | "pattern"
  > {
  value: string;

  index: number;
  totalDigits: number;

  ariaLabel: string;

  hasError?: boolean;

  onValueChange: (
    value: string,
    index: number,
  ) => void;

  onPasteDigits?: (
    digits: string,
    index: number,
  ) => void;

  onBackspaceFromEmpty?: (
    index: number,
  ) => void;

  onMovePrevious?: (
    index: number,
  ) => void;

  onMoveNext?: (
    index: number,
  ) => void;
}

function extractDigits(
  value: string,
): string {
  return value.replace(/\D/g, "");
}

export const VerificationDigitInput =
  forwardRef<
    HTMLInputElement,
    VerificationDigitInputProps
  >(function VerificationDigitInput(
    {
      value,

      index,
      totalDigits,

      ariaLabel,

      hasError = false,

      onValueChange,
      onPasteDigits,
      onBackspaceFromEmpty,
      onMovePrevious,
      onMoveNext,

      disabled,
      className,

      autoComplete,
      ...inputProps
    },
    ref,
  ) {
    const handleChange = (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const digits = extractDigits(
        event.target.value,
      );

      /*
       * En dispositivos móviles puede llegar más
       * de un carácter al reemplazar el contenido.
       * Conservamos únicamente el último dígito.
       */
      const nextValue =
        digits.slice(-1);

      onValueChange(
        nextValue,
        index,
      );
    };

    const handlePaste = (
      event: ClipboardEvent<HTMLInputElement>,
    ) => {
      const pastedText =
        event.clipboardData.getData(
          "text",
        );

      const pastedDigits =
        extractDigits(
          pastedText,
        ).slice(0, totalDigits);

      if (!pastedDigits) {
        return;
      }

      event.preventDefault();

      if (onPasteDigits) {
        onPasteDigits(
          pastedDigits,
          index,
        );

        return;
      }

      onValueChange(
        pastedDigits.charAt(0),
        index,
      );
    };

    const handleKeyDown = (
      event: KeyboardEvent<HTMLInputElement>,
    ) => {
      if (
        event.key === "Backspace" &&
        value.length === 0
      ) {
        event.preventDefault();

        onBackspaceFromEmpty?.(
          index,
        );

        return;
      }

      if (
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();

        onMovePrevious?.(
          index,
        );

        return;
      }

      if (
        event.key === "ArrowRight"
      ) {
        event.preventDefault();

        onMoveNext?.(
          index,
        );
      }
    };

    const isFirstDigit =
      index === 0;

    const isLastDigit =
      index ===
      totalDigits - 1;

    return (
      <input
        {...inputProps}
        ref={ref}
        type="text"
        value={value}
        disabled={disabled}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        autoComplete={
          autoComplete ??
          (isFirstDigit
            ? "one-time-code"
            : "off")
        }
        enterKeyHint={
          isLastDigit
            ? "done"
            : "next"
        }
        aria-label={
          ariaLabel
        }
        aria-invalid={
          hasError
            ? true
            : undefined
        }
        data-digit-index={index}
        onChange={
          handleChange
        }
        onPaste={
          handlePaste
        }
        onKeyDown={
          handleKeyDown
        }
        onFocus={(event) => {
          event.currentTarget.select();
        }}
        className={[
          "h-14 w-12 rounded-xl border bg-white text-center text-xl font-bold text-zinc-950 outline-none transition",
          "caret-emerald-600",
          "selection:bg-emerald-500/20",
          "focus:-translate-y-0.5",
          "focus:ring-4",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-zinc-950 dark:text-white",

          hasError
            ? [
                "border-red-500",
                "focus:border-red-500",
                "focus:ring-red-500/15",
                "dark:border-red-500",
              ].join(" ")
            : [
                "border-black/15",
                "focus:border-emerald-500",
                "focus:ring-emerald-500/15",
                "dark:border-white/15",
              ].join(" "),

          value
            ? [
                "border-emerald-500",
                "bg-emerald-500/5",
                "text-emerald-700",
                "dark:border-emerald-500",
                "dark:bg-emerald-500/10",
                "dark:text-emerald-300",
              ].join(" ")
            : "",

          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  });

VerificationDigitInput.displayName =
  "VerificationDigitInput";
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

import { AUTH_CODE_LENGTH } from "@/constants/auth/auth.constants";

export interface UseVerificationCodeOptions {
  length?: number;
  initialCode?: string;

  autoFocus?: boolean;

  onChange?: (
    code: string,
    digits: string[],
  ) => void;

  onComplete?: (
    code: string,
  ) => void;
}

export interface UseVerificationCodeResult {
  digits: string[];
  code: string;

  isComplete: boolean;
  completedDigitCount: number;

  registerInput: (
    index: number,
  ) => (
    element: HTMLInputElement | null,
  ) => void;

  focusDigit: (
    index: number,
  ) => void;

  setDigit: (
    index: number,
    value: string,
  ) => void;

  setCode: (
    value: string,
    focusNextEmpty?: boolean,
  ) => void;

  clearCode: (
    focusFirst?: boolean,
  ) => void;

  handleInputChange: (
    index: number,
    value: string,
  ) => void;

  handleInputKeyDown: (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => void;

  handlePaste: (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => void;
}

interface VerificationCodeState {
  sourceKey: string;
  digits: string[];
}

function normalizeCodeLength(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return Math.max(
      1,
      Math.floor(
        AUTH_CODE_LENGTH,
      ),
    );
  }

  return Math.max(
    1,
    Math.floor(value),
  );
}

function sanitizeNumericCode(
  value: string,
  maximumLength: number,
): string {
  return value
    .replace(/\D/g, "")
    .slice(
      0,
      maximumLength,
    );
}

function createEmptyDigits(
  length: number,
): string[] {
  return Array.from(
    {
      length,
    },
    () => "",
  );
}

function codeToDigits(
  value: string,
  length: number,
): string[] {
  const sanitizedCode =
    sanitizeNumericCode(
      value,
      length,
    );

  const digits =
    createEmptyDigits(
      length,
    );

  sanitizedCode
    .split("")
    .forEach(
      (
        digit,
        index,
      ) => {
        digits[index] =
          digit;
      },
    );

  return digits;
}

function createSourceKey(
  initialCode: string,
  length: number,
): string {
  return `${length}:${sanitizeNumericCode(
    initialCode,
    length,
  )}`;
}

export function useVerificationCode({
  length = AUTH_CODE_LENGTH,
  initialCode = "",

  autoFocus = false,

  onChange,
  onComplete,
}: UseVerificationCodeOptions = {}): UseVerificationCodeResult {
  const safeLength =
    normalizeCodeLength(
      length,
    );

  const sourceKey =
    createSourceKey(
      initialCode,
      safeLength,
    );

  const [
    verificationState,
    setVerificationState,
  ] =
    useState<VerificationCodeState>(
      () => ({
        sourceKey,

        digits:
          codeToDigits(
            initialCode,
            safeLength,
          ),
      }),
    );

  const inputRefs =
    useRef<
      Array<HTMLInputElement | null>
    >([]);

  const lastCompletedCodeRef =
    useRef<string | null>(
      null,
    );

  /*
   * Cuando initialCode o length cambian, mostramos
   * inmediatamente los nuevos dígitos sin ejecutar
   * setState dentro de un efecto.
   */
  const digits =
    useMemo(
      () => {
        if (
          verificationState
            .sourceKey ===
          sourceKey
        ) {
          return verificationState
            .digits;
        }

        return codeToDigits(
          initialCode,
          safeLength,
        );
      },
      [
        initialCode,
        safeLength,
        sourceKey,
        verificationState,
      ],
    );

  const code =
    useMemo(
      () =>
        digits.join(""),
      [digits],
    );

  const completedDigitCount =
    useMemo(
      () =>
        digits.filter(
          Boolean,
        ).length,
      [digits],
    );

  const isComplete =
    completedDigitCount ===
      safeLength &&
    code.length ===
      safeLength;

  const resolveCurrentDigits =
    useCallback(
      (
        currentState:
          VerificationCodeState,
      ): string[] => {
        if (
          currentState.sourceKey ===
          sourceKey
        ) {
          return currentState.digits;
        }

        return codeToDigits(
          initialCode,
          safeLength,
        );
      },
      [
        initialCode,
        safeLength,
        sourceKey,
      ],
    );

  const focusDigit =
    useCallback(
      (
        index: number,
      ) => {
        const safeIndex =
          Math.min(
            Math.max(
              Math.floor(index),
              0,
            ),
            safeLength - 1,
          );

        window.requestAnimationFrame(
          () => {
            const input =
              inputRefs.current[
                safeIndex
              ];

            input?.focus();
            input?.select();
          },
        );
      },
      [safeLength],
    );

  const registerInput =
    useCallback(
      (
        index: number,
      ) =>
        (
          element:
            HTMLInputElement | null,
        ): void => {
          if (
            index < 0 ||
            index >= safeLength
          ) {
            return;
          }

          inputRefs.current[
            index
          ] = element;
        },
      [safeLength],
    );

  const setDigit =
    useCallback(
      (
        index: number,
        value: string,
      ) => {
        if (
          index < 0 ||
          index >= safeLength
        ) {
          return;
        }

        const sanitizedValue =
          sanitizeNumericCode(
            value,
            1,
          );

        setVerificationState(
          (
            currentState,
          ) => {
            const currentDigits =
              resolveCurrentDigits(
                currentState,
              );

            if (
              currentState.sourceKey ===
                sourceKey &&
              currentDigits[index] ===
                sanitizedValue
            ) {
              return currentState;
            }

            const nextDigits =
              [
                ...currentDigits,
              ];

            nextDigits[index] =
              sanitizedValue;

            return {
              sourceKey,
              digits:
                nextDigits,
            };
          },
        );
      },
      [
        resolveCurrentDigits,
        safeLength,
        sourceKey,
      ],
    );

  const setCode =
    useCallback(
      (
        value: string,
        focusNextEmpty = false,
      ) => {
        const nextDigits =
          codeToDigits(
            value,
            safeLength,
          );

        setVerificationState({
          sourceKey,
          digits:
            nextDigits,
        });

        if (
          focusNextEmpty
        ) {
          const firstEmptyIndex =
            nextDigits.findIndex(
              (
                digit,
              ) => !digit,
            );

          focusDigit(
            firstEmptyIndex ===
              -1
              ? safeLength - 1
              : firstEmptyIndex,
          );
        }
      },
      [
        focusDigit,
        safeLength,
        sourceKey,
      ],
    );

  const clearCode =
    useCallback(
      (
        focusFirst = true,
      ) => {
        lastCompletedCodeRef.current =
          null;

        setVerificationState({
          sourceKey,

          digits:
            createEmptyDigits(
              safeLength,
            ),
        });

        if (focusFirst) {
          focusDigit(0);
        }
      },
      [
        focusDigit,
        safeLength,
        sourceKey,
      ],
    );

  const handleInputChange =
    useCallback(
      (
        index: number,
        value: string,
      ) => {
        if (
          index < 0 ||
          index >= safeLength
        ) {
          return;
        }

        const sanitizedValue =
          sanitizeNumericCode(
            value,
            safeLength,
          );

        if (
          sanitizedValue.length ===
          0
        ) {
          setDigit(
            index,
            "",
          );

          return;
        }

        if (
          sanitizedValue.length ===
          1
        ) {
          setDigit(
            index,
            sanitizedValue,
          );

          if (
            index <
            safeLength - 1
          ) {
            focusDigit(
              index + 1,
            );
          }

          return;
        }

        setVerificationState(
          (
            currentState,
          ) => {
            const nextDigits =
              [
                ...resolveCurrentDigits(
                  currentState,
                ),
              ];

            sanitizedValue
              .split("")
              .forEach(
                (
                  digit,
                  offset,
                ) => {
                  const targetIndex =
                    index +
                    offset;

                  if (
                    targetIndex <
                    safeLength
                  ) {
                    nextDigits[
                      targetIndex
                    ] = digit;
                  }
                },
              );

            return {
              sourceKey,
              digits:
                nextDigits,
            };
          },
        );

        const nextFocusIndex =
          Math.min(
            index +
              sanitizedValue.length,
            safeLength - 1,
          );

        focusDigit(
          nextFocusIndex,
        );
      },
      [
        focusDigit,
        resolveCurrentDigits,
        safeLength,
        setDigit,
        sourceKey,
      ],
    );

  const handleInputKeyDown =
    useCallback(
      (
        index: number,
        event:
          KeyboardEvent<HTMLInputElement>,
      ) => {
        if (
          index < 0 ||
          index >= safeLength
        ) {
          return;
        }

        if (
          event.key ===
          "Backspace"
        ) {
          event.preventDefault();

          if (
            digits[index]
          ) {
            setDigit(
              index,
              "",
            );

            return;
          }

          if (
            index > 0
          ) {
            setDigit(
              index - 1,
              "",
            );

            focusDigit(
              index - 1,
            );
          }

          return;
        }

        if (
          event.key ===
          "Delete"
        ) {
          event.preventDefault();

          setDigit(
            index,
            "",
          );

          return;
        }

        if (
          event.key ===
          "ArrowLeft"
        ) {
          event.preventDefault();

          focusDigit(
            index - 1,
          );

          return;
        }

        if (
          event.key ===
          "ArrowRight"
        ) {
          event.preventDefault();

          focusDigit(
            index + 1,
          );

          return;
        }

        if (
          event.key ===
          "Home"
        ) {
          event.preventDefault();

          focusDigit(0);

          return;
        }

        if (
          event.key ===
          "End"
        ) {
          event.preventDefault();

          focusDigit(
            safeLength - 1,
          );
        }
      },
      [
        digits,
        focusDigit,
        safeLength,
        setDigit,
      ],
    );

  const handlePaste =
    useCallback(
      (
        index: number,
        event:
          ClipboardEvent<HTMLInputElement>,
      ) => {
        event.preventDefault();

        if (
          index < 0 ||
          index >= safeLength
        ) {
          return;
        }

        const pastedValue =
          event.clipboardData.getData(
            "text",
          );

        const sanitizedValue =
          sanitizeNumericCode(
            pastedValue,
            safeLength,
          );

        if (
          sanitizedValue.length ===
          0
        ) {
          return;
        }

        setVerificationState(
          (
            currentState,
          ) => {
            const nextDigits =
              [
                ...resolveCurrentDigits(
                  currentState,
                ),
              ];

            sanitizedValue
              .split("")
              .forEach(
                (
                  digit,
                  offset,
                ) => {
                  const targetIndex =
                    index +
                    offset;

                  if (
                    targetIndex <
                    safeLength
                  ) {
                    nextDigits[
                      targetIndex
                    ] = digit;
                  }
                },
              );

            return {
              sourceKey,
              digits:
                nextDigits,
            };
          },
        );

        const lastInsertedIndex =
          Math.min(
            index +
              sanitizedValue.length -
              1,
            safeLength - 1,
          );

        focusDigit(
          lastInsertedIndex,
        );
      },
      [
        focusDigit,
        resolveCurrentDigits,
        safeLength,
        sourceKey,
      ],
    );

  /*
   * Notificamos cambios después de que React
   * actualice los dígitos.
   */
  useEffect(() => {
    onChange?.(
      code,
      digits,
    );
  }, [
    code,
    digits,
    onChange,
  ]);

  /*
   * onComplete se ejecuta una sola vez por cada
   * código completo diferente.
   */
  useEffect(() => {
    if (!isComplete) {
      lastCompletedCodeRef.current =
        null;

      return;
    }

    if (
      lastCompletedCodeRef.current ===
      code
    ) {
      return;
    }

    lastCompletedCodeRef.current =
      code;

    onComplete?.(
      code,
    );
  }, [
    code,
    isComplete,
    onComplete,
  ]);

  /*
   * El enfoque se agenda mediante requestAnimationFrame;
   * este efecto no actualiza estado.
   */
  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    focusDigit(0);
  }, [
    autoFocus,
    focusDigit,
  ]);

  return {
    digits,
    code,

    isComplete,
    completedDigitCount,

    registerInput,

    focusDigit,

    setDigit,
    setCode,
    clearCode,

    handleInputChange,
    handleInputKeyDown,
    handlePaste,
  };
}
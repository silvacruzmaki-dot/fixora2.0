"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import { AuthFieldMessage } from "@/components/atoms/auth/AuthFieldMessage";
import { AuthSubmitButton } from "@/components/atoms/auth/AuthSubmitButton";
import { VerificationDigitInput } from "@/components/atoms/auth/VerificationDigitInput";

import useLanguage from "@/hooks/language/useLanguage";

const CODE_LENGTH = 6;

export type VerificationCodeMode =
  | "email-verification"
  | "password-recovery";

interface VerificationUser {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;
  avatarUrl: string | null;

  role: string;
  status: string;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerifiedAt?: string | null;
  createdAt?: string;
}

interface VerificationSession {
  expiresAt: string;
  rememberMe: boolean;
}

export interface VerificationCodeSuccessResult {
  mode: VerificationCodeMode;

  email: string;
  code: string;

  maskedEmail?: string;
  expiresInSeconds?: number;

  user?: VerificationUser;
  session?: VerificationSession;

  redirectTo?: string;
}

interface VerificationApiData {
  status?: string;

  authenticated?: boolean;
  verified?: boolean;

  user?: VerificationUser;
  session?: VerificationSession;

  sessionExpiresAt?: string;
  redirectTo?: string;

  maskedEmail?: string;

  expiresInSeconds?: number;
  verificationExpiresInSeconds?: number;
  resendAvailableInSeconds?: number;

  retryAfterSeconds?: number;
  remainingAttempts?: number;
}

interface LocalizedApiMessage {
  es?: string;
  en?: string;
}

interface ApiResponse<TData> {
  ok: boolean;
  code: string;

  message?: LocalizedApiMessage;

  data?: TData;

  fieldErrors?: Record<
    string,
    string[]
  >;
}

interface StoredVerificationFlow {
  email?: string;
  maskedEmail?: string;

  verificationExpiresInSeconds?: number;
  expiresInSeconds?: number;
  resendAvailableInSeconds?: number;

  verificationCode?: string;
  code?: string;

  verified?: boolean;
  verifiedAt?: number;

  storedAt?: number;
}

interface InitialFlowData {
  email: string;
  maskedEmail: string;

  expirationCountdown: number;
  resendCountdown: number;

  unavailable: boolean;
}

export interface VerificationCodeFormProps {
  mode: VerificationCodeMode;

  initialEmail?: string;
  initialMaskedEmail?: string;

  initialExpiresInSeconds?: number;
  initialResendAvailableInSeconds?: number;

  redirectTo?: string;

  showHeading?: boolean;

  onVerified?: (
    result: VerificationCodeSuccessResult,
  ) => void | Promise<void>;

  onRequestChangeEmail?: () => void;

  className?: string;
}

const VERIFICATION_COPY = {
  es: {
    emailTitle:
      "Verifica tu correo",

    recoveryTitle:
      "Verifica el código de recuperación",

    emailDescription:
      "Ingresa el código de seis dígitos que enviamos a tu correo electrónico.",

    recoveryDescription:
      "Ingresa el código de seis dígitos para continuar con el restablecimiento de tu contraseña.",

    loading:
      "Comprobando la información de verificación...",

    sentTo:
      "Código enviado a",

    digitLabel:
      "Dígito",

    of:
      "de",

    submitEmail:
      "Verificar correo",

    submitRecovery:
      "Verificar código",

    submitting:
      "Verificando...",

    resend:
      "Reenviar código",

    resending:
      "Reenviando código...",

    resendAvailableIn:
      "Podrás reenviar el código en",

    codeExpiresIn:
      "El código vence en",

    codeExpired:
      "El código venció. Solicita uno nuevo para continuar.",

    codeRequired:
      "Debes ingresar los seis dígitos del código.",

    invalidCode:
      "El código ingresado no es válido.",

    attemptsExceeded:
      "Se superó el número permitido de intentos.",

    accountUnavailable:
      "No fue posible verificar esta cuenta.",

    verificationUnavailable:
      "No fue posible completar la verificación.",

    flowUnavailableTitle:
      "No existe una verificación pendiente",

    flowUnavailable:
      "Debes iniciar nuevamente el proceso para recibir un código válido.",

    resendSuccessTitle:
      "Código reenviado",

    resendSuccess:
      "Enviamos un nuevo código a tu correo electrónico.",

    verifiedTitle:
      "Verificación completada",

    emailVerified:
      "Tu correo fue verificado correctamente.",

    recoveryVerified:
      "El código fue verificado correctamente. Ya puedes crear una nueva contraseña.",

    alreadyVerified:
      "Este correo ya había sido verificado.",

    remainingAttempts:
      "Intentos restantes",

    retryAfter:
      "Podrás volver a intentarlo en",

    seconds:
      "segundos",

    minute:
      "minuto",

    minutes:
      "minutos",

    useAnotherEmail:
      "Usar otro correo",

    backToLogin:
      "Volver al inicio de sesión",

    networkError:
      "No fue posible conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.",

    unexpectedError:
      "Ocurrió un problema inesperado. Inténtalo nuevamente.",
  },

  en: {
    emailTitle:
      "Verify your email",

    recoveryTitle:
      "Verify the recovery code",

    emailDescription:
      "Enter the six-digit code sent to your email address.",

    recoveryDescription:
      "Enter the six-digit code to continue resetting your password.",

    loading:
      "Checking the verification information...",

    sentTo:
      "Code sent to",

    digitLabel:
      "Digit",

    of:
      "of",

    submitEmail:
      "Verify email",

    submitRecovery:
      "Verify code",

    submitting:
      "Verifying...",

    resend:
      "Resend code",

    resending:
      "Resending code...",

    resendAvailableIn:
      "You can resend the code in",

    codeExpiresIn:
      "The code expires in",

    codeExpired:
      "The code has expired. Request a new one to continue.",

    codeRequired:
      "You must enter all six digits of the code.",

    invalidCode:
      "The entered code is invalid.",

    attemptsExceeded:
      "The maximum number of attempts was exceeded.",

    accountUnavailable:
      "This account could not be verified.",

    verificationUnavailable:
      "The verification could not be completed.",

    flowUnavailableTitle:
      "There is no pending verification",

    flowUnavailable:
      "You must restart the process to receive a valid code.",

    resendSuccessTitle:
      "Code resent",

    resendSuccess:
      "A new code was sent to your email address.",

    verifiedTitle:
      "Verification completed",

    emailVerified:
      "Your email address was verified successfully.",

    recoveryVerified:
      "The code was verified successfully. You can now create a new password.",

    alreadyVerified:
      "This email address had already been verified.",

    remainingAttempts:
      "Remaining attempts",

    retryAfter:
      "You can try again in",

    seconds:
      "seconds",

    minute:
      "minute",

    minutes:
      "minutes",

    useAnotherEmail:
      "Use another email",

    backToLogin:
      "Back to sign in",

    networkError:
      "The server could not be reached. Check your connection and try again.",

    unexpectedError:
      "An unexpected problem occurred. Please try again.",
  },
} as const;

function normalizeEmail(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function normalizeApiCode(
  code?: string,
): string {
  return (
    code
      ?.trim()
      .toUpperCase()
      .replaceAll("-", "_")
      .replaceAll(" ", "_") ??
    ""
  );
}

function getApiMessage<TData>(
  response: ApiResponse<TData> | null,
  language: "es" | "en",
  fallback: string,
): string {
  const localizedMessage =
    response?.message?.[language];

  if (
    typeof localizedMessage === "string" &&
    localizedMessage.trim().length > 0
  ) {
    return localizedMessage;
  }

  return fallback;
}

function getFirstFieldError(
  fieldErrors:
    | Record<string, string[]>
    | undefined,
  fieldNames: string[],
): string | undefined {
  for (const fieldName of fieldNames) {
    const fieldError =
      fieldErrors?.[fieldName]?.[0];

    if (
      typeof fieldError === "string" &&
      fieldError.trim().length > 0
    ) {
      return fieldError;
    }
  }

  return undefined;
}

function formatCountdown(
  totalSeconds: number,
): string {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(totalSeconds),
    );

  const minutes =
    Math.floor(
      safeSeconds / 60,
    );

  const seconds =
    safeSeconds % 60;

  return `${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

function formatRetryTime(
  seconds: number,
  copy:
    | typeof VERIFICATION_COPY.es
    | typeof VERIFICATION_COPY.en,
): string {
  if (seconds < 60) {
    return `${copy.retryAfter} ${Math.max(
      1,
      Math.ceil(seconds),
    )} ${copy.seconds}.`;
  }

  const minutes =
    Math.max(
      1,
      Math.ceil(
        seconds / 60,
      ),
    );

  return `${copy.retryAfter} ${minutes} ${
    minutes === 1
      ? copy.minute
      : copy.minutes
  }.`;
}

function getStorageKey(
  mode: VerificationCodeMode,
): string {
  return mode ===
    "email-verification"
    ? "fixora.pendingVerification"
    : "fixora.passwordRecovery";
}

function readStoredFlow(
  mode: VerificationCodeMode,
): StoredVerificationFlow | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const storedValue =
      window.sessionStorage.getItem(
        getStorageKey(mode),
      );

    if (!storedValue) {
      return null;
    }

    const parsedValue =
      JSON.parse(
        storedValue,
      ) as unknown;

    if (
      !parsedValue ||
      typeof parsedValue !==
        "object"
    ) {
      return null;
    }

    return parsedValue as
      StoredVerificationFlow;
  } catch {
    return null;
  }
}

function saveStoredFlow(
  mode: VerificationCodeMode,
  value: StoredVerificationFlow,
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      getStorageKey(mode),
      JSON.stringify(value),
    );
  } catch {
    /*
     * El flujo puede continuar aunque
     * sessionStorage esté bloqueado.
     */
  }
}

function removeStoredFlow(
  mode: VerificationCodeMode,
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    window.sessionStorage.removeItem(
      getStorageKey(mode),
    );
  } catch {
    /*
     * La navegación puede continuar aunque
     * sessionStorage esté bloqueado.
     */
  }
}

function getRemainingSeconds(
  originalSeconds: number,
  storedAt: number,
): number {
  const elapsedSeconds =
    Math.floor(
      (
        Date.now() -
        storedAt
      ) / 1000,
    );

  return Math.max(
    0,
    originalSeconds -
      elapsedSeconds,
  );
}

function getSafeRedirectPath(
  requestedPath?: string,
): string {
  if (
    requestedPath &&
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.startsWith(
      "/admin",
    )
  ) {
    return requestedPath;
  }

  if (
    typeof window !==
    "undefined"
  ) {
    const searchParams =
      new URLSearchParams(
        window.location.search,
      );

    const redirectPath =
      searchParams.get(
        "redirect",
      );

    if (
      redirectPath &&
      redirectPath.startsWith("/") &&
      !redirectPath.startsWith("//") &&
      !redirectPath.startsWith(
        "/admin",
      )
    ) {
      return redirectPath;
    }
  }

  return "/perfil";
}

function getSafeServerRedirectPath(
  requestedPath:
    | string
    | undefined,
): string | null {
  if (
    !requestedPath ||
    !requestedPath.startsWith("/") ||
    requestedPath.startsWith("//")
  ) {
    return null;
  }

  return requestedPath;
}

function resolveInitialFlowData({
  mode,
  initialEmail,
  initialMaskedEmail,
  initialExpiresInSeconds,
  initialResendAvailableInSeconds,
}: {
  mode: VerificationCodeMode;

  initialEmail: string;
  initialMaskedEmail: string;

  initialExpiresInSeconds:
    | number
    | undefined;

  initialResendAvailableInSeconds:
    | number
    | undefined;
}): InitialFlowData {
  const storedFlow =
    readStoredFlow(mode);

  const explicitEmail =
    normalizeEmail(
      initialEmail,
    );

  const storedEmail =
    normalizeEmail(
      storedFlow?.email ??
        "",
    );

  const resolvedEmail =
    explicitEmail ||
    storedEmail;

  if (!resolvedEmail) {
    return {
      email: "",
      maskedEmail: "",

      expirationCountdown: 0,
      resendCountdown: 0,

      unavailable: true,
    };
  }

  const hasExplicitData =
    explicitEmail.length > 0;

  const resolvedStoredAt =
    hasExplicitData
      ? Date.now()
      : storedFlow?.storedAt ??
        Date.now();

  const expirationSeconds =
    initialExpiresInSeconds ??
    storedFlow
      ?.verificationExpiresInSeconds ??
    storedFlow
      ?.expiresInSeconds ??
    600;

  const resendSeconds =
    initialResendAvailableInSeconds ??
    storedFlow
      ?.resendAvailableInSeconds ??
    60;

  const resolvedExpiration =
    hasExplicitData
      ? Math.max(
          0,
          expirationSeconds,
        )
      : getRemainingSeconds(
          expirationSeconds,
          resolvedStoredAt,
        );

  const resolvedResend =
    hasExplicitData
      ? Math.max(
          0,
          resendSeconds,
        )
      : getRemainingSeconds(
          resendSeconds,
          resolvedStoredAt,
        );

  return {
    email:
      resolvedEmail,

    maskedEmail:
      initialMaskedEmail.trim() ||
      storedFlow?.maskedEmail ||
      resolvedEmail,

    expirationCountdown:
      resolvedExpiration,

    resendCountdown:
      resolvedResend,

    unavailable: false,
  };
}

export function VerificationCodeForm({
  mode,

  initialEmail = "",
  initialMaskedEmail = "",

  initialExpiresInSeconds,
  initialResendAvailableInSeconds,

  redirectTo,

  showHeading = true,

  onVerified,
  onRequestChangeEmail,

  className = "",
}: VerificationCodeFormProps) {
  const router =
    useRouter();

  const { language } =
    useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    VERIFICATION_COPY[
      currentLanguage
    ];

  const inputRefs =
    useRef<
      Array<HTMLInputElement | null>
    >([]);

  const [
    digits,
    setDigits,
  ] = useState<string[]>(
    () =>
      Array.from(
        {
          length:
            CODE_LENGTH,
        },
        () => "",
      ),
  );

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    maskedEmail,
    setMaskedEmail,
  ] = useState("");

  const [
    expirationCountdown,
    setExpirationCountdown,
  ] = useState(0);

  const [
    resendCountdown,
    setResendCountdown,
  ] = useState(0);

  const [
    isInitializing,
    setIsInitializing,
  ] = useState(true);

  const [
    flowUnavailable,
    setFlowUnavailable,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isResending,
    setIsResending,
  ] = useState(false);

  const [
    codeError,
    setCodeError,
  ] = useState<string | null>(
    null,
  );

  const [
    generalError,
    setGeneralError,
  ] = useState<string | null>(
    null,
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    isVerified,
    setIsVerified,
  ] = useState(false);

  const code =
    useMemo(
      () =>
        digits.join(""),
      [digits],
    );

  const isCodeComplete =
    code.length ===
    CODE_LENGTH;

  const codeHasExpired =
    expirationCountdown <= 0;

  const focusInput =
    useCallback(
      (
        index: number,
      ) => {
        const safeIndex =
          Math.max(
            0,
            Math.min(
              CODE_LENGTH - 1,
              index,
            ),
          );

        window.requestAnimationFrame(
          () => {
            inputRefs.current[
              safeIndex
            ]?.focus();
          },
        );
      },
      [],
    );

  const clearCode =
    useCallback(
      () => {
        setDigits(
          Array.from(
            {
              length:
                CODE_LENGTH,
            },
            () => "",
          ),
        );

        focusInput(0);
      },
      [
        focusInput,
      ],
    );

  useEffect(() => {
    /*
     * La inicialización se ejecuta de forma diferida
     * para evitar actualizaciones síncronas de estado
     * dentro del efecto.
     */
    const initializationTimer =
      window.setTimeout(
        () => {
          const flowData =
            resolveInitialFlowData({
              mode,

              initialEmail,
              initialMaskedEmail,

              initialExpiresInSeconds,
              initialResendAvailableInSeconds,
            });

          setEmail(
            flowData.email,
          );

          setMaskedEmail(
            flowData.maskedEmail,
          );

          setExpirationCountdown(
            flowData
              .expirationCountdown,
          );

          setResendCountdown(
            flowData
              .resendCountdown,
          );

          setFlowUnavailable(
            flowData.unavailable,
          );

          setIsInitializing(
            false,
          );
        },
        0,
      );

    return () => {
      window.clearTimeout(
        initializationTimer,
      );
    };
  }, [
    initialEmail,
    initialExpiresInSeconds,
    initialMaskedEmail,
    initialResendAvailableInSeconds,
    mode,
  ]);

  useEffect(() => {
    if (
      isInitializing ||
      flowUnavailable ||
      isVerified
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setExpirationCountdown(
            (
              currentValue,
            ) =>
              Math.max(
                0,
                currentValue -
                  1,
              ),
          );

          setResendCountdown(
            (
              currentValue,
            ) =>
              Math.max(
                0,
                currentValue -
                  1,
              ),
          );
        },
        1_000,
      );

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [
    flowUnavailable,
    isInitializing,
    isVerified,
  ]);

  const handleDigitChange =
    (
      value: string,
      index: number,
    ) => {
      setDigits(
        (
          currentDigits,
        ) => {
          const nextDigits = [
            ...currentDigits,
          ];

          nextDigits[index] =
            value;

          return nextDigits;
        },
      );

      setCodeError(null);
      setGeneralError(null);
      setSuccessMessage(null);

      if (
        value &&
        index <
          CODE_LENGTH - 1
      ) {
        focusInput(
          index + 1,
        );
      }
    };

  const handlePasteDigits =
    (
      pastedDigits: string,
      startIndex: number,
    ) => {
      const validDigits =
        pastedDigits
          .replace(/\D/g, "")
          .slice(
            0,
            CODE_LENGTH -
              startIndex,
          );

      if (!validDigits) {
        return;
      }

      setDigits(
        (
          currentDigits,
        ) => {
          const nextDigits = [
            ...currentDigits,
          ];

          validDigits
            .split("")
            .forEach(
              (
                digit,
                digitIndex,
              ) => {
                nextDigits[
                  startIndex +
                    digitIndex
                ] = digit;
              },
            );

          return nextDigits;
        },
      );

      setCodeError(null);
      setGeneralError(null);
      setSuccessMessage(null);

      const nextFocusIndex =
        Math.min(
          CODE_LENGTH - 1,
          startIndex +
            validDigits.length,
        );

      focusInput(
        nextFocusIndex,
      );
    };

  const handleBackspaceFromEmpty =
    (
      index: number,
    ) => {
      if (index <= 0) {
        return;
      }

      const previousIndex =
        index - 1;

      setDigits(
        (
          currentDigits,
        ) => {
          const nextDigits = [
            ...currentDigits,
          ];

          nextDigits[
            previousIndex
          ] = "";

          return nextDigits;
        },
      );

      focusInput(
        previousIndex,
      );
    };

  const handleMovePrevious =
    (
      index: number,
    ) => {
      if (index > 0) {
        focusInput(
          index - 1,
        );
      }
    };

  const handleMoveNext =
    (
      index: number,
    ) => {
      if (
        index <
        CODE_LENGTH - 1
      ) {
        focusInput(
          index + 1,
        );
      }
    };

  const handleChangeEmail =
    () => {
      removeStoredFlow(
        mode,
      );

      setGeneralError(null);
      setCodeError(null);
      setSuccessMessage(null);

      if (
        onRequestChangeEmail
      ) {
        onRequestChangeEmail();

        return;
      }

      router.push(
        mode ===
          "email-verification"
          ? "/registrarse"
          : "/recuperar-password",
      );
    };

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        isSubmitting ||
        isResending ||
        isVerified
      ) {
        return;
      }

      setCodeError(null);
      setGeneralError(null);
      setSuccessMessage(null);

      if (!isCodeComplete) {
        setCodeError(
          copy.codeRequired,
        );

        const firstEmptyIndex =
          digits.findIndex(
            (
              digit,
            ) =>
              !digit,
          );

        focusInput(
          firstEmptyIndex >= 0
            ? firstEmptyIndex
            : 0,
        );

        return;
      }

      if (codeHasExpired) {
        setCodeError(
          copy.codeExpired,
        );

        return;
      }

      setIsSubmitting(true);

      try {
        const endpoint =
          mode ===
            "email-verification"
            ? "/api/auth/verificar-correo"
            : "/api/auth/verificar-recuperacion";

        const response =
          await fetch(
            endpoint,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  email,
                  code,
                }),
            },
          );

        const payload =
          (await response
            .json()
            .catch(
              () => null,
            )) as
            | ApiResponse<VerificationApiData>
            | null;

        const apiCode =
          normalizeApiCode(
            payload?.code ??
              payload?.data
                ?.status,
          );

        if (response.ok) {
          const result:
            VerificationCodeSuccessResult =
            {
              mode,

              email,
              code,

              maskedEmail:
                payload?.data
                  ?.maskedEmail ??
                maskedEmail,

              expiresInSeconds:
                payload?.data
                  ?.expiresInSeconds ??
                payload?.data
                  ?.verificationExpiresInSeconds,

              user:
                payload?.data
                  ?.user,

              session:
                payload?.data
                  ?.session,

              redirectTo:
                payload?.data
                  ?.redirectTo,
            };

          setIsVerified(
            true,
          );

          setSuccessMessage(
            mode ===
              "email-verification"
              ? apiCode.includes(
                  "ALREADY_VERIFIED",
                )
                ? copy.alreadyVerified
                : copy.emailVerified
              : copy.recoveryVerified,
          );

          if (
            mode ===
            "email-verification"
          ) {
            removeStoredFlow(
              mode,
            );
          } else {
            const previousFlow =
              readStoredFlow(
                mode,
              );

            saveStoredFlow(
              mode,
              {
                ...(
                  previousFlow ??
                  {}
                ),

                email,

                maskedEmail:
                  result.maskedEmail ??
                  maskedEmail,

                verificationCode:
                  code,

                code,

                verified: true,

                verifiedAt:
                  Date.now(),

                expiresInSeconds:
                  result
                    .expiresInSeconds ??
                  600,

                storedAt:
                  Date.now(),
              },
            );
          }

          await onVerified?.(
            result,
          );

          if (!onVerified) {
            if (
              mode ===
              "password-recovery"
            ) {
              router.push(
                "/restablecer-password",
              );

              return;
            }

            const serverRedirect =
              getSafeServerRedirectPath(
                payload?.data
                  ?.redirectTo,
              );

            const destination =
              serverRedirect ??
              (
                payload?.data
                  ?.user?.role ===
                "ADMIN"
                  ? "/admin"
                  : getSafeRedirectPath(
                      redirectTo,
                    )
              );

            router.replace(
              destination,
            );

            router.refresh();
          }

          return;
        }

        const serverCodeError =
          getFirstFieldError(
            payload?.fieldErrors,
            [
              "code",
              "verificationCode",
            ],
          );

        if (serverCodeError) {
          setCodeError(
            serverCodeError,
          );
        }

        if (
          apiCode.includes(
            "CODE_EXPIRED",
          )
        ) {
          setExpirationCountdown(
            0,
          );

          setCodeError(
            getApiMessage(
              payload,
              currentLanguage,
              copy.codeExpired,
            ),
          );

          clearCode();

          return;
        }

        if (
          apiCode.includes(
            "ATTEMPTS_EXCEEDED",
          )
        ) {
          const retryAfterSeconds =
            payload?.data
              ?.retryAfterSeconds;

          const retryMessage =
            typeof retryAfterSeconds ===
              "number" &&
            retryAfterSeconds > 0
              ? ` ${formatRetryTime(
                  retryAfterSeconds,
                  copy,
                )}`
              : "";

          setCodeError(
            `${getApiMessage(
              payload,
              currentLanguage,
              copy.attemptsExceeded,
            )}${retryMessage}`,
          );

          clearCode();

          return;
        }

        if (
          apiCode.includes(
            "INVALID_CODE",
          ) ||
          apiCode.includes(
            "INVALID_RECOVERY_CODE",
          ) ||
          apiCode.includes(
            "INVALID_VERIFICATION_CODE",
          ) ||
          apiCode.includes(
            "NOT_FOUND",
          )
        ) {
          const remainingAttempts =
            payload?.data
              ?.remainingAttempts;

          const remainingMessage =
            typeof remainingAttempts ===
              "number" &&
            remainingAttempts >= 0
              ? ` ${copy.remainingAttempts}: ${remainingAttempts}.`
              : "";

          setCodeError(
            `${getApiMessage(
              payload,
              currentLanguage,
              copy.invalidCode,
            )}${remainingMessage}`,
          );

          clearCode();

          return;
        }

        if (
          apiCode.includes(
            "ACCOUNT_UNAVAILABLE",
          )
        ) {
          setGeneralError(
            getApiMessage(
              payload,
              currentLanguage,
              copy.accountUnavailable,
            ),
          );

          return;
        }

        if (
          apiCode.includes(
            "ALREADY_VERIFIED",
          )
        ) {
          removeStoredFlow(
            mode,
          );

          setIsVerified(
            true,
          );

          setSuccessMessage(
            copy.alreadyVerified,
          );

          return;
        }

        if (
          response.status ===
          429
        ) {
          const retryAfterSeconds =
            payload?.data
              ?.retryAfterSeconds;

          setGeneralError(
            typeof retryAfterSeconds ===
              "number" &&
            retryAfterSeconds > 0
              ? formatRetryTime(
                  retryAfterSeconds,
                  copy,
                )
              : getApiMessage(
                  payload,
                  currentLanguage,
                  copy.verificationUnavailable,
                ),
          );

          return;
        }

        setGeneralError(
          getApiMessage(
            payload,
            currentLanguage,
            copy.verificationUnavailable,
          ),
        );
      } catch {
        setGeneralError(
          copy.networkError,
        );
      } finally {
        setIsSubmitting(
          false,
        );
      }
    };

  const handleResend =
    async () => {
      if (
        isResending ||
        isSubmitting ||
        isVerified ||
        resendCountdown > 0
      ) {
        return;
      }

      setIsResending(true);

      setCodeError(null);
      setGeneralError(null);
      setSuccessMessage(null);

      try {
        const endpoint =
          mode ===
            "email-verification"
            ? "/api/auth/reenviar-codigo"
            : "/api/auth/recuperar-password";

        const response =
          await fetch(
            endpoint,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  email,

                  preferredLanguage:
                    currentLanguage,
                }),
            },
          );

        const payload =
          (await response
            .json()
            .catch(
              () => null,
            )) as
            | ApiResponse<VerificationApiData>
            | null;

        const apiCode =
          normalizeApiCode(
            payload?.code ??
              payload?.data
                ?.status,
          );

        if (response.ok) {
          const nextExpiration =
            payload?.data
              ?.verificationExpiresInSeconds ??
            payload?.data
              ?.expiresInSeconds ??
            600;

          const nextResend =
            payload?.data
              ?.resendAvailableInSeconds ??
            60;

          const nextMaskedEmail =
            payload?.data
              ?.maskedEmail ??
            maskedEmail;

          setMaskedEmail(
            nextMaskedEmail,
          );

          setExpirationCountdown(
            nextExpiration,
          );

          setResendCountdown(
            nextResend,
          );

          clearCode();

          saveStoredFlow(
            mode,
            {
              email,

              maskedEmail:
                nextMaskedEmail,

              verificationExpiresInSeconds:
                nextExpiration,

              expiresInSeconds:
                nextExpiration,

              resendAvailableInSeconds:
                nextResend,

              verified: false,

              storedAt:
                Date.now(),
            },
          );

          setSuccessMessage(
            copy.resendSuccess,
          );

          return;
        }

        if (
          apiCode.includes(
            "ALREADY_VERIFIED",
          )
        ) {
          removeStoredFlow(
            mode,
          );

          setIsVerified(
            true,
          );

          setSuccessMessage(
            copy.alreadyVerified,
          );

          return;
        }

        if (
          apiCode.includes(
            "COOLDOWN",
          ) ||
          apiCode.includes(
            "NOT_AVAILABLE_YET",
          )
        ) {
          const retryAfterSeconds =
            payload?.data
              ?.retryAfterSeconds ??
            60;

          setResendCountdown(
            retryAfterSeconds,
          );

          setGeneralError(
            formatRetryTime(
              retryAfterSeconds,
              copy,
            ),
          );

          return;
        }

        if (
          apiCode.includes(
            "RESEND_LIMIT_EXCEEDED",
          ) ||
          apiCode.includes(
            "ATTEMPTS_EXCEEDED",
          )
        ) {
          const retryAfterSeconds =
            payload?.data
              ?.retryAfterSeconds;

          setGeneralError(
            typeof retryAfterSeconds ===
              "number" &&
            retryAfterSeconds > 0
              ? formatRetryTime(
                  retryAfterSeconds,
                  copy,
                )
              : copy.attemptsExceeded,
          );

          return;
        }

        if (
          response.status ===
          429
        ) {
          const retryAfterSeconds =
            payload?.data
              ?.retryAfterSeconds ??
            60;

          setResendCountdown(
            retryAfterSeconds,
          );

          setGeneralError(
            formatRetryTime(
              retryAfterSeconds,
              copy,
            ),
          );

          return;
        }

        setGeneralError(
          getApiMessage(
            payload,
            currentLanguage,
            copy.verificationUnavailable,
          ),
        );
      } catch {
        setGeneralError(
          copy.networkError,
        );
      } finally {
        setIsResending(
          false,
        );
      }
    };

  if (isInitializing) {
    return (
      <div
        className={`flex min-h-48 items-center justify-center ${className}`}
        aria-live="polite"
      >
        <div className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
            aria-hidden="true"
          />

          {copy.loading}
        </div>
      </div>
    );
  }

  if (flowUnavailable) {
    return (
      <div
        className={`grid w-full gap-5 ${className}`}
      >
        {showHeading ? (
          <header>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              {mode ===
              "email-verification"
                ? copy.emailTitle
                : copy.recoveryTitle}
            </h1>
          </header>
        ) : null}

        <AuthFieldMessage
          variant="warning"
          title={
            copy.flowUnavailableTitle
          }
        >
          {copy.flowUnavailable}
        </AuthFieldMessage>

        <button
          type="button"
          onClick={
            handleChangeEmail
          }
          className="min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
        >
          {copy.useAnotherEmail}
        </button>

        <button
          type="button"
          onClick={() => {
            router.push(
              "/iniciar-sesion",
            );
          }}
          className="mx-auto text-sm font-semibold text-emerald-700 transition hover:underline dark:text-emerald-400"
        >
          {copy.backToLogin}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      noValidate
      className={`grid w-full gap-5 ${className}`}
    >
      {showHeading ? (
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
            {mode ===
            "email-verification"
              ? copy.emailTitle
              : copy.recoveryTitle}
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {mode ===
            "email-verification"
              ? copy.emailDescription
              : copy.recoveryDescription}
          </p>
        </header>
      ) : null}

      <div className="rounded-2xl border border-black/10 bg-zinc-50 px-4 py-4 text-center dark:border-white/10 dark:bg-zinc-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {copy.sentTo}
        </p>

        <p className="mt-1 break-all text-sm font-semibold text-zinc-950 dark:text-white">
          {maskedEmail}
        </p>
      </div>

      {generalError ? (
        <AuthFieldMessage
          variant="error"
        >
          {generalError}
        </AuthFieldMessage>
      ) : null}

      {successMessage ? (
        <AuthFieldMessage
          variant={
            isVerified
              ? "success"
              : "info"
          }
          title={
            isVerified
              ? copy.verifiedTitle
              : copy.resendSuccessTitle
          }
        >
          {successMessage}
        </AuthFieldMessage>
      ) : null}

      <div className="grid gap-3">
        <div
          className="flex justify-center gap-2"
          aria-label={
            mode ===
            "email-verification"
              ? copy.emailTitle
              : copy.recoveryTitle
          }
        >
          {digits.map(
            (
              digit,
              index,
            ) => (
              <VerificationDigitInput
                key={index}
                ref={(
                  element,
                ) => {
                  inputRefs.current[
                    index
                  ] = element;
                }}
                value={digit}
                index={index}
                totalDigits={
                  CODE_LENGTH
                }
                ariaLabel={`${copy.digitLabel} ${
                  index + 1
                } ${copy.of} ${CODE_LENGTH}`}
                hasError={
                  Boolean(
                    codeError,
                  )
                }
                disabled={
                  isSubmitting ||
                  isResending ||
                  isVerified
                }
                autoFocus={
                  index === 0
                }
                onValueChange={
                  handleDigitChange
                }
                onPasteDigits={
                  handlePasteDigits
                }
                onBackspaceFromEmpty={
                  handleBackspaceFromEmpty
                }
                onMovePrevious={
                  handleMovePrevious
                }
                onMoveNext={
                  handleMoveNext
                }
              />
            ),
          )}
        </div>

        {codeError ? (
          <p
            role="alert"
            className="text-center text-xs font-medium leading-5 text-red-600 dark:text-red-400"
          >
            {codeError}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 rounded-xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-950 sm:grid-cols-2">
        <p className="text-zinc-600 dark:text-zinc-300">
          {copy.codeExpiresIn}:{" "}
          <strong
            className={
              codeHasExpired
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-950 dark:text-white"
            }
          >
            {formatCountdown(
              expirationCountdown,
            )}
          </strong>
        </p>

        <p className="text-zinc-600 dark:text-zinc-300 sm:text-right">
          {resendCountdown > 0
            ? `${copy.resendAvailableIn}: ${formatCountdown(
                resendCountdown,
              )}`
            : copy.resend}
        </p>
      </div>

      {!isVerified ? (
        <AuthSubmitButton
          isLoading={
            isSubmitting
          }
          loadingText={
            copy.submitting
          }
          disabled={
            codeHasExpired ||
            isResending
          }
        >
          {mode ===
          "email-verification"
            ? copy.submitEmail
            : copy.submitRecovery}
        </AuthSubmitButton>
      ) : null}

      <button
        type="button"
        onClick={() => {
          void handleResend();
        }}
        disabled={
          isResending ||
          isSubmitting ||
          isVerified ||
          resendCountdown > 0
        }
        className="min-h-11 w-full rounded-xl border border-emerald-500/30 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400"
      >
        {isResending
          ? copy.resending
          : resendCountdown > 0
            ? `${copy.resend} (${formatCountdown(
                resendCountdown,
              )})`
            : copy.resend}
      </button>

      <button
        type="button"
        onClick={
          handleChangeEmail
        }
        disabled={
          isSubmitting ||
          isResending
        }
        className="mx-auto text-sm font-semibold text-zinc-600 transition hover:text-emerald-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300 dark:hover:text-emerald-400"
      >
        {copy.useAnotherEmail}
      </button>
    </form>
  );
}
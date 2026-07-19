"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  type ReactNode,
} from "react";

import {
  ForgotPasswordForm,
  type PasswordRecoveryRequestedResult,
} from "@/components/molecules/auth/ForgotPasswordForm";

import {
  ResetPasswordForm,
  type PasswordResetSuccessResult,
} from "@/components/molecules/auth/ResetPasswordForm";

import {
  VerificationCodeForm,
  type VerificationCodeSuccessResult,
} from "@/components/molecules/auth/VerificationCodeForm";

import useLanguage from "@/hooks/language/useLanguage";

export type PasswordRecoveryStep =
  | "request"
  | "verify"
  | "reset"
  | "success";

export interface PasswordRecoveryCardProps {
  initialStep?: Exclude<
    PasswordRecoveryStep,
    "success"
  >;

  initialEmail?: string;
  initialMaskedEmail?: string;

  initialExpiresInSeconds?: number;
  initialResendAvailableInSeconds?: number;

  onCompleted?: (
    result: PasswordResetSuccessResult,
  ) => void | Promise<void>;

  className?: string;
}

interface RecoveryFlowData {
  email: string;
  maskedEmail: string;

  verificationExpiresInSeconds: number;
  resendAvailableInSeconds: number;

  verificationCode?: string;
}

const PASSWORD_RECOVERY_CARD_COPY = {
  es: {
    eyebrow:
      "Recuperación segura",

    requestTitle:
      "Recupera el acceso a tu cuenta",

    requestDescription:
      "Solicita un código temporal para comenzar el proceso de restablecimiento de contraseña.",

    verifyTitle:
      "Confirma el código recibido",

    verifyDescription:
      "Ingresa los seis dígitos enviados a tu correo para verificar que eres el propietario de la cuenta.",

    resetTitle:
      "Protege tu cuenta nuevamente",

    resetDescription:
      "Crea una contraseña segura y diferente de las utilizadas anteriormente.",

    successTitle:
      "Contraseña restablecida",

    successDescription:
      "Tu nueva contraseña fue guardada correctamente y las sesiones anteriores fueron cerradas.",

    stepRequest:
      "Solicitar código",

    stepVerify:
      "Verificar identidad",

    stepReset:
      "Nueva contraseña",

    currentStep:
      "Paso actual",

    completed:
      "Completado",

    pending:
      "Pendiente",

    securityTitle:
      "Proceso protegido",

    securityDescription:
      "Los códigos tienen una duración limitada y solo pueden utilizarse una vez.",

    privacyTitle:
      "Información privada",

    privacyDescription:
      "FIXORA no mostrará públicamente si un correo pertenece a una cuenta registrada.",

    sessionTitle:
      "Cierre de sesiones",

    sessionDescription:
      "Al cambiar la contraseña se invalidarán las demás sesiones activas de la cuenta.",

    successMessage:
      "Ya puedes iniciar sesión utilizando tu nueva contraseña.",

    sessionsRevoked:
      "Sesiones anteriores cerradas",

    signIn:
      "Ir al inicio de sesión",

    restart:
      "Iniciar otra recuperación",

    formAreaLabel:
      "Proceso de recuperación de contraseña",
  },

  en: {
    eyebrow:
      "Secure recovery",

    requestTitle:
      "Recover access to your account",

    requestDescription:
      "Request a temporary code to begin the password reset process.",

    verifyTitle:
      "Confirm the received code",

    verifyDescription:
      "Enter the six digits sent to your email to verify that you own the account.",

    resetTitle:
      "Protect your account again",

    resetDescription:
      "Create a secure password that is different from the passwords previously used.",

    successTitle:
      "Password reset",

    successDescription:
      "Your new password was saved successfully and previous sessions were closed.",

    stepRequest:
      "Request code",

    stepVerify:
      "Verify identity",

    stepReset:
      "New password",

    currentStep:
      "Current step",

    completed:
      "Completed",

    pending:
      "Pending",

    securityTitle:
      "Protected process",

    securityDescription:
      "Codes have a limited lifetime and can only be used once.",

    privacyTitle:
      "Private information",

    privacyDescription:
      "FIXORA will not publicly reveal whether an email belongs to a registered account.",

    sessionTitle:
      "Session termination",

    sessionDescription:
      "Changing the password will invalidate the account's other active sessions.",

    successMessage:
      "You can now sign in using your new password.",

    sessionsRevoked:
      "Previous sessions closed",

    signIn:
      "Go to sign in",

    restart:
      "Start another recovery",

    formAreaLabel:
      "Password recovery process",
  },
} as const;

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function VerificationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
      />

      <path d="M7 9h.01" />
      <path d="M12 9h.01" />
      <path d="M17 9h.01" />

      <path d="M7 15h.01" />
      <path d="M12 15h.01" />
      <path d="M17 15h.01" />
    </svg>
  );
}

function PasswordIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />

      <path d="M12 14v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v5c0 5.2 3.4 8.8 8 10 4.6-1.2 8-4.8 8-10V6l-8-3Z" />

      <path d="m8.5 12 2.2 2.2 4.8-4.8" />
    </svg>
  );
}

function PrivacyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
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
  );
}

function SessionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2v4" />

      <path d="M5.6 5.6A9 9 0 1 0 18.4 5.6" />

      <path d="M8 12h8" />
    </svg>
  );
}

interface RecoveryStepItem {
  id: Exclude<
    PasswordRecoveryStep,
    "success"
  >;

  label: string;
  icon: ReactNode;
}

interface SecurityItem {
  title: string;
  description: string;
  icon: ReactNode;
}

function getStepIndex(
  step: PasswordRecoveryStep,
): number {
  switch (step) {
    case "request":
      return 0;

    case "verify":
      return 1;

    case "reset":
      return 2;

    case "success":
      return 3;

    default:
      return 0;
  }
}

export function PasswordRecoveryCard({
  initialStep = "request",

  initialEmail = "",
  initialMaskedEmail = "",

  initialExpiresInSeconds = 600,
  initialResendAvailableInSeconds = 60,

  onCompleted,

  className = "",
}: PasswordRecoveryCardProps) {
  const router = useRouter();

  const { language } = useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    PASSWORD_RECOVERY_CARD_COPY[
      currentLanguage
    ];

  const [
    currentStep,
    setCurrentStep,
  ] =
    useState<PasswordRecoveryStep>(
      initialStep,
    );

  const [
    recoveryData,
    setRecoveryData,
  ] =
    useState<RecoveryFlowData>({
      email:
        initialEmail
          .trim()
          .toLowerCase(),

      maskedEmail:
        initialMaskedEmail.trim(),

      verificationExpiresInSeconds:
        initialExpiresInSeconds,

      resendAvailableInSeconds:
        initialResendAvailableInSeconds,
    });

  const [
    resetResult,
    setResetResult,
  ] =
    useState<PasswordResetSuccessResult | null>(
      null,
    );

  const recoverySteps:
    RecoveryStepItem[] = [
    {
      id: "request",
      label:
        copy.stepRequest,
      icon:
        <MailIcon />,
    },

    {
      id: "verify",
      label:
        copy.stepVerify,
      icon:
        <VerificationIcon />,
    },

    {
      id: "reset",
      label:
        copy.stepReset,
      icon:
        <PasswordIcon />,
    },
  ];

  const securityItems:
    SecurityItem[] = [
    {
      title:
        copy.securityTitle,

      description:
        copy.securityDescription,

      icon:
        <ShieldIcon />,
    },

    {
      title:
        copy.privacyTitle,

      description:
        copy.privacyDescription,

      icon:
        <PrivacyIcon />,
    },

    {
      title:
        copy.sessionTitle,

      description:
        copy.sessionDescription,

      icon:
        <SessionIcon />,
    },
  ];

  const activeStepIndex =
    getStepIndex(
      currentStep,
    );

  const panelTitle =
    currentStep === "request"
      ? copy.requestTitle
      : currentStep === "verify"
        ? copy.verifyTitle
        : currentStep === "reset"
          ? copy.resetTitle
          : copy.successTitle;

  const panelDescription =
    currentStep === "request"
      ? copy.requestDescription
      : currentStep === "verify"
        ? copy.verifyDescription
        : currentStep === "reset"
          ? copy.resetDescription
          : copy.successDescription;

  const handleRecoveryRequested =
    async (
      result:
        PasswordRecoveryRequestedResult,
    ) => {
      setRecoveryData({
        email:
          result.email,

        maskedEmail:
          result.maskedEmail,

        verificationExpiresInSeconds:
          result.verificationExpiresInSeconds,

        resendAvailableInSeconds:
          result.resendAvailableInSeconds,
      });

      setCurrentStep(
        "verify",
      );
    };

  const handleCodeVerified =
    async (
      result:
        VerificationCodeSuccessResult,
    ) => {
      setRecoveryData(
        (currentData) => ({
          ...currentData,

          email:
            result.email,

          maskedEmail:
            result.maskedEmail ??
            currentData.maskedEmail,

          verificationCode:
            result.code,
        }),
      );

      setCurrentStep(
        "reset",
      );
    };

  const handlePasswordReset =
    async (
      result:
        PasswordResetSuccessResult,
    ) => {
      setResetResult(
        result,
      );

      setCurrentStep(
        "success",
      );

      await onCompleted?.(
        result,
      );
    };

  const handleRestartRecovery =
    () => {
      try {
        sessionStorage.removeItem(
          "fixora.passwordRecovery",
        );
      } catch {
        // El proceso puede reiniciarse aunque sessionStorage esté bloqueado.
      }

      setRecoveryData({
        email: "",
        maskedEmail: "",

        verificationExpiresInSeconds:
          600,

        resendAvailableInSeconds:
          60,
      });

      setResetResult(null);

      setCurrentStep(
        "request",
      );
    };

  const handleGoToLogin =
    () => {
      router.replace(
        "/iniciar-sesion?passwordReset=success",
      );

      router.refresh();
    };

  return (
    <section
      className={[
        "grid w-full max-w-6xl overflow-hidden rounded-[2rem]",
        "border border-black/10 bg-white shadow-2xl shadow-black/10",
        "dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/30",
        "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <aside className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-white/10" />

          <div className="absolute -bottom-36 -left-32 h-96 w-96 rounded-full border border-white/10" />

          <div className="absolute right-10 top-1/3 h-52 w-52 rounded-full bg-emerald-300/10 blur-3xl" />

          <span className="absolute left-[14%] top-[17%] h-2.5 w-2.5 rounded-full bg-white/50 motion-safe:animate-pulse" />

          <span className="absolute bottom-[17%] right-[18%] h-3 w-3 rounded-full bg-emerald-200/60 motion-safe:animate-pulse" />
        </div>

        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">
            {copy.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {panelTitle}
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
            {panelDescription}
          </p>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              {copy.currentStep}
            </p>

            <ol className="mt-4 grid gap-3">
              {recoverySteps.map(
                (
                  step,
                  index,
                ) => {
                  const isCompleted =
                    activeStepIndex >
                    index;

                  const isActive =
                    activeStepIndex ===
                    index;

                  return (
                    <li
                      key={step.id}
                      className={[
                        "flex items-center gap-4 rounded-2xl border px-4 py-3 transition",

                        isActive
                          ? "border-white/30 bg-white/15"
                          : isCompleted
                            ? "border-emerald-200/20 bg-emerald-300/10"
                            : "border-white/10 bg-black/5",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",

                          isCompleted
                            ? "bg-white text-emerald-700"
                            : isActive
                              ? "bg-emerald-200 text-emerald-900"
                              : "bg-white/10 text-white/65",
                        ].join(" ")}
                      >
                        {isCompleted ? (
                          <CheckIcon />
                        ) : (
                          step.icon
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            "text-sm font-semibold",

                            isActive ||
                            isCompleted
                              ? "text-white"
                              : "text-white/65",
                          ].join(" ")}
                        >
                          {step.label}
                        </p>

                        <p className="mt-0.5 text-xs text-white/55">
                          {isCompleted
                            ? copy.completed
                            : isActive
                              ? copy.currentStep
                              : copy.pending}
                        </p>
                      </div>

                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-bold text-white/75">
                        {index + 1}
                      </span>
                    </li>
                  );
                },
              )}
            </ol>
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/15 pt-7">
            {securityItems.map(
              (item) => (
                <div
                  key={item.title}
                  className="flex gap-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-100">
                    {item.icon}
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-white/65">
                      {
                        item.description
                      }
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </aside>

      <div
        className="flex min-h-[560px] items-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12"
        aria-label={
          copy.formAreaLabel
        }
      >
        <div className="mx-auto w-full max-w-md">
          {currentStep ===
          "request" ? (
            <ForgotPasswordForm
              initialEmail={
                recoveryData.email
              }
              onRequested={
                handleRecoveryRequested
              }
              onRequestLogin={
                handleGoToLogin
              }
            />
          ) : null}

          {currentStep ===
          "verify" ? (
            <VerificationCodeForm
              mode="password-recovery"
              initialEmail={
                recoveryData.email
              }
              initialMaskedEmail={
                recoveryData.maskedEmail
              }
              initialExpiresInSeconds={
                recoveryData.verificationExpiresInSeconds
              }
              initialResendAvailableInSeconds={
                recoveryData.resendAvailableInSeconds
              }
              onVerified={
                handleCodeVerified
              }
              onRequestChangeEmail={
                handleRestartRecovery
              }
            />
          ) : null}

          {currentStep ===
          "reset" ? (
            <ResetPasswordForm
              initialEmail={
                recoveryData.email
              }
              initialVerificationCode={
                recoveryData.verificationCode
              }
              onPasswordReset={
                handlePasswordReset
              }
              onRequestRecovery={
                handleRestartRecovery
              }
              onRequestLogin={
                handleGoToLogin
              }
            />
          ) : null}

          {currentStep ===
          "success" ? (
            <div className="grid gap-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <svg
                  viewBox="0 0 24 24"
                  width="42"
                  height="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path d="m8 12 2.5 2.5L16 9" />
                </svg>
              </div>

              <header>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                  {copy.successTitle}
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {copy.successMessage}
                </p>
              </header>

              {resetResult &&
              resetResult.sessionsRevoked >
                0 ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {copy.sessionsRevoked}:{" "}
                    {
                      resetResult.sessionsRevoked
                    }
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={
                  handleGoToLogin
                }
                className="min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              >
                {copy.signIn}
              </button>

              <button
                type="button"
                onClick={
                  handleRestartRecovery
                }
                className="mx-auto text-sm font-semibold text-zinc-600 transition hover:text-emerald-700 hover:underline dark:text-zinc-300 dark:hover:text-emerald-400"
              >
                {copy.restart}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
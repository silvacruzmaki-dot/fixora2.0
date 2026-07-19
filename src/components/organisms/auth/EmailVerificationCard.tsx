"use client";

import {
  VerificationCodeForm,
  type VerificationCodeSuccessResult,
} from "@/components/molecules/auth/VerificationCodeForm";

import useLanguage from "@/hooks/language/useLanguage";

export interface EmailVerificationCardProps {
  initialEmail?: string;
  initialMaskedEmail?: string;

  initialExpiresInSeconds?: number;
  initialResendAvailableInSeconds?: number;

  redirectTo?: string;

  onVerified?: (
    result: VerificationCodeSuccessResult,
  ) => void | Promise<void>;

  onRequestChangeEmail?: () => void;

  className?: string;
}

const EMAIL_VERIFICATION_CARD_COPY = {
  es: {
    eyebrow:
      "Protección de cuenta",

    title:
      "Confirma que el correo te pertenece",

    description:
      "La verificación protege tu cuenta y evita que otras personas utilicen tu dirección de correo sin autorización.",

    stepOneTitle:
      "Revisa tu bandeja",

    stepOneDescription:
      "Busca el mensaje enviado por FIXORA. También revisa la carpeta de correo no deseado.",

    stepTwoTitle:
      "Ingresa el código",

    stepTwoDescription:
      "Escribe los seis números respetando el orden en que aparecen en el mensaje.",

    stepThreeTitle:
      "Completa la verificación",

    stepThreeDescription:
      "Después de validar el código podrás acceder normalmente a tu cuenta.",

    securityTitle:
      "Código personal y temporal",

    securityDescription:
      "No compartas este código con otras personas. El equipo de FIXORA nunca te lo solicitará mediante llamadas o mensajes externos.",

    formAreaLabel:
      "Formulario de verificación de correo",
  },

  en: {
    eyebrow:
      "Account protection",

    title:
      "Confirm that the email belongs to you",

    description:
      "Verification protects your account and prevents other people from using your email address without authorization.",

    stepOneTitle:
      "Check your inbox",

    stepOneDescription:
      "Look for the message sent by FIXORA. Also check your spam or junk folder.",

    stepTwoTitle:
      "Enter the code",

    stepTwoDescription:
      "Enter the six digits in the same order shown in the message.",

    stepThreeTitle:
      "Complete verification",

    stepThreeDescription:
      "After validating the code, you will be able to access your account normally.",

    securityTitle:
      "Personal and temporary code",

    securityDescription:
      "Do not share this code with anyone. The FIXORA team will never request it through calls or external messages.",

    formAreaLabel:
      "Email verification form",
  },
} as const;

function EmailVerificationIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="54"
      height="54"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="7"
        y="13"
        width="50"
        height="38"
        rx="8"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        d="m10 18 22 17 22-17"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="49"
        cy="47"
        r="11"
        fill="#059669"
        stroke="white"
        strokeWidth="3"
      />

      <path
        d="m44.5 47 3 3 6-7"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InboxIcon() {
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

function CodeIcon() {
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

function VerifiedIcon() {
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

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
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
    </svg>
  );
}

export function EmailVerificationCard({
  initialEmail = "",
  initialMaskedEmail = "",

  initialExpiresInSeconds,
  initialResendAvailableInSeconds,

  redirectTo,

  onVerified,
  onRequestChangeEmail,

  className = "",
}: EmailVerificationCardProps) {
  const { language } = useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    EMAIL_VERIFICATION_CARD_COPY[
      currentLanguage
    ];

  const verificationSteps = [
    {
      title:
        copy.stepOneTitle,

      description:
        copy.stepOneDescription,

      icon:
        <InboxIcon />,
    },

    {
      title:
        copy.stepTwoTitle,

      description:
        copy.stepTwoDescription,

      icon:
        <CodeIcon />,
    },

    {
      title:
        copy.stepThreeTitle,

      description:
        copy.stepThreeDescription,

      icon:
        <VerifiedIcon />,
    },
  ];

  return (
    <section
      className={[
        "grid w-full max-w-5xl overflow-hidden rounded-[2rem]",
        "border border-black/10 bg-white shadow-2xl shadow-black/10",
        "dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/30",
        "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
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
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full border border-white/10" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/10" />

          <div className="absolute right-10 top-1/3 h-32 w-32 rounded-full bg-emerald-300/10 blur-3xl" />

          <span className="absolute left-[15%] top-[18%] h-2 w-2 rounded-full bg-white/50 motion-safe:animate-pulse" />

          <span className="absolute bottom-[18%] right-[20%] h-2.5 w-2.5 rounded-full bg-emerald-200/60 motion-safe:animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-emerald-100 shadow-xl backdrop-blur-sm">
            <EmailVerificationIcon />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">
            {copy.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.title}
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
            {copy.description}
          </p>

          <ol className="mt-8 grid gap-5">
            {verificationSteps.map(
              (
                step,
                index,
              ) => (
                <li
                  key={step.title}
                  className="flex gap-4"
                >
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-100">
                    {step.icon}

                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-emerald-800">
                      {index + 1}
                    </span>
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {step.title}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-white/70 sm:text-sm">
                      {
                        step.description
                      }
                    </p>
                  </div>
                </li>
              ),
            )}
          </ol>

          <div className="mt-8 flex gap-3 rounded-2xl border border-white/15 bg-black/10 p-4 backdrop-blur-sm">
            <span className="mt-0.5 shrink-0 text-emerald-100">
              <LockIcon />
            </span>

            <div>
              <h2 className="text-sm font-bold text-white">
                {copy.securityTitle}
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/70">
                {
                  copy.securityDescription
                }
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div
        className="flex items-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12"
        aria-label={
          copy.formAreaLabel
        }
      >
        <div className="mx-auto w-full max-w-md">
          <VerificationCodeForm
            mode="email-verification"
            initialEmail={
              initialEmail
            }
            initialMaskedEmail={
              initialMaskedEmail
            }
            initialExpiresInSeconds={
              initialExpiresInSeconds
            }
            initialResendAvailableInSeconds={
              initialResendAvailableInSeconds
            }
            redirectTo={
              redirectTo
            }
            onVerified={
              onVerified
            }
            onRequestChangeEmail={
              onRequestChangeEmail
            }
          />
        </div>
      </div>
    </section>
  );
}
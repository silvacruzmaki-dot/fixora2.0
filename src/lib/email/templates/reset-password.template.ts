import "server-only";

import {
  AUTH_CODE_LENGTH,
  AUTH_EMAIL_POLICY,
  AUTH_LANGUAGES,
  type AuthLanguage,
} from "@/constants/auth/auth.constants";

import {
  isValidAuthCode,
} from "@/lib/auth/codes";

export interface ResetPasswordTemplateInput {
  code: string;

  displayName?:
    | string
    | null;

  language?:
    AuthLanguage;

  expiresInMinutes?:
    number;

  supportEmail?:
    | string
    | null;

  generatedAt?:
    | Date
    | string
    | number;
}

export interface ResetPasswordTemplateResult {
  subject: string;

  text: string;
  html: string;
}

const RESET_PASSWORD_COPY = {
  es: {
    subject:
      "Restablece tu contraseña",

    preheader:
      "Utiliza este código temporal para recuperar tu cuenta de FIXORA.",

    greeting:
      "Hola",

    eyebrow:
      "Recuperación de cuenta",

    title:
      "Solicitaste restablecer tu contraseña",

    introduction:
      "Recibimos una solicitud para cambiar la contraseña de tu cuenta de FIXORA. Ingresa el siguiente código para continuar:",

    codeLabel:
      "Código de recuperación",

    expirationSingular:
      "Este código vencerá en 1 minuto.",

    expirationPlural:
      "Este código vencerá en {minutes} minutos.",

    warningTitle:
      "No compartas este código",

    warning:
      "El equipo de FIXORA nunca te solicitará este código mediante llamadas, mensajes externos o redes sociales.",

    notRequestedTitle:
      "¿No solicitaste este cambio?",

    notRequested:
      "Puedes ignorar este correo. Tu contraseña actual permanecerá sin cambios mientras el código no sea utilizado.",

    sessionTitle:
      "Protección de sesiones",

    sessionDescription:
      "Después de establecer una nueva contraseña, las sesiones anteriores de la cuenta serán cerradas por seguridad.",

    support:
      "Si necesitas ayuda, comunícate con",

    footer:
      "Este es un mensaje automático de seguridad. No respondas directamente a este correo.",

    copyright:
      "Todos los derechos reservados.",
  },

  en: {
    subject:
      "Reset your password",

    preheader:
      "Use this temporary code to recover your FIXORA account.",

    greeting:
      "Hello",

    eyebrow:
      "Account recovery",

    title:
      "You requested a password reset",

    introduction:
      "We received a request to change the password for your FIXORA account. Enter the following code to continue:",

    codeLabel:
      "Recovery code",

    expirationSingular:
      "This code will expire in 1 minute.",

    expirationPlural:
      "This code will expire in {minutes} minutes.",

    warningTitle:
      "Do not share this code",

    warning:
      "The FIXORA team will never request this code through phone calls, external messages, or social media.",

    notRequestedTitle:
      "Did not request this change?",

    notRequested:
      "You can ignore this email. Your current password will remain unchanged as long as the code is not used.",

    sessionTitle:
      "Session protection",

    sessionDescription:
      "After setting a new password, previous account sessions will be closed for security reasons.",

    support:
      "If you need help, contact",

    footer:
      "This is an automated security message. Do not reply directly to this email.",

    copyright:
      "All rights reserved.",
  },
} as const;

const EMAIL_PATTERN =
  /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;

const MAXIMUM_DISPLAY_NAME_LENGTH =
  80;

const MAXIMUM_SUPPORT_EMAIL_LENGTH =
  254;

function escapeHtml(
  value: string,
): string {
  return value.replace(
    /[&<>"']/g,
    (character) => {
      switch (character) {
        case "&":
          return "&amp;";

        case "<":
          return "&lt;";

        case ">":
          return "&gt;";

        case '"':
          return "&quot;";

        case "'":
          return "&#039;";

        default:
          return character;
      }
    },
  );
}

function normalizeDisplayName(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalizedName =
    value
      .replace(
        /[\r\n\t]+/g,
        " ",
      )
      .trim()
      .replace(
        /\s+/g,
        " ",
      )
      .slice(
        0,
        MAXIMUM_DISPLAY_NAME_LENGTH,
      );

  return (
    normalizedName ||
    null
  );
}

function normalizeSupportEmail(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalizedEmail =
    value
      .trim()
      .toLowerCase();

  if (
    normalizedEmail.length ===
      0 ||
    normalizedEmail.length >
      MAXIMUM_SUPPORT_EMAIL_LENGTH ||
    !EMAIL_PATTERN.test(
      normalizedEmail,
    )
  ) {
    return null;
  }

  return normalizedEmail;
}

function normalizeExpirationMinutes(
  value:
    | number
    | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 10;
  }

  return Math.min(
    120,
    Math.max(
      1,
      Math.ceil(value),
    ),
  );
}

function getTemplateYear(
  value:
    ResetPasswordTemplateInput["generatedAt"],
): number {
  if (
    value === undefined
  ) {
    return new Date()
      .getFullYear();
  }

  const parsedDate =
    value instanceof Date
      ? new Date(
          value.getTime(),
        )
      : new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return new Date()
      .getFullYear();
  }

  return parsedDate
    .getFullYear();
}

function getExpirationMessage(
  minutes: number,
  copy:
    | typeof RESET_PASSWORD_COPY.es
    | typeof RESET_PASSWORD_COPY.en,
): string {
  if (minutes === 1) {
    return copy
      .expirationSingular;
  }

  return copy
    .expirationPlural
    .replace(
      "{minutes}",
      String(minutes),
    );
}

export function createResetPasswordTemplate({
  code,

  displayName,

  language =
    AUTH_LANGUAGES.SPANISH,

  expiresInMinutes,

  supportEmail,

  generatedAt,
}: ResetPasswordTemplateInput): ResetPasswordTemplateResult {
  if (
    !isValidAuthCode(
      code,
    )
  ) {
    throw new TypeError(
      `El código de recuperación debe contener exactamente ${AUTH_CODE_LENGTH} dígitos.`,
    );
  }

  const resolvedLanguage:
    AuthLanguage =
    language ===
    AUTH_LANGUAGES.ENGLISH
      ? AUTH_LANGUAGES.ENGLISH
      : AUTH_LANGUAGES.SPANISH;

  const copy =
    RESET_PASSWORD_COPY[
      resolvedLanguage
    ];

  const normalizedDisplayName =
    normalizeDisplayName(
      displayName,
    );

  const normalizedSupportEmail =
    normalizeSupportEmail(
      supportEmail,
    );

  const expirationMinutes =
    normalizeExpirationMinutes(
      expiresInMinutes,
    );

  const expirationMessage =
    getExpirationMessage(
      expirationMinutes,
      copy,
    );

  const currentYear =
    getTemplateYear(
      generatedAt,
    );

  const greeting =
    normalizedDisplayName
      ? `${copy.greeting}, ${normalizedDisplayName}`
      : copy.greeting;

  const subject =
    `${AUTH_EMAIL_POLICY.SUBJECT_PREFIX}: ${copy.subject}`;

  const supportText =
    normalizedSupportEmail
      ? `${copy.support} ${normalizedSupportEmail}.`
      : "";

  const text = [
    greeting,
    "",
    copy.title,
    "",
    copy.introduction,
    "",
    `${copy.codeLabel}: ${code}`,
    "",
    expirationMessage,
    "",
    copy.warningTitle,
    copy.warning,
    "",
    copy.notRequestedTitle,
    copy.notRequested,
    "",
    copy.sessionTitle,
    copy.sessionDescription,

    ...(supportText
      ? [
          "",
          supportText,
        ]
      : []),

    "",
    copy.footer,
    "",
    `© ${currentYear} FIXORA. ${copy.copyright}`,
  ].join("\n");

  const escapedSubject =
    escapeHtml(
      subject,
    );

  const escapedPreheader =
    escapeHtml(
      copy.preheader,
    );

  const escapedGreeting =
    escapeHtml(
      greeting,
    );

  const escapedIntroduction =
    escapeHtml(
      copy.introduction,
    );

  const escapedExpiration =
    escapeHtml(
      expirationMessage,
    );

  const escapedSupportEmail =
    normalizedSupportEmail
      ? escapeHtml(
          normalizedSupportEmail,
        )
      : null;

  const html = `<!doctype html>
<html lang="${resolvedLanguage}">
  <head>
    <meta charset="utf-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />

    <meta
      name="color-scheme"
      content="light dark"
    />

    <meta
      name="supported-color-schemes"
      content="light dark"
    />

    <title>${escapedSubject}</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      color: #18181b;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        display: none;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        color: transparent;
      "
    >
      ${escapedPreheader}
    </div>

    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width: 100%;
        background-color: #f4f4f5;
      "
    >
      <tr>
        <td
          align="center"
          style="
            padding: 32px 16px;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width: 100%;
              max-width: 620px;
              overflow: hidden;
              border: 1px solid #e4e4e7;
              border-radius: 24px;
              background-color: #ffffff;
              box-shadow: 0 18px 45px rgba(24, 24, 27, 0.08);
            "
          >
            <tr>
              <td
                style="
                  padding: 30px 36px;
                  background: linear-gradient(
                    135deg,
                    #18181b,
                    #064e3b,
                    #0f766e
                  );
                  color: #ffffff;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      style="
                        font-size: 22px;
                        font-weight: 800;
                        letter-spacing: 3px;
                      "
                    >
                      FIXORA
                    </td>

                    <td
                      align="right"
                      style="
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        color: #a7f3d0;
                      "
                    >
                      ${escapeHtml(
                        copy.eyebrow,
                      )}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 38px 36px 34px;
                "
              >
                <p
                  style="
                    margin: 0 0 18px;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #3f3f46;
                  "
                >
                  ${escapedGreeting}
                </p>

                <h1
                  style="
                    margin: 0;
                    font-size: 30px;
                    line-height: 1.2;
                    color: #18181b;
                  "
                >
                  ${escapeHtml(
                    copy.title,
                  )}
                </h1>

                <p
                  style="
                    margin: 18px 0 0;
                    font-size: 16px;
                    line-height: 1.7;
                    color: #52525b;
                  "
                >
                  ${escapedIntroduction}
                </p>

                <div
                  style="
                    margin: 30px 0;
                    padding: 28px 20px;
                    border: 1px solid #a7f3d0;
                    border-radius: 18px;
                    background-color: #ecfdf5;
                    text-align: center;
                  "
                >
                  <p
                    style="
                      margin: 0 0 12px;
                      font-size: 12px;
                      font-weight: 700;
                      letter-spacing: 1.5px;
                      text-transform: uppercase;
                      color: #047857;
                    "
                  >
                    ${escapeHtml(
                      copy.codeLabel,
                    )}
                  </p>

                  <p
                    dir="ltr"
                    style="
                      margin: 0;
                      font-family: 'Courier New', Courier, monospace;
                      font-size: 38px;
                      font-weight: 800;
                      line-height: 1;
                      letter-spacing: 9px;
                      color: #065f46;
                    "
                  >
                    ${code}
                  </p>
                </div>

                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.6;
                    text-align: center;
                    color: #71717a;
                  "
                >
                  ${escapedExpiration}
                </p>

                <div
                  style="
                    margin-top: 30px;
                    padding: 18px;
                    border: 1px solid #fde68a;
                    border-radius: 14px;
                    background-color: #fffbeb;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 14px;
                      font-weight: 700;
                      color: #92400e;
                    "
                  >
                    ${escapeHtml(
                      copy.warningTitle,
                    )}
                  </p>

                  <p
                    style="
                      margin: 8px 0 0;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #78350f;
                    "
                  >
                    ${escapeHtml(
                      copy.warning,
                    )}
                  </p>
                </div>

                <div
                  style="
                    margin-top: 18px;
                    padding: 18px;
                    border: 1px solid #fecaca;
                    border-radius: 14px;
                    background-color: #fef2f2;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 14px;
                      font-weight: 700;
                      color: #991b1b;
                    "
                  >
                    ${escapeHtml(
                      copy.notRequestedTitle,
                    )}
                  </p>

                  <p
                    style="
                      margin: 8px 0 0;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #7f1d1d;
                    "
                  >
                    ${escapeHtml(
                      copy.notRequested,
                    )}
                  </p>
                </div>

                <div
                  style="
                    margin-top: 18px;
                    padding: 18px;
                    border: 1px solid #bae6fd;
                    border-radius: 14px;
                    background-color: #f0f9ff;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 14px;
                      font-weight: 700;
                      color: #075985;
                    "
                  >
                    ${escapeHtml(
                      copy.sessionTitle,
                    )}
                  </p>

                  <p
                    style="
                      margin: 8px 0 0;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #0c4a6e;
                    "
                  >
                    ${escapeHtml(
                      copy.sessionDescription,
                    )}
                  </p>
                </div>

                ${
                  escapedSupportEmail
                    ? `
                <p
                  style="
                    margin: 24px 0 0;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #71717a;
                  "
                >
                  ${escapeHtml(
                    copy.support,
                  )}
                  <a
                    href="mailto:${escapedSupportEmail}"
                    style="
                      color: #047857;
                      font-weight: 700;
                      text-decoration: none;
                    "
                  >
                    ${escapedSupportEmail}
                  </a>.
                </p>
                `
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 24px 36px;
                  border-top: 1px solid #e4e4e7;
                  background-color: #fafafa;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 1.6;
                    color: #71717a;
                  "
                >
                  ${escapeHtml(
                    copy.footer,
                  )}
                </p>

                <p
                  style="
                    margin: 10px 0 0;
                    font-size: 11px;
                    line-height: 1.6;
                    color: #a1a1aa;
                  "
                >
                  © ${currentYear} FIXORA.
                  ${escapeHtml(
                    copy.copyright,
                  )}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject,
    text,
    html,
  };
}

export const buildResetPasswordTemplate =
  createResetPasswordTemplate;

export const resetPasswordTemplate =
  createResetPasswordTemplate;

export const createPasswordResetTemplate =
  createResetPasswordTemplate;
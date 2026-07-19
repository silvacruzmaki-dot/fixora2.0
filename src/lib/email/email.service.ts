import "server-only";

import {
  createHash,
} from "node:crypto";

import nodemailer, {
  type Transporter,
} from "nodemailer";

export type EmailServiceErrorCode =
  | "EMAIL_CONFIGURATION_MISSING"
  | "EMAIL_CONFIGURATION_INVALID"
  | "EMAIL_RECIPIENT_REQUIRED"
  | "EMAIL_RECIPIENT_INVALID"
  | "EMAIL_RECIPIENT_LIMIT_EXCEEDED"
  | "EMAIL_SUBJECT_REQUIRED"
  | "EMAIL_SUBJECT_TOO_LONG"
  | "EMAIL_CONTENT_REQUIRED"
  | "EMAIL_CONTENT_TOO_LONG"
  | "EMAIL_TRANSPORT_UNAVAILABLE"
  | "EMAIL_SEND_FAILED"
  | "EMAIL_REJECTED";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export type EmailRecipientInput =
  | string
  | EmailRecipient;

export interface SendEmailInput {
  to:
    | EmailRecipientInput
    | readonly EmailRecipientInput[];

  subject: string;

  text?: string;
  html?: string;

  replyTo?: EmailRecipientInput;

  /*
   * Nombre interno opcional para identificar el tipo
   * de correo sin incluir información sensible.
   *
   * Ejemplos:
   * - email-verification
   * - password-reset
   */
  category?: string;
}

export interface SendEmailResult {
  messageId: string;

  accepted: string[];
  rejected: string[];

  response: string | null;
}

export interface SafeSendEmailSuccess {
  ok: true;
  result: SendEmailResult;
}

export interface SafeSendEmailFailure {
  ok: false;
  error: EmailServiceError;
}

export type SafeSendEmailResult =
  | SafeSendEmailSuccess
  | SafeSendEmailFailure;

interface EmailServiceConfiguration {
  host: string;
  port: number;
  secure: boolean;

  user?: string;
  password?: string;

  fromEmail: string;
  fromName: string;

  defaultReplyTo?: string;

  rejectUnauthorized: boolean;

  connectionTimeoutMs: number;
  greetingTimeoutMs: number;
  socketTimeoutMs: number;
}

interface EmailServiceGlobal {
  __fixoraEmailTransporter?: Transporter;

  __fixoraEmailTransporterSignature?: string;
}

const globalForEmail =
  globalThis as typeof globalThis &
    EmailServiceGlobal;

const EMAIL_PATTERN =
  /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;

const MAXIMUM_RECIPIENTS =
  20;

const MAXIMUM_EMAIL_LENGTH =
  254;

const MAXIMUM_RECIPIENT_NAME_LENGTH =
  120;

const MAXIMUM_SUBJECT_LENGTH =
  200;

const MAXIMUM_TEXT_LENGTH =
  1_000_000;

const MAXIMUM_HTML_LENGTH =
  1_500_000;

const DEFAULT_SMTP_PORT =
  587;

const DEFAULT_CONNECTION_TIMEOUT_MS =
  10_000;

const DEFAULT_GREETING_TIMEOUT_MS =
  10_000;

const DEFAULT_SOCKET_TIMEOUT_MS =
  20_000;

export class EmailServiceError extends Error {
  readonly code:
    EmailServiceErrorCode;

  constructor(
    code:
      EmailServiceErrorCode,
    message: string,
    options?: {
      cause?: unknown;
    },
  ) {
    super(
      message,
      {
        cause:
          options?.cause,
      },
    );

    this.name =
      "EmailServiceError";

    this.code =
      code;
  }
}

function readOptionalEnvironmentVariable(
  ...names: string[]
): string | undefined {
  for (
    const name
    of names
  ) {
    const value =
      process.env[name];

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return value.trim();
    }
  }

  return undefined;
}

function readRequiredEnvironmentVariable(
  names: string[],
  displayName: string,
): string {
  const value =
    readOptionalEnvironmentVariable(
      ...names,
    );

  if (!value) {
    throw new EmailServiceError(
      "EMAIL_CONFIGURATION_MISSING",
      `Falta la variable de entorno obligatoria para "${displayName}".`,
    );
  }

  return value;
}

function readBooleanEnvironmentVariable(
  names: string[],
  defaultValue: boolean,
): boolean {
  const value =
    readOptionalEnvironmentVariable(
      ...names,
    );

  if (value === undefined) {
    return defaultValue;
  }

  const normalizedValue =
    value.toLowerCase();

  if (
    [
      "true",
      "1",
      "yes",
      "on",
    ].includes(
      normalizedValue,
    )
  ) {
    return true;
  }

  if (
    [
      "false",
      "0",
      "no",
      "off",
    ].includes(
      normalizedValue,
    )
  ) {
    return false;
  }

  throw new EmailServiceError(
    "EMAIL_CONFIGURATION_INVALID",
    `La variable "${names[0]}" debe contener true o false.`,
  );
}

function readPositiveIntegerEnvironmentVariable(
  names: string[],
  defaultValue: number,
  maximumValue: number,
): number {
  const value =
    readOptionalEnvironmentVariable(
      ...names,
    );

  if (value === undefined) {
    return defaultValue;
  }

  const parsedValue =
    Number(value);

  if (
    !Number.isInteger(
      parsedValue,
    ) ||
    parsedValue < 1 ||
    parsedValue >
      maximumValue
  ) {
    throw new EmailServiceError(
      "EMAIL_CONFIGURATION_INVALID",
      `La variable "${names[0]}" debe contener un número entero entre 1 y ${maximumValue}.`,
    );
  }

  return parsedValue;
}

function containsHeaderInjection(
  value: string,
): boolean {
  return /[\r\n]/.test(
    value,
  );
}

function normalizeEmailAddress(
  email: unknown,
): string {
  if (
    typeof email !==
    "string"
  ) {
    return "";
  }

  return email
    .trim()
    .toLowerCase();
}

function isValidEmailAddress(
  email: unknown,
): email is string {
  if (
    typeof email !==
    "string"
  ) {
    return false;
  }

  const normalizedEmail =
    normalizeEmailAddress(
      email,
    );

  return (
    normalizedEmail.length > 0 &&
    normalizedEmail.length <=
      MAXIMUM_EMAIL_LENGTH &&
    !containsHeaderInjection(
      normalizedEmail,
    ) &&
    EMAIL_PATTERN.test(
      normalizedEmail,
    )
  );
}

function normalizeRecipientName(
  name: unknown,
): string | undefined {
  if (
    typeof name !==
    "string"
  ) {
    return undefined;
  }

  const normalizedName =
    name
      .replace(
        /[\r\n]+/g,
        " ",
      )
      .trim()
      .replace(
        /\s+/g,
        " ",
      )
      .slice(
        0,
        MAXIMUM_RECIPIENT_NAME_LENGTH,
      );

  return (
    normalizedName ||
    undefined
  );
}

function normalizeRecipient(
  recipient:
    EmailRecipientInput,
): EmailRecipient {
  if (
    typeof recipient ===
    "string"
  ) {
    const normalizedEmail =
      normalizeEmailAddress(
        recipient,
      );

    if (
      !isValidEmailAddress(
        normalizedEmail,
      )
    ) {
      throw new EmailServiceError(
        "EMAIL_RECIPIENT_INVALID",
        "Uno de los destinatarios tiene un correo electrónico inválido.",
      );
    }

    return {
      email:
        normalizedEmail,
    };
  }

  const normalizedEmail =
    normalizeEmailAddress(
      recipient.email,
    );

  if (
    !isValidEmailAddress(
      normalizedEmail,
    )
  ) {
    throw new EmailServiceError(
      "EMAIL_RECIPIENT_INVALID",
      "Uno de los destinatarios tiene un correo electrónico inválido.",
    );
  }

  return {
    email:
      normalizedEmail,

    name:
      normalizeRecipientName(
        recipient.name,
      ),
  };
}

function normalizeRecipients(
  input:
    | EmailRecipientInput
    | readonly EmailRecipientInput[],
): EmailRecipient[] {
  const recipientInputs =
    Array.isArray(input)
      ? input
      : [input];

  if (
    recipientInputs.length ===
    0
  ) {
    throw new EmailServiceError(
      "EMAIL_RECIPIENT_REQUIRED",
      "Debes indicar al menos un destinatario.",
    );
  }

  if (
    recipientInputs.length >
    MAXIMUM_RECIPIENTS
  ) {
    throw new EmailServiceError(
      "EMAIL_RECIPIENT_LIMIT_EXCEEDED",
      `No se pueden enviar más de ${MAXIMUM_RECIPIENTS} destinatarios en un solo correo.`,
    );
  }

  const normalizedRecipients =
    recipientInputs.map(
      normalizeRecipient,
    );

  /*
   * Elimina destinatarios duplicados conservando el
   * primer nombre proporcionado.
   */
  return Array.from(
    new Map(
      normalizedRecipients.map(
        (recipient) => [
          recipient.email,
          recipient,
        ],
      ),
    ).values(),
  );
}

function normalizeSubject(
  subject: unknown,
): string {
  if (
    typeof subject !==
    "string" ||
    subject.trim().length ===
      0
  ) {
    throw new EmailServiceError(
      "EMAIL_SUBJECT_REQUIRED",
      "El asunto del correo es obligatorio.",
    );
  }

  if (
    containsHeaderInjection(
      subject,
    )
  ) {
    throw new EmailServiceError(
      "EMAIL_SUBJECT_REQUIRED",
      "El asunto del correo contiene caracteres no permitidos.",
    );
  }

  const normalizedSubject =
    subject
      .trim()
      .replace(
        /\s+/g,
        " ",
      );

  if (
    normalizedSubject.length >
    MAXIMUM_SUBJECT_LENGTH
  ) {
    throw new EmailServiceError(
      "EMAIL_SUBJECT_TOO_LONG",
      `El asunto no puede superar ${MAXIMUM_SUBJECT_LENGTH} caracteres.`,
    );
  }

  return normalizedSubject;
}

function normalizeEmailContent(
  value: unknown,
  maximumLength: number,
  contentType:
    "text"
    | "html",
): string | undefined {
  if (
    value === undefined ||
    value === null
  ) {
    return undefined;
  }

  if (
    typeof value !==
    "string"
  ) {
    throw new EmailServiceError(
      "EMAIL_CONTENT_REQUIRED",
      `El contenido ${contentType} del correo no es válido.`,
    );
  }

  if (
    value.length >
    maximumLength
  ) {
    throw new EmailServiceError(
      "EMAIL_CONTENT_TOO_LONG",
      `El contenido ${contentType} del correo es demasiado extenso.`,
    );
  }

  return value.trim()
    ? value
    : undefined;
}

function toNodemailerAddress(
  recipient:
    EmailRecipient,
) {
  return {
    address:
      recipient.email,

    ...(recipient.name
      ? {
          name:
            recipient.name,
        }
      : {}),
  };
}

function getEmailServiceConfiguration():
  EmailServiceConfiguration {
  const host =
    readRequiredEnvironmentVariable(
      [
        "SMTP_HOST",
      ],
      "SMTP_HOST",
    );

  const port =
    readPositiveIntegerEnvironmentVariable(
      [
        "SMTP_PORT",
      ],
      DEFAULT_SMTP_PORT,
      65_535,
    );

  const secure =
    readBooleanEnvironmentVariable(
      [
        "SMTP_SECURE",
      ],
      port === 465,
    );

  const user =
    readOptionalEnvironmentVariable(
      "SMTP_USER",
    );

  /*
   * No se recorta la contraseña SMTP porque podría
   * contener espacios como parte de su valor.
   */
  const password =
    typeof process.env
      .SMTP_PASSWORD ===
      "string" &&
    process.env.SMTP_PASSWORD
      .length > 0
      ? process.env
          .SMTP_PASSWORD
      : undefined;

  if (
    Boolean(user) !==
    Boolean(password)
  ) {
    throw new EmailServiceError(
      "EMAIL_CONFIGURATION_INVALID",
      "SMTP_USER y SMTP_PASSWORD deben configurarse juntos.",
    );
  }

  const fromEmail =
    readRequiredEnvironmentVariable(
      [
        "SMTP_FROM_EMAIL",
        "EMAIL_FROM_ADDRESS",
      ],
      "SMTP_FROM_EMAIL",
    )
      .toLowerCase();

  if (
    !isValidEmailAddress(
      fromEmail,
    )
  ) {
    throw new EmailServiceError(
      "EMAIL_CONFIGURATION_INVALID",
      "El correo configurado como remitente no es válido.",
    );
  }

  const fromName =
    normalizeRecipientName(
      readOptionalEnvironmentVariable(
        "SMTP_FROM_NAME",
        "EMAIL_FROM_NAME",
      ) ??
        "FIXORA",
    ) ??
    "FIXORA";

  const defaultReplyTo =
    readOptionalEnvironmentVariable(
      "SMTP_REPLY_TO",
      "EMAIL_REPLY_TO",
    )
      ?.toLowerCase();

  if (
    defaultReplyTo &&
    !isValidEmailAddress(
      defaultReplyTo,
    )
  ) {
    throw new EmailServiceError(
      "EMAIL_CONFIGURATION_INVALID",
      "El correo configurado en SMTP_REPLY_TO no es válido.",
    );
  }

  return {
    host,
    port,
    secure,

    user,
    password,

    fromEmail,
    fromName,

    defaultReplyTo,

    rejectUnauthorized:
      readBooleanEnvironmentVariable(
        [
          "SMTP_TLS_REJECT_UNAUTHORIZED",
        ],
        process.env.NODE_ENV ===
          "production",
      ),

    connectionTimeoutMs:
      readPositiveIntegerEnvironmentVariable(
        [
          "SMTP_CONNECTION_TIMEOUT_MS",
        ],
        DEFAULT_CONNECTION_TIMEOUT_MS,
        120_000,
      ),

    greetingTimeoutMs:
      readPositiveIntegerEnvironmentVariable(
        [
          "SMTP_GREETING_TIMEOUT_MS",
        ],
        DEFAULT_GREETING_TIMEOUT_MS,
        120_000,
      ),

    socketTimeoutMs:
      readPositiveIntegerEnvironmentVariable(
        [
          "SMTP_SOCKET_TIMEOUT_MS",
        ],
        DEFAULT_SOCKET_TIMEOUT_MS,
        300_000,
      ),
  };
}

function createConfigurationSignature(
  configuration:
    EmailServiceConfiguration,
): string {
  return createHash(
    "sha256",
  )
    .update(
      [
        configuration.host,
        configuration.port,
        configuration.secure,
        configuration.user ??
          "",
        configuration.password ??
          "",
        configuration.fromEmail,
        configuration.rejectUnauthorized,
      ].join("|"),
      "utf8",
    )
    .digest(
      "hex",
    );
}

function createEmailTransporter(
  configuration:
    EmailServiceConfiguration,
): Transporter {
  return nodemailer.createTransport({
    host:
      configuration.host,

    port:
      configuration.port,

    secure:
      configuration.secure,

    ...(configuration.user &&
    configuration.password
      ? {
          auth: {
            user:
              configuration.user,

            pass:
              configuration.password,
          },
        }
      : {}),

    tls: {
      rejectUnauthorized:
        configuration.rejectUnauthorized,
    },

    connectionTimeout:
      configuration.connectionTimeoutMs,

    greetingTimeout:
      configuration.greetingTimeoutMs,

    socketTimeout:
      configuration.socketTimeoutMs,

    /*
     * Nunca se habilita el registro interno de Nodemailer
     * para evitar que el contenido o los códigos temporales
     * aparezcan en la consola.
     */
    logger: false,
    debug: false,
  });
}

function getEmailTransporter(
  configuration:
    EmailServiceConfiguration,
): Transporter {
  const configurationSignature =
    createConfigurationSignature(
      configuration,
    );

  if (
    globalForEmail
      .__fixoraEmailTransporter &&
    globalForEmail
      .__fixoraEmailTransporterSignature ===
      configurationSignature
  ) {
    return globalForEmail
      .__fixoraEmailTransporter;
  }

  const transporter =
    createEmailTransporter(
      configuration,
    );

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    globalForEmail.__fixoraEmailTransporter =
      transporter;

    globalForEmail.__fixoraEmailTransporterSignature =
      configurationSignature;
  }

  return transporter;
}

function normalizeDeliveryAddresses(
  values: unknown,
): string[] {
  if (
    !Array.isArray(values)
  ) {
    return [];
  }

  return values
    .map(
      (value) => {
        if (
          typeof value ===
          "string"
        ) {
          return value;
        }

        if (
          value &&
          typeof value ===
            "object" &&
          "address" in value &&
          typeof value.address ===
            "string"
        ) {
          return value.address;
        }

        return String(value);
      },
    )
    .filter(Boolean);
}

export function isEmailServiceError(
  error: unknown,
): error is EmailServiceError {
  return (
    error instanceof
    EmailServiceError
  );
}

/**
 * Comprueba si existe una configuración SMTP mínima.
 *
 * No intenta conectarse al servidor.
 */
export function isEmailServiceConfigured():
  boolean {
  try {
    getEmailServiceConfiguration();

    return true;
  } catch {
    return false;
  }
}

/**
 * Comprueba la conexión y autenticación SMTP.
 *
 * Devuelve true cuando Nodemailer puede comunicarse
 * correctamente con el servidor.
 */
export async function verifyEmailTransport():
  Promise<true> {
  let configuration:
    EmailServiceConfiguration;

  try {
    configuration =
      getEmailServiceConfiguration();
  } catch (error) {
    if (
      isEmailServiceError(
        error,
      )
    ) {
      throw error;
    }

    throw new EmailServiceError(
      "EMAIL_CONFIGURATION_INVALID",
      "La configuración del servicio de correo no es válida.",
      {
        cause:
          error,
      },
    );
  }

  try {
    const transporter =
      getEmailTransporter(
        configuration,
      );

    await transporter.verify();

    return true;
  } catch (error) {
    throw new EmailServiceError(
      "EMAIL_TRANSPORT_UNAVAILABLE",
      "No fue posible establecer comunicación con el servidor de correo.",
      {
        cause:
          error,
      },
    );
  }
}

/**
 * Envía un correo mediante el servidor SMTP configurado.
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
  category,
}: SendEmailInput): Promise<SendEmailResult> {
  const recipients =
    normalizeRecipients(
      to,
    );

  const normalizedSubject =
    normalizeSubject(
      subject,
    );

  const normalizedText =
    normalizeEmailContent(
      text,
      MAXIMUM_TEXT_LENGTH,
      "text",
    );

  const normalizedHtml =
    normalizeEmailContent(
      html,
      MAXIMUM_HTML_LENGTH,
      "html",
    );

  if (
    !normalizedText &&
    !normalizedHtml
  ) {
    throw new EmailServiceError(
      "EMAIL_CONTENT_REQUIRED",
      "El correo debe contener una versión de texto, HTML o ambas.",
    );
  }

  const normalizedReplyTo =
    replyTo
      ? normalizeRecipient(
          replyTo,
        )
      : null;

  const configuration =
    getEmailServiceConfiguration();

  const transporter =
    getEmailTransporter(
      configuration,
    );

  try {
    const deliveryInfo =
      await transporter.sendMail({
        from: {
          address:
            configuration.fromEmail,

          name:
            configuration.fromName,
        },

        to:
          recipients.map(
            toNodemailerAddress,
          ),

        subject:
          normalizedSubject,

        ...(normalizedText
          ? {
              text:
                normalizedText,
            }
          : {}),

        ...(normalizedHtml
          ? {
              html:
                normalizedHtml,
            }
          : {}),

        replyTo:
          normalizedReplyTo
            ? toNodemailerAddress(
                normalizedReplyTo,
              )
            : configuration.defaultReplyTo,

        /*
         * Impide que el contenido HTML intente leer archivos
         * locales o descargar recursos externos durante el envío.
         */
        disableFileAccess: true,
        disableUrlAccess: true,

        headers: {
          "X-Fixora-Message":
            "transactional",

          ...(category
            ? {
                "X-Fixora-Category":
                  category
                    .trim()
                    .slice(
                      0,
                      80,
                    ),
              }
            : {}),
        },
      });

    const accepted =
      normalizeDeliveryAddresses(
        deliveryInfo.accepted,
      );

    const rejected =
      normalizeDeliveryAddresses(
        deliveryInfo.rejected,
      );

    if (
      accepted.length === 0 &&
      rejected.length > 0
    ) {
      throw new EmailServiceError(
        "EMAIL_REJECTED",
        "El servidor de correo rechazó todos los destinatarios.",
      );
    }

    return {
      messageId:
        typeof deliveryInfo.messageId ===
          "string"
          ? deliveryInfo.messageId
          : "",

      accepted,
      rejected,

      response:
        typeof deliveryInfo.response ===
          "string"
          ? deliveryInfo.response
          : null,
    };
  } catch (error) {
    if (
      isEmailServiceError(
        error,
      )
    ) {
      throw error;
    }

    /*
     * No se incluye el contenido del correo ni los códigos
     * temporales dentro del mensaje público del error.
     */
    throw new EmailServiceError(
      "EMAIL_SEND_FAILED",
      "No fue posible enviar el correo electrónico.",
      {
        cause:
          error,
      },
    );
  }
}

/**
 * Variante que devuelve un resultado controlado y no lanza
 * errores al servicio que la consume.
 */
export async function sendEmailSafely(
  input:
    SendEmailInput,
): Promise<SafeSendEmailResult> {
  try {
    return {
      ok: true,

      result:
        await sendEmail(
          input,
        ),
    };
  } catch (error) {
    if (
      isEmailServiceError(
        error,
      )
    ) {
      return {
        ok: false,
        error,
      };
    }

    return {
      ok: false,

      error:
        new EmailServiceError(
          "EMAIL_SEND_FAILED",
          "No fue posible enviar el correo electrónico.",
          {
            cause:
              error,
          },
        ),
    };
  }
}

/**
 * Alias semántico para los servicios de autenticación.
 */
export const sendTransactionalEmail =
  sendEmail;
import { z } from "zod";

import {
  AUTH_CODE_LENGTH,
  AUTH_USER_FIELD_LIMITS,
} from "@/constants/auth/auth.constants";

const VERIFY_EMAIL_SCHEMA_MESSAGES = {
  emailRequired:
    "El correo electrónico es obligatorio.",

  emailInvalid:
    "Ingresa un correo electrónico válido.",

  emailTooLong:
    `El correo electrónico no puede superar ${AUTH_USER_FIELD_LIMITS.EMAIL_MAXIMUM_LENGTH} caracteres.`,

  codeRequired:
    "El código de verificación es obligatorio.",

  codeInvalid:
    `El código de verificación debe contener exactamente ${AUTH_CODE_LENGTH} dígitos.`,
} as const;

const VERIFICATION_CODE_PATTERN =
  new RegExp(
    `^\\d{${AUTH_CODE_LENGTH}}$`,
  );

const VERIFICATION_CODE_ALIAS_KEYS = [
  "verificationCode",
  "verification_code",
  "emailVerificationCode",
  "email_verification_code",
] as const;

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function normalizeEmailInput(
  value: unknown,
): unknown {
  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  return value
    .trim()
    .toLowerCase();
}

/*
 * Permite pegar códigos con espacios
 * o guiones:
 *
 * 123 456
 * 123-456
 *
 * Ambos se convierten en:
 *
 * 123456
 *
 * Los números no se convierten automáticamente
 * porque podrían perder ceros iniciales.
 */
function normalizeVerificationCodeInput(
  value: unknown,
): unknown {
  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  return value
    .trim()
    .replace(
      /[\s-]+/g,
      "",
    );
}

function getFirstDefinedValue(
  source: Record<string, unknown>,
  keys: readonly string[],
): unknown {
  for (
    const key
    of keys
  ) {
    if (
      source[key] !==
      undefined
    ) {
      return source[key];
    }
  }

  return undefined;
}

/*
 * Mantiene `code` como nombre canónico,
 * pero admite alias utilizados por formularios
 * o integraciones anteriores.
 */
function normalizeVerifyEmailObject(
  input: unknown,
): unknown {
  if (
    !isPlainObject(input)
  ) {
    return input;
  }

  const normalizedInput:
    Record<string, unknown> = {
    ...input,
  };

  if (
    normalizedInput.code ===
    undefined
  ) {
    normalizedInput.code =
      getFirstDefinedValue(
        normalizedInput,
        VERIFICATION_CODE_ALIAS_KEYS,
      );
  }

  for (
    const aliasKey
    of VERIFICATION_CODE_ALIAS_KEYS
  ) {
    delete normalizedInput[
      aliasKey
    ];
  }

  return normalizedInput;
}

const emailSchema =
  z.preprocess(
    normalizeEmailInput,

    z
      .string({
        error:
          VERIFY_EMAIL_SCHEMA_MESSAGES
            .emailRequired,
      })
      .min(
        1,
        VERIFY_EMAIL_SCHEMA_MESSAGES
          .emailRequired,
      )
      .max(
        AUTH_USER_FIELD_LIMITS
          .EMAIL_MAXIMUM_LENGTH,
        VERIFY_EMAIL_SCHEMA_MESSAGES
          .emailTooLong,
      )
      .email(
        VERIFY_EMAIL_SCHEMA_MESSAGES
          .emailInvalid,
      ),
  );

const verificationCodeSchema =
  z.preprocess(
    normalizeVerificationCodeInput,

    z
      .string({
        error:
          VERIFY_EMAIL_SCHEMA_MESSAGES
            .codeRequired,
      })
      .min(
        1,
        VERIFY_EMAIL_SCHEMA_MESSAGES
          .codeRequired,
      )
      .regex(
        VERIFICATION_CODE_PATTERN,
        VERIFY_EMAIL_SCHEMA_MESSAGES
          .codeInvalid,
      ),
  );

/*
 * z.strictObject rechaza cualquier campo que
 * no sea `email` o `code`.
 */
const verifyEmailObjectSchema =
  z.strictObject({
    email:
      emailSchema,

    code:
      verificationCodeSchema,
  });

/*
 * Valida la confirmación del correo
 * mediante código.
 */
export const verifyEmailSchema =
  z.preprocess(
    normalizeVerifyEmailObject,
    verifyEmailObjectSchema,
  );

/*
 * Valida la solicitud para reenviar
 * un código.
 */
export const resendVerificationCodeSchema =
  z.strictObject({
    email:
      emailSchema,
  });

export type VerifyEmailSchemaInput =
  z.input<
    typeof verifyEmailSchema
  >;

export type VerifyEmailSchemaOutput =
  z.output<
    typeof verifyEmailSchema
  >;

export type VerifyEmailInput =
  VerifyEmailSchemaOutput;

export type VerifyEmailData =
  VerifyEmailSchemaOutput;

export type ResendVerificationCodeSchemaInput =
  z.input<
    typeof resendVerificationCodeSchema
  >;

export type ResendVerificationCodeSchemaOutput =
  z.output<
    typeof resendVerificationCodeSchema
  >;

export type ResendVerificationCodeInput =
  ResendVerificationCodeSchemaOutput;

export function parseVerifyEmailInput(
  input: unknown,
): VerifyEmailSchemaOutput {
  return verifyEmailSchema.parse(
    input,
  );
}

export function safeParseVerifyEmailInput(
  input: unknown,
) {
  return verifyEmailSchema.safeParse(
    input,
  );
}

export function parseResendVerificationCodeInput(
  input: unknown,
): ResendVerificationCodeSchemaOutput {
  return resendVerificationCodeSchema.parse(
    input,
  );
}

export function safeParseResendVerificationCodeInput(
  input: unknown,
) {
  return resendVerificationCodeSchema.safeParse(
    input,
  );
}

/*
 * Alias compatibles con los servicios
 * y rutas.
 */
export const verifyEmailCodeSchema =
  verifyEmailSchema;

export const emailVerificationSchema =
  verifyEmailSchema;

export const resendEmailVerificationSchema =
  resendVerificationCodeSchema;

export const resendCodeSchema =
  resendVerificationCodeSchema;
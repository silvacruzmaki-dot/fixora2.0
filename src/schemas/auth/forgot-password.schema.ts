import { z } from "zod";

import {
  AUTH_CODE_LENGTH,
  AUTH_USER_FIELD_LIMITS,
} from "@/constants/auth/auth.constants";

const FORGOT_PASSWORD_SCHEMA_MESSAGES = {
  emailRequired:
    "El correo electrónico es obligatorio.",

  emailInvalid:
    "Ingresa un correo electrónico válido.",

  emailTooLong:
    `El correo electrónico no puede superar ${AUTH_USER_FIELD_LIMITS.EMAIL_MAXIMUM_LENGTH} caracteres.`,

  codeRequired:
    "El código de recuperación es obligatorio.",

  codeInvalid:
    `El código de recuperación debe contener exactamente ${AUTH_CODE_LENGTH} dígitos.`,
} as const;

const PASSWORD_RESET_CODE_PATTERN =
  new RegExp(
    `^\\d{${AUTH_CODE_LENGTH}}$`,
  );

const PASSWORD_RESET_CODE_ALIAS_KEYS = [
  "recoveryCode",
  "recovery_code",
  "verificationCode",
  "verification_code",
  "resetCode",
  "reset_code",
  "passwordResetCode",
  "password_reset_code",
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
    typeof value !== "string"
  ) {
    return value;
  }

  return value
    .trim()
    .toLowerCase();
}

/**
 * Permite pegar códigos con espacios o guiones:
 *
 * 123 456
 * 123-456
 *
 * Ambos se convierten en:
 *
 * 123456
 *
 * Los valores numéricos no se convierten porque
 * podrían perder los ceros iniciales.
 */
function normalizePasswordResetCodeInput(
  value: unknown,
): unknown {
  if (
    typeof value !== "string"
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
      source[key] !== undefined
    ) {
      return source[key];
    }
  }

  return undefined;
}

/**
 * Mantiene `code` como nombre canónico.
 *
 * También admite nombres alternativos enviados por
 * formularios anteriores y elimina esos alias antes
 * de ejecutar la validación estricta.
 */
function normalizeVerifyPasswordResetCodeObject(
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
        PASSWORD_RESET_CODE_ALIAS_KEYS,
      );
  }

  for (
    const aliasKey
    of PASSWORD_RESET_CODE_ALIAS_KEYS
  ) {
    delete normalizedInput[
      aliasKey
    ];
  }

  return normalizedInput;
}

const recoveryEmailSchema =
  z.preprocess(
    normalizeEmailInput,

    z
      .string({
        error:
          FORGOT_PASSWORD_SCHEMA_MESSAGES
            .emailRequired,
      })
      .min(
        1,
        FORGOT_PASSWORD_SCHEMA_MESSAGES
          .emailRequired,
      )
      .max(
        AUTH_USER_FIELD_LIMITS
          .EMAIL_MAXIMUM_LENGTH,
        FORGOT_PASSWORD_SCHEMA_MESSAGES
          .emailTooLong,
      )
      .email(
        FORGOT_PASSWORD_SCHEMA_MESSAGES
          .emailInvalid,
      ),
  );

const passwordResetCodeSchema =
  z.preprocess(
    normalizePasswordResetCodeInput,

    z
      .string({
        error:
          FORGOT_PASSWORD_SCHEMA_MESSAGES
            .codeRequired,
      })
      .min(
        1,
        FORGOT_PASSWORD_SCHEMA_MESSAGES
          .codeRequired,
      )
      .regex(
        PASSWORD_RESET_CODE_PATTERN,
        FORGOT_PASSWORD_SCHEMA_MESSAGES
          .codeInvalid,
      ),
  );

/**
 * Solicitud inicial para recuperar la contraseña.
 *
 * Recibe:
 *
 * - email
 *
 * Al utilizar strictObject, cualquier propiedad
 * adicional genera un error de validación.
 */
export const forgotPasswordSchema =
  z.strictObject({
    email:
      recoveryEmailSchema,
  });

/**
 * Objeto utilizado para comprobar el código de
 * recuperación antes de permitir establecer una
 * contraseña nueva.
 *
 * Recibe:
 *
 * - email
 * - code
 */
const verifyPasswordResetCodeObjectSchema =
  z.strictObject({
    email:
      recoveryEmailSchema,

    code:
      passwordResetCodeSchema,
  });

/**
 * Valida el código enviado por correo.
 *
 * Antes de validar, transforma los posibles alias del
 * código al nombre canónico `code`.
 */
export const verifyPasswordResetCodeSchema =
  z.preprocess(
    normalizeVerifyPasswordResetCodeObject,
    verifyPasswordResetCodeObjectSchema,
  );

export type ForgotPasswordSchemaInput =
  z.input<
    typeof forgotPasswordSchema
  >;

export type ForgotPasswordSchemaOutput =
  z.output<
    typeof forgotPasswordSchema
  >;

export type ForgotPasswordInput =
  ForgotPasswordSchemaOutput;

export type ForgotPasswordData =
  ForgotPasswordSchemaOutput;

export type VerifyPasswordResetCodeSchemaInput =
  z.input<
    typeof verifyPasswordResetCodeSchema
  >;

export type VerifyPasswordResetCodeSchemaOutput =
  z.output<
    typeof verifyPasswordResetCodeSchema
  >;

export type VerifyPasswordResetCodeInput =
  VerifyPasswordResetCodeSchemaOutput;

export type VerifyPasswordResetCodeData =
  VerifyPasswordResetCodeSchemaOutput;

export function parseForgotPasswordInput(
  input: unknown,
): ForgotPasswordSchemaOutput {
  return forgotPasswordSchema.parse(
    input,
  );
}

export function safeParseForgotPasswordInput(
  input: unknown,
) {
  return forgotPasswordSchema.safeParse(
    input,
  );
}

export function parseVerifyPasswordResetCodeInput(
  input: unknown,
): VerifyPasswordResetCodeSchemaOutput {
  return verifyPasswordResetCodeSchema.parse(
    input,
  );
}

export function safeParseVerifyPasswordResetCodeInput(
  input: unknown,
) {
  return verifyPasswordResetCodeSchema.safeParse(
    input,
  );
}

/**
 * Alias compatibles con las rutas, formularios
 * y servicios de autenticación.
 */
export const passwordRecoverySchema =
  forgotPasswordSchema;

export const requestPasswordResetSchema =
  forgotPasswordSchema;

export const verifyRecoveryCodeSchema =
  verifyPasswordResetCodeSchema;

export const passwordRecoveryCodeSchema =
  verifyPasswordResetCodeSchema;

export const verifyResetCodeSchema =
  verifyPasswordResetCodeSchema;
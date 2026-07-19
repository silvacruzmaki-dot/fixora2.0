import { z } from "zod";

import {
  AUTH_CODE_LENGTH,
  AUTH_PASSWORD_POLICY,
  AUTH_USER_FIELD_LIMITS,
} from "@/constants/auth/auth.constants";

const RESET_PASSWORD_SCHEMA_MESSAGES = {
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

  newPasswordRequired:
    "La nueva contraseña es obligatoria.",

  newPasswordTooShort:
    `La nueva contraseña debe contener al menos ${AUTH_PASSWORD_POLICY.MINIMUM_LENGTH} caracteres.`,

  newPasswordTooLong:
    `La nueva contraseña no puede superar ${AUTH_PASSWORD_POLICY.MAXIMUM_LENGTH} caracteres.`,

  newPasswordUppercase:
    "La nueva contraseña debe incluir al menos una letra mayúscula.",

  newPasswordLowercase:
    "La nueva contraseña debe incluir al menos una letra minúscula.",

  newPasswordNumber:
    "La nueva contraseña debe incluir al menos un número.",

  newPasswordSpecialCharacter:
    "La nueva contraseña debe incluir al menos un carácter especial.",

  confirmPasswordRequired:
    "Debes repetir la nueva contraseña.",

  passwordsDoNotMatch:
    "Las contraseñas no coinciden.",
} as const;

const PASSWORD_RESET_CODE_PATTERN =
  new RegExp(
    `^\\d{${AUTH_CODE_LENGTH}}$`,
  );

const PASSWORD_RESET_CODE_ALIAS_KEYS = [
  "verificationCode",
  "verification_code",

  "recoveryCode",
  "recovery_code",

  "resetCode",
  "reset_code",

  "passwordResetCode",
  "password_reset_code",
] as const;

const NEW_PASSWORD_ALIAS_KEYS = [
  "password",

  "new_password",

  "passwordNew",
  "password_new",
] as const;

const CONFIRM_PASSWORD_ALIAS_KEYS = [
  "passwordConfirmation",
  "password_confirmation",

  "confirm_password",

  "repeatPassword",
  "repeat_password",

  "repeatedPassword",
  "repeated_password",

  "newPasswordConfirmation",
  "new_password_confirmation",

  "confirmNewPassword",
  "confirm_new_password",
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
 * Permite códigos pegados con espacios
 * o guiones:
 *
 * 123 456
 * 123-456
 *
 * Ambos se convierten en:
 *
 * 123456
 *
 * Los valores numéricos no se convierten
 * porque podrían perder ceros iniciales.
 */
function normalizePasswordResetCodeInput(
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

function deleteAliasKeys(
  source: Record<string, unknown>,
  keys: readonly string[],
): void {
  for (
    const key
    of keys
  ) {
    delete source[key];
  }
}

/*
 * Mantiene como campos canónicos:
 *
 * email
 * code
 * newPassword
 * confirmPassword
 *
 * También conserva compatibilidad con
 * nombres utilizados por formularios anteriores.
 */
function normalizeResetPasswordObject(
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

  if (
    normalizedInput.newPassword ===
    undefined
  ) {
    normalizedInput.newPassword =
      getFirstDefinedValue(
        normalizedInput,
        NEW_PASSWORD_ALIAS_KEYS,
      );
  }

  if (
    normalizedInput.confirmPassword ===
    undefined
  ) {
    normalizedInput.confirmPassword =
      getFirstDefinedValue(
        normalizedInput,
        CONFIRM_PASSWORD_ALIAS_KEYS,
      );
  }

  deleteAliasKeys(
    normalizedInput,
    PASSWORD_RESET_CODE_ALIAS_KEYS,
  );

  deleteAliasKeys(
    normalizedInput,
    NEW_PASSWORD_ALIAS_KEYS,
  );

  deleteAliasKeys(
    normalizedInput,
    CONFIRM_PASSWORD_ALIAS_KEYS,
  );

  return normalizedInput;
}

const recoveryEmailSchema =
  z.preprocess(
    normalizeEmailInput,

    z
      .string({
        error:
          RESET_PASSWORD_SCHEMA_MESSAGES
            .emailRequired,
      })
      .min(
        1,
        RESET_PASSWORD_SCHEMA_MESSAGES
          .emailRequired,
      )
      .max(
        AUTH_USER_FIELD_LIMITS
          .EMAIL_MAXIMUM_LENGTH,
        RESET_PASSWORD_SCHEMA_MESSAGES
          .emailTooLong,
      )
      .email(
        RESET_PASSWORD_SCHEMA_MESSAGES
          .emailInvalid,
      ),
  );

const passwordResetCodeSchema =
  z.preprocess(
    normalizePasswordResetCodeInput,

    z
      .string({
        error:
          RESET_PASSWORD_SCHEMA_MESSAGES
            .codeRequired,
      })
      .min(
        1,
        RESET_PASSWORD_SCHEMA_MESSAGES
          .codeRequired,
      )
      .regex(
        PASSWORD_RESET_CODE_PATTERN,
        RESET_PASSWORD_SCHEMA_MESSAGES
          .codeInvalid,
      ),
  );

/*
 * La contraseña no se recorta ni se transforma.
 *
 * Un espacio podría formar parte legítima
 * de la contraseña establecida por el usuario.
 */
const newPasswordSchema =
  z
    .string({
      error:
        RESET_PASSWORD_SCHEMA_MESSAGES
          .newPasswordRequired,
    })
    .min(
      1,
      RESET_PASSWORD_SCHEMA_MESSAGES
        .newPasswordRequired,
    )
    .min(
      AUTH_PASSWORD_POLICY
        .MINIMUM_LENGTH,
      RESET_PASSWORD_SCHEMA_MESSAGES
        .newPasswordTooShort,
    )
    .max(
      AUTH_PASSWORD_POLICY
        .MAXIMUM_LENGTH,
      RESET_PASSWORD_SCHEMA_MESSAGES
        .newPasswordTooLong,
    )
    .superRefine(
      (
        password,
        context,
      ) => {
        if (
          password.length ===
          0
        ) {
          return;
        }

        if (
          AUTH_PASSWORD_POLICY
            .REQUIRE_UPPERCASE &&
          !/[A-Z]/.test(
            password,
          )
        ) {
          context.addIssue({
            code:
              "custom",

            message:
              RESET_PASSWORD_SCHEMA_MESSAGES
                .newPasswordUppercase,
          });
        }

        if (
          AUTH_PASSWORD_POLICY
            .REQUIRE_LOWERCASE &&
          !/[a-z]/.test(
            password,
          )
        ) {
          context.addIssue({
            code:
              "custom",

            message:
              RESET_PASSWORD_SCHEMA_MESSAGES
                .newPasswordLowercase,
          });
        }

        if (
          AUTH_PASSWORD_POLICY
            .REQUIRE_NUMBER &&
          !/\d/.test(
            password,
          )
        ) {
          context.addIssue({
            code:
              "custom",

            message:
              RESET_PASSWORD_SCHEMA_MESSAGES
                .newPasswordNumber,
          });
        }

        if (
          AUTH_PASSWORD_POLICY
            .REQUIRE_SPECIAL_CHARACTER &&
          !/[^A-Za-z0-9]/.test(
            password,
          )
        ) {
          context.addIssue({
            code:
              "custom",

            message:
              RESET_PASSWORD_SCHEMA_MESSAGES
                .newPasswordSpecialCharacter,
          });
        }
      },
    );

const resetPasswordObjectSchema =
  z
    .strictObject({
      email:
        recoveryEmailSchema,

      code:
        passwordResetCodeSchema,

      newPassword:
        newPasswordSchema,

      confirmPassword:
        z
          .string({
            error:
              RESET_PASSWORD_SCHEMA_MESSAGES
                .confirmPasswordRequired,
          })
          .min(
            1,
            RESET_PASSWORD_SCHEMA_MESSAGES
              .confirmPasswordRequired,
          )
          .max(
            AUTH_PASSWORD_POLICY
              .MAXIMUM_LENGTH,
            RESET_PASSWORD_SCHEMA_MESSAGES
              .newPasswordTooLong,
          ),
    })
    .superRefine(
      (
        data,
        context,
      ) => {
        if (
          data.newPassword !==
          data.confirmPassword
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "confirmPassword",
            ],

            message:
              RESET_PASSWORD_SCHEMA_MESSAGES
                .passwordsDoNotMatch,
          });
        }
      },
    );

export const resetPasswordSchema =
  z.preprocess(
    normalizeResetPasswordObject,
    resetPasswordObjectSchema,
  );

export type ResetPasswordSchemaInput =
  z.input<
    typeof resetPasswordSchema
  >;

export type ResetPasswordSchemaOutput =
  z.output<
    typeof resetPasswordSchema
  >;

export type ResetPasswordInput =
  ResetPasswordSchemaOutput;

export type ResetPasswordData =
  ResetPasswordSchemaOutput;

export function parseResetPasswordInput(
  input: unknown,
): ResetPasswordSchemaOutput {
  return resetPasswordSchema.parse(
    input,
  );
}

export function safeParseResetPasswordInput(
  input: unknown,
) {
  return resetPasswordSchema.safeParse(
    input,
  );
}

/*
 * Alias compatibles con rutas y servicios.
 */
export const passwordResetSchema =
  resetPasswordSchema;

export const changeRecoveredPasswordSchema =
  resetPasswordSchema;

export const restorePasswordSchema =
  resetPasswordSchema;
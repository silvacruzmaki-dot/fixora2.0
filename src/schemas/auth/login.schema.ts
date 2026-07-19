import { z } from "zod";

import {
  AUTH_PASSWORD_POLICY,
  AUTH_USER_FIELD_LIMITS,
} from "@/constants/auth/auth.constants";

const LOGIN_SCHEMA_MESSAGES = {
  emailRequired:
    "El correo electrónico es obligatorio.",

  emailInvalid:
    "Ingresa un correo electrónico válido.",

  emailTooLong:
    `El correo electrónico no puede superar ${AUTH_USER_FIELD_LIMITS.EMAIL_MAXIMUM_LENGTH} caracteres.`,

  passwordRequired:
    "La contraseña es obligatoria.",

  passwordTooLong:
    `La contraseña no puede superar ${AUTH_PASSWORD_POLICY.MAXIMUM_LENGTH} caracteres.`,

  rememberMeInvalid:
    "El valor de recordar sesión no es válido.",
} as const;

/**
 * Normaliza el correo antes de validarlo:
 *
 * - Elimina espacios al inicio y al final.
 * - Convierte todos los caracteres a minúsculas.
 */
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

/**
 * Normaliza el campo rememberMe.
 *
 * Valores admitidos:
 *
 * - true
 * - false
 * - "true"
 * - "false"
 * - "1"
 * - "0"
 *
 * Cuando no se envía ningún valor, se utiliza false.
 */
function normalizeRememberMeInput(
  value: unknown,
): unknown {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return false;
  }

  if (
    value === true ||
    value === false
  ) {
    return value;
  }

  if (
    typeof value ===
    "string"
  ) {
    const normalizedValue =
      value
        .trim()
        .toLowerCase();

    if (
      normalizedValue ===
        "true" ||
      normalizedValue ===
        "1"
    ) {
      return true;
    }

    if (
      normalizedValue ===
        "false" ||
      normalizedValue ===
        "0"
    ) {
      return false;
    }
  }

  return value;
}

/**
 * Esquema para iniciar sesión.
 *
 * Recibe:
 *
 * - email
 * - password
 * - rememberMe
 *
 * z.strictObject impide que la solicitud contenga
 * propiedades adicionales no definidas.
 */
export const loginSchema =
  z.strictObject({
    email:
      z.preprocess(
        normalizeEmailInput,

        z
          .string({
            error:
              LOGIN_SCHEMA_MESSAGES
                .emailRequired,
          })
          .min(
            1,
            LOGIN_SCHEMA_MESSAGES
              .emailRequired,
          )
          .max(
            AUTH_USER_FIELD_LIMITS
              .EMAIL_MAXIMUM_LENGTH,
            LOGIN_SCHEMA_MESSAGES
              .emailTooLong,
          )
          .email(
            LOGIN_SCHEMA_MESSAGES
              .emailInvalid,
          ),
      ),

    /*
     * La contraseña no se recorta, normaliza
     * ni transforma.
     *
     * Los espacios pueden formar parte de la
     * contraseña original del usuario.
     */
    password:
      z
        .string({
          error:
            LOGIN_SCHEMA_MESSAGES
              .passwordRequired,
        })
        .min(
          1,
          LOGIN_SCHEMA_MESSAGES
            .passwordRequired,
        )
        .max(
          AUTH_PASSWORD_POLICY
            .MAXIMUM_LENGTH,
          LOGIN_SCHEMA_MESSAGES
            .passwordTooLong,
        ),

    rememberMe:
      z
        .preprocess(
          normalizeRememberMeInput,

          z.boolean({
            error:
              LOGIN_SCHEMA_MESSAGES
                .rememberMeInvalid,
          }),
        )
        .default(false),
  });

export type LoginSchemaInput =
  z.input<
    typeof loginSchema
  >;

export type LoginSchemaOutput =
  z.output<
    typeof loginSchema
  >;

export type LoginInput =
  LoginSchemaOutput;

export type LoginData =
  LoginSchemaOutput;

export function parseLoginInput(
  input: unknown,
): LoginSchemaOutput {
  return loginSchema.parse(
    input,
  );
}

export function safeParseLoginInput(
  input: unknown,
) {
  return loginSchema.safeParse(
    input,
  );
}
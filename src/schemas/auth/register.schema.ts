import { z } from "zod";

import {
  AUTH_PASSWORD_POLICY,
  AUTH_USER_FIELD_LIMITS,
} from "@/constants/auth/auth.constants";

const REGISTER_SCHEMA_MESSAGES = {
  firstNameRequired:
    "Los nombres son obligatorios.",

  firstNameTooShort:
    `Los nombres deben contener al menos ${AUTH_USER_FIELD_LIMITS.FIRST_NAME_MINIMUM_LENGTH} caracteres.`,

  firstNameTooLong:
    `Los nombres no pueden superar ${AUTH_USER_FIELD_LIMITS.FIRST_NAME_MAXIMUM_LENGTH} caracteres.`,

  firstNameInvalid:
    "Los nombres contienen caracteres no permitidos.",

  lastNameRequired:
    "Los apellidos son obligatorios.",

  lastNameTooShort:
    `Los apellidos deben contener al menos ${AUTH_USER_FIELD_LIMITS.LAST_NAME_MINIMUM_LENGTH} caracteres.`,

  lastNameTooLong:
    `Los apellidos no pueden superar ${AUTH_USER_FIELD_LIMITS.LAST_NAME_MAXIMUM_LENGTH} caracteres.`,

  lastNameInvalid:
    "Los apellidos contienen caracteres no permitidos.",

  displayNameRequired:
    "El nombre visible es obligatorio.",

  displayNameTooShort:
    `El nombre visible debe contener al menos ${AUTH_USER_FIELD_LIMITS.DISPLAY_NAME_MINIMUM_LENGTH} caracteres.`,

  displayNameTooLong:
    `El nombre visible no puede superar ${AUTH_USER_FIELD_LIMITS.DISPLAY_NAME_MAXIMUM_LENGTH} caracteres.`,

  displayNameInvalid:
    "El nombre visible contiene caracteres no permitidos.",

  emailRequired:
    "El correo electrónico es obligatorio.",

  emailInvalid:
    "Ingresa un correo electrónico válido.",

  emailTooLong:
    `El correo electrónico no puede superar ${AUTH_USER_FIELD_LIMITS.EMAIL_MAXIMUM_LENGTH} caracteres.`,

  passwordRequired:
    "La contraseña es obligatoria.",

  passwordTooShort:
    `La contraseña debe contener al menos ${AUTH_PASSWORD_POLICY.MINIMUM_LENGTH} caracteres.`,

  passwordTooLong:
    `La contraseña no puede superar ${AUTH_PASSWORD_POLICY.MAXIMUM_LENGTH} caracteres.`,

  passwordUppercase:
    "La contraseña debe incluir al menos una letra mayúscula.",

  passwordLowercase:
    "La contraseña debe incluir al menos una letra minúscula.",

  passwordNumber:
    "La contraseña debe incluir al menos un número.",

  passwordSpecialCharacter:
    "La contraseña debe incluir al menos un carácter especial.",

  confirmPasswordRequired:
    "Debes repetir la contraseña.",

  passwordsDoNotMatch:
    "Las contraseñas no coinciden.",

  termsAndPrivacyRequired:
    "Debes aceptar los términos y la política de privacidad.",

  termsAndPrivacyInvalid:
    "La aceptación de los términos y la privacidad no es válida.",
} as const;

const PERSON_NAME_PATTERN =
  /^[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*$/u;

const DISPLAY_NAME_PATTERN =
  /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} .,'’_-]*$/u;

const CONSENT_ALIAS_KEYS = [
  "acceptedTermsAndPrivacy",
  "acceptedTerms",
  "acceptTerms",
  "termsAccepted",
  "acceptedPrivacy",
  "acceptPrivacy",
  "privacyAccepted",
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

function normalizeTextInput(
  value: unknown,
): unknown {
  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  return value
    .replace(
      /[\r\n\t]+/g,
      " ",
    )
    .trim()
    .replace(
      /\s+/g,
      " ",
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

function normalizeBooleanInput(
  value: unknown,
): unknown {
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

  if (value === 1) {
    return true;
  }

  if (value === 0) {
    return false;
  }

  return value;
}

function getFirstDefinedValue(
  source: Record<string, unknown>,
  keys: readonly string[],
): unknown {
  for (const key of keys) {
    if (
      source[key] !==
      undefined
    ) {
      return source[key];
    }
  }

  return undefined;
}

/**
 * Mantiene un único campo canónico:
 *
 * acceptTermsAndPrivacy
 *
 * También admite nombres equivalentes utilizados
 * por formularios anteriores.
 */
function normalizeRegisterObject(
  input: unknown,
): unknown {
  if (!isPlainObject(input)) {
    return input;
  }

  const normalizedInput:
    Record<string, unknown> = {
    ...input,
  };

  if (
    normalizedInput
      .acceptTermsAndPrivacy ===
    undefined
  ) {
    const combinedConsent =
      normalizedInput
        .acceptedTermsAndPrivacy;

    const termsConsent =
      getFirstDefinedValue(
        normalizedInput,
        [
          "acceptedTerms",
          "acceptTerms",
          "termsAccepted",
        ],
      );

    const privacyConsent =
      getFirstDefinedValue(
        normalizedInput,
        [
          "acceptedPrivacy",
          "acceptPrivacy",
          "privacyAccepted",
        ],
      );

    if (
      combinedConsent !==
      undefined
    ) {
      normalizedInput
        .acceptTermsAndPrivacy =
        combinedConsent;
    } else if (
      termsConsent !==
        undefined &&
      privacyConsent !==
        undefined
    ) {
      const normalizedTerms =
        normalizeBooleanInput(
          termsConsent,
        );

      const normalizedPrivacy =
        normalizeBooleanInput(
          privacyConsent,
        );

      if (
        typeof normalizedTerms ===
          "boolean" &&
        typeof normalizedPrivacy ===
          "boolean"
      ) {
        normalizedInput
          .acceptTermsAndPrivacy =
          normalizedTerms &&
          normalizedPrivacy;
      } else {
        normalizedInput
          .acceptTermsAndPrivacy =
          false;
      }
    } else if (
      termsConsent !==
      undefined
    ) {
      normalizedInput
        .acceptTermsAndPrivacy =
        termsConsent;
    } else if (
      privacyConsent !==
      undefined
    ) {
      normalizedInput
        .acceptTermsAndPrivacy =
        privacyConsent;
    }
  }

  for (
    const aliasKey
    of CONSENT_ALIAS_KEYS
  ) {
    delete normalizedInput[
      aliasKey
    ];
  }

  return normalizedInput;
}

const personNameSchema = (
  field:
    | "firstName"
    | "lastName",
) => {
  const isFirstName =
    field === "firstName";

  const minimumLength =
    isFirstName
      ? AUTH_USER_FIELD_LIMITS
          .FIRST_NAME_MINIMUM_LENGTH
      : AUTH_USER_FIELD_LIMITS
          .LAST_NAME_MINIMUM_LENGTH;

  const maximumLength =
    isFirstName
      ? AUTH_USER_FIELD_LIMITS
          .FIRST_NAME_MAXIMUM_LENGTH
      : AUTH_USER_FIELD_LIMITS
          .LAST_NAME_MAXIMUM_LENGTH;

  return z.preprocess(
    normalizeTextInput,

    z
      .string({
        error:
          isFirstName
            ? REGISTER_SCHEMA_MESSAGES
                .firstNameRequired
            : REGISTER_SCHEMA_MESSAGES
                .lastNameRequired,
      })
      .min(
        1,
        isFirstName
          ? REGISTER_SCHEMA_MESSAGES
              .firstNameRequired
          : REGISTER_SCHEMA_MESSAGES
              .lastNameRequired,
      )
      .min(
        minimumLength,
        isFirstName
          ? REGISTER_SCHEMA_MESSAGES
              .firstNameTooShort
          : REGISTER_SCHEMA_MESSAGES
              .lastNameTooShort,
      )
      .max(
        maximumLength,
        isFirstName
          ? REGISTER_SCHEMA_MESSAGES
              .firstNameTooLong
          : REGISTER_SCHEMA_MESSAGES
              .lastNameTooLong,
      )
      .regex(
        PERSON_NAME_PATTERN,
        isFirstName
          ? REGISTER_SCHEMA_MESSAGES
              .firstNameInvalid
          : REGISTER_SCHEMA_MESSAGES
              .lastNameInvalid,
      ),
  );
};

const passwordSchema =
  z
    .string({
      error:
        REGISTER_SCHEMA_MESSAGES
          .passwordRequired,
    })
    .min(
      1,
      REGISTER_SCHEMA_MESSAGES
        .passwordRequired,
    )
    .min(
      AUTH_PASSWORD_POLICY
        .MINIMUM_LENGTH,
      REGISTER_SCHEMA_MESSAGES
        .passwordTooShort,
    )
    .max(
      AUTH_PASSWORD_POLICY
        .MAXIMUM_LENGTH,
      REGISTER_SCHEMA_MESSAGES
        .passwordTooLong,
    )
    .superRefine(
      (
        password,
        context,
      ) => {
        if (
          password.length === 0
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
            code: "custom",

            message:
              REGISTER_SCHEMA_MESSAGES
                .passwordUppercase,
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
            code: "custom",

            message:
              REGISTER_SCHEMA_MESSAGES
                .passwordLowercase,
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
            code: "custom",

            message:
              REGISTER_SCHEMA_MESSAGES
                .passwordNumber,
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
            code: "custom",

            message:
              REGISTER_SCHEMA_MESSAGES
                .passwordSpecialCharacter,
          });
        }
      },
    );

const registerObjectSchema =
  z
    .strictObject({
      firstName:
        personNameSchema(
          "firstName",
        ),

      lastName:
        personNameSchema(
          "lastName",
        ),

      displayName:
        z.preprocess(
          normalizeTextInput,

          z
            .string({
              error:
                REGISTER_SCHEMA_MESSAGES
                  .displayNameRequired,
            })
            .min(
              1,
              REGISTER_SCHEMA_MESSAGES
                .displayNameRequired,
            )
            .min(
              AUTH_USER_FIELD_LIMITS
                .DISPLAY_NAME_MINIMUM_LENGTH,
              REGISTER_SCHEMA_MESSAGES
                .displayNameTooShort,
            )
            .max(
              AUTH_USER_FIELD_LIMITS
                .DISPLAY_NAME_MAXIMUM_LENGTH,
              REGISTER_SCHEMA_MESSAGES
                .displayNameTooLong,
            )
            .regex(
              DISPLAY_NAME_PATTERN,
              REGISTER_SCHEMA_MESSAGES
                .displayNameInvalid,
            ),
        ),

      email:
        z.preprocess(
          normalizeEmailInput,

          z
            .string({
              error:
                REGISTER_SCHEMA_MESSAGES
                  .emailRequired,
            })
            .min(
              1,
              REGISTER_SCHEMA_MESSAGES
                .emailRequired,
            )
            .max(
              AUTH_USER_FIELD_LIMITS
                .EMAIL_MAXIMUM_LENGTH,
              REGISTER_SCHEMA_MESSAGES
                .emailTooLong,
            )
            .email(
              REGISTER_SCHEMA_MESSAGES
                .emailInvalid,
            ),
        ),

      /*
       * Las contraseñas no se recortan,
       * normalizan ni transforman porque
       * los espacios pueden ser parte del valor.
       */
      password:
        passwordSchema,

      confirmPassword:
        z
          .string({
            error:
              REGISTER_SCHEMA_MESSAGES
                .confirmPasswordRequired,
          })
          .min(
            1,
            REGISTER_SCHEMA_MESSAGES
              .confirmPasswordRequired,
          )
          .max(
            AUTH_PASSWORD_POLICY
              .MAXIMUM_LENGTH,
            REGISTER_SCHEMA_MESSAGES
              .passwordTooLong,
          ),

      acceptTermsAndPrivacy:
        z
          .preprocess(
            normalizeBooleanInput,

            z.boolean({
              error:
                REGISTER_SCHEMA_MESSAGES
                  .termsAndPrivacyInvalid,
            }),
          )
          .refine(
            (
              accepted,
            ) =>
              accepted ===
              true,
            {
              message:
                REGISTER_SCHEMA_MESSAGES
                  .termsAndPrivacyRequired,
            },
          ),
    })
    .superRefine(
      (
        data,
        context,
      ) => {
        if (
          data.password !==
          data.confirmPassword
        ) {
          context.addIssue({
            code: "custom",

            path: [
              "confirmPassword",
            ],

            message:
              REGISTER_SCHEMA_MESSAGES
                .passwordsDoNotMatch,
          });
        }
      },
    );

export const registerSchema =
  z.preprocess(
    normalizeRegisterObject,
    registerObjectSchema,
  );

export type RegisterSchemaInput =
  z.input<
    typeof registerSchema
  >;

export type RegisterSchemaOutput =
  z.output<
    typeof registerSchema
  >;

export type RegisterInput =
  RegisterSchemaOutput;

export type RegisterData =
  RegisterSchemaOutput;

export function parseRegisterInput(
  input: unknown,
): RegisterSchemaOutput {
  return registerSchema.parse(
    input,
  );
}

export function safeParseRegisterInput(
  input: unknown,
) {
  return registerSchema.safeParse(
    input,
  );
}
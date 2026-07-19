import {
  AUTH_EMAIL_POLICY,
  AUTH_USER_FIELD_LIMITS,
} from "@/constants/auth/auth.constants";

export type EmailMaskErrorCode =
  | "EMAIL_REQUIRED"
  | "EMAIL_INVALID"
  | "MASK_CHARACTER_INVALID";

export interface EmailMaskOptions {
  visibleLocalPrefixCharacters?: number;

  visibleLocalSuffixCharacters?: number;

  visibleDomainCharacters?: number;

  maskDomain?: boolean;

  preserveTopLevelDomain?: boolean;

  maskCharacter?: string;

  minimumMaskCharacters?: number;
}

export interface ParsedEmailAddress {
  normalizedEmail: string;

  localPart: string;
  domain: string;

  domainLabels: string[];

  topLevelDomain: string | null;
}

export class EmailMaskError extends Error {
  readonly code: EmailMaskErrorCode;

  constructor(
    code: EmailMaskErrorCode,
    message: string,
  ) {
    super(message);

    this.name =
      "EmailMaskError";

    this.code =
      code;
  }
}

const EMAIL_LOCAL_PART_MAXIMUM_LENGTH =
  64;

const EMAIL_DOMAIN_MAXIMUM_LENGTH =
  253;

const EMAIL_LOCAL_PART_PATTERN =
  /^[^\s@]+$/;

const EMAIL_DOMAIN_LABEL_PATTERN =
  /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

function normalizeVisibleCharacterCount(
  value: number | undefined,
  defaultValue: number,
): number {
  if (
    value === undefined
  ) {
    return defaultValue;
  }

  if (
    !Number.isFinite(value)
  ) {
    return defaultValue;
  }

  return Math.max(
    0,
    Math.floor(value),
  );
}

function normalizeMinimumMaskCharacters(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 3;
  }

  return Math.max(
    1,
    Math.min(
      20,
      Math.floor(value),
    ),
  );
}

function normalizeMaskCharacter(
  value: string | undefined,
): string {
  const maskCharacter =
    value ?? "*";

  if (
    maskCharacter.length !== 1 ||
    /\s/.test(maskCharacter) ||
    maskCharacter === "@"
  ) {
    throw new EmailMaskError(
      "MASK_CHARACTER_INVALID",
      "El carácter utilizado para ocultar el correo debe contener un solo símbolo visible.",
    );
  }

  return maskCharacter;
}

function maskSegment(
  value: string,
  {
    visiblePrefixCharacters,
    visibleSuffixCharacters,
    maskCharacter,
    minimumMaskCharacters,
  }: {
    visiblePrefixCharacters: number;

    visibleSuffixCharacters: number;

    maskCharacter: string;

    minimumMaskCharacters: number;
  },
): string {
  if (!value) {
    return maskCharacter.repeat(
      minimumMaskCharacters,
    );
  }

  const safePrefixLength =
    Math.min(
      visiblePrefixCharacters,
      value.length,
    );

  const maximumSuffixLength =
    Math.max(
      0,
      value.length -
        safePrefixLength,
    );

  const safeSuffixLength =
    Math.min(
      visibleSuffixCharacters,
      maximumSuffixLength,
    );

  const visiblePrefix =
    value.slice(
      0,
      safePrefixLength,
    );

  const visibleSuffix =
    safeSuffixLength > 0
      ? value.slice(
          value.length -
            safeSuffixLength,
        )
      : "";

  const hiddenCharacterCount =
    Math.max(
      minimumMaskCharacters,
      value.length -
        safePrefixLength -
        safeSuffixLength,
    );

  return [
    visiblePrefix,

    maskCharacter.repeat(
      hiddenCharacterCount,
    ),

    visibleSuffix,
  ].join("");
}

function isValidDomainLabel(
  label: string,
): boolean {
  if (
    label.length === 0 ||
    label.length > 63
  ) {
    return false;
  }

  /*
   * Se aceptan dominios internacionalizados después
   * de que hayan sido convertidos a su representación
   * ASCII, por ejemplo xn--...
   */
  return EMAIL_DOMAIN_LABEL_PATTERN.test(
    label,
  );
}

export function normalizeEmailAddress(
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

export function parseEmailAddress(
  email: unknown,
): ParsedEmailAddress | null {
  const normalizedEmail =
    normalizeEmailAddress(
      email,
    );

  if (
    !normalizedEmail ||
    normalizedEmail.length >
      AUTH_USER_FIELD_LIMITS.EMAIL_MAXIMUM_LENGTH
  ) {
    return null;
  }

  const firstAtIndex =
    normalizedEmail.indexOf(
      "@",
    );

  const lastAtIndex =
    normalizedEmail.lastIndexOf(
      "@",
    );

  if (
    firstAtIndex <= 0 ||
    firstAtIndex !==
      lastAtIndex ||
    firstAtIndex ===
      normalizedEmail.length -
        1
  ) {
    return null;
  }

  const localPart =
    normalizedEmail.slice(
      0,
      firstAtIndex,
    );

  const domain =
    normalizedEmail.slice(
      firstAtIndex + 1,
    );

  if (
    localPart.length === 0 ||
    localPart.length >
      EMAIL_LOCAL_PART_MAXIMUM_LENGTH ||
    !EMAIL_LOCAL_PART_PATTERN.test(
      localPart,
    )
  ) {
    return null;
  }

  if (
    domain.length === 0 ||
    domain.length >
      EMAIL_DOMAIN_MAXIMUM_LENGTH ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.includes("..")
  ) {
    return null;
  }

  const domainLabels =
    domain.split(".");

  if (
    domainLabels.length < 2 ||
    !domainLabels.every(
      isValidDomainLabel,
    )
  ) {
    return null;
  }

  const topLevelDomain =
    domainLabels.at(-1) ??
    null;

  if (
    !topLevelDomain ||
    topLevelDomain.length < 2
  ) {
    return null;
  }

  return {
    normalizedEmail,

    localPart,
    domain,

    domainLabels,

    topLevelDomain,
  };
}

export function isMaskableEmailAddress(
  email: unknown,
): email is string {
  return (
    parseEmailAddress(
      email,
    ) !== null
  );
}

export function assertMaskableEmailAddress(
  email: unknown,
): asserts email is string {
  if (
    typeof email !==
      "string" ||
    email.trim().length === 0
  ) {
    throw new EmailMaskError(
      "EMAIL_REQUIRED",
      "El correo electrónico es obligatorio.",
    );
  }

  if (
    !parseEmailAddress(
      email,
    )
  ) {
    throw new EmailMaskError(
      "EMAIL_INVALID",
      "El correo electrónico tiene un formato inválido.",
    );
  }
}

function maskEmailDomain(
  parsedEmail:
    ParsedEmailAddress,
  {
    visibleDomainCharacters,
    preserveTopLevelDomain,
    maskCharacter,
    minimumMaskCharacters,
  }: {
    visibleDomainCharacters: number;

    preserveTopLevelDomain: boolean;

    maskCharacter: string;

    minimumMaskCharacters: number;
  },
): string {
  const lastLabelIndex =
    parsedEmail.domainLabels.length -
    1;

  return parsedEmail.domainLabels
    .map(
      (
        label,
        index,
      ) => {
        const isTopLevelDomain =
          index ===
          lastLabelIndex;

        if (
          isTopLevelDomain &&
          preserveTopLevelDomain
        ) {
          return label;
        }

        return maskSegment(
          label,
          {
            visiblePrefixCharacters:
              visibleDomainCharacters,

            visibleSuffixCharacters:
              0,

            maskCharacter,

            minimumMaskCharacters,
          },
        );
      },
    )
    .join(".");
}

/**
 * Enmascara un correo antes de devolverlo al navegador.
 *
 * Ejemplo predeterminado:
 *
 * usuario@correo.com
 * u******@******.com
 */
export function maskEmailAddress(
  email: string,
  {
    visibleLocalPrefixCharacters =
      AUTH_EMAIL_POLICY.MASK_VISIBLE_PREFIX_CHARACTERS,

    visibleLocalSuffixCharacters =
      0,

    visibleDomainCharacters =
      AUTH_EMAIL_POLICY.MASK_VISIBLE_DOMAIN_CHARACTERS,

    maskDomain = true,

    preserveTopLevelDomain = true,

    maskCharacter:
      requestedMaskCharacter,

    minimumMaskCharacters:
      requestedMinimumMaskCharacters,
  }: EmailMaskOptions = {},
): string {
  const parsedEmail =
    parseEmailAddress(
      email,
    );

  if (!parsedEmail) {
    assertMaskableEmailAddress(
      email,
    );

    throw new EmailMaskError(
      "EMAIL_INVALID",
      "El correo electrónico tiene un formato inválido.",
    );
  }

  const maskCharacter =
    normalizeMaskCharacter(
      requestedMaskCharacter,
    );

  const minimumMaskCharacters =
    normalizeMinimumMaskCharacters(
      requestedMinimumMaskCharacters,
    );

  const visibleLocalPrefix =
    normalizeVisibleCharacterCount(
      visibleLocalPrefixCharacters,
      AUTH_EMAIL_POLICY.MASK_VISIBLE_PREFIX_CHARACTERS,
    );

  const visibleLocalSuffix =
    normalizeVisibleCharacterCount(
      visibleLocalSuffixCharacters,
      0,
    );

  const visibleDomainPrefix =
    normalizeVisibleCharacterCount(
      visibleDomainCharacters,
      AUTH_EMAIL_POLICY.MASK_VISIBLE_DOMAIN_CHARACTERS,
    );

  const maskedLocalPart =
    maskSegment(
      parsedEmail.localPart,
      {
        visiblePrefixCharacters:
          visibleLocalPrefix,

        visibleSuffixCharacters:
          visibleLocalSuffix,

        maskCharacter,

        minimumMaskCharacters,
      },
    );

  const maskedDomain =
    maskDomain
      ? maskEmailDomain(
          parsedEmail,
          {
            visibleDomainCharacters:
              visibleDomainPrefix,

            preserveTopLevelDomain,

            maskCharacter,

            minimumMaskCharacters,
          },
        )
      : parsedEmail.domain;

  return `${maskedLocalPart}@${maskedDomain}`;
}

/**
 * Variante segura para datos opcionales.
 *
 * Devuelve null cuando el correo no es válido.
 */
export function tryMaskEmailAddress(
  email: unknown,
  options:
    EmailMaskOptions = {},
): string | null {
  const parsedEmail =
    parseEmailAddress(
      email,
    );

  if (!parsedEmail) {
    return null;
  }

  try {
    return maskEmailAddress(
      parsedEmail.normalizedEmail,
      options,
    );
  } catch {
    return null;
  }
}

/**
 * Variante que nunca lanza errores.
 *
 * Cuando el correo no puede procesarse devuelve
 * el texto de respaldo indicado.
 */
export function safeMaskEmailAddress(
  email: unknown,
  fallback = "***@***",
  options:
    EmailMaskOptions = {},
): string {
  return (
    tryMaskEmailAddress(
      email,
      options,
    ) ??
    fallback
  );
}

/**
 * Alias utilizado por los servicios de autenticación.
 */
export const maskEmail =
  maskEmailAddress;

/**
 * Alias seguro para respuestas públicas.
 */
export const safeMaskEmail =
  safeMaskEmailAddress;
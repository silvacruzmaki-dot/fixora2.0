import * as argon2 from "argon2";

import {
  AUTH_PASSWORD_HASH_OPTIONS,
  AUTH_PASSWORD_POLICY,
} from "@/constants/auth/auth.constants";

export type PasswordPolicyErrorCode =
  | "PASSWORD_REQUIRED"
  | "PASSWORD_TOO_SHORT"
  | "PASSWORD_TOO_LONG"
  | "PASSWORD_TOO_MANY_BYTES"
  | "PASSWORD_MISSING_UPPERCASE"
  | "PASSWORD_MISSING_LOWERCASE"
  | "PASSWORD_MISSING_NUMBER"
  | "PASSWORD_MISSING_SPECIAL_CHARACTER";

export interface PasswordRequirementState {
  minimumLength: boolean;
  maximumLength: boolean;
  maximumBytes: boolean;

  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialCharacter: boolean;
}

export interface PasswordPolicyValidationResult {
  isValid: boolean;

  errors: PasswordPolicyErrorCode[];

  requirements: PasswordRequirementState;

  characterLength: number;
  byteLength: number;
}

export interface PasswordVerificationResult {
  matches: boolean;
  needsRehash: boolean;
}

/*
 * node-argon2 acepta los valores:
 * 0 = argon2d
 * 1 = argon2i
 * 2 = argon2id
 *
 * La conversión evita que TypeScript amplíe el valor
 * de argon2id al tipo genérico number.
 */
const ARGON2_HASH_OPTIONS = {
  type: argon2.argon2id as 0 | 1 | 2,

  memoryCost:
    AUTH_PASSWORD_HASH_OPTIONS.MEMORY_COST,

  timeCost:
    AUTH_PASSWORD_HASH_OPTIONS.TIME_COST,

  parallelism:
    AUTH_PASSWORD_HASH_OPTIONS.PARALLELISM,

  hashLength:
    AUTH_PASSWORD_HASH_OPTIONS.HASH_LENGTH,
};

const ARGON2_REHASH_OPTIONS = {
  memoryCost:
    AUTH_PASSWORD_HASH_OPTIONS.MEMORY_COST,

  timeCost:
    AUTH_PASSWORD_HASH_OPTIONS.TIME_COST,

  parallelism:
    AUTH_PASSWORD_HASH_OPTIONS.PARALLELISM,
};

export class PasswordPolicyError extends Error {
  readonly codes:
    PasswordPolicyErrorCode[];

  readonly validation:
    PasswordPolicyValidationResult;

  constructor(
    validation:
      PasswordPolicyValidationResult,
  ) {
    super(
      "La contraseña no cumple con la política de seguridad.",
    );

    this.name =
      "PasswordPolicyError";

    this.codes =
      validation.errors;

    this.validation =
      validation;
  }
}

function getPasswordByteLength(
  password: string,
): number {
  return Buffer.byteLength(
    password,
    "utf8",
  );
}

export function evaluatePasswordPolicy(
  password: unknown,
): PasswordPolicyValidationResult {
  if (
    typeof password !==
    "string"
  ) {
    return {
      isValid: false,

      errors: [
        "PASSWORD_REQUIRED",
      ],

      requirements: {
        minimumLength: false,
        maximumLength: false,
        maximumBytes: false,

        uppercase: false,
        lowercase: false,
        number: false,
        specialCharacter: false,
      },

      characterLength: 0,
      byteLength: 0,
    };
  }

  const characterLength =
    password.length;

  const byteLength =
    getPasswordByteLength(
      password,
    );

  const requirements:
    PasswordRequirementState = {
    minimumLength:
      characterLength >=
      AUTH_PASSWORD_POLICY.MINIMUM_LENGTH,

    maximumLength:
      characterLength <=
      AUTH_PASSWORD_POLICY.MAXIMUM_LENGTH,

    maximumBytes:
      byteLength <=
      AUTH_PASSWORD_POLICY.MAXIMUM_HASH_INPUT_BYTES,

    uppercase:
      !AUTH_PASSWORD_POLICY.REQUIRE_UPPERCASE ||
      /[A-Z]/.test(
        password,
      ),

    lowercase:
      !AUTH_PASSWORD_POLICY.REQUIRE_LOWERCASE ||
      /[a-z]/.test(
        password,
      ),

    number:
      !AUTH_PASSWORD_POLICY.REQUIRE_NUMBER ||
      /\d/.test(
        password,
      ),

    specialCharacter:
      !AUTH_PASSWORD_POLICY.REQUIRE_SPECIAL_CHARACTER ||
      /[^A-Za-z0-9]/.test(
        password,
      ),
  };

  const errors:
    PasswordPolicyErrorCode[] = [];

  if (
    password.length === 0
  ) {
    errors.push(
      "PASSWORD_REQUIRED",
    );
  }

  if (
    !requirements.minimumLength
  ) {
    errors.push(
      "PASSWORD_TOO_SHORT",
    );
  }

  if (
    !requirements.maximumLength
  ) {
    errors.push(
      "PASSWORD_TOO_LONG",
    );
  }

  if (
    !requirements.maximumBytes
  ) {
    errors.push(
      "PASSWORD_TOO_MANY_BYTES",
    );
  }

  if (
    !requirements.uppercase
  ) {
    errors.push(
      "PASSWORD_MISSING_UPPERCASE",
    );
  }

  if (
    !requirements.lowercase
  ) {
    errors.push(
      "PASSWORD_MISSING_LOWERCASE",
    );
  }

  if (
    !requirements.number
  ) {
    errors.push(
      "PASSWORD_MISSING_NUMBER",
    );
  }

  if (
    !requirements.specialCharacter
  ) {
    errors.push(
      "PASSWORD_MISSING_SPECIAL_CHARACTER",
    );
  }

  return {
    isValid:
      errors.length === 0,

    errors,
    requirements,

    characterLength,
    byteLength,
  };
}

export function assertValidPassword(
  password: unknown,
): asserts password is string {
  const validation =
    evaluatePasswordPolicy(
      password,
    );

  if (!validation.isValid) {
    throw new PasswordPolicyError(
      validation,
    );
  }
}

export function isPasswordValid(
  password: unknown,
): password is string {
  return evaluatePasswordPolicy(
    password,
  ).isValid;
}

export async function hashPassword(
  password: string,
): Promise<string> {
  assertValidPassword(
    password,
  );

  return argon2.hash(
    password,
    ARGON2_HASH_OPTIONS,
  );
}

export function isArgon2idHash(
  passwordHash: unknown,
): passwordHash is string {
  return (
    typeof passwordHash ===
      "string" &&
    passwordHash.startsWith(
      "$argon2id$",
    ) &&
    passwordHash.length >= 40 &&
    passwordHash.length <= 1_024
  );
}

export async function verifyPassword(
  passwordHash: string,
  password: string,
): Promise<boolean> {
  if (
    !isArgon2idHash(
      passwordHash,
    ) ||
    typeof password !==
      "string" ||
    password.length === 0 ||
    getPasswordByteLength(
      password,
    ) >
      AUTH_PASSWORD_POLICY.MAXIMUM_HASH_INPUT_BYTES
  ) {
    return false;
  }

  try {
    return await argon2.verify(
      passwordHash,
      password,
    );
  } catch {
    /*
     * Un hash corrupto o incompatible se trata como una
     * contraseña incorrecta y no expone detalles internos.
     */
    return false;
  }
}

export function passwordHashNeedsRehash(
  passwordHash: string,
): boolean {
  if (
    !isArgon2idHash(
      passwordHash,
    )
  ) {
    return true;
  }

  try {
    return argon2.needsRehash(
      passwordHash,
      ARGON2_REHASH_OPTIONS,
    );
  } catch {
    return true;
  }
}

export async function verifyPasswordWithRehashStatus(
  passwordHash: string,
  password: string,
): Promise<PasswordVerificationResult> {
  const matches =
    await verifyPassword(
      passwordHash,
      password,
    );

  return {
    matches,

    needsRehash:
      matches &&
      passwordHashNeedsRehash(
        passwordHash,
      ),
  };
}

export async function passwordMatchesAnyHash(
  password: string,
  passwordHashes: readonly string[],
): Promise<boolean> {
  for (
    const passwordHash
    of passwordHashes
  ) {
    const matches =
      await verifyPassword(
        passwordHash,
        password,
      );

    if (matches) {
      return true;
    }
  }

  return false;
}

export async function rehashPasswordIfNeeded(
  passwordHash: string,
  password: string,
): Promise<string | null> {
  const verification =
    await verifyPasswordWithRehashStatus(
      passwordHash,
      password,
    );

  if (
    !verification.matches ||
    !verification.needsRehash
  ) {
    return null;
  }

  return hashPassword(
    password,
  );
}
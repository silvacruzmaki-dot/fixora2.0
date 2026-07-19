import "server-only";

import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  AUTH_ROLES,
  AUTH_USER_STATUSES,
  type AuthLanguage,
  type AuthRole,
  type AuthUserStatus,
} from "@/constants/auth/auth.constants";

import {
  prisma,
} from "@/lib/database/prisma";

export type UserRepositoryClient =
  | typeof prisma
  | Prisma.TransactionClient;

export interface CreateUserRepositoryInput {
  firstName: string;
  lastName: string;
  displayName: string;

  email: string;
  passwordHash: string;

  role?: AuthRole;
  status?: AuthUserStatus;

  preferredLanguage?:
    AuthLanguage;

  preferredTheme?: string;

  emailVerifiedAt?:
    Date | null;

  termsAcceptedAt?:
    Date | null;

  privacyAcceptedAt?:
    Date | null;
}

export interface UpdateUserProfileRepositoryInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export interface UpdateUserPreferencesRepositoryInput {
  preferredLanguage?:
    AuthLanguage;

  preferredTheme?:
    string;
}

export interface UpdateManagedUserRepositoryInput {
  role?: AuthRole;
  status?: AuthUserStatus;

  lockedUntil?:
    Date | null;
}

export interface FindUsersPageRepositoryInput {
  page?: number;
  pageSize?: number;

  search?: string;

  role?: AuthRole;
  status?: AuthUserStatus;

  orderBy?:
    | "createdAt"
    | "displayName"
    | "email"
    | "lastLoginAt";

  orderDirection?:
    | "asc"
    | "desc";
}

export interface UsersPageRepositoryResult {
  users:
    AdminUserRecord[];

  pagination: {
    page: number;
    pageSize: number;

    totalItems: number;
    totalPages: number;

    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

/*
 * Selector pÃºblico.
 *
 * No contiene:
 *
 * - passwordHash
 * - failedLoginAttempts
 *
 * Puede devolverse a los servicios que construyen
 * respuestas para el navegador.
 */
export const USER_PUBLIC_SELECT = {
  id: true,

  firstName: true,
  lastName: true,
  displayName: true,

  email: true,
  avatarUrl: true,

  role: true,
  status: true,

  preferredLanguage: true,
  preferredTheme: true,

  emailVerifiedAt: true,
  lockedUntil: true,

  lastLoginAt: true,
  passwordChangedAt: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

/*
 * Selector interno utilizado Ãºnicamente para
 * autenticaciÃ³n.
 *
 * Incluye el hash de contraseÃ±a y los intentos
 * fallidos.
 *
 * No debe enviarse directamente al navegador.
 */
export const USER_AUTHENTICATION_SELECT = {
  id: true,

  firstName: true,
  lastName: true,
  displayName: true,

  email: true,
  passwordHash: true,
  avatarUrl: true,

  role: true,
  status: true,

  preferredLanguage: true,
  preferredTheme: true,

  emailVerifiedAt: true,

  failedLoginAttempts: true,
  lockedUntil: true,

  lastLoginAt: true,
  passwordChangedAt: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

/*
 * Selector para el panel administrativo.
 *
 * No expone el hash de la contraseÃ±a.
 */
export const ADMIN_USER_SELECT = {
  id: true,

  firstName: true,
  lastName: true,
  displayName: true,

  email: true,
  avatarUrl: true,

  role: true,
  status: true,

  preferredLanguage: true,
  preferredTheme: true,

  emailVerifiedAt: true,

  failedLoginAttempts: true,
  lockedUntil: true,

  lastLoginAt: true,
  passwordChangedAt: true,

  termsAcceptedAt: true,
  privacyAcceptedAt: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

export type PublicUserRecord =
  Prisma.UserGetPayload<{
    select:
      typeof USER_PUBLIC_SELECT;
  }>;

export type AuthenticationUserRecord =
  Prisma.UserGetPayload<{
    select:
      typeof USER_AUTHENTICATION_SELECT;
  }>;

export type AdminUserRecord =
  Prisma.UserGetPayload<{
    select:
      typeof ADMIN_USER_SELECT;
  }>;

const DEFAULT_PAGE =
  1;

const DEFAULT_PAGE_SIZE =
  20;

const MAXIMUM_PAGE_SIZE =
  100;

function normalizeIdentifier(
  value: unknown,
): string | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalizedValue =
    value.trim();

  return normalizedValue ||
    null;
}

export function normalizeUserEmail(
  value: unknown,
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

  return normalizedEmail ||
    null;
}

function normalizeProfileText(
  value: string,
): string {
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

function normalizePage(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return DEFAULT_PAGE;
  }

  return Math.max(
    1,
    Math.floor(value),
  );
}

function normalizePageSize(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(
    MAXIMUM_PAGE_SIZE,
    Math.max(
      1,
      Math.floor(value),
    ),
  );
}

function createUserSearchWhere(
  search: string | undefined,
): Prisma.UserWhereInput {
  const normalizedSearch =
    search?.trim();

  if (!normalizedSearch) {
    return {};
  }

  return {
    OR: [
      {
        firstName: {
          contains:
            normalizedSearch,
        },
      },

      {
        lastName: {
          contains:
            normalizedSearch,
        },
      },

      {
        displayName: {
          contains:
            normalizedSearch,
        },
      },

      {
        email: {
          contains:
            normalizedSearch
              .toLowerCase(),
        },
      },
    ],
  };
}

function createUsersPageOrderBy(
  orderBy:
    FindUsersPageRepositoryInput["orderBy"],

  orderDirection:
    FindUsersPageRepositoryInput["orderDirection"],
): Prisma.UserOrderByWithRelationInput {
  const direction =
    orderDirection === "asc"
      ? "asc"
      : "desc";

  switch (orderBy) {
    case "displayName":
      return {
        displayName:
          direction,
      };

    case "email":
      return {
        email:
          direction,
      };

    case "lastLoginAt":
      return {
        lastLoginAt:
          direction,
      };

    case "createdAt":
    default:
      return {
        createdAt:
          direction,
      };
  }
}

/**
 * Busca datos pÃºblicos de un usuario mediante
 * su identificador.
 */
export async function findUserById(
  userId: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord | null> {
  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (!normalizedUserId) {
    return null;
  }

  return client.user.findUnique({
    where: {
      id:
        normalizedUserId,
    },

    select:
      USER_PUBLIC_SELECT,
  });
}

/**
 * Busca los datos internos necesarios para validar
 * una sesiÃ³n o autenticar al usuario.
 */
export async function findUserAccountById(
  userId: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<AuthenticationUserRecord | null> {
  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (!normalizedUserId) {
    return null;
  }

  return client.user.findUnique({
    where: {
      id:
        normalizedUserId,
    },

    select:
      USER_AUTHENTICATION_SELECT,
  });
}

/**
 * Busca datos pÃºblicos mediante el correo
 * normalizado.
 */
export async function findUserByEmail(
  email: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord | null> {
  const normalizedEmail =
    normalizeUserEmail(
      email,
    );

  if (!normalizedEmail) {
    return null;
  }

  return client.user.findUnique({
    where: {
      email:
        normalizedEmail,
    },

    select:
      USER_PUBLIC_SELECT,
  });
}

/**
 * Busca un usuario para iniciar sesiÃ³n.
 *
 * Esta funciÃ³n incluye passwordHash, por lo que
 * su resultado debe permanecer dentro del servidor.
 */
export async function findUserForAuthenticationByEmail(
  email: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<AuthenticationUserRecord | null> {
  const normalizedEmail =
    normalizeUserEmail(
      email,
    );

  if (!normalizedEmail) {
    return null;
  }

  return client.user.findUnique({
    where: {
      email:
        normalizedEmail,
    },

    select:
      USER_AUTHENTICATION_SELECT,
  });
}

export async function userEmailExists(
  email: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<boolean> {
  const normalizedEmail =
    normalizeUserEmail(
      email,
    );

  if (!normalizedEmail) {
    return false;
  }

  const user =
    await client.user.findUnique({
      where: {
        email:
          normalizedEmail,
      },

      select: {
        id: true,
      },
    });

  return user !== null;
}

/**
 * Crea un usuario.
 *
 * El registro pÃºblico debe enviar siempre el rol USER.
 * El rol ADMIN se reserva para el seed o procesos
 * administrativos controlados.
 */
export async function createUser(
  input:
    CreateUserRepositoryInput,

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord> {
  const normalizedEmail =
    normalizeUserEmail(
      input.email,
    );

  if (!normalizedEmail) {
    throw new TypeError(
      "El correo del usuario es obligatorio.",
    );
  }

  const data:
    Prisma.UserCreateInput = {
    firstName:
      normalizeProfileText(
        input.firstName,
      ),

    lastName:
      normalizeProfileText(
        input.lastName,
      ),

    displayName:
      normalizeProfileText(
        input.displayName,
      ),

    email:
      normalizedEmail,

    passwordHash:
      input.passwordHash,

    role:
      input.role ??
      AUTH_ROLES.USER,

    status:
      input.status ??
      AUTH_USER_STATUSES
        .PENDING_VERIFICATION,

    ...(input.preferredLanguage
      ? {
          preferredLanguage:
            input.preferredLanguage,
        }
      : {}),

    ...(input.preferredTheme
      ? {
          preferredTheme:
            input.preferredTheme,
        }
      : {}),

    emailVerifiedAt:
      input.emailVerifiedAt ??
      null,

    termsAcceptedAt:
      input.termsAcceptedAt ??
      null,

    privacyAcceptedAt:
      input.privacyAcceptedAt ??
      null,
  };

  return client.user.create({
    data,

    select:
      USER_PUBLIC_SELECT,
  });
}

/**
 * Confirma el correo y activa la cuenta.
 */
export async function markUserEmailAsVerified(
  userId: string,

  verifiedAt:
    Date = new Date(),

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      emailVerifiedAt:
        verifiedAt,

      status:
        AUTH_USER_STATUSES.ACTIVE,

      failedLoginAttempts:
        0,

      lockedUntil:
        null,
    },

    select:
      USER_PUBLIC_SELECT,
  });
}

/**
 * Actualiza la contraseÃ±a y reinicia los bloqueos
 * relacionados con intentos fallidos.
 */
export async function updateUserPassword(
  userId: string,

  passwordHash: string,

  changedAt:
    Date = new Date(),

  client:
    UserRepositoryClient =
    prisma,
): Promise<AuthenticationUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      passwordHash,

      passwordChangedAt:
        changedAt,

      failedLoginAttempts:
        0,

      lockedUntil:
        null,

      status:
        AUTH_USER_STATUSES.ACTIVE,
    },

    select:
      USER_AUTHENTICATION_SELECT,
  });
}

/**
 * Actualiza Ãºnicamente los datos editables
 * del perfil.
 */
export async function updateUserProfile(
  userId: string,

  input:
    UpdateUserProfileRepositoryInput,

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord> {
  const data:
    Prisma.UserUpdateInput = {};

  if (
    input.firstName !==
    undefined
  ) {
    data.firstName =
      normalizeProfileText(
        input.firstName,
      );
  }

  if (
    input.lastName !==
    undefined
  ) {
    data.lastName =
      normalizeProfileText(
        input.lastName,
      );
  }

  if (
    input.displayName !==
    undefined
  ) {
    data.displayName =
      normalizeProfileText(
        input.displayName,
      );
  }

  return client.user.update({
    where: {
      id:
        userId,
    },

    data,

    select:
      USER_PUBLIC_SELECT,
  });
}

export async function updateUserAvatar(
  userId: string,

  avatarUrl:
    string | null,

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      avatarUrl:
        avatarUrl?.trim() ||
        null,
    },

    select:
      USER_PUBLIC_SELECT,
  });
}

export async function updateUserPreferences(
  userId: string,

  input:
    UpdateUserPreferencesRepositoryInput,

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord> {
  const data:
    Prisma.UserUpdateInput = {};

  if (
    input.preferredLanguage !==
    undefined
  ) {
    data.preferredLanguage =
      input.preferredLanguage;
  }

  if (
    input.preferredTheme !==
    undefined
  ) {
    data.preferredTheme =
      input.preferredTheme;
  }

  return client.user.update({
    where: {
      id:
        userId,
    },

    data,

    select:
      USER_PUBLIC_SELECT,
  });
}

/**
 * Incrementa de forma atÃ³mica los intentos fallidos.
 */
export async function incrementUserFailedLoginAttempts(
  userId: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<AuthenticationUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      failedLoginAttempts: {
        increment: 1,
      },
    },

    select:
      USER_AUTHENTICATION_SELECT,
  });
}

/**
 * Bloquea temporalmente una cuenta.
 */
export async function lockUserAccount(
  userId: string,

  lockedUntil: Date,

  client:
    UserRepositoryClient =
    prisma,
): Promise<AuthenticationUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      status:
        AUTH_USER_STATUSES.LOCKED,

      lockedUntil,
    },

    select:
      USER_AUTHENTICATION_SELECT,
  });
}

/**
 * Desbloquea la cuenta y limpia los intentos
 * fallidos.
 */
export async function unlockUserAccount(
  userId: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<AuthenticationUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      status:
        AUTH_USER_STATUSES.ACTIVE,

      failedLoginAttempts:
        0,

      lockedUntil:
        null,
    },

    select:
      USER_AUTHENTICATION_SELECT,
  });
}

/**
 * Registra un inicio de sesiÃ³n exitoso.
 */
export async function recordSuccessfulUserLogin(
  userId: string,

  loggedInAt:
    Date = new Date(),

  client:
    UserRepositoryClient =
    prisma,
): Promise<AuthenticationUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      lastLoginAt:
        loggedInAt,

      failedLoginAttempts:
        0,

      lockedUntil:
        null,

      status:
        AUTH_USER_STATUSES.ACTIVE,
    },

    select:
      USER_AUTHENTICATION_SELECT,
  });
}

/**
 * Desactiva una cuenta.
 *
 * Las sesiones activas deberÃ¡n revocarse desde
 * session.repository.ts.
 */
export async function disableUserAccount(
  userId: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      status:
        AUTH_USER_STATUSES.DISABLED,

      lockedUntil:
        null,
    },

    select:
      USER_PUBLIC_SELECT,
  });
}

export async function activateUserAccount(
  userId: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<PublicUserRecord> {
  return client.user.update({
    where: {
      id:
        userId,
    },

    data: {
      status:
        AUTH_USER_STATUSES.ACTIVE,

      failedLoginAttempts:
        0,

      lockedUntil:
        null,
    },

    select:
      USER_PUBLIC_SELECT,
  });
}

/**
 * OperaciÃ³n utilizada desde el panel
 * administrativo.
 */
export async function updateManagedUser(
  userId: string,

  input:
    UpdateManagedUserRepositoryInput,

  client:
    UserRepositoryClient =
    prisma,
): Promise<AdminUserRecord> {
  const data:
    Prisma.UserUpdateInput = {};

  if (
    input.role !==
    undefined
  ) {
    data.role =
      input.role;
  }

  if (
    input.status !==
    undefined
  ) {
    data.status =
      input.status;

    if (
      input.status ===
        AUTH_USER_STATUSES.ACTIVE ||
      input.status ===
        AUTH_USER_STATUSES.DISABLED
    ) {
      data.lockedUntil =
        null;
    }
  }

  if (
    input.lockedUntil !==
    undefined
  ) {
    data.lockedUntil =
      input.lockedUntil;
  }

  return client.user.update({
    where: {
      id:
        userId,
    },

    data,

    select:
      ADMIN_USER_SELECT,
  });
}

/**
 * Devuelve una pÃ¡gina de usuarios para
 * administraciÃ³n.
 */
export async function findUsersPage(
  {
    page:
      requestedPage,

    pageSize:
      requestedPageSize,

    search,

    role,
    status,

    orderBy =
      "createdAt",

    orderDirection =
      "desc",
  }: FindUsersPageRepositoryInput = {},

  client:
    UserRepositoryClient =
    prisma,
): Promise<UsersPageRepositoryResult> {
  const page =
    normalizePage(
      requestedPage,
    );

  const pageSize =
    normalizePageSize(
      requestedPageSize,
    );

  const searchWhere =
    createUserSearchWhere(
      search,
    );

  const where:
    Prisma.UserWhereInput = {
    ...searchWhere,

    ...(role
      ? {
          role,
        }
      : {}),

    ...(status
      ? {
          status,
        }
      : {}),
  };

  const [
    totalItems,
    users,
  ] = await Promise.all([
    client.user.count({
      where,
    }),

    client.user.findMany({
      where,

      select:
        ADMIN_USER_SELECT,

      orderBy:
        createUsersPageOrderBy(
          orderBy,
          orderDirection,
        ),

      skip:
        (
          page -
          1
        ) *
        pageSize,

      take:
        pageSize,
    }),
  ]);

  const totalPages =
    totalItems === 0
      ? 0
      : Math.ceil(
          totalItems /
            pageSize,
        );

  return {
    users,

    pagination: {
      page,
      pageSize,

      totalItems,
      totalPages,

      hasPreviousPage:
        page > 1,

      hasNextPage:
        page <
        totalPages,
    },
  };
}

/**
 * Obtiene un usuario completo para
 * administraciÃ³n.
 */
export async function findAdminUserById(
  userId: string,

  client:
    UserRepositoryClient =
    prisma,
): Promise<AdminUserRecord | null> {
  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (!normalizedUserId) {
    return null;
  }

  return client.user.findUnique({
    where: {
      id:
        normalizedUserId,
    },

    select:
      ADMIN_USER_SELECT,
  });
}

export async function countUsers(
  where:
    Prisma.UserWhereInput = {},

  client:
    UserRepositoryClient =
    prisma,
): Promise<number> {
  return client.user.count({
    where,
  });
}

export async function countActiveUsers(
  client:
    UserRepositoryClient =
    prisma,
): Promise<number> {
  return client.user.count({
    where: {
      status:
        AUTH_USER_STATUSES.ACTIVE,
    },
  });
}

export async function countAdministrators(
  client:
    UserRepositoryClient =
    prisma,
): Promise<number> {
  return client.user.count({
    where: {
      role:
        AUTH_ROLES.ADMIN,
    },
  });
}

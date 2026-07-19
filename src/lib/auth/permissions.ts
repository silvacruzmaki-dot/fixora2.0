import {
  AUTH_ROLES,
  isAuthRole,
  type AuthRole,
} from "@/constants/auth/auth.constants";

import {
  AuthGuardError,
} from "@/lib/auth/guards";

/*
 * Permisos disponibles dentro de FIXORA.
 *
 * Los nombres identifican con claridad:
 * - El recurso.
 * - La acción permitida.
 * - Si se aplica únicamente al propietario.
 */
export const AUTH_PERMISSIONS = {
  PROFILE_READ_SELF:
    "PROFILE_READ_SELF",

  PROFILE_UPDATE_SELF:
    "PROFILE_UPDATE_SELF",

  AVATAR_UPDATE_SELF:
    "AVATAR_UPDATE_SELF",

  ACCOUNT_PREFERENCES_UPDATE_SELF:
    "ACCOUNT_PREFERENCES_UPDATE_SELF",

  NOTIFICATIONS_READ_SELF:
    "NOTIFICATIONS_READ_SELF",

  NOTIFICATIONS_MARK_READ_SELF:
    "NOTIFICATIONS_MARK_READ_SELF",

  ADMIN_DASHBOARD_ACCESS:
    "ADMIN_DASHBOARD_ACCESS",

  ADMIN_USERS_READ:
    "ADMIN_USERS_READ",

  ADMIN_USERS_UPDATE:
    "ADMIN_USERS_UPDATE",

  ADMIN_AUDIT_LOGS_READ:
    "ADMIN_AUDIT_LOGS_READ",
} as const;

export type AuthPermission =
  (typeof AUTH_PERMISSIONS)[keyof typeof AUTH_PERMISSIONS];

export interface AuthPermissionSubject {
  id: string;
  role: AuthRole;
}

export interface OwnedResourcePermissionOptions {
  ownerPermission: AuthPermission;

  elevatedPermission?: AuthPermission;

  allowAdministratorBypass?: boolean;
}

export interface ManageUserPermissionOptions {
  /*
   * Por seguridad, la gestión administrativa de usuarios
   * no permite modificar la propia cuenta de forma
   * predeterminada.
   */
  allowSelf?: boolean;
}

/*
 * Permisos asignados a cada rol.
 *
 * El rol ADMIN conserva también las acciones personales
 * de un usuario normal.
 */
export const AUTH_ROLE_PERMISSIONS = {
  [AUTH_ROLES.USER]: [
    AUTH_PERMISSIONS.PROFILE_READ_SELF,
    AUTH_PERMISSIONS.PROFILE_UPDATE_SELF,
    AUTH_PERMISSIONS.AVATAR_UPDATE_SELF,
    AUTH_PERMISSIONS.ACCOUNT_PREFERENCES_UPDATE_SELF,
    AUTH_PERMISSIONS.NOTIFICATIONS_READ_SELF,
    AUTH_PERMISSIONS.NOTIFICATIONS_MARK_READ_SELF,
  ],

  [AUTH_ROLES.ADMIN]: [
    AUTH_PERMISSIONS.PROFILE_READ_SELF,
    AUTH_PERMISSIONS.PROFILE_UPDATE_SELF,
    AUTH_PERMISSIONS.AVATAR_UPDATE_SELF,
    AUTH_PERMISSIONS.ACCOUNT_PREFERENCES_UPDATE_SELF,
    AUTH_PERMISSIONS.NOTIFICATIONS_READ_SELF,
    AUTH_PERMISSIONS.NOTIFICATIONS_MARK_READ_SELF,

    AUTH_PERMISSIONS.ADMIN_DASHBOARD_ACCESS,
    AUTH_PERMISSIONS.ADMIN_USERS_READ,
    AUTH_PERMISSIONS.ADMIN_USERS_UPDATE,
    AUTH_PERMISSIONS.ADMIN_AUDIT_LOGS_READ,
  ],
} as const satisfies Record<
  AuthRole,
  readonly AuthPermission[]
>;

const AUTH_PERMISSION_VALUES =
  new Set<AuthPermission>(
    Object.values(
      AUTH_PERMISSIONS,
    ) as AuthPermission[],
  );

const EMPTY_PERMISSIONS:
  readonly AuthPermission[] = [];

const AUTH_PERMISSION_SETS:
  Record<
    AuthRole,
    ReadonlySet<AuthPermission>
  > = {
  [AUTH_ROLES.USER]:
    new Set<AuthPermission>(
      AUTH_ROLE_PERMISSIONS[
        AUTH_ROLES.USER
      ],
    ),

  [AUTH_ROLES.ADMIN]:
    new Set<AuthPermission>(
      AUTH_ROLE_PERMISSIONS[
        AUTH_ROLES.ADMIN
      ],
    ),
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function requirePermissionSubject(
  subject: unknown,
): asserts subject is AuthPermissionSubject {
  if (
    subject === null ||
    subject === undefined
  ) {
    throw new AuthGuardError(
      "UNAUTHENTICATED",
    );
  }

  if (
    !isAuthPermissionSubject(
      subject,
    )
  ) {
    throw new AuthGuardError(
      "INSUFFICIENT_PERMISSIONS",
    );
  }
}

/**
 * Comprueba que un valor corresponda a uno de los
 * permisos definidos en AUTH_PERMISSIONS.
 */
export function isAuthPermission(
  value: unknown,
): value is AuthPermission {
  return (
    typeof value === "string" &&
    AUTH_PERMISSION_VALUES.has(
      value as AuthPermission,
    )
  );
}

/**
 * Comprueba que el objeto posea un identificador de
 * usuario válido y un rol reconocido.
 */
export function isAuthPermissionSubject(
  value: unknown,
): value is AuthPermissionSubject {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    isAuthRole(
      value.role,
    )
  );
}

/**
 * Devuelve todos los permisos asignados al rol.
 *
 * Cuando el rol no es válido devuelve una lista vacía.
 */
export function getPermissionsForRole(
  role: unknown,
): readonly AuthPermission[] {
  if (!isAuthRole(role)) {
    return EMPTY_PERMISSIONS;
  }

  return AUTH_ROLE_PERMISSIONS[
    role
  ];
}

/**
 * Devuelve los permisos efectivos de un usuario.
 */
export function getEffectivePermissions(
  subject: unknown,
): readonly AuthPermission[] {
  if (
    !isAuthPermissionSubject(
      subject,
    )
  ) {
    return EMPTY_PERMISSIONS;
  }

  return getPermissionsForRole(
    subject.role,
  );
}

/**
 * Comprueba un permiso directamente mediante el rol.
 */
export function roleHasPermission(
  role: unknown,
  permission: unknown,
): boolean {
  if (
    !isAuthRole(role) ||
    !isAuthPermission(
      permission,
    )
  ) {
    return false;
  }

  return AUTH_PERMISSION_SETS[
    role
  ].has(permission);
}

/**
 * Comprueba si el rol posee al menos uno de los permisos.
 */
export function roleHasAnyPermission(
  role: unknown,
  permissions: readonly unknown[],
): boolean {
  if (
    !isAuthRole(role) ||
    permissions.length === 0
  ) {
    return false;
  }

  return permissions.some(
    (permission) =>
      roleHasPermission(
        role,
        permission,
      ),
  );
}

/**
 * Comprueba si el rol posee todos los permisos.
 *
 * Una lista vacía devuelve false para evitar autorizaciones
 * accidentales ocasionadas por una configuración incompleta.
 */
export function roleHasAllPermissions(
  role: unknown,
  permissions: readonly unknown[],
): boolean {
  if (
    !isAuthRole(role) ||
    permissions.length === 0
  ) {
    return false;
  }

  return permissions.every(
    (permission) =>
      roleHasPermission(
        role,
        permission,
      ),
  );
}

/**
 * Comprueba un permiso utilizando directamente al usuario.
 */
export function hasPermission(
  subject: unknown,
  permission: unknown,
): boolean {
  if (
    !isAuthPermissionSubject(
      subject,
    )
  ) {
    return false;
  }

  return roleHasPermission(
    subject.role,
    permission,
  );
}

export function hasAnyPermission(
  subject: unknown,
  permissions: readonly unknown[],
): boolean {
  if (
    !isAuthPermissionSubject(
      subject,
    )
  ) {
    return false;
  }

  return roleHasAnyPermission(
    subject.role,
    permissions,
  );
}

export function hasAllPermissions(
  subject: unknown,
  permissions: readonly unknown[],
): boolean {
  if (
    !isAuthPermissionSubject(
      subject,
    )
  ) {
    return false;
  }

  return roleHasAllPermissions(
    subject.role,
    permissions,
  );
}

/**
 * Exige un permiso específico.
 *
 * Lanza:
 * - UNAUTHENTICATED cuando no existe un usuario.
 * - INSUFFICIENT_PERMISSIONS cuando el permiso no está
 *   asignado a su rol.
 */
export function assertPermission(
  subject: unknown,
  permission: AuthPermission,
): asserts subject is AuthPermissionSubject {
  requirePermissionSubject(
    subject,
  );

  if (
    !hasPermission(
      subject,
      permission,
    )
  ) {
    throw new AuthGuardError(
      "INSUFFICIENT_PERMISSIONS",
    );
  }
}

/**
 * Exige al menos uno de los permisos indicados.
 */
export function assertAnyPermission(
  subject: unknown,
  permissions: readonly AuthPermission[],
): asserts subject is AuthPermissionSubject {
  requirePermissionSubject(
    subject,
  );

  if (
    !hasAnyPermission(
      subject,
      permissions,
    )
  ) {
    throw new AuthGuardError(
      "INSUFFICIENT_PERMISSIONS",
    );
  }
}

/**
 * Exige todos los permisos indicados.
 */
export function assertAllPermissions(
  subject: unknown,
  permissions: readonly AuthPermission[],
): asserts subject is AuthPermissionSubject {
  requirePermissionSubject(
    subject,
  );

  if (
    !hasAllPermissions(
      subject,
      permissions,
    )
  ) {
    throw new AuthGuardError(
      "INSUFFICIENT_PERMISSIONS",
    );
  }
}

/**
 * Comprueba que el usuario sea propietario de un recurso.
 */
export function isResourceOwner(
  subject: unknown,
  ownerId: unknown,
): boolean {
  return (
    isAuthPermissionSubject(
      subject,
    ) &&
    typeof ownerId ===
      "string" &&
    ownerId.trim().length > 0 &&
    subject.id === ownerId
  );
}

/**
 * Permite acceder a un recurso cuando:
 *
 * 1. El usuario es propietario y posee ownerPermission.
 * 2. El usuario posee elevatedPermission.
 * 3. Opcionalmente, es ADMIN y se permite el bypass.
 */
export function canAccessOwnedResource(
  subject: unknown,
  ownerId: unknown,
  {
    ownerPermission,
    elevatedPermission,
    allowAdministratorBypass = false,
  }: OwnedResourcePermissionOptions,
): boolean {
  if (
    !isAuthPermissionSubject(
      subject,
    ) ||
    typeof ownerId !==
      "string" ||
    ownerId.trim().length === 0
  ) {
    return false;
  }

  if (
    subject.id === ownerId &&
    hasPermission(
      subject,
      ownerPermission,
    )
  ) {
    return true;
  }

  if (
    elevatedPermission &&
    hasPermission(
      subject,
      elevatedPermission,
    )
  ) {
    return true;
  }

  return (
    allowAdministratorBypass &&
    subject.role ===
      AUTH_ROLES.ADMIN
  );
}

export function assertCanAccessOwnedResource(
  subject: unknown,
  ownerId: unknown,
  options: OwnedResourcePermissionOptions,
): asserts subject is AuthPermissionSubject {
  requirePermissionSubject(
    subject,
  );

  if (
    !canAccessOwnedResource(
      subject,
      ownerId,
      options,
    )
  ) {
    throw new AuthGuardError(
      "INSUFFICIENT_PERMISSIONS",
    );
  }
}

/**
 * Comprueba si el usuario puede consultar un perfil.
 *
 * - Cada usuario puede consultar su propio perfil.
 * - Un administrador puede consultar otras cuentas.
 */
export function canReadUserProfile(
  subject: unknown,
  targetUserId: unknown,
): boolean {
  if (
    !isAuthPermissionSubject(
      subject,
    ) ||
    typeof targetUserId !==
      "string"
  ) {
    return false;
  }

  if (
    subject.id ===
    targetUserId
  ) {
    return hasPermission(
      subject,
      AUTH_PERMISSIONS.PROFILE_READ_SELF,
    );
  }

  return hasPermission(
    subject,
    AUTH_PERMISSIONS.ADMIN_USERS_READ,
  );
}

/**
 * Comprueba si el usuario puede actualizar un perfil.
 *
 * - Cada usuario actualiza su propia información.
 * - Un administrador actualiza cuentas ajenas desde el
 *   panel administrativo.
 */
export function canUpdateUserProfile(
  subject: unknown,
  targetUserId: unknown,
): boolean {
  if (
    !isAuthPermissionSubject(
      subject,
    ) ||
    typeof targetUserId !==
      "string"
  ) {
    return false;
  }

  if (
    subject.id ===
    targetUserId
  ) {
    return hasPermission(
      subject,
      AUTH_PERMISSIONS.PROFILE_UPDATE_SELF,
    );
  }

  return hasPermission(
    subject,
    AUTH_PERMISSIONS.ADMIN_USERS_UPDATE,
  );
}

/**
 * Comprueba si un administrador puede gestionar una cuenta
 * desde el panel de usuarios.
 *
 * De forma predeterminada, impide que el administrador
 * modifique su propia cuenta desde esa pantalla.
 */
export function canManageUser(
  subject: unknown,
  targetUserId: unknown,
  {
    allowSelf = false,
  }: ManageUserPermissionOptions = {},
): boolean {
  if (
    !isAuthPermissionSubject(
      subject,
    ) ||
    typeof targetUserId !==
      "string" ||
    targetUserId.trim().length === 0
  ) {
    return false;
  }

  if (
    !hasPermission(
      subject,
      AUTH_PERMISSIONS.ADMIN_USERS_UPDATE,
    )
  ) {
    return false;
  }

  if (
    !allowSelf &&
    subject.id ===
      targetUserId
  ) {
    return false;
  }

  return true;
}

export function assertCanManageUser(
  subject: unknown,
  targetUserId: unknown,
  options:
    ManageUserPermissionOptions = {},
): asserts subject is AuthPermissionSubject {
  requirePermissionSubject(
    subject,
  );

  if (
    !canManageUser(
      subject,
      targetUserId,
      options,
    )
  ) {
    throw new AuthGuardError(
      "INSUFFICIENT_PERMISSIONS",
    );
  }
}

/**
 * Accesos semánticos utilizados por las páginas y servicios.
 */
export function canAccessAdminDashboard(
  subject: unknown,
): boolean {
  return hasPermission(
    subject,
    AUTH_PERMISSIONS.ADMIN_DASHBOARD_ACCESS,
  );
}

export function canReadNotifications(
  subject: unknown,
): boolean {
  return hasPermission(
    subject,
    AUTH_PERMISSIONS.NOTIFICATIONS_READ_SELF,
  );
}

export function canMarkNotificationsAsRead(
  subject: unknown,
): boolean {
  return hasPermission(
    subject,
    AUTH_PERMISSIONS.NOTIFICATIONS_MARK_READ_SELF,
  );
}

export function canUpdateOwnAvatar(
  subject: unknown,
): boolean {
  return hasPermission(
    subject,
    AUTH_PERMISSIONS.AVATAR_UPDATE_SELF,
  );
}

export function canUpdateOwnPreferences(
  subject: unknown,
): boolean {
  return hasPermission(
    subject,
    AUTH_PERMISSIONS.ACCOUNT_PREFERENCES_UPDATE_SELF,
  );
}
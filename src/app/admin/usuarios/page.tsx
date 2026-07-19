import type { Metadata } from "next";

import Link from "next/link";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_SESSION_COOKIE_NAME } from "@/constants/auth/auth.constants";

import {
  getAdministratorSessionByToken,
  getAdministratorUsersPageByToken,
  updateManagedUserByAdministrator,
} from "@/server/services/admin-auth.service";

export const metadata: Metadata = {
  title: "FIXORA | Administración de usuarios",

  description:
    "Gestión de usuarios registrados en FIXORA.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const dynamic = "force-dynamic";

export const revalidate = 0;

type UserRole =
  | "USER"
  | "ADMIN";

type UserStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "LOCKED"
  | "DISABLED";

interface AdminUsersPageProps {
  searchParams: Promise<{
    page?: string | string[];
    query?: string | string[];
    role?: string | string[];
    status?: string | string[];
    notice?: string | string[];
    error?: string | string[];
  }>;
}

const PAGE_SIZE = 20;

const ROLE_VALUES =
  new Set<UserRole>([
    "USER",
    "ADMIN",
  ]);

const STATUS_VALUES =
  new Set<UserStatus>([
    "PENDING_VERIFICATION",
    "ACTIVE",
    "LOCKED",
    "DISABLED",
  ]);

const ADMIN_USERS_COPY = {
  es: {
    pageTitle:
      "Administrar usuarios",

    pageDescription:
      "Consulta las cuentas registradas, revisa su estado y administra sus permisos.",

    backToDashboard:
      "Volver al panel",

    totalUsers:
      "Usuarios registrados",

    activeUsers:
      "Cuentas activas",

    administrators:
      "Administradores",

    filteredUsers:
      "Resultados filtrados",

    searchLabel:
      "Buscar usuarios",

    searchPlaceholder:
      "Nombre, usuario o correo electrónico",

    roleFilter:
      "Filtrar por rol",

    statusFilter:
      "Filtrar por estado",

    allRoles:
      "Todos los roles",

    allStatuses:
      "Todos los estados",

    userRole:
      "Usuario",

    adminRole:
      "Administrador",

    active:
      "Activa",

    pending:
      "Pendiente",

    locked:
      "Bloqueada",

    disabled:
      "Desactivada",

    applyFilters:
      "Aplicar filtros",

    clearFilters:
      "Limpiar filtros",

    user:
      "Usuario",

    email:
      "Correo electrónico",

    role:
      "Rol",

    status:
      "Estado",

    verification:
      "Verificación",

    createdAt:
      "Fecha de registro",

    actions:
      "Acciones",

    verified:
      "Verificado",

    notVerified:
      "Sin verificar",

    save:
      "Guardar",

    ownAccount:
      "Tu cuenta",

    ownAccountProtected:
      "Tu propia cuenta no puede modificarse desde esta tabla.",

    emptyTitle:
      "No se encontraron usuarios",

    emptyDescription:
      "No existen cuentas que coincidan con los filtros seleccionados.",

    previous:
      "Anterior",

    next:
      "Siguiente",

    page:
      "Página",

    of:
      "de",

    showing:
      "Mostrando",

    results:
      "resultados",

    userUpdated:
      "El usuario fue actualizado correctamente.",

    noChanges:
      "No se detectaron cambios en el usuario.",

    selfProtection:
      "No puedes cambiar tu propio rol o estado desde esta sección.",

    lastAdminProtection:
      "No se puede desactivar o degradar al último administrador activo.",

    userNotFound:
      "El usuario solicitado no fue encontrado.",

    invalidUpdate:
      "Los datos enviados para actualizar el usuario no son válidos.",

    securityNotice:
      "Las modificaciones de rol y estado serán registradas en el historial de auditoría.",
  },

  en: {
    pageTitle:
      "Manage users",

    pageDescription:
      "Review registered accounts, check their status, and manage their permissions.",

    backToDashboard:
      "Back to dashboard",

    totalUsers:
      "Registered users",

    activeUsers:
      "Active accounts",

    administrators:
      "Administrators",

    filteredUsers:
      "Filtered results",

    searchLabel:
      "Search users",

    searchPlaceholder:
      "Name, display name, or email address",

    roleFilter:
      "Filter by role",

    statusFilter:
      "Filter by status",

    allRoles:
      "All roles",

    allStatuses:
      "All statuses",

    userRole:
      "User",

    adminRole:
      "Administrator",

    active:
      "Active",

    pending:
      "Pending",

    locked:
      "Locked",

    disabled:
      "Disabled",

    applyFilters:
      "Apply filters",

    clearFilters:
      "Clear filters",

    user:
      "User",

    email:
      "Email address",

    role:
      "Role",

    status:
      "Status",

    verification:
      "Verification",

    createdAt:
      "Registration date",

    actions:
      "Actions",

    verified:
      "Verified",

    notVerified:
      "Not verified",

    save:
      "Save",

    ownAccount:
      "Your account",

    ownAccountProtected:
      "Your own account cannot be modified from this table.",

    emptyTitle:
      "No users found",

    emptyDescription:
      "There are no accounts matching the selected filters.",

    previous:
      "Previous",

    next:
      "Next",

    page:
      "Page",

    of:
      "of",

    showing:
      "Showing",

    results:
      "results",

    userUpdated:
      "The user was updated successfully.",

    noChanges:
      "No changes were detected for this user.",

    selfProtection:
      "You cannot change your own role or status from this section.",

    lastAdminProtection:
      "The last active administrator cannot be disabled or downgraded.",

    userNotFound:
      "The requested user was not found.",

    invalidUpdate:
      "The submitted user update is invalid.",

    securityNotice:
      "Role and status changes will be recorded in the audit history.",
  },
} as const;

function getFirstSearchValue(
  value:
    | string
    | string[]
    | undefined,
): string | undefined {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    Array.isArray(value)
  ) {
    return value[0];
  }

  return undefined;
}

function normalizePage(
  value: string | undefined,
): number {
  const parsedPage =
    Number.parseInt(
      value ?? "1",
      10,
    );

  if (
    !Number.isInteger(
      parsedPage,
    ) ||
    parsedPage < 1
  ) {
    return 1;
  }

  return Math.min(
    parsedPage,
    100_000,
  );
}

function normalizeQuery(
  value: string | undefined,
): string {
  return (
    value
      ?.trim()
      .slice(
        0,
        120,
      ) ?? ""
  );
}

function normalizeRole(
  value: string | undefined,
): UserRole | undefined {
  if (
    value &&
    ROLE_VALUES.has(
      value as UserRole,
    )
  ) {
    return value as UserRole;
  }

  return undefined;
}

function normalizeStatus(
  value: string | undefined,
): UserStatus | undefined {
  if (
    value &&
    STATUS_VALUES.has(
      value as UserStatus,
    )
  ) {
    return value as UserStatus;
  }

  return undefined;
}

function normalizeManagedUserRole(
  value: string,
): UserRole {
  return value ===
    "ADMIN"
    ? "ADMIN"
    : "USER";
}

function normalizeManagedUserStatus(
  value: string,
): UserStatus {
  switch (value) {
    case "ACTIVE":
    case "LOCKED":
    case "DISABLED":
    case "PENDING_VERIFICATION":
      return value;

    default:
      return "DISABLED";
  }
}

function getSafeReturnTo(
  formData: FormData,
): string {
  const returnToValue =
    formData.get(
      "returnTo",
    );

  if (
    typeof returnToValue !==
      "string" ||
    !returnToValue.startsWith(
      "/admin/usuarios",
    ) ||
    returnToValue.startsWith(
      "//",
    )
  ) {
    return "/admin/usuarios";
  }

  return returnToValue;
}

function addResultToReturnUrl(
  returnTo: string,
  type:
    | "notice"
    | "error",
  value: string,
): string {
  const url =
    new URL(
      returnTo,
      "http://fixora.local",
    );

  url.searchParams.delete(
    "notice",
  );

  url.searchParams.delete(
    "error",
  );

  url.searchParams.set(
    type,
    value,
  );

  return `${url.pathname}${url.search}`;
}

async function updateManagedUserAction(
  formData: FormData,
): Promise<void> {
  "use server";

  const returnTo =
    getSafeReturnTo(
      formData,
    );

  const userIdValue =
    formData.get(
      "userId",
    );

  const roleValue =
    formData.get(
      "role",
    );

  const statusValue =
    formData.get(
      "status",
    );

  if (
    typeof userIdValue !==
      "string" ||
    typeof roleValue !==
      "string" ||
    typeof statusValue !==
      "string" ||
    !ROLE_VALUES.has(
      roleValue as UserRole,
    ) ||
    !STATUS_VALUES.has(
      statusValue as UserStatus,
    )
  ) {
    redirect(
      addResultToReturnUrl(
        returnTo,
        "error",
        "invalid-update",
      ),
    );
  }

  const cookieStore =
    await cookies();

  const sessionToken =
    cookieStore.get(
      AUTH_SESSION_COOKIE_NAME,
    )?.value;

  if (!sessionToken) {
    redirect(
      "/admin/iniciar-sesion",
    );
  }

  let result:
    Awaited<
      ReturnType<
        typeof updateManagedUserByAdministrator
      >
    >;

  try {
    result =
      await updateManagedUserByAdministrator({
        sessionToken,

        userId:
          userIdValue.trim(),

        data: {
          role:
            roleValue as UserRole,

          status:
            statusValue as UserStatus,
        },
      });
  } catch {
    redirect(
      addResultToReturnUrl(
        returnTo,
        "error",
        "invalid-update",
      ),
    );
  }

  switch (
    result.status
  ) {
    case "updated": {
      revalidatePath(
        "/admin/usuarios",
      );

      redirect(
        addResultToReturnUrl(
          returnTo,
          "notice",
          "user-updated",
        ),
      );
    }

    case "no-changes": {
      redirect(
        addResultToReturnUrl(
          returnTo,
          "notice",
          "no-changes",
        ),
      );
    }

    case "self-protection": {
      redirect(
        addResultToReturnUrl(
          returnTo,
          "error",
          "self-protection",
        ),
      );
    }

    case "last-administrator-protected": {
      redirect(
        addResultToReturnUrl(
          returnTo,
          "error",
          "last-administrator",
        ),
      );
    }

    case "not-found": {
      redirect(
        addResultToReturnUrl(
          returnTo,
          "error",
          "user-not-found",
        ),
      );
    }

    case "invalid-session":
    case "account-unavailable": {
      redirect(
        "/admin/iniciar-sesion",
      );
    }

    case "insufficient-permissions": {
      redirect("/");
    }
  }
}

function createUsersUrl(
  options: {
    page: number;
    query: string;
    role?: UserRole;
    status?: UserStatus;
  },
): string {
  const searchParams =
    new URLSearchParams();

  if (
    options.page >
    1
  ) {
    searchParams.set(
      "page",
      String(
        options.page,
      ),
    );
  }

  if (
    options.query
  ) {
    searchParams.set(
      "query",
      options.query,
    );
  }

  if (
    options.role
  ) {
    searchParams.set(
      "role",
      options.role,
    );
  }

  if (
    options.status
  ) {
    searchParams.set(
      "status",
      options.status,
    );
  }

  const queryString =
    searchParams.toString();

  return queryString
    ? `/admin/usuarios?${queryString}`
    : "/admin/usuarios";
}

function getStatusClassName(
  status: UserStatus,
): string {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

    case "LOCKED":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400";

    case "DISABLED":
      return "bg-red-500/10 text-red-700 dark:text-red-400";

    case "PENDING_VERIFICATION":
    default:
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
  }
}

export default async function AdminUsersPage(
  {
    searchParams,
  }: AdminUsersPageProps,
) {
  const resolvedSearchParams =
    await searchParams;

  const page =
    normalizePage(
      getFirstSearchValue(
        resolvedSearchParams
          .page,
      ),
    );

  const query =
    normalizeQuery(
      getFirstSearchValue(
        resolvedSearchParams
          .query,
      ),
    );

  const selectedRole =
    normalizeRole(
      getFirstSearchValue(
        resolvedSearchParams
          .role,
      ),
    );

  const selectedStatus =
    normalizeStatus(
      getFirstSearchValue(
        resolvedSearchParams
          .status,
      ),
    );

  const notice =
    getFirstSearchValue(
      resolvedSearchParams
        .notice,
    );

  const error =
    getFirstSearchValue(
      resolvedSearchParams
        .error,
    );

  const cookieStore =
    await cookies();

  const sessionToken =
    cookieStore.get(
      AUTH_SESSION_COOKIE_NAME,
    )?.value;

  if (!sessionToken) {
    redirect(
      "/admin/iniciar-sesion",
    );
  }

  const sessionResult =
    await getAdministratorSessionByToken(
      sessionToken,
    );

  if (
    sessionResult.status ===
      "invalid-session" ||
    sessionResult.status ===
      "account-unavailable"
  ) {
    redirect(
      "/admin/iniciar-sesion",
    );
  }

  if (
    sessionResult.status ===
    "insufficient-permissions"
  ) {
    redirect("/");
  }

  if (
    sessionResult.status !==
    "authenticated"
  ) {
    redirect(
      "/admin/iniciar-sesion",
    );
  }

  const administrator =
    sessionResult.user;

  const currentLanguage:
    | "es"
    | "en" =
    administrator
      .preferredLanguage ===
    "en"
      ? "en"
      : "es";

  const copy =
    ADMIN_USERS_COPY[
      currentLanguage
    ];

  const usersResult =
    await getAdministratorUsersPageByToken(
      sessionToken,
      {
        page,

        pageSize:
          PAGE_SIZE,

        search:
          query ||
          undefined,

        role:
          selectedRole,

        status:
          selectedStatus,
      },
    );

  if (
    usersResult.status ===
      "invalid-session" ||
    usersResult.status ===
      "account-unavailable"
  ) {
    redirect(
      "/admin/iniciar-sesion",
    );
  }

  if (
    usersResult.status ===
    "insufficient-permissions"
  ) {
    redirect("/");
  }

  if (
    usersResult.status !==
    "authenticated"
  ) {
    redirect(
      "/admin/iniciar-sesion",
    );
  }

  const formatDate =
    (
      date: Date,
    ): string =>
      new Intl.DateTimeFormat(
        currentLanguage ===
          "en"
          ? "en-US"
          : "es-PE",
        {
          year:
            "numeric",

          month:
            "short",

          day:
            "2-digit",
        },
      ).format(
        date,
      );

  const getRoleLabel =
    (
      role: UserRole,
    ): string =>
      role ===
        "ADMIN"
        ? copy.adminRole
        : copy.userRole;

  const getStatusLabel =
    (
      status: UserStatus,
    ): string => {
      switch (status) {
        case "ACTIVE":
          return copy.active;

        case "LOCKED":
          return copy.locked;

        case "DISABLED":
          return copy.disabled;

        case "PENDING_VERIFICATION":
        default:
          return copy.pending;
      }
    };

  const currentReturnTo =
    createUsersUrl({
      page:
        usersResult
          .pagination
          .page,

      query,

      role:
        selectedRole,

      status:
        selectedStatus,
    });

  const successMessage =
    notice ===
    "user-updated"
      ? copy.userUpdated
      : notice ===
          "no-changes"
        ? copy.noChanges
        : null;

  const errorMessage =
    error ===
    "self-protection"
      ? copy.selfProtection
      : error ===
          "last-administrator"
        ? copy.lastAdminProtection
        : error ===
            "user-not-found"
          ? copy.userNotFound
          : error ===
              "invalid-update"
            ? copy.invalidUpdate
            : null;

  const summaryCards = [
    {
      label:
        copy.totalUsers,

      value:
        usersResult
          .summary
          .totalUsers,
    },

    {
      label:
        copy.activeUsers,

      value:
        usersResult
          .summary
          .activeUsers,
    },

    {
      label:
        copy.administrators,

      value:
        usersResult
          .summary
          .administrators,
    },

    {
      label:
        copy.filteredUsers,

      value:
        usersResult
          .pagination
          .totalItems,
    },
  ];

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-black/10 pb-7 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              FIXORA ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              {copy.pageTitle}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
              {
                copy.pageDescription
              }
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-center text-sm font-semibold text-zinc-700 transition hover:border-emerald-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
          >
            {
              copy.backToDashboard
            }
          </Link>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {
            summaryCards.map(
              (
                card,
              ) => (
                <article
                  key={
                    card.label
                  }
                  className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900"
                >
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {
                      card.label
                    }
                  </p>

                  <p className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">
                    {
                      card.value
                    }
                  </p>
                </article>
              ),
            )
          }
        </section>

        <div
          className="mt-5 grid gap-3"
          aria-live="polite"
        >
          {
            successMessage
              ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                    {
                      successMessage
                    }
                  </div>
                )
              : null
          }

          {
            errorMessage
              ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                    {
                      errorMessage
                    }
                  </div>
                )
              : null
          }
        </div>

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <form
            method="GET"
            className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_220px_240px_auto_auto]"
          >
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {
                  copy.searchLabel
                }
              </span>

              <input
                type="search"
                name="query"
                defaultValue={
                  query
                }
                maxLength={
                  120
                }
                placeholder={
                  copy.searchPlaceholder
                }
                className="h-11 rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {
                  copy.roleFilter
                }
              </span>

              <select
                name="role"
                defaultValue={
                  selectedRole ??
                  ""
                }
                className="h-11 rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
              >
                <option value="">
                  {
                    copy.allRoles
                  }
                </option>

                <option value="USER">
                  {
                    copy.userRole
                  }
                </option>

                <option value="ADMIN">
                  {
                    copy.adminRole
                  }
                </option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {
                  copy.statusFilter
                }
              </span>

              <select
                name="status"
                defaultValue={
                  selectedStatus ??
                  ""
                }
                className="h-11 rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
              >
                <option value="">
                  {
                    copy.allStatuses
                  }
                </option>

                <option value="ACTIVE">
                  {
                    copy.active
                  }
                </option>

                <option value="PENDING_VERIFICATION">
                  {
                    copy.pending
                  }
                </option>

                <option value="LOCKED">
                  {
                    copy.locked
                  }
                </option>

                <option value="DISABLED">
                  {
                    copy.disabled
                  }
                </option>
              </select>
            </label>

            <button
              type="submit"
              className="self-end rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {
                copy.applyFilters
              }
            </button>

            <Link
              href="/admin/usuarios"
              className="self-end rounded-xl border border-black/10 px-5 py-3 text-center text-sm font-semibold text-zinc-600 transition hover:border-red-400 hover:text-red-600 dark:border-white/10 dark:text-zinc-300"
            >
              {
                copy.clearFilters
              }
            </Link>
          </form>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
          {
            usersResult
              .users
              .length ===
            0
              ? (
                  <div className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
                      👥
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-zinc-950 dark:text-white">
                      {
                        copy.emptyTitle
                      }
                    </h2>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      {
                        copy.emptyDescription
                      }
                    </p>
                  </div>
                )
              : (
                  <div className="overflow-x-auto">
                    <table className="min-w-[1120px] w-full border-collapse text-left">
                      <thead className="bg-zinc-50 dark:bg-zinc-950">
                        <tr className="border-b border-black/10 dark:border-white/10">
                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
                            {
                              copy.user
                            }
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
                            {
                              copy.email
                            }
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
                            {
                              copy.role
                            }
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
                            {
                              copy.status
                            }
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
                            {
                              copy.verification
                            }
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
                            {
                              copy.createdAt
                            }
                          </th>

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
                            {
                              copy.actions
                            }
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {
                          usersResult
                            .users
                            .map(
                              (
                                user,
                              ) => {
                                const isOwnAccount =
                                  user.id ===
                                  administrator.id;

                                const userRole =
                                  normalizeManagedUserRole(
                                    user.role,
                                  );

                                const userStatus =
                                  normalizeManagedUserStatus(
                                    user.status,
                                  );

                                return (
                                  <tr
                                    key={
                                      user.id
                                    }
                                    className="border-b border-black/5 align-top last:border-b-0 dark:border-white/5"
                                  >
                                    <td className="px-5 py-5">
                                      <p className="font-semibold text-zinc-950 dark:text-white">
                                        {
                                          user.displayName
                                        }
                                      </p>

                                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                        {
                                          user.firstName
                                        }{" "}
                                        {
                                          user.lastName
                                        }
                                      </p>

                                      {
                                        isOwnAccount
                                          ? (
                                              <span className="mt-2 inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                                {
                                                  copy.ownAccount
                                                }
                                              </span>
                                            )
                                          : null
                                      }
                                    </td>

                                    <td className="px-5 py-5 text-sm text-zinc-600 dark:text-zinc-300">
                                      {
                                        user.email
                                      }
                                    </td>

                                    <td className="px-5 py-5">
                                      <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                        {
                                          getRoleLabel(
                                            userRole,
                                          )
                                        }
                                      </span>
                                    </td>

                                    <td className="px-5 py-5">
                                      <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClassName(
                                          userStatus,
                                        )}`}
                                      >
                                        {
                                          getStatusLabel(
                                            userStatus,
                                          )
                                        }
                                      </span>
                                    </td>

                                    <td className="px-5 py-5">
                                      <span
                                        className={`text-sm font-medium ${
                                          user.emailVerifiedAt
                                            ? "text-emerald-700 dark:text-emerald-400"
                                            : "text-amber-700 dark:text-amber-400"
                                        }`}
                                      >
                                        {
                                          user.emailVerifiedAt
                                            ? copy.verified
                                            : copy.notVerified
                                        }
                                      </span>
                                    </td>

                                    <td className="px-5 py-5 text-sm text-zinc-600 dark:text-zinc-300">
                                      {
                                        formatDate(
                                          user.createdAt,
                                        )
                                      }
                                    </td>

                                    <td className="px-5 py-5">
                                      {
                                        isOwnAccount
                                          ? (
                                              <p className="max-w-56 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                                                {
                                                  copy.ownAccountProtected
                                                }
                                              </p>
                                            )
                                          : (
                                              <form
                                                action={
                                                  updateManagedUserAction
                                                }
                                                className="grid min-w-60 gap-2"
                                              >
                                                <input
                                                  type="hidden"
                                                  name="userId"
                                                  value={
                                                    user.id
                                                  }
                                                />

                                                <input
                                                  type="hidden"
                                                  name="returnTo"
                                                  value={
                                                    currentReturnTo
                                                  }
                                                />

                                                <select
                                                  name="role"
                                                  defaultValue={
                                                    userRole
                                                  }
                                                  aria-label={
                                                    copy.role
                                                  }
                                                  className="h-10 rounded-lg border border-black/10 bg-zinc-50 px-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                                                >
                                                  <option value="USER">
                                                    {
                                                      copy.userRole
                                                    }
                                                  </option>

                                                  <option value="ADMIN">
                                                    {
                                                      copy.adminRole
                                                    }
                                                  </option>
                                                </select>

                                                <select
                                                  name="status"
                                                  defaultValue={
                                                    userStatus
                                                  }
                                                  aria-label={
                                                    copy.status
                                                  }
                                                  className="h-10 rounded-lg border border-black/10 bg-zinc-50 px-3 text-sm text-zinc-950 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                                                >
                                                  <option value="ACTIVE">
                                                    {
                                                      copy.active
                                                    }
                                                  </option>

                                                  <option value="PENDING_VERIFICATION">
                                                    {
                                                      copy.pending
                                                    }
                                                  </option>

                                                  <option value="LOCKED">
                                                    {
                                                      copy.locked
                                                    }
                                                  </option>

                                                  <option value="DISABLED">
                                                    {
                                                      copy.disabled
                                                    }
                                                  </option>
                                                </select>

                                                <button
                                                  type="submit"
                                                  className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                                >
                                                  {
                                                    copy.save
                                                  }
                                                </button>
                                              </form>
                                            )
                                      }
                                    </td>
                                  </tr>
                                );
                              },
                            )
                        }
                      </tbody>
                    </table>
                  </div>
                )
          }

          <div className="flex flex-col gap-4 border-t border-black/10 px-5 py-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {
                copy.showing
              }{" "}

              <strong className="text-zinc-950 dark:text-white">
                {
                  usersResult
                    .pagination
                    .totalItems
                }
              </strong>{" "}

              {
                copy.results
              }
            </p>

            <nav className="flex items-center gap-3">
              <Link
                href={
                  createUsersUrl({
                    page:
                      Math.max(
                        1,
                        usersResult
                          .pagination
                          .page -
                          1,
                      ),

                    query,

                    role:
                      selectedRole,

                    status:
                      selectedStatus,
                  })
                }
                aria-disabled={
                  !usersResult
                    .pagination
                    .hasPreviousPage
                }
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                  usersResult
                    .pagination
                    .hasPreviousPage
                    ? "border-black/10 text-zinc-700 hover:border-emerald-500 dark:border-white/10 dark:text-zinc-200"
                    : "pointer-events-none border-black/5 text-zinc-300 dark:border-white/5 dark:text-zinc-600"
                }`}
              >
                {
                  copy.previous
                }
              </Link>

              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {
                  copy.page
                }{" "}

                <strong className="text-zinc-950 dark:text-white">
                  {
                    usersResult
                      .pagination
                      .page
                  }
                </strong>{" "}

                {
                  copy.of
                }{" "}

                <strong className="text-zinc-950 dark:text-white">
                  {
                    Math.max(
                      usersResult
                        .pagination
                        .totalPages,
                      1,
                    )
                  }
                </strong>
              </span>

              <Link
                href={
                  createUsersUrl({
                    page:
                      usersResult
                        .pagination
                        .page +
                      1,

                    query,

                    role:
                      selectedRole,

                    status:
                      selectedStatus,
                  })
                }
                aria-disabled={
                  !usersResult
                    .pagination
                    .hasNextPage
                }
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                  usersResult
                    .pagination
                    .hasNextPage
                    ? "border-black/10 text-zinc-700 hover:border-emerald-500 dark:border-white/10 dark:text-zinc-200"
                    : "pointer-events-none border-black/5 text-zinc-300 dark:border-white/5 dark:text-zinc-600"
                }`}
              >
                {
                  copy.next
                }
              </Link>
            </nav>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4">
          <p className="text-sm leading-6 text-amber-800 dark:text-amber-300">
            🔐 {
              copy.securityNotice
            }
          </p>
        </section>
      </div>
    </main>
  );
}
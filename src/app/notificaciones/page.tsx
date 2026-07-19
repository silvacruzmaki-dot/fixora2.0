"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useLanguage from "@/hooks/language/useLanguage";

type NotificationType =
  | "ACCOUNT"
  | "SECURITY"
  | "PROJECT"
  | "SERVICE"
  | "SYSTEM";

interface NotificationItem {
  id: string;
  type: NotificationType;

  titleEs: string;
  titleEn: string;

  messageEs: string;
  messageEn: string;

  actionUrl: string | null;

  isRead: boolean;
  readAt: string | null;

  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface NotificationFilters {
  unreadOnly: boolean;
  type: NotificationType | null;
}

interface NotificationsApiData {
  authenticated: boolean;

  notifications: NotificationItem[];

  unreadCount: number;

  pagination: PaginationData;

  filters: NotificationFilters;
}

interface MarkNotificationApiData {
  authenticated: boolean;

  notification: NotificationItem;

  alreadyRead: boolean;
  unreadCount: number;
}

interface MarkAllNotificationsApiData {
  authenticated: boolean;

  markedCount: number;
  unreadCount: number;

  readAt: string;
}

interface LocalizedApiMessage {
  es?: string;
  en?: string;
}

interface ApiResponse<TData> {
  ok: boolean;
  code: string;

  message?: LocalizedApiMessage;

  data?: TData;

  fieldErrors?: Record<
    string,
    string[]
  >;
}

const NOTIFICATIONS_COPY = {
  es: {
    pageTitle: "Notificaciones",

    pageDescription:
      "Consulta las novedades, alertas de seguridad y mensajes relacionados con tu cuenta FIXORA.",

    loading:
      "Cargando notificaciones...",

    loadError:
      "No fue posible cargar tus notificaciones.",

    emptyTitle:
      "No tienes notificaciones",

    emptyDescription:
      "Cuando exista una novedad importante, aparecerá en esta sección.",

    unreadEmptyTitle:
      "No tienes notificaciones pendientes",

    unreadEmptyDescription:
      "Todas tus notificaciones ya fueron leídas.",

    unreadCount:
      "Pendientes",

    allNotifications:
      "Todas",

    unreadOnly:
      "Solo no leídas",

    allTypes:
      "Todos los tipos",

    account:
      "Cuenta",

    security:
      "Seguridad",

    project:
      "Proyecto",

    service:
      "Servicio",

    system:
      "Sistema",

    markAsRead:
      "Marcar como leída",

    markingAsRead:
      "Marcando...",

    markAllAsRead:
      "Marcar todas como leídas",

    markingAllAsRead:
      "Marcando todas...",

    alreadyRead:
      "Leída",

    unread:
      "Nueva",

    open:
      "Abrir",

    previous:
      "Anterior",

    next:
      "Siguiente",

    page:
      "Página",

    of:
      "de",

    retry:
      "Reintentar",

    sessionExpired:
      "Tu sesión venció. Debes iniciar sesión nuevamente.",

    unexpectedError:
      "Ocurrió un problema inesperado. Inténtalo nuevamente.",

    markedAsRead:
      "La notificación fue marcada como leída.",

    allMarkedAsRead:
      "Todas las notificaciones fueron marcadas como leídas.",

    alreadyAllRead:
      "Todas las notificaciones ya estaban leídas.",

    filters:
      "Filtros",

    clearFilters:
      "Limpiar filtros",
  },

  en: {
    pageTitle: "Notifications",

    pageDescription:
      "Review updates, security alerts, and messages related to your FIXORA account.",

    loading:
      "Loading notifications...",

    loadError:
      "Your notifications could not be loaded.",

    emptyTitle:
      "You have no notifications",

    emptyDescription:
      "Important updates will appear in this section.",

    unreadEmptyTitle:
      "You have no pending notifications",

    unreadEmptyDescription:
      "All your notifications have already been read.",

    unreadCount:
      "Pending",

    allNotifications:
      "All",

    unreadOnly:
      "Unread only",

    allTypes:
      "All types",

    account:
      "Account",

    security:
      "Security",

    project:
      "Project",

    service:
      "Service",

    system:
      "System",

    markAsRead:
      "Mark as read",

    markingAsRead:
      "Marking...",

    markAllAsRead:
      "Mark all as read",

    markingAllAsRead:
      "Marking all...",

    alreadyRead:
      "Read",

    unread:
      "New",

    open:
      "Open",

    previous:
      "Previous",

    next:
      "Next",

    page:
      "Page",

    of:
      "of",

    retry:
      "Try again",

    sessionExpired:
      "Your session expired. You must sign in again.",

    unexpectedError:
      "An unexpected problem occurred. Please try again.",

    markedAsRead:
      "The notification was marked as read.",

    allMarkedAsRead:
      "All notifications were marked as read.",

    alreadyAllRead:
      "All notifications were already read.",

    filters:
      "Filters",

    clearFilters:
      "Clear filters",
  },
} as const;

function getApiMessage<TData>(
  response: ApiResponse<TData>,
  language: "es" | "en",
  fallback: string,
): string {
  const localizedMessage =
    response.message?.[language];

  if (
    typeof localizedMessage === "string" &&
    localizedMessage.trim().length > 0
  ) {
    return localizedMessage;
  }

  return fallback;
}

function isInternalActionUrl(
  actionUrl: string | null,
): actionUrl is string {
  return Boolean(
    actionUrl &&
      actionUrl.startsWith("/") &&
      !actionUrl.startsWith("//"),
  );
}

export default function NotificationsPage() {
  const router = useRouter();

  const { language } = useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    NOTIFICATIONS_COPY[currentLanguage];

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [pagination, setPagination] =
    useState<PaginationData>({
      page: 1,
      pageSize: 20,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    });

  const [page, setPage] =
    useState(1);

  const [unreadOnly, setUnreadOnly] =
    useState(false);

  const [
    selectedType,
    setSelectedType,
  ] = useState<
    NotificationType | ""
  >("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isMarkingAll,
    setIsMarkingAll,
  ] = useState(false);

  const [
    markingNotificationId,
    setMarkingNotificationId,
  ] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(null);

  const redirectToLogin =
    useCallback(() => {
      router.replace(
        "/iniciar-sesion?redirect=/notificaciones",
      );
    }, [router]);

  const notificationTypeLabels =
    useMemo(
      () => ({
        ACCOUNT: copy.account,
        SECURITY: copy.security,
        PROJECT: copy.project,
        SERVICE: copy.service,
        SYSTEM: copy.system,
      }),
      [
        copy.account,
        copy.project,
        copy.security,
        copy.service,
        copy.system,
      ],
    );

  const formatNotificationDate =
    useCallback(
      (dateValue: string) => {
        const date = new Date(
          dateValue,
        );

        if (
          Number.isNaN(
            date.getTime(),
          )
        ) {
          return dateValue;
        }

        return new Intl.DateTimeFormat(
          currentLanguage === "en"
            ? "en-US"
            : "es-PE",
          {
            dateStyle: "medium",
            timeStyle: "short",
          },
        ).format(date);
      },
      [currentLanguage],
    );

  const loadNotifications =
    useCallback(
      async (
        signal?: AbortSignal,
      ) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          const searchParams =
            new URLSearchParams({
              page: String(page),
              pageSize: "20",
              unreadOnly: String(
                unreadOnly,
              ),
            });

          if (selectedType) {
            searchParams.set(
              "type",
              selectedType,
            );
          }

          const response =
            await fetch(
              `/api/notificaciones?${searchParams.toString()}`,
              {
                method: "GET",

                credentials:
                  "include",

                cache: "no-store",

                headers: {
                  Accept:
                    "application/json",
                },

                signal,
              },
            );

          const payload =
            (await response.json()) as
              ApiResponse<NotificationsApiData>;

          if (
            response.status === 401
          ) {
            redirectToLogin();

            return;
          }

          if (
            !response.ok ||
            !payload.data
          ) {
            throw new Error(
              getApiMessage(
                payload,
                currentLanguage,
                copy.loadError,
              ),
            );
          }

          setNotifications(
            payload.data.notifications,
          );

          setUnreadCount(
            payload.data.unreadCount,
          );

          setPagination(
            payload.data.pagination,
          );
        } catch (error: unknown) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          setErrorMessage(
            error instanceof Error
              ? error.message
              : copy.loadError,
          );
        } finally {
          if (!signal?.aborted) {
            setIsLoading(false);
          }
        }
      },
      [
        copy.loadError,
        currentLanguage,
        page,
        redirectToLogin,
        selectedType,
        unreadOnly,
      ],
    );

  useEffect(() => {
    const abortController =
      new AbortController();

    const timeoutId =
      window.setTimeout(
        () => {
          void loadNotifications(
            abortController.signal,
          );
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );

      abortController.abort();
    };
  }, [loadNotifications]);

  useEffect(() => {
    document.title =
      `FIXORA | ${copy.pageTitle}`;
  }, [copy.pageTitle]);

  const handleUnreadFilterChange =
    () => {
      setPage(1);
      setSuccessMessage(null);
      setErrorMessage(null);

      setUnreadOnly(
        (currentValue) =>
          !currentValue,
      );
    };

  const handleTypeChange = (
    value:
      | NotificationType
      | "",
  ) => {
    setPage(1);
    setSuccessMessage(null);
    setErrorMessage(null);
    setSelectedType(value);
  };

  const handleClearFilters =
    () => {
      setPage(1);
      setUnreadOnly(false);
      setSelectedType("");
      setSuccessMessage(null);
      setErrorMessage(null);
    };

  const handleMarkAsRead =
    async (
      notificationId: string,
    ) => {
      if (
        markingNotificationId ||
        isMarkingAll
      ) {
        return;
      }

      setMarkingNotificationId(
        notificationId,
      );

      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response =
          await fetch(
            `/api/notificaciones/${encodeURIComponent(
              notificationId,
            )}/leer`,
            {
              method: "POST",

              credentials:
                "include",

              headers: {
                Accept:
                  "application/json",
              },
            },
          );

        const payload =
          (await response.json()) as
            ApiResponse<MarkNotificationApiData>;

        if (
          response.status === 401
        ) {
          redirectToLogin();

          return;
        }

        if (
          !response.ok ||
          !payload.data
        ) {
          throw new Error(
            getApiMessage(
              payload,
              currentLanguage,
              copy.unexpectedError,
            ),
          );
        }

        setUnreadCount(
          payload.data.unreadCount,
        );

        if (
          unreadOnly &&
          !payload.data.notification
            .isRead
        ) {
          await loadNotifications();

          return;
        }

        if (unreadOnly) {
          setNotifications(
            (
              currentNotifications,
            ) =>
              currentNotifications.filter(
                (notification) =>
                  notification.id !==
                  notificationId,
              ),
          );

          setPagination(
            (
              currentPagination,
            ) => ({
              ...currentPagination,

              totalCount:
                Math.max(
                  0,
                  currentPagination
                    .totalCount - 1,
                ),
            }),
          );
        } else {
          setNotifications(
            (
              currentNotifications,
            ) =>
              currentNotifications.map(
                (notification) =>
                  notification.id ===
                  notificationId
                    ? payload.data
                        ?.notification ??
                      notification
                    : notification,
              ),
          );
        }

        setSuccessMessage(
          payload.data.alreadyRead
            ? copy.alreadyRead
            : copy.markedAsRead,
        );
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : copy.unexpectedError,
        );
      } finally {
        setMarkingNotificationId(
          null,
        );
      }
    };

  const handleMarkAllAsRead =
    async () => {
      if (
        isMarkingAll ||
        markingNotificationId
      ) {
        return;
      }

      setIsMarkingAll(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response =
          await fetch(
            "/api/notificaciones/leer-todas",
            {
              method: "POST",

              credentials:
                "include",

              headers: {
                Accept:
                  "application/json",
              },
            },
          );

        const payload =
          (await response.json()) as
            ApiResponse<MarkAllNotificationsApiData>;

        if (
          response.status === 401
        ) {
          redirectToLogin();

          return;
        }

        if (
          !response.ok ||
          !payload.data
        ) {
          throw new Error(
            getApiMessage(
              payload,
              currentLanguage,
              copy.unexpectedError,
            ),
          );
        }

        setUnreadCount(
          payload.data.unreadCount,
        );

        if (unreadOnly) {
          setNotifications([]);
        } else {
          setNotifications(
            (
              currentNotifications,
            ) =>
              currentNotifications.map(
                (notification) => ({
                  ...notification,

                  isRead: true,

                  readAt:
                    notification.readAt ??
                    payload.data
                      ?.readAt ??
                    new Date()
                      .toISOString(),
                }),
              ),
          );
        }

        setSuccessMessage(
          payload.data.markedCount ===
            0
            ? copy.alreadyAllRead
            : copy.allMarkedAsRead,
        );
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : copy.unexpectedError,
        );
      } finally {
        setIsMarkingAll(false);
      }
    };

  const hasActiveFilters =
    unreadOnly ||
    selectedType !== "";

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-5 border-b border-black/10 pb-7 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              FIXORA
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              {copy.pageTitle}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
              {copy.pageDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                {copy.unreadCount}
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {unreadCount}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void handleMarkAllAsRead();
              }}
              disabled={
                isMarkingAll ||
                markingNotificationId !==
                  null ||
                unreadCount === 0
              }
              className="min-h-12 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMarkingAll
                ? copy.markingAllAsRead
                : copy.markAllAsRead}
            </button>
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
                {copy.filters}
              </h2>

              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={
                    handleUnreadFilterChange
                  }
                  aria-pressed={
                    unreadOnly
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    unreadOnly
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-black/10 bg-zinc-50 text-zinc-700 hover:border-emerald-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200"
                  }`}
                >
                  {unreadOnly
                    ? copy.unreadOnly
                    : copy.allNotifications}
                </button>

                <select
                  value={
                    selectedType
                  }
                  onChange={(event) => {
                    handleTypeChange(
                      event.target
                        .value as
                        | NotificationType
                        | "",
                    );
                  }}
                  aria-label={
                    copy.allTypes
                  }
                  className="h-10 rounded-full border border-black/10 bg-zinc-50 px-4 text-sm font-semibold text-zinc-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200"
                >
                  <option value="">
                    {copy.allTypes}
                  </option>

                  <option value="ACCOUNT">
                    {copy.account}
                  </option>

                  <option value="SECURITY">
                    {copy.security}
                  </option>

                  <option value="PROJECT">
                    {copy.project}
                  </option>

                  <option value="SERVICE">
                    {copy.service}
                  </option>

                  <option value="SYSTEM">
                    {copy.system}
                  </option>
                </select>

                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={
                      handleClearFilters
                    }
                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-red-400 hover:text-red-600 dark:border-white/10 dark:text-zinc-300"
                  >
                    {copy.clearFilters}
                  </button>
                ) : null}
              </div>
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {copy.page}{" "}
              <strong className="text-zinc-900 dark:text-white">
                {pagination.page}
              </strong>{" "}
              {copy.of}{" "}
              <strong className="text-zinc-900 dark:text-white">
                {Math.max(
                  pagination.totalPages,
                  1,
                )}
              </strong>
            </p>
          </div>
        </section>

        <div
          className="mt-5"
          aria-live="polite"
        >
          {errorMessage ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              {successMessage}
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <section className="mt-6 flex min-h-72 items-center justify-center rounded-3xl border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />

              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {copy.loading}
              </span>
            </div>
          </section>
        ) : errorMessage &&
          notifications.length ===
            0 ? (
          <section className="mt-6 rounded-3xl border border-red-500/20 bg-white p-8 text-center dark:bg-zinc-900">
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
              {copy.loadError}
            </h2>

            <button
              type="button"
              onClick={() => {
                void loadNotifications();
              }}
              className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {copy.retry}
            </button>
          </section>
        ) : notifications.length ===
          0 ? (
          <section className="mt-6 rounded-3xl border border-black/10 bg-white px-6 py-14 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
              🔔
            </div>

            <h2 className="mt-5 text-xl font-bold text-zinc-950 dark:text-white">
              {unreadOnly
                ? copy.unreadEmptyTitle
                : copy.emptyTitle}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {unreadOnly
                ? copy.unreadEmptyDescription
                : copy.emptyDescription}
            </p>
          </section>
        ) : (
          <section className="mt-6 grid gap-4">
            {notifications.map(
              (notification) => {
                const title =
                  currentLanguage ===
                  "en"
                    ? notification.titleEn
                    : notification.titleEs;

                const message =
                  currentLanguage ===
                  "en"
                    ? notification.messageEn
                    : notification.messageEs;

                const isMarking =
                  markingNotificationId ===
                  notification.id;

                return (
                  <article
                    key={
                      notification.id
                    }
                    className={`rounded-3xl border bg-white p-5 shadow-sm transition dark:bg-zinc-900 sm:p-6 ${
                      notification.isRead
                        ? "border-black/10 opacity-80 dark:border-white/10"
                        : "border-emerald-500/30 shadow-emerald-500/5"
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            {
                              notificationTypeLabels[
                                notification
                                  .type
                              ]
                            }
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              notification.isRead
                                ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            }`}
                          >
                            {notification.isRead
                              ? copy.alreadyRead
                              : copy.unread}
                          </span>
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-zinc-950 dark:text-white">
                          {title}
                        </h2>

                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                          {message}
                        </p>

                        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                          {formatNotificationDate(
                            notification.createdAt,
                          )}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                        {!notification.isRead ? (
                          <button
                            type="button"
                            onClick={() => {
                              void handleMarkAsRead(
                                notification.id,
                              );
                            }}
                            disabled={
                              isMarking ||
                              isMarkingAll
                            }
                            className="rounded-xl border border-emerald-500/30 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400"
                          >
                            {isMarking
                              ? copy.markingAsRead
                              : copy.markAsRead}
                          </button>
                        ) : null}

                        {isInternalActionUrl(
                          notification.actionUrl,
                        ) ? (
                          <Link
                            href={
                              notification.actionUrl
                            }
                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            {copy.open}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </section>
        )}

        {!isLoading &&
        notifications.length > 0 ? (
          <nav
            className="mt-7 flex items-center justify-between gap-4"
            aria-label="Pagination"
          >
            <button
              type="button"
              onClick={() => {
                setPage(
                  (currentPage) =>
                    Math.max(
                      1,
                      currentPage - 1,
                    ),
                );
              }}
              disabled={
                !pagination.hasPreviousPage
              }
              className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {copy.previous}
            </button>

            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {copy.page}{" "}
              <strong className="text-zinc-950 dark:text-white">
                {pagination.page}
              </strong>{" "}
              {copy.of}{" "}
              <strong className="text-zinc-950 dark:text-white">
                {Math.max(
                  pagination.totalPages,
                  1,
                )}
              </strong>
            </span>

            <button
              type="button"
              onClick={() => {
                setPage(
                  (currentPage) =>
                    currentPage + 1,
                );
              }}
              disabled={
                !pagination.hasNextPage
              }
              className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {copy.next}
            </button>
          </nav>
        ) : null}
      </div>
    </main>
  );
}
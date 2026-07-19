"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AUTH_API_ROUTES } from "@/constants/auth/auth.routes";

import {
  isAuthLanguage,
  isAuthRole,
  isAuthTheme,
  isAuthUserStatus,
  type AuthLanguage,
  type AuthRole,
  type AuthTheme,
  type AuthUserStatus,
} from "@/constants/auth/auth.constants";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export interface AuthContextUser {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;
  avatarUrl: string | null;

  role: AuthRole;
  status: AuthUserStatus;

  preferredLanguage: AuthLanguage;
  preferredTheme: AuthTheme;

  emailVerified?: boolean;
  emailVerifiedAt: string | null;

  createdAt: string;
  updatedAt?: string;
}

export interface AuthContextSession {
  id?: string;

  expiresAt: string;
  rememberMe: boolean;

  createdAt?: string;
  lastSeenAt?: string;
}

export interface AuthenticatedAuthSnapshot {
  user: AuthContextUser;

  session?: AuthContextSession | null;

  unreadNotificationCount?: number;
}

export interface AuthContextError {
  code: string;
  message: string;

  httpStatus?: number;
}

export interface RefreshSessionOptions {
  silent?: boolean;
}

export type UnreadNotificationCountUpdater =
  | number
  | ((
      currentCount: number,
    ) => number);

export interface AuthContextValue {
  status: AuthStatus;

  user: AuthContextUser | null;
  session: AuthContextSession | null;

  unreadNotificationCount: number;

  error: AuthContextError | null;

  isLoading: boolean;
  isAuthenticated: boolean;
  isAdministrator: boolean;

  refreshSession: (
    options?: RefreshSessionOptions,
  ) => Promise<AuthenticatedAuthSnapshot | null>;

  applyAuthenticatedSession: (
    snapshot: AuthenticatedAuthSnapshot,
  ) => void;

  updateUser: (
    updates: Partial<AuthContextUser>,
  ) => void;

  setUnreadNotificationCount: (
    updater: UnreadNotificationCountUpdater,
  ) => void;

  signOut: () => Promise<boolean>;

  clearAuthError: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;

  initialState?:
    | AuthenticatedAuthSnapshot
    | null;

  revalidateOnMount?: boolean;
  revalidateOnFocus?: boolean;
}

interface LocalizedApiMessage {
  es?: string;
  en?: string;
}

interface ApiResponse<TData> {
  ok?: boolean;
  code?: string;

  message?:
    | string
    | LocalizedApiMessage;

  data?: TData;
}

interface SessionApiData {
  authenticated?: boolean;

  user?: unknown;
  session?: unknown;

  unreadNotificationCount?: unknown;
}

const AUTH_CONTEXT_COPY = {
  es: {
    sessionError:
      "No fue posible comprobar la sesión.",

    invalidSessionResponse:
      "El servidor devolvió una respuesta de sesión inválida.",

    signOutError:
      "No fue posible cerrar la sesión.",
  },

  en: {
    sessionError:
      "The session could not be verified.",

    invalidSessionResponse:
      "The server returned an invalid session response.",

    signOutError:
      "The session could not be closed.",
  },
} as const;

const FOCUS_REVALIDATION_COOLDOWN_MS =
  30_000;

const EMPTY_DATE_VALUE = "";

export const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

function getBrowserLanguage():
  | "es"
  | "en" {
  if (
    typeof navigator !==
    "undefined"
  ) {
    return navigator.language
      .toLowerCase()
      .startsWith("en")
      ? "en"
      : "es";
  }

  return "es";
}

function normalizeUnreadCount(
  value: unknown,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value),
  );
}

function normalizeApiCode(
  value: unknown,
): string {
  if (
    typeof value !== "string"
  ) {
    return "UNKNOWN_ERROR";
  }

  return (
    value
      .trim()
      .toUpperCase()
      .replaceAll("-", "_")
      .replaceAll(" ", "_") ||
    "UNKNOWN_ERROR"
  );
}

function getApiMessage(
  message:
    ApiResponse<unknown>["message"],
  fallback: string,
): string {
  if (
    typeof message === "string" &&
    message.trim()
  ) {
    return message.trim();
  }

  if (
    message &&
    typeof message === "object"
  ) {
    const language =
      getBrowserLanguage();

    const localizedMessage =
      message[language];

    if (
      typeof localizedMessage ===
        "string" &&
      localizedMessage.trim()
    ) {
      return localizedMessage.trim();
    }
  }

  return fallback;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function parseAuthContextUser(
  value: unknown,
): AuthContextUser | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.firstName !==
      "string" ||
    typeof value.lastName !==
      "string" ||
    typeof value.displayName !==
      "string" ||
    typeof value.email !==
      "string" ||
    !(
      typeof value.avatarUrl ===
        "string" ||
      value.avatarUrl === null
    ) ||
    !isAuthRole(value.role) ||
    !isAuthUserStatus(
      value.status,
    ) ||
    !isAuthLanguage(
      value.preferredLanguage,
    ) ||
    !isAuthTheme(
      value.preferredTheme,
    )
  ) {
    return null;
  }

  const emailVerifiedAt =
    typeof value.emailVerifiedAt ===
    "string"
      ? value.emailVerifiedAt
      : null;

  const emailVerified =
    typeof value.emailVerified ===
    "boolean"
      ? value.emailVerified
      : emailVerifiedAt !== null;

  return {
    id:
      value.id,

    firstName:
      value.firstName,

    lastName:
      value.lastName,

    displayName:
      value.displayName,

    email:
      value.email,

    avatarUrl:
      value.avatarUrl,

    role:
      value.role,

    status:
      value.status,

    preferredLanguage:
      value.preferredLanguage,

    preferredTheme:
      value.preferredTheme,

    emailVerified,

    emailVerifiedAt,

    createdAt:
      typeof value.createdAt ===
      "string"
        ? value.createdAt
        : EMPTY_DATE_VALUE,

    updatedAt:
      typeof value.updatedAt ===
      "string"
        ? value.updatedAt
        : undefined,
  };
}

function parseAuthContextSession(
  value: unknown,
): AuthContextSession | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.expiresAt !==
      "string" ||
    typeof value.rememberMe !==
      "boolean"
  ) {
    return null;
  }

  return {
    id:
      typeof value.id === "string"
        ? value.id
        : undefined,

    expiresAt:
      value.expiresAt,

    rememberMe:
      value.rememberMe,

    createdAt:
      typeof value.createdAt ===
      "string"
        ? value.createdAt
        : undefined,

    lastSeenAt:
      typeof value.lastSeenAt ===
      "string"
        ? value.lastSeenAt
        : undefined,
  };
}

function isAbortError(
  error: unknown,
): boolean {
  return (
    isRecord(error) &&
    error.name === "AbortError"
  );
}

export function AuthProvider({
  children,

  initialState,

  revalidateOnMount = true,
  revalidateOnFocus = true,
}: AuthProviderProps) {
  const initialStatus:
    AuthStatus =
    initialState
      ? "authenticated"
      : initialState === null
        ? "unauthenticated"
        : "loading";

  const [
    status,
    setStatus,
  ] =
    useState<AuthStatus>(
      initialStatus,
    );

  const [
    user,
    setUser,
  ] =
    useState<AuthContextUser | null>(
      initialState?.user ??
        null,
    );

  const [
    session,
    setSession,
  ] =
    useState<AuthContextSession | null>(
      initialState?.session ??
        null,
    );

  const [
    unreadNotificationCount,
    setUnreadNotificationCountState,
  ] = useState(
    normalizeUnreadCount(
      initialState
        ?.unreadNotificationCount,
    ),
  );

  const [
    error,
    setError,
  ] =
    useState<AuthContextError | null>(
      null,
    );

  const activeRequestRef =
    useRef<AbortController | null>(
      null,
    );

  const requestVersionRef =
    useRef(0);

  const lastRefreshAtRef =
    useRef(0);

  const isMountedRef =
    useRef(false);

  const clearSessionState =
    useCallback(() => {
      setUser(null);

      setSession(null);

      setUnreadNotificationCountState(
        0,
      );

      setError(null);

      setStatus(
        "unauthenticated",
      );
    }, []);

  const applyAuthenticatedSession =
    useCallback(
      (
        snapshot:
          AuthenticatedAuthSnapshot,
      ) => {
        setUser(
          snapshot.user,
        );

        setSession(
          snapshot.session ??
            null,
        );

        setUnreadNotificationCountState(
          normalizeUnreadCount(
            snapshot.unreadNotificationCount,
          ),
        );

        setError(null);

        setStatus(
          "authenticated",
        );

        lastRefreshAtRef.current =
          Date.now();
      },
      [],
    );

  const refreshSession =
    useCallback(
      async (
        options:
          RefreshSessionOptions = {},
      ): Promise<AuthenticatedAuthSnapshot | null> => {
        const {
          silent = false,
        } = options;

        const browserLanguage =
          getBrowserLanguage();

        const copy =
          AUTH_CONTEXT_COPY[
            browserLanguage
          ];

        activeRequestRef.current?.abort();

        const controller =
          new AbortController();

        activeRequestRef.current =
          controller;

        const requestVersion =
          requestVersionRef.current +
          1;

        requestVersionRef.current =
          requestVersion;

        setError(null);

        if (!silent) {
          setStatus(
            (
              currentStatus,
            ) =>
              currentStatus ===
              "authenticated"
                ? currentStatus
                : "loading",
          );
        }

        try {
          const response =
            await fetch(
              AUTH_API_ROUTES.SESSION,
              {
                method:
                  "GET",

                credentials:
                  "include",

                cache:
                  "no-store",

                headers: {
                  Accept:
                    "application/json",
                },

                signal:
                  controller.signal,
              },
            );

          const payload =
            (await response
              .json()
              .catch(
                () => null,
              )) as
              | ApiResponse<SessionApiData>
              | null;

          if (
            !isMountedRef.current ||
            requestVersion !==
              requestVersionRef.current
          ) {
            return null;
          }

          const sessionData =
            payload?.data;

          const unauthenticated =
            response.status === 401 ||
            response.status === 403 ||
            sessionData
              ?.authenticated ===
              false;

          if (unauthenticated) {
            clearSessionState();

            lastRefreshAtRef.current =
              Date.now();

            return null;
          }

          if (!response.ok) {
            const nextError:
              AuthContextError = {
              code:
                normalizeApiCode(
                  payload?.code,
                ),

              message:
                getApiMessage(
                  payload?.message,
                  copy.sessionError,
                ),

              httpStatus:
                response.status,
            };

            setError(
              nextError,
            );

            setStatus(
              (
                currentStatus,
              ) =>
                silent &&
                currentStatus ===
                  "authenticated"
                  ? "authenticated"
                  : "error",
            );

            return null;
          }

          const parsedUser =
            parseAuthContextUser(
              sessionData?.user,
            );

          if (!parsedUser) {
            setError({
              code:
                "INVALID_SESSION_RESPONSE",

              message:
                copy.invalidSessionResponse,

              httpStatus:
                response.status,
            });

            setStatus(
              (
                currentStatus,
              ) =>
                silent &&
                currentStatus ===
                  "authenticated"
                  ? "authenticated"
                  : "error",
            );

            return null;
          }

          const parsedSession =
            parseAuthContextSession(
              sessionData?.session,
            );

          const snapshot:
            AuthenticatedAuthSnapshot = {
            user:
              parsedUser,

            session:
              parsedSession,

            unreadNotificationCount:
              normalizeUnreadCount(
                sessionData
                  ?.unreadNotificationCount,
              ),
          };

          applyAuthenticatedSession(
            snapshot,
          );

          return snapshot;
        } catch (
          requestError: unknown
        ) {
          if (
            isAbortError(
              requestError,
            ) ||
            !isMountedRef.current ||
            requestVersion !==
              requestVersionRef.current
          ) {
            return null;
          }

          setError({
            code:
              "SESSION_REQUEST_FAILED",

            message:
              copy.sessionError,
          });

          setStatus(
            (
              currentStatus,
            ) =>
              silent &&
              currentStatus ===
                "authenticated"
                ? "authenticated"
                : "error",
          );

          return null;
        } finally {
          if (
            activeRequestRef.current ===
            controller
          ) {
            activeRequestRef.current =
              null;
          }
        }
      },
      [
        applyAuthenticatedSession,
        clearSessionState,
      ],
    );

  const updateUser =
    useCallback(
      (
        updates:
          Partial<AuthContextUser>,
      ) => {
        setUser(
          (
            currentUser,
          ) => {
            if (!currentUser) {
              return currentUser;
            }

            return {
              ...currentUser,
              ...updates,

              id:
                currentUser.id,

              email:
                updates.email ??
                currentUser.email,
            };
          },
        );
      },
      [],
    );

  const setUnreadNotificationCount =
    useCallback(
      (
        updater:
          UnreadNotificationCountUpdater,
      ) => {
        setUnreadNotificationCountState(
          (
            currentCount,
          ) => {
            const nextValue =
              typeof updater ===
              "function"
                ? updater(
                    currentCount,
                  )
                : updater;

            return normalizeUnreadCount(
              nextValue,
            );
          },
        );
      },
      [],
    );

  const clearAuthError =
    useCallback(() => {
      setError(null);
    }, []);

  const signOut =
    useCallback(
      async (): Promise<boolean> => {
        const browserLanguage =
          getBrowserLanguage();

        const copy =
          AUTH_CONTEXT_COPY[
            browserLanguage
          ];

        activeRequestRef.current?.abort();

        const controller =
          new AbortController();

        activeRequestRef.current =
          controller;

        requestVersionRef.current +=
          1;

        setError(null);

        try {
          const response =
            await fetch(
              AUTH_API_ROUTES.LOGOUT,
              {
                method:
                  "POST",

                credentials:
                  "include",

                cache:
                  "no-store",

                headers: {
                  Accept:
                    "application/json",
                },

                signal:
                  controller.signal,
              },
            );

          const payload =
            (await response
              .json()
              .catch(
                () => null,
              )) as
              | ApiResponse<unknown>
              | null;

          if (
            !isMountedRef.current
          ) {
            return false;
          }

          if (
            response.ok ||
            response.status === 401
          ) {
            clearSessionState();

            return true;
          }

          setError({
            code:
              normalizeApiCode(
                payload?.code,
              ),

            message:
              getApiMessage(
                payload?.message,
                copy.signOutError,
              ),

            httpStatus:
              response.status,
          });

          return false;
        } catch (
          requestError: unknown
        ) {
          if (
            isAbortError(
              requestError,
            ) ||
            !isMountedRef.current
          ) {
            return false;
          }

          setError({
            code:
              "SIGN_OUT_REQUEST_FAILED",

            message:
              copy.signOutError,
          });

          return false;
        } finally {
          if (
            activeRequestRef.current ===
            controller
          ) {
            activeRequestRef.current =
              null;
          }
        }
      },
      [
        clearSessionState,
      ],
    );

  useEffect(() => {
    isMountedRef.current =
      true;

    return () => {
      isMountedRef.current =
        false;

      activeRequestRef.current?.abort();

      activeRequestRef.current =
        null;
    };
  }, []);

  useEffect(() => {
    /*
     * Se ejecuta dentro de setTimeout para evitar
     * actualizaciones de estado síncronas directamente
     * dentro del efecto.
     */
    const timer =
      window.setTimeout(
        () => {
          if (
            revalidateOnMount
          ) {
            void refreshSession();

            return;
          }

          if (
            initialState ===
            undefined
          ) {
            clearSessionState();
          }
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    clearSessionState,
    initialState,
    refreshSession,
    revalidateOnMount,
  ]);

  useEffect(() => {
    if (
      !revalidateOnFocus
    ) {
      return;
    }

    const revalidate =
      () => {
        const now =
          Date.now();

        if (
          now -
            lastRefreshAtRef.current <
          FOCUS_REVALIDATION_COOLDOWN_MS
        ) {
          return;
        }

        if (
          document.visibilityState ===
          "hidden"
        ) {
          return;
        }

        void refreshSession({
          silent: true,
        });
      };

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          revalidate();
        }
      };

    window.addEventListener(
      "focus",
      revalidate,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      window.removeEventListener(
        "focus",
        revalidate,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [
    refreshSession,
    revalidateOnFocus,
  ]);

  useEffect(() => {
    if (
      !session?.expiresAt
    ) {
      return;
    }

    const expirationTime =
      new Date(
        session.expiresAt,
      ).getTime();

    if (
      !Number.isFinite(
        expirationTime,
      )
    ) {
      return;
    }

    const millisecondsUntilExpiration =
      expirationTime -
      Date.now();

    if (
      millisecondsUntilExpiration <=
      0
    ) {
      /*
       * Evita llamar setState directamente
       * dentro del cuerpo del efecto.
       */
      const expiredSessionTimer =
        window.setTimeout(
          clearSessionState,
          0,
        );

      return () => {
        window.clearTimeout(
          expiredSessionTimer,
        );
      };
    }

    const maximumTimeout =
      2_147_000_000;

    const timer =
      window.setTimeout(
        () => {
          void refreshSession({
            silent: true,
          });
        },
        Math.min(
          millisecondsUntilExpiration +
            1_000,
          maximumTimeout,
        ),
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    clearSessionState,
    refreshSession,
    session?.expiresAt,
  ]);

  const isAuthenticated =
    status ===
      "authenticated" &&
    user !== null;

  const isAdministrator =
    isAuthenticated &&
    user.role === "ADMIN";

  const contextValue =
    useMemo<AuthContextValue>(
      () => ({
        status,

        user,
        session,

        unreadNotificationCount,

        error,

        isLoading:
          status ===
          "loading",

        isAuthenticated,

        isAdministrator,

        refreshSession,

        applyAuthenticatedSession,

        updateUser,

        setUnreadNotificationCount,

        signOut,

        clearAuthError,
      }),
      [
        applyAuthenticatedSession,
        clearAuthError,
        error,
        isAdministrator,
        isAuthenticated,
        refreshSession,
        session,
        signOut,
        status,
        unreadNotificationCount,
        updateUser,
        user,
        setUnreadNotificationCount,
      ],
    );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}
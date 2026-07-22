"use client";

/*
 * Hook de interacciones del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Gestionar Me gusta.
 * - Gestionar favoritos.
 * - Aplicar actualizaciones optimistas.
 * - Restaurar el estado anterior cuando falla la API.
 * - Evitar operaciones duplicadas.
 * - Cancelar solicitudes pendientes.
 * - Redirigir al inicio de sesión cuando sea necesario.
 * - Mantener contadores sincronizados con el servidor.
 *
 * No contiene:
 * - Componentes visuales.
 * - Acceso directo a Prisma.
 * - Comentarios.
 * - Descargas.
 * - Compras.
 * - Solicitudes personalizadas.
 * - Funciones para compartir.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createCreativeItemFavoriteApiRoute,
  createCreativeItemLikeApiRoute,
  createCreativeLoginRoute,
  normalizeCreativeReturnTo,
} from "@/constants/creative/creative.routes";

import type {
  CreativeApiLanguage,
  CreativeApiResponse,
  CreativeFavoriteApiData,
  CreativeLikeApiData,
} from "@/types/creative/creative-api.types";

import type {
  CreativeItemId,
} from "@/types/creative/creative-item.types";

import {
  EMPTY_CREATIVE_CURRENT_INTERACTION_STATE,
  EMPTY_CREATIVE_INTERACTION_COUNTERS,
  EMPTY_CREATIVE_OPTIMISTIC_INTERACTION_STATE,
} from "@/types/creative/creative-interaction.types";

import type {
  CreativeCurrentInteractionState,
  CreativeInteractionCounters,
  CreativeInteractionOperationStatus,
  CreativeInteractionPermissions,
  CreativeInteractionToggleAction,
  CreativeInteractionType,
  CreativeOptimisticInteractionState,
} from "@/types/creative/creative-interaction.types";

/* =========================================================
   TIPO DE MUTACIÓN
   ========================================================= */

export type CreativeToggleInteractionKind =
  | "LIKE"
  | "FAVORITE";

/* =========================================================
   SOLICITUD DE AUTENTICACIÓN
   ========================================================= */

export interface CreativeInteractionAuthenticationRequest {
  action:
    CreativeToggleInteractionKind;

  returnTo:
    string;

  redirectTo:
    string;
}

/* =========================================================
   OPCIONES DEL HOOK
   ========================================================= */

export interface UseCreativeInteractionsOptions {
  /*
   * Identificador del diseño actual.
   */
  itemId:
    CreativeItemId | null | undefined;

  /*
   * Estado inicial del usuario actual.
   */
  initialState?:
    Partial<CreativeCurrentInteractionState>;

  /*
   * Contadores iniciales de la publicación.
   */
  initialCounters?:
    Partial<CreativeInteractionCounters>;

  /*
   * Permisos calculados por el servidor.
   */
  permissions?:
    Partial<CreativeInteractionPermissions>;

  /*
   * Idioma utilizado para mostrar errores.
   */
  language?:
    CreativeApiLanguage;

  /*
   * Permite desactivar temporalmente las interacciones.
   */
  enabled?:
    boolean;

  /*
   * Ruta a la que debe regresar después de iniciar sesión.
   */
  returnTo?:
    string;

  /*
   * Permite que el componente padre controle cómo se
   * presenta la solicitud de inicio de sesión.
   *
   * Cuando no se proporciona, el hook redirige directamente.
   */
  onAuthenticationRequired?:
    (
      request:
        CreativeInteractionAuthenticationRequest,
    ) => void;

  /*
   * Notifica al componente padre después de actualizar
   * correctamente el estado local.
   */
  onStateChange?:
    (
      state:
        CreativeCurrentInteractionState,
      counters:
        CreativeInteractionCounters,
    ) => void;
}

/* =========================================================
   RESULTADO DEL HOOK
   ========================================================= */

export interface UseCreativeInteractionsResult {
  itemId:
    string;

  current:
    CreativeCurrentInteractionState;

  counters:
    CreativeInteractionCounters;

  permissions:
    CreativeInteractionPermissions;

  optimistic:
    CreativeOptimisticInteractionState;

  mutationKind:
    CreativeToggleInteractionKind | null;

  mutationStatus:
    CreativeInteractionOperationStatus;

  liked:
    boolean;

  favorited:
    boolean;

  likesCount:
    number;

  favoritesCount:
    number;

  processing:
    boolean;

  processingLike:
    boolean;

  processingFavorite:
    boolean;

  canLike:
    boolean;

  canFavorite:
    boolean;

  likeError:
    string | null;

  favoriteError:
    string | null;

  errorMessage:
    string | null;

  hasError:
    boolean;

  toggleLike:
    () => Promise<boolean>;

  toggleFavorite:
    () => Promise<boolean>;

  replaceState:
    (
      state:
        Partial<CreativeCurrentInteractionState>,
      counters?:
        Partial<CreativeInteractionCounters>,
    ) => void;

  replacePermissions:
    (
      permissions:
        Partial<CreativeInteractionPermissions>,
    ) => void;

  updateCounters:
    (
      counters:
        Partial<CreativeInteractionCounters>,
    ) => void;

  clearError:
    (
      kind?:
        CreativeToggleInteractionKind,
    ) => void;

  cancelPendingMutation:
    () => void;
}

/* =========================================================
   PERMISOS PREDETERMINADOS
   ========================================================= */

const DEFAULT_CREATIVE_INTERACTION_PERMISSIONS:
  CreativeInteractionPermissions = {
    canView:
      true,

    canLike:
      false,

    canFavorite:
      false,

    canShare:
      true,

    canComment:
      false,

    canDownload:
      false,

    canPurchase:
      false,

    canRequest:
      false,

    canReport:
      false,

    requiresAuthenticationForLike:
      true,

    requiresAuthenticationForFavorite:
      true,

    requiresAuthenticationForComment:
      true,

    requiresAuthenticationForPurchase:
      true,

    requiresAuthenticationForRequest:
      true,
  };

/* =========================================================
   ESTADO INTERNO DE UNA MUTACIÓN
   ========================================================= */

interface CreativeInteractionMutationRuntime {
  sequence:
    number;

  kind:
    CreativeToggleInteractionKind | null;

  controller:
    AbortController | null;

  previousState:
    CreativeCurrentInteractionState | null;

  previousCounters:
    CreativeInteractionCounters | null;
}

/* =========================================================
   CREAR ESTADO INICIAL
   ========================================================= */

function createCreativeInitialInteractionState(
  initialState:
    Partial<CreativeCurrentInteractionState> | undefined,
): CreativeCurrentInteractionState {
  return {
    ...EMPTY_CREATIVE_CURRENT_INTERACTION_STATE,
    ...initialState,
  };
}

/* =========================================================
   CREAR CONTADORES INICIALES
   ========================================================= */

function createCreativeInitialCounters(
  initialCounters:
    Partial<CreativeInteractionCounters> | undefined,
): CreativeInteractionCounters {
  return {
    ...EMPTY_CREATIVE_INTERACTION_COUNTERS,
    ...initialCounters,

    viewsCount:
      normalizeCreativeInteractionCount(
        initialCounters?.viewsCount ??
        EMPTY_CREATIVE_INTERACTION_COUNTERS.viewsCount,
      ),

    likesCount:
      normalizeCreativeInteractionCount(
        initialCounters?.likesCount ??
        EMPTY_CREATIVE_INTERACTION_COUNTERS.likesCount,
      ),

    favoritesCount:
      normalizeCreativeInteractionCount(
        initialCounters?.favoritesCount ??
        EMPTY_CREATIVE_INTERACTION_COUNTERS.favoritesCount,
      ),

    sharesCount:
      normalizeCreativeInteractionCount(
        initialCounters?.sharesCount ??
        EMPTY_CREATIVE_INTERACTION_COUNTERS.sharesCount,
      ),

    commentsCount:
      normalizeCreativeInteractionCount(
        initialCounters?.commentsCount ??
        EMPTY_CREATIVE_INTERACTION_COUNTERS.commentsCount,
      ),

    downloadsCount:
      normalizeCreativeInteractionCount(
        initialCounters?.downloadsCount ??
        EMPTY_CREATIVE_INTERACTION_COUNTERS.downloadsCount,
      ),

    purchasesCount:
      normalizeCreativeInteractionCount(
        initialCounters?.purchasesCount ??
        EMPTY_CREATIVE_INTERACTION_COUNTERS.purchasesCount,
      ),

    requestsCount:
      normalizeCreativeInteractionCount(
        initialCounters?.requestsCount ??
        EMPTY_CREATIVE_INTERACTION_COUNTERS.requestsCount,
      ),
  };
}

/* =========================================================
   NORMALIZAR IDENTIFICADOR
   ========================================================= */

function normalizeCreativeInteractionItemId(
  itemId:
    CreativeItemId | null | undefined,
): string {
  if (
    typeof itemId !==
    "string"
  ) {
    return "";
  }

  return itemId.trim();
}

/* =========================================================
   NORMALIZAR CONTADOR
   ========================================================= */

function normalizeCreativeInteractionCount(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.trunc(
      value,
    ),
  );
}

/* =========================================================
   NORMALIZAR PERMISOS
   ========================================================= */

function normalizeCreativeInteractionPermissions(
  permissions:
    Partial<CreativeInteractionPermissions> | undefined,
): CreativeInteractionPermissions {
  return {
    ...DEFAULT_CREATIVE_INTERACTION_PERMISSIONS,
    ...permissions,
  };
}

/* =========================================================
   CLONAR ESTADO
   ========================================================= */

function cloneCreativeInteractionState(
  state:
    CreativeCurrentInteractionState,
): CreativeCurrentInteractionState {
  return {
    ...state,
  };
}

/* =========================================================
   CLONAR CONTADORES
   ========================================================= */

function cloneCreativeInteractionCounters(
  counters:
    CreativeInteractionCounters,
): CreativeInteractionCounters {
  return {
    ...counters,
  };
}

/* =========================================================
   DETECTAR CANCELACIÓN
   ========================================================= */

function isCreativeInteractionAbortError(
  error:
    unknown,
): boolean {
  return (
    error instanceof DOMException &&
    error.name ===
      "AbortError"
  );
}

/* =========================================================
   LEER RESPUESTA DE LA API
   ========================================================= */

async function readCreativeInteractionResponse<
  TData,
>(
  response:
    Response,
): Promise<
  CreativeApiResponse<TData> | null
> {
  return (
    await response
      .json()
      .catch(
        () =>
          null,
      )
  ) as
    | CreativeApiResponse<TData>
    | null;
}

/* =========================================================
   EXTRAER MENSAJE DE ERROR
   ========================================================= */

function getCreativeInteractionErrorMessage<
  TData,
>(
  payload:
    CreativeApiResponse<TData> | null,
  language:
    CreativeApiLanguage,
  fallback:
    string,
): string {
  if (
    payload &&
    payload.ok ===
      false
  ) {
    return payload.message[
      language
    ];
  }

  return fallback;
}

/* =========================================================
   MENSAJES PREDETERMINADOS
   ========================================================= */

function getCreativeInteractionFallbackError(
  kind:
    CreativeToggleInteractionKind,
  language:
    CreativeApiLanguage,
): string {
  if (
    kind ===
    "LIKE"
  ) {
    return language ===
      "en"
      ? "The like could not be updated."
      : "No fue posible actualizar Me gusta.";
  }

  return language ===
    "en"
    ? "The favorite could not be updated."
    : "No fue posible actualizar el favorito.";
}

/* =========================================================
   MENSAJE DE PERMISO
   ========================================================= */

function getCreativeInteractionPermissionError(
  kind:
    CreativeToggleInteractionKind,
  language:
    CreativeApiLanguage,
): string {
  if (
    kind ===
    "LIKE"
  ) {
    return language ===
      "en"
      ? "You do not have permission to like this design."
      : "No tienes permiso para dar Me gusta a este diseño.";
  }

  return language ===
    "en"
    ? "You do not have permission to save this design."
    : "No tienes permiso para guardar este diseño.";
}

/* =========================================================
   TIPO DE INTERACCIÓN
   ========================================================= */

function getCreativeInteractionType(
  kind:
    CreativeToggleInteractionKind,
): CreativeInteractionType {
  return kind;
}

/* =========================================================
   ACCIÓN DE INTERACCIÓN
   ========================================================= */

function getCreativeInteractionToggleAction(
  active:
    boolean,
): CreativeInteractionToggleAction {
  return active
    ? "REMOVE"
    : "ADD";
}

/* =========================================================
   HOOK PRINCIPAL
   ========================================================= */

export function useCreativeInteractions(
  options:
    UseCreativeInteractionsOptions,
): UseCreativeInteractionsResult {
  const {
    itemId,

    initialState,

    initialCounters,

    permissions:
      providedPermissions,

    language =
      "es",

    enabled =
      true,

    returnTo,

    onAuthenticationRequired,

    onStateChange,
  } =
    options;

  const normalizedItemId =
    normalizeCreativeInteractionItemId(
      itemId,
    );

  const normalizedReturnTo =
    normalizeCreativeReturnTo(
      returnTo,
    );

  /* =======================================================
     ESTADO ACTUAL
     ======================================================= */

  const [
    current,
    setCurrent,
  ] =
    useState<CreativeCurrentInteractionState>(
      () =>
        createCreativeInitialInteractionState(
          initialState,
        ),
    );

  const currentRef =
    useRef<CreativeCurrentInteractionState>(
      current,
    );

  /* =======================================================
     CONTADORES
     ======================================================= */

  const [
    counters,
    setCounters,
  ] =
    useState<CreativeInteractionCounters>(
      () =>
        createCreativeInitialCounters(
          initialCounters,
        ),
    );

  const countersRef =
    useRef<CreativeInteractionCounters>(
      counters,
    );

  /* =======================================================
     PERMISOS
     ======================================================= */

  const normalizedProvidedPermissions =
    useMemo(
      () =>
        normalizeCreativeInteractionPermissions(
          providedPermissions,
        ),
      [
        providedPermissions,
      ],
    );

  const [
    permissions,
    setPermissions,
  ] =
    useState<CreativeInteractionPermissions>(
      () =>
        normalizedProvidedPermissions,
    );

  /* =======================================================
     MUTACIÓN OPTIMISTA
     ======================================================= */

  const [
    optimistic,
    setOptimistic,
  ] =
    useState<CreativeOptimisticInteractionState>(
      () => ({
        ...EMPTY_CREATIVE_OPTIMISTIC_INTERACTION_STATE,
      }),
    );

  const [
    mutationKind,
    setMutationKind,
  ] =
    useState<
      CreativeToggleInteractionKind | null
    >(
      null,
    );

  const [
    mutationStatus,
    setMutationStatus,
  ] =
    useState<CreativeInteractionOperationStatus>(
      "IDLE",
    );

  /* =======================================================
     ERRORES
     ======================================================= */

  const [
    likeError,
    setLikeError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    favoriteError,
    setFavoriteError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  /* =======================================================
     REFERENCIA DE LA OPERACIÓN
     ======================================================= */

  const mutationRuntimeRef =
    useRef<CreativeInteractionMutationRuntime>({
      sequence:
        0,

      kind:
        null,

      controller:
        null,

      previousState:
        null,

      previousCounters:
        null,
    });

  /* =======================================================
     GUARDAR ESTADO Y CONTADORES
     ======================================================= */

  const commitInteractionSnapshot =
    useCallback(
      (
        nextState:
          CreativeCurrentInteractionState,
        nextCounters:
          CreativeInteractionCounters,
      ): void => {
        const normalizedCounters =
          createCreativeInitialCounters(
            nextCounters,
          );

        currentRef.current =
          nextState;

        countersRef.current =
          normalizedCounters;

        setCurrent(
          nextState,
        );

        setCounters(
          normalizedCounters,
        );

        onStateChange?.(
          nextState,
          normalizedCounters,
        );
      },
      [
        onStateChange,
      ],
    );

  /* =======================================================
     LIMPIAR REFERENCIA DE MUTACIÓN
     ======================================================= */

  const clearMutationRuntime =
    useCallback(
      (
        sequence:
          number,
      ): void => {
        mutationRuntimeRef.current = {
          sequence,

          kind:
            null,

          controller:
            null,

          previousState:
            null,

          previousCounters:
            null,
        };
      },
      [],
    );

  /* =======================================================
     SOLICITAR AUTENTICACIÓN
     ======================================================= */

  const requestAuthentication =
    useCallback(
      (
        action:
          CreativeToggleInteractionKind,
      ): void => {
        const redirectTo =
          createCreativeLoginRoute(
            normalizedReturnTo,
          );

        const request:
          CreativeInteractionAuthenticationRequest = {
            action,

            returnTo:
              normalizedReturnTo,

            redirectTo,
          };

        if (
          onAuthenticationRequired
        ) {
          onAuthenticationRequired(
            request,
          );

          return;
        }

        if (
          typeof window !==
          "undefined"
        ) {
          window.location.assign(
            redirectTo,
          );
        }
      },
      [
        normalizedReturnTo,
        onAuthenticationRequired,
      ],
    );

  /* =======================================================
     ACTUALIZAR ERROR POR TIPO
     ======================================================= */

  const setInteractionError =
    useCallback(
      (
        kind:
          CreativeToggleInteractionKind,
        message:
          string | null,
      ): void => {
        if (
          kind ===
          "LIKE"
        ) {
          setLikeError(
            message,
          );

          return;
        }

        setFavoriteError(
          message,
        );
      },
      [],
    );

  /* =======================================================
     RESTAURAR OPERACIÓN
     ======================================================= */

  const rollbackInteractionMutation =
    useCallback(
      (
        runtime:
          CreativeInteractionMutationRuntime,
      ): void => {
        if (
          !runtime.previousState ||
          !runtime.previousCounters
        ) {
          return;
        }

        commitInteractionSnapshot(
          cloneCreativeInteractionState(
            runtime.previousState,
          ),
          cloneCreativeInteractionCounters(
            runtime.previousCounters,
          ),
        );
      },
      [
        commitInteractionSnapshot,
      ],
    );

  /* =======================================================
     CANCELAR OPERACIÓN
     ======================================================= */

  const cancelPendingMutation =
    useCallback(
      (): void => {
        const runtime =
          mutationRuntimeRef.current;

        runtime.controller?.abort();

        const nextSequence =
          runtime.sequence +
          1;

        rollbackInteractionMutation(
          runtime,
        );

        clearMutationRuntime(
          nextSequence,
        );

        setMutationKind(
          null,
        );

        setMutationStatus(
          "IDLE",
        );

        setOptimistic({
          ...EMPTY_CREATIVE_OPTIMISTIC_INTERACTION_STATE,
        });
      },
      [
        clearMutationRuntime,
        rollbackInteractionMutation,
      ],
    );

  /* =======================================================
     REEMPLAZAR ESTADO
     ======================================================= */

  const replaceState =
    useCallback(
      (
        nextState:
          Partial<CreativeCurrentInteractionState>,
        nextCounters:
          Partial<CreativeInteractionCounters> = {},
      ): void => {
        const runtime =
          mutationRuntimeRef.current;

        runtime.controller?.abort();

        const nextSequence =
          runtime.sequence +
          1;

        clearMutationRuntime(
          nextSequence,
        );

        const mergedState:
          CreativeCurrentInteractionState = {
            ...currentRef.current,
            ...nextState,
          };

        const mergedCounters:
          CreativeInteractionCounters = {
            ...countersRef.current,
            ...nextCounters,
          };

        commitInteractionSnapshot(
          mergedState,
          mergedCounters,
        );

        setMutationKind(
          null,
        );

        setMutationStatus(
          "IDLE",
        );

        setOptimistic({
          ...EMPTY_CREATIVE_OPTIMISTIC_INTERACTION_STATE,
        });

        setLikeError(
          null,
        );

        setFavoriteError(
          null,
        );
      },
      [
        clearMutationRuntime,
        commitInteractionSnapshot,
      ],
    );

  /* =======================================================
     REEMPLAZAR PERMISOS
     ======================================================= */

  const replacePermissions =
    useCallback(
      (
        nextPermissions:
          Partial<CreativeInteractionPermissions>,
      ): void => {
        setPermissions(
          (
            currentPermissions,
          ) => ({
            ...currentPermissions,
            ...nextPermissions,
          }),
        );
      },
      [],
    );

  /* =======================================================
     ACTUALIZAR CONTADORES
     ======================================================= */

  const updateCounters =
    useCallback(
      (
        nextCounters:
          Partial<CreativeInteractionCounters>,
      ): void => {
        const mergedCounters:
          CreativeInteractionCounters = {
            ...countersRef.current,
            ...nextCounters,
          };

        commitInteractionSnapshot(
          cloneCreativeInteractionState(
            currentRef.current,
          ),
          mergedCounters,
        );
      },
      [
        commitInteractionSnapshot,
      ],
    );

  /* =======================================================
     LIMPIAR ERRORES
     ======================================================= */

  const clearError =
    useCallback(
      (
        kind?:
          CreativeToggleInteractionKind,
      ): void => {
        if (
          !kind ||
          kind ===
            "LIKE"
        ) {
          setLikeError(
            null,
          );
        }

        if (
          !kind ||
          kind ===
            "FAVORITE"
        ) {
          setFavoriteError(
            null,
          );
        }

        if (
          !kind
        ) {
          setMutationStatus(
            (
              currentStatus,
            ) =>
              currentStatus ===
              "ERROR"
                ? "IDLE"
                : currentStatus,
          );
        }
      },
      [],
    );

  /* =======================================================
     EJECUTAR INTERACCIÓN
     ======================================================= */

  const executeToggleInteraction =
    useCallback(
      async (
        kind:
          CreativeToggleInteractionKind,
      ): Promise<boolean> => {
        if (
          !enabled ||
          !normalizedItemId
        ) {
          return false;
        }

        /*
         * Solo se procesa una modificación optimista a la vez.
         * Esto impide que dos restauraciones se contradigan.
         */
        if (
          mutationRuntimeRef.current.kind !==
          null
        ) {
          return false;
        }

        const permissionAllowed =
          kind ===
          "LIKE"
            ? permissions.canLike
            : permissions.canFavorite;

        const authenticationRequired =
          kind ===
          "LIKE"
            ? permissions
                .requiresAuthenticationForLike
            : permissions
                .requiresAuthenticationForFavorite;

        if (
          !permissionAllowed
        ) {
          if (
            authenticationRequired
          ) {
            requestAuthentication(
              kind,
            );

            return false;
          }

          setInteractionError(
            kind,
            getCreativeInteractionPermissionError(
              kind,
              language,
            ),
          );

          return false;
        }

        const previousState =
          cloneCreativeInteractionState(
            currentRef.current,
          );

        const previousCounters =
          cloneCreativeInteractionCounters(
            countersRef.current,
          );

        const currentlyActive =
          kind ===
          "LIKE"
            ? previousState.liked
            : previousState.favorited;

        const action =
          getCreativeInteractionToggleAction(
            currentlyActive,
          );

        const nextActive =
          action ===
          "ADD";

        const nextState:
          CreativeCurrentInteractionState =
            kind ===
            "LIKE"
              ? {
                  ...previousState,

                  liked:
                    nextActive,
                }
              : {
                  ...previousState,

                  favorited:
                    nextActive,
                };

        const nextCounters:
          CreativeInteractionCounters =
            kind ===
            "LIKE"
              ? {
                  ...previousCounters,

                  likesCount:
                    normalizeCreativeInteractionCount(
                      previousCounters.likesCount +
                      (
                        nextActive
                          ? 1
                          : -1
                      ),
                    ),
                }
              : {
                  ...previousCounters,

                  favoritesCount:
                    normalizeCreativeInteractionCount(
                      previousCounters
                        .favoritesCount +
                      (
                        nextActive
                          ? 1
                          : -1
                      ),
                    ),
                };

        const abortController =
          new AbortController();

        const sequence =
          mutationRuntimeRef.current.sequence +
          1;

        const runtime:
          CreativeInteractionMutationRuntime = {
            sequence,

            kind,

            controller:
              abortController,

            previousState,

            previousCounters,
          };

        mutationRuntimeRef.current =
          runtime;

        setInteractionError(
          kind,
          null,
        );

        setMutationKind(
          kind,
        );

        setMutationStatus(
          "PENDING",
        );

        setOptimistic({
          operation:
            getCreativeInteractionType(
              kind,
            ),

          status:
            "PENDING",

          itemId:
            normalizedItemId,

          previousState,

          previousCounters,

          errorMessage:
            null,
        });

        /*
         * Actualización optimista:
         * la interfaz cambia antes de recibir la respuesta.
         */
        commitInteractionSnapshot(
          nextState,
          nextCounters,
        );

        try {
          const endpoint =
            kind ===
            "LIKE"
              ? createCreativeItemLikeApiRoute(
                  normalizedItemId,
                )
              : createCreativeItemFavoriteApiRoute(
                  normalizedItemId,
                );

          const response =
            await fetch(
              endpoint,
              {
                method:
                  "POST",

                headers: {
                  Accept:
                    "application/json",

                  "Content-Type":
                    "application/json",
                },

                credentials:
                  "same-origin",

                cache:
                  "no-store",

                body:
                  JSON.stringify({
                    action,
                  }),

                signal:
                  abortController.signal,
              },
            );

          if (
            kind ===
            "LIKE"
          ) {
            const payload =
              await readCreativeInteractionResponse<
                CreativeLikeApiData
              >(
                response,
              );

            if (
              response.status ===
              401
            ) {
              if (
                sequence ===
                mutationRuntimeRef.current.sequence
              ) {
                rollbackInteractionMutation(
                  runtime,
                );

                clearMutationRuntime(
                  sequence,
                );

                setMutationKind(
                  null,
                );

                setMutationStatus(
                  "IDLE",
                );

                setOptimistic({
                  ...EMPTY_CREATIVE_OPTIMISTIC_INTERACTION_STATE,
                });

                requestAuthentication(
                  kind,
                );
              }

              return false;
            }

            if (
              !response.ok ||
              !payload ||
              payload.ok ===
                false
            ) {
              throw new Error(
                getCreativeInteractionErrorMessage(
                  payload,
                  language,
                  getCreativeInteractionFallbackError(
                    kind,
                    language,
                  ),
                ),
              );
            }

            if (
              sequence !==
              mutationRuntimeRef.current.sequence
            ) {
              return false;
            }

            const definitiveState:
              CreativeCurrentInteractionState = {
                ...currentRef.current,

                liked:
                  payload.data.liked,
              };

            const definitiveCounters:
              CreativeInteractionCounters = {
                ...countersRef.current,

                likesCount:
                  normalizeCreativeInteractionCount(
                    payload.data.likesCount,
                  ),
              };

            commitInteractionSnapshot(
              definitiveState,
              definitiveCounters,
            );
          } else {
            const payload =
              await readCreativeInteractionResponse<
                CreativeFavoriteApiData
              >(
                response,
              );

            if (
              response.status ===
              401
            ) {
              if (
                sequence ===
                mutationRuntimeRef.current.sequence
              ) {
                rollbackInteractionMutation(
                  runtime,
                );

                clearMutationRuntime(
                  sequence,
                );

                setMutationKind(
                  null,
                );

                setMutationStatus(
                  "IDLE",
                );

                setOptimistic({
                  ...EMPTY_CREATIVE_OPTIMISTIC_INTERACTION_STATE,
                });

                requestAuthentication(
                  kind,
                );
              }

              return false;
            }

            if (
              !response.ok ||
              !payload ||
              payload.ok ===
                false
            ) {
              throw new Error(
                getCreativeInteractionErrorMessage(
                  payload,
                  language,
                  getCreativeInteractionFallbackError(
                    kind,
                    language,
                  ),
                ),
              );
            }

            if (
              sequence !==
              mutationRuntimeRef.current.sequence
            ) {
              return false;
            }

            const definitiveState:
              CreativeCurrentInteractionState = {
                ...currentRef.current,

                favorited:
                  payload.data.favorited,
              };

            const definitiveCounters:
              CreativeInteractionCounters = {
                ...countersRef.current,

                favoritesCount:
                  normalizeCreativeInteractionCount(
                    payload.data.favoritesCount,
                  ),
              };

            commitInteractionSnapshot(
              definitiveState,
              definitiveCounters,
            );
          }

          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return false;
          }

          clearMutationRuntime(
            sequence,
          );

          setMutationKind(
            kind,
          );

          setMutationStatus(
            "SUCCESS",
          );

          setOptimistic({
            operation:
              getCreativeInteractionType(
                kind,
              ),

            status:
              "SUCCESS",

            itemId:
              normalizedItemId,

            previousState:
              null,

            previousCounters:
              null,

            errorMessage:
              null,
          });

          return true;
        } catch (
          error
        ) {
          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return false;
          }

          if (
            isCreativeInteractionAbortError(
              error,
            )
          ) {
            rollbackInteractionMutation(
              runtime,
            );

            clearMutationRuntime(
              sequence,
            );

            setMutationKind(
              null,
            );

            setMutationStatus(
              "IDLE",
            );

            setOptimistic({
              ...EMPTY_CREATIVE_OPTIMISTIC_INTERACTION_STATE,
            });

            return false;
          }

          rollbackInteractionMutation(
            runtime,
          );

          const fallbackMessage =
            getCreativeInteractionFallbackError(
              kind,
              language,
            );

          const resolvedError =
            error instanceof Error
              ? error.message
              : fallbackMessage;

          setInteractionError(
            kind,
            resolvedError,
          );

          clearMutationRuntime(
            sequence,
          );

          setMutationKind(
            kind,
          );

          setMutationStatus(
            "ERROR",
          );

          setOptimistic({
            operation:
              getCreativeInteractionType(
                kind,
              ),

            status:
              "ERROR",

            itemId:
              normalizedItemId,

            previousState,

            previousCounters,

            errorMessage:
              resolvedError,
          });

          return false;
        } finally {
          /*
           * La referencia solo se modifica cuando todavía
           * pertenece a esta misma operación.
           */
          if (
            sequence ===
              mutationRuntimeRef.current.sequence &&
            mutationRuntimeRef.current.controller ===
              abortController
          ) {
            mutationRuntimeRef.current.controller =
              null;
          }
        }
      },
      [
        clearMutationRuntime,
        commitInteractionSnapshot,
        enabled,
        language,
        normalizedItemId,
        permissions,
        requestAuthentication,
        rollbackInteractionMutation,
        setInteractionError,
      ],
    );

  /* =======================================================
     ME GUSTA
     ======================================================= */

  const toggleLike =
    useCallback(
      async (): Promise<boolean> => {
        return executeToggleInteraction(
          "LIKE",
        );
      },
      [
        executeToggleInteraction,
      ],
    );

  /* =======================================================
     FAVORITOS
     ======================================================= */

  const toggleFavorite =
    useCallback(
      async (): Promise<boolean> => {
        return executeToggleInteraction(
          "FAVORITE",
        );
      },
      [
        executeToggleInteraction,
      ],
    );

  /* =======================================================
     CANCELAR AL DESMONTAR
     ======================================================= */

  useEffect(
    () => {
      return () => {
        mutationRuntimeRef.current
          .controller
          ?.abort();
      };
    },
    [],
  );

  /* =======================================================
     INFORMACIÓN DERIVADA
     ======================================================= */

  const processing =
    mutationStatus ===
    "PENDING";

  const processingLike =
    processing &&
    mutationKind ===
      "LIKE";

  const processingFavorite =
    processing &&
    mutationKind ===
      "FAVORITE";

  const errorMessage =
    likeError ??
    favoriteError;

  const hasError =
    errorMessage !==
    null;

  /* =======================================================
     RETORNO
     ======================================================= */

  return {
    itemId:
      normalizedItemId,

    current,

    counters,

    permissions,

    optimistic,

    mutationKind,

    mutationStatus,

    liked:
      current.liked,

    favorited:
      current.favorited,

    likesCount:
      counters.likesCount,

    favoritesCount:
      counters.favoritesCount,

    processing,

    processingLike,

    processingFavorite,

    canLike:
      enabled &&
      permissions.canLike,

    canFavorite:
      enabled &&
      permissions.canFavorite,

    likeError,

    favoriteError,

    errorMessage,

    hasError,

    toggleLike,

    toggleFavorite,

    replaceState,

    replacePermissions,

    updateCounters,

    clearError,

    cancelPendingMutation,
  };
}
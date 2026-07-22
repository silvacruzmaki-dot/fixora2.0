"use client";

/*
 * Hook de detalle individual del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Cargar una publicación mediante su slug.
 * - Obtener la información completa del visor.
 * - Obtener permisos e interacciones del usuario actual.
 * - Obtener publicaciones relacionadas.
 * - Registrar una visualización sin duplicarla.
 * - Cancelar solicitudes obsoletas.
 * - Evitar que respuestas antiguas reemplacen datos nuevos.
 * - Permitir actualizar localmente el diseño y el visitante.
 * - Diferenciar errores generales y publicaciones inexistentes.
 *
 * No contiene:
 * - Componentes visuales.
 * - Acceso directo a Prisma.
 * - Lógica de zoom.
 * - Lógica de comentarios.
 * - Lógica administrativa.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createCreativeItemBySlugApiRoute,
  createCreativeItemViewApiRoute,
} from "@/constants/creative/creative.routes";

import type {
  CreativeApiItem,
  CreativeApiItemSummary,
  CreativeApiLanguage,
  CreativeApiResponse,
  CreativeItemBySlugApiData,
  CreativeViewRegistrationApiData,
  CreativeViewRegistrationInput,
} from "@/types/creative/creative-api.types";

/* =========================================================
   MODO DE SOLICITUD
   ========================================================= */

type CreativeItemRequestMode =
  | "LOAD"
  | "REFRESH";

/* =========================================================
   ORIGEN DE LA VISUALIZACIÓN
   ========================================================= */

export type CreativeItemViewSource =
  NonNullable<
    CreativeViewRegistrationInput["source"]
  >;

/* =========================================================
   DATOS DEL VISITANTE
   ========================================================= */

export type CreativeItemViewerData =
  CreativeItemBySlugApiData["viewer"];

/* =========================================================
   OPCIONES DEL HOOK
   ========================================================= */

export interface UseCreativeItemOptions {
  /*
   * Slug de la publicación que debe cargarse.
   */
  slug:
    string | null | undefined;

  /*
   * Datos obtenidos previamente desde un Server Component.
   */
  initialData?:
    CreativeItemBySlugApiData | null;

  /*
   * Idioma utilizado para los mensajes de error.
   */
  language?:
    CreativeApiLanguage;

  /*
   * Permite desactivar temporalmente las solicitudes.
   */
  enabled?:
    boolean;

  /*
   * Consulta nuevamente la API aunque existan datos iniciales.
   */
  revalidateOnMount?:
    boolean;

  /*
   * Registra automáticamente una visualización después
   * de que el diseño termina de cargarse.
   */
  autoRegisterView?:
    boolean;

  /*
   * Lugar desde el cual se abrió la publicación.
   */
  viewSource?:
    CreativeItemViewSource;
}

/* =========================================================
   RESULTADO DEL HOOK
   ========================================================= */

export interface UseCreativeItemResult {
  data:
    CreativeItemBySlugApiData | null;

  item:
    CreativeApiItem | null;

  viewer:
    CreativeItemViewerData | null;

  relatedItems:
    CreativeApiItemSummary[];

  requestedSlug:
    string;

  loading:
    boolean;

  initialLoading:
    boolean;

  refreshing:
    boolean;

  registeringView:
    boolean;

  ready:
    boolean;

  notFound:
    boolean;

  hasError:
    boolean;

  errorMessage:
    string | null;

  viewRegistered:
    boolean;

  viewRegistrationError:
    string | null;

  lastUpdatedAt:
    number | null;

  refresh:
    () => Promise<void>;

  retry:
    () => Promise<void>;

  registerView:
    () => Promise<boolean>;

  replaceData:
    (
      nextData:
        CreativeItemBySlugApiData | null,
    ) => void;

  updateItem:
    (
      updater:
        (
          currentItem:
            CreativeApiItem,
        ) => CreativeApiItem,
    ) => void;

  updateViewer:
    (
      updater:
        (
          currentViewer:
            CreativeItemViewerData,
        ) => CreativeItemViewerData,
    ) => void;

  updateRelatedItems:
    (
      updater:
        (
          currentItems:
            CreativeApiItemSummary[],
        ) => CreativeApiItemSummary[],
    ) => void;

  cancelCurrentRequest:
    () => void;
}

/* =========================================================
   NORMALIZAR SLUG
   ========================================================= */

function normalizeCreativeItemSlug(
  slug:
    string | null | undefined,
): string {
  if (
    typeof slug !==
    "string"
  ) {
    return "";
  }

  return slug.trim();
}

/* =========================================================
   RESOLVER DATOS INICIALES
   ========================================================= */

function resolveInitialCreativeItemData(
  initialData:
    CreativeItemBySlugApiData | null | undefined,
  normalizedSlug:
    string,
): CreativeItemBySlugApiData | null {
  if (
    !initialData
  ) {
    return null;
  }

  if (
    !normalizedSlug
  ) {
    return initialData;
  }

  return initialData.requestedSlug ===
    normalizedSlug
    ? initialData
    : null;
}

/* =========================================================
   EXTRAER MENSAJE DE ERROR
   ========================================================= */

function getCreativeItemErrorMessage<
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
    payload.ok === false
  ) {
    return payload.message[
      language
    ];
  }

  return fallback;
}

/* =========================================================
   DETECTAR CANCELACIÓN
   ========================================================= */

function isCreativeItemAbortError(
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
   ACTUALIZAR CONTADOR DE VISUALIZACIONES
   ========================================================= */

function updateCreativeItemViewsCount(
  item:
    CreativeApiItem,
  viewsCount:
    number,
): CreativeApiItem {
  const normalizedViewsCount =
    Math.max(
      0,
      Math.trunc(
        viewsCount,
      ),
    );

  return {
    ...item,

    metrics: {
      ...item.metrics,

      viewsCount:
        normalizedViewsCount,
    },
  } as CreativeApiItem;
}

/* =========================================================
   HOOK PRINCIPAL
   ========================================================= */

export function useCreativeItem(
  options:
    UseCreativeItemOptions,
): UseCreativeItemResult {
  const {
    slug,

    initialData =
      null,

    language =
      "es",

    enabled =
      true,

    revalidateOnMount =
      true,

    autoRegisterView =
      true,

    viewSource =
      "catalog",
  } =
    options;

  const normalizedSlug =
    normalizeCreativeItemSlug(
      slug,
    );

  const resolvedInitialData =
    resolveInitialCreativeItemData(
      initialData,
      normalizedSlug,
    );

  /* =======================================================
     DATOS PRINCIPALES
     ======================================================= */

  const [
    data,
    setData,
  ] =
    useState<
      CreativeItemBySlugApiData | null
    >(
      () =>
        resolvedInitialData,
    );

  const dataRef =
    useRef<
      CreativeItemBySlugApiData | null
    >(
      resolvedInitialData,
    );

  /* =======================================================
     ESTADOS DE CARGA
     ======================================================= */

  const [
    loading,
    setLoading,
  ] =
    useState<boolean>(
      false,
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState<boolean>(
      false,
    );

  const [
    registeringView,
    setRegisteringView,
  ] =
    useState<boolean>(
      false,
    );

  /* =======================================================
     ESTADOS DE ERROR
     ======================================================= */

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    notFound,
    setNotFound,
  ] =
    useState<boolean>(
      false,
    );

  const [
    viewRegistrationError,
    setViewRegistrationError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  /* =======================================================
     ESTADO DE VISUALIZACIÓN
     ======================================================= */

  const [
    viewRegistered,
    setViewRegistered,
  ] =
    useState<boolean>(
      false,
    );

  /*
   * Debe comenzar en null.
   *
   * Date.now() solo se ejecuta después de una respuesta
   * exitosa y nunca durante el renderizado.
   */
  const [
    lastUpdatedAt,
    setLastUpdatedAt,
  ] =
    useState<
      number | null
    >(
      null,
    );

  /* =======================================================
     REFERENCIAS DE SOLICITUD
     ======================================================= */

  const itemAbortControllerRef =
    useRef<
      AbortController | null
    >(
      null,
    );

  const viewAbortControllerRef =
    useRef<
      AbortController | null
    >(
      null,
    );

  const itemRequestSequenceRef =
    useRef<number>(
      0,
    );

  const viewRequestSequenceRef =
    useRef<number>(
      0,
    );

  /*
   * Registra qué publicaciones ya fueron contabilizadas
   * dentro de la vida actual del componente.
   */
  const registeredItemIdsRef =
    useRef<
      Set<string>
    >(
      new Set<string>(),
    );

  /*
   * Evita solicitudes duplicadas mientras una visualización
   * todavía está siendo procesada.
   */
  const registeringItemIdsRef =
    useRef<
      Set<string>
    >(
      new Set<string>(),
    );

  /*
   * Permite utilizar datos iniciales sin realizar una
   * petición duplicada al montar el componente.
   */
  const skipInitialRequestRef =
    useRef<boolean>(
      Boolean(
        resolvedInitialData &&
        !revalidateOnMount,
      ),
    );

  /* =======================================================
     REEMPLAZAR DATOS
     ======================================================= */

  const replaceData =
    useCallback(
      (
        nextData:
          CreativeItemBySlugApiData | null,
      ): void => {
        dataRef.current =
          nextData;

        setData(
          nextData,
        );

        setNotFound(
          false,
        );

        setErrorMessage(
          null,
        );

        const nextItemId =
          nextData?.item.id;

        setViewRegistered(
          nextItemId
            ? registeredItemIdsRef.current.has(
                nextItemId,
              )
            : false,
        );
      },
      [],
    );

  /* =======================================================
     ACTUALIZAR PUBLICACIÓN
     ======================================================= */

  const updateItem =
    useCallback(
      (
        updater:
          (
            currentItem:
              CreativeApiItem,
          ) => CreativeApiItem,
      ): void => {
        setData(
          (
            currentData,
          ) => {
            if (
              !currentData
            ) {
              return currentData;
            }

            const nextData:
              CreativeItemBySlugApiData = {
                ...currentData,

                item:
                  updater(
                    currentData.item,
                  ),
              };

            dataRef.current =
              nextData;

            return nextData;
          },
        );
      },
      [],
    );

  /* =======================================================
     ACTUALIZAR VISITANTE Y PERMISOS
     ======================================================= */

  const updateViewer =
    useCallback(
      (
        updater:
          (
            currentViewer:
              CreativeItemViewerData,
          ) => CreativeItemViewerData,
      ): void => {
        setData(
          (
            currentData,
          ) => {
            if (
              !currentData
            ) {
              return currentData;
            }

            const nextData:
              CreativeItemBySlugApiData = {
                ...currentData,

                viewer:
                  updater(
                    currentData.viewer,
                  ),
              };

            dataRef.current =
              nextData;

            return nextData;
          },
        );
      },
      [],
    );

  /* =======================================================
     ACTUALIZAR RELACIONADOS
     ======================================================= */

  const updateRelatedItems =
    useCallback(
      (
        updater:
          (
            currentItems:
              CreativeApiItemSummary[],
          ) => CreativeApiItemSummary[],
      ): void => {
        setData(
          (
            currentData,
          ) => {
            if (
              !currentData
            ) {
              return currentData;
            }

            const nextData:
              CreativeItemBySlugApiData = {
                ...currentData,

                relatedItems:
                  updater(
                    currentData.relatedItems,
                  ),
              };

            dataRef.current =
              nextData;

            return nextData;
          },
        );
      },
      [],
    );

  /* =======================================================
     CANCELAR SOLICITUDES
     ======================================================= */

  const cancelCurrentRequest =
    useCallback(
      (): void => {
        itemAbortControllerRef.current?.abort();

        viewAbortControllerRef.current?.abort();

        itemAbortControllerRef.current =
          null;

        viewAbortControllerRef.current =
          null;
      },
      [],
    );

  /* =======================================================
     CARGAR PUBLICACIÓN
     ======================================================= */

  const requestItem =
    useCallback(
      async (
        requestedSlug:
          string,
        mode:
          CreativeItemRequestMode,
      ): Promise<void> => {
        itemAbortControllerRef.current?.abort();

        const abortController =
          new AbortController();

        itemAbortControllerRef.current =
          abortController;

        const requestSequence =
          itemRequestSequenceRef.current +
          1;

        itemRequestSequenceRef.current =
          requestSequence;

        setErrorMessage(
          null,
        );

        setNotFound(
          false,
        );

        if (
          mode ===
          "REFRESH"
        ) {
          setRefreshing(
            true,
          );
        } else {
          setLoading(
            true,
          );

          /*
           * Solo se limpia la información cuando pertenece
           * a otro slug.
           */
          if (
            dataRef.current &&
            dataRef.current.requestedSlug !==
              requestedSlug
          ) {
            dataRef.current =
              null;

            setData(
              null,
            );

            setViewRegistered(
              false,
            );

            setViewRegistrationError(
              null,
            );
          }
        }

        try {
          const response =
            await fetch(
              createCreativeItemBySlugApiRoute(
                requestedSlug,
              ),
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },

                credentials:
                  "same-origin",

                cache:
                  "no-store",

                signal:
                  abortController.signal,
              },
            );

          const payload =
            (
              await response
                .json()
                .catch(
                  () =>
                    null,
                )
            ) as
              | CreativeApiResponse<CreativeItemBySlugApiData>
              | null;

          const responseNotFound =
            response.status ===
              404 ||
            (
              payload !==
                null &&
              payload.ok ===
                false &&
              payload.code ===
                "CREATIVE_ITEM_NOT_FOUND"
            );

          if (
            !response.ok ||
            !payload ||
            payload.ok ===
              false
          ) {
            if (
              requestSequence ===
                itemRequestSequenceRef.current &&
              responseNotFound
            ) {
              dataRef.current =
                null;

              setData(
                null,
              );

              setNotFound(
                true,
              );

              setViewRegistered(
                false,
              );
            }

            const fallbackMessage =
              responseNotFound
                ? language ===
                    "en"
                  ? "The requested design does not exist or is no longer available."
                  : "El diseño solicitado no existe o ya no está disponible."
                : language ===
                    "en"
                  ? "The design could not be loaded."
                  : "No fue posible cargar el diseño.";

            throw new Error(
              getCreativeItemErrorMessage(
                payload,
                language,
                fallbackMessage,
              ),
            );
          }

          /*
           * Una respuesta antigua nunca puede reemplazar
           * una publicación solicitada posteriormente.
           */
          if (
            requestSequence !==
            itemRequestSequenceRef.current
          ) {
            return;
          }

          const nextData =
            payload.data;

          dataRef.current =
            nextData;

          setData(
            nextData,
          );

          setErrorMessage(
            null,
          );

          setNotFound(
            false,
          );

          setViewRegistrationError(
            null,
          );

          setViewRegistered(
            registeredItemIdsRef.current.has(
              nextData.item.id,
            ),
          );

          /*
           * Se ejecuta únicamente después de una respuesta
           * exitosa, fuera del renderizado.
           */
          setLastUpdatedAt(
            Date.now(),
          );
        } catch (
          error
        ) {
          if (
            isCreativeItemAbortError(
              error,
            )
          ) {
            return;
          }

          if (
            requestSequence !==
            itemRequestSequenceRef.current
          ) {
            return;
          }

          const fallbackMessage =
            language ===
              "en"
              ? "The design could not be loaded."
              : "No fue posible cargar el diseño.";

          setErrorMessage(
            error instanceof
              Error
              ? error.message
              : fallbackMessage,
          );
        } finally {
          if (
            requestSequence ===
            itemRequestSequenceRef.current
          ) {
            setLoading(
              false,
            );

            setRefreshing(
              false,
            );

            if (
              itemAbortControllerRef.current ===
              abortController
            ) {
              itemAbortControllerRef.current =
                null;
            }
          }
        }
      },
      [
        language,
      ],
    );

  /* =======================================================
     CARGA AUTOMÁTICA
     ======================================================= */

  useEffect(
    () => {
      if (
        !enabled ||
        !normalizedSlug
      ) {
        return;
      }

      if (
        skipInitialRequestRef.current
      ) {
        skipInitialRequestRef.current =
          false;

        return;
      }

      /*
       * Se programa fuera de la ejecución síncrona del efecto.
       *
       * requestItem actualiza estados al comenzar. Ejecutarlo
       * directamente dentro del efecto podría activar la regla
       * react-hooks/set-state-in-effect.
       */
      const timeoutId =
        window.setTimeout(
          () => {
            const requestMode:
              CreativeItemRequestMode =
                dataRef.current?.requestedSlug ===
                normalizedSlug
                  ? "REFRESH"
                  : "LOAD";

            void requestItem(
              normalizedSlug,
              requestMode,
            );
          },
          0,
        );

      return () => {
        window.clearTimeout(
          timeoutId,
        );
      };
    },
    [
      enabled,
      normalizedSlug,
      requestItem,
    ],
  );

  /* =======================================================
     CANCELAR CUANDO SE DESACTIVA
     ======================================================= */

  useEffect(
    () => {
      if (
        enabled
      ) {
        return;
      }

      cancelCurrentRequest();
    },
    [
      enabled,
      cancelCurrentRequest,
    ],
  );

  /* =======================================================
     REGISTRAR VISUALIZACIÓN
     ======================================================= */

  const registerView =
    useCallback(
      async (): Promise<boolean> => {
        const currentItem =
          dataRef.current?.item;

        if (
          !enabled ||
          !currentItem
        ) {
          return false;
        }

        const itemId =
          currentItem.id;

        if (
          registeredItemIdsRef.current.has(
            itemId,
          )
        ) {
          setViewRegistered(
            true,
          );

          return true;
        }

        if (
          registeringItemIdsRef.current.has(
            itemId,
          )
        ) {
          return false;
        }

        registeringItemIdsRef.current.add(
          itemId,
        );

        viewAbortControllerRef.current?.abort();

        const abortController =
          new AbortController();

        viewAbortControllerRef.current =
          abortController;

        const requestSequence =
          viewRequestSequenceRef.current +
          1;

        viewRequestSequenceRef.current =
          requestSequence;

        setRegisteringView(
          true,
        );

        setViewRegistrationError(
          null,
        );

        try {
          const requestBody:
            CreativeViewRegistrationInput = {
              source:
                viewSource,
            };

          const response =
            await fetch(
              createCreativeItemViewApiRoute(
                itemId,
              ),
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
                  JSON.stringify(
                    requestBody,
                  ),

                signal:
                  abortController.signal,
              },
            );

          const payload =
            (
              await response
                .json()
                .catch(
                  () =>
                    null,
                )
            ) as
              | CreativeApiResponse<CreativeViewRegistrationApiData>
              | null;

          if (
            !response.ok ||
            !payload ||
            payload.ok ===
              false
          ) {
            const fallbackMessage =
              language ===
                "en"
                ? "The view could not be registered."
                : "No fue posible registrar la visualización.";

            throw new Error(
              getCreativeItemErrorMessage(
                payload,
                language,
                fallbackMessage,
              ),
            );
          }

          if (
            requestSequence !==
            viewRequestSequenceRef.current
          ) {
            return false;
          }

          registeredItemIdsRef.current.add(
            itemId,
          );

          setViewRegistered(
            true,
          );

          setViewRegistrationError(
            null,
          );

          /*
           * Se utiliza el contador definitivo del servidor
           * para evitar duplicaciones o diferencias.
           */
          setData(
            (
              currentData,
            ) => {
              if (
                !currentData ||
                currentData.item.id !==
                  itemId
              ) {
                return currentData;
              }

              const nextData:
                CreativeItemBySlugApiData = {
                  ...currentData,

                  item:
                    updateCreativeItemViewsCount(
                      currentData.item,
                      payload.data.viewsCount,
                    ),
                };

              dataRef.current =
                nextData;

              return nextData;
            },
          );

          return true;
        } catch (
          error
        ) {
          if (
            isCreativeItemAbortError(
              error,
            )
          ) {
            return false;
          }

          if (
            requestSequence !==
            viewRequestSequenceRef.current
          ) {
            return false;
          }

          const fallbackMessage =
            language ===
              "en"
              ? "The view could not be registered."
              : "No fue posible registrar la visualización.";

          setViewRegistrationError(
            error instanceof
              Error
              ? error.message
              : fallbackMessage,
          );

          return false;
        } finally {
          registeringItemIdsRef.current.delete(
            itemId,
          );

          if (
            requestSequence ===
            viewRequestSequenceRef.current
          ) {
            setRegisteringView(
              false,
            );

            if (
              viewAbortControllerRef.current ===
              abortController
            ) {
              viewAbortControllerRef.current =
                null;
            }
          }
        }
      },
      [
        enabled,
        language,
        viewSource,
      ],
    );

  /* =======================================================
     REGISTRO AUTOMÁTICO DE VISUALIZACIÓN
     ======================================================= */

  const currentItemId =
    data?.item.id ??
    null;

  useEffect(
    () => {
      if (
        !autoRegisterView ||
        !currentItemId
      ) {
        return;
      }

      /*
       * registerView modifica estados antes de llegar al
       * primer await. Por eso se programa fuera de la fase
       * síncrona del efecto.
       */
      const timeoutId =
        window.setTimeout(
          () => {
            void registerView();
          },
          0,
        );

      return () => {
        window.clearTimeout(
          timeoutId,
        );
      };
    },
    [
      autoRegisterView,
      currentItemId,
      registerView,
    ],
  );

  /* =======================================================
     ACTUALIZAR MANUALMENTE
     ======================================================= */

  const refresh =
    useCallback(
      async (): Promise<void> => {
        if (
          !enabled ||
          !normalizedSlug
        ) {
          return;
        }

        await requestItem(
          normalizedSlug,
          "REFRESH",
        );
      },
      [
        enabled,
        normalizedSlug,
        requestItem,
      ],
    );

  /* =======================================================
     REINTENTAR
     ======================================================= */

  const retry =
    useCallback(
      async (): Promise<void> => {
        if (
          !enabled ||
          !normalizedSlug
        ) {
          return;
        }

        const requestMode:
          CreativeItemRequestMode =
            dataRef.current?.requestedSlug ===
            normalizedSlug
              ? "REFRESH"
              : "LOAD";

        await requestItem(
          normalizedSlug,
          requestMode,
        );
      },
      [
        enabled,
        normalizedSlug,
        requestItem,
      ],
    );

  /* =======================================================
     CANCELACIÓN AL DESMONTAR
     ======================================================= */

  useEffect(
    () => {
      return () => {
        itemAbortControllerRef.current?.abort();

        viewAbortControllerRef.current?.abort();
      };
    },
    [],
  );

  /* =======================================================
     INFORMACIÓN DERIVADA
     ======================================================= */

  const item =
    data?.item ??
    null;

  const viewer =
    data?.viewer ??
    null;

  const relatedItems =
    data?.relatedItems ??
    [];

  const hasError =
    errorMessage !==
    null;

  const ready =
    item !==
      null &&
    !loading &&
    !hasError;

  const initialLoading =
    loading &&
    item ===
      null;

  /* =======================================================
     RETORNO
     ======================================================= */

  return {
    data,

    item,

    viewer,

    relatedItems,

    requestedSlug:
      normalizedSlug,

    loading,

    initialLoading,

    refreshing,

    registeringView,

    ready,

    notFound,

    hasError,

    errorMessage,

    viewRegistered,

    viewRegistrationError,

    lastUpdatedAt,

    refresh,

    retry,

    registerView,

    replaceData,

    updateItem,

    updateViewer,

    updateRelatedItems,

    cancelCurrentRequest,
  };
}
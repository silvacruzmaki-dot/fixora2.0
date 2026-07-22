"use client";

/*
 * Hook de comentarios del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Cargar comentarios de una publicación.
 * - Paginar mediante cursor.
 * - Publicar comentarios y respuestas.
 * - Editar comentarios propios.
 * - Eliminar comentarios.
 * - Dar Me gusta a comentarios.
 * - Reportar comentarios.
 * - Mantener el contador sincronizado.
 * - Cancelar solicitudes obsoletas.
 * - Solicitar autenticación cuando corresponda.
 *
 * No contiene:
 * - Componentes visuales.
 * - Acceso directo a Prisma.
 * - Lógica de zoom.
 * - Compras.
 * - Descargas.
 * - Administración global del módulo.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CREATIVE_PAGINATION,
  CREATIVE_TEXT_LIMITS,
} from "@/constants/creative/creative.constants";

import {
  createCreativeCommentApiRoute,
  createCreativeItemCommentsApiRoute,
  createCreativeLoginRoute,
  normalizeCreativeReturnTo,
} from "@/constants/creative/creative.routes";

import type {
  CreativeApiLanguage,
  CreativeApiResponse,
} from "@/types/creative/creative-api.types";

import type {
  CreativeItemId,
} from "@/types/creative/creative-item.types";

import type {
  CreativeViewerCommentPreview,
  CreativeViewerCommentsState,
} from "@/types/creative/creative-viewer.types";

/* =========================================================
   MODOS DE CONSULTA
   ========================================================= */

type CreativeCommentsRequestMode =
  | "REPLACE"
  | "APPEND"
  | "REFRESH";

/* =========================================================
   TIPOS DE MUTACIÓN
   ========================================================= */

export type CreativeCommentMutationKind =
  | "CREATE"
  | "REPLY"
  | "UPDATE"
  | "DELETE"
  | "LIKE"
  | "REPORT";

/* =========================================================
   DATOS INICIALES
   ========================================================= */

export interface CreativeCommentsInitialData {
  items:
    CreativeViewerCommentPreview[];

  total:
    number;

  nextCursor:
    string | null;

  hasMore:
    boolean;
}

/* =========================================================
   RESPUESTA DEL LISTADO
   ========================================================= */

interface CreativeCommentsCollectionApiData {
  items:
    CreativeViewerCommentPreview[];

  total:
    number;

  nextCursor:
    string | null;

  hasMore:
    boolean;
}

/* =========================================================
   RESPUESTA DE CREACIÓN O EDICIÓN
   ========================================================= */

interface CreativeCommentMutationApiData {
  comment:
    CreativeViewerCommentPreview;

  commentsCount?:
    number;

  total?:
    number;
}

/* =========================================================
   RESPUESTA DE ELIMINACIÓN
   ========================================================= */

interface CreativeCommentDeleteApiData {
  commentId:
    string;

  deleted:
    boolean;

  commentsCount?:
    number;

  total?:
    number;
}

/* =========================================================
   RESPUESTA DE ME GUSTA
   ========================================================= */

interface CreativeCommentLikeApiData {
  commentId:
    string;

  liked:
    boolean;

  likesCount:
    number;
}

/* =========================================================
   RESPUESTA DE REPORTE
   ========================================================= */

interface CreativeCommentReportApiData {
  commentId:
    string;

  reported:
    boolean;
}

/* =========================================================
   SOLICITUD DE AUTENTICACIÓN
   ========================================================= */

export interface CreativeCommentsAuthenticationRequest {
  action:
    CreativeCommentMutationKind;

  returnTo:
    string;

  redirectTo:
    string;
}

/* =========================================================
   OPCIONES DEL HOOK
   ========================================================= */

export interface UseCreativeCommentsOptions {
  /*
   * Identificador de la publicación.
   */
  itemId:
    CreativeItemId | null | undefined;

  /*
   * Comentarios obtenidos previamente desde el servidor.
   */
  initialData?:
    CreativeCommentsInitialData | null;

  /*
   * Idioma utilizado para los mensajes de error.
   */
  language?:
    CreativeApiLanguage;

  /*
   * Activa o desactiva temporalmente el hook.
   */
  enabled?:
    boolean;

  /*
   * Carga automáticamente los comentarios.
   */
  autoLoad?:
    boolean;

  /*
   * Actualiza los datos iniciales al montar el componente.
   */
  revalidateOnMount?:
    boolean;

  /*
   * Cantidad de comentarios solicitados por página.
   */
  pageSize?:
    number;

  /*
   * Indica si el visitante inició sesión.
   */
  authenticated?:
    boolean;

  /*
   * Permiso para publicar comentarios.
   */
  canComment?:
    boolean;

  /*
   * Permiso para dar Me gusta a comentarios.
   */
  canLikeComments?:
    boolean;

  /*
   * Permiso para reportar comentarios.
   */
  canReportComments?:
    boolean;

  /*
   * Indica si comentar requiere autenticación.
   */
  requireAuthentication?:
    boolean;

  /*
   * Ruta de regreso después de iniciar sesión.
   */
  returnTo?:
    string;

  /*
   * Permite que el componente padre abra un modal de sesión.
   * Cuando no se proporciona, se realiza una redirección.
   */
  onAuthenticationRequired?:
    (
      request:
        CreativeCommentsAuthenticationRequest,
    ) => void;

  /*
   * Notifica el contador definitivo de comentarios.
   */
  onCommentsCountChange?:
    (
      commentsCount:
        number,
    ) => void;
}

/* =========================================================
   RESULTADO DEL HOOK
   ========================================================= */

export interface UseCreativeCommentsResult {
  state:
    CreativeViewerCommentsState;

  comments:
    CreativeViewerCommentPreview[];

  total:
    number;

  nextCursor:
    string | null;

  hasMore:
    boolean;

  loading:
    boolean;

  initialLoading:
    boolean;

  refreshing:
    boolean;

  loadingMore:
    boolean;

  submitting:
    boolean;

  processing:
    boolean;

  mutationKind:
    CreativeCommentMutationKind | null;

  editingCommentId:
    string | null;

  deletingCommentId:
    string | null;

  likingCommentId:
    string | null;

  reportingCommentId:
    string | null;

  errorMessage:
    string | null;

  collectionError:
    string | null;

  mutationError:
    string | null;

  hasError:
    boolean;

  empty:
    boolean;

  ready:
    boolean;

  lastUpdatedAt:
    number | null;

  refresh:
    () => Promise<void>;

  retry:
    () => Promise<void>;

  loadMore:
    () => Promise<void>;

  submitComment:
    (
      content:
        string,
      parentCommentId?:
        string | null,
    ) => Promise<CreativeViewerCommentPreview | null>;

  updateComment:
    (
      commentId:
        string,
      content:
        string,
    ) => Promise<CreativeViewerCommentPreview | null>;

  deleteComment:
    (
      commentId:
        string,
    ) => Promise<boolean>;

  toggleCommentLike:
    (
      commentId:
        string,
    ) => Promise<boolean>;

  reportComment:
    (
      commentId:
        string,
      reason?:
        string | null,
    ) => Promise<boolean>;

  replaceComments:
    (
      data:
        CreativeCommentsInitialData,
    ) => void;

  replaceComment:
    (
      comment:
        CreativeViewerCommentPreview,
    ) => void;

  removeCommentLocally:
    (
      commentId:
        string,
    ) => void;

  clearError:
    () => void;

  cancelCurrentRequest:
    () => void;
}

/* =========================================================
   REFERENCIA DE MUTACIÓN
   ========================================================= */

interface CreativeCommentMutationRuntime {
  sequence:
    number;

  kind:
    CreativeCommentMutationKind | null;

  commentId:
    string | null;

  controller:
    AbortController | null;
}

/* =========================================================
   NORMALIZAR IDENTIFICADOR
   ========================================================= */

function normalizeCreativeCommentsItemId(
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
   NORMALIZAR IDENTIFICADOR DE COMENTARIO
   ========================================================= */

function normalizeCreativeCommentId(
  commentId:
    string | null | undefined,
): string {
  if (
    typeof commentId !==
    "string"
  ) {
    return "";
  }

  return commentId.trim();
}

/* =========================================================
   NORMALIZAR TEXTO
   ========================================================= */

function normalizeCreativeCommentContent(
  content:
    string,
): string {
  return content
    .replace(
      /\r\n/g,
      "\n",
    )
    .trim();
}

/* =========================================================
   NORMALIZAR CONTADOR
   ========================================================= */

function normalizeCreativeCommentsCount(
  value:
    number | null | undefined,
): number {
  if (
    typeof value !==
      "number" ||
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
   NORMALIZAR TAMAÑO DE PÁGINA
   ========================================================= */

function normalizeCreativeCommentsPageSize(
  pageSize:
    number | null | undefined,
): number {
  if (
    typeof pageSize !==
      "number" ||
    !Number.isFinite(
      pageSize,
    )
  ) {
    return CREATIVE_PAGINATION.COMMENTS_DEFAULT_PAGE_SIZE;
  }

  return Math.min(
    CREATIVE_PAGINATION.COMMENTS_MAXIMUM_PAGE_SIZE,
    Math.max(
      1,
      Math.trunc(
        pageSize,
      ),
    ),
  );
}

/* =========================================================
   NORMALIZAR NÚMERO DE ME GUSTA
   ========================================================= */

function normalizeCreativeCommentLikesCount(
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
   ELIMINAR COMENTARIOS REPETIDOS
   ========================================================= */

function normalizeCreativeComments(
  comments:
    readonly CreativeViewerCommentPreview[],
): CreativeViewerCommentPreview[] {
  const commentsById =
    new Map<
      string,
      CreativeViewerCommentPreview
    >();

  comments.forEach(
    (
      comment,
    ) => {
      const normalizedId =
        normalizeCreativeCommentId(
          comment.id,
        );

      if (
        !normalizedId
      ) {
        return;
      }

      commentsById.set(
        normalizedId,
        {
          ...comment,

          id:
            normalizedId,

          content:
            normalizeCreativeCommentContent(
              comment.content,
            ),

          repliesCount:
            normalizeCreativeCommentsCount(
              comment.repliesCount,
            ),

          likesCount:
            normalizeCreativeCommentLikesCount(
              comment.likesCount,
            ),
        },
      );
    },
  );

  return Array.from(
    commentsById.values(),
  );
}

/* =========================================================
   UNIR PÁGINAS SIN DUPLICADOS
   ========================================================= */

function mergeCreativeComments(
  currentComments:
    readonly CreativeViewerCommentPreview[],
  incomingComments:
    readonly CreativeViewerCommentPreview[],
): CreativeViewerCommentPreview[] {
  return normalizeCreativeComments([
    ...currentComments,
    ...incomingComments,
  ]);
}

/* =========================================================
   REEMPLAZAR UN COMENTARIO
   ========================================================= */

function replaceCreativeCommentInCollection(
  comments:
    readonly CreativeViewerCommentPreview[],
  comment:
    CreativeViewerCommentPreview,
): CreativeViewerCommentPreview[] {
  const normalizedCommentId =
    normalizeCreativeCommentId(
      comment.id,
    );

  if (
    !normalizedCommentId
  ) {
    return [
      ...comments,
    ];
  }

  let replaced =
    false;

  const nextComments =
    comments.map(
      (
        currentComment,
      ) => {
        if (
          currentComment.id !==
          normalizedCommentId
        ) {
          return currentComment;
        }

        replaced =
          true;

        return {
          ...comment,

          id:
            normalizedCommentId,

          content:
            normalizeCreativeCommentContent(
              comment.content,
            ),

          repliesCount:
            normalizeCreativeCommentsCount(
              comment.repliesCount,
            ),

          likesCount:
            normalizeCreativeCommentLikesCount(
              comment.likesCount,
            ),
        };
      },
    );

  if (
    replaced
  ) {
    return nextComments;
  }

  return [
    ...nextComments,
    comment,
  ];
}

/* =========================================================
   ELIMINAR UN COMENTARIO
   ========================================================= */

function removeCreativeCommentFromCollection(
  comments:
    readonly CreativeViewerCommentPreview[],
  commentId:
    string,
): CreativeViewerCommentPreview[] {
  return comments.filter(
    (
      comment,
    ) =>
      comment.id !==
      commentId,
  );
}

/* =========================================================
   ACTUALIZAR RESPUESTAS DEL PADRE
   ========================================================= */

function increaseCreativeCommentRepliesCount(
  comments:
    readonly CreativeViewerCommentPreview[],
  parentCommentId:
    string,
): CreativeViewerCommentPreview[] {
  return comments.map(
    (
      comment,
    ) => {
      if (
        comment.id !==
        parentCommentId
      ) {
        return comment;
      }

      return {
        ...comment,

        repliesCount:
          normalizeCreativeCommentsCount(
            comment.repliesCount +
            1,
          ),
      };
    },
  );
}

/* =========================================================
   ACTUALIZAR ME GUSTA LOCALMENTE
   ========================================================= */

function updateCreativeCommentLikeLocally(
  comments:
    readonly CreativeViewerCommentPreview[],
  commentId:
    string,
  liked:
    boolean,
  likesCount:
    number,
): CreativeViewerCommentPreview[] {
  return comments.map(
    (
      comment,
    ) => {
      if (
        comment.id !==
        commentId
      ) {
        return comment;
      }

      return {
        ...comment,

        likedByCurrentUser:
          liked,

        likesCount:
          normalizeCreativeCommentLikesCount(
            likesCount,
          ),
      };
    },
  );
}

/* =========================================================
   BUSCAR COMENTARIO
   ========================================================= */

function findCreativeComment(
  comments:
    readonly CreativeViewerCommentPreview[],
  commentId:
    string,
): CreativeViewerCommentPreview | null {
  return (
    comments.find(
      (
        comment,
      ) =>
        comment.id ===
        commentId,
    ) ??
    null
  );
}

/* =========================================================
   DETECTAR CANCELACIÓN
   ========================================================= */

function isCreativeCommentsAbortError(
  error:
    unknown,
): boolean {
  return (
    error instanceof
      DOMException &&
    error.name ===
      "AbortError"
  );
}

/* =========================================================
   LEER RESPUESTA
   ========================================================= */

async function readCreativeCommentsResponse<
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

function getCreativeCommentsErrorMessage<
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
   MENSAJES DE ERROR
   ========================================================= */

function getCreativeCommentsFallbackError(
  action:
    CreativeCommentMutationKind | "LOAD",
  language:
    CreativeApiLanguage,
): string {
  if (
    language ===
    "en"
  ) {
    switch (
      action
    ) {
      case "LOAD":
        return "The comments could not be loaded.";

      case "CREATE":
        return "The comment could not be posted.";

      case "REPLY":
        return "The reply could not be posted.";

      case "UPDATE":
        return "The comment could not be updated.";

      case "DELETE":
        return "The comment could not be deleted.";

      case "LIKE":
        return "The comment like could not be updated.";

      case "REPORT":
        return "The comment could not be reported.";
    }
  }

  switch (
    action
  ) {
    case "LOAD":
      return "No fue posible cargar los comentarios.";

    case "CREATE":
      return "No fue posible publicar el comentario.";

    case "REPLY":
      return "No fue posible publicar la respuesta.";

    case "UPDATE":
      return "No fue posible actualizar el comentario.";

    case "DELETE":
      return "No fue posible eliminar el comentario.";

    case "LIKE":
      return "No fue posible actualizar el Me gusta del comentario.";

    case "REPORT":
      return "No fue posible reportar el comentario.";
  }
}

/* =========================================================
   VALIDAR CONTENIDO
   ========================================================= */

function validateCreativeCommentContent(
  content:
    string,
  language:
    CreativeApiLanguage,
): string | null {
  if (
    content.length <
    CREATIVE_TEXT_LIMITS.COMMENT_MIN_LENGTH
  ) {
    return language ===
      "en"
      ? "Write a comment before submitting it."
      : "Escribe un comentario antes de publicarlo.";
  }

  if (
    content.length >
    CREATIVE_TEXT_LIMITS.COMMENT_MAX_LENGTH
  ) {
    return language ===
      "en"
      ? `The comment cannot exceed ${CREATIVE_TEXT_LIMITS.COMMENT_MAX_LENGTH} characters.`
      : `El comentario no puede superar los ${CREATIVE_TEXT_LIMITS.COMMENT_MAX_LENGTH} caracteres.`;
  }

  return null;
}

/* =========================================================
   HOOK PRINCIPAL
   ========================================================= */

export function useCreativeComments(
  options:
    UseCreativeCommentsOptions,
): UseCreativeCommentsResult {
  const {
    itemId,

    initialData =
      null,

    language =
      "es",

    enabled =
      true,

    autoLoad =
      true,

    revalidateOnMount =
      true,

    pageSize,

    authenticated =
      false,

    canComment =
      false,

    canLikeComments =
      authenticated,

    canReportComments =
      authenticated,

    requireAuthentication =
      true,

    returnTo,

    onAuthenticationRequired,

    onCommentsCountChange,
  } =
    options;

  const normalizedItemId =
    normalizeCreativeCommentsItemId(
      itemId,
    );

  const normalizedReturnTo =
    normalizeCreativeReturnTo(
      returnTo,
    );

  const normalizedPageSize =
    normalizeCreativeCommentsPageSize(
      pageSize,
    );

  /* =======================================================
     DATOS PRINCIPALES
     ======================================================= */

  const [
    comments,
    setComments,
  ] =
    useState<
      CreativeViewerCommentPreview[]
    >(
      () =>
        normalizeCreativeComments(
          initialData?.items ??
          [],
        ),
    );

  const commentsRef =
    useRef<
      CreativeViewerCommentPreview[]
    >(
      normalizeCreativeComments(
        initialData?.items ??
        [],
      ),
    );

  const [
    total,
    setTotal,
  ] =
    useState<number>(
      () =>
        normalizeCreativeCommentsCount(
          initialData?.total ??
          0,
        ),
    );

  const totalRef =
    useRef<number>(
      normalizeCreativeCommentsCount(
        initialData?.total ??
        0,
      ),
    );

  const [
    nextCursor,
    setNextCursor,
  ] =
    useState<
      string | null
    >(
      () =>
        initialData?.nextCursor ??
        null,
    );

  const nextCursorRef =
    useRef<
      string | null
    >(
      initialData?.nextCursor ??
      null,
    );

  const [
    hasMore,
    setHasMore,
  ] =
    useState<boolean>(
      () =>
        initialData?.hasMore ??
        false,
    );

  const hasMoreRef =
    useRef<boolean>(
      initialData?.hasMore ??
      false,
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
    loadingMore,
    setLoadingMore,
  ] =
    useState<boolean>(
      false,
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState<boolean>(
      false,
    );

  /* =======================================================
     ESTADO DE MUTACIÓN
     ======================================================= */

  const [
    mutationKind,
    setMutationKind,
  ] =
    useState<
      CreativeCommentMutationKind | null
    >(
      null,
    );

  const [
    editingCommentId,
    setEditingCommentId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    deletingCommentId,
    setDeletingCommentId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    likingCommentId,
    setLikingCommentId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    reportingCommentId,
    setReportingCommentId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  /* =======================================================
     ERRORES
     ======================================================= */

  const [
    collectionError,
    setCollectionError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    mutationError,
    setMutationError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  /* =======================================================
     ÚLTIMA ACTUALIZACIÓN
     ======================================================= */

  /*
   * Comienza en null para no ejecutar Date.now()
   * durante el renderizado.
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
     REFERENCIAS DE CONTROL
     ======================================================= */

  const collectionAbortControllerRef =
    useRef<
      AbortController | null
    >(
      null,
    );

  const collectionRequestSequenceRef =
    useRef<number>(
      0,
    );

  const mutationRuntimeRef =
    useRef<CreativeCommentMutationRuntime>({
      sequence:
        0,

      kind:
        null,

      commentId:
        null,

      controller:
        null,
    });

  const loadedItemIdRef =
    useRef<string>(
      initialData
        ? normalizedItemId
        : "",
    );

  const skipInitialRequestRef =
    useRef<boolean>(
      Boolean(
        initialData &&
        !revalidateOnMount,
      ),
    );

  /*
   * Los callbacks externos se guardan en referencias para
   * no provocar una recarga del listado cuando cambie la
   * identidad de una función del componente padre.
   */
  const authenticationCallbackRef =
    useRef(
      onAuthenticationRequired,
    );

  const commentsCountCallbackRef =
    useRef(
      onCommentsCountChange,
    );

  useEffect(
    () => {
      authenticationCallbackRef.current =
        onAuthenticationRequired;
    },
    [
      onAuthenticationRequired,
    ],
  );

  useEffect(
    () => {
      commentsCountCallbackRef.current =
        onCommentsCountChange;
    },
    [
      onCommentsCountChange,
    ],
  );

  /* =======================================================
     GUARDAR COLECCIÓN COMPLETA
     ======================================================= */

  const commitCommentsCollection =
    useCallback(
      (
        nextComments:
          readonly CreativeViewerCommentPreview[],
        nextTotal:
          number,
        nextCursor:
          string | null,
        nextHasMore:
          boolean,
      ): void => {
        const normalizedComments =
          normalizeCreativeComments(
            nextComments,
          );

        const normalizedTotal =
          normalizeCreativeCommentsCount(
            nextTotal,
          );

        commentsRef.current =
          normalizedComments;

        totalRef.current =
          normalizedTotal;

        nextCursorRef.current =
          nextCursor;

        hasMoreRef.current =
          nextHasMore;

        setComments(
          normalizedComments,
        );

        setTotal(
          normalizedTotal,
        );

        setNextCursor(
          nextCursor,
        );

        setHasMore(
          nextHasMore,
        );

        commentsCountCallbackRef.current?.(
          normalizedTotal,
        );
      },
      [],
    );

  /* =======================================================
     REEMPLAZAR DATOS EXTERNAMENTE
     ======================================================= */

  const replaceComments =
    useCallback(
      (
        data:
          CreativeCommentsInitialData,
      ): void => {
        collectionAbortControllerRef.current?.abort();

        collectionAbortControllerRef.current =
          null;

        collectionRequestSequenceRef.current +=
          1;

        loadedItemIdRef.current =
          normalizedItemId;

        commitCommentsCollection(
          data.items,
          data.total,
          data.nextCursor,
          data.hasMore,
        );

        setCollectionError(
          null,
        );

        setMutationError(
          null,
        );

        setLoading(
          false,
        );

        setRefreshing(
          false,
        );

        setLoadingMore(
          false,
        );
      },
      [
        commitCommentsCollection,
        normalizedItemId,
      ],
    );

  /* =======================================================
     REEMPLAZAR UN COMENTARIO LOCALMENTE
     ======================================================= */

  const replaceComment =
    useCallback(
      (
        comment:
          CreativeViewerCommentPreview,
      ): void => {
        const nextComments =
          replaceCreativeCommentInCollection(
            commentsRef.current,
            comment,
          );

        commitCommentsCollection(
          nextComments,
          totalRef.current,
          nextCursorRef.current,
          hasMoreRef.current,
        );
      },
      [
        commitCommentsCollection,
      ],
    );

  /* =======================================================
     ELIMINAR LOCALMENTE
     ======================================================= */

  const removeCommentLocally =
    useCallback(
      (
        commentId:
          string,
      ): void => {
        const normalizedCommentId =
          normalizeCreativeCommentId(
            commentId,
          );

        if (
          !normalizedCommentId
        ) {
          return;
        }

        const commentExists =
          commentsRef.current.some(
            (
              comment,
            ) =>
              comment.id ===
              normalizedCommentId,
          );

        if (
          !commentExists
        ) {
          return;
        }

        const nextComments =
          removeCreativeCommentFromCollection(
            commentsRef.current,
            normalizedCommentId,
          );

        commitCommentsCollection(
          nextComments,
          Math.max(
            0,
            totalRef.current -
            1,
          ),
          nextCursorRef.current,
          hasMoreRef.current,
        );
      },
      [
        commitCommentsCollection,
      ],
    );

  /* =======================================================
     SOLICITAR AUTENTICACIÓN
     ======================================================= */

  const requestAuthentication =
    useCallback(
      (
        action:
          CreativeCommentMutationKind,
      ): void => {
        const redirectTo =
          createCreativeLoginRoute(
            normalizedReturnTo,
          );

        const request:
          CreativeCommentsAuthenticationRequest = {
            action,

            returnTo:
              normalizedReturnTo,

            redirectTo,
          };

        const callback =
          authenticationCallbackRef.current;

        if (
          callback
        ) {
          callback(
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
      ],
    );

  /* =======================================================
     VALIDAR PERMISO PARA COMENTAR
     ======================================================= */

  const validateCommentPermission =
    useCallback(
      (
        action:
          CreativeCommentMutationKind,
      ): boolean => {
        if (
          !enabled ||
          !normalizedItemId
        ) {
          return false;
        }

        if (
          canComment
        ) {
          return true;
        }

        if (
          requireAuthentication &&
          !authenticated
        ) {
          requestAuthentication(
            action,
          );

          return false;
        }

        setMutationError(
          language ===
            "en"
            ? "You do not have permission to comment on this design."
            : "No tienes permiso para comentar en este diseño.",
        );

        return false;
      },
      [
        authenticated,
        canComment,
        enabled,
        language,
        normalizedItemId,
        requestAuthentication,
        requireAuthentication,
      ],
    );

  /* =======================================================
     VALIDAR PERMISO PARA INTERACTUAR
     ======================================================= */

  const validateAuthenticatedInteraction =
    useCallback(
      (
        action:
          CreativeCommentMutationKind,
        allowed:
          boolean,
      ): boolean => {
        if (
          !enabled ||
          !normalizedItemId
        ) {
          return false;
        }

        if (
          !authenticated
        ) {
          requestAuthentication(
            action,
          );

          return false;
        }

        if (
          allowed
        ) {
          return true;
        }

        setMutationError(
          language ===
            "en"
            ? "You do not have permission to perform this action."
            : "No tienes permiso para realizar esta acción.",
        );

        return false;
      },
      [
        authenticated,
        enabled,
        language,
        normalizedItemId,
        requestAuthentication,
      ],
    );

  /* =======================================================
     INICIAR MUTACIÓN
     ======================================================= */

  const beginMutation =
    useCallback(
      (
        kind:
          CreativeCommentMutationKind,
        commentId:
          string | null,
      ): {
        sequence:
          number;

        controller:
          AbortController;
      } | null => {
        if (
          mutationRuntimeRef.current.kind !==
          null
        ) {
          return null;
        }

        const controller =
          new AbortController();

        const sequence =
          mutationRuntimeRef.current.sequence +
          1;

        mutationRuntimeRef.current = {
          sequence,

          kind,

          commentId,

          controller,
        };

        setMutationKind(
          kind,
        );

        setMutationError(
          null,
        );

        if (
          kind ===
            "CREATE" ||
          kind ===
            "REPLY"
        ) {
          setSubmitting(
            true,
          );
        }

        if (
          kind ===
          "UPDATE"
        ) {
          setEditingCommentId(
            commentId,
          );
        }

        if (
          kind ===
          "DELETE"
        ) {
          setDeletingCommentId(
            commentId,
          );
        }

        if (
          kind ===
          "LIKE"
        ) {
          setLikingCommentId(
            commentId,
          );
        }

        if (
          kind ===
          "REPORT"
        ) {
          setReportingCommentId(
            commentId,
          );
        }

        return {
          sequence,
          controller,
        };
      },
      [],
    );

  /* =======================================================
     FINALIZAR MUTACIÓN
     ======================================================= */

  const finishMutation =
    useCallback(
      (
        sequence:
          number,
        controller:
          AbortController,
      ): void => {
        if (
          mutationRuntimeRef.current.sequence !==
            sequence ||
          mutationRuntimeRef.current.controller !==
            controller
        ) {
          return;
        }

        mutationRuntimeRef.current = {
          sequence,

          kind:
            null,

          commentId:
            null,

          controller:
            null,
        };

        setMutationKind(
          null,
        );

        setSubmitting(
          false,
        );

        setEditingCommentId(
          null,
        );

        setDeletingCommentId(
          null,
        );

        setLikingCommentId(
          null,
        );

        setReportingCommentId(
          null,
        );
      },
      [],
    );

  /* =======================================================
     CANCELAR SOLICITUD ACTUAL
     ======================================================= */

  const cancelCurrentRequest =
    useCallback(
      (): void => {
        collectionAbortControllerRef.current?.abort();

        mutationRuntimeRef.current.controller?.abort();

        collectionAbortControllerRef.current =
          null;

        collectionRequestSequenceRef.current +=
          1;

        const nextMutationSequence =
          mutationRuntimeRef.current.sequence +
          1;

        mutationRuntimeRef.current = {
          sequence:
            nextMutationSequence,

          kind:
            null,

          commentId:
            null,

          controller:
            null,
        };

        setLoading(
          false,
        );

        setRefreshing(
          false,
        );

        setLoadingMore(
          false,
        );

        setSubmitting(
          false,
        );

        setMutationKind(
          null,
        );

        setEditingCommentId(
          null,
        );

        setDeletingCommentId(
          null,
        );

        setLikingCommentId(
          null,
        );

        setReportingCommentId(
          null,
        );
      },
      [],
    );

  /* =======================================================
     CONSULTAR COMENTARIOS
     ======================================================= */

  const requestComments =
    useCallback(
      async (
        mode:
          CreativeCommentsRequestMode,
      ): Promise<void> => {
        if (
          !enabled ||
          !normalizedItemId
        ) {
          return;
        }

        if (
          mode ===
            "APPEND" &&
          (
            loadingMore ||
            !hasMoreRef.current ||
            !nextCursorRef.current
          )
        ) {
          return;
        }

        collectionAbortControllerRef.current?.abort();

        const controller =
          new AbortController();

        collectionAbortControllerRef.current =
          controller;

        const sequence =
          collectionRequestSequenceRef.current +
          1;

        collectionRequestSequenceRef.current =
          sequence;

        setCollectionError(
          null,
        );

        if (
          mode ===
          "APPEND"
        ) {
          setLoadingMore(
            true,
          );
        } else if (
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
        }

        /*
         * Cuando cambia la publicación, elimina los datos
         * pertenecientes al diseño anterior.
         */
        if (
          loadedItemIdRef.current &&
          loadedItemIdRef.current !==
            normalizedItemId
        ) {
          commitCommentsCollection(
            [],
            0,
            null,
            false,
          );
        }

        try {
          const endpoint =
            createCreativeItemCommentsApiRoute(
              normalizedItemId,
              {
                cursor:
                  mode ===
                  "APPEND"
                    ? nextCursorRef.current ??
                      undefined
                    : undefined,

                limit:
                  normalizedPageSize,

                includeReplies:
                  true,
              },
            );

          const response =
            await fetch(
              endpoint,
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
                  controller.signal,
              },
            );

          const payload =
            await readCreativeCommentsResponse<
              CreativeCommentsCollectionApiData
            >(
              response,
            );

          if (
            !response.ok ||
            !payload ||
            payload.ok ===
              false
          ) {
            throw new Error(
              getCreativeCommentsErrorMessage(
                payload,
                language,
                getCreativeCommentsFallbackError(
                  "LOAD",
                  language,
                ),
              ),
            );
          }

          if (
            sequence !==
            collectionRequestSequenceRef.current
          ) {
            return;
          }

          const incomingComments =
            normalizeCreativeComments(
              payload.data.items,
            );

          const nextComments =
            mode ===
            "APPEND"
              ? mergeCreativeComments(
                  commentsRef.current,
                  incomingComments,
                )
              : incomingComments;

          loadedItemIdRef.current =
            normalizedItemId;

          commitCommentsCollection(
            nextComments,
            payload.data.total,
            payload.data.nextCursor,
            payload.data.hasMore,
          );

          setLastUpdatedAt(
            Date.now(),
          );
        } catch (
          error
        ) {
          if (
            isCreativeCommentsAbortError(
              error,
            )
          ) {
            return;
          }

          if (
            sequence !==
            collectionRequestSequenceRef.current
          ) {
            return;
          }

          setCollectionError(
            error instanceof
              Error
              ? error.message
              : getCreativeCommentsFallbackError(
                  "LOAD",
                  language,
                ),
          );
        } finally {
          if (
            sequence ===
            collectionRequestSequenceRef.current
          ) {
            setLoading(
              false,
            );

            setRefreshing(
              false,
            );

            setLoadingMore(
              false,
            );

            if (
              collectionAbortControllerRef.current ===
              controller
            ) {
              collectionAbortControllerRef.current =
                null;
            }
          }
        }
      },
      [
        commitCommentsCollection,
        enabled,
        language,
        loadingMore,
        normalizedItemId,
        normalizedPageSize,
      ],
    );

  /* =======================================================
     CARGA AUTOMÁTICA
     ======================================================= */

  useEffect(
    () => {
      if (
        !enabled ||
        !autoLoad ||
        !normalizedItemId
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
       * Se programa fuera de la ejecución síncrona del
       * efecto porque requestComments modifica estados
       * antes de llegar a su primera operación asíncrona.
       */
      const timeoutId =
        window.setTimeout(
          () => {
            const mode:
              CreativeCommentsRequestMode =
                loadedItemIdRef.current ===
                normalizedItemId
                  ? "REFRESH"
                  : "REPLACE";

            void requestComments(
              mode,
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
      autoLoad,
      enabled,
      normalizedItemId,
      requestComments,
    ],
  );

  /* =======================================================
     CANCELAR AL DESACTIVARSE
     ======================================================= */

  useEffect(
    () => {
      if (
        enabled
      ) {
        return;
      }

      collectionAbortControllerRef.current?.abort();

      mutationRuntimeRef.current.controller?.abort();
    },
    [
      enabled,
    ],
  );

  /* =======================================================
     ACTUALIZAR LISTADO
     ======================================================= */

  const refresh =
    useCallback(
      async (): Promise<void> => {
        await requestComments(
          "REFRESH",
        );
      },
      [
        requestComments,
      ],
    );

  /* =======================================================
     REINTENTAR
     ======================================================= */

  const retry =
    useCallback(
      async (): Promise<void> => {
        await requestComments(
          loadedItemIdRef.current ===
          normalizedItemId
            ? "REFRESH"
            : "REPLACE",
        );
      },
      [
        normalizedItemId,
        requestComments,
      ],
    );

  /* =======================================================
     CARGAR SIGUIENTE PÁGINA
     ======================================================= */

  const loadMore =
    useCallback(
      async (): Promise<void> => {
        if (
          loading ||
          refreshing ||
          loadingMore
        ) {
          return;
        }

        await requestComments(
          "APPEND",
        );
      },
      [
        loading,
        loadingMore,
        refreshing,
        requestComments,
      ],
    );

  /* =======================================================
     PUBLICAR COMENTARIO O RESPUESTA
     ======================================================= */

  const submitComment =
    useCallback(
      async (
        content:
          string,
        parentCommentId:
          string | null = null,
      ): Promise<
        CreativeViewerCommentPreview | null
      > => {
        const normalizedParentCommentId =
          normalizeCreativeCommentId(
            parentCommentId,
          );

        const action:
          CreativeCommentMutationKind =
            normalizedParentCommentId
              ? "REPLY"
              : "CREATE";

        if (
          !validateCommentPermission(
            action,
          )
        ) {
          return null;
        }

        const normalizedContent =
          normalizeCreativeCommentContent(
            content,
          );

        const validationError =
          validateCreativeCommentContent(
            normalizedContent,
            language,
          );

        if (
          validationError
        ) {
          setMutationError(
            validationError,
          );

          return null;
        }

        const runtime =
          beginMutation(
            action,
            normalizedParentCommentId ||
            null,
          );

        if (
          !runtime
        ) {
          return null;
        }

        const {
          sequence,
          controller,
        } =
          runtime;

        try {
          const response =
            await fetch(
              createCreativeItemCommentsApiRoute(
                normalizedItemId,
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
                  JSON.stringify({
                    content:
                      normalizedContent,

                    parentCommentId:
                      normalizedParentCommentId ||
                      null,
                  }),

                signal:
                  controller.signal,
              },
            );

          if (
            response.status ===
            401
          ) {
            requestAuthentication(
              action,
            );

            return null;
          }

          const payload =
            await readCreativeCommentsResponse<
              CreativeCommentMutationApiData
            >(
              response,
            );

          if (
            !response.ok ||
            !payload ||
            payload.ok ===
              false
          ) {
            throw new Error(
              getCreativeCommentsErrorMessage(
                payload,
                language,
                getCreativeCommentsFallbackError(
                  action,
                  language,
                ),
              ),
            );
          }

          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return null;
          }

          let nextComments =
            commentsRef.current;

          if (
            normalizedParentCommentId
          ) {
            nextComments =
              increaseCreativeCommentRepliesCount(
                nextComments,
                normalizedParentCommentId,
              );
          }

          nextComments =
            mergeCreativeComments(
              nextComments,
              [
                payload.data.comment,
              ],
            );

          const definitiveTotal =
            payload.data.commentsCount ??
            payload.data.total ??
            (
              totalRef.current +
              1
            );

          commitCommentsCollection(
            nextComments,
            definitiveTotal,
            nextCursorRef.current,
            hasMoreRef.current,
          );

          setLastUpdatedAt(
            Date.now(),
          );

          return payload.data.comment;
        } catch (
          error
        ) {
          if (
            isCreativeCommentsAbortError(
              error,
            )
          ) {
            return null;
          }

          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return null;
          }

          setMutationError(
            error instanceof
              Error
              ? error.message
              : getCreativeCommentsFallbackError(
                  action,
                  language,
                ),
          );

          return null;
        } finally {
          finishMutation(
            sequence,
            controller,
          );
        }
      },
      [
        beginMutation,
        commitCommentsCollection,
        finishMutation,
        language,
        normalizedItemId,
        requestAuthentication,
        validateCommentPermission,
      ],
    );

  /* =======================================================
     EDITAR COMENTARIO
     ======================================================= */

  const updateComment =
    useCallback(
      async (
        commentId:
          string,
        content:
          string,
      ): Promise<
        CreativeViewerCommentPreview | null
      > => {
        const normalizedCommentId =
          normalizeCreativeCommentId(
            commentId,
          );

        if (
          !normalizedCommentId ||
          !validateCommentPermission(
            "UPDATE",
          )
        ) {
          return null;
        }

        const normalizedContent =
          normalizeCreativeCommentContent(
            content,
          );

        const validationError =
          validateCreativeCommentContent(
            normalizedContent,
            language,
          );

        if (
          validationError
        ) {
          setMutationError(
            validationError,
          );

          return null;
        }

        const runtime =
          beginMutation(
            "UPDATE",
            normalizedCommentId,
          );

        if (
          !runtime
        ) {
          return null;
        }

        const {
          sequence,
          controller,
        } =
          runtime;

        try {
          const response =
            await fetch(
              createCreativeCommentApiRoute(
                normalizedCommentId,
              ),
              {
                method:
                  "PATCH",

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
                    content:
                      normalizedContent,
                  }),

                signal:
                  controller.signal,
              },
            );

          if (
            response.status ===
            401
          ) {
            requestAuthentication(
              "UPDATE",
            );

            return null;
          }

          const payload =
            await readCreativeCommentsResponse<
              CreativeCommentMutationApiData
            >(
              response,
            );

          if (
            !response.ok ||
            !payload ||
            payload.ok ===
              false
          ) {
            throw new Error(
              getCreativeCommentsErrorMessage(
                payload,
                language,
                getCreativeCommentsFallbackError(
                  "UPDATE",
                  language,
                ),
              ),
            );
          }

          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return null;
          }

          const nextComments =
            replaceCreativeCommentInCollection(
              commentsRef.current,
              payload.data.comment,
            );

          commitCommentsCollection(
            nextComments,
            totalRef.current,
            nextCursorRef.current,
            hasMoreRef.current,
          );

          setLastUpdatedAt(
            Date.now(),
          );

          return payload.data.comment;
        } catch (
          error
        ) {
          if (
            isCreativeCommentsAbortError(
              error,
            )
          ) {
            return null;
          }

          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return null;
          }

          setMutationError(
            error instanceof
              Error
              ? error.message
              : getCreativeCommentsFallbackError(
                  "UPDATE",
                  language,
                ),
          );

          return null;
        } finally {
          finishMutation(
            sequence,
            controller,
          );
        }
      },
      [
        beginMutation,
        commitCommentsCollection,
        finishMutation,
        language,
        requestAuthentication,
        validateCommentPermission,
      ],
    );

  /* =======================================================
     ELIMINAR COMENTARIO
     ======================================================= */

  const deleteComment =
    useCallback(
      async (
        commentId:
          string,
      ): Promise<boolean> => {
        const normalizedCommentId =
          normalizeCreativeCommentId(
            commentId,
          );

        if (
          !normalizedCommentId ||
          !validateCommentPermission(
            "DELETE",
          )
        ) {
          return false;
        }

        const runtime =
          beginMutation(
            "DELETE",
            normalizedCommentId,
          );

        if (
          !runtime
        ) {
          return false;
        }

        const {
          sequence,
          controller,
        } =
          runtime;

        try {
          const response =
            await fetch(
              createCreativeCommentApiRoute(
                normalizedCommentId,
              ),
              {
                method:
                  "DELETE",

                headers: {
                  Accept:
                    "application/json",
                },

                credentials:
                  "same-origin",

                cache:
                  "no-store",

                signal:
                  controller.signal,
              },
            );

          if (
            response.status ===
            401
          ) {
            requestAuthentication(
              "DELETE",
            );

            return false;
          }

          const payload =
            await readCreativeCommentsResponse<
              CreativeCommentDeleteApiData
            >(
              response,
            );

          if (
            !response.ok ||
            !payload ||
            payload.ok ===
              false
          ) {
            throw new Error(
              getCreativeCommentsErrorMessage(
                payload,
                language,
                getCreativeCommentsFallbackError(
                  "DELETE",
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

          const nextComments =
            removeCreativeCommentFromCollection(
              commentsRef.current,
              normalizedCommentId,
            );

          const definitiveTotal =
            payload.data.commentsCount ??
            payload.data.total ??
            Math.max(
              0,
              totalRef.current -
              1,
            );

          commitCommentsCollection(
            nextComments,
            definitiveTotal,
            nextCursorRef.current,
            hasMoreRef.current,
          );

          setLastUpdatedAt(
            Date.now(),
          );

          return payload.data.deleted;
        } catch (
          error
        ) {
          if (
            isCreativeCommentsAbortError(
              error,
            )
          ) {
            return false;
          }

          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return false;
          }

          setMutationError(
            error instanceof
              Error
              ? error.message
              : getCreativeCommentsFallbackError(
                  "DELETE",
                  language,
                ),
          );

          return false;
        } finally {
          finishMutation(
            sequence,
            controller,
          );
        }
      },
      [
        beginMutation,
        commitCommentsCollection,
        finishMutation,
        language,
        requestAuthentication,
        validateCommentPermission,
      ],
    );

  /* =======================================================
     ME GUSTA EN COMENTARIO
     ======================================================= */

  const toggleCommentLike =
    useCallback(
      async (
        commentId:
          string,
      ): Promise<boolean> => {
        const normalizedCommentId =
          normalizeCreativeCommentId(
            commentId,
          );

        if (
          !normalizedCommentId ||
          !validateAuthenticatedInteraction(
            "LIKE",
            canLikeComments,
          )
        ) {
          return false;
        }

        const previousComment =
          findCreativeComment(
            commentsRef.current,
            normalizedCommentId,
          );

        if (
          !previousComment
        ) {
          setMutationError(
            language ===
              "en"
              ? "The selected comment is no longer available."
              : "El comentario seleccionado ya no está disponible.",
          );

          return false;
        }

        const runtime =
          beginMutation(
            "LIKE",
            normalizedCommentId,
          );

        if (
          !runtime
        ) {
          return false;
        }

        const {
          sequence,
          controller,
        } =
          runtime;

        const nextLiked =
          !previousComment
            .likedByCurrentUser;

        const optimisticLikesCount =
          normalizeCreativeCommentLikesCount(
            previousComment.likesCount +
            (
              nextLiked
                ? 1
                : -1
            ),
          );

        /*
         * Actualización optimista.
         */
        const optimisticComments =
          updateCreativeCommentLikeLocally(
            commentsRef.current,
            normalizedCommentId,
            nextLiked,
            optimisticLikesCount,
          );

        commitCommentsCollection(
          optimisticComments,
          totalRef.current,
          nextCursorRef.current,
          hasMoreRef.current,
        );

        try {
          const response =
            await fetch(
              createCreativeCommentApiRoute(
                normalizedCommentId,
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
                  JSON.stringify({
                    action:
                      "TOGGLE_LIKE",
                  }),

                signal:
                  controller.signal,
              },
            );

          if (
            response.status ===
            401
          ) {
            commitCommentsCollection(
              replaceCreativeCommentInCollection(
                commentsRef.current,
                previousComment,
              ),
              totalRef.current,
              nextCursorRef.current,
              hasMoreRef.current,
            );

            requestAuthentication(
              "LIKE",
            );

            return false;
          }

          const payload =
            await readCreativeCommentsResponse<
              CreativeCommentLikeApiData
            >(
              response,
            );

          if (
            !response.ok ||
            !payload ||
            payload.ok ===
              false
          ) {
            throw new Error(
              getCreativeCommentsErrorMessage(
                payload,
                language,
                getCreativeCommentsFallbackError(
                  "LIKE",
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

          const definitiveComments =
            updateCreativeCommentLikeLocally(
              commentsRef.current,
              normalizedCommentId,
              payload.data.liked,
              payload.data.likesCount,
            );

          commitCommentsCollection(
            definitiveComments,
            totalRef.current,
            nextCursorRef.current,
            hasMoreRef.current,
          );

          return true;
        } catch (
          error
        ) {
          /*
           * Restaura el estado anterior cuando falla la API.
           */
          if (
            sequence ===
            mutationRuntimeRef.current.sequence
          ) {
            const restoredComments =
              replaceCreativeCommentInCollection(
                commentsRef.current,
                previousComment,
              );

            commitCommentsCollection(
              restoredComments,
              totalRef.current,
              nextCursorRef.current,
              hasMoreRef.current,
            );
          }

          if (
            isCreativeCommentsAbortError(
              error,
            )
          ) {
            return false;
          }

          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return false;
          }

          setMutationError(
            error instanceof
              Error
              ? error.message
              : getCreativeCommentsFallbackError(
                  "LIKE",
                  language,
                ),
          );

          return false;
        } finally {
          finishMutation(
            sequence,
            controller,
          );
        }
      },
      [
        beginMutation,
        canLikeComments,
        commitCommentsCollection,
        finishMutation,
        language,
        requestAuthentication,
        validateAuthenticatedInteraction,
      ],
    );

  /* =======================================================
     REPORTAR COMENTARIO
     ======================================================= */

  const reportComment =
    useCallback(
      async (
        commentId:
          string,
        reason:
          string | null = null,
      ): Promise<boolean> => {
        const normalizedCommentId =
          normalizeCreativeCommentId(
            commentId,
          );

        if (
          !normalizedCommentId ||
          !validateAuthenticatedInteraction(
            "REPORT",
            canReportComments,
          )
        ) {
          return false;
        }

        const runtime =
          beginMutation(
            "REPORT",
            normalizedCommentId,
          );

        if (
          !runtime
        ) {
          return false;
        }

        const {
          sequence,
          controller,
        } =
          runtime;

        try {
          const response =
            await fetch(
              createCreativeCommentApiRoute(
                normalizedCommentId,
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
                  JSON.stringify({
                    action:
                      "REPORT",

                    reason:
                      reason?.trim() ||
                      null,
                  }),

                signal:
                  controller.signal,
              },
            );

          if (
            response.status ===
            401
          ) {
            requestAuthentication(
              "REPORT",
            );

            return false;
          }

          const payload =
            await readCreativeCommentsResponse<
              CreativeCommentReportApiData
            >(
              response,
            );

          if (
            !response.ok ||
            !payload ||
            payload.ok ===
              false
          ) {
            throw new Error(
              getCreativeCommentsErrorMessage(
                payload,
                language,
                getCreativeCommentsFallbackError(
                  "REPORT",
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

          return payload.data.reported;
        } catch (
          error
        ) {
          if (
            isCreativeCommentsAbortError(
              error,
            )
          ) {
            return false;
          }

          if (
            sequence !==
            mutationRuntimeRef.current.sequence
          ) {
            return false;
          }

          setMutationError(
            error instanceof
              Error
              ? error.message
              : getCreativeCommentsFallbackError(
                  "REPORT",
                  language,
                ),
          );

          return false;
        } finally {
          finishMutation(
            sequence,
            controller,
          );
        }
      },
      [
        beginMutation,
        canReportComments,
        finishMutation,
        language,
        requestAuthentication,
        validateAuthenticatedInteraction,
      ],
    );

  /* =======================================================
     LIMPIAR ERRORES
     ======================================================= */

  const clearError =
    useCallback(
      (): void => {
        setCollectionError(
          null,
        );

        setMutationError(
          null,
        );
      },
      [],
    );

  /* =======================================================
     CANCELACIÓN AL DESMONTAR
     ======================================================= */

  useEffect(
    () => {
      return () => {
        collectionAbortControllerRef.current?.abort();

        mutationRuntimeRef.current.controller?.abort();
      };
    },
    [],
  );

  /* =======================================================
     INFORMACIÓN DERIVADA
     ======================================================= */

  const errorMessage =
    mutationError ??
    collectionError;

  const hasError =
    errorMessage !==
    null;

  const processing =
    mutationKind !==
    null;

  const initialLoading =
    loading &&
    comments.length ===
      0;

  const empty =
    !loading &&
    !refreshing &&
    comments.length ===
      0 &&
    collectionError ===
      null;

  const ready =
    !loading &&
    collectionError ===
      null;

  const state:
    CreativeViewerCommentsState = {
      items:
        comments,

      total,

      loading,

      loadingMore,

      submitting,

      hasMore,

      nextCursor,

      errorMessage,
    };

  /* =======================================================
     RETORNO
     ======================================================= */

  return {
    state,

    comments,

    total,

    nextCursor,

    hasMore,

    loading,

    initialLoading,

    refreshing,

    loadingMore,

    submitting,

    processing,

    mutationKind,

    editingCommentId,

    deletingCommentId,

    likingCommentId,

    reportingCommentId,

    errorMessage,

    collectionError,

    mutationError,

    hasError,

    empty,

    ready,

    lastUpdatedAt,

    refresh,

    retry,

    loadMore,

    submitComment,

    updateComment,

    deleteComment,

    toggleCommentLike,

    reportComment,

    replaceComments,

    replaceComment,

    removeCommentLocally,

    clearError,

    cancelCurrentRequest,
  };
}
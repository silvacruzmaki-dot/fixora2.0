/*
 * Rutas oficiales del módulo Diseño / Creative.
 *
 * Este archivo centraliza:
 * - Rutas públicas.
 * - Rutas administrativas.
 * - Rutas de autenticación.
 * - Endpoints públicos de la API.
 * - Endpoints administrativos de la API.
 * - Parámetros de consulta.
 * - Generadores seguros de URLs dinámicas.
 * - Redirecciones internas.
 *
 * Regla:
 * Ningún componente, hook, servicio o ruta API debe escribir
 * manualmente URLs del módulo Creative cuando exista aquí
 * una constante o una función que pueda generarla.
 *
 * Este archivo puede utilizarse tanto en el navegador
 * como en el servidor.
 */

import type {
  CreativeCatalogQuery,
  CreativeShareChannel,
} from "@/types/creative/creative-api.types";

import type {
  CreativeItemId,
  CreativeItemSlug,
} from "@/types/creative/creative-item.types";

/* =========================================================
   NOMBRE DEL MÓDULO
   ========================================================= */

export const CREATIVE_ROUTE_NAMESPACE =
  "creative";

/* =========================================================
   PARÁMETROS DINÁMICOS
   ========================================================= */

export const CREATIVE_ROUTE_PARAMS = {
  SLUG:
    "slug",

  ITEM_ID:
    "itemId",

  COMMENT_ID:
    "commentId",

  REQUEST_ID:
    "requestId",

  ORDER_ID:
    "orderId",
} as const;

/* =========================================================
   CLAVES DE CONSULTA
   ========================================================= */

export const CREATIVE_QUERY_KEYS = {
  SEARCH:
    "search",

  CONTENT_TYPE:
    "type",

  CATEGORY:
    "category",

  TOOL:
    "tool",

  FEATURED:
    "featured",

  SORT:
    "sort",

  PAGE:
    "page",

  PAGE_SIZE:
    "pageSize",

  STATUS:
    "status",

  AUTHOR_ID:
    "authorId",

  INCLUDE_ARCHIVED:
    "includeArchived",

  SOURCE:
    "source",

  SECTION:
    "section",

  RETURN_TO:
    "returnTo",

  REDIRECT:
    "redirect",

  ITEM_ID:
    "itemId",

  ORDER_ID:
    "orderId",

  REQUEST_ID:
    "requestId",

  COMMENT_ID:
    "commentId",

  ACTION:
    "action",

  CHANNEL:
    "channel",

  PAYMENT_STATUS:
    "paymentStatus",

  REQUEST_STATUS:
    "requestStatus",

  CREATED_FROM:
    "createdFrom",

  CREATED_TO:
    "createdTo",

  CURSOR:
    "cursor",

  LIMIT:
    "limit",
} as const;

/* =========================================================
   RUTAS PÚBLICAS
   ========================================================= */

export const CREATIVE_PUBLIC_ROUTES = {
  /*
   * Catálogo principal.
   */
  ROOT:
    "/diseno",

  /*
   * Plantilla de detalle.
   *
   * Para generar una ruta real debe utilizarse:
   * createCreativeItemRoute(slug)
   */
  ITEM_TEMPLATE:
    "/diseno/[slug]",
} as const;

/* =========================================================
   RUTAS ADMINISTRATIVAS
   ========================================================= */

export const CREATIVE_ADMIN_ROUTES = {
  ROOT:
    "/admin/diseno",

  NEW_ITEM:
    "/admin/diseno/nuevo",

  EDIT_ITEM_TEMPLATE:
    "/admin/diseno/[itemId]/editar",

  REQUESTS:
    "/admin/diseno/solicitudes",

  ORDERS:
    "/admin/diseno/pedidos",

  COMMENTS:
    "/admin/diseno/comentarios",
} as const;

/* =========================================================
   RUTAS DE AUTENTICACIÓN
   ========================================================= */

export const CREATIVE_AUTH_ROUTES = {
  LOGIN:
    "/iniciar-sesion",

  REGISTER:
    "/registrarse",

  PROFILE:
    "/perfil",
} as const;

/* =========================================================
   ENDPOINTS PÚBLICOS DE LA API
   ========================================================= */

export const CREATIVE_API_ROUTES = {
  ITEMS:
    "/api/creative/items",

  ITEM_BY_SLUG_TEMPLATE:
    "/api/creative/items/by-slug/[slug]",

  ITEM_VIEW_TEMPLATE:
    "/api/creative/items/[itemId]/view",

  ITEM_LIKE_TEMPLATE:
    "/api/creative/items/[itemId]/like",

  ITEM_FAVORITE_TEMPLATE:
    "/api/creative/items/[itemId]/favorite",

  ITEM_COMMENTS_TEMPLATE:
    "/api/creative/items/[itemId]/comments",

  ITEM_DOWNLOAD_TEMPLATE:
    "/api/creative/items/[itemId]/download",

  ITEM_REQUEST_TEMPLATE:
    "/api/creative/items/[itemId]/request",

  ITEM_PURCHASE_TEMPLATE:
    "/api/creative/items/[itemId]/purchase",

  COMMENT_TEMPLATE:
    "/api/creative/comments/[commentId]",

  REQUESTS:
    "/api/creative/requests",

  REQUEST_TEMPLATE:
    "/api/creative/requests/[requestId]",

  ORDERS:
    "/api/creative/orders",

  ORDER_TEMPLATE:
    "/api/creative/orders/[orderId]",
} as const;

/* =========================================================
   ENDPOINTS ADMINISTRATIVOS DE LA API
   ========================================================= */

export const CREATIVE_ADMIN_API_ROUTES = {
  ITEMS:
    "/api/admin/creative/items",

  ITEM_TEMPLATE:
    "/api/admin/creative/items/[itemId]",

  ITEM_STATUS_TEMPLATE:
    "/api/admin/creative/items/[itemId]/status",

  UPLOADS:
    "/api/admin/creative/uploads",

  REQUESTS:
    "/api/admin/creative/requests",

  REQUEST_TEMPLATE:
    "/api/admin/creative/requests/[requestId]",

  ORDERS:
    "/api/admin/creative/orders",

  ORDER_TEMPLATE:
    "/api/admin/creative/orders/[orderId]",

  COMMENT_TEMPLATE:
    "/api/admin/creative/comments/[commentId]",

  STATISTICS:
    "/api/admin/creative/stats",
} as const;

/* =========================================================
   FUENTES DE NAVEGACIÓN
   ========================================================= */

export const CREATIVE_NAVIGATION_SOURCES = {
  CATALOG:
    "catalog",

  RELATED_ITEM:
    "related-item",

  DIRECT_LINK:
    "direct-link",

  SHARED_LINK:
    "shared-link",

  FAVORITES:
    "favorites",

  SEARCH:
    "search",

  ADMIN:
    "admin",
} as const;

export type CreativeNavigationSource =
  typeof CREATIVE_NAVIGATION_SOURCES[
    keyof typeof CREATIVE_NAVIGATION_SOURCES
  ];

/* =========================================================
   SECCIONES DEL VISOR
   ========================================================= */

export const CREATIVE_VIEWER_SECTIONS = {
  INFORMATION:
    "information",

  COMMENTS:
    "comments",

  PURCHASE:
    "purchase",

  REQUEST:
    "request",

  ADMINISTRATION:
    "administration",
} as const;

export type CreativeViewerSectionRouteValue =
  typeof CREATIVE_VIEWER_SECTIONS[
    keyof typeof CREATIVE_VIEWER_SECTIONS
  ];

/* =========================================================
   OPCIONES DE RUTA PARA EL VISOR
   ========================================================= */

export interface CreateCreativeItemRouteOptions {
  source?:
    CreativeNavigationSource;

  section?:
    CreativeViewerSectionRouteValue;

  returnTo?:
    string;
}

/* =========================================================
   CONSULTA ADMINISTRATIVA
   ========================================================= */

export interface CreativeAdminRouteQuery {
  search?:
    string;

  contentTypes?:
    string[];

  statuses?:
    string[];

  categoryIds?:
    string[];

  toolIds?:
    string[];

  authorId?:
    string;

  featured?:
    boolean;

  includeArchived?:
    boolean;

  sort?:
    string;

  page?:
    number;

  pageSize?:
    number;
}

/* =========================================================
   CONSULTA DE COMENTARIOS
   ========================================================= */

export interface CreativeCommentsRouteQuery {
  cursor?:
    string;

  limit?:
    number;

  includeReplies?:
    boolean;
}

/* =========================================================
   CONSULTA DE PEDIDOS
   ========================================================= */

export interface CreativeOrdersRouteQuery {
  search?:
    string;

  statuses?:
    string[];

  paymentStatuses?:
    string[];

  itemId?:
    CreativeItemId;

  buyerId?:
    string;

  createdFrom?:
    string;

  createdTo?:
    string;

  sort?:
    string;

  page?:
    number;

  pageSize?:
    number;
}

/* =========================================================
   CONSULTA DE SOLICITUDES
   ========================================================= */

export interface CreativeRequestsRouteQuery {
  search?:
    string;

  statuses?:
    string[];

  itemId?:
    CreativeItemId;

  customerId?:
    string;

  assignedAdministratorId?:
    string;

  createdFrom?:
    string;

  createdTo?:
    string;

  sort?:
    string;

  page?:
    number;

  pageSize?:
    number;
}

/* =========================================================
   UTILIDAD PARA NORMALIZAR SEGMENTOS
   ========================================================= */

/*
 * Convierte un identificador o slug en un segmento seguro.
 *
 * Lanza un error cuando recibe una cadena vacía para evitar
 * producir rutas incompletas como:
 *
 * /diseno/
 * /api/creative/items//like
 */
function encodeCreativeRouteSegment(
  value:
    string,
  fieldName:
    string,
): string {
  const normalizedValue =
    value.trim();

  if (!normalizedValue) {
    throw new Error(
      `FIXORA Creative: ${fieldName} no puede estar vacío.`,
    );
  }

  return encodeURIComponent(
    normalizedValue,
  );
}

/* =========================================================
   VALIDACIÓN DE RUTAS INTERNAS
   ========================================================= */

/*
 * Una ruta interna válida:
 * - Comienza con una sola barra.
 * - No comienza con //.
 * - No contiene barras invertidas.
 * - No contiene caracteres de control.
 *
 * Esto evita redirecciones abiertas hacia dominios externos.
 */
export function isSafeCreativeInternalPath(
  value:
    string | null | undefined,
): value is string {
  if (
    typeof value !==
      "string"
  ) {
    return false;
  }

  const normalizedValue =
    value.trim();

  if (
    !normalizedValue.startsWith(
      "/",
    ) ||
    normalizedValue.startsWith(
      "//",
    ) ||
    normalizedValue.includes(
      "\\",
    ) ||
    /[\u0000-\u001F\u007F]/.test(
      normalizedValue,
    )
  ) {
    return false;
  }

  return true;
}

/* =========================================================
   NORMALIZACIÓN DEL DESTINO DE REGRESO
   ========================================================= */

/*
 * IMPORTANTE:
 * El tipo explícito string permite utilizar tanto:
 * - /diseno
 * - /admin/diseno
 * - cualquier otra ruta interna segura.
 *
 * Sin ": string", TypeScript infería únicamente el literal
 * "/diseno" y rechazaba el fallback administrativo.
 */
export function normalizeCreativeReturnTo(
  value:
    string | null | undefined,
  fallback:
    string =
      CREATIVE_PUBLIC_ROUTES.ROOT,
): string {
  if (
    isSafeCreativeInternalPath(
      value,
    )
  ) {
    return value.trim();
  }

  if (
    isSafeCreativeInternalPath(
      fallback,
    )
  ) {
    return fallback.trim();
  }

  return CREATIVE_PUBLIC_ROUTES.ROOT;
}

/* =========================================================
   CONSTRUCCIÓN DE CONSULTAS
   ========================================================= */

function appendStringQueryValue(
  searchParams:
    URLSearchParams,
  key:
    string,
  value:
    string | null | undefined,
): void {
  const normalizedValue =
    value?.trim();

  if (!normalizedValue) {
    return;
  }

  searchParams.set(
    key,
    normalizedValue,
  );
}

function appendNumberQueryValue(
  searchParams:
    URLSearchParams,
  key:
    string,
  value:
    number | null | undefined,
): void {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return;
  }

  searchParams.set(
    key,
    String(value),
  );
}

function appendBooleanQueryValue(
  searchParams:
    URLSearchParams,
  key:
    string,
  value:
    boolean | null | undefined,
): void {
  if (
    typeof value !==
      "boolean"
  ) {
    return;
  }

  searchParams.set(
    key,
    String(value),
  );
}

function appendArrayQueryValues(
  searchParams:
    URLSearchParams,
  key:
    string,
  values:
    readonly string[] | null | undefined,
): void {
  if (
    !values ||
    values.length ===
      0
  ) {
    return;
  }

  const uniqueValues =
    Array.from(
      new Set(
        values
          .map(
            (value) =>
              value.trim(),
          )
          .filter(Boolean),
      ),
    );

  uniqueValues.forEach(
    (value) => {
      searchParams.append(
        key,
        value,
      );
    },
  );
}

function combineCreativePathAndQuery(
  pathname:
    string,
  searchParams:
    URLSearchParams,
): string {
  const queryString =
    searchParams.toString();

  if (!queryString) {
    return pathname;
  }

  return `${pathname}?${queryString}`;
}

/* =========================================================
   RUTA PÚBLICA DE UNA PUBLICACIÓN
   ========================================================= */

export function createCreativeItemRoute(
  slug:
    CreativeItemSlug,
  options:
    CreateCreativeItemRouteOptions = {},
): string {
  const safeSlug =
    encodeCreativeRouteSegment(
      slug,
      "slug",
    );

  const pathname =
    `${CREATIVE_PUBLIC_ROUTES.ROOT}/${safeSlug}`;

  const searchParams =
    new URLSearchParams();

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SOURCE,
    options.source,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SECTION,
    options.section,
  );

  if (options.returnTo) {
    searchParams.set(
      CREATIVE_QUERY_KEYS.RETURN_TO,
      normalizeCreativeReturnTo(
        options.returnTo,
      ),
    );
  }

  return combineCreativePathAndQuery(
    pathname,
    searchParams,
  );
}

/* =========================================================
   RUTA DE CREACIÓN ADMINISTRATIVA
   ========================================================= */

export function createCreativeAdminNewItemRoute(
  returnTo?:
    string,
): string {
  const searchParams =
    new URLSearchParams();

  if (returnTo) {
    searchParams.set(
      CREATIVE_QUERY_KEYS.RETURN_TO,
      normalizeCreativeReturnTo(
        returnTo,
        CREATIVE_ADMIN_ROUTES.ROOT,
      ),
    );
  }

  return combineCreativePathAndQuery(
    CREATIVE_ADMIN_ROUTES.NEW_ITEM,
    searchParams,
  );
}

/* =========================================================
   RUTA DE EDICIÓN ADMINISTRATIVA
   ========================================================= */

export function createCreativeAdminEditItemRoute(
  itemId:
    CreativeItemId,
  returnTo?:
    string,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  const pathname =
    `${CREATIVE_ADMIN_ROUTES.ROOT}/${safeItemId}/editar`;

  const searchParams =
    new URLSearchParams();

  if (returnTo) {
    searchParams.set(
      CREATIVE_QUERY_KEYS.RETURN_TO,
      normalizeCreativeReturnTo(
        returnTo,
        CREATIVE_ADMIN_ROUTES.ROOT,
      ),
    );
  }

  return combineCreativePathAndQuery(
    pathname,
    searchParams,
  );
}

/* =========================================================
   RUTA DE INICIO DE SESIÓN
   ========================================================= */

/*
 * El proyecto utiliza actualmente "redirect" para devolver
 * al usuario a la página de origen después de autenticarse.
 */
export function createCreativeLoginRoute(
  returnTo:
    string,
): string {
  const safeReturnTo =
    normalizeCreativeReturnTo(
      returnTo,
    );

  const searchParams =
    new URLSearchParams();

  searchParams.set(
    CREATIVE_QUERY_KEYS.REDIRECT,
    safeReturnTo,
  );

  return combineCreativePathAndQuery(
    CREATIVE_AUTH_ROUTES.LOGIN,
    searchParams,
  );
}

/* =========================================================
   RUTA DE REGISTRO
   ========================================================= */

export function createCreativeRegisterRoute(
  returnTo:
    string,
): string {
  const safeReturnTo =
    normalizeCreativeReturnTo(
      returnTo,
    );

  const searchParams =
    new URLSearchParams();

  searchParams.set(
    CREATIVE_QUERY_KEYS.REDIRECT,
    safeReturnTo,
  );

  return combineCreativePathAndQuery(
    CREATIVE_AUTH_ROUTES.REGISTER,
    searchParams,
  );
}

/* =========================================================
   RUTA DEL CATÁLOGO CON FILTROS
   ========================================================= */

export function createCreativeCatalogRoute(
  query:
    Partial<CreativeCatalogQuery> = {},
): string {
  const searchParams =
    new URLSearchParams();

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SEARCH,
    query.search,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.CONTENT_TYPE,
    query.contentTypes,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.CATEGORY,
    query.categoryIds,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.TOOL,
    query.toolIds,
  );

  appendBooleanQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.FEATURED,
    query.featured,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SORT,
    query.sort,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.PAGE,
    query.page,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.PAGE_SIZE,
    query.pageSize,
  );

  return combineCreativePathAndQuery(
    CREATIVE_PUBLIC_ROUTES.ROOT,
    searchParams,
  );
}

/* =========================================================
   RUTA DEL PANEL CON FILTROS
   ========================================================= */

export function createCreativeAdminCatalogRoute(
  query:
    CreativeAdminRouteQuery = {},
): string {
  const searchParams =
    new URLSearchParams();

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SEARCH,
    query.search,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.CONTENT_TYPE,
    query.contentTypes,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.STATUS,
    query.statuses,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.CATEGORY,
    query.categoryIds,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.TOOL,
    query.toolIds,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.AUTHOR_ID,
    query.authorId,
  );

  appendBooleanQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.FEATURED,
    query.featured,
  );

  appendBooleanQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.INCLUDE_ARCHIVED,
    query.includeArchived,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SORT,
    query.sort,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.PAGE,
    query.page,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.PAGE_SIZE,
    query.pageSize,
  );

  return combineCreativePathAndQuery(
    CREATIVE_ADMIN_ROUTES.ROOT,
    searchParams,
  );
}

/* =========================================================
   API: DETALLE POR SLUG
   ========================================================= */

export function createCreativeItemBySlugApiRoute(
  slug:
    CreativeItemSlug,
): string {
  const safeSlug =
    encodeCreativeRouteSegment(
      slug,
      "slug",
    );

  return `/api/creative/items/by-slug/${safeSlug}`;
}

/* =========================================================
   API: REGISTRO DE VISUALIZACIÓN
   ========================================================= */

export function createCreativeItemViewApiRoute(
  itemId:
    CreativeItemId,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  return `/api/creative/items/${safeItemId}/view`;
}

/* =========================================================
   API: ME GUSTA
   ========================================================= */

export function createCreativeItemLikeApiRoute(
  itemId:
    CreativeItemId,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  return `/api/creative/items/${safeItemId}/like`;
}

/* =========================================================
   API: FAVORITO
   ========================================================= */

export function createCreativeItemFavoriteApiRoute(
  itemId:
    CreativeItemId,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  return `/api/creative/items/${safeItemId}/favorite`;
}

/* =========================================================
   API: COMENTARIOS
   ========================================================= */

export function createCreativeItemCommentsApiRoute(
  itemId:
    CreativeItemId,
  query:
    CreativeCommentsRouteQuery = {},
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  const pathname =
    `/api/creative/items/${safeItemId}/comments`;

  const searchParams =
    new URLSearchParams();

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.CURSOR,
    query.cursor,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.LIMIT,
    query.limit,
  );

  appendBooleanQueryValue(
    searchParams,
    "includeReplies",
    query.includeReplies,
  );

  return combineCreativePathAndQuery(
    pathname,
    searchParams,
  );
}

export function createCreativeCommentApiRoute(
  commentId:
    string,
): string {
  const safeCommentId =
    encodeCreativeRouteSegment(
      commentId,
      "commentId",
    );

  return `/api/creative/comments/${safeCommentId}`;
}

/* =========================================================
   API: DESCARGA
   ========================================================= */

export function createCreativeItemDownloadApiRoute(
  itemId:
    CreativeItemId,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  return `/api/creative/items/${safeItemId}/download`;
}

/* =========================================================
   API: SOLICITUD PERSONALIZADA
   ========================================================= */

export function createCreativeItemRequestApiRoute(
  itemId:
    CreativeItemId,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  return `/api/creative/items/${safeItemId}/request`;
}

export function createCreativeRequestApiRoute(
  requestId:
    string,
): string {
  const safeRequestId =
    encodeCreativeRouteSegment(
      requestId,
      "requestId",
    );

  return `/api/creative/requests/${safeRequestId}`;
}

/* =========================================================
   API: COMPRA
   ========================================================= */

export function createCreativeItemPurchaseApiRoute(
  itemId:
    CreativeItemId,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  return `/api/creative/items/${safeItemId}/purchase`;
}

export function createCreativeOrderApiRoute(
  orderId:
    string,
): string {
  const safeOrderId =
    encodeCreativeRouteSegment(
      orderId,
      "orderId",
    );

  return `/api/creative/orders/${safeOrderId}`;
}

/* =========================================================
   API ADMIN: PUBLICACIÓN
   ========================================================= */

export function createCreativeAdminItemApiRoute(
  itemId:
    CreativeItemId,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  return `/api/admin/creative/items/${safeItemId}`;
}

/* =========================================================
   API ADMIN: ESTADO DE PUBLICACIÓN
   ========================================================= */

export function createCreativeAdminItemStatusApiRoute(
  itemId:
    CreativeItemId,
): string {
  const safeItemId =
    encodeCreativeRouteSegment(
      itemId,
      "itemId",
    );

  return `/api/admin/creative/items/${safeItemId}/status`;
}

/* =========================================================
   API ADMIN: COMENTARIO
   ========================================================= */

export function createCreativeAdminCommentApiRoute(
  commentId:
    string,
): string {
  const safeCommentId =
    encodeCreativeRouteSegment(
      commentId,
      "commentId",
    );

  return `/api/admin/creative/comments/${safeCommentId}`;
}

/* =========================================================
   API ADMIN: SOLICITUD
   ========================================================= */

export function createCreativeAdminRequestApiRoute(
  requestId:
    string,
): string {
  const safeRequestId =
    encodeCreativeRouteSegment(
      requestId,
      "requestId",
    );

  return `/api/admin/creative/requests/${safeRequestId}`;
}

/* =========================================================
   API ADMIN: PEDIDO
   ========================================================= */

export function createCreativeAdminOrderApiRoute(
  orderId:
    string,
): string {
  const safeOrderId =
    encodeCreativeRouteSegment(
      orderId,
      "orderId",
    );

  return `/api/admin/creative/orders/${safeOrderId}`;
}

/* =========================================================
   API ADMIN: LISTADO DE PEDIDOS
   ========================================================= */

export function createCreativeAdminOrdersApiRoute(
  query:
    CreativeOrdersRouteQuery = {},
): string {
  const searchParams =
    new URLSearchParams();

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SEARCH,
    query.search,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.STATUS,
    query.statuses,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.PAYMENT_STATUS,
    query.paymentStatuses,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.ITEM_ID,
    query.itemId,
  );

  appendStringQueryValue(
    searchParams,
    "buyerId",
    query.buyerId,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.CREATED_FROM,
    query.createdFrom,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.CREATED_TO,
    query.createdTo,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SORT,
    query.sort,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.PAGE,
    query.page,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.PAGE_SIZE,
    query.pageSize,
  );

  return combineCreativePathAndQuery(
    CREATIVE_ADMIN_API_ROUTES.ORDERS,
    searchParams,
  );
}

/* =========================================================
   API ADMIN: LISTADO DE SOLICITUDES
   ========================================================= */

export function createCreativeAdminRequestsApiRoute(
  query:
    CreativeRequestsRouteQuery = {},
): string {
  const searchParams =
    new URLSearchParams();

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SEARCH,
    query.search,
  );

  appendArrayQueryValues(
    searchParams,
    CREATIVE_QUERY_KEYS.REQUEST_STATUS,
    query.statuses,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.ITEM_ID,
    query.itemId,
  );

  appendStringQueryValue(
    searchParams,
    "customerId",
    query.customerId,
  );

  appendStringQueryValue(
    searchParams,
    "assignedAdministratorId",
    query.assignedAdministratorId,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.CREATED_FROM,
    query.createdFrom,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.CREATED_TO,
    query.createdTo,
  );

  appendStringQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.SORT,
    query.sort,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.PAGE,
    query.page,
  );

  appendNumberQueryValue(
    searchParams,
    CREATIVE_QUERY_KEYS.PAGE_SIZE,
    query.pageSize,
  );

  return combineCreativePathAndQuery(
    CREATIVE_ADMIN_API_ROUTES.REQUESTS,
    searchParams,
  );
}

/* =========================================================
   ENLACE DE COMPARTIR
   ========================================================= */

export function createCreativeShareRoute(
  slug:
    CreativeItemSlug,
  channel:
    CreativeShareChannel,
): string {
  const itemRoute =
    createCreativeItemRoute(
      slug,
      {
        source:
          CREATIVE_NAVIGATION_SOURCES.SHARED_LINK,
      },
    );

  const [
    pathname,
    currentQuery = "",
  ] =
    itemRoute.split(
      "?",
      2,
    );

  const searchParams =
    new URLSearchParams(
      currentQuery,
    );

  searchParams.set(
    CREATIVE_QUERY_KEYS.CHANNEL,
    channel,
  );

  return combineCreativePathAndQuery(
    pathname,
    searchParams,
  );
}

/* =========================================================
   URL ABSOLUTA PARA COMPARTIR
   ========================================================= */

export function createCreativeAbsoluteShareUrl(
  origin:
    string,
  slug:
    CreativeItemSlug,
  channel:
    CreativeShareChannel =
      "copy-link",
): string {
  const normalizedOrigin =
    origin
      .trim()
      .replace(
        /\/+$/,
        "",
      );

  if (!normalizedOrigin) {
    throw new Error(
      "FIXORA Creative: el origen no puede estar vacío.",
    );
  }

  const relativeRoute =
    createCreativeShareRoute(
      slug,
      channel,
    );

  return `${normalizedOrigin}${relativeRoute}`;
}

/* =========================================================
   COMPROBACIÓN DE RUTAS DEL MÓDULO
   ========================================================= */

export function isCreativePublicRoute(
  pathname:
    string,
): boolean {
  return (
    pathname ===
      CREATIVE_PUBLIC_ROUTES.ROOT ||
    pathname.startsWith(
      `${CREATIVE_PUBLIC_ROUTES.ROOT}/`,
    )
  );
}

export function isCreativeAdminRoute(
  pathname:
    string,
): boolean {
  return (
    pathname ===
      CREATIVE_ADMIN_ROUTES.ROOT ||
    pathname.startsWith(
      `${CREATIVE_ADMIN_ROUTES.ROOT}/`,
    )
  );
}

export function isCreativeApiRoute(
  pathname:
    string,
): boolean {
  return (
    pathname ===
      CREATIVE_API_ROUTES.ITEMS ||
    pathname.startsWith(
      "/api/creative/",
    )
  );
}

export function isCreativeAdminApiRoute(
  pathname:
    string,
): boolean {
  return (
    pathname ===
      CREATIVE_ADMIN_API_ROUTES.ITEMS ||
    pathname.startsWith(
      "/api/admin/creative/",
    )
  );
}

/* =========================================================
   CONFIGURACIÓN AGRUPADA
   ========================================================= */

export const CREATIVE_ROUTES = {
  PUBLIC:
    CREATIVE_PUBLIC_ROUTES,

  ADMIN:
    CREATIVE_ADMIN_ROUTES,

  AUTH:
    CREATIVE_AUTH_ROUTES,

  API:
    CREATIVE_API_ROUTES,

  ADMIN_API:
    CREATIVE_ADMIN_API_ROUTES,

  PARAMS:
    CREATIVE_ROUTE_PARAMS,

  QUERY:
    CREATIVE_QUERY_KEYS,
} as const;
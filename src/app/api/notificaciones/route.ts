import {
  type NextRequest,
  NextResponse,
} from "next/server";

import { z } from "zod";

import {
  clearSessionCookie,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";

import {
  checkRateLimit,
} from "@/lib/auth/rate-limit";

import {
  getNotificationsBySessionToken,
} from "@/server/services/notification.service";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

const RESPONSE_HEADERS = {
  "Cache-Control":
    "private, no-store, no-cache, max-age=0, must-revalidate",

  Pragma:
    "no-cache",

  Expires:
    "0",

  "Referrer-Policy":
    "no-referrer",

  "X-Content-Type-Options":
    "nosniff",

  "Cross-Origin-Resource-Policy":
    "same-origin",

  Vary:
    "Cookie",
} as const;

const unreadOnlySchema =
  z.preprocess(
    (
      value,
    ) => {
      if (
        value ===
          undefined ||
        value ===
          null ||
        value ===
          ""
      ) {
        return "false";
      }

      return value;
    },
    z.enum(
      [
        "true",
        "false",
      ],
      {
        message:
          "El filtro unreadOnly debe ser true o false.",
      },
    ),
  )
    .transform(
      (
        value,
      ) =>
        value ===
        "true",
    );

const notificationQuerySchema =
  z
    .object({
      page:
        z.coerce
          .number()
          .int(
            "La página debe ser un número entero.",
          )
          .min(
            1,
            "La página debe ser mayor o igual a 1.",
          )
          .max(
            100_000,
            "La página solicitada no es válida.",
          )
          .default(
            1,
          ),

      pageSize:
        z.coerce
          .number()
          .int(
            "La cantidad debe ser un número entero.",
          )
          .min(
            1,
            "La cantidad mínima es 1.",
          )
          .max(
            50,
            "La cantidad máxima permitida es 50.",
          )
          .default(
            20,
          ),

      unreadOnly:
        unreadOnlySchema,

      type:
        z
          .enum(
            [
              "ACCOUNT",
              "SECURITY",
              "PROJECT",
              "SERVICE",
              "SYSTEM",
            ],
            {
              message:
                "El tipo de notificación no es válido.",
            },
          )
          .optional(),
    })
    .strict();

interface LocalizedMessage {
  es: string;
  en: string;
}

interface ApiResponseBody {
  ok: boolean;
  code: string;

  message:
    LocalizedMessage;

  data?:
    Record<
      string,
      unknown
    >;

  fieldErrors?:
    Record<
      string,
      string[]
    >;
}

interface NormalizedNotificationsResult {
  notifications:
    Record<
      string,
      unknown
    >[];

  unreadCount:
    number;

  pagination: {
    page:
      number;

    pageSize:
      number;

    totalCount:
      number;

    totalPages:
      number;

    hasPreviousPage:
      boolean;

    hasNextPage:
      boolean;
  };
}

type UnknownRecord =
  Record<
    string,
    unknown
  >;

function isRecord(
  value:
    unknown,
): value is UnknownRecord {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

function readFiniteNumber(
  value:
    unknown,
): number | null {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return null;
  }

  return value;
}

function readNonNegativeInteger(
  value:
    unknown,
  fallback:
    number,
): number {
  const numericValue =
    readFiniteNumber(
      value,
    );

  if (
    numericValue ===
      null
  ) {
    return fallback;
  }

  return Math.max(
    0,
    Math.floor(
      numericValue,
    ),
  );
}

function readPositiveInteger(
  value:
    unknown,
  fallback:
    number,
): number {
  const numericValue =
    readFiniteNumber(
      value,
    );

  if (
    numericValue ===
      null
  ) {
    return fallback;
  }

  return Math.max(
    1,
    Math.floor(
      numericValue,
    ),
  );
}

function serializeDateValue(
  value:
    unknown,
): string | null {
  if (
    value instanceof
    Date
  ) {
    return Number.isNaN(
      value.getTime(),
    )
      ? null
      : value.toISOString();
  }

  if (
    typeof value ===
      "string"
  ) {
    const parsedDate =
      new Date(
        value,
      );

    return Number.isNaN(
      parsedDate.getTime(),
    )
      ? value
      : parsedDate.toISOString();
  }

  return null;
}

function readString(
  value:
    unknown,
  fallback =
    "",
): string {
  return typeof value ===
    "string"
    ? value
    : fallback;
}

function readNullableString(
  value:
    unknown,
): string | null {
  return typeof value ===
    "string"
    ? value
    : null;
}

function serializeNotification(
  value:
    unknown,
): Record<
  string,
  unknown
> | null {
  if (
    !isRecord(
      value,
    )
  ) {
    return null;
  }

  const readAt =
    serializeDateValue(
      value.readAt,
    );

  return {
    id:
      readString(
        value.id,
      ),

    type:
      readString(
        value.type,
      ),

    titleEs:
      readString(
        value.titleEs,
      ),

    titleEn:
      readString(
        value.titleEn,
      ),

    messageEs:
      readString(
        value.messageEs,
      ),

    messageEn:
      readString(
        value.messageEn,
      ),

    actionUrl:
      readNullableString(
        value.actionUrl,
      ),

    isRead:
      readAt !==
      null,

    readAt,

    createdAt:
      serializeDateValue(
        value.createdAt,
      ),

    updatedAt:
      serializeDateValue(
        value.updatedAt,
      ),
  };
}

function normalizeNotificationsResult(
  value:
    unknown,
  requestedPage:
    number,
  requestedPageSize:
    number,
): NormalizedNotificationsResult {
  const root =
    isRecord(
      value,
    )
      ? value
      : {};

  /*
   * Admite tanto resultados con datos directamente
   * como resultados encapsulados dentro de "data".
   */
  const source =
    isRecord(
      root.data,
    )
      ? root.data
      : root;

  const paginationSource =
    isRecord(
      source.pagination,
    )
      ? source.pagination
      : {};

  const rawNotifications =
    Array.isArray(
      source.notifications,
    )
      ? source.notifications
      : Array.isArray(
            source.items,
          )
        ? source.items
        : [];

  const notifications =
    rawNotifications
      .map(
        serializeNotification,
      )
      .filter(
        (
          notification,
        ): notification is Record<
          string,
          unknown
        > =>
          notification !==
          null,
      );

  const page =
    readPositiveInteger(
      paginationSource.page ??
        source.page,
      requestedPage,
    );

  const pageSize =
    readPositiveInteger(
      paginationSource.pageSize ??
        source.pageSize,
      requestedPageSize,
    );

  const totalCount =
    readNonNegativeInteger(
      paginationSource.totalCount ??
        paginationSource.totalItems ??
        source.totalCount ??
        source.totalItems,
      notifications.length,
    );

  const calculatedTotalPages =
    totalCount ===
    0
      ? 0
      : Math.ceil(
          totalCount /
            pageSize,
        );

  const totalPages =
    readNonNegativeInteger(
      paginationSource.totalPages ??
        source.totalPages,
      calculatedTotalPages,
    );

  const unreadCount =
    readNonNegativeInteger(
      source.unreadCount,
      notifications.filter(
        (
          notification,
        ) =>
          notification.isRead ===
          false,
      ).length,
    );

  const hasPreviousPage =
    typeof paginationSource
      .hasPreviousPage ===
      "boolean"
      ? paginationSource
          .hasPreviousPage
      : page >
        1;

  const hasNextPage =
    typeof paginationSource
      .hasNextPage ===
      "boolean"
      ? paginationSource
          .hasNextPage
      : page <
        totalPages;

  return {
    notifications,

    unreadCount,

    pagination: {
      page,
      pageSize,

      totalCount,
      totalPages,

      hasPreviousPage,
      hasNextPage,
    },
  };
}

function createJsonResponse(
  body:
    ApiResponseBody,
  status:
    number,
  additionalHeaders?:
    HeadersInit,
): NextResponse {
  const headers =
    new Headers(
      RESPONSE_HEADERS,
    );

  if (
    additionalHeaders
  ) {
    const extraHeaders =
      new Headers(
        additionalHeaders,
      );

    extraHeaders.forEach(
      (
        value,
        key,
      ) => {
        headers.set(
          key,
          value,
        );
      },
    );
  }

  return NextResponse.json(
    body,
    {
      status,
      headers,
    },
  );
}

function createUnauthenticatedResponse():
  NextResponse {
  return createJsonResponse(
    {
      ok:
        false,

      code:
        "AUTHENTICATION_REQUIRED",

      message: {
        es:
          "Debes iniciar sesión para consultar tus notificaciones.",

        en:
          "You must sign in to view your notifications.",
      },

      data: {
        authenticated:
          false,

        redirectTo:
          "/iniciar-sesion",
      },
    },
    401,
  );
}

function getValidationFieldErrors(
  issues:
    ReadonlyArray<{
      path:
        readonly PropertyKey[];

      message:
        string;
    }>,
): Record<
  string,
  string[]
> {
  const fieldErrors:
    Record<
      string,
      string[]
    > = {};

  for (
    const issue of
    issues
  ) {
    const firstPathSegment =
      issue.path[0];

    const fieldName =
      typeof firstPathSegment ===
        "string"
        ? firstPathSegment
        : "query";

    fieldErrors[
      fieldName
    ] ??= [];

    if (
      !fieldErrors[
        fieldName
      ].includes(
        issue.message,
      )
    ) {
      fieldErrors[
        fieldName
      ].push(
        issue.message,
      );
    }
  }

  return fieldErrors;
}

function normalizeRetryAfterSeconds(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <
      1
  ) {
    return 1;
  }

  return Math.ceil(
    value,
  );
}

/*
 * GET /api/notificaciones
 *
 * Parámetros opcionales:
 *
 * - page=1
 * - pageSize=20
 * - unreadOnly=true
 * - type=SECURITY
 */
export async function GET(
  request:
    NextRequest,
): Promise<NextResponse> {
  const sessionToken =
    getSessionTokenFromRequest(
      request,
    );

  if (
    !sessionToken
  ) {
    return createUnauthenticatedResponse();
  }

  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "notifications:list",

      limit:
        120,

      windowMs:
        15 *
        60 *
        1_000,
    });

  if (
    !rateLimitResult.allowed
  ) {
    const retryAfterSeconds =
      normalizeRetryAfterSeconds(
        rateLimitResult
          .retryAfterSeconds,
      );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "RATE_LIMITED",

        message: {
          es:
            "Se realizaron demasiadas consultas de notificaciones. Inténtalo nuevamente más tarde.",

          en:
            "Too many notification requests were made. Please try again later.",
        },

        data: {
          retryAfterSeconds,
        },
      },
      429,
      {
        "Retry-After":
          String(
            retryAfterSeconds,
          ),
      },
    );
  }

  const searchParams =
    request.nextUrl
      .searchParams;

  const validationResult =
    notificationQuerySchema.safeParse(
      {
        page:
          searchParams.get(
            "page",
          ) ??
          undefined,

        pageSize:
          searchParams.get(
            "pageSize",
          ) ??
          undefined,

        unreadOnly:
          searchParams.get(
            "unreadOnly",
          ) ??
          undefined,

        type:
          searchParams.get(
            "type",
          ) ??
          undefined,
      },
    );

  if (
    !validationResult.success
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "INVALID_QUERY_PARAMETERS",

        message: {
          es:
            "Los filtros de notificaciones no son válidos.",

          en:
            "The notification filters are invalid.",
        },

        fieldErrors:
          getValidationFieldErrors(
            validationResult
              .error
              .issues,
          ),
      },
      422,
    );
  }

  try {
    /*
     * No se fuerza manualmente un tipo distinto al
     * devuelto por notification.service.ts.
     */
    const serviceResult =
      await getNotificationsBySessionToken(
        sessionToken,
        {
          page:
            validationResult
              .data
              .page,

          pageSize:
            validationResult
              .data
              .pageSize,

          unreadOnly:
            validationResult
              .data
              .unreadOnly,

          type:
            validationResult
              .data
              .type,
        },
      );

    /*
     * El servicio devuelve null cuando la sesión:
     *
     * - No existe.
     * - Venció.
     * - Fue revocada.
     * - Pertenece a una cuenta no disponible.
     */
    if (
      !serviceResult
    ) {
      const response =
        createUnauthenticatedResponse();

      clearSessionCookie(
        response,
      );

      return response;
    }

    const notificationsResult =
      normalizeNotificationsResult(
        serviceResult,
        validationResult
          .data
          .page,
        validationResult
          .data
          .pageSize,
      );

    return createJsonResponse(
      {
        ok:
          true,

        code:
          "NOTIFICATIONS_RETRIEVED",

        message: {
          es:
            "Las notificaciones fueron obtenidas correctamente.",

          en:
            "The notifications were retrieved successfully.",
        },

        data: {
          authenticated:
            true,

          notifications:
            notificationsResult
              .notifications,

          unreadCount:
            notificationsResult
              .unreadCount,

          pagination:
            notificationsResult
              .pagination,

          filters: {
            unreadOnly:
              validationResult
                .data
                .unreadOnly,

            type:
              validationResult
                .data
                .type ??
              null,
          },
        },
      },
      200,
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA notifications route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "NOTIFICATIONS_UNAVAILABLE",

        message: {
          es:
            "No fue posible obtener las notificaciones en este momento.",

          en:
            "The notifications could not be retrieved at this time.",
        },
      },
      503,
    );
  }
}
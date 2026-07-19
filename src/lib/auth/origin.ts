import {
  AUTH_MUTATING_HTTP_METHODS,
} from "@/constants/auth/auth.constants";

export type OriginValidationErrorCode =
  | "ORIGIN_REQUIRED"
  | "ORIGIN_INVALID"
  | "ORIGIN_NOT_ALLOWED"
  | "CROSS_SITE_REQUEST_BLOCKED"
  | "REQUEST_ORIGIN_UNAVAILABLE";

export interface OriginPublicMessage {
  es: string;
  en: string;
}

export interface OriginValidationOptions {
  /*
   * Permite agregar orígenes autorizados para una ruta
   * concreta, además de los definidos en variables
   * de entorno.
   */
  allowedOrigins?: readonly string[];

  /*
   * Por seguridad, las solicitudes que modifican datos
   * deben incluir Origin.
   *
   * Solamente debe activarse para integraciones internas
   * controladas que no puedan enviar dicho encabezado.
   */
  allowMissingOrigin?: boolean;

  /*
   * Por defecto solamente se validan POST, PUT, PATCH
   * y DELETE.
   */
  validateSafeMethods?: boolean;
}

export interface OriginValidationResult {
  allowed: boolean;

  method: string;

  requestOrigin: string | null;
  expectedOrigin: string | null;

  allowedOrigins: string[];

  code: OriginValidationErrorCode | null;
  message: OriginPublicMessage | null;
}

export interface OriginErrorPayload {
  ok: false;

  code: OriginValidationErrorCode;

  message: OriginPublicMessage;
}

const ORIGIN_MESSAGES: Record<
  OriginValidationErrorCode,
  OriginPublicMessage
> = {
  ORIGIN_REQUIRED: {
    es:
      "La solicitud no contiene un origen válido.",

    en:
      "The request does not contain a valid origin.",
  },

  ORIGIN_INVALID: {
    es:
      "El origen de la solicitud tiene un formato inválido.",

    en:
      "The request origin has an invalid format.",
  },

  ORIGIN_NOT_ALLOWED: {
    es:
      "El origen de la solicitud no está autorizado.",

    en:
      "The request origin is not authorized.",
  },

  CROSS_SITE_REQUEST_BLOCKED: {
    es:
      "La solicitud externa fue bloqueada por seguridad.",

    en:
      "The external request was blocked for security reasons.",
  },

  REQUEST_ORIGIN_UNAVAILABLE: {
    es:
      "No fue posible determinar el origen seguro del servidor.",

    en:
      "The server's secure origin could not be determined.",
  },
};

const ORIGIN_HTTP_STATUS: Record<
  OriginValidationErrorCode,
  number
> = {
  ORIGIN_REQUIRED: 403,

  ORIGIN_INVALID: 403,

  ORIGIN_NOT_ALLOWED: 403,

  CROSS_SITE_REQUEST_BLOCKED:
    403,

  REQUEST_ORIGIN_UNAVAILABLE:
    403,
};

const ALLOWED_PROTOCOLS =
  new Set([
    "http:",
    "https:",
  ]);

const SAFE_HTTP_METHODS =
  new Set([
    "GET",
    "HEAD",
    "OPTIONS",
  ]);

const MUTATING_HTTP_METHODS =
  new Set<string>(
    AUTH_MUTATING_HTTP_METHODS,
  );

export class OriginValidationError extends Error {
  readonly code:
    OriginValidationErrorCode;

  readonly httpStatus:
    number;

  readonly publicMessage:
    OriginPublicMessage;

  readonly result:
    OriginValidationResult;

  constructor(
    result:
      OriginValidationResult,
  ) {
    const code =
      result.code ??
      "ORIGIN_NOT_ALLOWED";

    const publicMessage =
      result.message ??
      ORIGIN_MESSAGES[
        code
      ];

    super(
      publicMessage.es,
    );

    this.name =
      "OriginValidationError";

    this.code =
      code;

    this.httpStatus =
      ORIGIN_HTTP_STATUS[
        code
      ];

    this.publicMessage =
      publicMessage;

    this.result =
      result;
  }
}

function readFirstHeaderValue(
  value:
    | string
    | null,
): string | null {
  if (!value) {
    return null;
  }

  const firstValue =
    value
      .split(",")[0]
      ?.trim();

  return (
    firstValue ||
    null
  );
}

function normalizeMethod(
  method: string,
): string {
  return method
    .trim()
    .toUpperCase();
}

function normalizeOrigin(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const trimmedValue =
    value.trim();

  if (
    !trimmedValue ||
    trimmedValue ===
      "null" ||
    trimmedValue.length >
      2_048 ||
    /[\u0000-\u001F\u007F]/.test(
      trimmedValue,
    )
  ) {
    return null;
  }

  try {
    const parsedUrl =
      new URL(
        trimmedValue,
      );

    if (
      !ALLOWED_PROTOCOLS.has(
        parsedUrl.protocol,
      )
    ) {
      return null;
    }

    if (
      parsedUrl.username ||
      parsedUrl.password ||
      parsedUrl.pathname !==
        "/" ||
      parsedUrl.search ||
      parsedUrl.hash
    ) {
      return null;
    }

    return parsedUrl.origin;
  } catch {
    return null;
  }
}

function normalizeHost(
  value:
    | string
    | null,
): string | null {
  const host =
    readFirstHeaderValue(
      value,
    );

  if (
    !host ||
    host.length > 255 ||
    host.includes("/") ||
    host.includes("\\") ||
    /[\u0000-\u001F\u007F\s]/.test(
      host,
    )
  ) {
    return null;
  }

  return host;
}

function normalizeProtocol(
  value:
    | string
    | null,
): "http" | "https" | null {
  const protocol =
    readFirstHeaderValue(
      value,
    )
      ?.trim()
      .toLowerCase()
      .replace(
        /:$/,
        "",
      );

  if (
    protocol === "http" ||
    protocol === "https"
  ) {
    return protocol;
  }

  return null;
}

function getProtocolFromRequestUrl(
  request: Request,
): "http" | "https" | null {
  try {
    const protocol =
      new URL(
        request.url,
      ).protocol;

    if (
      protocol === "http:"
    ) {
      return "http";
    }

    if (
      protocol === "https:"
    ) {
      return "https";
    }
  } catch {
    return null;
  }

  return null;
}

function getHostFromRequestUrl(
  request: Request,
): string | null {
  try {
    return normalizeHost(
      new URL(
        request.url,
      ).host,
    );
  } catch {
    return null;
  }
}

function getConfiguredOriginValues():
  string[] {
  const configuredValues =
    [
      process.env.APP_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.AUTH_ALLOWED_ORIGINS,
      process.env.AUTH_TRUSTED_ORIGINS,
    ];

  return configuredValues
    .flatMap(
      (value) =>
        typeof value ===
          "string"
          ? value.split(",")
          : [],
    )
    .map(
      (value) =>
        value.trim(),
    )
    .filter(Boolean);
}

function createDeniedResult(
  method: string,
  code:
    OriginValidationErrorCode,
  requestOrigin:
    string | null,
  expectedOrigin:
    string | null,
  allowedOrigins:
    string[],
): OriginValidationResult {
  return {
    allowed: false,

    method,

    requestOrigin,
    expectedOrigin,

    allowedOrigins,

    code,

    message:
      ORIGIN_MESSAGES[
        code
      ],
  };
}

export function isMutatingHttpMethod(
  method: string,
): boolean {
  return MUTATING_HTTP_METHODS.has(
    normalizeMethod(
      method,
    ),
  );
}

export function shouldValidateRequestOrigin(
  request:
    Pick<Request, "method">,
  {
    validateSafeMethods = false,
  }: Pick<
    OriginValidationOptions,
    "validateSafeMethods"
  > = {},
): boolean {
  const method =
    normalizeMethod(
      request.method,
    );

  if (validateSafeMethods) {
    return true;
  }

  if (
    SAFE_HTTP_METHODS.has(
      method,
    )
  ) {
    return false;
  }

  return isMutatingHttpMethod(
    method,
  );
}

/**
 * Reconstruye el origen de la aplicación usando los
 * encabezados del proxy o, como respaldo, request.url.
 */
export function getExpectedRequestOrigin(
  request: Request,
): string | null {
  const protocol =
    normalizeProtocol(
      request.headers.get(
        "x-forwarded-proto",
      ),
    ) ??
    getProtocolFromRequestUrl(
      request,
    );

  const host =
    normalizeHost(
      request.headers.get(
        "x-forwarded-host",
      ),
    ) ??
    normalizeHost(
      request.headers.get(
        "host",
      ),
    ) ??
    getHostFromRequestUrl(
      request,
    );

  if (
    !protocol ||
    !host
  ) {
    return null;
  }

  return normalizeOrigin(
    `${protocol}://${host}`,
  );
}

/**
 * Obtiene el encabezado Origin ya normalizado.
 */
export function getRequestOrigin(
  request: Request,
): string | null {
  return normalizeOrigin(
    request.headers.get(
      "origin",
    ),
  );
}

/**
 * Devuelve todos los orígenes autorizados.
 *
 * Incluye:
 * - El origen reconstruido de la solicitud.
 * - APP_URL.
 * - NEXT_PUBLIC_APP_URL.
 * - AUTH_ALLOWED_ORIGINS.
 * - AUTH_TRUSTED_ORIGINS.
 * - Orígenes adicionales proporcionados por la ruta.
 */
export function getAllowedRequestOrigins(
  request: Request,
  additionalOrigins:
    readonly string[] = [],
): string[] {
  const expectedOrigin =
    getExpectedRequestOrigin(
      request,
    );

  const originCandidates =
    [
      expectedOrigin,
      ...getConfiguredOriginValues(),
      ...additionalOrigins,
    ];

  const normalizedOrigins =
    originCandidates
      .map(
        normalizeOrigin,
      )
      .filter(
        (
          origin,
        ): origin is string =>
          origin !== null,
      );

  return Array.from(
    new Set(
      normalizedOrigins,
    ),
  );
}

/**
 * Valida Origin y Sec-Fetch-Site.
 */
export function validateRequestOrigin(
  request: Request,
  {
    allowedOrigins:
      additionalOrigins = [],

    allowMissingOrigin = false,

    validateSafeMethods = false,
  }: OriginValidationOptions = {},
): OriginValidationResult {
  const method =
    normalizeMethod(
      request.method,
    );

  const expectedOrigin =
    getExpectedRequestOrigin(
      request,
    );

  const allowedOrigins =
    getAllowedRequestOrigins(
      request,
      additionalOrigins,
    );

  if (
    !shouldValidateRequestOrigin(
      request,
      {
        validateSafeMethods,
      },
    )
  ) {
    return {
      allowed: true,

      method,

      requestOrigin:
        getRequestOrigin(
          request,
        ),

      expectedOrigin,

      allowedOrigins,

      code: null,
      message: null,
    };
  }

  const secFetchSite =
    request.headers
      .get(
        "sec-fetch-site",
      )
      ?.trim()
      .toLowerCase() ??
    null;

  if (
    secFetchSite ===
    "cross-site"
  ) {
    return createDeniedResult(
      method,
      "CROSS_SITE_REQUEST_BLOCKED",
      getRequestOrigin(
        request,
      ),
      expectedOrigin,
      allowedOrigins,
    );
  }

  const rawOrigin =
    request.headers.get(
      "origin",
    );

  if (
    rawOrigin === null ||
    rawOrigin.trim() === ""
  ) {
    if (allowMissingOrigin) {
      return {
        allowed: true,

        method,

        requestOrigin:
          null,

        expectedOrigin,

        allowedOrigins,

        code: null,
        message: null,
      };
    }

    return createDeniedResult(
      method,
      "ORIGIN_REQUIRED",
      null,
      expectedOrigin,
      allowedOrigins,
    );
  }

  const requestOrigin =
    normalizeOrigin(
      rawOrigin,
    );

  if (!requestOrigin) {
    return createDeniedResult(
      method,
      "ORIGIN_INVALID",
      null,
      expectedOrigin,
      allowedOrigins,
    );
  }

  if (
    allowedOrigins.length ===
    0
  ) {
    return createDeniedResult(
      method,
      "REQUEST_ORIGIN_UNAVAILABLE",
      requestOrigin,
      expectedOrigin,
      allowedOrigins,
    );
  }

  if (
    !allowedOrigins.includes(
      requestOrigin,
    )
  ) {
    return createDeniedResult(
      method,
      "ORIGIN_NOT_ALLOWED",
      requestOrigin,
      expectedOrigin,
      allowedOrigins,
    );
  }

  return {
    allowed: true,

    method,

    requestOrigin,
    expectedOrigin,

    allowedOrigins,

    code: null,
    message: null,
  };
}

/**
 * Variante booleana.
 */
export function isRequestOriginAllowed(
  request: Request,
  options:
    OriginValidationOptions = {},
): boolean {
  return validateRequestOrigin(
    request,
    options,
  ).allowed;
}

/**
 * Variante estricta para rutas de API.
 */
export function assertValidRequestOrigin(
  request: Request,
  options:
    OriginValidationOptions = {},
): OriginValidationResult {
  const result =
    validateRequestOrigin(
      request,
      options,
    );

  if (!result.allowed) {
    throw new OriginValidationError(
      result,
    );
  }

  return result;
}

/**
 * Alias utilizado por rutas que requieren protección
 * de mismo origen.
 */
export const assertSameOrigin =
  assertValidRequestOrigin;

/**
 * Alias semántico adicional.
 */
export const validateOrigin =
  validateRequestOrigin;

export const checkRequestOrigin =
  validateRequestOrigin;

export function isOriginValidationError(
  error: unknown,
): error is OriginValidationError {
  return (
    error instanceof
    OriginValidationError
  );
}

export function createOriginErrorPayload(
  error:
    OriginValidationError,
): OriginErrorPayload {
  return {
    ok: false,

    code:
      error.code,

    message:
      error.publicMessage,
  };
}

export function getOriginErrorHttpStatus(
  code:
    OriginValidationErrorCode,
): number {
  return ORIGIN_HTTP_STATUS[
    code
  ];
}
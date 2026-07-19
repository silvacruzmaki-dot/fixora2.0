import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

export interface CheckRateLimitInput {
  request: Request;

  namespace: string;

  limit: number;
  windowMs: number;

  /*
   * Permite agregar un identificador conocido por la ruta,
   * por ejemplo un correo normalizado.
   *
   * Nunca se almacena directamente: se incluye dentro
   * del hash HMAC.
   */
  identifier?: string;
}

export interface RateLimitResult {
  allowed: boolean;

  limit: number;
  remaining: number;

  retryAfterSeconds: number;

  resetAt: Date;

  identifierHash: string;
}

export interface ResetRateLimitInput {
  request: Request;

  namespace: string;

  identifier?: string;
}

interface RateLimitEntry {
  count: number;

  createdAtMs: number;
  lastSeenAtMs: number;
  resetAtMs: number;
}

interface RateLimitGlobal {
  __fixoraRateLimitStore?: Map<
    string,
    RateLimitEntry
  >;

  __fixoraRateLimitLastCleanupAt?: number;
}

const globalForRateLimit =
  globalThis as typeof globalThis &
    RateLimitGlobal;

const RATE_LIMIT_CLEANUP_INTERVAL_MS =
  60_000;

const RATE_LIMIT_MAXIMUM_ENTRIES =
  10_000;

const RATE_LIMIT_MAXIMUM_NAMESPACE_LENGTH =
  120;

const RATE_LIMIT_MAXIMUM_IDENTIFIER_LENGTH =
  500;

const RATE_LIMIT_MAXIMUM_WINDOW_MS =
  1000 * 60 * 60 * 24 * 30;

const RATE_LIMIT_NAMESPACE_PATTERN =
  /^[A-Za-z0-9:_-]+$/;

const DEVELOPMENT_RATE_LIMIT_SECRET =
  "fixora-development-rate-limit-secret-change-before-production";

const rateLimitStore =
  globalForRateLimit
    .__fixoraRateLimitStore ??
  new Map<
    string,
    RateLimitEntry
  >();

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForRateLimit.__fixoraRateLimitStore =
    rateLimitStore;
}

function getRateLimitSecret():
  string {
  const secret =
    process.env.AUTH_RATE_LIMIT_SECRET;

  if (
    typeof secret === "string" &&
    secret.length >= 32
  ) {
    return secret;
  }

  if (
    process.env.NODE_ENV ===
    "production"
  ) {
    throw new Error(
      "La variable AUTH_RATE_LIMIT_SECRET debe contener al menos 32 caracteres en producción.",
    );
  }

  return DEVELOPMENT_RATE_LIMIT_SECRET;
}

function normalizeNamespace(
  namespace: string,
): string {
  const normalizedNamespace =
    namespace.trim();

  if (
    normalizedNamespace.length === 0
  ) {
    throw new TypeError(
      "El namespace del rate limit es obligatorio.",
    );
  }

  if (
    normalizedNamespace.length >
    RATE_LIMIT_MAXIMUM_NAMESPACE_LENGTH
  ) {
    throw new RangeError(
      `El namespace del rate limit no puede superar ${RATE_LIMIT_MAXIMUM_NAMESPACE_LENGTH} caracteres.`,
    );
  }

  if (
    !RATE_LIMIT_NAMESPACE_PATTERN.test(
      normalizedNamespace,
    )
  ) {
    throw new TypeError(
      "El namespace del rate limit solamente puede contener letras, números, dos puntos, guiones y guiones bajos.",
    );
  }

  return normalizedNamespace;
}

function normalizeLimit(
  limit: number,
): number {
  if (
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    throw new RangeError(
      "El límite de solicitudes debe ser un número entero mayor que cero.",
    );
  }

  return limit;
}

function normalizeWindowMs(
  windowMs: number,
): number {
  if (
    !Number.isFinite(
      windowMs,
    ) ||
    windowMs < 1 ||
    windowMs >
      RATE_LIMIT_MAXIMUM_WINDOW_MS
  ) {
    throw new RangeError(
      "La ventana del rate limit debe ser mayor que cero y no superar 30 días.",
    );
  }

  return Math.floor(
    windowMs,
  );
}

function normalizeIdentifierPart(
  value:
    | string
    | null
    | undefined,
  fallback: string,
): string {
  if (
    typeof value !== "string"
  ) {
    return fallback;
  }

  const normalizedValue =
    value
      .trim()
      .toLowerCase()
      .replace(
        /[\u0000-\u001F\u007F]/g,
        "",
      )
      .slice(
        0,
        RATE_LIMIT_MAXIMUM_IDENTIFIER_LENGTH,
      );

  return (
    normalizedValue ||
    fallback
  );
}

function readForwardedIp(
  request: Request,
): string | null {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for",
    );

  if (forwardedFor) {
    const firstAddress =
      forwardedFor
        .split(",")[0]
        ?.trim();

    if (firstAddress) {
      return firstAddress;
    }
  }

  return (
    request.headers.get(
      "x-real-ip",
    ) ??
    request.headers.get(
      "cf-connecting-ip",
    ) ??
    request.headers.get(
      "true-client-ip",
    ) ??
    null
  );
}

/**
 * Obtiene la dirección disponible en los encabezados
 * utilizados habitualmente por proxies y plataformas web.
 *
 * Este valor nunca se almacena directamente.
 */
export function getRateLimitClientIp(
  request: Request,
): string {
  return normalizeIdentifierPart(
    readForwardedIp(
      request,
    ),
    "unknown-ip",
  );
}

function getRateLimitUserAgent(
  request: Request,
): string {
  return normalizeIdentifierPart(
    request.headers.get(
      "user-agent",
    ),
    "unknown-user-agent",
  );
}

function createRawIdentifier({
  request,
  identifier,
}: Pick<
  CheckRateLimitInput,
  "request" | "identifier"
>): string {
  const clientIp =
    getRateLimitClientIp(
      request,
    );

  const userAgent =
    getRateLimitUserAgent(
      request,
    );

  const customIdentifier =
    normalizeIdentifierPart(
      identifier,
      "none",
    );

  return [
    clientIp,
    userAgent,
    customIdentifier,
  ].join("|");
}

/**
 * Convierte el identificador en un HMAC-SHA256.
 *
 * La IP, el agente de usuario y los identificadores
 * opcionales no quedan guardados en memoria en texto claro.
 */
export function hashRateLimitIdentifier(
  rawIdentifier: string,
): string {
  const secret =
    getRateLimitSecret();

  return createHmac(
    "sha256",
    secret,
  )
    .update(
      rawIdentifier,
      "utf8",
    )
    .digest(
      "hex",
    );
}

export function getRateLimitIdentifierHash({
  request,
  identifier,
}: Pick<
  CheckRateLimitInput,
  "request" | "identifier"
>): string {
  return hashRateLimitIdentifier(
    createRawIdentifier({
      request,
      identifier,
    }),
  );
}

function createStoreKey(
  namespace: string,
  identifierHash: string,
): string {
  return `${namespace}:${identifierHash}`;
}

function removeExpiredEntries(
  nowMs: number,
): void {
  for (
    const [
      key,
      entry,
    ] of rateLimitStore
  ) {
    if (
      entry.resetAtMs <=
      nowMs
    ) {
      rateLimitStore.delete(
        key,
      );
    }
  }
}

function reduceStoreSize():
  void {
  if (
    rateLimitStore.size <=
    RATE_LIMIT_MAXIMUM_ENTRIES
  ) {
    return;
  }

  const orderedEntries =
    Array.from(
      rateLimitStore.entries(),
    ).sort(
      (
        [, firstEntry],
        [, secondEntry],
      ) =>
        firstEntry.lastSeenAtMs -
        secondEntry.lastSeenAtMs,
    );

  const entriesToDelete =
    rateLimitStore.size -
    RATE_LIMIT_MAXIMUM_ENTRIES;

  for (
    let index = 0;
    index <
    entriesToDelete;
    index += 1
  ) {
    const key =
      orderedEntries[index]?.[0];

    if (key) {
      rateLimitStore.delete(
        key,
      );
    }
  }
}

function cleanupRateLimitStore(
  nowMs: number,
): void {
  const lastCleanupAt =
    globalForRateLimit
      .__fixoraRateLimitLastCleanupAt ??
    0;

  const cleanupRequired =
    nowMs -
      lastCleanupAt >=
      RATE_LIMIT_CLEANUP_INTERVAL_MS ||
    rateLimitStore.size >
      RATE_LIMIT_MAXIMUM_ENTRIES;

  if (!cleanupRequired) {
    return;
  }

  removeExpiredEntries(
    nowMs,
  );

  reduceStoreSize();

  globalForRateLimit.__fixoraRateLimitLastCleanupAt =
    nowMs;
}

function calculateRetryAfterSeconds(
  resetAtMs: number,
  nowMs: number,
): number {
  return Math.max(
    0,
    Math.ceil(
      (
        resetAtMs -
        nowMs
      ) / 1000,
    ),
  );
}

/**
 * Comprueba y consume una solicitud dentro de una
 * ventana temporal fija.
 *
 * Contrato utilizado por las rutas:
 *
 * checkRateLimit({
 *   request,
 *   namespace,
 *   limit,
 *   windowMs,
 * })
 */
export async function checkRateLimit({
  request,
  namespace,
  limit,
  windowMs,
  identifier,
}: CheckRateLimitInput): Promise<RateLimitResult> {
  const normalizedNamespace =
    normalizeNamespace(
      namespace,
    );

  const normalizedLimit =
    normalizeLimit(
      limit,
    );

  const normalizedWindowMs =
    normalizeWindowMs(
      windowMs,
    );

  const nowMs =
    Date.now();

  cleanupRateLimitStore(
    nowMs,
  );

  const identifierHash =
    getRateLimitIdentifierHash({
      request,
      identifier,
    });

  const storeKey =
    createStoreKey(
      normalizedNamespace,
      identifierHash,
    );

  const existingEntry =
    rateLimitStore.get(
      storeKey,
    );

  if (
    !existingEntry ||
    existingEntry.resetAtMs <=
      nowMs
  ) {
    const resetAtMs =
      nowMs +
      normalizedWindowMs;

    rateLimitStore.set(
      storeKey,
      {
        count: 1,

        createdAtMs:
          nowMs,

        lastSeenAtMs:
          nowMs,

        resetAtMs,
      },
    );

    return {
      allowed: true,

      limit:
        normalizedLimit,

      remaining:
        Math.max(
          0,
          normalizedLimit - 1,
        ),

      retryAfterSeconds:
        0,

      resetAt:
        new Date(
          resetAtMs,
        ),

      identifierHash,
    };
  }

  existingEntry.lastSeenAtMs =
    nowMs;

  if (
    existingEntry.count >=
    normalizedLimit
  ) {
    return {
      allowed: false,

      limit:
        normalizedLimit,

      remaining: 0,

      retryAfterSeconds:
        calculateRetryAfterSeconds(
          existingEntry.resetAtMs,
          nowMs,
        ),

      resetAt:
        new Date(
          existingEntry.resetAtMs,
        ),

      identifierHash,
    };
  }

  existingEntry.count += 1;

  rateLimitStore.set(
    storeKey,
    existingEntry,
  );

  return {
    allowed: true,

    limit:
      normalizedLimit,

    remaining:
      Math.max(
        0,
        normalizedLimit -
          existingEntry.count,
      ),

    retryAfterSeconds:
      0,

    resetAt:
      new Date(
        existingEntry.resetAtMs,
      ),

    identifierHash,
  };
}

/**
 * Consulta el estado actual sin consumir una solicitud.
 */
export function peekRateLimit({
  request,
  namespace,
  limit,
  identifier,
}: Omit<
  CheckRateLimitInput,
  "windowMs"
>): RateLimitResult | null {
  const normalizedNamespace =
    normalizeNamespace(
      namespace,
    );

  const normalizedLimit =
    normalizeLimit(
      limit,
    );

  const nowMs =
    Date.now();

  cleanupRateLimitStore(
    nowMs,
  );

  const identifierHash =
    getRateLimitIdentifierHash({
      request,
      identifier,
    });

  const storeKey =
    createStoreKey(
      normalizedNamespace,
      identifierHash,
    );

  const entry =
    rateLimitStore.get(
      storeKey,
    );

  if (
    !entry ||
    entry.resetAtMs <=
      nowMs
  ) {
    return null;
  }

  const allowed =
    entry.count <
    normalizedLimit;

  return {
    allowed,

    limit:
      normalizedLimit,

    remaining:
      Math.max(
        0,
        normalizedLimit -
          entry.count,
      ),

    retryAfterSeconds:
      allowed
        ? 0
        : calculateRetryAfterSeconds(
            entry.resetAtMs,
            nowMs,
          ),

    resetAt:
      new Date(
        entry.resetAtMs,
      ),

    identifierHash,
  };
}

/**
 * Reinicia el límite para una solicitud y namespace.
 *
 * Puede utilizarse después de determinadas acciones
 * exitosas cuando el servicio lo considere necesario.
 */
export function resetRateLimit({
  request,
  namespace,
  identifier,
}: ResetRateLimitInput): boolean {
  const normalizedNamespace =
    normalizeNamespace(
      namespace,
    );

  const identifierHash =
    getRateLimitIdentifierHash({
      request,
      identifier,
    });

  return rateLimitStore.delete(
    createStoreKey(
      normalizedNamespace,
      identifierHash,
    ),
  );
}

/**
 * Cabeceras que pueden agregarse a la respuesta HTTP.
 */
export function createRateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  const resetUnixSeconds =
    Math.ceil(
      result.resetAt.getTime() /
        1000,
    );

  const headers:
    Record<string, string> = {
    "RateLimit-Limit":
      String(
        result.limit,
      ),

    "RateLimit-Remaining":
      String(
        result.remaining,
      ),

    "RateLimit-Reset":
      String(
        resetUnixSeconds,
      ),

    "X-RateLimit-Limit":
      String(
        result.limit,
      ),

    "X-RateLimit-Remaining":
      String(
        result.remaining,
      ),

    "X-RateLimit-Reset":
      String(
        resetUnixSeconds,
      ),
  };

  if (!result.allowed) {
    headers["Retry-After"] =
      String(
        Math.max(
          1,
          result.retryAfterSeconds,
        ),
      );
  }

  return headers;
}

/**
 * Compara dos hashes de identificadores mediante tiempo
 * constante cuando sea necesario realizar una comprobación.
 */
export function compareRateLimitIdentifierHashes(
  firstHash: unknown,
  secondHash: unknown,
): boolean {
  if (
    typeof firstHash !==
      "string" ||
    typeof secondHash !==
      "string" ||
    !/^[a-f0-9]{64}$/i.test(
      firstHash,
    ) ||
    !/^[a-f0-9]{64}$/i.test(
      secondHash,
    )
  ) {
    return false;
  }

  const firstBuffer =
    Buffer.from(
      firstHash,
      "hex",
    );

  const secondBuffer =
    Buffer.from(
      secondHash,
      "hex",
    );

  if (
    firstBuffer.length !==
    secondBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    firstBuffer,
    secondBuffer,
  );
}
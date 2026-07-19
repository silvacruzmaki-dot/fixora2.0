import { PrismaMssql } from "@prisma/adapter-mssql";

import { PrismaClient } from "@/generated/prisma/client";

type SqlServerAdapterConfig =
  ConstructorParameters<
    typeof PrismaMssql
  >[0];

interface PrismaGlobal {
  __fixoraPrisma?:
    PrismaClient;
}

const globalForPrisma =
  globalThis as typeof globalThis &
    PrismaGlobal;

function readRequiredEnvironmentVariable(
  name: string,
  trimValue = true,
): string {
  const value =
    process.env[name];

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(
      `Falta la variable de entorno obligatoria "${name}".`,
    );
  }

  return trimValue
    ? value.trim()
    : value;
}

function readOptionalEnvironmentVariable(
  name: string,
): string | undefined {
  const value =
    process.env[name];

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return undefined;
  }

  return value.trim();
}

function readBooleanEnvironmentVariable(
  name: string,
  defaultValue: boolean,
): boolean {
  const value =
    readOptionalEnvironmentVariable(
      name,
    );

  if (value === undefined) {
    return defaultValue;
  }

  const normalizedValue =
    value.toLowerCase();

  if (
    [
      "true",
      "1",
      "yes",
      "on",
    ].includes(
      normalizedValue,
    )
  ) {
    return true;
  }

  if (
    [
      "false",
      "0",
      "no",
      "off",
    ].includes(
      normalizedValue,
    )
  ) {
    return false;
  }

  throw new Error(
    `La variable "${name}" debe contener true o false.`,
  );
}

function readPortEnvironmentVariable(
  name: string,
): number | undefined {
  const value =
    readOptionalEnvironmentVariable(
      name,
    );

  if (value === undefined) {
    return undefined;
  }

  const port =
    Number(value);

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65_535
  ) {
    throw new Error(
      `La variable "${name}" debe contener un puerto válido entre 1 y 65535.`,
    );
  }

  return port;
}

function createSqlServerConfig():
  SqlServerAdapterConfig {
  const server =
    readRequiredEnvironmentVariable(
      "DB_SERVER",
    );

  const database =
    readRequiredEnvironmentVariable(
      "DB_NAME",
    );

  const user =
    readRequiredEnvironmentVariable(
      "DB_USER",
    );

  /*
   * No se recorta la contraseña para evitar modificar
   * accidentalmente una contraseña que contenga espacios.
   */
  const password =
    readRequiredEnvironmentVariable(
      "DB_PASSWORD",
      false,
    );

  const instanceName =
    readOptionalEnvironmentVariable(
      "DB_INSTANCE",
    );

  const port =
    readPortEnvironmentVariable(
      "DB_PORT",
    );

  if (
    instanceName &&
    port !== undefined
  ) {
    throw new Error(
      "Configura DB_INSTANCE o DB_PORT, pero no ambos al mismo tiempo.",
    );
  }

  const encrypt =
    readBooleanEnvironmentVariable(
      "DB_ENCRYPT",
      false,
    );

  const trustServerCertificate =
    readBooleanEnvironmentVariable(
      "DB_TRUST_SERVER_CERTIFICATE",
      process.env.NODE_ENV !==
        "production",
    );

  return {
    server,
    database,
    user,
    password,

    ...(port !== undefined
      ? {
          port,
        }
      : {}),

    options: {
      encrypt,
      trustServerCertificate,

      ...(instanceName
        ? {
            instanceName,
          }
        : {}),
    },
  };
}

function createPrismaClient():
  PrismaClient {
  const sqlServerConfig =
    createSqlServerConfig();

  const adapter =
    new PrismaMssql(
      sqlServerConfig,
    );

  return new PrismaClient({
    adapter,
  });
}

export const prisma =
  globalForPrisma
    .__fixoraPrisma ??
  createPrismaClient();

/*
 * Durante el desarrollo, Next.js puede volver a cargar
 * los módulos varias veces.
 *
 * Guardar PrismaClient en globalThis evita crear múltiples
 * clientes y múltiples grupos de conexiones.
 */
if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForPrisma.__fixoraPrisma =
    prisma;
}

export default prisma;
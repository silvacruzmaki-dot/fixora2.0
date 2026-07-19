import { resolve } from "node:path";

import { PrismaMssql } from "@prisma/adapter-mssql";
import {
  argon2id,
  hash,
} from "argon2";
import { config as loadEnvironmentVariables } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";

/*
 * El archivo seed se ejecutarÃ¡ desde la raÃ­z de FIXORA.
 * Cargamos explÃ­citamente las variables privadas de .env.local.
 */
loadEnvironmentVariables({
  path: resolve(process.cwd(), ".env.local"),
});

function getRequiredEnvironmentVariable(
  name: string,
): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Falta la variable obligatoria ${name} en .env.local.`,
    );
  }

  return value;
}

function getOptionalEnvironmentVariable(
  name: string,
): string | undefined {
  const value = process.env[name]?.trim();

  return value || undefined;
}

function getBooleanEnvironmentVariable(
  name: string,
  defaultValue: boolean,
): boolean {
  const value = getOptionalEnvironmentVariable(name);

  if (!value) {
    return defaultValue;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(
    `${name} solamente puede contener "true" o "false".`,
  );
}

function getPortEnvironmentVariable(
  name: string,
  defaultValue: number,
): number {
  const value = getOptionalEnvironmentVariable(name);

  if (!value) {
    return defaultValue;
  }

  const parsedPort = Number(value);

  if (
    !Number.isInteger(parsedPort) ||
    parsedPort < 1 ||
    parsedPort > 65535
  ) {
    throw new Error(
      `${name} debe contener un puerto vÃ¡lido entre 1 y 65535.`,
    );
  }

  return parsedPort;
}

function validateTextLength(
  fieldName: string,
  value: string,
  maximumLength: number,
): void {
  if (value.length > maximumLength) {
    throw new Error(
      `${fieldName} no puede superar ${maximumLength} caracteres.`,
    );
  }
}

function validateAdministratorPassword(
  password: string,
): void {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter =
    /[^A-Za-z0-9]/.test(password);

  if (
    password.length < 12 ||
    !hasUppercase ||
    !hasLowercase ||
    !hasNumber ||
    !hasSpecialCharacter
  ) {
    throw new Error(
      [
        "ADMIN_PASSWORD debe tener al menos 12 caracteres,",
        "una mayÃºscula, una minÃºscula, un nÃºmero",
        "y un carÃ¡cter especial.",
      ].join(" "),
    );
  }
}

/* =========================================================
   CONEXIÃ“N A SQL SERVER
   ========================================================= */

const databaseInstance =
  getOptionalEnvironmentVariable("DB_INSTANCE");

const databaseConfiguration = {
  user: getRequiredEnvironmentVariable("DB_USER"),
  password: getRequiredEnvironmentVariable("DB_PASSWORD"),
  database: getRequiredEnvironmentVariable("DB_NAME"),
  server: getRequiredEnvironmentVariable("DB_SERVER"),

  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30_000,
  },

  options: {
    encrypt: getBooleanEnvironmentVariable(
      "DB_ENCRYPT",
      false,
    ),

    trustServerCertificate:
      getBooleanEnvironmentVariable(
        "DB_TRUST_SERVER_CERTIFICATE",
        true,
      ),

    ...(databaseInstance
      ? {
          instanceName: databaseInstance,
        }
      : {}),
  },

  /*
   * Cuando usamos una instancia nombrada como
   * SQLEXPRESS01, no fijamos manualmente el puerto.
   */
  ...(databaseInstance
    ? {}
    : {
        port: getPortEnvironmentVariable(
          "DB_PORT",
          1433,
        ),
      }),
};

const adapter = new PrismaMssql(
  databaseConfiguration,
);

const prisma = new PrismaClient({
  adapter,
});

/* =========================================================
   CREACIÃ“N CONTROLADA DEL ADMINISTRADOR
   ========================================================= */

async function main(): Promise<void> {
  const firstName = getRequiredEnvironmentVariable(
    "ADMIN_FIRST_NAME",
  );

  const lastName = getRequiredEnvironmentVariable(
    "ADMIN_LAST_NAME",
  );

  const displayName = getRequiredEnvironmentVariable(
    "ADMIN_DISPLAY_NAME",
  );

  const email = getRequiredEnvironmentVariable(
    "ADMIN_EMAIL",
  ).toLowerCase();

  const password = getRequiredEnvironmentVariable(
    "ADMIN_PASSWORD",
  );

  const preferredLanguage =
    getOptionalEnvironmentVariable(
      "ADMIN_LANGUAGE",
    ) ?? "es";

  const preferredTheme =
    getOptionalEnvironmentVariable(
      "ADMIN_THEME",
    ) ?? "light";

  validateTextLength(
    "ADMIN_FIRST_NAME",
    firstName,
    80,
  );

  validateTextLength(
    "ADMIN_LAST_NAME",
    lastName,
    80,
  );

  validateTextLength(
    "ADMIN_DISPLAY_NAME",
    displayName,
    80,
  );

  validateTextLength(
    "ADMIN_EMAIL",
    email,
    320,
  );

  validateAdministratorPassword(password);

  if (
    preferredLanguage !== "es" &&
    preferredLanguage !== "en"
  ) {
    throw new Error(
      'ADMIN_LANGUAGE solamente puede ser "es" o "en".',
    );
  }

  if (
    preferredTheme !== "light" &&
    preferredTheme !== "dark"
  ) {
    throw new Error(
      'ADMIN_THEME solamente puede ser "light" o "dark".',
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  /*
   * Si el administrador ya existe, no volvemos a crear
   * la cuenta ni reemplazamos su contraseÃ±a.
   *
   * Solamente aseguramos que mantenga los permisos,
   * el estado activo y sus preferencias principales.
   */
  if (existingUser) {
    const updatedAdministrator =
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },

        data: {
          firstName,
          lastName,
          displayName,

          role: "ADMIN",
          status: "ACTIVE",

          preferredLanguage,
          preferredTheme,

          emailVerifiedAt:
            existingUser.emailVerifiedAt ??
            new Date(),

          lockedUntil: null,
          failedLoginAttempts: 0,
          deletedAt: null,
        },

        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          status: true,
        },
      });

    console.log(
      [
        "Administrador existente actualizado:",
        updatedAdministrator.email,
      ].join(" "),
    );

    return;
  }

  const passwordHash = await hash(password, {
    type: argon2id,
    memoryCost: 65_536,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
  });

  const currentDate = new Date();

  const administrator =
    await prisma.$transaction(
      async (transaction) => {
        const createdUser =
          await transaction.user.create({
            data: {
              firstName,
              lastName,
              displayName,
              email,
              passwordHash,

              role: "ADMIN",
              status: "ACTIVE",

              preferredLanguage,
              preferredTheme,

              emailVerifiedAt: currentDate,
              termsAcceptedAt: currentDate,
              privacyAcceptedAt: currentDate,

              notifications: {
                create: {
                  type: "SYSTEM",

                  titleEs:
                    "Cuenta administradora creada",

                  titleEn:
                    "Administrator account created",

                  messageEs:
                    "Tu cuenta administradora de FIXORA fue creada correctamente.",

                  messageEn:
                    "Your FIXORA administrator account was created successfully.",

                  actionUrl: "/admin",
                },
              },
            },
          });

        await transaction.auditLog.create({
          data: {
            subjectUserId: createdUser.id,

            action: "ADMIN_SEEDED",
            entityType: "USER",
            entityId: createdUser.id,

            detailsText: JSON.stringify({
              source: "prisma-seed",
              email: createdUser.email,
              role: createdUser.role,
            }),
          },
        });

        return createdUser;
      },
    );

  console.log(
    [
      "Administrador inicial creado correctamente:",
      administrator.email,
    ].join(" "),
  );
}

main()
  .catch((error: unknown) => {
    console.error(
      "No se pudo ejecutar el seed de FIXORA.",
    );

    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

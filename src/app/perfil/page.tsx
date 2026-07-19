"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useLanguage from "@/hooks/language/useLanguage";

interface ProfileData {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;
  avatarUrl: string | null;

  role: string;
  status: string;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerified: boolean;
  emailVerifiedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

interface ProfileFormState {
  firstName: string;
  lastName: string;
  displayName: string;
  preferredLanguage: "es" | "en";
  preferredTheme: "light" | "dark";
}

interface LocalizedApiMessage {
  es?: string;
  en?: string;
}

interface ApiResponse<TData> {
  ok: boolean;
  code: string;

  message?: LocalizedApiMessage;

  data?: TData;

  fieldErrors?: Record<string, string[]>;
}

interface ProfileApiData {
  authenticated: boolean;
  profile: ProfileData;
}

interface AvatarApiData {
  avatarUrl: string | null;
  updatedAt: string;
}

const MAX_AVATAR_SIZE_BYTES =
  5 * 1024 * 1024;

const PROFILE_COPY = {
  es: {
    pageTitle:
      "Mi perfil",

    pageDescription:
      "Administra tu información personal y preferencias de FIXORA.",

    loading:
      "Cargando tu perfil...",

    loadError:
      "No fue posible cargar tu perfil.",

    personalInformation:
      "Información personal",

    personalDescription:
      "Estos datos se utilizan para identificar tu cuenta dentro de FIXORA.",

    avatarTitle:
      "Foto de perfil",

    avatarDescription:
      "Puedes utilizar una imagen JPG, PNG o WebP de hasta 5 MB.",

    uploadAvatar:
      "Subir imagen",

    changeAvatar:
      "Cambiar imagen",

    removeAvatar:
      "Eliminar imagen",

    uploadingAvatar:
      "Guardando imagen...",

    removingAvatar:
      "Eliminando imagen...",

    firstName:
      "Nombres",

    lastName:
      "Apellidos",

    displayName:
      "Nombre visible",

    email:
      "Correo electrónico",

    role:
      "Rol de la cuenta",

    accountCreated:
      "Cuenta creada",

    preferredLanguage:
      "Idioma preferido",

    preferredTheme:
      "Tema preferido",

    spanish:
      "Español",

    english:
      "Inglés",

    light:
      "Claro",

    dark:
      "Oscuro",

    userRole:
      "Usuario",

    adminRole:
      "Administrador",

    verified:
      "Correo verificado",

    notVerified:
      "Correo pendiente de verificación",

    saveChanges:
      "Guardar cambios",

    saving:
      "Guardando cambios...",

    changesSaved:
      "Tu perfil fue actualizado correctamente.",

    avatarUpdated:
      "Tu foto de perfil fue actualizada correctamente.",

    avatarRemoved:
      "Tu foto de perfil fue eliminada correctamente.",

    invalidAvatar:
      "Selecciona una imagen JPG, PNG o WebP válida.",

    avatarTooLarge:
      "La imagen no puede superar los 5 MB.",

    sessionExpired:
      "Tu sesión venció. Debes iniciar sesión nuevamente.",

    unexpectedError:
      "Ocurrió un problema inesperado. Inténtalo nuevamente.",

    retry:
      "Reintentar",

    initialsAlt:
      "Iniciales del usuario",

    avatarAlt:
      "Foto de perfil del usuario",
  },

  en: {
    pageTitle:
      "My profile",

    pageDescription:
      "Manage your personal information and FIXORA preferences.",

    loading:
      "Loading your profile...",

    loadError:
      "Your profile could not be loaded.",

    personalInformation:
      "Personal information",

    personalDescription:
      "This information is used to identify your account within FIXORA.",

    avatarTitle:
      "Profile picture",

    avatarDescription:
      "You can use a JPG, PNG, or WebP image up to 5 MB.",

    uploadAvatar:
      "Upload image",

    changeAvatar:
      "Change image",

    removeAvatar:
      "Remove image",

    uploadingAvatar:
      "Saving image...",

    removingAvatar:
      "Removing image...",

    firstName:
      "First names",

    lastName:
      "Last names",

    displayName:
      "Display name",

    email:
      "Email address",

    role:
      "Account role",

    accountCreated:
      "Account created",

    preferredLanguage:
      "Preferred language",

    preferredTheme:
      "Preferred theme",

    spanish:
      "Spanish",

    english:
      "English",

    light:
      "Light",

    dark:
      "Dark",

    userRole:
      "User",

    adminRole:
      "Administrator",

    verified:
      "Email verified",

    notVerified:
      "Email verification pending",

    saveChanges:
      "Save changes",

    saving:
      "Saving changes...",

    changesSaved:
      "Your profile was updated successfully.",

    avatarUpdated:
      "Your profile picture was updated successfully.",

    avatarRemoved:
      "Your profile picture was removed successfully.",

    invalidAvatar:
      "Select a valid JPG, PNG, or WebP image.",

    avatarTooLarge:
      "The image cannot exceed 5 MB.",

    sessionExpired:
      "Your session expired. You must sign in again.",

    unexpectedError:
      "An unexpected problem occurred. Please try again.",

    retry:
      "Try again",

    initialsAlt:
      "User initials",

    avatarAlt:
      "User profile picture",
  },
} as const;

function getApiMessage<TData>(
  response: ApiResponse<TData>,
  language: "es" | "en",
  fallback: string,
): string {
  const localizedMessage =
    response.message?.[language];

  if (
    typeof localizedMessage ===
      "string" &&
    localizedMessage
      .trim()
      .length > 0
  ) {
    return localizedMessage;
  }

  return fallback;
}

function getInitials(
  profile: Pick<
    ProfileData,
    | "firstName"
    | "lastName"
    | "displayName"
  >,
): string {
  const firstInitial =
    profile.firstName
      .trim()
      .charAt(0);

  const lastInitial =
    profile.lastName
      .trim()
      .charAt(0);

  const combinedInitials =
    `${firstInitial}${lastInitial}`
      .trim()
      .toUpperCase();

  if (combinedInitials) {
    return combinedInitials;
  }

  return profile.displayName
    .trim()
    .slice(0, 2)
    .toUpperCase();
}

function createFormState(
  profile: ProfileData,
): ProfileFormState {
  return {
    firstName:
      profile.firstName,

    lastName:
      profile.lastName,

    displayName:
      profile.displayName,

    preferredLanguage:
      profile.preferredLanguage ===
      "en"
        ? "en"
        : "es",

    preferredTheme:
      profile.preferredTheme ===
      "dark"
        ? "dark"
        : "light",
  };
}

export default function ProfilePage() {
  const router =
    useRouter();

  const {
    language,
  } = useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    PROFILE_COPY[
      currentLanguage
    ];

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    profile,
    setProfile,
  ] =
    useState<ProfileData | null>(
      null,
    );

  const [
    formState,
    setFormState,
  ] =
    useState<ProfileFormState>({
      firstName: "",
      lastName: "",
      displayName: "",
      preferredLanguage: "es",
      preferredTheme: "light",
    });

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  const [
    isUploadingAvatar,
    setIsUploadingAvatar,
  ] =
    useState(false);

  const [
    isRemovingAvatar,
    setIsRemovingAvatar,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(
      null,
    );

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<string | null>(
      null,
    );

  const redirectToLogin =
    useCallback(() => {
      router.replace(
        "/iniciar-sesion?redirect=/perfil",
      );
    }, [router]);

  const loadProfile =
    useCallback(
      async (
        signal?: AbortSignal,
      ) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          const response =
            await fetch(
              "/api/perfil",
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

                signal,
              },
            );

          const payload =
            (await response.json()) as
              ApiResponse<ProfileApiData>;

          if (
            response.status ===
            401
          ) {
            redirectToLogin();

            return;
          }

          if (
            !response.ok ||
            !payload.data
              ?.profile
          ) {
            throw new Error(
              getApiMessage(
                payload,
                currentLanguage,
                copy.loadError,
              ),
            );
          }

          const loadedProfile =
            payload.data.profile;

          if (
            signal?.aborted
          ) {
            return;
          }

          setProfile(
            loadedProfile,
          );

          setFormState(
            createFormState(
              loadedProfile,
            ),
          );
        } catch (
          error: unknown
        ) {
          if (
            signal?.aborted ||
            (
              error instanceof
                Error &&
              error.name ===
                "AbortError"
            )
          ) {
            return;
          }

          setErrorMessage(
            error instanceof
              Error
              ? error.message
              : copy.loadError,
          );
        } finally {
          if (
            !signal?.aborted
          ) {
            setIsLoading(
              false,
            );
          }
        }
      },
      [
        copy.loadError,
        currentLanguage,
        redirectToLogin,
      ],
    );

  useEffect(() => {
    const abortController =
      new AbortController();

    const timeoutId =
      window.setTimeout(
        () => {
          void loadProfile(
            abortController.signal,
          );
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );

      abortController.abort();
    };
  }, [loadProfile]);

  useEffect(() => {
    document.title =
      `FIXORA | ${copy.pageTitle}`;
  }, [copy.pageTitle]);

  const accountCreationDate =
    useMemo(() => {
      if (!profile) {
        return "";
      }

      const date =
        new Date(
          profile.createdAt,
        );

      if (
        Number.isNaN(
          date.getTime(),
        )
      ) {
        return profile.createdAt;
      }

      return new Intl.DateTimeFormat(
        currentLanguage ===
          "en"
          ? "en-US"
          : "es-PE",
        {
          year:
            "numeric",

          month:
            "long",

          day:
            "2-digit",
        },
      ).format(date);
    }, [
      currentLanguage,
      profile,
    ]);

  const initials =
    useMemo(() => {
      if (!profile) {
        return "FX";
      }

      return getInitials(
        profile,
      );
    }, [profile]);

  const roleLabel =
    profile?.role ===
    "ADMIN"
      ? copy.adminRole
      : copy.userRole;

  const handleFieldChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
    >,
  ) => {
    const {
      name,
      value,
    } =
      event.target;

    setSuccessMessage(
      null,
    );

    setErrorMessage(
      null,
    );

    setFormState(
      (
        currentState,
      ) => ({
        ...currentState,

        [name]:
          value,
      }),
    );
  };

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        !profile ||
        isSaving
      ) {
        return;
      }

      setIsSaving(
        true,
      );

      setErrorMessage(
        null,
      );

      setSuccessMessage(
        null,
      );

      try {
        const response =
          await fetch(
            "/api/perfil",
            {
              method:
                "PATCH",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify(
                  formState,
                ),
            },
          );

        const payload =
          (await response.json()) as
            ApiResponse<ProfileApiData>;

        if (
          response.status ===
          401
        ) {
          setErrorMessage(
            copy.sessionExpired,
          );

          redirectToLogin();

          return;
        }

        if (
          !response.ok ||
          !payload.data
            ?.profile
        ) {
          const firstFieldError =
            payload.fieldErrors
              ? Object.values(
                  payload.fieldErrors,
                )
                  .flat()
                  .at(0)
              : undefined;

          throw new Error(
            firstFieldError ??
              getApiMessage(
                payload,
                currentLanguage,
                copy.unexpectedError,
              ),
          );
        }

        const updatedProfile =
          payload.data.profile;

        setProfile(
          updatedProfile,
        );

        setFormState(
          createFormState(
            updatedProfile,
          ),
        );

        setSuccessMessage(
          copy.changesSaved,
        );
      } catch (
        error: unknown
      ) {
        setErrorMessage(
          error instanceof
            Error
            ? error.message
            : copy.unexpectedError,
        );
      } finally {
        setIsSaving(
          false,
        );
      }
    };

  const handleAvatarSelection =
    async (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const selectedFile =
        event.target
          .files?.[0];

      event.target.value =
        "";

      if (
        !selectedFile ||
        isUploadingAvatar
      ) {
        return;
      }

      const allowedMimeTypes =
        new Set([
          "image/jpeg",
          "image/png",
          "image/webp",
        ]);

      if (
        !allowedMimeTypes.has(
          selectedFile.type,
        )
      ) {
        setErrorMessage(
          copy.invalidAvatar,
        );

        return;
      }

      if (
        selectedFile.size >
        MAX_AVATAR_SIZE_BYTES
      ) {
        setErrorMessage(
          copy.avatarTooLarge,
        );

        return;
      }

      setIsUploadingAvatar(
        true,
      );

      setErrorMessage(
        null,
      );

      setSuccessMessage(
        null,
      );

      try {
        const formData =
          new FormData();

        formData.append(
          "avatar",
          selectedFile,
        );

        const response =
          await fetch(
            "/api/perfil/avatar",
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                Accept:
                  "application/json",
              },

              body:
                formData,
            },
          );

        const payload =
          (await response.json()) as
            ApiResponse<AvatarApiData>;

        if (
          response.status ===
          401
        ) {
          redirectToLogin();

          return;
        }

        if (
          !response.ok ||
          !payload.data
        ) {
          throw new Error(
            getApiMessage(
              payload,
              currentLanguage,
              copy.unexpectedError,
            ),
          );
        }

        const avatarData =
          payload.data;

        setProfile(
          (
            currentProfile,
          ) => {
            if (
              !currentProfile
            ) {
              return currentProfile;
            }

            return {
              ...currentProfile,

              avatarUrl:
                avatarData
                  .avatarUrl,

              updatedAt:
                avatarData
                  .updatedAt,
            };
          },
        );

        setSuccessMessage(
          copy.avatarUpdated,
        );
      } catch (
        error: unknown
      ) {
        setErrorMessage(
          error instanceof
            Error
            ? error.message
            : copy.unexpectedError,
        );
      } finally {
        setIsUploadingAvatar(
          false,
        );
      }
    };

  const handleRemoveAvatar =
    async () => {
      if (
        !profile?.avatarUrl ||
        isRemovingAvatar
      ) {
        return;
      }

      setIsRemovingAvatar(
        true,
      );

      setErrorMessage(
        null,
      );

      setSuccessMessage(
        null,
      );

      try {
        const response =
          await fetch(
            "/api/perfil/avatar",
            {
              method:
                "DELETE",

              credentials:
                "include",

              headers: {
                Accept:
                  "application/json",
              },
            },
          );

        const payload =
          (await response.json()) as
            ApiResponse<AvatarApiData>;

        if (
          response.status ===
          401
        ) {
          redirectToLogin();

          return;
        }

        if (
          !response.ok
        ) {
          throw new Error(
            getApiMessage(
              payload,
              currentLanguage,
              copy.unexpectedError,
            ),
          );
        }

        const updatedAt =
          payload.data
            ?.updatedAt;

        setProfile(
          (
            currentProfile,
          ) => {
            if (
              !currentProfile
            ) {
              return currentProfile;
            }

            return {
              ...currentProfile,

              avatarUrl:
                null,

              updatedAt:
                updatedAt ??
                currentProfile.updatedAt,
            };
          },
        );

        setSuccessMessage(
          copy.avatarRemoved,
        );
      } catch (
        error: unknown
      ) {
        setErrorMessage(
          error instanceof
            Error
            ? error.message
            : copy.unexpectedError,
        );
      } finally {
        setIsRemovingAvatar(
          false,
        );
      }
    };

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5 py-12">
        <div
          className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-6 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/80"
          aria-live="polite"
        >
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />

          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {copy.loading}
          </span>
        </div>
      </main>
    );
  }

  if (
    errorMessage &&
    !profile
  ) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5 py-12">
        <section className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white p-7 text-center shadow-xl dark:bg-zinc-900">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            {copy.loadError}
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => {
              void loadProfile();
            }}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
          >
            {copy.retry}
          </button>
        </section>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  const avatarBusy =
    isUploadingAvatar ||
    isRemovingAvatar;

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            FIXORA
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            {copy.pageTitle}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
            {
              copy.pageDescription
            }
          </p>
        </header>

        <div
          className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]"
          aria-busy={
            isSaving ||
            avatarBusy
          }
        >
          <aside className="h-fit rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-500/20 bg-emerald-600 text-3xl font-bold text-white shadow-lg">
                {
                  profile.avatarUrl
                    ? (
                      <Image
                        src={
                          profile.avatarUrl
                        }
                        alt={
                          copy.avatarAlt
                        }
                        width={128}
                        height={128}
                        priority
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    )
                    : (
                      <span
                        aria-label={
                          copy.initialsAlt
                        }
                      >
                        {initials}
                      </span>
                    )
                }

                {
                  avatarBusy
                    ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    )
                    : null
                }
              </div>

              <h2 className="mt-5 text-xl font-bold text-zinc-950 dark:text-white">
                {
                  profile.displayName
                }
              </h2>

              <p className="mt-1 break-all text-sm text-zinc-500 dark:text-zinc-400">
                {profile.email}
              </p>

              <span className="mt-4 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {roleLabel}
              </span>

              <span
                className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${
                  profile.emailVerified
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                }`}
              >
                {
                  profile.emailVerified
                    ? copy.verified
                    : copy.notVerified
                }
              </span>
            </div>

            <div className="mt-7 border-t border-black/10 pt-6 dark:border-white/10">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {
                  copy.avatarTitle
                }
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                {
                  copy.avatarDescription
                }
              </p>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={
                  handleAvatarSelection
                }
                disabled={
                  avatarBusy
                }
              />

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef
                      .current
                      ?.click();
                  }}
                  disabled={
                    avatarBusy
                  }
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {
                    isUploadingAvatar
                      ? copy.uploadingAvatar
                      : profile.avatarUrl
                        ? copy.changeAvatar
                        : copy.uploadAvatar
                  }
                </button>

                {
                  profile.avatarUrl
                    ? (
                      <button
                        type="button"
                        onClick={() => {
                          void handleRemoveAvatar();
                        }}
                        disabled={
                          avatarBusy
                        }
                        className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
                      >
                        {
                          isRemovingAvatar
                            ? copy.removingAvatar
                            : copy.removeAvatar
                        }
                      </button>
                    )
                    : null
                }
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-8">
            <div className="border-b border-black/10 pb-6 dark:border-white/10">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                {
                  copy.personalInformation
                }
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {
                  copy.personalDescription
                }
              </p>
            </div>

            <div
              className="mt-6"
              aria-live="polite"
            >
              {
                errorMessage
                  ? (
                    <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                      {
                        errorMessage
                      }
                    </div>
                  )
                  : null
              }

              {
                successMessage
                  ? (
                    <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                      {
                        successMessage
                      }
                    </div>
                  )
                  : null
              }
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="grid gap-5 sm:grid-cols-2"
            >
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {
                    copy.firstName
                  }
                </span>

                <input
                  type="text"
                  name="firstName"
                  value={
                    formState.firstName
                  }
                  onChange={
                    handleFieldChange
                  }
                  maxLength={80}
                  autoComplete="given-name"
                  required
                  className="h-12 rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {
                    copy.lastName
                  }
                </span>

                <input
                  type="text"
                  name="lastName"
                  value={
                    formState.lastName
                  }
                  onChange={
                    handleFieldChange
                  }
                  maxLength={80}
                  autoComplete="family-name"
                  required
                  className="h-12 rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {
                    copy.displayName
                  }
                </span>

                <input
                  type="text"
                  name="displayName"
                  value={
                    formState.displayName
                  }
                  onChange={
                    handleFieldChange
                  }
                  maxLength={80}
                  autoComplete="nickname"
                  required
                  className="h-12 rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {
                    copy.email
                  }
                </span>

                <input
                  type="email"
                  value={
                    profile.email
                  }
                  disabled
                  className="h-12 cursor-not-allowed rounded-xl border border-black/10 bg-zinc-100 px-4 text-sm text-zinc-500 opacity-80 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {
                    copy.role
                  }
                </span>

                <input
                  type="text"
                  value={
                    roleLabel
                  }
                  disabled
                  className="h-12 cursor-not-allowed rounded-xl border border-black/10 bg-zinc-100 px-4 text-sm text-zinc-500 opacity-80 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {
                    copy.preferredLanguage
                  }
                </span>

                <select
                  name="preferredLanguage"
                  value={
                    formState.preferredLanguage
                  }
                  onChange={
                    handleFieldChange
                  }
                  className="h-12 rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="es">
                    {
                      copy.spanish
                    }
                  </option>

                  <option value="en">
                    {
                      copy.english
                    }
                  </option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {
                    copy.preferredTheme
                  }
                </span>

                <select
                  name="preferredTheme"
                  value={
                    formState.preferredTheme
                  }
                  onChange={
                    handleFieldChange
                  }
                  className="h-12 rounded-xl border border-black/10 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="light">
                    {
                      copy.light
                    }
                  </option>

                  <option value="dark">
                    {
                      copy.dark
                    }
                  </option>
                </select>
              </label>

              <div className="rounded-2xl bg-zinc-50 px-4 py-4 dark:bg-zinc-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {
                    copy.accountCreated
                  }
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                  {
                    accountCreationDate
                  }
                </p>
              </div>

              <div className="flex items-end justify-end sm:col-start-2">
                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    avatarBusy
                  }
                  className="h-12 w-full rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/15 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {
                    isSaving
                      ? copy.saving
                      : copy.saveChanges
                  }
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
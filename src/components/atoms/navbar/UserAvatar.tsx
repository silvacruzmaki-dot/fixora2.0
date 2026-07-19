"use client";

import Image from "next/image";

import {
  useMemo,
  useState,
  type HTMLAttributes,
} from "react";

export type UserAvatarSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

export interface UserAvatarProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;

  avatarUrl?: string | null;
  altText?: string;

  size?: UserAvatarSize;

  showOnlineStatus?: boolean;
  isOnline?: boolean;

  imageClassName?: string;
  initialsClassName?: string;
}

interface AvatarSizeClasses {
  container: string;
  text: string;
  status: string;
  imageSizes: string;
}

const SIZE_CLASSES: Record<
  UserAvatarSize,
  AvatarSizeClasses
> = {
  sm: {
    container: "h-8 w-8",
    text: "text-xs",
    status: "h-2.5 w-2.5",
    imageSizes: "32px",
  },

  md: {
    container: "h-10 w-10",
    text: "text-sm",
    status: "h-3 w-3",
    imageSizes: "40px",
  },

  lg: {
    container: "h-12 w-12",
    text: "text-base",
    status: "h-3.5 w-3.5",
    imageSizes: "48px",
  },

  xl: {
    container: "h-16 w-16",
    text: "text-xl",
    status: "h-4 w-4",
    imageSizes: "64px",
  },
};

function getFirstCharacter(
  value?: string | null,
): string {
  return (
    value
      ?.trim()
      .charAt(0)
      .toUpperCase() ?? ""
  );
}

function getUserInitials({
  firstName,
  lastName,
  displayName,
}: Pick<
  UserAvatarProps,
  | "firstName"
  | "lastName"
  | "displayName"
>): string {
  const firstInitial =
    getFirstCharacter(
      firstName,
    );

  const lastInitial =
    getFirstCharacter(
      lastName,
    );

  const combinedInitials =
    `${firstInitial}${lastInitial}`
      .trim();

  if (combinedInitials) {
    return combinedInitials;
  }

  const normalizedDisplayName =
    displayName?.trim() ?? "";

  if (!normalizedDisplayName) {
    return "FX";
  }

  const displayNameParts =
    normalizedDisplayName
      .split(/\s+/)
      .filter(Boolean);

  if (
    displayNameParts.length >= 2
  ) {
    const firstPart =
      displayNameParts[0];

    const lastPart =
      displayNameParts[
        displayNameParts.length - 1
      ];

    return `${getFirstCharacter(
      firstPart,
    )}${getFirstCharacter(
      lastPart,
    )}`;
  }

  return normalizedDisplayName
    .slice(0, 2)
    .toUpperCase();
}

function getResolvedAltText({
  altText,
  displayName,
  firstName,
  lastName,
}: Pick<
  UserAvatarProps,
  | "altText"
  | "displayName"
  | "firstName"
  | "lastName"
>): string {
  const normalizedAltText =
    altText?.trim();

  if (normalizedAltText) {
    return normalizedAltText;
  }

  const normalizedDisplayName =
    displayName?.trim();

  if (normalizedDisplayName) {
    return normalizedDisplayName;
  }

  const completeName = [
    firstName?.trim(),
    lastName?.trim(),
  ]
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value),
    )
    .join(" ")
    .trim();

  if (completeName) {
    return completeName;
  }

  return "Usuario FIXORA";
}

export function UserAvatar({
  firstName,
  lastName,
  displayName,

  avatarUrl,
  altText,

  size = "md",

  showOnlineStatus = false,
  isOnline = false,

  className,
  imageClassName = "",
  initialsClassName = "",

  ...containerProps
}: UserAvatarProps) {
  /*
   * Se almacena la URL que produjo un error.
   *
   * Cuando avatarUrl cambia, la nueva URL vuelve
   * a mostrarse automáticamente sin necesitar
   * un useEffect que ejecute setState.
   */
  const [
    failedAvatarUrl,
    setFailedAvatarUrl,
  ] = useState<string | null>(
    null,
  );

  const normalizedAvatarUrl =
    avatarUrl?.trim() || null;

  const initials =
    useMemo(
      () =>
        getUserInitials({
          firstName,
          lastName,
          displayName,
        }),
      [
        displayName,
        firstName,
        lastName,
      ],
    );

  const resolvedAltText =
    useMemo(
      () =>
        getResolvedAltText({
          altText,
          displayName,
          firstName,
          lastName,
        }),
      [
        altText,
        displayName,
        firstName,
        lastName,
      ],
    );

  const sizeClasses =
    SIZE_CLASSES[size];

  const shouldShowImage =
    normalizedAvatarUrl !== null &&
    failedAvatarUrl !==
      normalizedAvatarUrl;

  const onlineStatusText =
    isOnline
      ? "Usuario conectado"
      : "Usuario desconectado";

  return (
    <div
      {...containerProps}
      className={[
        "relative inline-flex shrink-0",
        sizeClasses.container,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "relative flex h-full w-full",
          "items-center justify-center",
          "overflow-hidden rounded-full",
          "border border-black/10",
          "bg-emerald-600",
          "font-bold uppercase text-white",
          "shadow-sm",
          "dark:border-white/10",
          sizeClasses.text,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {shouldShowImage ? (
          <Image
            key={
              normalizedAvatarUrl
            }
            src={
              normalizedAvatarUrl
            }
            alt={
              resolvedAltText
            }
            fill
            sizes={
              sizeClasses.imageSizes
            }
            unoptimized
            draggable={false}
            onError={() => {
              setFailedAvatarUrl(
                normalizedAvatarUrl,
              );
            }}
            className={[
              "object-cover",
              imageClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ) : (
          <span
            aria-label={
              resolvedAltText
            }
            className={[
              "select-none",
              initialsClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {initials}
          </span>
        )}
      </div>

      {showOnlineStatus ? (
        <span
          aria-label={
            onlineStatusText
          }
          title={
            onlineStatusText
          }
          className={[
            "absolute bottom-0 right-0",
            "rounded-full border-2",
            "border-white",
            "dark:border-zinc-950",
            sizeClasses.status,
            isOnline
              ? "bg-emerald-500"
              : "bg-zinc-400",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ) : null}
    </div>
  );
}
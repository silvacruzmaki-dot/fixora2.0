"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

import { UserAvatar } from "@/components/atoms/navbar/UserAvatar";

export interface UserSessionButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
  > {
  isAuthenticated: boolean;

  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;

  roleLabel?: string;
  guestLabel: string;

  openMenuLabel: string;
  closeMenuLabel: string;

  isOpen?: boolean;
  compact?: boolean;
  fullWidth?: boolean;

  showUserDetails?: boolean;
  showChevron?: boolean;

  menuControlsId?: string;
}

function GuestIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function ChevronIcon({
  isOpen,
}: {
  isOpen: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={[
        "shrink-0 transition-transform duration-200",
        isOpen
          ? "rotate-180"
          : "rotate-0",
      ].join(" ")}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export const UserSessionButton =
  forwardRef<
    HTMLButtonElement,
    UserSessionButtonProps
  >(function UserSessionButton(
    {
      isAuthenticated,

      firstName,
      lastName,
      displayName,
      avatarUrl,

      roleLabel,
      guestLabel,

      openMenuLabel,
      closeMenuLabel,

      isOpen = false,
      compact = false,
      fullWidth = false,

      showUserDetails = true,
      showChevron = true,

      menuControlsId,

      disabled,
      className,

      "aria-label": ariaLabel,

      ...buttonProps
    },
    ref,
  ) {
    const resolvedDisplayName =
      displayName?.trim() ||
      [firstName, lastName]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      guestLabel;

    const accessibilityLabel =
      ariaLabel ??
      (isOpen
        ? closeMenuLabel
        : openMenuLabel);

    const shouldShowDetails =
      isAuthenticated &&
      showUserDetails &&
      !compact;

    return (
      <button
        {...buttonProps}
        ref={ref}
        type="button"
        disabled={disabled}
        aria-label={
          accessibilityLabel
        }
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={
          menuControlsId
        }
        className={[
          "group inline-flex min-h-11 items-center gap-3 rounded-xl",
          "border border-black/10 bg-white px-3 py-2",
          "text-left text-zinc-800 shadow-sm transition",
          "hover:border-emerald-500/40 hover:bg-emerald-500/5",
          "focus:outline-none focus:ring-4 focus:ring-emerald-500/15",
          "active:scale-[0.99]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100",
          "dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10",

          fullWidth
            ? "w-full justify-between"
            : "",

          compact
            ? "justify-center px-2"
            : "",

          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="flex min-w-0 items-center gap-3">
          {isAuthenticated ? (
            <UserAvatar
              firstName={firstName}
              lastName={lastName}
              displayName={
                resolvedDisplayName
              }
              avatarUrl={avatarUrl}
              size="md"
            />
          ) : (
            <span
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                "bg-emerald-500/10 text-emerald-700",
                "transition group-hover:bg-emerald-500/15",
                "dark:text-emerald-400",
              ].join(" ")}
              aria-hidden="true"
            >
              <GuestIcon />
            </span>
          )}

          {shouldShowDetails ? (
            <span className="min-w-0">
              <span className="block max-w-36 truncate text-sm font-semibold text-zinc-950 dark:text-white">
                {resolvedDisplayName}
              </span>

              {roleLabel ? (
                <span className="mt-0.5 block max-w-36 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {roleLabel}
                </span>
              ) : null}
            </span>
          ) : !isAuthenticated &&
            !compact ? (
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {guestLabel}
            </span>
          ) : null}
        </span>

        {showChevron &&
        !compact ? (
          <span className="text-zinc-400 transition group-hover:text-emerald-600 dark:text-zinc-500 dark:group-hover:text-emerald-400">
            <ChevronIcon
              isOpen={isOpen}
            />
          </span>
        ) : null}
      </button>
    );
  });

UserSessionButton.displayName =
  "UserSessionButton";
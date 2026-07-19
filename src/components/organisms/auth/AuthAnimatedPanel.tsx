"use client";

import type { CSSProperties } from "react";

import {
  AuthSwitchContent,
  type AuthSwitchMode,
} from "@/components/molecules/auth/AuthSwitchContent";

export interface AuthAnimatedPanelProps {
  mode: AuthSwitchMode;

  controlsId?: string;
  disabled?: boolean;

  onSwitchMode: (
    nextMode: AuthSwitchMode,
  ) => void;

  className?: string;
}

function MonitorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
      />

      <path d="M8 21h8" />

      <path d="M12 17v4" />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.7 6.3a4 4 0 0 0-5-5l2.1 2.1-2.4 2.4-2.1-2.1a4 4 0 0 0 5 5l6.5 6.5a2 2 0 0 0 2.8-2.8l-6.9-6.1Z" />

      <path d="m5 14-3 3 5 5 3-3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v5c0 5.2 3.4 8.8 8 10 4.6-1.2 8-4.8 8-10V6l-8-3Z" />

      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8 9-4 3 4 3" />

      <path d="m16 9 4 3-4 3" />

      <path d="m14 5-4 14" />
    </svg>
  );
}

const FLOATING_CARD_STYLE:
  CSSProperties = {
  animationDuration: "5.5s",
  animationTimingFunction:
    "ease-in-out",
  animationIterationCount:
    "infinite",
};

export function AuthAnimatedPanel({
  mode,

  controlsId,
  disabled = false,

  onSwitchMode,

  className = "",
}: AuthAnimatedPanelProps) {
  const isLoginMode =
    mode === "login";

  return (
    <div
      className={[
        "relative h-full min-h-80 w-full overflow-hidden",
        "bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className={[
            "absolute h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl",
            "transition-all duration-700 ease-in-out",
            "motion-reduce:transition-none",

            isLoginMode
              ? "-right-24 -top-24"
              : "-left-24 -top-28",
          ].join(" ")}
        />

        <div
          className={[
            "absolute h-80 w-80 rounded-full bg-teal-300/10 blur-3xl",
            "transition-all duration-700 ease-in-out",
            "motion-reduce:transition-none",

            isLoginMode
              ? "-bottom-32 -left-28"
              : "-bottom-32 -right-28",
          ].join(" ")}
        />

        <div
          className={[
            "absolute h-44 w-44 rounded-full border border-white/10",
            "transition-all duration-700 ease-in-out",
            "motion-safe:animate-spin motion-reduce:transition-none",

            isLoginMode
              ? "right-10 top-20"
              : "left-10 top-20",
          ].join(" ")}
          style={{
            animationDuration:
              "24s",
          }}
        >
          <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200 shadow-lg shadow-emerald-200/40" />

          <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/70" />
        </div>

        <div
          className={[
            "absolute h-72 w-72 rounded-full border border-white/10",
            "transition-all duration-700 ease-in-out",
            "motion-safe:animate-spin motion-reduce:transition-none",

            isLoginMode
              ? "-bottom-24 -right-20"
              : "-bottom-24 -left-20",
          ].join(" ")}
          style={{
            animationDuration:
              "32s",
            animationDirection:
              "reverse",
          }}
        />

        <div
          className={[
            "absolute flex h-14 w-14 items-center justify-center rounded-2xl",
            "border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-sm",
            "transition-all duration-700 ease-in-out",
            "motion-safe:animate-bounce motion-reduce:animate-none motion-reduce:transition-none",

            isLoginMode
              ? "left-7 top-24 rotate-[-8deg]"
              : "right-7 top-24 rotate-[8deg]",
          ].join(" ")}
          style={{
            animationDuration:
              "4s",
          }}
        >
          <MonitorIcon />
        </div>

        <div
          className={[
            "absolute flex h-14 w-14 items-center justify-center rounded-2xl",
            "border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-sm",
            "transition-all duration-700 ease-in-out",
            "motion-safe:animate-bounce motion-reduce:animate-none motion-reduce:transition-none",

            isLoginMode
              ? "bottom-24 right-7 rotate-[8deg]"
              : "bottom-24 left-7 rotate-[-8deg]",
          ].join(" ")}
          style={{
            animationDuration:
              "5s",
            animationDelay:
              "700ms",
          }}
        >
          <ToolIcon />
        </div>

        <div
          className={[
            "absolute flex h-11 w-11 items-center justify-center rounded-xl",
            "border border-white/15 bg-black/10 text-emerald-100 backdrop-blur-sm",
            "transition-all duration-700 ease-in-out",
            "motion-safe:animate-pulse motion-reduce:animate-none motion-reduce:transition-none",

            isLoginMode
              ? "bottom-44 left-12"
              : "bottom-44 right-12",
          ].join(" ")}
        >
          <ShieldIcon />
        </div>

        <div
          className={[
            "absolute flex h-11 w-11 items-center justify-center rounded-xl",
            "border border-white/15 bg-black/10 text-emerald-100 backdrop-blur-sm",
            "transition-all duration-700 ease-in-out",
            "motion-safe:animate-pulse motion-reduce:animate-none motion-reduce:transition-none",

            isLoginMode
              ? "right-14 top-48"
              : "left-14 top-48",
          ].join(" ")}
          style={{
            animationDelay:
              "900ms",
          }}
        >
          <CodeIcon />
        </div>

        <span
          className={[
            "absolute h-2.5 w-2.5 rounded-full bg-emerald-200/80 shadow-lg shadow-emerald-200/50",
            "transition-all duration-700",
            "motion-safe:animate-pulse motion-reduce:animate-none",

            isLoginMode
              ? "bottom-16 left-1/3"
              : "bottom-16 right-1/3",
          ].join(" ")}
        />

        <span
          className={[
            "absolute h-2 w-2 rounded-full bg-white/70",
            "transition-all duration-700",
            "motion-safe:animate-pulse motion-reduce:animate-none",

            isLoginMode
              ? "right-1/3 top-16"
              : "left-1/3 top-16",
          ].join(" ")}
          style={{
            animationDelay:
              "500ms",
          }}
        />

        <div
          className={[
            "absolute h-24 w-24 rounded-[2rem] border border-white/10 bg-white/5",
            "transition-all duration-700 ease-in-out",
            "motion-reduce:transition-none",

            isLoginMode
              ? "bottom-8 left-8 rotate-12"
              : "bottom-8 right-8 -rotate-12",
          ].join(" ")}
          style={
            FLOATING_CARD_STYLE
          }
        />
      </div>

      <div className="relative z-10 h-full">
        <AuthSwitchContent
          mode={mode}
          controlsId={
            controlsId
          }
          disabled={disabled}
          onSwitchMode={
            onSwitchMode
          }
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/15 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
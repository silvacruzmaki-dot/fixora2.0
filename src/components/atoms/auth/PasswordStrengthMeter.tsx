"use client";

export type PasswordStrengthLevel =
  | "empty"
  | "weak"
  | "fair"
  | "good"
  | "strong";

export interface PasswordStrengthLabels {
  title: string;
  empty: string;
  weak: string;
  fair: string;
  good: string;
  strong: string;
}

export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  level: PasswordStrengthLevel;
  completedRequirements: number;
  totalRequirements: number;
}

export interface PasswordStrengthMeterProps {
  password: string;

  labels?: Partial<PasswordStrengthLabels>;

  showTitle?: boolean;
  showLabel?: boolean;

  className?: string;
}

const DEFAULT_LABELS: PasswordStrengthLabels = {
  title: "Seguridad de la contraseña",
  empty: "Sin contraseña",
  weak: "Débil",
  fair: "Regular",
  good: "Buena",
  strong: "Segura",
};

const ACTIVE_SEGMENT_CLASSES: Record<
  Exclude<PasswordStrengthLevel, "empty">,
  string
> = {
  weak:
    "bg-red-500",

  fair:
    "bg-amber-500",

  good:
    "bg-blue-500",

  strong:
    "bg-emerald-500",
};

const LABEL_CLASSES: Record<
  PasswordStrengthLevel,
  string
> = {
  empty:
    "text-zinc-500 dark:text-zinc-400",

  weak:
    "text-red-600 dark:text-red-400",

  fair:
    "text-amber-700 dark:text-amber-400",

  good:
    "text-blue-700 dark:text-blue-400",

  strong:
    "text-emerald-700 dark:text-emerald-400",
};

function hasUppercaseLetter(
  password: string,
): boolean {
  return /[A-Z]/.test(password);
}

function hasLowercaseLetter(
  password: string,
): boolean {
  return /[a-z]/.test(password);
}

function hasNumber(
  password: string,
): boolean {
  return /\d/.test(password);
}

function hasSpecialCharacter(
  password: string,
): boolean {
  return /[^A-Za-z0-9]/.test(
    password,
  );
}

/*
 * Este cálculo se exporta para que pueda reutilizarse
 * posteriormente en formularios o pruebas.
 */
export function evaluatePasswordStrength(
  password: string,
): PasswordStrengthResult {
  if (password.length === 0) {
    return {
      score: 0,
      level: "empty",
      completedRequirements: 0,
      totalRequirements: 5,
    };
  }

  const requirements = [
    password.length >= 8,

    password.length >= 12,

    hasUppercaseLetter(password) &&
      hasLowercaseLetter(password),

    hasNumber(password),

    hasSpecialCharacter(password),
  ];

  const completedRequirements =
    requirements.filter(Boolean).length;

  if (completedRequirements <= 1) {
    return {
      score: 1,
      level: "weak",
      completedRequirements,
      totalRequirements:
        requirements.length,
    };
  }

  if (completedRequirements === 2) {
    return {
      score: 2,
      level: "fair",
      completedRequirements,
      totalRequirements:
        requirements.length,
    };
  }

  if (
    completedRequirements === 3 ||
    completedRequirements === 4
  ) {
    return {
      score: 3,
      level: "good",
      completedRequirements,
      totalRequirements:
        requirements.length,
    };
  }

  return {
    score: 4,
    level: "strong",
    completedRequirements,
    totalRequirements:
      requirements.length,
  };
}

export function PasswordStrengthMeter({
  password,

  labels,

  showTitle = true,
  showLabel = true,

  className = "",
}: PasswordStrengthMeterProps) {
  const resolvedLabels: PasswordStrengthLabels =
    {
      ...DEFAULT_LABELS,
      ...labels,
    };

  const strength =
    evaluatePasswordStrength(
      password,
    );

  const strengthLabel =
    resolvedLabels[strength.level];

  const activeSegmentClass =
    strength.level === "empty"
      ? ""
      : ACTIVE_SEGMENT_CLASSES[
          strength.level
        ];

  return (
    <div
      className={`grid w-full gap-2 ${className}`}
    >
      {showTitle || showLabel ? (
        <div className="flex items-center justify-between gap-3">
          {showTitle ? (
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {resolvedLabels.title}
            </p>
          ) : (
            <span />
          )}

          {showLabel ? (
            <p
              className={[
                "text-xs font-semibold",
                LABEL_CLASSES[
                  strength.level
                ],
              ].join(" ")}
            >
              {strengthLabel}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-label={
          resolvedLabels.title
        }
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={
          strength.score
        }
        aria-valuetext={
          strengthLabel
        }
        className="grid grid-cols-4 gap-1.5"
      >
        {Array.from({
          length: 4,
        }).map((_, index) => {
          const isActive =
            index <
            strength.score;

          return (
            <span
              key={index}
              className={[
                "h-1.5 rounded-full transition-colors duration-300",

                isActive
                  ? activeSegmentClass
                  : "bg-zinc-200 dark:bg-zinc-700",
              ].join(" ")}
              aria-hidden="true"
            />
          );
        })}
      </div>

      <span className="sr-only">
        {strength.completedRequirements}{" "}
        de{" "}
        {strength.totalRequirements}{" "}
        requisitos de seguridad
        completados.
      </span>
    </div>
  );
}
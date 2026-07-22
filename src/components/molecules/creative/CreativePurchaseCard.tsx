"use client";

/*
 * Tarjeta de compra para publicaciones PAID
 * del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar el precio del diseño.
 * - Mostrar las instrucciones de pago mediante Yape.
 * - Solicitar inicio de sesión antes de comprar.
 * - Mostrar el estado de revisión del pago.
 * - Permitir copiar el número de Yape.
 * - Permitir registrar, reintentar o cancelar la compra.
 * - Habilitar la descarga únicamente después de la aprobación.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Validación del pago en el servidor.
 * - Acceso a Prisma.
 * - Descarga directa del archivo original.
 *
 * Todas las acciones son controladas por el componente padre.
 */

import {
  useId,
} from "react";

import type {
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import type {
  CreativeCurrency,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativePurchaseCardLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativePurchaseCardSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativePurchaseCardVariant =
  | "surface"
  | "soft"
  | "dark";

/* =========================================================
   MÉTODOS DE PAGO
   ========================================================= */

export type CreativePurchasePaymentMethod =
  | "YAPE";

/* =========================================================
   ESTADOS DE COMPRA
   ========================================================= */

export type CreativePurchaseStatus =
  | "IDLE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

/* =========================================================
   ACCIONES EN PROCESO
   ========================================================= */

export type CreativePurchaseLoadingAction =
  | "LOGIN"
  | "PURCHASE"
  | "COPY"
  | "RETRY"
  | "CANCEL"
  | "DOWNLOAD"
  | null;

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativePurchaseCardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  creativeItemId:
    string;

  designTitle:
    string;

  price:
    number;

  currency:
    CreativeCurrency;

  language?:
    CreativePurchaseCardLanguage;

  size?:
    CreativePurchaseCardSize;

  variant?:
    CreativePurchaseCardVariant;

  paymentMethod?:
    CreativePurchasePaymentMethod;

  paymentPhone?:
    string | null;

  paymentHolder?:
    string | null;

  paymentQrContent?:
    ReactNode;

  paymentInstructions?:
    string | null;

  paymentReference?:
    string | null;

  authenticated?:
    boolean;

  requireAuthentication?:
    boolean;

  purchaseStatus?:
    CreativePurchaseStatus;

  loadingAction?:
    CreativePurchaseLoadingAction;

  disabled?:
    boolean;

  canPurchase?:
    boolean;

  canRetry?:
    boolean;

  canCancel?:
    boolean;

  canDownload?:
    boolean;

  canCopyPaymentPhone?:
    boolean;

  onRequireAuthentication?:
    () => void | Promise<void>;

  onPurchase?:
    () => void | Promise<void>;

  onRetry?:
    () => void | Promise<void>;

  onCancelPurchase?:
    () => void | Promise<void>;

  onDownload?:
    () => void | Promise<void>;

  onCopyPaymentPhone?:
    (
      paymentPhone:
        string,
    ) => void | Promise<void>;

  heading?:
    string | null;

  description?:
    string | null;

  successMessage?:
    string | null;

  errorMessage?:
    string | null;

  showDesignTitle?:
    boolean;

  showPaymentDetails?:
    boolean;

  showPaymentQr?:
    boolean;

  showPaymentSteps?:
    boolean;

  showPaymentReference?:
    boolean;

  showCancelButton?:
    boolean;

  headerContent?:
    ReactNode;

  paymentContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  headerClassName?:
    string;

  priceClassName?:
    string;

  paymentClassName?:
    string;

  actionsClassName?:
    string;

  primaryButtonClassName?:
    string;

  secondaryButtonClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_PURCHASE_CARD_COPY = {
  es: {
    group:
      "Compra del diseño",

    heading:
      "Compra este diseño",

    description:
      "Realiza el pago mediante Yape. La descarga original se habilitará después de que un administrador confirme el pago.",

    design:
      "Diseño",

    price:
      "Precio",

    paymentMethod:
      "Método de pago",

    yape:
      "Yape",

    paymentPhone:
      "Número de Yape",

    paymentHolder:
      "Titular",

    copy:
      "Copiar número",

    copying:
      "Copiando...",

    reference:
      "Referencia de compra",

    login:
      "Iniciar sesión para comprar",

    loggingIn:
      "Abriendo inicio de sesión...",

    purchase:
      "Registrar solicitud de compra",

    purchasing:
      "Registrando compra...",

    retry:
      "Volver a intentar",

    retrying:
      "Preparando nuevo intento...",

    cancel:
      "Cancelar solicitud",

    cancelling:
      "Cancelando solicitud...",

    download:
      "Descargar archivo original",

    downloading:
      "Preparando descarga...",

    idle:
      "Disponible para comprar",

    pending:
      "Pago pendiente de revisión",

    approved:
      "Pago aprobado",

    rejected:
      "Pago rechazado",

    cancelled:
      "Solicitud cancelada",

    pendingMessage:
      "Tu solicitud fue registrada. Un administrador revisará el comprobante antes de habilitar la descarga.",

    approvedMessage:
      "El pago fue aprobado. Ya puedes descargar el archivo original del diseño.",

    rejectedMessage:
      "El pago no pudo ser aprobado. Revisa los datos enviados y vuelve a intentarlo.",

    cancelledMessage:
      "La solicitud fue cancelada. Puedes iniciar una nueva compra cuando lo necesites.",

    authenticationMessage:
      "Debes iniciar sesión para registrar la compra y conservar el acceso al diseño.",

    stepOne:
      "Realiza el pago",

    stepOneDescription:
      "Envía el importe indicado mediante Yape.",

    stepTwo:
      "Validación administrativa",

    stepTwoDescription:
      "Un administrador revisará el pago registrado.",

    stepThree:
      "Descarga habilitada",

    stepThreeDescription:
      "El archivo original estará disponible después de la aprobación.",

    unavailable:
      "Acción no disponible",
  },

  en: {
    group:
      "Design purchase",

    heading:
      "Purchase this design",

    description:
      "Pay using Yape. The original download will be enabled after an administrator confirms the payment.",

    design:
      "Design",

    price:
      "Price",

    paymentMethod:
      "Payment method",

    yape:
      "Yape",

    paymentPhone:
      "Yape number",

    paymentHolder:
      "Account holder",

    copy:
      "Copy number",

    copying:
      "Copying...",

    reference:
      "Purchase reference",

    login:
      "Sign in to purchase",

    loggingIn:
      "Opening sign in...",

    purchase:
      "Register purchase request",

    purchasing:
      "Registering purchase...",

    retry:
      "Try again",

    retrying:
      "Preparing another attempt...",

    cancel:
      "Cancel request",

    cancelling:
      "Cancelling request...",

    download:
      "Download original file",

    downloading:
      "Preparing download...",

    idle:
      "Available for purchase",

    pending:
      "Payment pending review",

    approved:
      "Payment approved",

    rejected:
      "Payment rejected",

    cancelled:
      "Request cancelled",

    pendingMessage:
      "Your request was registered. An administrator will review the payment before enabling the download.",

    approvedMessage:
      "The payment was approved. You can now download the original design file.",

    rejectedMessage:
      "The payment could not be approved. Review the submitted information and try again.",

    cancelledMessage:
      "The request was cancelled. You can start a new purchase whenever needed.",

    authenticationMessage:
      "You must sign in to register the purchase and keep access to the design.",

    stepOne:
      "Complete the payment",

    stepOneDescription:
      "Send the indicated amount using Yape.",

    stepTwo:
      "Administrative review",

    stepTwoDescription:
      "An administrator will review the registered payment.",

    stepThree:
      "Download enabled",

    stepThreeDescription:
      "The original file will be available after approval.",

    unavailable:
      "Action unavailable",
  },
} as const;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_PURCHASE_CARD_BASE_CLASSES = [
  "w-full",
  "min-w-0",
  "overflow-hidden",
  "border",
  "transition-colors",
  "duration-200",
].join(
  " ",
);

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_PURCHASE_CARD_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "shadow-[0_18px_52px_rgba(15,23,42,0.10)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/88",
    "dark:shadow-[0_20px_58px_rgba(0,0,0,0.34)]",
  ].join(
    " ",
  ),

  soft: [
    "border-amber-500/20",
    "bg-amber-500/[0.05]",

    "dark:border-amber-400/20",
    "dark:bg-amber-400/[0.05]",
  ].join(
    " ",
  ),

  dark: [
    "border-white/10",
    "bg-black/75",
    "text-white",
    "shadow-[0_20px_60px_rgba(0,0,0,0.42)]",
    "backdrop-blur-xl",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativePurchaseCardVariant,
  string
>;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_PURCHASE_CARD_SIZE_CLASSES = {
  sm: {
    root:
      "rounded-2xl",

    section:
      "p-4",

    title:
      "text-base",

    description:
      "text-xs leading-5",

    price:
      "text-2xl",

    button:
      "min-h-9 rounded-lg px-3 py-2 text-xs",

    detail:
      "rounded-xl p-3",

    step:
      "text-xs",
  },

  md: {
    root:
      "rounded-2xl",

    section:
      "p-5",

    title:
      "text-lg",

    description:
      "text-sm leading-6",

    price:
      "text-3xl",

    button:
      "min-h-11 rounded-xl px-4 py-3 text-sm",

    detail:
      "rounded-xl p-4",

    step:
      "text-sm",
  },

  lg: {
    root:
      "rounded-3xl",

    section:
      "p-6",

    title:
      "text-xl",

    description:
      "text-base leading-7",

    price:
      "text-4xl",

    button:
      "min-h-12 rounded-xl px-5 py-3.5 text-base",

    detail:
      "rounded-2xl p-5",

    step:
      "text-base",
  },
} as const satisfies Record<
  CreativePurchaseCardSize,
  {
    root:
      string;

    section:
      string;

    title:
      string;

    description:
      string;

    price:
      string;

    button:
      string;

    detail:
      string;

    step:
      string;
  }
>;

/* =========================================================
   ESTADOS
   ========================================================= */

const CREATIVE_PURCHASE_STATUS_CLASSES = {
  IDLE: [
    "border-amber-500/25",
    "bg-amber-500/10",
    "text-amber-700",

    "dark:border-amber-400/25",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  PENDING: [
    "border-cyan-500/25",
    "bg-cyan-500/10",
    "text-cyan-700",

    "dark:border-cyan-400/25",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(
    " ",
  ),

  APPROVED: [
    "border-emerald-500/25",
    "bg-emerald-500/10",
    "text-emerald-700",

    "dark:border-emerald-400/25",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  REJECTED: [
    "border-red-500/25",
    "bg-red-500/10",
    "text-red-700",

    "dark:border-red-400/25",
    "dark:bg-red-400/10",
    "dark:text-red-300",
  ].join(
    " ",
  ),

  CANCELLED: [
    "border-zinc-300",
    "bg-zinc-100",
    "text-zinc-600",

    "dark:border-white/10",
    "dark:bg-white/[0.06]",
    "dark:text-zinc-300",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativePurchaseStatus,
  string
>;

/* =========================================================
   BOTONES
   ========================================================= */

const CREATIVE_PURCHASE_BUTTON_BASE_CLASSES = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2.5",
  "border",
  "font-bold",
  "outline-none",
  "transition-all",
  "duration-200",

  "enabled:hover:-translate-y-0.5",
  "enabled:active:translate-y-0",
  "enabled:active:scale-[0.98]",

  "focus-visible:ring-2",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white",

  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-45",

  "dark:focus-visible:ring-offset-zinc-950",

  "motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(
  " ",
);

const CREATIVE_PURCHASE_PRIMARY_BUTTON_CLASSES = [
  "border-amber-500/30",
  "bg-gradient-to-r",
  "from-amber-400",
  "to-orange-500",
  "text-zinc-950",
  "shadow-[0_10px_28px_rgba(245,158,11,0.24)]",

  "enabled:hover:from-amber-300",
  "enabled:hover:to-orange-400",
  "enabled:hover:shadow-[0_14px_34px_rgba(245,158,11,0.32)]",

  "focus-visible:ring-amber-500/60",

  "dark:border-amber-300/20",
].join(
  " ",
);

const CREATIVE_PURCHASE_SUCCESS_BUTTON_CLASSES = [
  "border-emerald-500/30",
  "bg-gradient-to-r",
  "from-emerald-500",
  "to-green-600",
  "text-white",
  "shadow-[0_10px_28px_rgba(16,185,129,0.24)]",

  "enabled:hover:from-emerald-400",
  "enabled:hover:to-emerald-600",
  "enabled:hover:shadow-[0_14px_34px_rgba(16,185,129,0.32)]",

  "focus-visible:ring-emerald-500/60",

  "dark:border-emerald-300/20",
].join(
  " ",
);

const CREATIVE_PURCHASE_DANGER_BUTTON_CLASSES = [
  "border-red-500/25",
  "bg-red-500/10",
  "text-red-700",

  "enabled:hover:border-red-500/40",
  "enabled:hover:bg-red-500",
  "enabled:hover:text-white",

  "focus-visible:ring-red-500/50",

  "dark:border-red-400/25",
  "dark:bg-red-400/10",
  "dark:text-red-300",

  "dark:enabled:hover:bg-red-500",
  "dark:enabled:hover:text-white",
].join(
  " ",
);

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativePurchaseCardClasses(
  ...classes:
    Array<
      string | false | null | undefined
    >
): string {
  return classes
    .filter(
      Boolean,
    )
    .join(
      " ",
    );
}

function normalizeCreativePurchaseText(
  value:
    string | null | undefined,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function normalizeCreativePurchasePrice(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <
      0
  ) {
    return 0;
  }

  return value;
}

function runCreativePurchaseAction(
  action:
    (() => void | Promise<void>) |
    undefined,
): void {
  void action?.();
}

/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

export function formatCreativePurchasePrice(
  price:
    number,
  currency:
    CreativeCurrency,
  language:
    CreativePurchaseCardLanguage = "es",
): string {
  const normalizedPrice =
    normalizeCreativePurchasePrice(
      price,
    );

  const locale =
    language ===
      "es"
      ? "es-PE"
      : "en-US";

  try {
    return new Intl.NumberFormat(
      locale,
      {
        style:
          "currency",

        currency,

        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      },
    ).format(
      normalizedPrice,
    );
  } catch {
    return `${currency} ${normalizedPrice.toFixed(2)}`;
  }
}

/* =========================================================
   ETIQUETA DEL ESTADO
   ========================================================= */

function getCreativePurchaseStatusLabel(
  status:
    CreativePurchaseStatus,
  language:
    CreativePurchaseCardLanguage,
): string {
  const copy =
    CREATIVE_PURCHASE_CARD_COPY[
      language
    ];

  switch (
    status
  ) {
    case "PENDING":
      return copy.pending;

    case "APPROVED":
      return copy.approved;

    case "REJECTED":
      return copy.rejected;

    case "CANCELLED":
      return copy.cancelled;

    default:
      return copy.idle;
  }
}

/* =========================================================
   MENSAJE DEL ESTADO
   ========================================================= */

function getCreativePurchaseStatusMessage(
  status:
    CreativePurchaseStatus,
  language:
    CreativePurchaseCardLanguage,
): string {
  const copy =
    CREATIVE_PURCHASE_CARD_COPY[
      language
    ];

  switch (
    status
  ) {
    case "PENDING":
      return copy.pendingMessage;

    case "APPROVED":
      return copy.approvedMessage;

    case "REJECTED":
      return copy.rejectedMessage;

    case "CANCELLED":
      return copy.cancelledMessage;

    default:
      return "";
  }
}

/* =========================================================
   PROGRESO
   ========================================================= */

function getCreativePurchaseStepState(
  step:
    1 | 2 | 3,
  status:
    CreativePurchaseStatus,
): "PENDING" | "ACTIVE" | "COMPLETE" | "ERROR" {
  if (
    status ===
    "APPROVED"
  ) {
    return "COMPLETE";
  }

  if (
    status ===
    "REJECTED"
  ) {
    if (
      step ===
      1
    ) {
      return "COMPLETE";
    }

    if (
      step ===
      2
    ) {
      return "ERROR";
    }

    return "PENDING";
  }

  if (
    status ===
    "PENDING"
  ) {
    if (
      step ===
      1
    ) {
      return "COMPLETE";
    }

    if (
      step ===
      2
    ) {
      return "ACTIVE";
    }

    return "PENDING";
  }

  if (
    status ===
    "CANCELLED"
  ) {
    return "PENDING";
  }

  if (
    step ===
    1
  ) {
    return "ACTIVE";
  }

  return "PENDING";
}

const CREATIVE_PURCHASE_STEP_CLASSES = {
  PENDING: [
    "border-zinc-200",
    "bg-zinc-100",
    "text-zinc-500",

    "dark:border-white/10",
    "dark:bg-white/[0.05]",
    "dark:text-zinc-400",
  ].join(
    " ",
  ),

  ACTIVE: [
    "border-amber-500/30",
    "bg-amber-500/10",
    "text-amber-700",

    "dark:border-amber-400/30",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  COMPLETE: [
    "border-emerald-500/30",
    "bg-emerald-500/10",
    "text-emerald-700",

    "dark:border-emerald-400/30",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  ERROR: [
    "border-red-500/30",
    "bg-red-500/10",
    "text-red-700",

    "dark:border-red-400/30",
    "dark:bg-red-400/10",
    "dark:text-red-300",
  ].join(
    " ",
  ),
} as const;

/* =========================================================
   ICONOS
   ========================================================= */

function CreativePurchaseYapeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="3"
      />

      <path d="M9 6h6" />

      <path d="M9 10h6" />

      <path d="M9 14h3" />

      <circle
        cx="12"
        cy="18"
        r="1"
      />
    </svg>
  );
}

function CreativePurchaseCopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
      />

      <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function CreativePurchaseLoginIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <path d="M10 17l5-5-5-5" />

      <path d="M15 12H3" />

      <path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    </svg>
  );
}

function CreativePurchaseCartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <circle
        cx="9"
        cy="20"
        r="1"
      />

      <circle
        cx="18"
        cy="20"
        r="1"
      />

      <path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7" />
    </svg>
  );
}

function CreativePurchaseRetryIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />

      <path d="M3 4v6h6" />
    </svg>
  );
}

function CreativePurchaseCancelIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="m9 9 6 6" />

      <path d="m15 9-6 6" />
    </svg>
  );
}

function CreativePurchaseDownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <path d="M12 3v12" />

      <path d="m7 10 5 5 5-5" />

      <path d="M5 21h14" />
    </svg>
  );
}

function CreativePurchaseCheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m5 10 3 3 7-7" />
    </svg>
  );
}

function CreativePurchaseClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle
        cx="10"
        cy="10"
        r="7"
      />

      <path d="M10 6v4l3 2" />
    </svg>
  );
}

function CreativePurchaseErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle
        cx="10"
        cy="10"
        r="7"
      />

      <path d="M10 6v5" />

      <path d="M10 14h.01" />
    </svg>
  );
}

/* =========================================================
   PASO DE COMPRA
   ========================================================= */

interface CreativePurchaseStepProps {
  number:
    1 | 2 | 3;

  title:
    string;

  description:
    string;

  state:
    "PENDING" | "ACTIVE" | "COMPLETE" | "ERROR";

  size:
    CreativePurchaseCardSize;
}

function CreativePurchaseStep({
  number,
  title,
  description,
  state,
  size,
}: CreativePurchaseStepProps) {
  return (
    <li className="flex min-w-0 items-start gap-3">
      <span
        aria-hidden="true"
        className={
          joinCreativePurchaseCardClasses(
            "flex h-8 w-8 shrink-0 items-center justify-center",
            "rounded-full border text-xs font-black",

            CREATIVE_PURCHASE_STEP_CLASSES[
              state
            ],
          )
        }
      >
        {state ===
        "COMPLETE" ? (
          <CreativePurchaseCheckIcon />
        ) : state ===
          "ERROR" ? (
          <CreativePurchaseErrorIcon />
        ) : state ===
          "ACTIVE" ? (
          <CreativePurchaseClockIcon />
        ) : (
          number
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={
            joinCreativePurchaseCardClasses(
              "font-bold text-zinc-900",
              "dark:text-white",

              CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                size
              ].step,
            )
          }
        >
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </li>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativePurchaseCard({
  creativeItemId,

  designTitle,

  price,

  currency,

  language =
    "es",

  size =
    "md",

  variant =
    "surface",

  paymentMethod =
    "YAPE",

  paymentPhone =
    null,

  paymentHolder =
    null,

  paymentQrContent =
    null,

  paymentInstructions =
    null,

  paymentReference =
    null,

  authenticated =
    false,

  requireAuthentication =
    true,

  purchaseStatus =
    "IDLE",

  loadingAction =
    null,

  disabled =
    false,

  canPurchase =
    true,

  canRetry =
    true,

  canCancel =
    true,

  canDownload =
    false,

  canCopyPaymentPhone =
    true,

  onRequireAuthentication,

  onPurchase,

  onRetry,

  onCancelPurchase,

  onDownload,

  onCopyPaymentPhone,

  heading =
    null,

  description =
    null,

  successMessage =
    null,

  errorMessage =
    null,

  showDesignTitle =
    true,

  showPaymentDetails =
    true,

  showPaymentQr =
    true,

  showPaymentSteps =
    true,

  showPaymentReference =
    true,

  showCancelButton =
    true,

  headerContent =
    null,

  paymentContent =
    null,

  footerContent =
    null,

  headerClassName,

  priceClassName,

  paymentClassName,

  actionsClassName,

  primaryButtonClassName,

  secondaryButtonClassName,

  className,

  onClick,

  "aria-label":
    ariaLabel,

  ...containerProps
}: CreativePurchaseCardProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_PURCHASE_CARD_COPY[
      language
    ];

  const normalizedCreativeItemId =
    normalizeCreativePurchaseText(
      creativeItemId,
    );

  const normalizedDesignTitle =
    normalizeCreativePurchaseText(
      designTitle,
    ) ||
    "FIXORA";

  const normalizedPaymentPhone =
    normalizeCreativePurchaseText(
      paymentPhone,
    );

  const normalizedPaymentHolder =
    normalizeCreativePurchaseText(
      paymentHolder,
    );

  const normalizedPaymentReference =
    normalizeCreativePurchaseText(
      paymentReference,
    );

  const normalizedSuccessMessage =
    normalizeCreativePurchaseText(
      successMessage,
    );

  const normalizedErrorMessage =
    normalizeCreativePurchaseText(
      errorMessage,
    );

  const resolvedHeading =
    normalizeCreativePurchaseText(
      heading,
    ) ||
    copy.heading;

  const resolvedDescription =
    normalizeCreativePurchaseText(
      description,
    ) ||
    copy.description;

  const resolvedPaymentInstructions =
    normalizeCreativePurchaseText(
      paymentInstructions,
    );

  const formattedPrice =
    formatCreativePurchasePrice(
      price,
      currency,
      language,
    );

  const authenticationRequired =
    requireAuthentication &&
    !authenticated;

  const anyActionLoading =
    loadingAction !==
    null;

  const loginLoading =
    loadingAction ===
    "LOGIN";

  const purchaseLoading =
    loadingAction ===
    "PURCHASE";

  const copyLoading =
    loadingAction ===
    "COPY";

  const retryLoading =
    loadingAction ===
    "RETRY";

  const cancelLoading =
    loadingAction ===
    "CANCEL";

  const downloadLoading =
    loadingAction ===
    "DOWNLOAD";

  const statusLabel =
    getCreativePurchaseStatusLabel(
      purchaseStatus,
      language,
    );

  const automaticStatusMessage =
    getCreativePurchaseStatusMessage(
      purchaseStatus,
      language,
    );

  const statusMessage =
    purchaseStatus ===
      "APPROVED" &&
    normalizedSuccessMessage
      ? normalizedSuccessMessage
      : purchaseStatus ===
          "REJECTED" &&
        normalizedErrorMessage
        ? normalizedErrorMessage
        : automaticStatusMessage;

  const shouldShowPaymentDetails =
    showPaymentDetails &&
    purchaseStatus !==
      "APPROVED";

  const shouldShowPurchaseButton =
    purchaseStatus ===
      "IDLE";

  const shouldShowRetryButton =
    purchaseStatus ===
      "REJECTED" ||
    purchaseStatus ===
      "CANCELLED";

  const shouldShowCancelButton =
    showCancelButton &&
    purchaseStatus ===
      "PENDING";

  const shouldShowDownloadButton =
    purchaseStatus ===
      "APPROVED";

  const purchaseCardId =
    `creative-purchase-${generatedId}`;

  const descriptionId =
    `${purchaseCardId}-description`;

  const handleContainerClick =
    (
      event:
        MouseEvent<HTMLDivElement>,
    ): void => {
      event.stopPropagation();

      onClick?.(
        event,
      );
    };

  const handleCopyPaymentPhone =
    (): void => {
      if (
        disabled ||
        anyActionLoading ||
        !normalizedPaymentPhone ||
        !canCopyPaymentPhone ||
        !onCopyPaymentPhone
      ) {
        return;
      }

      void onCopyPaymentPhone(
        normalizedPaymentPhone,
      );
    };

  return (
    <div
      {...containerProps}
      id={
        purchaseCardId
      }
      role="group"
      aria-label={
        ariaLabel ??
        copy.group
      }
      aria-describedby={
        descriptionId
      }
      aria-busy={
        anyActionLoading ||
        undefined
      }
      data-creative-purchase-card=""
      data-creative-item-id={
        normalizedCreativeItemId
      }
      data-status={
        purchaseStatus
      }
      data-payment-method={
        paymentMethod
      }
      data-authenticated={
        authenticated
          ? "true"
          : "false"
      }
      data-size={
        size
      }
      data-variant={
        variant
      }
      onClick={
        handleContainerClick
      }
      className={
        joinCreativePurchaseCardClasses(
          CREATIVE_PURCHASE_CARD_BASE_CLASSES,

          CREATIVE_PURCHASE_CARD_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
            size
          ].root,

          disabled &&
            "opacity-65",

          className,
        )
      }
    >
      <div
        className={
          joinCreativePurchaseCardClasses(
            CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
              size
            ].section,

            headerClassName,
          )
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2
              className={
                joinCreativePurchaseCardClasses(
                  "font-black text-zinc-950",
                  "dark:text-white",

                  CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                    size
                  ].title,
                )
              }
            >
              {resolvedHeading}
            </h2>

            <p
              id={
                descriptionId
              }
              className={
                joinCreativePurchaseCardClasses(
                  "mt-2 text-zinc-600",
                  "dark:text-zinc-400",

                  CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                    size
                  ].description,
                )
              }
            >
              {resolvedDescription}
            </p>
          </div>

          {headerContent}
        </div>

        {showDesignTitle ? (
          <div className="mt-5 border-t border-zinc-200/80 pt-4 dark:border-white/10">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
              {copy.design}
            </span>

            <p className="mt-1 truncate font-bold text-zinc-900 dark:text-white">
              {normalizedDesignTitle}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
              {copy.price}
            </span>

            <p
              className={
                joinCreativePurchaseCardClasses(
                  "mt-1 font-black tabular-nums",
                  "text-amber-600",
                  "dark:text-amber-300",

                  CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                    size
                  ].price,

                  priceClassName,
                )
              }
            >
              {formattedPrice}
            </p>
          </div>

          <span
            className={
              joinCreativePurchaseCardClasses(
                "inline-flex items-center gap-2",
                "rounded-full border px-3 py-2",
                "text-xs font-bold",

                CREATIVE_PURCHASE_STATUS_CLASSES[
                  purchaseStatus
                ],
              )
            }
          >
            {purchaseStatus ===
            "APPROVED" ? (
              <CreativePurchaseCheckIcon />
            ) : purchaseStatus ===
              "REJECTED" ? (
              <CreativePurchaseErrorIcon />
            ) : (
              <CreativePurchaseClockIcon />
            )}

            {statusLabel}
          </span>
        </div>
      </div>

      {authenticationRequired ? (
        <div
          className={
            joinCreativePurchaseCardClasses(
              "border-t border-zinc-200/80",
              "bg-amber-500/[0.04]",
              "dark:border-white/10",
              "dark:bg-amber-400/[0.04]",

              CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                size
              ].section,
            )
          }
        >
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {copy.authenticationMessage}
          </p>

          <button
            type="button"
            aria-busy={
              loginLoading ||
              undefined
            }
            disabled={
              disabled ||
              !onRequireAuthentication ||
              (
                anyActionLoading &&
                !loginLoading
              )
            }
            onClick={
              () => {
                runCreativePurchaseAction(
                  onRequireAuthentication,
                );
              }
            }
            className={
              joinCreativePurchaseCardClasses(
                CREATIVE_PURCHASE_BUTTON_BASE_CLASSES,
                CREATIVE_PURCHASE_PRIMARY_BUTTON_CLASSES,

                CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                  size
                ].button,

                "mt-4 w-full",

                primaryButtonClassName,
              )
            }
          >
            {loginLoading ? (
              <CreativeSpinner
                decorative
                size="sm"
                variant="neutral"
              />
            ) : (
              <CreativePurchaseLoginIcon />
            )}

            <span>
              {loginLoading
                ? copy.loggingIn
                : copy.login}
            </span>
          </button>
        </div>
      ) : (
        <>
          {shouldShowPaymentDetails ? (
            <div
              className={
                joinCreativePurchaseCardClasses(
                  "border-t border-zinc-200/80",
                  "dark:border-white/10",

                  CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                    size
                  ].section,

                  paymentClassName,
                )
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  aria-hidden="true"
                  className={[
                    "flex h-10 w-10 items-center justify-center",
                    "rounded-xl",
                    "border border-violet-500/20",
                    "bg-violet-500/10",
                    "text-violet-700",

                    "dark:border-violet-400/20",
                    "dark:bg-violet-400/10",
                    "dark:text-violet-300",
                  ].join(
                    " ",
                  )}
                >
                  <CreativePurchaseYapeIcon />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                    {copy.paymentMethod}
                  </p>

                  <p className="font-black text-zinc-950 dark:text-white">
                    {copy.yape}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="space-y-3">
                  {normalizedPaymentPhone ? (
                    <div
                      className={
                        joinCreativePurchaseCardClasses(
                          "border border-zinc-200/90",
                          "bg-zinc-50/80",
                          "dark:border-white/10",
                          "dark:bg-white/[0.04]",

                          CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                            size
                          ].detail,
                        )
                      }
                    >
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {copy.paymentPhone}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <strong className="text-lg font-black tracking-wide text-zinc-950 dark:text-white">
                          {normalizedPaymentPhone}
                        </strong>

                        <button
                          type="button"
                          aria-busy={
                            copyLoading ||
                            undefined
                          }
                          disabled={
                            disabled ||
                            !canCopyPaymentPhone ||
                            !onCopyPaymentPhone ||
                            (
                              anyActionLoading &&
                              !copyLoading
                            )
                          }
                          onClick={
                            handleCopyPaymentPhone
                          }
                          className={[
                            "inline-flex min-h-9 items-center justify-center gap-2",
                            "rounded-lg border border-violet-500/20",
                            "bg-violet-500/10 px-3 py-2",
                            "text-xs font-bold text-violet-700",
                            "outline-none transition-colors duration-150",

                            "enabled:hover:bg-violet-500/20",

                            "focus-visible:ring-2",
                            "focus-visible:ring-violet-500/50",

                            "disabled:cursor-not-allowed",
                            "disabled:opacity-45",

                            "dark:border-violet-400/20",
                            "dark:bg-violet-400/10",
                            "dark:text-violet-300",
                          ].join(
                            " ",
                          )}
                        >
                          {copyLoading ? (
                            <CreativeSpinner
                              decorative
                              size="sm"
                              variant="neutral"
                            />
                          ) : (
                            <CreativePurchaseCopyIcon />
                          )}

                          <span>
                            {copyLoading
                              ? copy.copying
                              : copy.copy}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {normalizedPaymentHolder ? (
                    <div
                      className={
                        joinCreativePurchaseCardClasses(
                          "border border-zinc-200/90",
                          "bg-zinc-50/80",
                          "dark:border-white/10",
                          "dark:bg-white/[0.04]",

                          CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                            size
                          ].detail,
                        )
                      }
                    >
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {copy.paymentHolder}
                      </p>

                      <p className="mt-1 font-bold text-zinc-900 dark:text-white">
                        {normalizedPaymentHolder}
                      </p>
                    </div>
                  ) : null}

                  {resolvedPaymentInstructions ? (
                    <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {resolvedPaymentInstructions}
                    </p>
                  ) : null}

                  {showPaymentReference &&
                  normalizedPaymentReference ? (
                    <div
                      className={
                        joinCreativePurchaseCardClasses(
                          "border border-cyan-500/20",
                          "bg-cyan-500/[0.07]",
                          "dark:border-cyan-400/20",
                          "dark:bg-cyan-400/[0.07]",

                          CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                            size
                          ].detail,
                        )
                      }
                    >
                      <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                        {copy.reference}
                      </p>

                      <p className="mt-1 break-all font-mono text-sm font-bold text-zinc-900 dark:text-white">
                        {normalizedPaymentReference}
                      </p>
                    </div>
                  ) : null}
                </div>

                {showPaymentQr &&
                paymentQrContent ? (
                  <div
                    className={[
                      "flex shrink-0 items-center justify-center",
                      "rounded-2xl border border-zinc-200/90",
                      "bg-white p-3",
                      "shadow-[0_10px_28px_rgba(15,23,42,0.08)]",

                      "dark:border-white/10",
                    ].join(
                      " ",
                    )}
                  >
                    {paymentQrContent}
                  </div>
                ) : null}
              </div>

              {paymentContent}
            </div>
          ) : null}

          {statusMessage ? (
            <div
              role={
                purchaseStatus ===
                  "REJECTED"
                  ? "alert"
                  : "status"
              }
              className={
                joinCreativePurchaseCardClasses(
                  "border-t border-zinc-200/80",
                  "dark:border-white/10",

                  CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                    size
                  ].section,
                )
              }
            >
              <div
                className={
                  joinCreativePurchaseCardClasses(
                    "rounded-xl border p-4",
                    "text-sm leading-6",

                    CREATIVE_PURCHASE_STATUS_CLASSES[
                      purchaseStatus
                    ],
                  )
                }
              >
                {statusMessage}
              </div>
            </div>
          ) : null}

          {showPaymentSteps ? (
            <div
              className={
                joinCreativePurchaseCardClasses(
                  "border-t border-zinc-200/80",
                  "dark:border-white/10",

                  CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                    size
                  ].section,
                )
              }
            >
              <ol className="space-y-4">
                <CreativePurchaseStep
                  number={1}
                  title={
                    copy.stepOne
                  }
                  description={
                    copy.stepOneDescription
                  }
                  state={
                    getCreativePurchaseStepState(
                      1,
                      purchaseStatus,
                    )
                  }
                  size={
                    size
                  }
                />

                <CreativePurchaseStep
                  number={2}
                  title={
                    copy.stepTwo
                  }
                  description={
                    copy.stepTwoDescription
                  }
                  state={
                    getCreativePurchaseStepState(
                      2,
                      purchaseStatus,
                    )
                  }
                  size={
                    size
                  }
                />

                <CreativePurchaseStep
                  number={3}
                  title={
                    copy.stepThree
                  }
                  description={
                    copy.stepThreeDescription
                  }
                  state={
                    getCreativePurchaseStepState(
                      3,
                      purchaseStatus,
                    )
                  }
                  size={
                    size
                  }
                />
              </ol>
            </div>
          ) : null}

          <div
            className={
              joinCreativePurchaseCardClasses(
                "flex flex-wrap items-center gap-3",
                "border-t border-zinc-200/80",
                "dark:border-white/10",

                CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                  size
                ].section,

                actionsClassName,
              )
            }
          >
            {shouldShowPurchaseButton ? (
              <button
                type="button"
                aria-busy={
                  purchaseLoading ||
                  undefined
                }
                disabled={
                  disabled ||
                  !canPurchase ||
                  !onPurchase ||
                  (
                    anyActionLoading &&
                    !purchaseLoading
                  )
                }
                title={
                  canPurchase
                    ? copy.purchase
                    : copy.unavailable
                }
                onClick={
                  () => {
                    runCreativePurchaseAction(
                      onPurchase,
                    );
                  }
                }
                className={
                  joinCreativePurchaseCardClasses(
                    CREATIVE_PURCHASE_BUTTON_BASE_CLASSES,
                    CREATIVE_PURCHASE_PRIMARY_BUTTON_CLASSES,

                    CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                      size
                    ].button,

                    "min-w-0 flex-1",

                    primaryButtonClassName,
                  )
                }
              >
                {purchaseLoading ? (
                  <CreativeSpinner
                    decorative
                    size="sm"
                    variant="neutral"
                  />
                ) : (
                  <CreativePurchaseCartIcon />
                )}

                <span className="truncate">
                  {purchaseLoading
                    ? copy.purchasing
                    : copy.purchase}
                </span>
              </button>
            ) : null}

            {shouldShowRetryButton ? (
              <button
                type="button"
                aria-busy={
                  retryLoading ||
                  undefined
                }
                disabled={
                  disabled ||
                  !canRetry ||
                  !onRetry ||
                  (
                    anyActionLoading &&
                    !retryLoading
                  )
                }
                onClick={
                  () => {
                    runCreativePurchaseAction(
                      onRetry,
                    );
                  }
                }
                className={
                  joinCreativePurchaseCardClasses(
                    CREATIVE_PURCHASE_BUTTON_BASE_CLASSES,
                    CREATIVE_PURCHASE_PRIMARY_BUTTON_CLASSES,

                    CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                      size
                    ].button,

                    "min-w-0 flex-1",

                    primaryButtonClassName,
                  )
                }
              >
                {retryLoading ? (
                  <CreativeSpinner
                    decorative
                    size="sm"
                    variant="neutral"
                  />
                ) : (
                  <CreativePurchaseRetryIcon />
                )}

                <span>
                  {retryLoading
                    ? copy.retrying
                    : copy.retry}
                </span>
              </button>
            ) : null}

            {shouldShowDownloadButton ? (
              <button
                type="button"
                aria-busy={
                  downloadLoading ||
                  undefined
                }
                disabled={
                  disabled ||
                  !canDownload ||
                  !onDownload ||
                  (
                    anyActionLoading &&
                    !downloadLoading
                  )
                }
                onClick={
                  () => {
                    runCreativePurchaseAction(
                      onDownload,
                    );
                  }
                }
                className={
                  joinCreativePurchaseCardClasses(
                    CREATIVE_PURCHASE_BUTTON_BASE_CLASSES,
                    CREATIVE_PURCHASE_SUCCESS_BUTTON_CLASSES,

                    CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                      size
                    ].button,

                    "min-w-0 flex-1",

                    primaryButtonClassName,
                  )
                }
              >
                {downloadLoading ? (
                  <CreativeSpinner
                    decorative
                    size="sm"
                    variant="light"
                  />
                ) : (
                  <CreativePurchaseDownloadIcon />
                )}

                <span>
                  {downloadLoading
                    ? copy.downloading
                    : copy.download}
                </span>
              </button>
            ) : null}

            {shouldShowCancelButton ? (
              <button
                type="button"
                aria-busy={
                  cancelLoading ||
                  undefined
                }
                disabled={
                  disabled ||
                  !canCancel ||
                  !onCancelPurchase ||
                  (
                    anyActionLoading &&
                    !cancelLoading
                  )
                }
                onClick={
                  () => {
                    runCreativePurchaseAction(
                      onCancelPurchase,
                    );
                  }
                }
                className={
                  joinCreativePurchaseCardClasses(
                    CREATIVE_PURCHASE_BUTTON_BASE_CLASSES,
                    CREATIVE_PURCHASE_DANGER_BUTTON_CLASSES,

                    CREATIVE_PURCHASE_CARD_SIZE_CLASSES[
                      size
                    ].button,

                    secondaryButtonClassName,
                  )
                }
              >
                {cancelLoading ? (
                  <CreativeSpinner
                    decorative
                    size="sm"
                    variant="neutral"
                  />
                ) : (
                  <CreativePurchaseCancelIcon />
                )}

                <span>
                  {cancelLoading
                    ? copy.cancelling
                    : copy.cancel}
                </span>
              </button>
            ) : null}

            {footerContent}
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativePurchaseCard;
"use client";

/*
 * Tarjeta de solicitud de diseño personalizado
 * para publicaciones PORTFOLIO del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Solicitar un diseño similar.
 * - Solicitar un diseño completamente personalizado.
 * - Registrar descripción, presupuesto y fecha deseada.
 * - Solicitar inicio de sesión antes de enviar.
 * - Mostrar el estado de la solicitud.
 * - Permitir cancelar o volver a intentar.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Acceso a Prisma.
 * - Validación definitiva del servidor.
 *
 * Todas las acciones son controladas por el componente padre.
 */

import {
  useId,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeRequestCardLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeRequestCardSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeRequestCardVariant =
  | "surface"
  | "soft"
  | "dark";

/* =========================================================
   TIPO DE SOLICITUD
   ========================================================= */

export type CreativeRequestType =
  | "SIMILAR"
  | "CUSTOM";

/* =========================================================
   ESTADO DE SOLICITUD
   ========================================================= */

export type CreativeRequestStatus =
  | "IDLE"
  | "PENDING"
  | "CONTACTED"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

/* =========================================================
   ACCIÓN EN PROCESO
   ========================================================= */

export type CreativeRequestLoadingAction =
  | "LOGIN"
  | "SUBMIT"
  | "RETRY"
  | "CANCEL"
  | null;

/* =========================================================
   VALORES DEL FORMULARIO
   ========================================================= */

export interface CreativeRequestValues {
  requestType:
    CreativeRequestType;

  description:
    string;

  budget:
    string;

  desiredDate:
    string;

  contactEmail:
    string;

  contactPhone:
    string;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeRequestCardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "onSubmit"
  > {
  creativeItemId:
    string;

  designTitle:
    string;

  language?:
    CreativeRequestCardLanguage;

  size?:
    CreativeRequestCardSize;

  variant?:
    CreativeRequestCardVariant;

  values?:
    CreativeRequestValues;

  defaultValues?:
    Partial<CreativeRequestValues>;

  onValuesChange?:
    (
      values:
        CreativeRequestValues,
    ) => void;

  onSubmitRequest?:
    (
      values:
        CreativeRequestValues,
    ) => void | Promise<void>;

  onSubmitted?:
    () => void;

  onSubmitError?:
    (
      error:
        unknown,
    ) => void;

  authenticated?:
    boolean;

  requireAuthentication?:
    boolean;

  onRequireAuthentication?:
    () => void | Promise<void>;

  requestStatus?:
    CreativeRequestStatus;

  loadingAction?:
    CreativeRequestLoadingAction;

  disabled?:
    boolean;

  readOnly?:
    boolean;

  canSubmit?:
    boolean;

  canRetry?:
    boolean;

  canCancel?:
    boolean;

  onRetry?:
    () => void | Promise<void>;

  onCancelRequest?:
    () => void | Promise<void>;

  heading?:
    string | null;

  description?:
    string | null;

  successMessage?:
    string | null;

  errorMessage?:
    string | null;

  minimumDescriptionLength?:
    number;

  maximumDescriptionLength?:
    number;

  requireBudget?:
    boolean;

  requireDesiredDate?:
    boolean;

  requireContactEmail?:
    boolean;

  requireContactPhone?:
    boolean;

  showDesignTitle?:
    boolean;

  showBudget?:
    boolean;

  showDesiredDate?:
    boolean;

  showContactEmail?:
    boolean;

  showContactPhone?:
    boolean;

  showCancelButton?:
    boolean;

  headerContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  formClassName?:
    string;

  fieldClassName?:
    string;

  actionsClassName?:
    string;

  primaryButtonClassName?:
    string;

  secondaryButtonClassName?:
    string;
}

/* =========================================================
   VALORES PREDETERMINADOS
   ========================================================= */

const CREATIVE_REQUEST_DEFAULT_VALUES:
  CreativeRequestValues = {
    requestType:
      "SIMILAR",

    description:
      "",

    budget:
      "",

    desiredDate:
      "",

    contactEmail:
      "",

    contactPhone:
      "",
  };

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_REQUEST_CARD_COPY = {
  es: {
    group:
      "Solicitud de diseño personalizado",

    heading:
      "Solicita un diseño personalizado",

    description:
      "Cuéntanos qué necesitas. El equipo de FIXORA revisará tu solicitud y se comunicará contigo.",

    design:
      "Diseño de referencia",

    requestType:
      "Tipo de solicitud",

    similar:
      "Diseño similar",

    similarDescription:
      "Usar este trabajo como referencia para crear una nueva propuesta.",

    custom:
      "Diseño personalizado",

    customDescription:
      "Crear una propuesta completamente nueva según tus indicaciones.",

    projectDescription:
      "Describe tu proyecto",

    projectPlaceholder:
      "Indica colores, estilo, dimensiones, textos, público objetivo y cualquier detalle importante...",

    budget:
      "Presupuesto aproximado",

    budgetPlaceholder:
      "Ejemplo: S/ 150",

    desiredDate:
      "Fecha deseada",

    email:
      "Correo de contacto",

    emailPlaceholder:
      "correo@ejemplo.com",

    phone:
      "Teléfono o WhatsApp",

    phonePlaceholder:
      "Ejemplo: 999 999 999",

    login:
      "Iniciar sesión para solicitar",

    loggingIn:
      "Abriendo inicio de sesión...",

    submit:
      "Enviar solicitud",

    submitting:
      "Enviando solicitud...",

    retry:
      "Volver a intentar",

    retrying:
      "Preparando nuevo intento...",

    cancel:
      "Cancelar solicitud",

    cancelling:
      "Cancelando solicitud...",

    idle:
      "Solicitud disponible",

    pending:
      "Solicitud pendiente",

    contacted:
      "Cliente contactado",

    approved:
      "Solicitud aprobada",

    rejected:
      "Solicitud rechazada",

    cancelled:
      "Solicitud cancelada",

    pendingMessage:
      "Tu solicitud fue recibida. El equipo de FIXORA revisará los detalles y se comunicará contigo.",

    contactedMessage:
      "El equipo de FIXORA ya inició el contacto para coordinar tu proyecto.",

    approvedMessage:
      "La solicitud fue aprobada. Revisa las indicaciones enviadas para continuar con el proyecto.",

    rejectedMessage:
      "La solicitud no pudo ser aprobada con la información registrada. Puedes corregirla y volver a intentarlo.",

    cancelledMessage:
      "La solicitud fue cancelada. Puedes registrar una nueva cuando lo necesites.",

    authenticationMessage:
      "Debes iniciar sesión para registrar la solicitud y hacer seguimiento a su estado.",

    minimumDescription:
      "La descripción debe tener al menos",

    maximumDescription:
      "La descripción no puede superar",

    characters:
      "caracteres",

    requiredField:
      "Este campo es obligatorio.",

    invalidEmail:
      "Ingresa un correo electrónico válido.",

    missingContact:
      "Debes registrar al menos un correo o teléfono de contacto.",

    unavailable:
      "Acción no disponible",
  },

  en: {
    group:
      "Custom design request",

    heading:
      "Request a custom design",

    description:
      "Tell us what you need. The FIXORA team will review your request and contact you.",

    design:
      "Reference design",

    requestType:
      "Request type",

    similar:
      "Similar design",

    similarDescription:
      "Use this work as a reference to create a new proposal.",

    custom:
      "Custom design",

    customDescription:
      "Create a completely new proposal according to your instructions.",

    projectDescription:
      "Describe your project",

    projectPlaceholder:
      "Include colors, style, dimensions, text, target audience and any important details...",

    budget:
      "Approximate budget",

    budgetPlaceholder:
      "Example: $150",

    desiredDate:
      "Desired date",

    email:
      "Contact email",

    emailPlaceholder:
      "email@example.com",

    phone:
      "Phone or WhatsApp",

    phonePlaceholder:
      "Example: 999 999 999",

    login:
      "Sign in to request",

    loggingIn:
      "Opening sign in...",

    submit:
      "Send request",

    submitting:
      "Sending request...",

    retry:
      "Try again",

    retrying:
      "Preparing another attempt...",

    cancel:
      "Cancel request",

    cancelling:
      "Cancelling request...",

    idle:
      "Request available",

    pending:
      "Request pending",

    contacted:
      "Client contacted",

    approved:
      "Request approved",

    rejected:
      "Request rejected",

    cancelled:
      "Request cancelled",

    pendingMessage:
      "Your request was received. The FIXORA team will review the details and contact you.",

    contactedMessage:
      "The FIXORA team has started contacting you to coordinate the project.",

    approvedMessage:
      "The request was approved. Review the instructions sent to continue with the project.",

    rejectedMessage:
      "The request could not be approved with the registered information. You can update it and try again.",

    cancelledMessage:
      "The request was cancelled. You can register a new one whenever needed.",

    authenticationMessage:
      "You must sign in to register the request and track its status.",

    minimumDescription:
      "The description must contain at least",

    maximumDescription:
      "The description cannot exceed",

    characters:
      "characters",

    requiredField:
      "This field is required.",

    invalidEmail:
      "Enter a valid email address.",

    missingContact:
      "You must provide at least an email or phone number.",

    unavailable:
      "Action unavailable",
  },
} as const;

/* =========================================================
   CLASES
   ========================================================= */

const CREATIVE_REQUEST_CARD_BASE_CLASSES = [
  "w-full",
  "min-w-0",
  "overflow-hidden",
  "border",
  "transition-colors",
  "duration-200",
].join(
  " ",
);

const CREATIVE_REQUEST_CARD_VARIANT_CLASSES = {
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
    "border-cyan-500/20",
    "bg-cyan-500/[0.05]",

    "dark:border-cyan-400/20",
    "dark:bg-cyan-400/[0.05]",
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
  CreativeRequestCardVariant,
  string
>;

const CREATIVE_REQUEST_CARD_SIZE_CLASSES = {
  sm: {
    root:
      "rounded-2xl",

    section:
      "p-4",

    title:
      "text-base",

    description:
      "text-xs leading-5",

    field:
      "min-h-10 rounded-lg px-3 py-2 text-xs",

    textarea:
      "min-h-24 rounded-xl px-3 py-2.5 text-xs",

    button:
      "min-h-9 rounded-lg px-3 py-2 text-xs",
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

    field:
      "min-h-11 rounded-xl px-4 py-2.5 text-sm",

    textarea:
      "min-h-32 rounded-xl px-4 py-3 text-sm",

    button:
      "min-h-11 rounded-xl px-4 py-3 text-sm",
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

    field:
      "min-h-12 rounded-xl px-5 py-3 text-base",

    textarea:
      "min-h-40 rounded-2xl px-5 py-4 text-base",

    button:
      "min-h-12 rounded-xl px-5 py-3.5 text-base",
  },
} as const satisfies Record<
  CreativeRequestCardSize,
  {
    root:
      string;

    section:
      string;

    title:
      string;

    description:
      string;

    field:
      string;

    textarea:
      string;

    button:
      string;
  }
>;

const CREATIVE_REQUEST_STATUS_CLASSES = {
  IDLE: [
    "border-cyan-500/25",
    "bg-cyan-500/10",
    "text-cyan-700",

    "dark:border-cyan-400/25",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(
    " ",
  ),

  PENDING: [
    "border-amber-500/25",
    "bg-amber-500/10",
    "text-amber-700",

    "dark:border-amber-400/25",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  CONTACTED: [
    "border-violet-500/25",
    "bg-violet-500/10",
    "text-violet-700",

    "dark:border-violet-400/25",
    "dark:bg-violet-400/10",
    "dark:text-violet-300",
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
  CreativeRequestStatus,
  string
>;

const CREATIVE_REQUEST_BUTTON_BASE_CLASSES = [
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
].join(
  " ",
);

const CREATIVE_REQUEST_PRIMARY_BUTTON_CLASSES = [
  "border-cyan-500/30",
  "bg-gradient-to-r",
  "from-cyan-500",
  "to-emerald-500",
  "text-white",
  "shadow-[0_10px_28px_rgba(6,182,212,0.22)]",

  "enabled:hover:from-cyan-400",
  "enabled:hover:to-emerald-400",
  "enabled:hover:shadow-[0_14px_34px_rgba(6,182,212,0.30)]",

  "focus-visible:ring-cyan-500/60",

  "dark:border-cyan-300/20",
].join(
  " ",
);


const CREATIVE_REQUEST_DANGER_BUTTON_CLASSES = [
  "border-red-500/25",
  "bg-red-500/10",
  "text-red-700",

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

function joinCreativeRequestCardClasses(
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

function normalizeCreativeRequestText(
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

function normalizeCreativeRequestDescription(
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
      /\r\n/g,
      "\n",
    )
    .trim();
}

function normalizeCreativeRequestMaximumLength(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 2_000;
  }

  return Math.max(
    1,
    Math.trunc(
      value,
    ),
  );
}

function normalizeCreativeRequestMinimumLength(
  value:
    number,
  maximum:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 20;
  }

  return Math.min(
    maximum,
    Math.max(
      1,
      Math.trunc(
        value,
      ),
    ),
  );
}

function normalizeCreativeRequestValues(
  values:
    Partial<CreativeRequestValues> | null | undefined,
): CreativeRequestValues {
  return {
    requestType:
      values?.requestType ===
        "CUSTOM"
        ? "CUSTOM"
        : "SIMILAR",

    description:
      typeof values?.description ===
        "string"
        ? values.description
        : "",

    budget:
      typeof values?.budget ===
        "string"
        ? values.budget
        : "",

    desiredDate:
      typeof values?.desiredDate ===
        "string"
        ? values.desiredDate
        : "",

    contactEmail:
      typeof values?.contactEmail ===
        "string"
        ? values.contactEmail
        : "",

    contactPhone:
      typeof values?.contactPhone ===
        "string"
        ? values.contactPhone
        : "",
  };
}

function isCreativeRequestEmailValid(
  email:
    string,
): boolean {
  if (
    !email
  ) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}

function runCreativeRequestAction(
  action:
    (() => void | Promise<void>) |
    undefined,
): void {
  void action?.();
}

/* =========================================================
   ESTADO
   ========================================================= */

function getCreativeRequestStatusLabel(
  status:
    CreativeRequestStatus,
  language:
    CreativeRequestCardLanguage,
): string {
  const copy =
    CREATIVE_REQUEST_CARD_COPY[
      language
    ];

  switch (
    status
  ) {
    case "PENDING":
      return copy.pending;

    case "CONTACTED":
      return copy.contacted;

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

function getCreativeRequestStatusMessage(
  status:
    CreativeRequestStatus,
  language:
    CreativeRequestCardLanguage,
): string {
  const copy =
    CREATIVE_REQUEST_CARD_COPY[
      language
    ];

  switch (
    status
  ) {
    case "PENDING":
      return copy.pendingMessage;

    case "CONTACTED":
      return copy.contactedMessage;

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
   ICONOS
   ========================================================= */

function CreativeRequestSendIcon() {
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
      <path d="m22 2-7 20-4-9-9-4Z" />

      <path d="M22 2 11 13" />
    </svg>
  );
}

function CreativeRequestLoginIcon() {
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

function CreativeRequestRetryIcon() {
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

function CreativeRequestCancelIcon() {
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

function CreativeRequestStatusIcon({
  status,
}: {
  status:
    CreativeRequestStatus;
}) {
  if (
    status ===
    "APPROVED"
  ) {
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

  if (
    status ===
    "REJECTED"
  ) {
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

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeRequestCard({
  creativeItemId,

  designTitle,

  language =
    "es",

  size =
    "md",

  variant =
    "surface",

  values,

  defaultValues =
    {},

  onValuesChange,

  onSubmitRequest,

  onSubmitted,

  onSubmitError,

  authenticated =
    false,

  requireAuthentication =
    true,

  onRequireAuthentication,

  requestStatus =
    "IDLE",

  loadingAction =
    null,

  disabled =
    false,

  readOnly =
    false,

  canSubmit =
    true,

  canRetry =
    true,

  canCancel =
    true,

  onRetry,

  onCancelRequest,

  heading =
    null,

  description =
    null,

  successMessage =
    null,

  errorMessage =
    null,

  minimumDescriptionLength =
    20,

  maximumDescriptionLength =
    2_000,

  requireBudget =
    false,

  requireDesiredDate =
    false,

  requireContactEmail =
    false,

  requireContactPhone =
    false,

  showDesignTitle =
    true,

  showBudget =
    true,

  showDesiredDate =
    true,

  showContactEmail =
    true,

  showContactPhone =
    true,

  showCancelButton =
    true,

  headerContent =
    null,

  footerContent =
    null,

  formClassName,

  fieldClassName,

  actionsClassName,

  primaryButtonClassName,

  secondaryButtonClassName,

  className,

  onClick,

  "aria-label":
    ariaLabel,

  ...containerProps
}: CreativeRequestCardProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_REQUEST_CARD_COPY[
      language
    ];

  const controlled =
    values !==
    undefined;

  const [
    internalValues,
    setInternalValues,
  ] =
    useState<CreativeRequestValues>(
      () =>
        normalizeCreativeRequestValues({
          ...CREATIVE_REQUEST_DEFAULT_VALUES,
          ...defaultValues,
        }),
    );

  const currentValues =
    controlled
      ? normalizeCreativeRequestValues(
          values,
        )
      : internalValues;

  const normalizedCreativeItemId =
    normalizeCreativeRequestText(
      creativeItemId,
    );

  const normalizedDesignTitle =
    normalizeCreativeRequestText(
      designTitle,
    ) ||
    "FIXORA";

  const resolvedHeading =
    normalizeCreativeRequestText(
      heading,
    ) ||
    copy.heading;

  const resolvedDescription =
    normalizeCreativeRequestText(
      description,
    ) ||
    copy.description;

  const normalizedSuccessMessage =
    normalizeCreativeRequestText(
      successMessage,
    );

  const normalizedErrorMessage =
    normalizeCreativeRequestText(
      errorMessage,
    );

  const normalizedMaximumLength =
    normalizeCreativeRequestMaximumLength(
      maximumDescriptionLength,
    );

  const normalizedMinimumLength =
    normalizeCreativeRequestMinimumLength(
      minimumDescriptionLength,
      normalizedMaximumLength,
    );

  const normalizedDescription =
    normalizeCreativeRequestDescription(
      currentValues.description,
    );

  const normalizedBudget =
    normalizeCreativeRequestText(
      currentValues.budget,
    );

  const normalizedDesiredDate =
    normalizeCreativeRequestText(
      currentValues.desiredDate,
    );

  const normalizedContactEmail =
    normalizeCreativeRequestText(
      currentValues.contactEmail,
    );

  const normalizedContactPhone =
    normalizeCreativeRequestText(
      currentValues.contactPhone,
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

  const submitLoading =
    loadingAction ===
    "SUBMIT";

  const retryLoading =
    loadingAction ===
    "RETRY";

  const cancelLoading =
    loadingAction ===
    "CANCEL";

  const interactionDisabled =
    disabled ||
    anyActionLoading;

  const descriptionTooShort =
    normalizedDescription.length <
    normalizedMinimumLength;

  const descriptionTooLong =
    currentValues.description.length >
    normalizedMaximumLength;

  const budgetMissing =
    showBudget &&
    requireBudget &&
    !normalizedBudget;

  const desiredDateMissing =
    showDesiredDate &&
    requireDesiredDate &&
    !normalizedDesiredDate;

  const emailMissing =
    showContactEmail &&
    requireContactEmail &&
    !normalizedContactEmail;

  const phoneMissing =
    showContactPhone &&
    requireContactPhone &&
    !normalizedContactPhone;

  const invalidEmail =
    showContactEmail &&
    !isCreativeRequestEmailValid(
      normalizedContactEmail,
    );

  const contactMissing =
    showContactEmail &&
    showContactPhone &&
    !requireContactEmail &&
    !requireContactPhone &&
    !normalizedContactEmail &&
    !normalizedContactPhone;

  const formInvalid =
    descriptionTooShort ||
    descriptionTooLong ||
    budgetMissing ||
    desiredDateMissing ||
    emailMissing ||
    phoneMissing ||
    invalidEmail ||
    contactMissing;

  const submitDisabled =
    interactionDisabled ||
    readOnly ||
    !canSubmit ||
    !onSubmitRequest ||
    formInvalid;

  const statusLabel =
    getCreativeRequestStatusLabel(
      requestStatus,
      language,
    );

  const automaticStatusMessage =
    getCreativeRequestStatusMessage(
      requestStatus,
      language,
    );

  const statusMessage =
    requestStatus ===
      "APPROVED" &&
    normalizedSuccessMessage
      ? normalizedSuccessMessage
      : requestStatus ===
          "REJECTED" &&
        normalizedErrorMessage
        ? normalizedErrorMessage
        : automaticStatusMessage;

  const shouldShowForm =
    requestStatus ===
      "IDLE";

  const shouldShowRetry =
    requestStatus ===
      "REJECTED" ||
    requestStatus ===
      "CANCELLED";

  const shouldShowCancel =
    showCancelButton &&
    (
      requestStatus ===
        "PENDING" ||
      requestStatus ===
        "CONTACTED"
    );

  const cardId =
    `creative-request-${generatedId}`;

  const descriptionId =
    `${cardId}-description`;

  const projectDescriptionId =
    `${cardId}-project-description`;

  const updateValues =
    (
      nextValues:
        CreativeRequestValues,
    ): void => {
      if (
        !controlled
      ) {
        setInternalValues(
          nextValues,
        );
      }

      onValuesChange?.(
        nextValues,
      );
    };

  const updateField =
    <Key extends keyof CreativeRequestValues>(
      field:
        Key,
      fieldValue:
        CreativeRequestValues[Key],
    ): void => {
      updateValues({
        ...currentValues,
        [field]:
          fieldValue,
      });
    };

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

  const handleSubmit =
    (
      event:
        FormEvent<HTMLFormElement>,
    ): void => {
      event.preventDefault();

      if (
        authenticationRequired
      ) {
        runCreativeRequestAction(
          onRequireAuthentication,
        );

        return;
      }

      if (
        submitDisabled ||
        !onSubmitRequest
      ) {
        return;
      }

      const normalizedValues:
        CreativeRequestValues = {
          requestType:
            currentValues.requestType,

          description:
            normalizedDescription,

          budget:
            normalizedBudget,

          desiredDate:
            normalizedDesiredDate,

          contactEmail:
            normalizedContactEmail,

          contactPhone:
            normalizedContactPhone,
        };

      Promise.resolve(
        onSubmitRequest(
          normalizedValues,
        ),
      )
        .then(
          () => {
            onSubmitted?.();
          },
        )
        .catch(
          (
            submitError:
              unknown,
          ) => {
            onSubmitError?.(
              submitError,
            );
          },
        );
    };

  const handleInputChange =
    (
      event:
        ChangeEvent<
          HTMLInputElement |
          HTMLTextAreaElement
        >,
    ): void => {
      const {
        name,
        value:
          fieldValue,
      } =
        event.currentTarget;

      if (
        name ===
        "description"
      ) {
        updateField(
          "description",
          fieldValue,
        );
      }

      if (
        name ===
        "budget"
      ) {
        updateField(
          "budget",
          fieldValue,
        );
      }

      if (
        name ===
        "desiredDate"
      ) {
        updateField(
          "desiredDate",
          fieldValue,
        );
      }

      if (
        name ===
        "contactEmail"
      ) {
        updateField(
          "contactEmail",
          fieldValue,
        );
      }

      if (
        name ===
        "contactPhone"
      ) {
        updateField(
          "contactPhone",
          fieldValue,
        );
      }
    };

  return (
    <div
      {...containerProps}
      id={
        cardId
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
      data-creative-request-card=""
      data-creative-item-id={
        normalizedCreativeItemId
      }
      data-status={
        requestStatus
      }
      data-size={
        size
      }
      data-variant={
        variant
      }
      data-authenticated={
        authenticated
          ? "true"
          : "false"
      }
      onClick={
        handleContainerClick
      }
      className={
        joinCreativeRequestCardClasses(
          CREATIVE_REQUEST_CARD_BASE_CLASSES,

          CREATIVE_REQUEST_CARD_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_REQUEST_CARD_SIZE_CLASSES[
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
          CREATIVE_REQUEST_CARD_SIZE_CLASSES[
            size
          ].section
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2
              className={
                joinCreativeRequestCardClasses(
                  "font-black text-zinc-950",
                  "dark:text-white",

                  CREATIVE_REQUEST_CARD_SIZE_CLASSES[
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
                joinCreativeRequestCardClasses(
                  "mt-2 text-zinc-600",
                  "dark:text-zinc-400",

                  CREATIVE_REQUEST_CARD_SIZE_CLASSES[
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

        <div className="mt-5">
          <span
            className={
              joinCreativeRequestCardClasses(
                "inline-flex items-center gap-2",
                "rounded-full border px-3 py-2",
                "text-xs font-bold",

                CREATIVE_REQUEST_STATUS_CLASSES[
                  requestStatus
                ],
              )
            }
          >
            <CreativeRequestStatusIcon
              status={
                requestStatus
              }
            />

            {statusLabel}
          </span>
        </div>
      </div>

      {authenticationRequired ? (
        <div
          className={
            joinCreativeRequestCardClasses(
              "border-t border-zinc-200/80",
              "bg-cyan-500/[0.04]",
              "dark:border-white/10",
              "dark:bg-cyan-400/[0.04]",

              CREATIVE_REQUEST_CARD_SIZE_CLASSES[
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
                runCreativeRequestAction(
                  onRequireAuthentication,
                );
              }
            }
            className={
              joinCreativeRequestCardClasses(
                CREATIVE_REQUEST_BUTTON_BASE_CLASSES,
                CREATIVE_REQUEST_PRIMARY_BUTTON_CLASSES,

                CREATIVE_REQUEST_CARD_SIZE_CLASSES[
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
                variant="light"
              />
            ) : (
              <CreativeRequestLoginIcon />
            )}

            <span>
              {loginLoading
                ? copy.loggingIn
                : copy.login}
            </span>
          </button>
        </div>
      ) : null}

      {!authenticationRequired &&
      shouldShowForm ? (
        <form
          noValidate
          onSubmit={
            handleSubmit
          }
          className={
            joinCreativeRequestCardClasses(
              "space-y-5 border-t border-zinc-200/80",
              "dark:border-white/10",

              CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                size
              ].section,

              formClassName,
            )
          }
        >
          <fieldset
            disabled={
              interactionDisabled ||
              readOnly
            }
            className="space-y-3"
          >
            <legend className="text-sm font-bold text-zinc-900 dark:text-white">
              {copy.requestType}
            </legend>

            <label
              className={
                joinCreativeRequestCardClasses(
                  "flex cursor-pointer items-start gap-3",
                  "rounded-xl border p-4",
                  "transition-colors duration-150",

                  currentValues.requestType ===
                    "SIMILAR"
                    ? [
                        "border-cyan-500/35",
                        "bg-cyan-500/10",

                        "dark:border-cyan-400/35",
                        "dark:bg-cyan-400/10",
                      ].join(
                        " ",
                      )
                    : [
                        "border-zinc-200",
                        "bg-zinc-50/70",

                        "dark:border-white/10",
                        "dark:bg-white/[0.03]",
                      ].join(
                        " ",
                      ),
                )
              }
            >
              <input
                type="radio"
                name="requestType"
                value="SIMILAR"
                checked={
                  currentValues.requestType ===
                  "SIMILAR"
                }
                onChange={
                  () => {
                    updateField(
                      "requestType",
                      "SIMILAR",
                    );
                  }
                }
                className="mt-1 h-4 w-4 accent-cyan-500"
              />

              <span className="min-w-0">
                <strong className="block text-sm text-zinc-900 dark:text-white">
                  {copy.similar}
                </strong>

                <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {copy.similarDescription}
                </span>
              </span>
            </label>

            <label
              className={
                joinCreativeRequestCardClasses(
                  "flex cursor-pointer items-start gap-3",
                  "rounded-xl border p-4",
                  "transition-colors duration-150",

                  currentValues.requestType ===
                    "CUSTOM"
                    ? [
                        "border-emerald-500/35",
                        "bg-emerald-500/10",

                        "dark:border-emerald-400/35",
                        "dark:bg-emerald-400/10",
                      ].join(
                        " ",
                      )
                    : [
                        "border-zinc-200",
                        "bg-zinc-50/70",

                        "dark:border-white/10",
                        "dark:bg-white/[0.03]",
                      ].join(
                        " ",
                      ),
                )
              }
            >
              <input
                type="radio"
                name="requestType"
                value="CUSTOM"
                checked={
                  currentValues.requestType ===
                  "CUSTOM"
                }
                onChange={
                  () => {
                    updateField(
                      "requestType",
                      "CUSTOM",
                    );
                  }
                }
                className="mt-1 h-4 w-4 accent-emerald-500"
              />

              <span className="min-w-0">
                <strong className="block text-sm text-zinc-900 dark:text-white">
                  {copy.custom}
                </strong>

                <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {copy.customDescription}
                </span>
              </span>
            </label>
          </fieldset>

          <div>
            <label
              htmlFor={
                projectDescriptionId
              }
              className="block text-sm font-bold text-zinc-900 dark:text-white"
            >
              {copy.projectDescription}
            </label>

            <textarea
              id={
                projectDescriptionId
              }
              name="description"
              value={
                currentValues.description
              }
              maxLength={
                normalizedMaximumLength
              }
              disabled={
                interactionDisabled
              }
              readOnly={
                readOnly
              }
              required
              placeholder={
                copy.projectPlaceholder
              }
              aria-invalid={
                descriptionTooShort ||
                descriptionTooLong ||
                undefined
              }
              onChange={
                handleInputChange
              }
              className={
                joinCreativeRequestCardClasses(
                  "mt-2 block w-full resize-y",
                  "border border-zinc-200/90",
                  "bg-white/90",
                  "text-zinc-950",
                  "placeholder:text-zinc-400",
                  "outline-none transition-all duration-200",

                  "focus:border-cyan-500/45",
                  "focus:ring-2",
                  "focus:ring-cyan-500/15",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-60",

                  "dark:border-white/10",
                  "dark:bg-zinc-900/80",
                  "dark:text-white",
                  "dark:placeholder:text-zinc-500",

                  CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                    size
                  ].textarea,

                  fieldClassName,
                )
              }
            />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span
                className={
                  joinCreativeRequestCardClasses(
                    "text-xs",

                    descriptionTooShort ||
                    descriptionTooLong
                      ? "text-red-600 dark:text-red-300"
                      : "text-zinc-500 dark:text-zinc-400",
                  )
                }
              >
                {descriptionTooShort
                  ? `${copy.minimumDescription} ${normalizedMinimumLength} ${copy.characters}.`
                  : descriptionTooLong
                    ? `${copy.maximumDescription} ${normalizedMaximumLength} ${copy.characters}.`
                    : ""}
              </span>

              <span className="text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
                {currentValues.description.length}/
                {normalizedMaximumLength}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {showBudget ? (
              <div>
                <label
                  htmlFor={
                    `${cardId}-budget`
                  }
                  className="block text-sm font-bold text-zinc-900 dark:text-white"
                >
                  {copy.budget}
                </label>

                <input
                  id={
                    `${cardId}-budget`
                  }
                  type="text"
                  name="budget"
                  value={
                    currentValues.budget
                  }
                  disabled={
                    interactionDisabled
                  }
                  readOnly={
                    readOnly
                  }
                  required={
                    requireBudget
                  }
                  placeholder={
                    copy.budgetPlaceholder
                  }
                  onChange={
                    handleInputChange
                  }
                  className={
                    joinCreativeRequestCardClasses(
                      "mt-2 block w-full",
                      "border border-zinc-200/90",
                      "bg-white/90 text-zinc-950",
                      "placeholder:text-zinc-400",
                      "outline-none transition-all duration-200",

                      "focus:border-cyan-500/45",
                      "focus:ring-2",
                      "focus:ring-cyan-500/15",

                      "dark:border-white/10",
                      "dark:bg-zinc-900/80",
                      "dark:text-white",
                      "dark:placeholder:text-zinc-500",

                      CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                        size
                      ].field,

                      fieldClassName,
                    )
                  }
                />

                {budgetMissing ? (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                    {copy.requiredField}
                  </p>
                ) : null}
              </div>
            ) : null}

            {showDesiredDate ? (
              <div>
                <label
                  htmlFor={
                    `${cardId}-desired-date`
                  }
                  className="block text-sm font-bold text-zinc-900 dark:text-white"
                >
                  {copy.desiredDate}
                </label>

                <input
                  id={
                    `${cardId}-desired-date`
                  }
                  type="date"
                  name="desiredDate"
                  value={
                    currentValues.desiredDate
                  }
                  disabled={
                    interactionDisabled
                  }
                  readOnly={
                    readOnly
                  }
                  required={
                    requireDesiredDate
                  }
                  onChange={
                    handleInputChange
                  }
                  className={
                    joinCreativeRequestCardClasses(
                      "mt-2 block w-full",
                      "border border-zinc-200/90",
                      "bg-white/90 text-zinc-950",
                      "outline-none transition-all duration-200",

                      "focus:border-cyan-500/45",
                      "focus:ring-2",
                      "focus:ring-cyan-500/15",

                      "dark:border-white/10",
                      "dark:bg-zinc-900/80",
                      "dark:text-white",

                      CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                        size
                      ].field,

                      fieldClassName,
                    )
                  }
                />

                {desiredDateMissing ? (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                    {copy.requiredField}
                  </p>
                ) : null}
              </div>
            ) : null}

            {showContactEmail ? (
              <div>
                <label
                  htmlFor={
                    `${cardId}-email`
                  }
                  className="block text-sm font-bold text-zinc-900 dark:text-white"
                >
                  {copy.email}
                </label>

                <input
                  id={
                    `${cardId}-email`
                  }
                  type="email"
                  name="contactEmail"
                  value={
                    currentValues.contactEmail
                  }
                  disabled={
                    interactionDisabled
                  }
                  readOnly={
                    readOnly
                  }
                  required={
                    requireContactEmail
                  }
                  autoComplete="email"
                  placeholder={
                    copy.emailPlaceholder
                  }
                  onChange={
                    handleInputChange
                  }
                  className={
                    joinCreativeRequestCardClasses(
                      "mt-2 block w-full",
                      "border border-zinc-200/90",
                      "bg-white/90 text-zinc-950",
                      "placeholder:text-zinc-400",
                      "outline-none transition-all duration-200",

                      "focus:border-cyan-500/45",
                      "focus:ring-2",
                      "focus:ring-cyan-500/15",

                      "dark:border-white/10",
                      "dark:bg-zinc-900/80",
                      "dark:text-white",
                      "dark:placeholder:text-zinc-500",

                      CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                        size
                      ].field,

                      fieldClassName,
                    )
                  }
                />

                {invalidEmail ? (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                    {copy.invalidEmail}
                  </p>
                ) : emailMissing ? (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                    {copy.requiredField}
                  </p>
                ) : null}
              </div>
            ) : null}

            {showContactPhone ? (
              <div>
                <label
                  htmlFor={
                    `${cardId}-phone`
                  }
                  className="block text-sm font-bold text-zinc-900 dark:text-white"
                >
                  {copy.phone}
                </label>

                <input
                  id={
                    `${cardId}-phone`
                  }
                  type="tel"
                  name="contactPhone"
                  value={
                    currentValues.contactPhone
                  }
                  disabled={
                    interactionDisabled
                  }
                  readOnly={
                    readOnly
                  }
                  required={
                    requireContactPhone
                  }
                  autoComplete="tel"
                  placeholder={
                    copy.phonePlaceholder
                  }
                  onChange={
                    handleInputChange
                  }
                  className={
                    joinCreativeRequestCardClasses(
                      "mt-2 block w-full",
                      "border border-zinc-200/90",
                      "bg-white/90 text-zinc-950",
                      "placeholder:text-zinc-400",
                      "outline-none transition-all duration-200",

                      "focus:border-cyan-500/45",
                      "focus:ring-2",
                      "focus:ring-cyan-500/15",

                      "dark:border-white/10",
                      "dark:bg-zinc-900/80",
                      "dark:text-white",
                      "dark:placeholder:text-zinc-500",

                      CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                        size
                      ].field,

                      fieldClassName,
                    )
                  }
                />

                {phoneMissing ? (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                    {copy.requiredField}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {contactMissing ? (
            <p
              role="alert"
              className="text-xs font-semibold text-red-600 dark:text-red-300"
            >
              {copy.missingContact}
            </p>
          ) : null}

          <div
            className={
              joinCreativeRequestCardClasses(
                "flex flex-wrap items-center gap-3",
                "border-t border-zinc-200/80 pt-5",
                "dark:border-white/10",

                actionsClassName,
              )
            }
          >
            <button
              type="submit"
              aria-busy={
                submitLoading ||
                undefined
              }
              disabled={
                submitDisabled
              }
              title={
                canSubmit
                  ? copy.submit
                  : copy.unavailable
              }
              className={
                joinCreativeRequestCardClasses(
                  CREATIVE_REQUEST_BUTTON_BASE_CLASSES,
                  CREATIVE_REQUEST_PRIMARY_BUTTON_CLASSES,

                  CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                    size
                  ].button,

                  "min-w-0 flex-1",

                  primaryButtonClassName,
                )
              }
            >
              {submitLoading ? (
                <CreativeSpinner
                  decorative
                  size="sm"
                  variant="light"
                />
              ) : (
                <CreativeRequestSendIcon />
              )}

              <span className="truncate">
                {submitLoading
                  ? copy.submitting
                  : copy.submit}
              </span>
            </button>

            {footerContent}
          </div>
        </form>
      ) : null}

      {!authenticationRequired &&
      statusMessage ? (
        <div
          role={
            requestStatus ===
              "REJECTED"
              ? "alert"
              : "status"
          }
          className={
            joinCreativeRequestCardClasses(
              "border-t border-zinc-200/80",
              "dark:border-white/10",

              CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                size
              ].section,
            )
          }
        >
          <div
            className={
              joinCreativeRequestCardClasses(
                "rounded-xl border p-4",
                "text-sm leading-6",

                CREATIVE_REQUEST_STATUS_CLASSES[
                  requestStatus
                ],
              )
            }
          >
            {statusMessage}
          </div>
        </div>
      ) : null}

      {!authenticationRequired &&
      (
        shouldShowRetry ||
        shouldShowCancel ||
        (
          footerContent &&
          !shouldShowForm
        )
      ) ? (
        <div
          className={
            joinCreativeRequestCardClasses(
              "flex flex-wrap items-center gap-3",
              "border-t border-zinc-200/80",
              "dark:border-white/10",

              CREATIVE_REQUEST_CARD_SIZE_CLASSES[
                size
              ].section,

              actionsClassName,
            )
          }
        >
          {shouldShowRetry ? (
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
                  runCreativeRequestAction(
                    onRetry,
                  );
                }
              }
              className={
                joinCreativeRequestCardClasses(
                  CREATIVE_REQUEST_BUTTON_BASE_CLASSES,
                  CREATIVE_REQUEST_PRIMARY_BUTTON_CLASSES,

                  CREATIVE_REQUEST_CARD_SIZE_CLASSES[
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
                  variant="light"
                />
              ) : (
                <CreativeRequestRetryIcon />
              )}

              <span>
                {retryLoading
                  ? copy.retrying
                  : copy.retry}
              </span>
            </button>
          ) : null}

          {shouldShowCancel ? (
            <button
              type="button"
              aria-busy={
                cancelLoading ||
                undefined
              }
              disabled={
                disabled ||
                !canCancel ||
                !onCancelRequest ||
                (
                  anyActionLoading &&
                  !cancelLoading
                )
              }
              onClick={
                () => {
                  runCreativeRequestAction(
                    onCancelRequest,
                  );
                }
              }
              className={
                joinCreativeRequestCardClasses(
                  CREATIVE_REQUEST_BUTTON_BASE_CLASSES,
                  CREATIVE_REQUEST_DANGER_BUTTON_CLASSES,

                  CREATIVE_REQUEST_CARD_SIZE_CLASSES[
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
                <CreativeRequestCancelIcon />
              )}

              <span>
                {cancelLoading
                  ? copy.cancelling
                  : copy.cancel}
              </span>
            </button>
          ) : null}

          {!shouldShowForm
            ? footerContent
            : null}
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeRequestCard;
"use client";

/*
 * Panel administrativo principal del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar estadísticas generales del catálogo.
 * - Mostrar accesos rápidos administrativos.
 * - Mostrar publicaciones recientes.
 * - Mostrar solicitudes, pedidos y comentarios pendientes.
 * - Permitir abrir, editar y administrar publicaciones.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Acceso directo a Prisma.
 * - Navegación directa con rutas.
 *
 * Todas las acciones son controladas por el componente padre.
 */

import {
  useId,
} from "react";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import type {
  CreativeContentType,
  CreativeItemStatus,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeAdminDashboardLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeAdminDashboardSize =
  | "default"
  | "wide";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeAdminDashboardVariant =
  | "surface"
  | "dark";

/* =========================================================
   ESTADÍSTICAS
   ========================================================= */

export interface CreativeAdminDashboardStatistics {
  totalItems?:
    number | null;

  publishedItems?:
    number | null;

  draftItems?:
    number | null;

  hiddenItems?:
    number | null;

  archivedItems?:
    number | null;

  totalViews?:
    number | null;

  totalLikes?:
    number | null;

  totalFavorites?:
    number | null;

  totalDownloads?:
    number | null;

  pendingRequests?:
    number | null;

  pendingOrders?:
    number | null;

  pendingComments?:
    number | null;
}

/* =========================================================
   PUBLICACIÓN RECIENTE
   ========================================================= */

export interface CreativeAdminDashboardItem {
  id:
    string;

  title:
    string;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  categoryLabel?:
    string | null;

  updatedAtLabel?:
    string | null;

  authorName?:
    string | null;

  viewCount?:
    number | null;

  likeCount?:
    number | null;

  featured?:
    boolean;
}

/* =========================================================
   ACCIÓN RÁPIDA
   ========================================================= */

export type CreativeAdminDashboardAction =
  | "CREATE"
  | "MANAGE"
  | "REQUESTS"
  | "ORDERS"
  | "COMMENTS";

export interface CreativeAdminDashboardQuickAction {
  id:
    CreativeAdminDashboardAction;

  label?:
    string | null;

  description?:
    string | null;

  badge?:
    number | null;

  disabled?:
    boolean;

  icon?:
    ReactNode;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeAdminDashboardProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "children"
  > {
  language?:
    CreativeAdminDashboardLanguage;

  size?:
    CreativeAdminDashboardSize;

  variant?:
    CreativeAdminDashboardVariant;

  heading?:
    string | null;

  description?:
    string | null;

  administratorName?:
    string | null;

  statistics?:
    CreativeAdminDashboardStatistics;

  recentItems?:
    CreativeAdminDashboardItem[];

  maximumRecentItems?:
    number;

  quickActions?:
    CreativeAdminDashboardQuickAction[];

  loading?:
    boolean;

  error?:
    string | null;

  disabled?:
    boolean;

  /*
   * Accesos administrativos.
   */
  onCreateItem?:
    () => void | Promise<void>;

  onManageItems?:
    () => void | Promise<void>;

  onOpenRequests?:
    () => void | Promise<void>;

  onOpenOrders?:
    () => void | Promise<void>;

  onOpenComments?:
    () => void | Promise<void>;

  /*
   * Publicaciones recientes.
   */
  onOpenItem?:
    (
      item:
        CreativeAdminDashboardItem,
    ) => void | Promise<void>;

  onEditItem?:
    (
      item:
        CreativeAdminDashboardItem,
    ) => void | Promise<void>;

  /*
   * Visibilidad.
   */
  showHeader?:
    boolean;

  showStatistics?:
    boolean;

  showQuickActions?:
    boolean;

  showRecentItems?:
    boolean;

  showOperationalSummary?:
    boolean;

  /*
   * Contenido adicional.
   */
  headerContent?:
    ReactNode;

  statisticsContent?:
    ReactNode;

  quickActionsContent?:
    ReactNode;

  recentItemsContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  errorContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  headerClassName?:
    string;

  statisticsClassName?:
    string;

  quickActionsClassName?:
    string;

  recentItemsClassName?:
    string;

  footerClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_ADMIN_DASHBOARD_COPY = {
  es: {
    dashboard:
      "Panel administrativo de Diseño",

    heading:
      "Administración de Diseño",

    description:
      "Gestiona las publicaciones, solicitudes, pedidos, comentarios y estadísticas del catálogo.",

    welcome:
      "Bienvenido",

    totalItems:
      "Publicaciones",

    publishedItems:
      "Publicadas",

    draftItems:
      "Borradores",

    totalViews:
      "Visualizaciones",

    totalLikes:
      "Me gusta",

    totalDownloads:
      "Descargas",

    pendingRequests:
      "Solicitudes pendientes",

    pendingOrders:
      "Pedidos pendientes",

    pendingComments:
      "Comentarios pendientes",

    quickActions:
      "Accesos rápidos",

    create:
      "Agregar diseño",

    createDescription:
      "Registra una nueva publicación en el catálogo.",

    manage:
      "Administrar diseños",

    manageDescription:
      "Edita, publica, oculta o archiva publicaciones.",

    requests:
      "Solicitudes",

    requestsDescription:
      "Revisa solicitudes de trabajos personalizados.",

    orders:
      "Pedidos",

    ordersDescription:
      "Valida pagos y habilita descargas premium.",

    comments:
      "Comentarios",

    commentsDescription:
      "Modera comentarios y reportes de usuarios.",

    recentItems:
      "Publicaciones recientes",

    recentDescription:
      "Últimas publicaciones creadas o modificadas.",

    title:
      "Título",

    type:
      "Tipo",

    status:
      "Estado",

    category:
      "Categoría",

    updated:
      "Actualización",

    statistics:
      "Estadísticas",

    actions:
      "Acciones",

    open:
      "Abrir",

    edit:
      "Editar",

    free:
      "Gratis",

    paid:
      "Premium",

    portfolio:
      "Portafolio",

    draft:
      "Borrador",

    published:
      "Publicado",

    hidden:
      "Oculto",

    archived:
      "Archivado",

    featured:
      "Destacado",

    noCategory:
      "Sin categoría",

    noDate:
      "Sin fecha",

    noRecentItems:
      "Todavía no existen publicaciones recientes.",

    loading:
      "Cargando panel administrativo...",

    errorTitle:
      "No se pudo cargar el panel",

    errorDescription:
      "Ocurrió un problema al cargar la información administrativa.",

    operationalSummary:
      "Resumen operativo",

    attentionRequired:
      "Requiere atención",

    noPendingTasks:
      "No hay tareas pendientes",

    pendingTasksDescription:
      "Todas las solicitudes, pedidos y comentarios están atendidos.",

    views:
      "vistas",

    likes:
      "me gusta",
  },

  en: {
    dashboard:
      "Creative administration dashboard",

    heading:
      "Creative Administration",

    description:
      "Manage publications, requests, orders, comments and catalog statistics.",

    welcome:
      "Welcome",

    totalItems:
      "Publications",

    publishedItems:
      "Published",

    draftItems:
      "Drafts",

    totalViews:
      "Views",

    totalLikes:
      "Likes",

    totalDownloads:
      "Downloads",

    pendingRequests:
      "Pending requests",

    pendingOrders:
      "Pending orders",

    pendingComments:
      "Pending comments",

    quickActions:
      "Quick actions",

    create:
      "Add design",

    createDescription:
      "Register a new publication in the catalog.",

    manage:
      "Manage designs",

    manageDescription:
      "Edit, publish, hide or archive publications.",

    requests:
      "Requests",

    requestsDescription:
      "Review custom work requests.",

    orders:
      "Orders",

    ordersDescription:
      "Validate payments and enable premium downloads.",

    comments:
      "Comments",

    commentsDescription:
      "Moderate user comments and reports.",

    recentItems:
      "Recent publications",

    recentDescription:
      "Latest created or modified publications.",

    title:
      "Title",

    type:
      "Type",

    status:
      "Status",

    category:
      "Category",

    updated:
      "Updated",

    statistics:
      "Statistics",

    actions:
      "Actions",

    open:
      "Open",

    edit:
      "Edit",

    free:
      "Free",

    paid:
      "Premium",

    portfolio:
      "Portfolio",

    draft:
      "Draft",

    published:
      "Published",

    hidden:
      "Hidden",

    archived:
      "Archived",

    featured:
      "Featured",

    noCategory:
      "No category",

    noDate:
      "No date",

    noRecentItems:
      "There are no recent publications yet.",

    loading:
      "Loading administration dashboard...",

    errorTitle:
      "The dashboard could not be loaded",

    errorDescription:
      "A problem occurred while loading the administration data.",

    operationalSummary:
      "Operational summary",

    attentionRequired:
      "Requires attention",

    noPendingTasks:
      "There are no pending tasks",

    pendingTasksDescription:
      "All requests, orders and comments have been addressed.",

    views:
      "views",

    likes:
      "likes",
  },
} as const;

/* =========================================================
   CLASES
   ========================================================= */

const CREATIVE_ADMIN_DASHBOARD_VARIANT_CLASSES = {
  surface: [
    "text-zinc-950",
    "dark:text-white",
  ].join(
    " ",
  ),

  dark: [
    "text-white",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeAdminDashboardVariant,
  string
>;

const CREATIVE_ADMIN_DASHBOARD_SIZE_CLASSES = {
  default:
    "max-w-7xl",

  wide:
    "max-w-[1600px]",
} as const satisfies Record<
  CreativeAdminDashboardSize,
  string
>;

const CREATIVE_ADMIN_DASHBOARD_PANEL_CLASSES = [
  "border",
  "border-zinc-200/90",
  "bg-white/90",
  "shadow-[0_16px_48px_rgba(15,23,42,0.08)]",
  "backdrop-blur-xl",

  "dark:border-white/10",
  "dark:bg-zinc-950/85",
  "dark:shadow-[0_18px_52px_rgba(0,0,0,0.30)]",
].join(
  " ",
);

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeAdminDashboardClasses(
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

function normalizeCreativeAdminDashboardText(
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

function normalizeCreativeAdminDashboardCount(
  value:
    number | null | undefined,
): number {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.trunc(
      value,
    ),
  );
}

function normalizeCreativeAdminDashboardLimit(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 5;
  }

  return Math.min(
    20,
    Math.max(
      1,
      Math.trunc(
        value,
      ),
    ),
  );
}

function formatCreativeAdminDashboardCount(
  value:
    number | null | undefined,
  language:
    CreativeAdminDashboardLanguage,
): string {
  const normalizedValue =
    normalizeCreativeAdminDashboardCount(
      value,
    );

  try {
    return new Intl.NumberFormat(
      language ===
        "es"
        ? "es-PE"
        : "en-US",
      {
        notation:
          normalizedValue >=
          1_000
            ? "compact"
            : "standard",

        maximumFractionDigits:
          1,
      },
    ).format(
      normalizedValue,
    );
  } catch {
    return String(
      normalizedValue,
    );
  }
}

function runCreativeAdminDashboardAction(
  action:
    (() => void | Promise<void>) |
    undefined,
): void {
  void action?.();
}

/* =========================================================
   ETIQUETAS
   ========================================================= */

function getCreativeAdminDashboardTypeLabel(
  contentType:
    CreativeContentType,
  language:
    CreativeAdminDashboardLanguage,
): string {
  const copy =
    CREATIVE_ADMIN_DASHBOARD_COPY[
      language
    ];

  if (
    contentType ===
    "FREE"
  ) {
    return copy.free;
  }

  if (
    contentType ===
    "PAID"
  ) {
    return copy.paid;
  }

  return copy.portfolio;
}

function getCreativeAdminDashboardStatusLabel(
  status:
    CreativeItemStatus,
  language:
    CreativeAdminDashboardLanguage,
): string {
  const copy =
    CREATIVE_ADMIN_DASHBOARD_COPY[
      language
    ];

  if (
    status ===
    "DRAFT"
  ) {
    return copy.draft;
  }

  if (
    status ===
    "HIDDEN"
  ) {
    return copy.hidden;
  }

  if (
    status ===
    "ARCHIVED"
  ) {
    return copy.archived;
  }

  return copy.published;
}

/* =========================================================
   CLASES DEL TIPO
   ========================================================= */

function getCreativeAdminDashboardTypeClasses(
  contentType:
    CreativeContentType,
): string {
  if (
    contentType ===
    "FREE"
  ) {
    return [
      "border-emerald-500/25",
      "bg-emerald-500/10",
      "text-emerald-700",

      "dark:border-emerald-400/25",
      "dark:bg-emerald-400/10",
      "dark:text-emerald-300",
    ].join(
      " ",
    );
  }

  if (
    contentType ===
    "PAID"
  ) {
    return [
      "border-amber-500/25",
      "bg-amber-500/10",
      "text-amber-700",

      "dark:border-amber-400/25",
      "dark:bg-amber-400/10",
      "dark:text-amber-300",
    ].join(
      " ",
    );
  }

  return [
    "border-cyan-500/25",
    "bg-cyan-500/10",
    "text-cyan-700",

    "dark:border-cyan-400/25",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(
    " ",
  );
}

/* =========================================================
   CLASES DEL ESTADO
   ========================================================= */

function getCreativeAdminDashboardStatusClasses(
  status:
    CreativeItemStatus,
): string {
  if (
    status ===
    "DRAFT"
  ) {
    return [
      "border-zinc-300",
      "bg-zinc-100",
      "text-zinc-600",

      "dark:border-white/10",
      "dark:bg-white/[0.06]",
      "dark:text-zinc-300",
    ].join(
      " ",
    );
  }

  if (
    status ===
    "HIDDEN"
  ) {
    return [
      "border-amber-500/25",
      "bg-amber-500/10",
      "text-amber-700",

      "dark:border-amber-400/25",
      "dark:bg-amber-400/10",
      "dark:text-amber-300",
    ].join(
      " ",
    );
  }

  if (
    status ===
    "ARCHIVED"
  ) {
    return [
      "border-violet-500/25",
      "bg-violet-500/10",
      "text-violet-700",

      "dark:border-violet-400/25",
      "dark:bg-violet-400/10",
      "dark:text-violet-300",
    ].join(
      " ",
    );
  }

  return [
    "border-emerald-500/25",
    "bg-emerald-500/10",
    "text-emerald-700",

    "dark:border-emerald-400/25",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(
    " ",
  );
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeDashboardDesignIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
      />

      <circle
        cx="9"
        cy="9"
        r="1.5"
      />

      <path d="m5 17 5-5 4 4 2-2 3 3" />
    </svg>
  );
}

function CreativeDashboardPublishedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function CreativeDashboardDraftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M6 3h9l3 3v15H6Z" />

      <path d="M14 3v4h4" />

      <path d="M9 12h6" />

      <path d="M9 16h4" />
    </svg>
  );
}

function CreativeDashboardViewsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

function CreativeDashboardLikesIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function CreativeDashboardDownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 3v12" />

      <path d="m7 10 5 5 5-5" />

      <path d="M5 21h14" />
    </svg>
  );
}

function CreativeDashboardCreateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 5v14" />

      <path d="M5 12h14" />
    </svg>
  );
}

function CreativeDashboardManageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M4 6h16" />

      <path d="M4 12h16" />

      <path d="M4 18h16" />

      <circle
        cx="8"
        cy="6"
        r="1.5"
      />

      <circle
        cx="16"
        cy="12"
        r="1.5"
      />

      <circle
        cx="10"
        cy="18"
        r="1.5"
      />
    </svg>
  );
}

function CreativeDashboardRequestIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M4 4h16v14H8l-4 3Z" />

      <path d="M8 9h8" />

      <path d="M8 13h5" />
    </svg>
  );
}

function CreativeDashboardOrderIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
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

function CreativeDashboardCommentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />

      <path d="M8 9h8" />

      <path d="M8 13h5" />
    </svg>
  );
}

function CreativeDashboardErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 7v6" />

      <path d="M12 17h.01" />
    </svg>
  );
}

/* =========================================================
   TARJETA ESTADÍSTICA
   ========================================================= */

interface CreativeDashboardStatisticCardProps {
  label:
    string;

  value:
    number | null | undefined;

  language:
    CreativeAdminDashboardLanguage;

  icon:
    ReactNode;

  tone:
    "emerald" | "cyan" | "amber" | "violet" | "red" | "zinc";
}

const CREATIVE_DASHBOARD_STATISTIC_TONE_CLASSES = {
  emerald: [
    "border-emerald-500/20",
    "bg-emerald-500/[0.06]",
    "text-emerald-700",

    "dark:border-emerald-400/20",
    "dark:bg-emerald-400/[0.06]",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  cyan: [
    "border-cyan-500/20",
    "bg-cyan-500/[0.06]",
    "text-cyan-700",

    "dark:border-cyan-400/20",
    "dark:bg-cyan-400/[0.06]",
    "dark:text-cyan-300",
  ].join(
    " ",
  ),

  amber: [
    "border-amber-500/20",
    "bg-amber-500/[0.06]",
    "text-amber-700",

    "dark:border-amber-400/20",
    "dark:bg-amber-400/[0.06]",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  violet: [
    "border-violet-500/20",
    "bg-violet-500/[0.06]",
    "text-violet-700",

    "dark:border-violet-400/20",
    "dark:bg-violet-400/[0.06]",
    "dark:text-violet-300",
  ].join(
    " ",
  ),

  red: [
    "border-red-500/20",
    "bg-red-500/[0.06]",
    "text-red-700",

    "dark:border-red-400/20",
    "dark:bg-red-400/[0.06]",
    "dark:text-red-300",
  ].join(
    " ",
  ),

  zinc: [
    "border-zinc-300",
    "bg-zinc-100/70",
    "text-zinc-700",

    "dark:border-white/10",
    "dark:bg-white/[0.05]",
    "dark:text-zinc-300",
  ].join(
    " ",
  ),
} as const;

function CreativeDashboardStatisticCard({
  label,
  value,
  language,
  icon,
  tone,
}: CreativeDashboardStatisticCardProps) {
  return (
    <article
      className={joinCreativeAdminDashboardClasses(
        "rounded-2xl border p-4",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        "hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]",

        CREATIVE_DASHBOARD_STATISTIC_TONE_CLASSES[
          tone
        ],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-75">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black tabular-nums sm:text-3xl">
            {formatCreativeAdminDashboardCount(
              value,
              language,
            )}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-current/15 bg-current/[0.06]"
        >
          {icon}
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   ACCIONES RÁPIDAS
   ========================================================= */

function getCreativeDashboardActionCopy(
  action:
    CreativeAdminDashboardAction,
  language:
    CreativeAdminDashboardLanguage,
): {
  label:
    string;

  description:
    string;
} {
  const copy =
    CREATIVE_ADMIN_DASHBOARD_COPY[
      language
    ];

  if (
    action ===
    "CREATE"
  ) {
    return {
      label:
        copy.create,

      description:
        copy.createDescription,
    };
  }

  if (
    action ===
    "MANAGE"
  ) {
    return {
      label:
        copy.manage,

      description:
        copy.manageDescription,
    };
  }

  if (
    action ===
    "REQUESTS"
  ) {
    return {
      label:
        copy.requests,

      description:
        copy.requestsDescription,
    };
  }

  if (
    action ===
    "ORDERS"
  ) {
    return {
      label:
        copy.orders,

      description:
        copy.ordersDescription,
    };
  }

  return {
    label:
      copy.comments,

    description:
      copy.commentsDescription,
  };
}

function getCreativeDashboardActionIcon(
  action:
    CreativeAdminDashboardAction,
): ReactNode {
  if (
    action ===
    "CREATE"
  ) {
    return <CreativeDashboardCreateIcon />;
  }

  if (
    action ===
    "MANAGE"
  ) {
    return <CreativeDashboardManageIcon />;
  }

  if (
    action ===
    "REQUESTS"
  ) {
    return <CreativeDashboardRequestIcon />;
  }

  if (
    action ===
    "ORDERS"
  ) {
    return <CreativeDashboardOrderIcon />;
  }

  return <CreativeDashboardCommentIcon />;
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeAdminDashboard({
  language =
    "es",

  size =
    "default",

  variant =
    "surface",

  heading =
    null,

  description =
    null,

  administratorName =
    null,

  statistics =
    {},

  recentItems =
    [],

  maximumRecentItems =
    5,

  quickActions,

  loading =
    false,

  error =
    null,

  disabled =
    false,

  onCreateItem,

  onManageItems,

  onOpenRequests,

  onOpenOrders,

  onOpenComments,

  onOpenItem,

  onEditItem,

  showHeader =
    true,

  showStatistics =
    true,

  showQuickActions =
    true,

  showRecentItems =
    true,

  showOperationalSummary =
    true,

  headerContent =
    null,

  statisticsContent =
    null,

  quickActionsContent =
    null,

  recentItemsContent =
    null,

  footerContent =
    null,

  errorContent =
    null,

  headerClassName,

  statisticsClassName,

  quickActionsClassName,

  recentItemsClassName,

  footerClassName,

  className,

  "aria-label":
    ariaLabel,

  ...sectionProps
}: CreativeAdminDashboardProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_ADMIN_DASHBOARD_COPY[
      language
    ];

  const resolvedHeading =
    normalizeCreativeAdminDashboardText(
      heading,
    ) ||
    copy.heading;

  const resolvedDescription =
    normalizeCreativeAdminDashboardText(
      description,
    ) ||
    copy.description;

  const normalizedAdministratorName =
    normalizeCreativeAdminDashboardText(
      administratorName,
    );

  const normalizedError =
    normalizeCreativeAdminDashboardText(
      error,
    );

  const normalizedMaximumRecentItems =
    normalizeCreativeAdminDashboardLimit(
      maximumRecentItems,
    );

  const visibleRecentItems =
    recentItems.slice(
      0,
      normalizedMaximumRecentItems,
    );

  const pendingRequests =
    normalizeCreativeAdminDashboardCount(
      statistics.pendingRequests,
    );

  const pendingOrders =
    normalizeCreativeAdminDashboardCount(
      statistics.pendingOrders,
    );

  const pendingComments =
    normalizeCreativeAdminDashboardCount(
      statistics.pendingComments,
    );

  const totalPendingTasks =
    pendingRequests +
    pendingOrders +
    pendingComments;

  const defaultQuickActions:
    CreativeAdminDashboardQuickAction[] = [
      {
        id:
          "CREATE",
      },
      {
        id:
          "MANAGE",
      },
      {
        id:
          "REQUESTS",

        badge:
          pendingRequests,
      },
      {
        id:
          "ORDERS",

        badge:
          pendingOrders,
      },
      {
        id:
          "COMMENTS",

        badge:
          pendingComments,
      },
    ];

  const resolvedQuickActions =
    quickActions ??
    defaultQuickActions;

  const headingId =
    `creative-admin-dashboard-heading-${generatedId}`;

  const descriptionId =
    `creative-admin-dashboard-description-${generatedId}`;

  const runQuickAction =
    (
      action:
        CreativeAdminDashboardAction,
    ): void => {
      if (
        action ===
        "CREATE"
      ) {
        runCreativeAdminDashboardAction(
          onCreateItem,
        );

        return;
      }

      if (
        action ===
        "MANAGE"
      ) {
        runCreativeAdminDashboardAction(
          onManageItems,
        );

        return;
      }

      if (
        action ===
        "REQUESTS"
      ) {
        runCreativeAdminDashboardAction(
          onOpenRequests,
        );

        return;
      }

      if (
        action ===
        "ORDERS"
      ) {
        runCreativeAdminDashboardAction(
          onOpenOrders,
        );

        return;
      }

      runCreativeAdminDashboardAction(
        onOpenComments,
      );
    };

  const quickActionAvailable =
    (
      action:
        CreativeAdminDashboardAction,
    ): boolean => {
      if (
        action ===
        "CREATE"
      ) {
        return Boolean(
          onCreateItem,
        );
      }

      if (
        action ===
        "MANAGE"
      ) {
        return Boolean(
          onManageItems,
        );
      }

      if (
        action ===
        "REQUESTS"
      ) {
        return Boolean(
          onOpenRequests,
        );
      }

      if (
        action ===
        "ORDERS"
      ) {
        return Boolean(
          onOpenOrders,
        );
      }

      return Boolean(
        onOpenComments,
      );
    };

  return (
    <section
      {...sectionProps}
      aria-label={
        ariaLabel ??
        copy.dashboard
      }
      aria-labelledby={
        headingId
      }
      aria-describedby={
        descriptionId
      }
      aria-busy={
        loading ||
        undefined
      }
      data-creative-admin-dashboard=""
      data-size={
        size
      }
      data-variant={
        variant
      }
      className={joinCreativeAdminDashboardClasses(
        "mx-auto w-full px-4 py-8",
        "sm:px-6 sm:py-10",
        "lg:px-8 lg:py-12",

        CREATIVE_ADMIN_DASHBOARD_SIZE_CLASSES[
          size
        ],

        CREATIVE_ADMIN_DASHBOARD_VARIANT_CLASSES[
          variant
        ],

        disabled &&
          "opacity-65",

        className,
      )}
    >
      {showHeader ? (
        <header
          className={joinCreativeAdminDashboardClasses(
            "flex flex-wrap items-start justify-between gap-5",

            headerClassName,
          )}
        >
          <div className="min-w-0 max-w-4xl">
            {normalizedAdministratorName ? (
              <p className="mb-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {copy.welcome},{" "}
                {normalizedAdministratorName}
              </p>
            ) : null}

            <h1
              id={
                headingId
              }
              className="text-3xl font-black tracking-tight sm:text-4xl"
            >
              {resolvedHeading}
            </h1>

            <p
              id={
                descriptionId
              }
              className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:text-base"
            >
              {resolvedDescription}
            </p>
          </div>

          {headerContent}
        </header>
      ) : null}

      {loading ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center gap-4">
          <CreativeSpinner
            decorative
            size="lg"
            variant="primary"
          />

          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {copy.loading}
          </p>
        </div>
      ) : normalizedError ? (
        <div
          role="alert"
          className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/[0.04] px-6 py-12 text-center dark:border-red-400/20 dark:bg-red-400/[0.04]"
        >
          {errorContent ?? (
            <>
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
                <CreativeDashboardErrorIcon />
              </span>

              <h2 className="mt-6 text-2xl font-black">
                {copy.errorTitle}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {normalizedError ||
                copy.errorDescription}
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          {showStatistics ? (
            <section
              aria-label={
                copy.statistics
              }
              className={joinCreativeAdminDashboardClasses(
                "mt-8 grid gap-4",
                "sm:grid-cols-2",
                "lg:grid-cols-3",
                "xl:grid-cols-6",

                statisticsClassName,
              )}
            >
              <CreativeDashboardStatisticCard
                label={
                  copy.totalItems
                }
                value={
                  statistics.totalItems
                }
                language={
                  language
                }
                tone="cyan"
                icon={
                  <CreativeDashboardDesignIcon />
                }
              />

              <CreativeDashboardStatisticCard
                label={
                  copy.publishedItems
                }
                value={
                  statistics.publishedItems
                }
                language={
                  language
                }
                tone="emerald"
                icon={
                  <CreativeDashboardPublishedIcon />
                }
              />

              <CreativeDashboardStatisticCard
                label={
                  copy.draftItems
                }
                value={
                  statistics.draftItems
                }
                language={
                  language
                }
                tone="zinc"
                icon={
                  <CreativeDashboardDraftIcon />
                }
              />

              <CreativeDashboardStatisticCard
                label={
                  copy.totalViews
                }
                value={
                  statistics.totalViews
                }
                language={
                  language
                }
                tone="violet"
                icon={
                  <CreativeDashboardViewsIcon />
                }
              />

              <CreativeDashboardStatisticCard
                label={
                  copy.totalLikes
                }
                value={
                  statistics.totalLikes
                }
                language={
                  language
                }
                tone="red"
                icon={
                  <CreativeDashboardLikesIcon />
                }
              />

              <CreativeDashboardStatisticCard
                label={
                  copy.totalDownloads
                }
                value={
                  statistics.totalDownloads
                }
                language={
                  language
                }
                tone="amber"
                icon={
                  <CreativeDashboardDownloadIcon />
                }
              />

              {statisticsContent}
            </section>
          ) : null}

          {showOperationalSummary ? (
            <section
              className={joinCreativeAdminDashboardClasses(
                "mt-8 rounded-3xl p-5 sm:p-6",

                CREATIVE_ADMIN_DASHBOARD_PANEL_CLASSES,
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black">
                    {copy.operationalSummary}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {totalPendingTasks >
                    0
                      ? copy.attentionRequired
                      : copy.noPendingTasks}
                  </p>
                </div>

                <span
                  className={joinCreativeAdminDashboardClasses(
                    "inline-flex min-h-11 items-center justify-center",
                    "rounded-2xl border px-4 py-2",
                    "text-lg font-black tabular-nums",

                    totalPendingTasks >
                      0
                      ? [
                          "border-amber-500/25",
                          "bg-amber-500/10",
                          "text-amber-700",

                          "dark:border-amber-400/25",
                          "dark:bg-amber-400/10",
                          "dark:text-amber-300",
                        ].join(
                          " ",
                        )
                      : [
                          "border-emerald-500/25",
                          "bg-emerald-500/10",
                          "text-emerald-700",

                          "dark:border-emerald-400/25",
                          "dark:bg-emerald-400/10",
                          "dark:text-emerald-300",
                        ].join(
                          " ",
                        ),
                  )}
                >
                  {totalPendingTasks}
                </span>
              </div>

              {totalPendingTasks >
              0 ? (
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <button
                    type="button"
                    disabled={
                      disabled ||
                      !onOpenRequests
                    }
                    onClick={
                      () => {
                        runCreativeAdminDashboardAction(
                          onOpenRequests,
                        );
                      }
                    }
                    className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-4 text-left text-cyan-700 outline-none transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:bg-cyan-500/10 focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-cyan-400/20 dark:bg-cyan-400/[0.06] dark:text-cyan-300"
                  >
                    <strong className="block text-2xl font-black">
                      {pendingRequests}
                    </strong>

                    <span className="mt-1 block text-sm font-semibold">
                      {copy.pendingRequests}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={
                      disabled ||
                      !onOpenOrders
                    }
                    onClick={
                      () => {
                        runCreativeAdminDashboardAction(
                          onOpenOrders,
                        );
                      }
                    }
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-left text-amber-700 outline-none transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-400/20 dark:bg-amber-400/[0.06] dark:text-amber-300"
                  >
                    <strong className="block text-2xl font-black">
                      {pendingOrders}
                    </strong>

                    <span className="mt-1 block text-sm font-semibold">
                      {copy.pendingOrders}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={
                      disabled ||
                      !onOpenComments
                    }
                    onClick={
                      () => {
                        runCreativeAdminDashboardAction(
                          onOpenComments,
                        );
                      }
                    }
                    className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-4 text-left text-violet-700 outline-none transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:bg-violet-500/10 focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-400/20 dark:bg-violet-400/[0.06] dark:text-violet-300"
                  >
                    <strong className="block text-2xl font-black">
                      {pendingComments}
                    </strong>

                    <span className="mt-1 block text-sm font-semibold">
                      {copy.pendingComments}
                    </span>
                  </button>
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4 text-sm font-semibold leading-6 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/[0.05] dark:text-emerald-300">
                  {copy.pendingTasksDescription}
                </p>
              )}
            </section>
          ) : null}

          {showQuickActions ? (
            <section
              className={joinCreativeAdminDashboardClasses(
                "mt-8",

                quickActionsClassName,
              )}
            >
              <h2 className="text-xl font-black">
                {copy.quickActions}
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {resolvedQuickActions.map(
                  (
                    action,
                  ) => {
                    const actionCopy =
                      getCreativeDashboardActionCopy(
                        action.id,
                        language,
                      );

                    const resolvedLabel =
                      normalizeCreativeAdminDashboardText(
                        action.label,
                      ) ||
                      actionCopy.label;

                    const resolvedActionDescription =
                      normalizeCreativeAdminDashboardText(
                        action.description,
                      ) ||
                      actionCopy.description;

                    const badgeCount =
                      normalizeCreativeAdminDashboardCount(
                        action.badge,
                      );

                    return (
                      <button
                        key={
                          action.id
                        }
                        type="button"
                        disabled={
                          disabled ||
                          action.disabled ||
                          !quickActionAvailable(
                            action.id,
                          )
                        }
                        onClick={
                          () => {
                            runQuickAction(
                              action.id,
                            );
                          }
                        }
                        className={joinCreativeAdminDashboardClasses(
                          "group relative min-h-44 overflow-hidden",
                          "rounded-3xl border p-5 text-left",
                          "outline-none transition-all duration-250",

                          CREATIVE_ADMIN_DASHBOARD_PANEL_CLASSES,

                          "enabled:hover:-translate-y-1",
                          "enabled:hover:border-emerald-500/25",
                          "enabled:hover:shadow-[0_20px_48px_rgba(15,23,42,0.13)]",

                          "focus-visible:ring-2",
                          "focus-visible:ring-emerald-500/60",

                          "disabled:cursor-not-allowed",
                          "disabled:opacity-50",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 transition-transform duration-200 group-enabled:group-hover:scale-105 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                            {action.icon ??
                            getCreativeDashboardActionIcon(
                              action.id,
                            )}
                          </span>

                          {badgeCount >
                          0 ? (
                            <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full border border-red-500/25 bg-red-500/10 px-2 text-xs font-black text-red-700 dark:border-red-400/25 dark:bg-red-400/10 dark:text-red-300">
                              {badgeCount}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-5 text-base font-black">
                          {resolvedLabel}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                          {resolvedActionDescription}
                        </p>
                      </button>
                    );
                  },
                )}

                {quickActionsContent}
              </div>
            </section>
          ) : null}

          {showRecentItems ? (
            <section
              className={joinCreativeAdminDashboardClasses(
                "mt-8 overflow-hidden rounded-3xl",

                CREATIVE_ADMIN_DASHBOARD_PANEL_CLASSES,

                recentItemsClassName,
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200/80 p-5 dark:border-white/10 sm:p-6">
                <div>
                  <h2 className="text-xl font-black">
                    {copy.recentItems}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {copy.recentDescription}
                  </p>
                </div>

                {onManageItems ? (
                  <button
                    type="button"
                    disabled={
                      disabled
                    }
                    onClick={
                      () => {
                        runCreativeAdminDashboardAction(
                          onManageItems,
                        );
                      }
                    }
                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 outline-none transition-colors duration-150 enabled:hover:bg-emerald-500/15 focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
                  >
                    {copy.manage}
                  </button>
                ) : null}
              </div>

              {recentItemsContent ? (
                <div className="p-5 sm:p-6">
                  {recentItemsContent}
                </div>
              ) : visibleRecentItems.length ===
                0 ? (
                <div className="flex min-h-48 items-center justify-center p-6 text-center">
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    {copy.noRecentItems}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-xs font-bold uppercase tracking-[0.08em] text-zinc-500 dark:border-white/10 dark:bg-white/[0.025] dark:text-zinc-400">
                        <th className="px-5 py-4">
                          {copy.title}
                        </th>

                        <th className="px-4 py-4">
                          {copy.type}
                        </th>

                        <th className="px-4 py-4">
                          {copy.status}
                        </th>

                        <th className="px-4 py-4">
                          {copy.category}
                        </th>

                        <th className="px-4 py-4">
                          {copy.updated}
                        </th>

                        <th className="px-4 py-4">
                          {copy.statistics}
                        </th>

                        <th className="px-5 py-4 text-right">
                          {copy.actions}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleRecentItems.map(
                        (
                          item,
                        ) => {
                          const normalizedTitle =
                            normalizeCreativeAdminDashboardText(
                              item.title,
                            ) ||
                            "FIXORA";

                          const normalizedCategory =
                            normalizeCreativeAdminDashboardText(
                              item.categoryLabel,
                            ) ||
                            copy.noCategory;

                          const normalizedDate =
                            normalizeCreativeAdminDashboardText(
                              item.updatedAtLabel,
                            ) ||
                            copy.noDate;

                          return (
                            <tr
                              key={
                                item.id
                              }
                              className="border-b border-zinc-200/70 transition-colors duration-150 last:border-b-0 hover:bg-emerald-500/[0.025] dark:border-white/10 dark:hover:bg-emerald-400/[0.025]"
                            >
                              <td className="px-5 py-4">
                                <div className="max-w-[280px]">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-bold">
                                      {normalizedTitle}
                                    </p>

                                    {item.featured ? (
                                      <span className="shrink-0 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.06em] text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300">
                                        {copy.featured}
                                      </span>
                                    ) : null}
                                  </div>

                                  {item.authorName ? (
                                    <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                                      {item.authorName}
                                    </p>
                                  ) : null}
                                </div>
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={joinCreativeAdminDashboardClasses(
                                    "inline-flex rounded-full border",
                                    "px-2.5 py-1.5",
                                    "text-[10px] font-black uppercase tracking-[0.07em]",

                                    getCreativeAdminDashboardTypeClasses(
                                      item.contentType,
                                    ),
                                  )}
                                >
                                  {getCreativeAdminDashboardTypeLabel(
                                    item.contentType,
                                    language,
                                  )}
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={joinCreativeAdminDashboardClasses(
                                    "inline-flex rounded-full border",
                                    "px-2.5 py-1.5",
                                    "text-[10px] font-black uppercase tracking-[0.07em]",

                                    getCreativeAdminDashboardStatusClasses(
                                      item.status,
                                    ),
                                  )}
                                >
                                  {getCreativeAdminDashboardStatusLabel(
                                    item.status,
                                    language,
                                  )}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                                {normalizedCategory}
                              </td>

                              <td className="px-4 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                {normalizedDate}
                              </td>

                              <td className="px-4 py-4">
                                <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                                  <p>
                                    {formatCreativeAdminDashboardCount(
                                      item.viewCount,
                                      language,
                                    )}{" "}
                                    {copy.views}
                                  </p>

                                  <p>
                                    {formatCreativeAdminDashboardCount(
                                      item.likeCount,
                                      language,
                                    )}{" "}
                                    {copy.likes}
                                  </p>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  {onOpenItem ? (
                                    <button
                                      type="button"
                                      disabled={
                                        disabled
                                      }
                                      onClick={
                                        () => {
                                          void onOpenItem(
                                            item,
                                          );
                                        }
                                      }
                                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100/80 px-3 py-2 text-xs font-bold text-zinc-700 outline-none transition-colors duration-150 enabled:hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-500/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200 dark:enabled:hover:bg-white/[0.10]"
                                    >
                                      {copy.open}
                                    </button>
                                  ) : null}

                                  {onEditItem ? (
                                    <button
                                      type="button"
                                      disabled={
                                        disabled
                                      }
                                      onClick={
                                        () => {
                                          void onEditItem(
                                            item,
                                          );
                                        }
                                      }
                                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-700 outline-none transition-colors duration-150 enabled:hover:bg-emerald-500/15 focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
                                    >
                                      {copy.edit}
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : null}

          {footerContent ? (
            <footer
              className={joinCreativeAdminDashboardClasses(
                "mt-8",

                footerClassName,
              )}
            >
              {footerContent}
            </footer>
          ) : null}
        </>
      )}
    </section>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeAdminDashboard;
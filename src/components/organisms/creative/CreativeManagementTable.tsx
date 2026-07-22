"use client";

/*
 * Tabla administrativa del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar las publicaciones del catálogo.
 * - Buscar, filtrar y ordenar publicaciones.
 * - Mostrar tipo, estado, categoría y estadísticas.
 * - Abrir y editar publicaciones.
 * - Publicar, ocultar, restaurar y archivar.
 * - Eliminar definitivamente cuando esté permitido.
 * - Mostrar vista adaptable para escritorio y móvil.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Acceso directo a Prisma.
 * - Confirmaciones modales.
 *
 * Todas las acciones son controladas por el componente padre.
 */

import {
  useId,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import type {
  CreativeContentType,
  CreativeCurrency,
  CreativeItemStatus,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeManagementTableLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeManagementTableSize =
  | "default"
  | "wide";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeManagementTableVariant =
  | "surface"
  | "dark";

/* =========================================================
   FILTROS
   ========================================================= */

export type CreativeManagementContentTypeFilter =
  | "ALL"
  | CreativeContentType;

export type CreativeManagementStatusFilter =
  | "ALL"
  | CreativeItemStatus;

/* =========================================================
   ORDENAMIENTO
   ========================================================= */

export type CreativeManagementSortValue =
  | "UPDATED_DESC"
  | "UPDATED_ASC"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "VIEWS_DESC";

/* =========================================================
   ACCIONES EN PROCESO
   ========================================================= */

export type CreativeManagementLoadingAction =
  | "OPEN"
  | "EDIT"
  | "PUBLISH"
  | "HIDE"
  | "RESTORE"
  | "ARCHIVE"
  | "DELETE"
  | null;

/* =========================================================
   OPCIÓN DE CATEGORÍA
   ========================================================= */

export interface CreativeManagementCategoryOption {
  value:
    string;

  label:
    string;

  disabled?:
    boolean;
}

/* =========================================================
   PUBLICACIÓN
   ========================================================= */

export interface CreativeManagementItem {
  id:
    string;

  title:
    string;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  categoryId?:
    string | null;

  categoryLabel?:
    string | null;

  authorName?:
    string | null;

  updatedAtLabel?:
    string | null;

  publishedAtLabel?:
    string | null;

  price?:
    number | null;

  currency?:
    CreativeCurrency | null;

  featured?:
    boolean;

  viewCount?:
    number | null;

  likeCount?:
    number | null;

  downloadCount?:
    number | null;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeManagementTableProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "children"
  > {
  language?:
    CreativeManagementTableLanguage;

  size?:
    CreativeManagementTableSize;

  variant?:
    CreativeManagementTableVariant;

  heading?:
    string | null;

  description?:
    string | null;

  items?:
    CreativeManagementItem[];

  totalItems?:
    number | null;

  loading?:
    boolean;

  error?:
    string | null;

  disabled?:
    boolean;

  /*
   * Búsqueda.
   */
  searchValue?:
    string;

  onSearchValueChange?:
    (
      value:
        string,
    ) => void;

  onSearch?:
    (
      value:
        string,
    ) => void | Promise<void>;

  /*
   * Filtros.
   */
  contentTypeFilter?:
    CreativeManagementContentTypeFilter;

  onContentTypeFilterChange?:
    (
      value:
        CreativeManagementContentTypeFilter,
    ) => void;

  statusFilter?:
    CreativeManagementStatusFilter;

  onStatusFilterChange?:
    (
      value:
        CreativeManagementStatusFilter,
    ) => void;

  categoryFilter?:
    string;

  categories?:
    CreativeManagementCategoryOption[];

  onCategoryFilterChange?:
    (
      value:
        string,
    ) => void;

  sortValue?:
    CreativeManagementSortValue;

  onSortChange?:
    (
      value:
        CreativeManagementSortValue,
    ) => void;

  onClearFilters?:
    () => void;

  /*
   * Acciones.
   */
  onCreateItem?:
    () => void | Promise<void>;

  onOpenItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onEditItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onPublishItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onHideItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onRestoreItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onArchiveItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onDeleteItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  canDeletePermanently?:
    boolean;

  loadingActionByItemId?:
    Partial<
      Record<
        string,
        CreativeManagementLoadingAction
      >
    >;

  /*
   * Paginación.
   */
  currentPage?:
    number;

  totalPages?:
    number;

  onPageChange?:
    (
      page:
        number,
    ) => void | Promise<void>;

  /*
   * Visibilidad.
   */
  showHeader?:
    boolean;

  showCreateButton?:
    boolean;

  showToolbar?:
    boolean;

  showResultsCount?:
    boolean;

  showStatistics?:
    boolean;

  showPagination?:
    boolean;

  /*
   * Contenido adicional.
   */
  headerContent?:
    ReactNode;

  toolbarContent?:
    ReactNode;

  emptyContent?:
    ReactNode;

  errorContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  headerClassName?:
    string;

  toolbarClassName?:
    string;

  tableClassName?:
    string;

  mobileListClassName?:
    string;

  paginationClassName?:
    string;

  footerClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_MANAGEMENT_TABLE_COPY = {
  es: {
    table:
      "Administración de publicaciones",

    heading:
      "Administrar diseños",

    description:
      "Busca, filtra y administra las publicaciones del catálogo de Diseño.",

    create:
      "Agregar diseño",

    creating:
      "Abriendo formulario...",

    searchLabel:
      "Buscar publicaciones",

    searchPlaceholder:
      "Buscar por título, autor o categoría...",

    search:
      "Buscar",

    searching:
      "Buscando...",

    contentType:
      "Tipo",

    allTypes:
      "Todos los tipos",

    free:
      "Gratis",

    paid:
      "Premium",

    portfolio:
      "Portafolio",

    status:
      "Estado",

    allStatuses:
      "Todos los estados",

    draft:
      "Borrador",

    published:
      "Publicado",

    hidden:
      "Oculto",

    archived:
      "Archivado",

    category:
      "Categoría",

    allCategories:
      "Todas las categorías",

    sort:
      "Ordenar",

    updatedDesc:
      "Actualizados recientemente",

    updatedAsc:
      "Actualizados anteriormente",

    titleAsc:
      "Título de A a Z",

    titleDesc:
      "Título de Z a A",

    viewsDesc:
      "Más visualizados",

    clearFilters:
      "Limpiar filtros",

    result:
      "resultado",

    results:
      "resultados",

    title:
      "Publicación",

    price:
      "Precio",

    statistics:
      "Estadísticas",

    updated:
      "Actualización",

    actions:
      "Acciones",

    views:
      "vistas",

    likes:
      "me gusta",

    downloads:
      "descargas",

    featured:
      "Destacado",

    noCategory:
      "Sin categoría",

    noAuthor:
      "Sin autor",

    noDate:
      "Sin fecha",

    consultPrice:
      "Consultar precio",

    open:
      "Abrir",

    opening:
      "Abriendo...",

    edit:
      "Editar",

    editing:
      "Abriendo edición...",

    publish:
      "Publicar",

    publishing:
      "Publicando...",

    hide:
      "Ocultar",

    hiding:
      "Ocultando...",

    restore:
      "Restaurar",

    restoring:
      "Restaurando...",

    archive:
      "Archivar",

    archiving:
      "Archivando...",

    delete:
      "Eliminar",

    deleting:
      "Eliminando...",

    loading:
      "Cargando publicaciones...",

    emptyTitle:
      "No se encontraron publicaciones",

    emptyDescription:
      "Cambia la búsqueda o limpia los filtros para ver otros resultados.",

    errorTitle:
      "No se pudieron cargar las publicaciones",

    errorDescription:
      "Ocurrió un problema al cargar la información administrativa.",

    previous:
      "Anterior",

    next:
      "Siguiente",

    page:
      "Página",

    of:
      "de",
  },

  en: {
    table:
      "Publication management",

    heading:
      "Manage designs",

    description:
      "Search, filter and manage Creative catalog publications.",

    create:
      "Add design",

    creating:
      "Opening form...",

    searchLabel:
      "Search publications",

    searchPlaceholder:
      "Search by title, author or category...",

    search:
      "Search",

    searching:
      "Searching...",

    contentType:
      "Type",

    allTypes:
      "All types",

    free:
      "Free",

    paid:
      "Premium",

    portfolio:
      "Portfolio",

    status:
      "Status",

    allStatuses:
      "All statuses",

    draft:
      "Draft",

    published:
      "Published",

    hidden:
      "Hidden",

    archived:
      "Archived",

    category:
      "Category",

    allCategories:
      "All categories",

    sort:
      "Sort",

    updatedDesc:
      "Recently updated",

    updatedAsc:
      "Oldest updated",

    titleAsc:
      "Title A to Z",

    titleDesc:
      "Title Z to A",

    viewsDesc:
      "Most viewed",

    clearFilters:
      "Clear filters",

    result:
      "result",

    results:
      "results",

    title:
      "Publication",

    price:
      "Price",

    statistics:
      "Statistics",

    updated:
      "Updated",

    actions:
      "Actions",

    views:
      "views",

    likes:
      "likes",

    downloads:
      "downloads",

    featured:
      "Featured",

    noCategory:
      "No category",

    noAuthor:
      "No author",

    noDate:
      "No date",

    consultPrice:
      "Request price",

    open:
      "Open",

    opening:
      "Opening...",

    edit:
      "Edit",

    editing:
      "Opening editor...",

    publish:
      "Publish",

    publishing:
      "Publishing...",

    hide:
      "Hide",

    hiding:
      "Hiding...",

    restore:
      "Restore",

    restoring:
      "Restoring...",

    archive:
      "Archive",

    archiving:
      "Archiving...",

    delete:
      "Delete",

    deleting:
      "Deleting...",

    loading:
      "Loading publications...",

    emptyTitle:
      "No publications found",

    emptyDescription:
      "Change the search or clear the filters to see other results.",

    errorTitle:
      "Publications could not be loaded",

    errorDescription:
      "A problem occurred while loading the administrative information.",

    previous:
      "Previous",

    next:
      "Next",

    page:
      "Page",

    of:
      "of",
  },
} as const;

/* =========================================================
   VALORES PERMITIDOS
   ========================================================= */

const CREATIVE_MANAGEMENT_CONTENT_TYPE_FILTERS:
  readonly CreativeManagementContentTypeFilter[] = [
    "ALL",
    "FREE",
    "PAID",
    "PORTFOLIO",
  ];

const CREATIVE_MANAGEMENT_STATUS_FILTERS:
  readonly CreativeManagementStatusFilter[] = [
    "ALL",
    "DRAFT",
    "PUBLISHED",
    "HIDDEN",
    "ARCHIVED",
  ];

const CREATIVE_MANAGEMENT_SORT_VALUES:
  readonly CreativeManagementSortValue[] = [
    "UPDATED_DESC",
    "UPDATED_ASC",
    "TITLE_ASC",
    "TITLE_DESC",
    "VIEWS_DESC",
  ];

/* =========================================================
   CLASES
   ========================================================= */

const CREATIVE_MANAGEMENT_SIZE_CLASSES = {
  default:
    "max-w-7xl",

  wide:
    "max-w-[1700px]",
} as const satisfies Record<
  CreativeManagementTableSize,
  string
>;

const CREATIVE_MANAGEMENT_VARIANT_CLASSES = {
  surface: [
    "text-zinc-950",
    "dark:text-white",
  ].join(
    " ",
  ),

  dark:
    "text-white",
} as const satisfies Record<
  CreativeManagementTableVariant,
  string
>;

const CREATIVE_MANAGEMENT_PANEL_CLASSES = [
  "border border-zinc-200/90",
  "bg-white/90",
  "shadow-[0_16px_48px_rgba(15,23,42,0.08)]",
  "backdrop-blur-xl",

  "dark:border-white/10",
  "dark:bg-zinc-950/85",
  "dark:shadow-[0_18px_52px_rgba(0,0,0,0.30)]",
].join(
  " ",
);

const CREATIVE_MANAGEMENT_FIELD_CLASSES = [
  "min-h-11",
  "w-full",
  "rounded-xl",
  "border border-zinc-200/90",
  "bg-white/90",
  "px-4 py-2.5",
  "text-sm text-zinc-900",
  "outline-none",
  "transition-all duration-200",

  "focus:border-emerald-500/45",
  "focus:ring-2",
  "focus:ring-emerald-500/15",

  "disabled:cursor-not-allowed",
  "disabled:opacity-50",

  "dark:border-white/10",
  "dark:bg-zinc-900/90",
  "dark:text-white",

  "dark:focus:border-emerald-400/45",
  "dark:focus:ring-emerald-400/15",
].join(
  " ",
);

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeManagementClasses(
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

function normalizeCreativeManagementText(
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

function normalizeCreativeManagementCount(
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

function normalizeCreativeManagementPage(
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
    return 1;
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

function isCreativeManagementContentTypeFilter(
  value:
    string,
): value is CreativeManagementContentTypeFilter {
  return CREATIVE_MANAGEMENT_CONTENT_TYPE_FILTERS.includes(
    value as CreativeManagementContentTypeFilter,
  );
}

function isCreativeManagementStatusFilter(
  value:
    string,
): value is CreativeManagementStatusFilter {
  return CREATIVE_MANAGEMENT_STATUS_FILTERS.includes(
    value as CreativeManagementStatusFilter,
  );
}

function isCreativeManagementSortValue(
  value:
    string,
): value is CreativeManagementSortValue {
  return CREATIVE_MANAGEMENT_SORT_VALUES.includes(
    value as CreativeManagementSortValue,
  );
}

function runCreativeManagementAction(
  action:
    (() => void | Promise<void>) |
    undefined,
): void {
  void action?.();
}

/* =========================================================
   FORMATEAR CONTADORES
   ========================================================= */

export function formatCreativeManagementCount(
  value:
    number | null | undefined,
  language:
    CreativeManagementTableLanguage = "es",
): string {
  const normalizedValue =
    normalizeCreativeManagementCount(
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

/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

export function formatCreativeManagementPrice(
  price:
    number | null | undefined,
  currency:
    CreativeCurrency | null | undefined,
  language:
    CreativeManagementTableLanguage,
): string {
  const copy =
    CREATIVE_MANAGEMENT_TABLE_COPY[
      language
    ];

  if (
    typeof price !==
      "number" ||
    !Number.isFinite(
      price,
    ) ||
    price <
      0
  ) {
    return copy.consultPrice;
  }

  if (
    !currency
  ) {
    return price.toFixed(
      2,
    );
  }

  try {
    return new Intl.NumberFormat(
      language ===
        "es"
        ? "es-PE"
        : "en-US",
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
      price,
    );
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
}

/* =========================================================
   ETIQUETAS
   ========================================================= */

function getCreativeManagementTypeLabel(
  contentType:
    CreativeContentType,
  language:
    CreativeManagementTableLanguage,
): string {
  const copy =
    CREATIVE_MANAGEMENT_TABLE_COPY[
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

function getCreativeManagementStatusLabel(
  status:
    CreativeItemStatus,
  language:
    CreativeManagementTableLanguage,
): string {
  const copy =
    CREATIVE_MANAGEMENT_TABLE_COPY[
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

function getCreativeManagementTypeClasses(
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

function getCreativeManagementStatusClasses(
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
   BOTÓN DE ACCIÓN
   ========================================================= */

type CreativeManagementButtonTone =
  | "neutral"
  | "primary"
  | "warning"
  | "restore"
  | "archive"
  | "danger";

interface CreativeManagementActionButtonProps {
  label:
    string;

  loadingLabel:
    string;

  loading:
    boolean;

  disabled:
    boolean;

  tone:
    CreativeManagementButtonTone;

  onPress:
    () => void | Promise<void>;
}

const CREATIVE_MANAGEMENT_BUTTON_TONE_CLASSES = {
  neutral: [
    "border-zinc-200",
    "bg-zinc-100/80",
    "text-zinc-700",

    "enabled:hover:bg-zinc-200",

    "dark:border-white/10",
    "dark:bg-white/[0.06]",
    "dark:text-zinc-200",

    "dark:enabled:hover:bg-white/[0.10]",
  ].join(
    " ",
  ),

  primary: [
    "border-emerald-500/25",
    "bg-emerald-500/10",
    "text-emerald-700",

    "enabled:hover:bg-emerald-500/20",

    "dark:border-emerald-400/25",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  warning: [
    "border-amber-500/25",
    "bg-amber-500/10",
    "text-amber-700",

    "enabled:hover:bg-amber-500/20",

    "dark:border-amber-400/25",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  restore: [
    "border-cyan-500/25",
    "bg-cyan-500/10",
    "text-cyan-700",

    "enabled:hover:bg-cyan-500/20",

    "dark:border-cyan-400/25",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(
    " ",
  ),

  archive: [
    "border-violet-500/25",
    "bg-violet-500/10",
    "text-violet-700",

    "enabled:hover:bg-violet-500/20",

    "dark:border-violet-400/25",
    "dark:bg-violet-400/10",
    "dark:text-violet-300",
  ].join(
    " ",
  ),

  danger: [
    "border-red-500/25",
    "bg-red-500/10",
    "text-red-700",

    "enabled:hover:bg-red-500",
    "enabled:hover:text-white",

    "dark:border-red-400/25",
    "dark:bg-red-400/10",
    "dark:text-red-300",

    "dark:enabled:hover:bg-red-500",
    "dark:enabled:hover:text-white",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeManagementButtonTone,
  string
>;

function CreativeManagementActionButton({
  label,
  loadingLabel,
  loading,
  disabled,
  tone,
  onPress,
}: CreativeManagementActionButtonProps) {
  return (
    <button
      type="button"
      aria-busy={
        loading ||
        undefined
      }
      disabled={
        disabled
      }
      onClick={
        () => {
          runCreativeManagementAction(
            onPress,
          );
        }
      }
      className={joinCreativeManagementClasses(
        "inline-flex min-h-9 items-center justify-center gap-2",
        "rounded-lg border px-3 py-2",
        "text-xs font-bold",
        "outline-none transition-all duration-200",

        "enabled:hover:-translate-y-0.5",
        "enabled:active:translate-y-0",
        "enabled:active:scale-[0.98]",

        "focus-visible:ring-2",
        "focus-visible:ring-emerald-500/50",

        "disabled:cursor-not-allowed",
        "disabled:opacity-45",

        CREATIVE_MANAGEMENT_BUTTON_TONE_CLASSES[
          tone
        ],
      )}
    >
      {loading ? (
        <CreativeSpinner
          decorative
          size="sm"
          variant="neutral"
        />
      ) : null}

      <span>
        {loading
          ? loadingLabel
          : label}
      </span>
    </button>
  );
}

/* =========================================================
   ACCIONES DE UNA PUBLICACIÓN
   ========================================================= */

interface CreativeManagementItemActionsProps {
  item:
    CreativeManagementItem;

  language:
    CreativeManagementTableLanguage;

  disabled:
    boolean;

  loadingAction:
    CreativeManagementLoadingAction;

  canDeletePermanently:
    boolean;

  onOpenItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onEditItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onPublishItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onHideItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onRestoreItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onArchiveItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;

  onDeleteItem?:
    (
      item:
        CreativeManagementItem,
    ) => void | Promise<void>;
}

function CreativeManagementItemActions({
  item,
  language,
  disabled,
  loadingAction,
  canDeletePermanently,
  onOpenItem,
  onEditItem,
  onPublishItem,
  onHideItem,
  onRestoreItem,
  onArchiveItem,
  onDeleteItem,
}: CreativeManagementItemActionsProps) {
  const copy =
    CREATIVE_MANAGEMENT_TABLE_COPY[
      language
    ];

  const anyLoading =
    loadingAction !==
    null;

  const openLoading =
    loadingAction ===
    "OPEN";

  const editLoading =
    loadingAction ===
    "EDIT";

  const publishLoading =
    loadingAction ===
    "PUBLISH";

  const hideLoading =
    loadingAction ===
    "HIDE";

  const restoreLoading =
    loadingAction ===
    "RESTORE";

  const archiveLoading =
    loadingAction ===
    "ARCHIVE";

  const deleteLoading =
    loadingAction ===
    "DELETE";

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {onOpenItem ? (
        <CreativeManagementActionButton
          label={
            copy.open
          }
          loadingLabel={
            copy.opening
          }
          loading={
            openLoading
          }
          disabled={
            disabled ||
            (
              anyLoading &&
              !openLoading
            )
          }
          tone="neutral"
          onPress={
            () =>
              onOpenItem(
                item,
              )
          }
        />
      ) : null}

      {onEditItem ? (
        <CreativeManagementActionButton
          label={
            copy.edit
          }
          loadingLabel={
            copy.editing
          }
          loading={
            editLoading
          }
          disabled={
            disabled ||
            (
              anyLoading &&
              !editLoading
            )
          }
          tone="primary"
          onPress={
            () =>
              onEditItem(
                item,
              )
          }
        />
      ) : null}

      {item.status !==
        "PUBLISHED" &&
      item.status !==
        "ARCHIVED" &&
      onPublishItem ? (
        <CreativeManagementActionButton
          label={
            copy.publish
          }
          loadingLabel={
            copy.publishing
          }
          loading={
            publishLoading
          }
          disabled={
            disabled ||
            (
              anyLoading &&
              !publishLoading
            )
          }
          tone="primary"
          onPress={
            () =>
              onPublishItem(
                item,
              )
          }
        />
      ) : null}

      {item.status ===
        "PUBLISHED" &&
      onHideItem ? (
        <CreativeManagementActionButton
          label={
            copy.hide
          }
          loadingLabel={
            copy.hiding
          }
          loading={
            hideLoading
          }
          disabled={
            disabled ||
            (
              anyLoading &&
              !hideLoading
            )
          }
          tone="warning"
          onPress={
            () =>
              onHideItem(
                item,
              )
          }
        />
      ) : null}

      {(
        item.status ===
          "HIDDEN" ||
        item.status ===
          "ARCHIVED"
      ) &&
      onRestoreItem ? (
        <CreativeManagementActionButton
          label={
            copy.restore
          }
          loadingLabel={
            copy.restoring
          }
          loading={
            restoreLoading
          }
          disabled={
            disabled ||
            (
              anyLoading &&
              !restoreLoading
            )
          }
          tone="restore"
          onPress={
            () =>
              onRestoreItem(
                item,
              )
          }
        />
      ) : null}

      {item.status !==
        "ARCHIVED" &&
      onArchiveItem ? (
        <CreativeManagementActionButton
          label={
            copy.archive
          }
          loadingLabel={
            copy.archiving
          }
          loading={
            archiveLoading
          }
          disabled={
            disabled ||
            (
              anyLoading &&
              !archiveLoading
            )
          }
          tone="archive"
          onPress={
            () =>
              onArchiveItem(
                item,
              )
          }
        />
      ) : null}

      {canDeletePermanently &&
      onDeleteItem ? (
        <CreativeManagementActionButton
          label={
            copy.delete
          }
          loadingLabel={
            copy.deleting
          }
          loading={
            deleteLoading
          }
          disabled={
            disabled ||
            (
              anyLoading &&
              !deleteLoading
            )
          }
          tone="danger"
          onPress={
            () =>
              onDeleteItem(
                item,
              )
          }
        />
      ) : null}
    </div>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeManagementTable({
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

  items =
    [],

  totalItems =
    null,

  loading =
    false,

  error =
    null,

  disabled =
    false,

  searchValue =
    "",

  onSearchValueChange,

  onSearch,

  contentTypeFilter =
    "ALL",

  onContentTypeFilterChange,

  statusFilter =
    "ALL",

  onStatusFilterChange,

  categoryFilter =
    "",

  categories =
    [],

  onCategoryFilterChange,

  sortValue =
    "UPDATED_DESC",

  onSortChange,

  onClearFilters,

  onCreateItem,

  onOpenItem,

  onEditItem,

  onPublishItem,

  onHideItem,

  onRestoreItem,

  onArchiveItem,

  onDeleteItem,

  canDeletePermanently =
    false,

  loadingActionByItemId =
    {},

  currentPage =
    1,

  totalPages =
    1,

  onPageChange,

  showHeader =
    true,

  showCreateButton =
    true,

  showToolbar =
    true,

  showResultsCount =
    true,

  showStatistics =
    true,

  showPagination =
    true,

  headerContent =
    null,

  toolbarContent =
    null,

  emptyContent =
    null,

  errorContent =
    null,

  footerContent =
    null,

  headerClassName,

  toolbarClassName,

  tableClassName,

  mobileListClassName,

  paginationClassName,

  footerClassName,

  className,

  "aria-label":
    ariaLabel,

  ...sectionProps
}: CreativeManagementTableProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_MANAGEMENT_TABLE_COPY[
      language
    ];

  const resolvedHeading =
    normalizeCreativeManagementText(
      heading,
    ) ||
    copy.heading;

  const resolvedDescription =
    normalizeCreativeManagementText(
      description,
    ) ||
    copy.description;

  const normalizedError =
    normalizeCreativeManagementText(
      error,
    );

  const normalizedTotalItems =
    totalItems ===
      null
      ? items.length
      : normalizeCreativeManagementCount(
          totalItems,
        );

  const normalizedTotalPages =
    Math.max(
      1,
      normalizeCreativeManagementCount(
        totalPages,
      ),
    );

  const normalizedCurrentPage =
    normalizeCreativeManagementPage(
      currentPage,
      normalizedTotalPages,
    );

  const resultLabel =
    normalizedTotalItems ===
      1
      ? copy.result
      : copy.results;

  const interactionDisabled =
    disabled ||
    loading;

  const searchActive =
    Boolean(
      normalizeCreativeManagementText(
        searchValue,
      ),
    );

  const filtersActive =
    searchActive ||
    contentTypeFilter !==
      "ALL" ||
    statusFilter !==
      "ALL" ||
    Boolean(
      categoryFilter,
    );

  const headingId =
    `creative-management-heading-${generatedId}`;

  const descriptionId =
    `creative-management-description-${generatedId}`;

  const searchId =
    `creative-management-search-${generatedId}`;

  const handleSearchSubmit =
    (
      event:
        FormEvent<HTMLFormElement>,
    ): void => {
      event.preventDefault();

      if (
        interactionDisabled ||
        !onSearch
      ) {
        return;
      }

      runCreativeManagementAction(
        () =>
          onSearch(
            searchValue,
          ),
      );
    };

  const handleContentTypeChange =
    (
      event:
        ChangeEvent<HTMLSelectElement>,
    ): void => {
      const nextValue =
        event.currentTarget.value;

      if (
        isCreativeManagementContentTypeFilter(
          nextValue,
        )
      ) {
        onContentTypeFilterChange?.(
          nextValue,
        );
      }
    };

  const handleStatusChange =
    (
      event:
        ChangeEvent<HTMLSelectElement>,
    ): void => {
      const nextValue =
        event.currentTarget.value;

      if (
        isCreativeManagementStatusFilter(
          nextValue,
        )
      ) {
        onStatusFilterChange?.(
          nextValue,
        );
      }
    };

  const handleSortChange =
    (
      event:
        ChangeEvent<HTMLSelectElement>,
    ): void => {
      const nextValue =
        event.currentTarget.value;

      if (
        isCreativeManagementSortValue(
          nextValue,
        )
      ) {
        onSortChange?.(
          nextValue,
        );
      }
    };

  const renderItemActions =
    (
      item:
        CreativeManagementItem,
    ) => (
      <CreativeManagementItemActions
        item={
          item
        }
        language={
          language
        }
        disabled={
          interactionDisabled
        }
        loadingAction={
          loadingActionByItemId[
            item.id
          ] ??
          null
        }
        canDeletePermanently={
          canDeletePermanently
        }
        onOpenItem={
          onOpenItem
        }
        onEditItem={
          onEditItem
        }
        onPublishItem={
          onPublishItem
        }
        onHideItem={
          onHideItem
        }
        onRestoreItem={
          onRestoreItem
        }
        onArchiveItem={
          onArchiveItem
        }
        onDeleteItem={
          onDeleteItem
        }
      />
    );

  return (
    <section
      {...sectionProps}
      aria-label={
        ariaLabel ??
        copy.table
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
      data-creative-management-table=""
      data-size={
        size
      }
      data-variant={
        variant
      }
      className={joinCreativeManagementClasses(
        "mx-auto w-full px-4 py-8",
        "sm:px-6 sm:py-10",
        "lg:px-8 lg:py-12",

        CREATIVE_MANAGEMENT_SIZE_CLASSES[
          size
        ],

        CREATIVE_MANAGEMENT_VARIANT_CLASSES[
          variant
        ],

        className,
      )}
    >
      {showHeader ? (
        <header
          className={joinCreativeManagementClasses(
            "flex flex-wrap items-start justify-between gap-5",

            headerClassName,
          )}
        >
          <div className="min-w-0 max-w-4xl">
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

          <div className="flex flex-wrap items-center gap-3">
            {headerContent}

            {showCreateButton &&
            onCreateItem ? (
              <button
                type="button"
                disabled={
                  interactionDisabled
                }
                onClick={
                  () => {
                    runCreativeManagementAction(
                      onCreateItem,
                    );
                  }
                }
                className={[
                  "inline-flex min-h-12 items-center justify-center",
                  "rounded-2xl border",
                  "border-emerald-500/25",
                  "bg-gradient-to-r",
                  "from-emerald-500",
                  "to-green-600",
                  "px-5 py-3",
                  "text-sm font-black text-white",
                  "outline-none transition-all duration-200",

                  "enabled:hover:-translate-y-0.5",
                  "enabled:hover:from-emerald-400",
                  "enabled:hover:to-emerald-600",
                  "enabled:hover:shadow-[0_14px_34px_rgba(16,185,129,0.25)]",

                  "focus-visible:ring-2",
                  "focus-visible:ring-emerald-500/60",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-45",
                ].join(
                  " ",
                )}
              >
                {copy.create}
              </button>
            ) : null}
          </div>
        </header>
      ) : null}

      {showToolbar ? (
        <div
          className={joinCreativeManagementClasses(
            "mt-8 rounded-3xl p-4 sm:p-5",

            CREATIVE_MANAGEMENT_PANEL_CLASSES,

            toolbarClassName,
          )}
        >
          <form
            onSubmit={
              handleSearchSubmit
            }
            className="grid gap-3 lg:grid-cols-[minmax(240px,1.6fr)_repeat(4,minmax(160px,0.8fr))_auto]"
          >
            <div>
              <label
                htmlFor={
                  searchId
                }
                className="sr-only"
              >
                {copy.searchLabel}
              </label>

              <input
                id={
                  searchId
                }
                type="search"
                value={
                  searchValue
                }
                disabled={
                  interactionDisabled ||
                  !onSearchValueChange
                }
                placeholder={
                  copy.searchPlaceholder
                }
                onChange={
                  (
                    event,
                  ) => {
                    onSearchValueChange?.(
                      event.currentTarget.value,
                    );
                  }
                }
                className={
                  CREATIVE_MANAGEMENT_FIELD_CLASSES
                }
              />
            </div>

            <select
              value={
                contentTypeFilter
              }
              disabled={
                interactionDisabled ||
                !onContentTypeFilterChange
              }
              aria-label={
                copy.contentType
              }
              onChange={
                handleContentTypeChange
              }
              className={
                CREATIVE_MANAGEMENT_FIELD_CLASSES
              }
            >
              <option value="ALL">
                {copy.allTypes}
              </option>

              <option value="FREE">
                {copy.free}
              </option>

              <option value="PAID">
                {copy.paid}
              </option>

              <option value="PORTFOLIO">
                {copy.portfolio}
              </option>
            </select>

            <select
              value={
                statusFilter
              }
              disabled={
                interactionDisabled ||
                !onStatusFilterChange
              }
              aria-label={
                copy.status
              }
              onChange={
                handleStatusChange
              }
              className={
                CREATIVE_MANAGEMENT_FIELD_CLASSES
              }
            >
              <option value="ALL">
                {copy.allStatuses}
              </option>

              <option value="DRAFT">
                {copy.draft}
              </option>

              <option value="PUBLISHED">
                {copy.published}
              </option>

              <option value="HIDDEN">
                {copy.hidden}
              </option>

              <option value="ARCHIVED">
                {copy.archived}
              </option>
            </select>

            <select
              value={
                categoryFilter
              }
              disabled={
                interactionDisabled ||
                !onCategoryFilterChange
              }
              aria-label={
                copy.category
              }
              onChange={
                (
                  event,
                ) => {
                  onCategoryFilterChange?.(
                    event.currentTarget.value,
                  );
                }
              }
              className={
                CREATIVE_MANAGEMENT_FIELD_CLASSES
              }
            >
              <option value="">
                {copy.allCategories}
              </option>

              {categories.map(
                (
                  category,
                ) => (
                  <option
                    key={
                      category.value
                    }
                    value={
                      category.value
                    }
                    disabled={
                      category.disabled
                    }
                  >
                    {category.label}
                  </option>
                ),
              )}
            </select>

            <select
              value={
                sortValue
              }
              disabled={
                interactionDisabled ||
                !onSortChange
              }
              aria-label={
                copy.sort
              }
              onChange={
                handleSortChange
              }
              className={
                CREATIVE_MANAGEMENT_FIELD_CLASSES
              }
            >
              <option value="UPDATED_DESC">
                {copy.updatedDesc}
              </option>

              <option value="UPDATED_ASC">
                {copy.updatedAsc}
              </option>

              <option value="TITLE_ASC">
                {copy.titleAsc}
              </option>

              <option value="TITLE_DESC">
                {copy.titleDesc}
              </option>

              <option value="VIEWS_DESC">
                {copy.viewsDesc}
              </option>
            </select>

            <button
              type="submit"
              disabled={
                interactionDisabled ||
                !onSearch
              }
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-700 outline-none transition-colors duration-150 enabled:hover:bg-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
            >
              {copy.search}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {showResultsCount ? (
              <p
                aria-live="polite"
                className="text-sm font-bold text-zinc-600 dark:text-zinc-300"
              >
                {normalizedTotalItems}{" "}
                {resultLabel}
              </p>
            ) : (
              <span />
            )}

            <div className="flex flex-wrap items-center gap-3">
              {toolbarContent}

              {filtersActive &&
              onClearFilters ? (
                <button
                  type="button"
                  disabled={
                    interactionDisabled
                  }
                  onClick={
                    onClearFilters
                  }
                  className="inline-flex min-h-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100/80 px-3 py-2 text-xs font-bold text-zinc-700 outline-none transition-colors duration-150 enabled:hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-500/40 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200 dark:enabled:hover:bg-white/[0.10]"
                >
                  {copy.clearFilters}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={joinCreativeManagementClasses(
          "mt-6 overflow-hidden rounded-3xl",

          CREATIVE_MANAGEMENT_PANEL_CLASSES,
        )}
      >
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
            className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center"
          >
            {errorContent ?? (
              <>
                <h2 className="text-xl font-black text-red-600 dark:text-red-300">
                  {copy.errorTitle}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {normalizedError ||
                  copy.errorDescription}
                </p>
              </>
            )}
          </div>
        ) : items.length ===
          0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center">
            {emptyContent ?? (
              <>
                <h2 className="text-xl font-black">
                  {copy.emptyTitle}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {copy.emptyDescription}
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <div
              className={joinCreativeManagementClasses(
                "hidden overflow-x-auto lg:block",

                tableClassName,
              )}
            >
              <table className="w-full min-w-[1200px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-xs font-bold uppercase tracking-[0.08em] text-zinc-500 dark:border-white/10 dark:bg-white/[0.025] dark:text-zinc-400">
                    <th className="px-5 py-4">
                      {copy.title}
                    </th>

                    <th className="px-4 py-4">
                      {copy.contentType}
                    </th>

                    <th className="px-4 py-4">
                      {copy.status}
                    </th>

                    <th className="px-4 py-4">
                      {copy.category}
                    </th>

                    <th className="px-4 py-4">
                      {copy.price}
                    </th>

                    {showStatistics ? (
                      <th className="px-4 py-4">
                        {copy.statistics}
                      </th>
                    ) : null}

                    <th className="px-4 py-4">
                      {copy.updated}
                    </th>

                    <th className="px-5 py-4 text-right">
                      {copy.actions}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map(
                    (
                      item,
                    ) => {
                      const normalizedTitle =
                        normalizeCreativeManagementText(
                          item.title,
                        ) ||
                        "FIXORA";

                      const normalizedCategory =
                        normalizeCreativeManagementText(
                          item.categoryLabel,
                        ) ||
                        copy.noCategory;

                      const normalizedAuthor =
                        normalizeCreativeManagementText(
                          item.authorName,
                        ) ||
                        copy.noAuthor;

                      const normalizedUpdatedAt =
                        normalizeCreativeManagementText(
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
                            <div className="max-w-[300px]">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-black">
                                  {normalizedTitle}
                                </p>

                                {item.featured ? (
                                  <span className="shrink-0 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.06em] text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300">
                                    {copy.featured}
                                  </span>
                                ) : null}
                              </div>

                              <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                                {normalizedAuthor}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={joinCreativeManagementClasses(
                                "inline-flex rounded-full border",
                                "px-2.5 py-1.5",
                                "text-[10px] font-black uppercase tracking-[0.07em]",

                                getCreativeManagementTypeClasses(
                                  item.contentType,
                                ),
                              )}
                            >
                              {getCreativeManagementTypeLabel(
                                item.contentType,
                                language,
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={joinCreativeManagementClasses(
                                "inline-flex rounded-full border",
                                "px-2.5 py-1.5",
                                "text-[10px] font-black uppercase tracking-[0.07em]",

                                getCreativeManagementStatusClasses(
                                  item.status,
                                ),
                              )}
                            >
                              {getCreativeManagementStatusLabel(
                                item.status,
                                language,
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                            {normalizedCategory}
                          </td>

                          <td className="px-4 py-4 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                            {item.contentType ===
                            "FREE"
                              ? copy.free
                              : item.contentType ===
                                  "PORTFOLIO"
                                ? "—"
                                : formatCreativeManagementPrice(
                                    item.price,
                                    item.currency,
                                    language,
                                  )}
                          </td>

                          {showStatistics ? (
                            <td className="px-4 py-4">
                              <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                                <p>
                                  {formatCreativeManagementCount(
                                    item.viewCount,
                                    language,
                                  )}{" "}
                                  {copy.views}
                                </p>

                                <p>
                                  {formatCreativeManagementCount(
                                    item.likeCount,
                                    language,
                                  )}{" "}
                                  {copy.likes}
                                </p>

                                <p>
                                  {formatCreativeManagementCount(
                                    item.downloadCount,
                                    language,
                                  )}{" "}
                                  {copy.downloads}
                                </p>
                              </div>
                            </td>
                          ) : null}

                          <td className="px-4 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                            {normalizedUpdatedAt}
                          </td>

                          <td className="px-5 py-4">
                            {renderItemActions(
                              item,
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>

            <div
              className={joinCreativeManagementClasses(
                "space-y-4 p-4 lg:hidden",

                mobileListClassName,
              )}
            >
              {items.map(
                (
                  item,
                ) => (
                  <article
                    key={
                      item.id
                    }
                    className="rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-4 dark:border-white/10 dark:bg-white/[0.025]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h2 className="break-words text-base font-black">
                          {normalizeCreativeManagementText(
                            item.title,
                          ) ||
                          "FIXORA"}
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {normalizeCreativeManagementText(
                            item.authorName,
                          ) ||
                          copy.noAuthor}
                        </p>
                      </div>

                      {item.featured ? (
                        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.06em] text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300">
                          {copy.featured}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={joinCreativeManagementClasses(
                          "rounded-full border px-2.5 py-1.5",
                          "text-[10px] font-black uppercase tracking-[0.07em]",

                          getCreativeManagementTypeClasses(
                            item.contentType,
                          ),
                        )}
                      >
                        {getCreativeManagementTypeLabel(
                          item.contentType,
                          language,
                        )}
                      </span>

                      <span
                        className={joinCreativeManagementClasses(
                          "rounded-full border px-2.5 py-1.5",
                          "text-[10px] font-black uppercase tracking-[0.07em]",

                          getCreativeManagementStatusClasses(
                            item.status,
                          ),
                        )}
                      >
                        {getCreativeManagementStatusLabel(
                          item.status,
                          language,
                        )}
                      </span>
                    </div>

                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500">
                          {copy.category}
                        </dt>

                        <dd className="mt-1 text-sm font-semibold">
                          {normalizeCreativeManagementText(
                            item.categoryLabel,
                          ) ||
                          copy.noCategory}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500">
                          {copy.updated}
                        </dt>

                        <dd className="mt-1 text-sm font-semibold">
                          {normalizeCreativeManagementText(
                            item.updatedAtLabel,
                          ) ||
                          copy.noDate}
                        </dd>
                      </div>
                    </dl>

                    {showStatistics ? (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-xl border border-zinc-200/80 bg-white/70 p-3 text-center dark:border-white/10 dark:bg-white/[0.03]">
                          <strong className="block text-sm">
                            {formatCreativeManagementCount(
                              item.viewCount,
                              language,
                            )}
                          </strong>

                          <span className="mt-1 block text-[10px] text-zinc-500">
                            {copy.views}
                          </span>
                        </div>

                        <div className="rounded-xl border border-zinc-200/80 bg-white/70 p-3 text-center dark:border-white/10 dark:bg-white/[0.03]">
                          <strong className="block text-sm">
                            {formatCreativeManagementCount(
                              item.likeCount,
                              language,
                            )}
                          </strong>

                          <span className="mt-1 block text-[10px] text-zinc-500">
                            {copy.likes}
                          </span>
                        </div>

                        <div className="rounded-xl border border-zinc-200/80 bg-white/70 p-3 text-center dark:border-white/10 dark:bg-white/[0.03]">
                          <strong className="block text-sm">
                            {formatCreativeManagementCount(
                              item.downloadCount,
                              language,
                            )}
                          </strong>

                          <span className="mt-1 block text-[10px] text-zinc-500">
                            {copy.downloads}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 border-t border-zinc-200/80 pt-4 dark:border-white/10">
                      {renderItemActions(
                        item,
                      )}
                    </div>
                  </article>
                ),
              )}
            </div>
          </>
        )}
      </div>

      {showPagination &&
      !loading &&
      !normalizedError &&
      items.length >
        0 &&
      normalizedTotalPages >
        1 ? (
        <nav
          aria-label={
            `${copy.page} ${normalizedCurrentPage} ${copy.of} ${normalizedTotalPages}`
          }
          className={joinCreativeManagementClasses(
            "mt-6 flex flex-wrap items-center justify-center gap-3",

            paginationClassName,
          )}
        >
          <button
            type="button"
            disabled={
              interactionDisabled ||
              normalizedCurrentPage <=
                1 ||
              !onPageChange
            }
            onClick={
              () => {
                runCreativeManagementAction(
                  () =>
                    onPageChange?.(
                      normalizedCurrentPage -
                      1,
                    ),
                );
              }
            }
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-bold text-zinc-700 outline-none transition-colors duration-150 enabled:hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-500/40 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-zinc-950/85 dark:text-zinc-200 dark:enabled:hover:bg-white/[0.08]"
          >
            {copy.previous}
          </button>

          <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-black text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
            {copy.page}{" "}
            {normalizedCurrentPage}{" "}
            {copy.of}{" "}
            {normalizedTotalPages}
          </span>

          <button
            type="button"
            disabled={
              interactionDisabled ||
              normalizedCurrentPage >=
                normalizedTotalPages ||
              !onPageChange
            }
            onClick={
              () => {
                runCreativeManagementAction(
                  () =>
                    onPageChange?.(
                      normalizedCurrentPage +
                      1,
                    ),
                );
              }
            }
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-bold text-zinc-700 outline-none transition-colors duration-150 enabled:hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-500/40 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-zinc-950/85 dark:text-zinc-200 dark:enabled:hover:bg-white/[0.08]"
          >
            {copy.next}
          </button>
        </nav>
      ) : null}

      {footerContent ? (
        <footer
          className={joinCreativeManagementClasses(
            "mt-6",

            footerClassName,
          )}
        >
          {footerContent}
        </footer>
      ) : null}
    </section>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeManagementTable;
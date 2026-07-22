/*
 * Tipos del visor profesional del módulo Diseño / Creative.
 *
 * Este archivo define exclusivamente:
 * - Apertura y cierre del visor.
 * - Zoom y desplazamiento de la imagen.
 * - Pantalla completa.
 * - Navegación entre publicaciones.
 * - Estado del panel lateral.
 * - Acciones disponibles para visitantes, usuarios y administradores.
 * - Adaptación del visor para escritorio, tableta y móvil.
 *
 * No contiene componentes React, acceso a Prisma,
 * llamadas HTTP ni lógica de almacenamiento.
 */

import type {
  CreativeAuthorSummary,
  CreativeCategoryId,
  CreativeContentType,
  CreativeImageAsset,
  CreativeItemAccess,
  CreativeItemId,
  CreativeItemMetrics,
  CreativeItemSlug,
  CreativeItemStatus,
  CreativePaymentMethod,
  CreativePrice,
  CreativeRequestKind,
  CreativeToolId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   MODO DE APERTURA DEL VISOR
   ========================================================= */

/*
 * MODAL:
 * El visor se abre encima del catálogo.
 *
 * PAGE:
 * El visor ocupa una página independiente.
 *
 * INTERCEPTED_ROUTE:
 * Next.js intercepta la navegación y muestra el visor
 * como una ruta modal conservando el catálogo detrás.
 */
export type CreativeViewerMode =
  | "MODAL"
  | "PAGE"
  | "INTERCEPTED_ROUTE";

/* =========================================================
   ESTADO GENERAL DEL VISOR
   ========================================================= */

export type CreativeViewerStatus =
  | "CLOSED"
  | "OPENING"
  | "LOADING"
  | "READY"
  | "ERROR"
  | "CLOSING";

/* =========================================================
   ORIGEN DE APERTURA
   ========================================================= */

export type CreativeViewerSource =
  | "CATALOG"
  | "RELATED_ITEM"
  | "DIRECT_LINK"
  | "SHARED_LINK"
  | "FAVORITES"
  | "ADMIN"
  | "SEARCH";

/* =========================================================
   MOTIVO DE CIERRE
   ========================================================= */

export type CreativeViewerCloseReason =
  | "BACK_BUTTON"
  | "ESCAPE_KEY"
  | "BROWSER_BACK"
  | "ITEM_CHANGED"
  | "AUTHENTICATION_REDIRECT"
  | "ADMIN_ACTION"
  | "PROGRAMMATIC";

/* =========================================================
   DISEÑO RESPONSIVE
   ========================================================= */

export type CreativeViewerLayout =
  | "SPLIT"
  | "STACKED";

export type CreativeViewerDevice =
  | "MOBILE"
  | "TABLET"
  | "DESKTOP";

export interface CreativeViewerResponsiveState {
  device:
    CreativeViewerDevice;

  layout:
    CreativeViewerLayout;

  sidebarVisible:
    boolean;

  toolbarCompact:
    boolean;

  commentsInitiallyCollapsed:
    boolean;
}

/* =========================================================
   PUNTOS, TAMAÑOS Y LÍMITES
   ========================================================= */

export interface CreativeViewerPoint {
  x: number;
  y: number;
}

export interface CreativeViewerSize {
  width: number;
  height: number;
}

export interface CreativeViewerBounds {
  minX: number;
  maxX: number;

  minY: number;
  maxY: number;
}

/* =========================================================
   ZOOM
   ========================================================= */

/*
 * Los valores de escala se expresan como números decimales:
 *
 * 0.5 = 50 %
 * 1   = 100 %
 * 4   = 400 %
 */
export interface CreativeViewerZoomLimits {
  minimum:
    number;

  maximum:
    number;

  step:
    number;

  defaultScale:
    number;
}

export interface CreativeViewerZoomState {
  scale:
    number;

  percentage:
    number;

  minimum:
    number;

  maximum:
    number;

  step:
    number;

  canZoomIn:
    boolean;

  canZoomOut:
    boolean;

  isDefault:
    boolean;

  lastUpdatedAt:
    number | null;
}

/* =========================================================
   DESPLAZAMIENTO DE LA IMAGEN
   ========================================================= */

export interface CreativeViewerPanState {
  position:
    CreativeViewerPoint;

  startPosition:
    CreativeViewerPoint | null;

  pointerStart:
    CreativeViewerPoint | null;

  bounds:
    CreativeViewerBounds | null;

  dragging:
    boolean;

  hasMoved:
    boolean;

  pointerId:
    number | null;
}

/* =========================================================
   TRANSFORMACIÓN COMPLETA
   ========================================================= */

export interface CreativeViewerTransformState {
  zoom:
    CreativeViewerZoomState;

  pan:
    CreativeViewerPanState;

  transformOrigin:
    CreativeViewerPoint;

  transitionEnabled:
    boolean;
}

/* =========================================================
   ESTADO DEL RECURSO VISUAL
   ========================================================= */

export type CreativeViewerMediaStatus =
  | "IDLE"
  | "LOADING"
  | "LOADED"
  | "ERROR";

export interface CreativeViewerMediaState {
  status:
    CreativeViewerMediaStatus;

  asset:
    CreativeImageAsset | null;

  naturalSize:
    CreativeViewerSize | null;

  renderedSize:
    CreativeViewerSize | null;

  containerSize:
    CreativeViewerSize | null;

  objectFit:
    "CONTAIN";

  draggable:
    boolean;

  errorMessage:
    string | null;
}

/* =========================================================
   PANTALLA COMPLETA
   ========================================================= */

export interface CreativeViewerFullscreenState {
  supported:
    boolean;

  active:
    boolean;

  pending:
    boolean;

  errorMessage:
    string | null;
}

/* =========================================================
   PANEL LATERAL
   ========================================================= */

export type CreativeViewerPanelSection =
  | "INFORMATION"
  | "COMMENTS"
  | "PURCHASE"
  | "REQUEST"
  | "ADMINISTRATION";

export interface CreativeViewerPanelState {
  activeSection:
    CreativeViewerPanelSection;

  visible:
    boolean;

  collapsed:
    boolean;

  commentsExpanded:
    boolean;

  mobileSheetOpen:
    boolean;
}

/* =========================================================
   INFORMACIÓN PRINCIPAL DEL DISEÑO
   ========================================================= */

export interface CreativeViewerItemInformation {
  id:
    CreativeItemId;

  slug:
    CreativeItemSlug;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  categoryId:
    CreativeCategoryId;

  toolIds:
    CreativeToolId[];

  title:
    string;

  shortDescription:
    string;

  description:
    string;

  tags:
    string[];

  author:
    CreativeAuthorSummary;

  price:
    CreativePrice | null;

  paymentMethods:
    CreativePaymentMethod[];

  requestKind:
    CreativeRequestKind | null;

  requestButtonLabel:
    string | null;

  licenseLabel:
    string;

  licenseDescription:
    string | null;

  originalFileFormat:
    string | null;

  originalFileSizeBytes:
    number | null;

  resolutionLabel:
    string | null;

  publishedAt:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;

  featured:
    boolean;

  metrics:
    CreativeItemMetrics;
}

/* =========================================================
   USUARIO DENTRO DEL VISOR
   ========================================================= */

export type CreativeViewerUserRole =
  | "GUEST"
  | "USER"
  | "ADMIN";

export interface CreativeViewerCurrentUser {
  id:
    string | null;

  displayName:
    string | null;

  avatarUrl:
    string | null;

  role:
    CreativeViewerUserRole;

  authenticated:
    boolean;
}

/* =========================================================
   INTERACCIONES DEL USUARIO ACTUAL
   ========================================================= */

export interface CreativeViewerInteractionState {
  liked:
    boolean;

  favorited:
    boolean;

  purchased:
    boolean;

  approvedPurchase:
    boolean;

  pendingPurchase:
    boolean;

  requestedService:
    boolean;

  processingLike:
    boolean;

  processingFavorite:
    boolean;

  processingShare:
    boolean;

  processingDownload:
    boolean;

  processingPurchase:
    boolean;

  processingRequest:
    boolean;
}

/* =========================================================
   COMENTARIOS MOSTRADOS EN EL VISOR
   ========================================================= */

export interface CreativeViewerCommentAuthor {
  id:
    string;

  displayName:
    string;

  avatarUrl:
    string | null;

  role:
    "USER" | "ADMIN";
}

export interface CreativeViewerCommentPreview {
  id:
    string;

  itemId:
    CreativeItemId;

  author:
    CreativeViewerCommentAuthor;

  content:
    string;

  repliesCount:
    number;

  likedByCurrentUser:
    boolean;

  likesCount:
    number;

  edited:
    boolean;

  createdAt:
    string;

  updatedAt:
    string;
}

export interface CreativeViewerCommentsState {
  items:
    CreativeViewerCommentPreview[];

  total:
    number;

  loading:
    boolean;

  loadingMore:
    boolean;

  submitting:
    boolean;

  hasMore:
    boolean;

  nextCursor:
    string | null;

  errorMessage:
    string | null;
}

/* =========================================================
   NAVEGACIÓN ENTRE PUBLICACIONES
   ========================================================= */

export interface CreativeViewerNavigationItem {
  id:
    CreativeItemId;

  slug:
    CreativeItemSlug;

  title:
    string;

  thumbnailUrl:
    string | null;
}

export interface CreativeViewerNavigationState {
  source:
    CreativeViewerSource;

  returnTo:
    string;

  previousItem:
    CreativeViewerNavigationItem | null;

  nextItem:
    CreativeViewerNavigationItem | null;

  canGoPrevious:
    boolean;

  canGoNext:
    boolean;

  navigating:
    boolean;
}

/* =========================================================
   BOTONES PRINCIPALES SEGÚN EL CONTENIDO
   ========================================================= */

export type CreativeViewerPrimaryAction =
  | "DOWNLOAD_FREE"
  | "PURCHASE"
  | "REQUEST_SERVICE"
  | "DOWNLOAD_PURCHASED"
  | "WAIT_PAYMENT_APPROVAL"
  | "NONE";

export interface CreativeViewerPrimaryActionState {
  action:
    CreativeViewerPrimaryAction;

  label:
    string;

  enabled:
    boolean;

  loading:
    boolean;

  authenticationRequired:
    boolean;

  redirectTo:
    string | null;
}

/* =========================================================
   ACCIONES ADMINISTRATIVAS
   ========================================================= */

export type CreativeViewerAdminAction =
  | "EDIT"
  | "PUBLISH"
  | "HIDE"
  | "ARCHIVE"
  | "RESTORE"
  | "DELETE"
  | "REPLACE_PREVIEW"
  | "REPLACE_ORIGINAL_FILE"
  | "MANAGE_COMMENTS"
  | "VIEW_STATISTICS";

export interface CreativeViewerAdminActionState {
  action:
    CreativeViewerAdminAction;

  visible:
    boolean;

  enabled:
    boolean;

  loading:
    boolean;

  confirmationRequired:
    boolean;
}

export interface CreativeViewerAdminState {
  administrator:
    boolean;

  actions:
    CreativeViewerAdminActionState[];

  editing:
    boolean;

  deleting:
    boolean;

  changingStatus:
    boolean;

  errorMessage:
    string | null;
}

/* =========================================================
   BARRA DE HERRAMIENTAS
   ========================================================= */

export interface CreativeViewerToolbarState {
  backVisible:
    boolean;

  zoomControlsVisible:
    boolean;

  resetVisible:
    boolean;

  fullscreenVisible:
    boolean;

  previousVisible:
    boolean;

  nextVisible:
    boolean;

  percentageVisible:
    boolean;

  disabled:
    boolean;
}

/* =========================================================
   COMANDOS DEL VISOR
   ========================================================= */

export type CreativeViewerCommand =
  | "OPEN"
  | "CLOSE"
  | "ZOOM_IN"
  | "ZOOM_OUT"
  | "RESET_ZOOM"
  | "TOGGLE_FULLSCREEN"
  | "ENTER_FULLSCREEN"
  | "EXIT_FULLSCREEN"
  | "GO_PREVIOUS"
  | "GO_NEXT"
  | "OPEN_INFORMATION"
  | "OPEN_COMMENTS"
  | "OPEN_PURCHASE"
  | "OPEN_REQUEST"
  | "OPEN_ADMINISTRATION";

/* =========================================================
   ATAJOS DE TECLADO
   ========================================================= */

export type CreativeViewerKeyboardShortcut =
  | "ESCAPE"
  | "PLUS"
  | "MINUS"
  | "ZERO"
  | "ARROW_LEFT"
  | "ARROW_RIGHT"
  | "FULLSCREEN";

export interface CreativeViewerKeyboardSettings {
  enabled:
    boolean;

  closeWithEscape:
    boolean;

  zoomWithPlusMinus:
    boolean;

  resetWithZero:
    boolean;

  navigateWithArrows:
    boolean;

  fullscreenShortcutEnabled:
    boolean;
}

/* =========================================================
   CONFIGURACIÓN DE RUEDA Y GESTOS
   ========================================================= */

export interface CreativeViewerGestureSettings {
  wheelZoomEnabled:
    boolean;

  wheelZoomSensitivity:
    number;

  dragEnabled:
    boolean;

  pinchZoomEnabled:
    boolean;

  doubleClickZoomEnabled:
    boolean;

  doubleTapZoomEnabled:
    boolean;
}

/* =========================================================
   OPCIONES PARA ABRIR EL VISOR
   ========================================================= */

export interface CreativeViewerOpenOptions {
  itemId?:
    CreativeItemId;

  slug?:
    CreativeItemSlug;

  mode:
    CreativeViewerMode;

  source:
    CreativeViewerSource;

  returnTo:
    string;

  initialSection?:
    CreativeViewerPanelSection;

  registerView?:
    boolean;

  preserveCatalogScroll?:
    boolean;
}

/* =========================================================
   ESTADO COMPLETO DEL VISOR
   ========================================================= */

export interface CreativeViewerState {
  status:
    CreativeViewerStatus;

  open:
    boolean;

  mode:
    CreativeViewerMode;

  item:
    CreativeViewerItemInformation | null;

  media:
    CreativeViewerMediaState;

  transform:
    CreativeViewerTransformState;

  fullscreen:
    CreativeViewerFullscreenState;

  panel:
    CreativeViewerPanelState;

  responsive:
    CreativeViewerResponsiveState;

  currentUser:
    CreativeViewerCurrentUser;

  access:
    CreativeItemAccess | null;

  interaction:
    CreativeViewerInteractionState;

  comments:
    CreativeViewerCommentsState;

  navigation:
    CreativeViewerNavigationState;

  primaryAction:
    CreativeViewerPrimaryActionState;

  administration:
    CreativeViewerAdminState;

  toolbar:
    CreativeViewerToolbarState;

  keyboard:
    CreativeViewerKeyboardSettings;

  gestures:
    CreativeViewerGestureSettings;

  errorMessage:
    string | null;
}

/* =========================================================
   ACCIONES CONTROLADORAS DEL VISOR
   ========================================================= */

export interface CreativeViewerActions {
  openViewer:
    (
      options:
        CreativeViewerOpenOptions,
    ) => Promise<void>;

  closeViewer:
    (
      reason?:
        CreativeViewerCloseReason,
    ) => void;

  zoomIn:
    () => void;

  zoomOut:
    () => void;

  setZoom:
    (
      scale:
        number,

      focalPoint?:
        CreativeViewerPoint,
    ) => void;

  resetTransform:
    () => void;

  startPan:
    (
      point:
        CreativeViewerPoint,

      pointerId:
        number,
    ) => void;

  updatePan:
    (
      point:
        CreativeViewerPoint,
    ) => void;

  endPan:
    () => void;

  toggleFullscreen:
    () => Promise<void>;

  goToPrevious:
    () => Promise<void>;

  goToNext:
    () => Promise<void>;

  setActiveSection:
    (
      section:
        CreativeViewerPanelSection,
    ) => void;

  toggleSidebar:
    () => void;

  toggleLike:
    () => Promise<void>;

  toggleFavorite:
    () => Promise<void>;

  share:
    (
      channel:
        string,
    ) => Promise<void>;

  download:
    () => Promise<void>;

  startPurchase:
    () => Promise<void>;

  startRequest:
    () => Promise<void>;

  loadMoreComments:
    () => Promise<void>;

  submitComment:
    (
      content:
        string,
    ) => Promise<void>;

  executeAdminAction:
    (
      action:
        CreativeViewerAdminAction,
    ) => Promise<void>;
}

/* =========================================================
   CONTROLADOR COMPLETO
   ========================================================= */

export interface CreativeViewerController {
  state:
    CreativeViewerState;

  actions:
    CreativeViewerActions;
}

/* =========================================================
   PROPIEDADES DEL COMPONENTE PRINCIPAL
   ========================================================= */

export interface CreativeViewerProps {
  itemId?:
    CreativeItemId;

  slug?:
    CreativeItemSlug;

  mode?:
    CreativeViewerMode;

  source?:
    CreativeViewerSource;

  returnTo?:
    string;

  initialSection?:
    CreativeViewerPanelSection;

  onClose?:
    (
      reason:
        CreativeViewerCloseReason,
    ) => void;

  onItemChange?:
    (
      itemId:
        CreativeItemId,
    ) => void;

  className?:
    string;
}
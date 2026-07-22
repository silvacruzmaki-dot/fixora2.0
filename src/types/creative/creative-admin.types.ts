/*
 * Tipos administrativos del módulo Diseño / Creative.
 *
 * Este archivo define:
 * - Permisos administrativos.
 * - Formularios para crear y editar diseños.
 * - Carga de imágenes y archivos originales.
 * - Gestión de estados.
 * - Acciones individuales y masivas.
 * - Estadísticas del panel.
 * - Moderación de comentarios.
 * - Gestión de compras y solicitudes.
 * - Auditoría administrativa.
 *
 * No contiene:
 * - Componentes React.
 * - Acceso directo a Prisma.
 * - Lógica de negocio.
 * - Llamadas HTTP.
 */

import type {
  CreativeCategoryId,
  CreativeContentType,
  CreativeCurrency,
  CreativeDateValue,
  CreativeDownloadPolicy,
  CreativeImageFormat,
  CreativeItemId,
  CreativeItemMetrics,
  CreativeItemSlug,
  CreativeItemStatus,
  CreativeLicenseType,
  CreativeOriginalFileFormat,
  CreativeOrientation,
  CreativePaymentMethod,
  CreativePrice,
  CreativeRequestKind,
  CreativeToolId,
  CreativeUserId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDENTIFICADORES ADMINISTRATIVOS
   ========================================================= */

export type CreativeAdminActionId =
  string;

export type CreativeAdminUploadId =
  string;

export type CreativeAdminAuditId =
  string;

export type CreativeAdminRequestId =
  string;

export type CreativeAdminOrderId =
  string;

export type CreativeAdminCommentId =
  string;

/* =========================================================
   ROL ADMINISTRATIVO
   ========================================================= */

export type CreativeAdminRole =
  "ADMIN";

/* =========================================================
   USUARIO ADMINISTRADOR
   ========================================================= */

export interface CreativeAdministrator {
  id:
    CreativeUserId;

  displayName:
    string;

  email:
    string;

  avatarUrl:
    string | null;

  role:
    CreativeAdminRole;
}

/* =========================================================
   PERMISOS ADMINISTRATIVOS
   ========================================================= */

export interface CreativeAdminPermissions {
  canAccessDashboard:
    boolean;

  canViewDrafts:
    boolean;

  canCreateItems:
    boolean;

  canEditItems:
    boolean;

  canPublishItems:
    boolean;

  canHideItems:
    boolean;

  canArchiveItems:
    boolean;

  canRestoreItems:
    boolean;

  canDeleteItems:
    boolean;

  canUploadPreviews:
    boolean;

  canUploadOriginalFiles:
    boolean;

  canReplaceFiles:
    boolean;

  canManageComments:
    boolean;

  canManageRequests:
    boolean;

  canManageOrders:
    boolean;

  canApprovePayments:
    boolean;

  canRejectPayments:
    boolean;

  canViewStatistics:
    boolean;

  canExportReports:
    boolean;
}

/* =========================================================
   RESULTADO DE AUTORIZACIÓN
   ========================================================= */

export type CreativeAdminAuthorizationFailure =
  | "AUTHENTICATION_REQUIRED"
  | "ADMIN_REQUIRED"
  | "ACCOUNT_UNAVAILABLE"
  | "INSUFFICIENT_PERMISSIONS"
  | "SESSION_EXPIRED";

export interface CreativeAdminAuthorizationResult {
  authorized:
    boolean;

  administrator:
    CreativeAdministrator | null;

  permissions:
    CreativeAdminPermissions | null;

  failureReason:
    CreativeAdminAuthorizationFailure | null;

  redirectTo:
    string | null;
}

/* =========================================================
   TIPO DE FORMULARIO ADMINISTRATIVO
   ========================================================= */

export type CreativeAdminFormMode =
  | "CREATE"
  | "EDIT"
  | "DUPLICATE";

/* =========================================================
   ESTADO DEL FORMULARIO
   ========================================================= */

export type CreativeAdminFormStatus =
  | "IDLE"
  | "DIRTY"
  | "VALIDATING"
  | "SUBMITTING"
  | "SUCCESS"
  | "ERROR";

/* =========================================================
   VISIBILIDAD DE CAMPOS
   ========================================================= */

export interface CreativeAdminConditionalFields {
  showPrice:
    boolean;

  showPaymentMethods:
    boolean;

  showRequestKind:
    boolean;

  showRequestButtonLabels:
    boolean;

  showDownloadFile:
    boolean;

  showOriginalFile:
    boolean;

  showWatermarkOptions:
    boolean;

  showLicenseDescription:
    boolean;
}

/* =========================================================
   ARCHIVO SELECCIONADO EN EL FORMULARIO
   ========================================================= */

export interface CreativeAdminSelectedFile {
  file:
    File;

  name:
    string;

  sizeBytes:
    number;

  mimeType:
    string;

  extension:
    string;

  previewUrl:
    string | null;
}

/* =========================================================
   ARCHIVO EXISTENTE
   ========================================================= */

export interface CreativeAdminExistingFile {
  id:
    string | null;

  url:
    string | null;

  fileName:
    string | null;

  sizeBytes:
    number | null;

  mimeType:
    string | null;

  extension:
    string | null;

  available:
    boolean;
}

/* =========================================================
   IMAGEN DE VISTA PREVIA
   ========================================================= */

export interface CreativeAdminPreviewImageState {
  selectedFile:
    CreativeAdminSelectedFile | null;

  existingFile:
    CreativeAdminExistingFile | null;

  removeExisting:
    boolean;

  altEs:
    string;

  altEn:
    string;

  width:
    number | null;

  height:
    number | null;

  orientation:
    CreativeOrientation | null;

  format:
    CreativeImageFormat | null;
}

/* =========================================================
   MINIATURA
   ========================================================= */

export interface CreativeAdminThumbnailState {
  generateAutomatically:
    boolean;

  selectedFile:
    CreativeAdminSelectedFile | null;

  existingFile:
    CreativeAdminExistingFile | null;

  removeExisting:
    boolean;
}

/* =========================================================
   ARCHIVO ORIGINAL
   ========================================================= */

export interface CreativeAdminOriginalFileState {
  selectedFile:
    CreativeAdminSelectedFile | null;

  existingFile:
    CreativeAdminExistingFile | null;

  removeExisting:
    boolean;

  format:
    CreativeOriginalFileFormat | null;

  includedFiles:
    string[];
}

/* =========================================================
   ARCHIVO DESCARGABLE
   ========================================================= */

export interface CreativeAdminDownloadFileState {
  selectedFile:
    CreativeAdminSelectedFile | null;

  existingFile:
    CreativeAdminExistingFile | null;

  removeExisting:
    boolean;

  available:
    boolean;
}

/* =========================================================
   CONFIGURACIÓN DE MARCA DE AGUA
   ========================================================= */

export interface CreativeAdminWatermarkFormState {
  enabled:
    boolean;

  text:
    string;

  opacity:
    number;
}

/* =========================================================
   CONFIGURACIÓN DE COMENTARIOS
   ========================================================= */

export interface CreativeAdminCommentSettingsFormState {
  enabled:
    boolean;

  requireAuthentication:
    boolean;

  moderationEnabled:
    boolean;
}

/* =========================================================
   PRECIO DEL FORMULARIO
   ========================================================= */

export interface CreativeAdminPriceFormState {
  amount:
    string;

  amountInCents:
    number | null;

  currency:
    CreativeCurrency;
}

/* =========================================================
   FORMULARIO COMPLETO
   ========================================================= */

export interface CreativeAdminItemFormState {
  mode:
    CreativeAdminFormMode;

  itemId:
    CreativeItemId | null;

  slug:
    CreativeItemSlug;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  categoryId:
    CreativeCategoryId | "";

  toolIds:
    CreativeToolId[];

  titleEs:
    string;

  titleEn:
    string;

  shortDescriptionEs:
    string;

  shortDescriptionEn:
    string;

  descriptionEs:
    string;

  descriptionEn:
    string;

  tags:
    string[];

  tagInput:
    string;

  authorId:
    CreativeUserId | null;

  preview:
    CreativeAdminPreviewImageState;

  thumbnail:
    CreativeAdminThumbnailState;

  originalFile:
    CreativeAdminOriginalFileState;

  downloadFile:
    CreativeAdminDownloadFileState;

  price:
    CreativeAdminPriceFormState;

  paymentMethods:
    CreativePaymentMethod[];

  requestKind:
    CreativeRequestKind | null;

  requestButtonLabelEs:
    string;

  requestButtonLabelEn:
    string;

  downloadPolicy:
    CreativeDownloadPolicy;

  licenseType:
    CreativeLicenseType;

  licenseDescriptionEs:
    string;

  licenseDescriptionEn:
    string;

  watermark:
    CreativeAdminWatermarkFormState;

  comments:
    CreativeAdminCommentSettingsFormState;

  featured:
    boolean;

  publishImmediately:
    boolean;

  publishedAt:
    string | null;
}

/* =========================================================
   ERRORES DEL FORMULARIO
   ========================================================= */

export type CreativeAdminFormField =
  | "slug"
  | "contentType"
  | "status"
  | "categoryId"
  | "toolIds"
  | "titleEs"
  | "titleEn"
  | "shortDescriptionEs"
  | "shortDescriptionEn"
  | "descriptionEs"
  | "descriptionEn"
  | "tags"
  | "preview"
  | "thumbnail"
  | "originalFile"
  | "downloadFile"
  | "price"
  | "paymentMethods"
  | "requestKind"
  | "requestButtonLabelEs"
  | "requestButtonLabelEn"
  | "licenseType"
  | "licenseDescriptionEs"
  | "licenseDescriptionEn"
  | "watermark"
  | "comments"
  | "publishedAt";

export type CreativeAdminFormErrors =
  Partial<
    Record<
      CreativeAdminFormField,
      string[]
    >
  >;

/* =========================================================
   ESTADO DEL CONTROLADOR DEL FORMULARIO
   ========================================================= */

export interface CreativeAdminFormControllerState {
  form:
    CreativeAdminItemFormState;

  status:
    CreativeAdminFormStatus;

  conditionalFields:
    CreativeAdminConditionalFields;

  errors:
    CreativeAdminFormErrors;

  globalError:
    string | null;

  successMessage:
    string | null;

  dirty:
    boolean;

  valid:
    boolean;

  uploading:
    boolean;

  uploadProgress:
    number;

  lastSavedAt:
    CreativeDateValue | null;
}

/* =========================================================
   CAMBIOS EN EL FORMULARIO
   ========================================================= */

export type CreativeAdminFormValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | CreativeContentType
  | CreativeItemStatus
  | CreativeCategoryId
  | CreativeToolId[]
  | CreativePaymentMethod[]
  | CreativeRequestKind
  | CreativeDownloadPolicy
  | CreativeLicenseType;

/* =========================================================
   DATOS PARA CREAR UNA PUBLICACIÓN
   ========================================================= */

export interface CreateCreativeAdminItemInput {
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

  titleEs:
    string;

  titleEn:
    string;

  shortDescriptionEs:
    string;

  shortDescriptionEn:
    string;

  descriptionEs:
    string;

  descriptionEn:
    string;

  tags:
    string[];

  authorId:
    CreativeUserId;

  price:
    CreativePrice | null;

  paymentMethods:
    CreativePaymentMethod[];

  requestKind:
    CreativeRequestKind | null;

  requestButtonLabelEs:
    string | null;

  requestButtonLabelEn:
    string | null;

  downloadPolicy:
    CreativeDownloadPolicy;

  licenseType:
    CreativeLicenseType;

  licenseDescriptionEs:
    string | null;

  licenseDescriptionEn:
    string | null;

  commentsEnabled:
    boolean;

  commentsRequireAuthentication:
    boolean;

  commentModerationEnabled:
    boolean;

  watermarkEnabled:
    boolean;

  watermarkText:
    string | null;

  watermarkOpacity:
    number | null;

  featured:
    boolean;

  publishedAt:
    CreativeDateValue | null;
}

/* =========================================================
   DATOS PARA ACTUALIZAR UNA PUBLICACIÓN
   ========================================================= */

export type UpdateCreativeAdminItemInput =
  Partial<
    CreateCreativeAdminItemInput
  > & {
    itemId:
      CreativeItemId;
  };

/* =========================================================
   ARCHIVOS PARA CREAR O ACTUALIZAR
   ========================================================= */

export interface CreativeAdminItemFileInput {
  previewFile:
    File | null;

  thumbnailFile:
    File | null;

  originalFile:
    File | null;

  downloadFile:
    File | null;

  removePreview:
    boolean;

  removeThumbnail:
    boolean;

  removeOriginalFile:
    boolean;

  removeDownloadFile:
    boolean;
}

/* =========================================================
   RESULTADO DE CREACIÓN
   ========================================================= */

export interface CreativeAdminCreateResult {
  itemId:
    CreativeItemId;

  slug:
    CreativeItemSlug;

  status:
    CreativeItemStatus;

  created:
    boolean;

  createdAt:
    CreativeDateValue;
}

/* =========================================================
   RESULTADO DE ACTUALIZACIÓN
   ========================================================= */

export interface CreativeAdminUpdateResult {
  itemId:
    CreativeItemId;

  slug:
    CreativeItemSlug;

  previousStatus:
    CreativeItemStatus;

  currentStatus:
    CreativeItemStatus;

  updated:
    boolean;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   CARGAS DE ARCHIVOS
   ========================================================= */

export type CreativeAdminUploadType =
  | "PREVIEW"
  | "THUMBNAIL"
  | "ORIGINAL"
  | "DOWNLOAD"
  | "PAYMENT_PROOF"
  | "REQUEST_ATTACHMENT";

export type CreativeAdminUploadStatus =
  | "PENDING"
  | "UPLOADING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface CreativeAdminUploadProgress {
  uploadId:
    CreativeAdminUploadId;

  type:
    CreativeAdminUploadType;

  status:
    CreativeAdminUploadStatus;

  fileName:
    string;

  sizeBytes:
    number;

  uploadedBytes:
    number;

  percentage:
    number;

  errorMessage:
    string | null;
}

export interface CreativeAdminUploadResult {
  uploadId:
    CreativeAdminUploadId;

  type:
    CreativeAdminUploadType;

  status:
    "COMPLETED";

  storageKey:
    string;

  publicUrl:
    string | null;

  fileName:
    string;

  sizeBytes:
    number;

  mimeType:
    string;

  extension:
    string;

  uploadedAt:
    CreativeDateValue;
}

/* =========================================================
   FILA DE LA TABLA ADMINISTRATIVA
   ========================================================= */

export interface CreativeAdminItemTableRow {
  id:
    CreativeItemId;

  slug:
    CreativeItemSlug;

  title:
    string;

  thumbnailUrl:
    string | null;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  categoryId:
    CreativeCategoryId;

  featured:
    boolean;

  price:
    CreativePrice | null;

  metrics:
    CreativeItemMetrics;

  authorDisplayName:
    string;

  publishedAt:
    CreativeDateValue | null;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   ORDENAMIENTO ADMINISTRATIVO
   ========================================================= */

export type CreativeAdminItemSort =
  | "NEWEST"
  | "OLDEST"
  | "LAST_UPDATED"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "MOST_VIEWED"
  | "MOST_LIKED"
  | "MOST_DOWNLOADED"
  | "MOST_PURCHASED";

/* =========================================================
   FILTROS DEL PANEL
   ========================================================= */

export interface CreativeAdminItemFilters {
  search:
    string;

  contentTypes:
    CreativeContentType[];

  statuses:
    CreativeItemStatus[];

  categoryIds:
    CreativeCategoryId[];

  toolIds:
    CreativeToolId[];

  featured:
    boolean | null;

  authorId:
    CreativeUserId | null;

  sort:
    CreativeAdminItemSort;

  page:
    number;

  pageSize:
    number;
}

/* =========================================================
   SELECCIÓN DE FILAS
   ========================================================= */

export interface CreativeAdminSelectionState {
  selectedIds:
    CreativeItemId[];

  allVisibleSelected:
    boolean;

  totalSelected:
    number;
}

/* =========================================================
   ACCIONES INDIVIDUALES
   ========================================================= */

export type CreativeAdminItemAction =
  | "VIEW"
  | "EDIT"
  | "DUPLICATE"
  | "PUBLISH"
  | "HIDE"
  | "ARCHIVE"
  | "RESTORE"
  | "DELETE"
  | "FEATURE"
  | "UNFEATURE"
  | "COPY_LINK"
  | "VIEW_STATISTICS";

/* =========================================================
   ACCIONES MASIVAS
   ========================================================= */

export type CreativeAdminBulkAction =
  | "PUBLISH"
  | "HIDE"
  | "ARCHIVE"
  | "RESTORE"
  | "DELETE"
  | "FEATURE"
  | "UNFEATURE";

/* =========================================================
   RESULTADO DE ACCIÓN MASIVA
   ========================================================= */

export interface CreativeAdminBulkActionResult {
  action:
    CreativeAdminBulkAction;

  requestedCount:
    number;

  successfulCount:
    number;

  failedCount:
    number;

  successfulItemIds:
    CreativeItemId[];

  failedItems:
    Array<{
      itemId:
        CreativeItemId;

      reason:
        string;
    }>;

  completedAt:
    CreativeDateValue;
}

/* =========================================================
   CAMBIO DE ESTADO
   ========================================================= */

export interface CreativeAdminStatusChangeInput {
  itemId:
    CreativeItemId;

  nextStatus:
    CreativeItemStatus;

  reason:
    string | null;
}

export interface CreativeAdminStatusChangeResult {
  itemId:
    CreativeItemId;

  previousStatus:
    CreativeItemStatus;

  currentStatus:
    CreativeItemStatus;

  changedBy:
    CreativeUserId;

  changedAt:
    CreativeDateValue;
}

/* =========================================================
   ELIMINACIÓN
   ========================================================= */

export type CreativeAdminDeleteMode =
  | "ARCHIVE"
  | "PERMANENT";

export interface CreativeAdminDeleteInput {
  itemId:
    CreativeItemId;

  mode:
    CreativeAdminDeleteMode;

  confirmationText:
    string | null;

  reason:
    string | null;
}

export interface CreativeAdminDeleteResult {
  itemId:
    CreativeItemId;

  mode:
    CreativeAdminDeleteMode;

  deleted:
    boolean;

  archived:
    boolean;

  affectedComments:
    number;

  affectedFavorites:
    number;

  affectedOrders:
    number;

  affectedRequests:
    number;

  completedAt:
    CreativeDateValue;
}

/* =========================================================
   ESTADÍSTICAS GENERALES
   ========================================================= */

export interface CreativeAdminDashboardTotals {
  totalItems:
    number;

  totalPublished:
    number;

  totalDrafts:
    number;

  totalHidden:
    number;

  totalArchived:
    number;

  totalFree:
    number;

  totalPaid:
    number;

  totalPortfolio:
    number;

  totalViews:
    number;

  totalLikes:
    number;

  totalFavorites:
    number;

  totalComments:
    number;

  totalDownloads:
    number;

  totalPurchases:
    number;

  totalRequests:
    number;
}

/* =========================================================
   ESTADÍSTICAS DE VENTAS
   ========================================================= */

export interface CreativeAdminSalesStatistics {
  totalOrders:
    number;

  pendingOrders:
    number;

  approvedOrders:
    number;

  rejectedOrders:
    number;

  totalRevenueInCents:
    number;

  currency:
    CreativeCurrency;

  conversionRate:
    number;
}

/* =========================================================
   ESTADÍSTICAS DE SOLICITUDES
   ========================================================= */

export interface CreativeAdminRequestStatistics {
  totalRequests:
    number;

  pendingRequests:
    number;

  contactedRequests:
    number;

  inProgressRequests:
    number;

  completedRequests:
    number;

  cancelledRequests:
    number;
}

/* =========================================================
   ACTIVIDAD RECIENTE
   ========================================================= */

export type CreativeAdminActivityType =
  | "ITEM_CREATED"
  | "ITEM_UPDATED"
  | "ITEM_PUBLISHED"
  | "ITEM_HIDDEN"
  | "ITEM_ARCHIVED"
  | "ITEM_RESTORED"
  | "ITEM_DELETED"
  | "ORDER_CREATED"
  | "ORDER_APPROVED"
  | "ORDER_REJECTED"
  | "REQUEST_CREATED"
  | "REQUEST_UPDATED"
  | "COMMENT_REPORTED"
  | "COMMENT_HIDDEN"
  | "COMMENT_DELETED";

export interface CreativeAdminRecentActivity {
  id:
    CreativeAdminActionId;

  type:
    CreativeAdminActivityType;

  title:
    string;

  description:
    string;

  itemId:
    CreativeItemId | null;

  actorId:
    CreativeUserId | null;

  actorDisplayName:
    string | null;

  createdAt:
    CreativeDateValue;
}

/* =========================================================
   PANEL GENERAL
   ========================================================= */

export interface CreativeAdminDashboardData {
  totals:
    CreativeAdminDashboardTotals;

  sales:
    CreativeAdminSalesStatistics;

  requests:
    CreativeAdminRequestStatistics;

  recentActivity:
    CreativeAdminRecentActivity[];

  lastUpdatedAt:
    CreativeDateValue;
}

/* =========================================================
   MODERACIÓN DE COMENTARIOS
   ========================================================= */

export type CreativeAdminCommentStatus =
  | "VISIBLE"
  | "HIDDEN"
  | "REPORTED"
  | "DELETED";

export type CreativeAdminCommentAction =
  | "SHOW"
  | "HIDE"
  | "DELETE"
  | "DISMISS_REPORT"
  | "BLOCK_AUTHOR";

export interface CreativeAdminCommentModerationItem {
  id:
    CreativeAdminCommentId;

  itemId:
    CreativeItemId;

  itemTitle:
    string;

  authorId:
    CreativeUserId;

  authorDisplayName:
    string;

  authorAvatarUrl:
    string | null;

  content:
    string;

  status:
    CreativeAdminCommentStatus;

  reportsCount:
    number;

  repliesCount:
    number;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

export interface CreativeAdminCommentActionInput {
  commentId:
    CreativeAdminCommentId;

  action:
    CreativeAdminCommentAction;

  reason:
    string | null;
}

/* =========================================================
   PEDIDOS DE COMPRA
   ========================================================= */

export type CreativeAdminOrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_SUBMITTED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface CreativeAdminOrderSummary {
  id:
    CreativeAdminOrderId;

  itemId:
    CreativeItemId;

  itemTitle:
    string;

  buyerId:
    CreativeUserId;

  buyerDisplayName:
    string;

  buyerEmail:
    string;

  amountInCents:
    number;

  currency:
    CreativeCurrency;

  paymentMethod:
    CreativePaymentMethod;

  paymentProofUrl:
    string | null;

  status:
    CreativeAdminOrderStatus;

  submittedAt:
    CreativeDateValue | null;

  reviewedAt:
    CreativeDateValue | null;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

export type CreativeAdminOrderAction =
  | "APPROVE_PAYMENT"
  | "REJECT_PAYMENT"
  | "MARK_COMPLETED"
  | "CANCEL"
  | "REFUND";

export interface CreativeAdminOrderActionInput {
  orderId:
    CreativeAdminOrderId;

  action:
    CreativeAdminOrderAction;

  note:
    string | null;
}

/* =========================================================
   SOLICITUDES PERSONALIZADAS
   ========================================================= */

export type CreativeAdminRequestStatus =
  | "PENDING"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "AWAITING_CLIENT"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface CreativeAdminRequestSummary {
  id:
    CreativeAdminRequestId;

  itemId:
    CreativeItemId;

  itemTitle:
    string;

  requestKind:
    CreativeRequestKind;

  customerId:
    CreativeUserId;

  customerDisplayName:
    string;

  customerEmail:
    string;

  subject:
    string;

  message:
    string;

  status:
    CreativeAdminRequestStatus;

  attachmentsCount:
    number;

  assignedAdministratorId:
    CreativeUserId | null;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

export interface CreativeAdminRequestUpdateInput {
  requestId:
    CreativeAdminRequestId;

  status:
    CreativeAdminRequestStatus;

  internalNote:
    string | null;

  assignedAdministratorId:
    CreativeUserId | null;
}

/* =========================================================
   AUDITORÍA
   ========================================================= */

export type CreativeAdminAuditAction =
  | "CREATE_ITEM"
  | "UPDATE_ITEM"
  | "CHANGE_STATUS"
  | "UPLOAD_FILE"
  | "REPLACE_FILE"
  | "DELETE_FILE"
  | "ARCHIVE_ITEM"
  | "DELETE_ITEM"
  | "MODERATE_COMMENT"
  | "UPDATE_REQUEST"
  | "UPDATE_ORDER"
  | "APPROVE_PAYMENT"
  | "REJECT_PAYMENT";

export interface CreativeAdminAuditEntry {
  id:
    CreativeAdminAuditId;

  administratorId:
    CreativeUserId;

  administratorEmail:
    string;

  action:
    CreativeAdminAuditAction;

  entityType:
    "ITEM"
    | "COMMENT"
    | "REQUEST"
    | "ORDER"
    | "FILE";

  entityId:
    string;

  previousValues:
    Record<
      string,
      unknown
    > | null;

  nextValues:
    Record<
      string,
      unknown
    > | null;

  ipHash:
    string | null;

  userAgent:
    string | null;

  createdAt:
    CreativeDateValue;
}

/* =========================================================
   CONTROLADOR DEL FORMULARIO ADMINISTRATIVO
   ========================================================= */

export interface CreativeAdminFormController {
  state:
    CreativeAdminFormControllerState;

  setField:
    (
      field:
        CreativeAdminFormField,

      value:
        CreativeAdminFormValue,
    ) => void;

  addTag:
    (
      tag:
        string,
    ) => void;

  removeTag:
    (
      tag:
        string,
    ) => void;

  selectPreview:
    (
      file:
        File,
    ) => Promise<void>;

  selectThumbnail:
    (
      file:
        File,
    ) => Promise<void>;

  selectOriginalFile:
    (
      file:
        File,
    ) => Promise<void>;

  selectDownloadFile:
    (
      file:
        File,
    ) => Promise<void>;

  removePreview:
    () => void;

  removeThumbnail:
    () => void;

  removeOriginalFile:
    () => void;

  removeDownloadFile:
    () => void;

  validate:
    () => Promise<boolean>;

  submit:
    () => Promise<
      | CreativeAdminCreateResult
      | CreativeAdminUpdateResult
    >;

  reset:
    () => void;
}

/* =========================================================
   CONTROLADOR DEL PANEL ADMINISTRATIVO
   ========================================================= */

export interface CreativeAdminDashboardController {
  administrator:
    CreativeAdministrator;

  permissions:
    CreativeAdminPermissions;

  dashboard:
    CreativeAdminDashboardData | null;

  items:
    CreativeAdminItemTableRow[];

  filters:
    CreativeAdminItemFilters;

  selection:
    CreativeAdminSelectionState;

  loading:
    boolean;

  refreshing:
    boolean;

  errorMessage:
    string | null;

  setFilters:
    (
      filters:
        Partial<CreativeAdminItemFilters>,
    ) => void;

  selectItem:
    (
      itemId:
        CreativeItemId,
    ) => void;

  deselectItem:
    (
      itemId:
        CreativeItemId,
    ) => void;

  selectAllVisible:
    () => void;

  clearSelection:
    () => void;

  executeItemAction:
    (
      itemId:
        CreativeItemId,

      action:
        CreativeAdminItemAction,
    ) => Promise<void>;

  executeBulkAction:
    (
      action:
        CreativeAdminBulkAction,
    ) => Promise<CreativeAdminBulkActionResult>;

  refresh:
    () => Promise<void>;
}

/* =========================================================
   VALORES INICIALES
   ========================================================= */

export const EMPTY_CREATIVE_ADMIN_PERMISSIONS:
  CreativeAdminPermissions = {
    canAccessDashboard:
      false,

    canViewDrafts:
      false,

    canCreateItems:
      false,

    canEditItems:
      false,

    canPublishItems:
      false,

    canHideItems:
      false,

    canArchiveItems:
      false,

    canRestoreItems:
      false,

    canDeleteItems:
      false,

    canUploadPreviews:
      false,

    canUploadOriginalFiles:
      false,

    canReplaceFiles:
      false,

    canManageComments:
      false,

    canManageRequests:
      false,

    canManageOrders:
      false,

    canApprovePayments:
      false,

    canRejectPayments:
      false,

    canViewStatistics:
      false,

    canExportReports:
      false,
  };

export const EMPTY_CREATIVE_ADMIN_SELECTION_STATE:
  CreativeAdminSelectionState = {
    selectedIds:
      [],

    allVisibleSelected:
      false,

    totalSelected:
      0,
  };

export const EMPTY_CREATIVE_ADMIN_DASHBOARD_TOTALS:
  CreativeAdminDashboardTotals = {
    totalItems:
      0,

    totalPublished:
      0,

    totalDrafts:
      0,

    totalHidden:
      0,

    totalArchived:
      0,

    totalFree:
      0,

    totalPaid:
      0,

    totalPortfolio:
      0,

    totalViews:
      0,

    totalLikes:
      0,

    totalFavorites:
      0,

    totalComments:
      0,

    totalDownloads:
      0,

    totalPurchases:
      0,

    totalRequests:
      0,
  };
/*
 * Tipos de compras y pagos del módulo Diseño / Creative.
 *
 * Este archivo define:
 * - Pedidos de diseños de pago.
 * - Pagos realizados mediante Yape.
 * - Comprobantes de pago.
 * - Revisión administrativa.
 * - Acceso a descargas después del pago aprobado.
 * - Historial de cambios del pedido.
 * - Estados visibles para el comprador y el administrador.
 *
 * No contiene:
 * - Acceso directo a Prisma.
 * - Componentes React.
 * - Llamadas HTTP.
 * - Validación Zod.
 * - Lógica de almacenamiento de archivos.
 */

import type {
  CreativeCurrency,
  CreativeDateValue,
  CreativeItemId,
  CreativeOriginalFileFormat,
  CreativePaymentMethod,
  CreativePrice,
  CreativeUserId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDENTIFICADORES
   ========================================================= */

export type CreativeOrderId =
  string;

export type CreativePaymentProofId =
  string;

export type CreativeDownloadGrantId =
  string;

export type CreativeOrderHistoryId =
  string;

/* =========================================================
   ESTADO PRINCIPAL DEL PEDIDO
   ========================================================= */

/*
 * PENDING_PAYMENT:
 * El pedido fue creado, pero el usuario todavía no envió
 * un comprobante de pago.
 *
 * PAYMENT_SUBMITTED:
 * El usuario envió un comprobante y espera revisión.
 *
 * PAYMENT_APPROVED:
 * El administrador aprobó el pago.
 *
 * PAYMENT_REJECTED:
 * El comprobante fue rechazado.
 *
 * COMPLETED:
 * La compra finalizó y el archivo fue habilitado.
 *
 * CANCELLED:
 * El pedido fue cancelado.
 *
 * EXPIRED:
 * El pedido venció sin completarse.
 *
 * REFUNDED:
 * La compra fue reembolsada.
 */
export type CreativeOrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_SUBMITTED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED";

/* =========================================================
   ESTADO DEL COMPROBANTE
   ========================================================= */

export type CreativePaymentProofStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "REPLACED"
  | "REMOVED";

/* =========================================================
   RESULTADO DE LA REVISIÓN
   ========================================================= */

export type CreativePaymentReviewDecision =
  | "APPROVE"
  | "REJECT";

/* =========================================================
   ESTADO DEL ACCESO DE DESCARGA
   ========================================================= */

export type CreativeDownloadGrantStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "REVOKED"
  | "EXHAUSTED";

/* =========================================================
   ORIGEN DE CREACIÓN DEL PEDIDO
   ========================================================= */

export type CreativeOrderSource =
  | "CATALOG"
  | "VIEWER"
  | "DIRECT_LINK"
  | "RELATED_ITEM"
  | "SHARED_LINK"
  | "ADMIN";

/* =========================================================
   ACTOR DEL CAMBIO
   ========================================================= */

export type CreativeOrderActorRole =
  | "USER"
  | "ADMIN"
  | "SYSTEM";

/* =========================================================
   MOTIVOS DE CANCELACIÓN
   ========================================================= */

export type CreativeOrderCancellationReason =
  | "USER_REQUEST"
  | "PAYMENT_NOT_COMPLETED"
  | "PAYMENT_REJECTED"
  | "ITEM_UNAVAILABLE"
  | "DUPLICATE_ORDER"
  | "ADMINISTRATIVE_DECISION"
  | "EXPIRED"
  | "OTHER";

/* =========================================================
   MOTIVOS DE RECHAZO DEL PAGO
   ========================================================= */

export type CreativePaymentRejectionReason =
  | "UNREADABLE_PROOF"
  | "INCORRECT_AMOUNT"
  | "PAYMENT_NOT_FOUND"
  | "DUPLICATE_PROOF"
  | "INVALID_DATE"
  | "INVALID_OPERATION_NUMBER"
  | "UNSUPPORTED_FILE"
  | "SUSPICIOUS_PROOF"
  | "OTHER";

/* =========================================================
   MOTIVOS DE REVOCACIÓN DE DESCARGA
   ========================================================= */

export type CreativeDownloadGrantRevocationReason =
  | "ORDER_CANCELLED"
  | "PAYMENT_REVERSED"
  | "REFUNDED"
  | "SECURITY_INCIDENT"
  | "ADMINISTRATIVE_DECISION"
  | "ITEM_UNAVAILABLE"
  | "OTHER";

/* =========================================================
   DATOS RESUMIDOS DEL COMPRADOR
   ========================================================= */

export interface CreativeOrderBuyer {
  id:
    CreativeUserId;

  displayName:
    string;

  email:
    string;

  avatarUrl:
    string | null;
}

/* =========================================================
   DATOS RESUMIDOS DEL DISEÑO
   ========================================================= */

export interface CreativeOrderItemSnapshot {
  id:
    CreativeItemId;

  slug:
    string;

  titleEs:
    string;

  titleEn:
    string;

  previewUrl:
    string | null;

  thumbnailUrl:
    string | null;

  fileFormat:
    CreativeOriginalFileFormat | null;

  fileName:
    string | null;

  fileSizeBytes:
    number | null;
}

/* =========================================================
   PRECIO CONGELADO EN LA COMPRA
   ========================================================= */

/*
 * El pedido debe conservar el precio existente al momento
 * de la compra aunque el administrador lo cambie después.
 */
export interface CreativeOrderPriceSnapshot {
  amountInCents:
    number;

  currency:
    CreativeCurrency;

  formattedAmount:
    string;
}

/* =========================================================
   DATOS DE PAGO POR YAPE
   ========================================================= */

export interface CreativeYapePaymentInstructions {
  accountHolder:
    string;

  phoneNumber:
    string;

  qrImageUrl:
    string | null;

  referenceCode:
    string;

  amountInCents:
    number;

  currency:
    CreativeCurrency;

  expiresAt:
    CreativeDateValue | null;
}

/* =========================================================
   ARCHIVO DEL COMPROBANTE
   ========================================================= */

export interface CreativePaymentProofFile {
  storageKey:
    string;

  fileName:
    string;

  mimeType:
    string;

  extension:
    string;

  sizeBytes:
    number;

  privateUrl:
    string | null;
}

/* =========================================================
   COMPROBANTE DE PAGO
   ========================================================= */

export interface CreativePaymentProof {
  id:
    CreativePaymentProofId;

  orderId:
    CreativeOrderId;

  uploadedByUserId:
    CreativeUserId;

  status:
    CreativePaymentProofStatus;

  file:
    CreativePaymentProofFile;

  operationNumber:
    string | null;

  paymentDate:
    CreativeDateValue | null;

  submittedAmountInCents:
    number | null;

  senderName:
    string | null;

  senderPhone:
    string | null;

  note:
    string | null;

  submittedAt:
    CreativeDateValue;

  reviewedByUserId:
    CreativeUserId | null;

  reviewedAt:
    CreativeDateValue | null;

  rejectionReason:
    CreativePaymentRejectionReason | null;

  rejectionNote:
    string | null;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   DATOS PARA SUBIR UN COMPROBANTE
   ========================================================= */

export interface CreateCreativePaymentProofInput {
  orderId:
    CreativeOrderId;

  file:
    File;

  operationNumber?:
    string | null;

  paymentDate?:
    string | null;

  submittedAmountInCents?:
    number | null;

  senderName?:
    string | null;

  senderPhone?:
    string | null;

  note?:
    string | null;
}

/* =========================================================
   METADATOS DEL COMPROBANTE PARA SERVIDOR
   ========================================================= */

export interface CreateCreativePaymentProofRecordInput {
  orderId:
    CreativeOrderId;

  uploadedByUserId:
    CreativeUserId;

  storageKey:
    string;

  fileName:
    string;

  mimeType:
    string;

  extension:
    string;

  sizeBytes:
    number;

  operationNumber:
    string | null;

  paymentDate:
    CreativeDateValue | null;

  submittedAmountInCents:
    number | null;

  senderName:
    string | null;

  senderPhone:
    string | null;

  note:
    string | null;
}

/* =========================================================
   REVISIÓN ADMINISTRATIVA DEL PAGO
   ========================================================= */

export interface ReviewCreativePaymentInput {
  orderId:
    CreativeOrderId;

  proofId:
    CreativePaymentProofId;

  administratorId:
    CreativeUserId;

  decision:
    CreativePaymentReviewDecision;

  rejectionReason?:
    CreativePaymentRejectionReason | null;

  note?:
    string | null;
}

export interface ReviewCreativePaymentResult {
  orderId:
    CreativeOrderId;

  proofId:
    CreativePaymentProofId;

  previousOrderStatus:
    CreativeOrderStatus;

  currentOrderStatus:
    CreativeOrderStatus;

  proofStatus:
    CreativePaymentProofStatus;

  reviewedByUserId:
    CreativeUserId;

  reviewedAt:
    CreativeDateValue;

  downloadEnabled:
    boolean;
}

/* =========================================================
   PEDIDO PRINCIPAL
   ========================================================= */

export interface CreativeOrder {
  id:
    CreativeOrderId;

  itemId:
    CreativeItemId;

  buyerId:
    CreativeUserId;

  buyer:
    CreativeOrderBuyer;

  item:
    CreativeOrderItemSnapshot;

  status:
    CreativeOrderStatus;

  source:
    CreativeOrderSource;

  price:
    CreativeOrderPriceSnapshot;

  paymentMethod:
    CreativePaymentMethod;

  paymentProof:
    CreativePaymentProof | null;

  referenceCode:
    string;

  buyerNote:
    string | null;

  administratorNote:
    string | null;

  cancellationReason:
    CreativeOrderCancellationReason | null;

  cancellationNote:
    string | null;

  cancelledByUserId:
    CreativeUserId | null;

  cancelledAt:
    CreativeDateValue | null;

  expiresAt:
    CreativeDateValue | null;

  paymentSubmittedAt:
    CreativeDateValue | null;

  paymentApprovedAt:
    CreativeDateValue | null;

  completedAt:
    CreativeDateValue | null;

  refundedAt:
    CreativeDateValue | null;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   DATOS PARA CREAR UN PEDIDO
   ========================================================= */

export interface CreateCreativeOrderInput {
  itemId:
    CreativeItemId;

  buyerId:
    CreativeUserId;

  source:
    CreativeOrderSource;

  paymentMethod:
    CreativePaymentMethod;

  buyerNote?:
    string | null;

  returnTo?:
    string | null;
}

/* =========================================================
   DATOS INTERNOS PARA CREAR EL PEDIDO
   ========================================================= */

export interface CreateCreativeOrderRecordInput {
  itemId:
    CreativeItemId;

  buyerId:
    CreativeUserId;

  source:
    CreativeOrderSource;

  paymentMethod:
    CreativePaymentMethod;

  price:
    CreativePrice;

  referenceCode:
    string;

  buyerNote:
    string | null;

  expiresAt:
    CreativeDateValue | null;
}

/* =========================================================
   RESULTADO DE CREACIÓN
   ========================================================= */

export type CreativeOrderCreationStatus =
  | "CREATED"
  | "EXISTING_PENDING_ORDER"
  | "ALREADY_PURCHASED"
  | "ITEM_NOT_FOUND"
  | "ITEM_NOT_PURCHASABLE"
  | "AUTHENTICATION_REQUIRED";

export interface CreateCreativeOrderResult {
  status:
    CreativeOrderCreationStatus;

  order:
    CreativeOrder | null;

  paymentInstructions:
    CreativeYapePaymentInstructions | null;

  redirectTo:
    string | null;
}

/* =========================================================
   CANCELACIÓN DEL PEDIDO
   ========================================================= */

export interface CancelCreativeOrderInput {
  orderId:
    CreativeOrderId;

  actorId:
    CreativeUserId | null;

  actorRole:
    CreativeOrderActorRole;

  reason:
    CreativeOrderCancellationReason;

  note:
    string | null;
}

export interface CancelCreativeOrderResult {
  orderId:
    CreativeOrderId;

  previousStatus:
    CreativeOrderStatus;

  currentStatus:
    "CANCELLED";

  reason:
    CreativeOrderCancellationReason;

  cancelledAt:
    CreativeDateValue;
}

/* =========================================================
   REEMBOLSO
   ========================================================= */

export interface RefundCreativeOrderInput {
  orderId:
    CreativeOrderId;

  administratorId:
    CreativeUserId;

  reason:
    string;

  note:
    string | null;
}

export interface RefundCreativeOrderResult {
  orderId:
    CreativeOrderId;

  previousStatus:
    CreativeOrderStatus;

  currentStatus:
    "REFUNDED";

  amountInCents:
    number;

  currency:
    CreativeCurrency;

  refundedAt:
    CreativeDateValue;
}

/* =========================================================
   ACCESO DE DESCARGA
   ========================================================= */

export interface CreativeDownloadGrant {
  id:
    CreativeDownloadGrantId;

  orderId:
    CreativeOrderId;

  itemId:
    CreativeItemId;

  userId:
    CreativeUserId;

  status:
    CreativeDownloadGrantStatus;

  tokenHash:
    string;

  maximumDownloads:
    number | null;

  downloadsUsed:
    number;

  expiresAt:
    CreativeDateValue | null;

  lastDownloadedAt:
    CreativeDateValue | null;

  revokedAt:
    CreativeDateValue | null;

  revokedByUserId:
    CreativeUserId | null;

  revocationReason:
    CreativeDownloadGrantRevocationReason | null;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   CREACIÓN DE ACCESO DE DESCARGA
   ========================================================= */

export interface CreateCreativeDownloadGrantInput {
  orderId:
    CreativeOrderId;

  itemId:
    CreativeItemId;

  userId:
    CreativeUserId;

  tokenHash:
    string;

  maximumDownloads:
    number | null;

  expiresAt:
    CreativeDateValue | null;
}

/* =========================================================
   RESULTADO DE SOLICITUD DE DESCARGA
   ========================================================= */

export type CreativeOrderDownloadStatus =
  | "AVAILABLE"
  | "ORDER_NOT_FOUND"
  | "ORDER_NOT_APPROVED"
  | "GRANT_NOT_FOUND"
  | "GRANT_EXPIRED"
  | "GRANT_REVOKED"
  | "DOWNLOAD_LIMIT_REACHED"
  | "FILE_UNAVAILABLE"
  | "UNAUTHORIZED";

export interface CreativeOrderDownloadResult {
  status:
    CreativeOrderDownloadStatus;

  orderId:
    CreativeOrderId;

  itemId:
    CreativeItemId | null;

  grantId:
    CreativeDownloadGrantId | null;

  downloadUrl:
    string | null;

  fileName:
    string | null;

  fileFormat:
    CreativeOriginalFileFormat | null;

  expiresAt:
    CreativeDateValue | null;

  remainingDownloads:
    number | null;
}

/* =========================================================
   REGISTRO DE DESCARGA
   ========================================================= */

export interface RegisterCreativeOrderDownloadInput {
  grantId:
    CreativeDownloadGrantId;

  orderId:
    CreativeOrderId;

  userId:
    CreativeUserId;

  ipHash:
    string | null;

  userAgent:
    string | null;
}

export interface RegisterCreativeOrderDownloadResult {
  grantId:
    CreativeDownloadGrantId;

  orderId:
    CreativeOrderId;

  registered:
    boolean;

  downloadsUsed:
    number;

  remainingDownloads:
    number | null;

  downloadedAt:
    CreativeDateValue;
}

/* =========================================================
   HISTORIAL DEL PEDIDO
   ========================================================= */

export type CreativeOrderHistoryAction =
  | "ORDER_CREATED"
  | "PAYMENT_PROOF_UPLOADED"
  | "PAYMENT_PROOF_REPLACED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "DOWNLOAD_ENABLED"
  | "DOWNLOAD_COMPLETED"
  | "ORDER_COMPLETED"
  | "ORDER_CANCELLED"
  | "ORDER_EXPIRED"
  | "ORDER_REFUNDED"
  | "ADMIN_NOTE_ADDED"
  | "BUYER_NOTE_UPDATED";

/* =========================================================
   ENTRADA DEL HISTORIAL
   ========================================================= */

export interface CreativeOrderHistoryEntry {
  id:
    CreativeOrderHistoryId;

  orderId:
    CreativeOrderId;

  action:
    CreativeOrderHistoryAction;

  actorId:
    CreativeUserId | null;

  actorRole:
    CreativeOrderActorRole;

  previousStatus:
    CreativeOrderStatus | null;

  currentStatus:
    CreativeOrderStatus;

  description:
    string;

  metadata:
    Record<
      string,
      unknown
    > | null;

  createdAt:
    CreativeDateValue;
}

/* =========================================================
   CREACIÓN DE HISTORIAL
   ========================================================= */

export interface CreateCreativeOrderHistoryInput {
  orderId:
    CreativeOrderId;

  action:
    CreativeOrderHistoryAction;

  actorId:
    CreativeUserId | null;

  actorRole:
    CreativeOrderActorRole;

  previousStatus:
    CreativeOrderStatus | null;

  currentStatus:
    CreativeOrderStatus;

  description:
    string;

  metadata:
    Record<
      string,
      unknown
    > | null;
}

/* =========================================================
   RESUMEN DEL PEDIDO PARA EL USUARIO
   ========================================================= */

export interface CreativeUserOrderSummary {
  id:
    CreativeOrderId;

  itemId:
    CreativeItemId;

  itemSlug:
    string;

  itemTitle:
    string;

  itemThumbnailUrl:
    string | null;

  status:
    CreativeOrderStatus;

  amountInCents:
    number;

  currency:
    CreativeCurrency;

  paymentMethod:
    CreativePaymentMethod;

  downloadAvailable:
    boolean;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   RESUMEN ADMINISTRATIVO
   ========================================================= */

export interface CreativeAdminOrderSummary {
  id:
    CreativeOrderId;

  referenceCode:
    string;

  itemId:
    CreativeItemId;

  itemTitle:
    string;

  itemThumbnailUrl:
    string | null;

  buyerId:
    CreativeUserId;

  buyerDisplayName:
    string;

  buyerEmail:
    string;

  status:
    CreativeOrderStatus;

  amountInCents:
    number;

  currency:
    CreativeCurrency;

  paymentMethod:
    CreativePaymentMethod;

  proofStatus:
    CreativePaymentProofStatus | null;

  operationNumber:
    string | null;

  expiresAt:
    CreativeDateValue | null;

  paymentSubmittedAt:
    CreativeDateValue | null;

  reviewedAt:
    CreativeDateValue | null;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   FILTROS DEL USUARIO
   ========================================================= */

export interface CreativeUserOrderFilters {
  statuses:
    CreativeOrderStatus[];

  search:
    string;

  page:
    number;

  pageSize:
    number;
}

/* =========================================================
   FILTROS ADMINISTRATIVOS
   ========================================================= */

export interface CreativeAdminOrderFilters {
  search:
    string;

  statuses:
    CreativeOrderStatus[];

  paymentProofStatuses:
    CreativePaymentProofStatus[];

  buyerId:
    CreativeUserId | null;

  itemId:
    CreativeItemId | null;

  createdFrom:
    CreativeDateValue | null;

  createdTo:
    CreativeDateValue | null;

  page:
    number;

  pageSize:
    number;

  sort:
    CreativeOrderSort;
}

/* =========================================================
   ORDENAMIENTO
   ========================================================= */

export type CreativeOrderSort =
  | "NEWEST"
  | "OLDEST"
  | "LAST_UPDATED"
  | "AMOUNT_ASC"
  | "AMOUNT_DESC"
  | "PAYMENT_SUBMITTED_FIRST"
  | "PENDING_REVIEW_FIRST";

/* =========================================================
   PAGINACIÓN
   ========================================================= */

export interface CreativeOrderPagination {
  page:
    number;

  pageSize:
    number;

  totalItems:
    number;

  totalPages:
    number;

  hasPreviousPage:
    boolean;

  hasNextPage:
    boolean;
}

/* =========================================================
   LISTADO DEL USUARIO
   ========================================================= */

export interface CreativeUserOrdersData {
  items:
    CreativeUserOrderSummary[];

  pagination:
    CreativeOrderPagination;

  filters:
    CreativeUserOrderFilters;
}

/* =========================================================
   LISTADO ADMINISTRATIVO
   ========================================================= */

export interface CreativeAdminOrdersData {
  items:
    CreativeAdminOrderSummary[];

  pagination:
    CreativeOrderPagination;

  filters:
    CreativeAdminOrderFilters;
}

/* =========================================================
   ESTADÍSTICAS DE PEDIDOS
   ========================================================= */

export interface CreativeOrderStatistics {
  totalOrders:
    number;

  pendingPayment:
    number;

  paymentSubmitted:
    number;

  paymentApproved:
    number;

  paymentRejected:
    number;

  completed:
    number;

  cancelled:
    number;

  expired:
    number;

  refunded:
    number;

  grossRevenueInCents:
    number;

  approvedRevenueInCents:
    number;

  refundedAmountInCents:
    number;

  currency:
    CreativeCurrency;

  conversionRate:
    number;

  approvalRate:
    number;

  rejectionRate:
    number;
}

/* =========================================================
   CONTEXTO DE SEGURIDAD
   ========================================================= */

export interface CreativeOrderRequestContext {
  ipHash:
    string | null;

  userAgent:
    string | null;

  requestId:
    string | null;

  origin:
    string | null;
}

/* =========================================================
   CONTROLADOR DEL PEDIDO PARA EL USUARIO
   ========================================================= */

export interface CreativeOrderController {
  order:
    CreativeOrder | null;

  paymentInstructions:
    CreativeYapePaymentInstructions | null;

  loading:
    boolean;

  creating:
    boolean;

  uploadingProof:
    boolean;

  cancelling:
    boolean;

  requestingDownload:
    boolean;

  errorMessage:
    string | null;

  createOrder:
    (
      input:
        CreateCreativeOrderInput,
    ) => Promise<CreateCreativeOrderResult>;

  uploadPaymentProof:
    (
      input:
        CreateCreativePaymentProofInput,
    ) => Promise<CreativePaymentProof>;

  replacePaymentProof:
    (
      input:
        CreateCreativePaymentProofInput,
    ) => Promise<CreativePaymentProof>;

  cancelOrder:
    (
      input:
        CancelCreativeOrderInput,
    ) => Promise<CancelCreativeOrderResult>;

  requestDownload:
    (
      orderId:
        CreativeOrderId,
    ) => Promise<CreativeOrderDownloadResult>;

  refresh:
    () => Promise<void>;
}

/* =========================================================
   CONTROLADOR ADMINISTRATIVO DE PEDIDOS
   ========================================================= */

export interface CreativeAdminOrderController {
  orders:
    CreativeAdminOrderSummary[];

  selectedOrder:
    CreativeOrder | null;

  statistics:
    CreativeOrderStatistics | null;

  filters:
    CreativeAdminOrderFilters;

  pagination:
    CreativeOrderPagination | null;

  loading:
    boolean;

  reviewing:
    boolean;

  errorMessage:
    string | null;

  setFilters:
    (
      filters:
        Partial<CreativeAdminOrderFilters>,
    ) => void;

  selectOrder:
    (
      orderId:
        CreativeOrderId,
    ) => Promise<void>;

  reviewPayment:
    (
      input:
        ReviewCreativePaymentInput,
    ) => Promise<ReviewCreativePaymentResult>;

  cancelOrder:
    (
      input:
        CancelCreativeOrderInput,
    ) => Promise<CancelCreativeOrderResult>;

  refundOrder:
    (
      input:
        RefundCreativeOrderInput,
    ) => Promise<RefundCreativeOrderResult>;

  refresh:
    () => Promise<void>;
}

/* =========================================================
   VALORES INICIALES
   ========================================================= */

export const EMPTY_CREATIVE_ORDER_STATISTICS:
  CreativeOrderStatistics = {
    totalOrders: 0,

    pendingPayment: 0,

    paymentSubmitted: 0,

    paymentApproved: 0,

    paymentRejected: 0,

    completed: 0,

    cancelled: 0,

    expired: 0,

    refunded: 0,

    grossRevenueInCents: 0,

    approvedRevenueInCents: 0,

    refundedAmountInCents: 0,

    currency: "PEN",

    conversionRate: 0,

    approvalRate: 0,

    rejectionRate: 0,
  };
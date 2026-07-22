/*
 * Tipos centrales del módulo Diseño / Creative.
 *
 * Este archivo representa:
 * - Diseños gratuitos.
 * - Diseños de pago.
 * - Trabajos de portafolio.
 * - Información pública de cada publicación.
 * - Archivos visuales y métricas.
 *
 * No debe contener lógica de negocio ni acceso a Prisma.
 */

/* =========================================================
   IDENTIFICADORES
   ========================================================= */

export type CreativeItemId =
  string;

export type CreativeItemSlug =
  string;

export type CreativeUserId =
  string;

/* =========================================================
   FECHAS
   ========================================================= */

/*
 * En el servidor las fechas pueden ser objetos Date.
 * Después de serializarse en una API serán cadenas ISO.
 */
export type CreativeDateValue =
  | Date
  | string;

export type NullableCreativeDateValue =
  | CreativeDateValue
  | null;

/* =========================================================
   TIPO COMERCIAL DEL CONTENIDO
   ========================================================= */

/*
 * FREE:
 * Puede descargarse sin iniciar sesión.
 *
 * PAID:
 * Requiere iniciar sesión, comprar y confirmar el pago.
 *
 * PORTFOLIO:
 * Solo sirve como muestra y permite solicitar un trabajo.
 */
export type CreativeContentType =
  | "FREE"
  | "PAID"
  | "PORTFOLIO";

/* =========================================================
   ESTADO DE PUBLICACIÓN
   ========================================================= */

export type CreativeItemStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "HIDDEN"
  | "ARCHIVED";

/* =========================================================
   CATEGORÍAS
   ========================================================= */

export type CreativeCategoryId =
  | "logo"
  | "flyer"
  | "illustration"
  | "photo-editing"
  | "social-media"
  | "branding"
  | "poster"
  | "business-card"
  | "brochure"
  | "banner"
  | "photography"
  | "other";

/* =========================================================
   PROGRAMAS Y HERRAMIENTAS
   ========================================================= */

export type CreativeToolId =
  | "adobe-illustrator"
  | "adobe-photoshop"
  | "adobe-lightroom"
  | "adobe-indesign"
  | "figma"
  | "canva"
  | "other";

/* =========================================================
   FORMATOS VISUALES
   ========================================================= */

export type CreativeImageFormat =
  | "JPEG"
  | "PNG"
  | "WEBP";

export type CreativeOriginalFileFormat =
  | "AI"
  | "PSD"
  | "PDF"
  | "SVG"
  | "EPS"
  | "INDD"
  | "JPEG"
  | "PNG"
  | "WEBP"
  | "ZIP"
  | "OTHER";

/* =========================================================
   ORIENTACIÓN
   ========================================================= */

export type CreativeOrientation =
  | "SQUARE"
  | "PORTRAIT"
  | "LANDSCAPE"
  | "PANORAMIC";

/* =========================================================
   LICENCIAS
   ========================================================= */

export type CreativeLicenseType =
  | "PERSONAL_USE"
  | "COMMERCIAL_USE"
  | "EDITORIAL_USE"
  | "CUSTOM_TERMS";

/* =========================================================
   MONEDA Y PAGO
   ========================================================= */

export type CreativeCurrency =
  "PEN";

export type CreativePaymentMethod =
  "YAPE";

/*
 * El importe se guarda en céntimos para evitar
 * errores de precisión con números decimales.
 *
 * Ejemplo:
 * S/ 25.90 = 2590 céntimos.
 */
export interface CreativePrice {
  amountInCents: number;
  currency: CreativeCurrency;
}

/* =========================================================
   POLÍTICAS DE DESCARGA
   ========================================================= */

export type CreativeDownloadPolicy =
  | "PUBLIC"
  | "AFTER_APPROVED_PAYMENT"
  | "DISABLED";

/* =========================================================
   TIPOS DE SOLICITUD PERSONALIZADA
   ========================================================= */

export type CreativeRequestKind =
  | "SIMILAR_DESIGN"
  | "CUSTOM_LOGO"
  | "CUSTOM_FLYER"
  | "CUSTOM_PHOTO_EDIT"
  | "CUSTOM_BRANDING"
  | "CUSTOM_SOCIAL_MEDIA_DESIGN"
  | "CUSTOM_OTHER";

/* =========================================================
   TEXTO LOCALIZADO
   ========================================================= */

export interface CreativeLocalizedText {
  es: string;
  en: string;
}

/* =========================================================
   DIMENSIONES DE UNA IMAGEN
   ========================================================= */

export interface CreativeMediaDimensions {
  width: number;
  height: number;
  orientation:
    CreativeOrientation;
}

/* =========================================================
   RECURSO VISUAL PÚBLICO
   ========================================================= */

/*
 * Representa una imagen que sí puede enviarse al navegador.
 *
 * Nunca debe contener rutas físicas privadas del servidor.
 */
export interface CreativeImageAsset {
  url: string;

  altEs: string;
  altEn: string;

  format:
    CreativeImageFormat;

  dimensions:
    CreativeMediaDimensions | null;

  sizeBytes:
    number | null;

  blurDataUrl?:
    | string
    | null;
}

/* =========================================================
   MULTIMEDIA DE UNA PUBLICACIÓN
   ========================================================= */

export interface CreativeItemMedia {
  /*
   * Imagen principal utilizada dentro del visor.
   */
  preview:
    CreativeImageAsset;

  /*
   * Imagen optimizada para las tarjetas del catálogo.
   */
  thumbnail:
    CreativeImageAsset | null;

  /*
   * Vista protegida utilizada principalmente para
   * publicaciones de pago y portafolio.
   */
  watermarkedPreview:
    CreativeImageAsset | null;
}

/* =========================================================
   INFORMACIÓN DEL ARCHIVO ORIGINAL
   ========================================================= */

/*
 * Esta información puede mostrarse públicamente,
 * pero no contiene la ruta privada del archivo.
 */
export interface CreativeOriginalFileInfo {
  format:
    CreativeOriginalFileFormat;

  sizeBytes:
    number | null;

  fileName:
    string | null;

  includedFiles:
    string[];
}

/* =========================================================
   AUTOR
   ========================================================= */

export interface CreativeAuthorSummary {
  id:
    CreativeUserId;

  displayName:
    string;

  avatarUrl:
    | string
    | null;
}

/* =========================================================
   MÉTRICAS
   ========================================================= */

export interface CreativeItemMetrics {
  viewsCount: number;
  likesCount: number;
  favoritesCount: number;
  commentsCount: number;
  downloadsCount: number;
  purchasesCount: number;
  requestsCount: number;
}

/* =========================================================
   CONFIGURACIÓN DE COMENTARIOS
   ========================================================= */

export interface CreativeCommentSettings {
  enabled: boolean;
  requireAuthentication: boolean;
}

/* =========================================================
   CONFIGURACIÓN DE MARCA DE AGUA
   ========================================================= */

export interface CreativeWatermarkSettings {
  enabled: boolean;

  text:
    string | null;

  opacity:
    number | null;
}

/* =========================================================
   BASE DE UNA PUBLICACIÓN
   ========================================================= */

export interface CreativeItemBase {
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

  author:
    CreativeAuthorSummary;

  media:
    CreativeItemMedia;

  originalFileInfo:
    CreativeOriginalFileInfo | null;

  licenseType:
    CreativeLicenseType;

  licenseDescriptionEs:
    string | null;

  licenseDescriptionEn:
    string | null;

  commentSettings:
    CreativeCommentSettings;

  watermarkSettings:
    CreativeWatermarkSettings;

  featured:
    boolean;

  metrics:
    CreativeItemMetrics;

  publishedAt:
    NullableCreativeDateValue;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   PUBLICACIÓN GRATUITA
   ========================================================= */

export interface CreativeFreeItem
  extends CreativeItemBase {
  contentType:
    "FREE";

  price:
    null;

  paymentMethods:
    [];

  requestKind:
    null;

  requestButtonLabelEs:
    null;

  requestButtonLabelEn:
    null;

  downloadPolicy:
    "PUBLIC";

  /*
   * Indica si el archivo gratuito ya fue cargado
   * correctamente en el almacenamiento.
   */
  downloadFileAvailable:
    boolean;
}

/* =========================================================
   PUBLICACIÓN DE PAGO
   ========================================================= */

export interface CreativePaidItem
  extends CreativeItemBase {
  contentType:
    "PAID";

  price:
    CreativePrice;

  paymentMethods:
    CreativePaymentMethod[];

  requestKind:
    null;

  requestButtonLabelEs:
    null;

  requestButtonLabelEn:
    null;

  downloadPolicy:
    "AFTER_APPROVED_PAYMENT";

  /*
   * Solo será true cuando el administrador haya subido
   * el archivo original o el paquete descargable.
   */
  downloadFileAvailable:
    boolean;
}

/* =========================================================
   PUBLICACIÓN DE PORTAFOLIO
   ========================================================= */

export interface CreativePortfolioItem
  extends CreativeItemBase {
  contentType:
    "PORTFOLIO";

  price:
    null;

  paymentMethods:
    [];

  requestKind:
    CreativeRequestKind;

  requestButtonLabelEs:
    string;

  requestButtonLabelEn:
    string;

  downloadPolicy:
    "DISABLED";

  downloadFileAvailable:
    false;
}

/* =========================================================
   PUBLICACIÓN COMPLETA
   ========================================================= */

export type CreativeItem =
  | CreativeFreeItem
  | CreativePaidItem
  | CreativePortfolioItem;

/* =========================================================
   RESUMEN PARA TARJETAS DEL CATÁLOGO
   ========================================================= */

/*
 * Contiene únicamente la información necesaria para
 * renderizar una tarjeta.
 *
 * El catálogo no necesita cargar la descripción completa,
 * comentarios ni archivos internos.
 */
export interface CreativeItemSummary {
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

  titleEs:
    string;

  titleEn:
    string;

  shortDescriptionEs:
    string;

  shortDescriptionEn:
    string;

  thumbnail:
    CreativeImageAsset | null;

  preview:
    CreativeImageAsset;

  price:
    CreativePrice | null;

  requestKind:
    CreativeRequestKind | null;

  requestButtonLabelEs:
    string | null;

  requestButtonLabelEn:
    string | null;

  featured:
    boolean;

  watermarkEnabled:
    boolean;

  metrics:
    CreativeItemMetrics;

  publishedAt:
    NullableCreativeDateValue;
}

/* =========================================================
   PERMISOS CALCULADOS PARA UN VISITANTE
   ========================================================= */

export interface CreativeItemAccess {
  canView: boolean;
  canDownload: boolean;
  canPurchase: boolean;
  canRequest: boolean;
  canLike: boolean;
  canFavorite: boolean;
  canComment: boolean;

  requiresAuthenticationForDownload:
    boolean;

  requiresAuthenticationForPurchase:
    boolean;

  requiresAuthenticationForInteraction:
    boolean;
}

/* =========================================================
   DEFINICIÓN DE CATEGORÍA
   ========================================================= */

export interface CreativeCategoryDefinition {
  id:
    CreativeCategoryId;

  nameEs:
    string;

  nameEn:
    string;

  descriptionEs:
    string;

  descriptionEn:
    string;

  iconKey:
    string;

  enabled:
    boolean;

  order:
    number;
}

/* =========================================================
   DEFINICIÓN DE HERRAMIENTA
   ========================================================= */

export interface CreativeToolDefinition {
  id:
    CreativeToolId;

  name:
    string;

  shortName:
    string;

  iconKey:
    string;

  enabled:
    boolean;

  order:
    number;
}

/* =========================================================
   ESTADO VACÍO DE MÉTRICAS
   ========================================================= */

export const EMPTY_CREATIVE_ITEM_METRICS:
  CreativeItemMetrics = {
    viewsCount: 0,
    likesCount: 0,
    favoritesCount: 0,
    commentsCount: 0,
    downloadsCount: 0,
    purchasesCount: 0,
    requestsCount: 0,
  };
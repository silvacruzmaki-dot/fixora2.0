import type {
  CreativeContentType,
  CreativeItemStatus,
} from "@/types/creative/creative-item.types";

/* =========================================================
   ROLES
   ========================================================= */

export type CreativePermissionRole =
  | "GUEST"
  | "USER"
  | "ADMIN";

/* =========================================================
   CONTEXTO DEL USUARIO
   ========================================================= */

export interface CreativePermissionContext {
  role?:
    CreativePermissionRole | null;

  authenticated?:
    boolean;

  userId?:
    string | null;

  purchasedItemIds?:
    readonly string[];

  downloadedItemIds?:
    readonly string[];
}

/* =========================================================
   DATOS MÍNIMOS DE LA PUBLICACIÓN
   ========================================================= */

export interface CreativePermissionItem {
  id:
    string;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  authorId?:
    string | null;

  allowComments?:
    boolean;
}

/* =========================================================
   RESULTADO GENERAL DE PERMISOS
   ========================================================= */

export interface CreativeItemPermissions {
  canView:
    boolean;

  canViewOriginal:
    boolean;

  canDownload:
    boolean;

  canPurchase:
    boolean;

  canRequestSimilar:
    boolean;

  canLike:
    boolean;

  canFavorite:
    boolean;

  canComment:
    boolean;

  canShare:
    boolean;

  canReport:
    boolean;

  canManage:
    boolean;

  requiresAuthenticationForDownload:
    boolean;

  requiresAuthenticationForPurchase:
    boolean;

  requiresAuthenticationForRequest:
    boolean;

  hasPurchased:
    boolean;
}

/* =========================================================
   NORMALIZACIÓN
   ========================================================= */

function normalizeCreativePermissionRole(
  context:
    CreativePermissionContext,
): CreativePermissionRole {
  if (
    context.role ===
    "ADMIN"
  ) {
    return "ADMIN";
  }

  if (
    context.authenticated ||
    context.role ===
      "USER"
  ) {
    return "USER";
  }

  return "GUEST";
}

function normalizeCreativePermissionId(
  value:
    string | null | undefined,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value.trim();
}

function creativePermissionListIncludes(
  values:
    readonly string[] | undefined,
  itemId:
    string,
): boolean {
  const normalizedItemId =
    normalizeCreativePermissionId(
      itemId,
    );

  if (
    !normalizedItemId ||
    !Array.isArray(
      values,
    )
  ) {
    return false;
  }

  return values.some(
    (
      value,
    ) =>
      normalizeCreativePermissionId(
        value,
      ) ===
      normalizedItemId,
  );
}

/* =========================================================
   AUTENTICACIÓN Y ROL
   ========================================================= */

export function isCreativeAuthenticated(
  context:
    CreativePermissionContext,
): boolean {
  return normalizeCreativePermissionRole(
    context,
  ) !==
    "GUEST";
}

export function isCreativeAdmin(
  context:
    CreativePermissionContext,
): boolean {
  return normalizeCreativePermissionRole(
    context,
  ) ===
    "ADMIN";
}

export function isCreativeItemAuthor(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  const userId =
    normalizeCreativePermissionId(
      context.userId,
    );

  const authorId =
    normalizeCreativePermissionId(
      item.authorId,
    );

  return Boolean(
    userId &&
    authorId &&
    userId ===
      authorId,
  );
}

/* =========================================================
   ESTADO DE LA PUBLICACIÓN
   ========================================================= */

export function isCreativeItemPublic(
  item:
    CreativePermissionItem,
): boolean {
  return item.status ===
    "PUBLISHED";
}

export function isCreativeItemArchived(
  item:
    CreativePermissionItem,
): boolean {
  return item.status ===
    "ARCHIVED";
}

export function isCreativeItemHidden(
  item:
    CreativePermissionItem,
): boolean {
  return item.status ===
    "HIDDEN";
}

export function isCreativeItemDraft(
  item:
    CreativePermissionItem,
): boolean {
  return item.status ===
    "DRAFT";
}

/* =========================================================
   COMPRA
   ========================================================= */

export function hasCreativeItemPurchase(
  context:
    CreativePermissionContext,
  item:
    Pick<
      CreativePermissionItem,
      "id"
    >,
): boolean {
  if (
    isCreativeAdmin(
      context,
    )
  ) {
    return true;
  }

  return creativePermissionListIncludes(
    context.purchasedItemIds,
    item.id,
  );
}

/* =========================================================
   VISUALIZACIÓN
   ========================================================= */

export function canViewCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  if (
    isCreativeAdmin(
      context,
    )
  ) {
    return true;
  }

  if (
    isCreativeItemAuthor(
      context,
      item,
    ) &&
    isCreativeAuthenticated(
      context,
    )
  ) {
    return true;
  }

  return isCreativeItemPublic(
    item,
  );
}

export function canViewCreativeOriginal(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  if (
    isCreativeAdmin(
      context,
    )
  ) {
    return true;
  }

  if (
    !isCreativeItemPublic(
      item,
    )
  ) {
    return false;
  }

  if (
    item.contentType ===
    "FREE"
  ) {
    return true;
  }

  if (
    item.contentType ===
    "PAID"
  ) {
    return hasCreativeItemPurchase(
      context,
      item,
    );
  }

  return false;
}

/* =========================================================
   DESCARGA
   ========================================================= */

export function canDownloadCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  if (
    isCreativeAdmin(
      context,
    )
  ) {
    return true;
  }

  if (
    !isCreativeItemPublic(
      item,
    )
  ) {
    return false;
  }

  if (
    item.contentType ===
    "PORTFOLIO"
  ) {
    return false;
  }

  if (
    item.contentType ===
    "FREE"
  ) {
    return true;
  }

  return hasCreativeItemPurchase(
    context,
    item,
  );
}

export function requiresCreativeAuthenticationForDownload(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    item.contentType ===
      "PAID" &&
    !isCreativeAuthenticated(
      context,
    )
  );
}

/* =========================================================
   COMPRA
   ========================================================= */

export function canPurchaseCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  if (
    isCreativeAdmin(
      context,
    )
  ) {
    return false;
  }

  if (
    !isCreativeAuthenticated(
      context,
    )
  ) {
    return false;
  }

  if (
    !isCreativeItemPublic(
      item,
    )
  ) {
    return false;
  }

  if (
    item.contentType !==
    "PAID"
  ) {
    return false;
  }

  return !hasCreativeItemPurchase(
    context,
    item,
  );
}

export function requiresCreativeAuthenticationForPurchase(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    item.contentType ===
      "PAID" &&
    isCreativeItemPublic(
      item,
    ) &&
    !isCreativeAuthenticated(
      context,
    )
  );
}

/* =========================================================
   SOLICITUD PERSONALIZADA
   ========================================================= */

export function canRequestCreativeSimilarDesign(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  if (
    !isCreativeItemPublic(
      item,
    )
  ) {
    return false;
  }

  return isCreativeAuthenticated(
    context,
  );
}

export function requiresCreativeAuthenticationForRequest(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeItemPublic(
      item,
    ) &&
    !isCreativeAuthenticated(
      context,
    )
  );
}

/* =========================================================
   INTERACCIONES
   ========================================================= */

export function canLikeCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAuthenticated(
      context,
    ) &&
    isCreativeItemPublic(
      item,
    )
  );
}

export function canFavoriteCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAuthenticated(
      context,
    ) &&
    isCreativeItemPublic(
      item,
    )
  );
}

export function canCommentCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAuthenticated(
      context,
    ) &&
    isCreativeItemPublic(
      item,
    ) &&
    item.allowComments !==
      false
  );
}

export function canShareCreativeItem(
  item:
    CreativePermissionItem,
): boolean {
  return isCreativeItemPublic(
    item,
  );
}

export function canReportCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAuthenticated(
      context,
    ) &&
    isCreativeItemPublic(
      item,
    )
  );
}

/* =========================================================
   ADMINISTRACIÓN
   ========================================================= */

export function canManageCreativeItem(
  context:
    CreativePermissionContext,
): boolean {
  return isCreativeAdmin(
    context,
  );
}

export function canCreateCreativeItem(
  context:
    CreativePermissionContext,
): boolean {
  return isCreativeAdmin(
    context,
  );
}

export function canEditCreativeItem(
  context:
    CreativePermissionContext,
): boolean {
  return isCreativeAdmin(
    context,
  );
}

export function canPublishCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAdmin(
      context,
    ) &&
    item.status !==
      "PUBLISHED"
  );
}

export function canHideCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAdmin(
      context,
    ) &&
    item.status ===
      "PUBLISHED"
  );
}

export function canArchiveCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAdmin(
      context,
    ) &&
    item.status !==
      "ARCHIVED"
  );
}

export function canRestoreCreativeItem(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAdmin(
      context,
    ) &&
    (
      item.status ===
        "ARCHIVED" ||
      item.status ===
        "HIDDEN"
    )
  );
}

export function canDeleteCreativeItemPermanently(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): boolean {
  return (
    isCreativeAdmin(
      context,
    ) &&
    item.status ===
      "ARCHIVED"
  );
}

/* =========================================================
   RESUMEN COMPLETO
   ========================================================= */

export function getCreativeItemPermissions(
  context:
    CreativePermissionContext,
  item:
    CreativePermissionItem,
): CreativeItemPermissions {
  return {
    canView:
      canViewCreativeItem(
        context,
        item,
      ),

    canViewOriginal:
      canViewCreativeOriginal(
        context,
        item,
      ),

    canDownload:
      canDownloadCreativeItem(
        context,
        item,
      ),

    canPurchase:
      canPurchaseCreativeItem(
        context,
        item,
      ),

    canRequestSimilar:
      canRequestCreativeSimilarDesign(
        context,
        item,
      ),

    canLike:
      canLikeCreativeItem(
        context,
        item,
      ),

    canFavorite:
      canFavoriteCreativeItem(
        context,
        item,
      ),

    canComment:
      canCommentCreativeItem(
        context,
        item,
      ),

    canShare:
      canShareCreativeItem(
        item,
      ),

    canReport:
      canReportCreativeItem(
        context,
        item,
      ),

    canManage:
      canManageCreativeItem(
        context,
      ),

    requiresAuthenticationForDownload:
      requiresCreativeAuthenticationForDownload(
        context,
        item,
      ),

    requiresAuthenticationForPurchase:
      requiresCreativeAuthenticationForPurchase(
        context,
        item,
      ),

    requiresAuthenticationForRequest:
      requiresCreativeAuthenticationForRequest(
        context,
        item,
      ),

    hasPurchased:
      hasCreativeItemPurchase(
        context,
        item,
      ),
  };
}

/* =========================================================
   ALIAS COMPATIBLES
   ========================================================= */

export const getCreativePermissions =
  getCreativeItemPermissions;

export const canViewCreative =
  canViewCreativeItem;

export const canDownloadCreative =
  canDownloadCreativeItem;

export const canPurchaseCreative =
  canPurchaseCreativeItem;

export const canRequestCreative =
  canRequestCreativeSimilarDesign;

export const canManageCreative =
  canManageCreativeItem;
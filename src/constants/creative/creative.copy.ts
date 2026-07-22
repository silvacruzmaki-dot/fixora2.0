/*
 * Textos oficiales del módulo Diseño / Creative.
 *
 * Este archivo contiene:
 * - Textos en español e inglés.
 * - Nombres y descripciones de categorías.
 * - Etiquetas de tipos de contenido.
 * - Estados de publicación.
 * - Textos del catálogo y visor.
 * - Acciones de usuarios y administradores.
 * - Mensajes de compras, solicitudes y comentarios.
 * - Estados vacíos, confirmaciones y errores.
 * - Textos de accesibilidad.
 *
 * No contiene:
 * - Componentes React.
 * - Rutas.
 * - Acceso a Prisma.
 * - Lógica de negocio.
 * - Llamadas HTTP.
 */

import type {
  CreativeCatalogSort,
  CreativeApiLanguage,
} from "@/types/creative/creative-api.types";

import type {
  CreativeCategoryId,
  CreativeContentType,
  CreativeDownloadPolicy,
  CreativeItemStatus,
  CreativeLicenseType,
  CreativeRequestKind,
  CreativeToolId,
} from "@/types/creative/creative-item.types";

import type {
  CreativeViewerPrimaryAction,
} from "@/types/creative/creative-viewer.types";

/* =========================================================
   TIPOS DE TEXTOS LOCALIZADOS
   ========================================================= */

export type CreativeCopyLanguage =
  CreativeApiLanguage;

export interface CreativeLocalizedCopy {
  es:
    string;

  en:
    string;
}

export interface CreativeNamedCopy {
  name:
    CreativeLocalizedCopy;

  description:
    CreativeLocalizedCopy;
}

export interface CreativeContentTypeCopy
  extends CreativeNamedCopy {
  shortName:
    CreativeLocalizedCopy;

  badge:
    CreativeLocalizedCopy;

  accessSummary:
    CreativeLocalizedCopy;
}

export interface CreativeStatusCopy
  extends CreativeNamedCopy {
  actionHint:
    CreativeLocalizedCopy;
}

export interface CreativeCategoryCopy
  extends CreativeNamedCopy {
  searchKeywords:
    CreativeLocalizedCopy;
}

export interface CreativeToolCopy {
  name:
    CreativeLocalizedCopy;

  shortName:
    string;
}

export interface CreativeRequestKindCopy
  extends CreativeNamedCopy {
  buttonLabel:
    CreativeLocalizedCopy;
}

export interface CreativeLicenseCopy
  extends CreativeNamedCopy {
  shortDescription:
    CreativeLocalizedCopy;
}

export interface CreativeDownloadPolicyCopy
  extends CreativeNamedCopy {
  requirement:
    CreativeLocalizedCopy;
}

/* =========================================================
   UTILIDAD PARA CREAR TEXTOS
   ========================================================= */

function createCreativeLocalizedCopy(
  es:
    string,
  en:
    string,
): CreativeLocalizedCopy {
  return {
    es,
    en,
  };
}

/* =========================================================
   UTILIDADES PÚBLICAS DE IDIOMA
   ========================================================= */

export function resolveCreativeCopyLanguage(
  value:
    string | null | undefined,
): CreativeCopyLanguage {
  return value ===
    "en"
    ? "en"
    : "es";
}

export function getCreativeCopyText(
  value:
    CreativeLocalizedCopy,
  language:
    CreativeCopyLanguage,
): string {
  return value[
    language
  ];
}

/* =========================================================
   TIPOS DE CONTENIDO
   ========================================================= */

export const CREATIVE_CONTENT_TYPE_COPY = {
  FREE: {
    name:
      createCreativeLocalizedCopy(
        "Diseño gratuito",
        "Free design",
      ),

    shortName:
      createCreativeLocalizedCopy(
        "Gratis",
        "Free",
      ),

    badge:
      createCreativeLocalizedCopy(
        "Descarga gratis",
        "Free download",
      ),

    description:
      createCreativeLocalizedCopy(
        "Contenido disponible para visualizar y descargar sin iniciar sesión.",
        "Content available to view and download without signing in.",
      ),

    accessSummary:
      createCreativeLocalizedCopy(
        "Ver y descargar libremente",
        "View and download freely",
      ),
  },

  PAID: {
    name:
      createCreativeLocalizedCopy(
        "Diseño de pago",
        "Paid design",
      ),

    shortName:
      createCreativeLocalizedCopy(
        "De pago",
        "Paid",
      ),

    badge:
      createCreativeLocalizedCopy(
        "Contenido premium",
        "Premium content",
      ),

    description:
      createCreativeLocalizedCopy(
        "Contenido visible para todos. La compra y la descarga requieren una sesión y un pago confirmado.",
        "Content visible to everyone. Purchasing and downloading require an account and an approved payment.",
      ),

    accessSummary:
      createCreativeLocalizedCopy(
        "Comprar para desbloquear la descarga",
        "Purchase to unlock the download",
      ),
  },

  PORTFOLIO: {
    name:
      createCreativeLocalizedCopy(
        "Trabajo de portafolio",
        "Portfolio work",
      ),

    shortName:
      createCreativeLocalizedCopy(
        "Portafolio",
        "Portfolio",
      ),

    badge:
      createCreativeLocalizedCopy(
        "Muestra profesional",
        "Professional showcase",
      ),

    description:
      createCreativeLocalizedCopy(
        "Trabajo exclusivo disponible únicamente como muestra. Permite solicitar un diseño similar o personalizado.",
        "Exclusive work available only as a showcase. A similar or custom design can be requested.",
      ),

    accessSummary:
      createCreativeLocalizedCopy(
        "Solo visualización y solicitud personalizada",
        "View only and request custom work",
      ),
  },
} as const satisfies Record<
  CreativeContentType,
  CreativeContentTypeCopy
>;

/* =========================================================
   ESTADOS DE PUBLICACIÓN
   ========================================================= */

export const CREATIVE_ITEM_STATUS_COPY = {
  DRAFT: {
    name:
      createCreativeLocalizedCopy(
        "Borrador",
        "Draft",
      ),

    description:
      createCreativeLocalizedCopy(
        "La publicación todavía está en preparación y solo puede verla el administrador.",
        "The publication is still being prepared and can only be viewed by the administrator.",
      ),

    actionHint:
      createCreativeLocalizedCopy(
        "Completa la información antes de publicarla.",
        "Complete the information before publishing it.",
      ),
  },

  PUBLISHED: {
    name:
      createCreativeLocalizedCopy(
        "Publicado",
        "Published",
      ),

    description:
      createCreativeLocalizedCopy(
        "La publicación está disponible en el catálogo público.",
        "The publication is available in the public catalog.",
      ),

    actionHint:
      createCreativeLocalizedCopy(
        "Los usuarios pueden encontrar este trabajo en el catálogo.",
        "Users can find this work in the catalog.",
      ),
  },

  HIDDEN: {
    name:
      createCreativeLocalizedCopy(
        "Oculto",
        "Hidden",
      ),

    description:
      createCreativeLocalizedCopy(
        "La publicación se conserva, pero no aparece en el catálogo público.",
        "The publication is preserved but does not appear in the public catalog.",
      ),

    actionHint:
      createCreativeLocalizedCopy(
        "Puedes volver a publicarla cuando sea necesario.",
        "You can publish it again whenever necessary.",
      ),
  },

  ARCHIVED: {
    name:
      createCreativeLocalizedCopy(
        "Archivado",
        "Archived",
      ),

    description:
      createCreativeLocalizedCopy(
        "La publicación está retirada y se conserva únicamente como registro administrativo.",
        "The publication has been withdrawn and is kept only as an administrative record.",
      ),

    actionHint:
      createCreativeLocalizedCopy(
        "Restaura la publicación antes de editarla o publicarla nuevamente.",
        "Restore the publication before editing or publishing it again.",
      ),
  },
} as const satisfies Record<
  CreativeItemStatus,
  CreativeStatusCopy
>;

/* =========================================================
   CATEGORÍAS
   ========================================================= */

export const CREATIVE_CATEGORY_COPY = {
  logo: {
    name:
      createCreativeLocalizedCopy(
        "Logotipos",
        "Logos",
      ),

    description:
      createCreativeLocalizedCopy(
        "Identidades visuales, símbolos de marca y logotipos profesionales.",
        "Visual identities, brand symbols, and professional logos.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "logo marca identidad símbolo empresa",
        "logo brand identity symbol company",
      ),
  },

  flyer: {
    name:
      createCreativeLocalizedCopy(
        "Flyers",
        "Flyers",
      ),

    description:
      createCreativeLocalizedCopy(
        "Diseños promocionales para eventos, negocios, campañas y publicaciones.",
        "Promotional designs for events, businesses, campaigns, and publications.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "flyer volante publicidad promoción evento",
        "flyer advertising promotion event",
      ),
  },

  illustration: {
    name:
      createCreativeLocalizedCopy(
        "Ilustraciones",
        "Illustrations",
      ),

    description:
      createCreativeLocalizedCopy(
        "Ilustraciones digitales, composiciones artísticas y gráficos vectoriales.",
        "Digital illustrations, artistic compositions, and vector graphics.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "ilustración arte dibujo vector gráfico",
        "illustration art drawing vector graphic",
      ),
  },

  "photo-editing": {
    name:
      createCreativeLocalizedCopy(
        "Edición fotográfica",
        "Photo editing",
      ),

    description:
      createCreativeLocalizedCopy(
        "Retoque, corrección de color, restauración y composición fotográfica.",
        "Retouching, color correction, restoration, and photo composition.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "foto edición retoque photoshop lightroom",
        "photo editing retouch photoshop lightroom",
      ),
  },

  "social-media": {
    name:
      createCreativeLocalizedCopy(
        "Redes sociales",
        "Social media",
      ),

    description:
      createCreativeLocalizedCopy(
        "Publicaciones, historias, portadas y piezas digitales para redes sociales.",
        "Posts, stories, covers, and digital assets for social media.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "redes sociales post historia instagram facebook",
        "social media post story instagram facebook",
      ),
  },

  branding: {
    name:
      createCreativeLocalizedCopy(
        "Identidad de marca",
        "Branding",
      ),

    description:
      createCreativeLocalizedCopy(
        "Sistemas visuales completos para empresas, productos y emprendimientos.",
        "Complete visual systems for companies, products, and businesses.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "branding marca identidad empresa manual",
        "branding brand identity company guidelines",
      ),
  },

  poster: {
    name:
      createCreativeLocalizedCopy(
        "Pósteres",
        "Posters",
      ),

    description:
      createCreativeLocalizedCopy(
        "Composiciones gráficas de gran impacto para impresión o difusión digital.",
        "High-impact graphic compositions for print or digital distribution.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "póster cartel afiche impresión",
        "poster print advertising",
      ),
  },

  "business-card": {
    name:
      createCreativeLocalizedCopy(
        "Tarjetas de presentación",
        "Business cards",
      ),

    description:
      createCreativeLocalizedCopy(
        "Diseños profesionales para presentación personal, empresarial o comercial.",
        "Professional designs for personal, business, or commercial presentation.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "tarjeta presentación contacto empresa",
        "business card contact company",
      ),
  },

  brochure: {
    name:
      createCreativeLocalizedCopy(
        "Folletos",
        "Brochures",
      ),

    description:
      createCreativeLocalizedCopy(
        "Dípticos, trípticos, catálogos y materiales informativos.",
        "Bi-folds, tri-folds, catalogs, and informational materials.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "folleto tríptico díptico catálogo",
        "brochure trifold bifold catalog",
      ),
  },

  banner: {
    name:
      createCreativeLocalizedCopy(
        "Banners",
        "Banners",
      ),

    description:
      createCreativeLocalizedCopy(
        "Banners publicitarios, portadas y encabezados para medios digitales.",
        "Advertising banners, covers, and headers for digital media.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "banner cabecera portada publicidad web",
        "banner header cover advertising web",
      ),
  },

  photography: {
    name:
      createCreativeLocalizedCopy(
        "Fotografía",
        "Photography",
      ),

    description:
      createCreativeLocalizedCopy(
        "Fotografías originales, composiciones y trabajos visuales profesionales.",
        "Original photographs, compositions, and professional visual work.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "fotografía foto retrato paisaje producto",
        "photography photo portrait landscape product",
      ),
  },

  other: {
    name:
      createCreativeLocalizedCopy(
        "Otros diseños",
        "Other designs",
      ),

    description:
      createCreativeLocalizedCopy(
        "Trabajos creativos que no pertenecen a una categoría específica.",
        "Creative work that does not belong to a specific category.",
      ),

    searchKeywords:
      createCreativeLocalizedCopy(
        "diseño creativo gráfico otro",
        "design creative graphic other",
      ),
  },
} as const satisfies Record<
  CreativeCategoryId,
  CreativeCategoryCopy
>;

/* =========================================================
   PROGRAMAS Y HERRAMIENTAS
   ========================================================= */

export const CREATIVE_TOOL_COPY = {
  "adobe-illustrator": {
    name:
      createCreativeLocalizedCopy(
        "Adobe Illustrator",
        "Adobe Illustrator",
      ),

    shortName:
      "Illustrator",
  },

  "adobe-photoshop": {
    name:
      createCreativeLocalizedCopy(
        "Adobe Photoshop",
        "Adobe Photoshop",
      ),

    shortName:
      "Photoshop",
  },

  "adobe-lightroom": {
    name:
      createCreativeLocalizedCopy(
        "Adobe Lightroom",
        "Adobe Lightroom",
      ),

    shortName:
      "Lightroom",
  },

  "adobe-indesign": {
    name:
      createCreativeLocalizedCopy(
        "Adobe InDesign",
        "Adobe InDesign",
      ),

    shortName:
      "InDesign",
  },

  figma: {
    name:
      createCreativeLocalizedCopy(
        "Figma",
        "Figma",
      ),

    shortName:
      "Figma",
  },

  canva: {
    name:
      createCreativeLocalizedCopy(
        "Canva",
        "Canva",
      ),

    shortName:
      "Canva",
  },

  other: {
    name:
      createCreativeLocalizedCopy(
        "Otra herramienta",
        "Other tool",
      ),

    shortName:
      "Other",
  },
} as const satisfies Record<
  CreativeToolId,
  CreativeToolCopy
>;

/* =========================================================
   TIPOS DE SOLICITUD
   ========================================================= */

export const CREATIVE_REQUEST_KIND_COPY = {
  SIMILAR_DESIGN: {
    name:
      createCreativeLocalizedCopy(
        "Diseño similar",
        "Similar design",
      ),

    description:
      createCreativeLocalizedCopy(
        "Solicita una propuesta inspirada en este trabajo, adaptada a tus necesidades.",
        "Request a proposal inspired by this work and adapted to your needs.",
      ),

    buttonLabel:
      createCreativeLocalizedCopy(
        "Solicitar un diseño similar",
        "Request a similar design",
      ),
  },

  CUSTOM_LOGO: {
    name:
      createCreativeLocalizedCopy(
        "Logo personalizado",
        "Custom logo",
      ),

    description:
      createCreativeLocalizedCopy(
        "Solicita el desarrollo de un logotipo exclusivo para tu marca o empresa.",
        "Request an exclusive logo for your brand or company.",
      ),

    buttonLabel:
      createCreativeLocalizedCopy(
        "Solicitar mi logo",
        "Request my logo",
      ),
  },

  CUSTOM_FLYER: {
    name:
      createCreativeLocalizedCopy(
        "Flyer personalizado",
        "Custom flyer",
      ),

    description:
      createCreativeLocalizedCopy(
        "Solicita un flyer adaptado a tu negocio, evento, producto o campaña.",
        "Request a flyer adapted to your business, event, product, or campaign.",
      ),

    buttonLabel:
      createCreativeLocalizedCopy(
        "Solicitar mi flyer",
        "Request my flyer",
      ),
  },

  CUSTOM_PHOTO_EDIT: {
    name:
      createCreativeLocalizedCopy(
        "Edición fotográfica personalizada",
        "Custom photo editing",
      ),

    description:
      createCreativeLocalizedCopy(
        "Solicita retoque, restauración, mejora o composición de tus fotografías.",
        "Request retouching, restoration, enhancement, or composition of your photographs.",
      ),

    buttonLabel:
      createCreativeLocalizedCopy(
        "Solicitar edición fotográfica",
        "Request photo editing",
      ),
  },

  CUSTOM_BRANDING: {
    name:
      createCreativeLocalizedCopy(
        "Identidad de marca personalizada",
        "Custom branding",
      ),

    description:
      createCreativeLocalizedCopy(
        "Solicita una propuesta visual completa para tu empresa o emprendimiento.",
        "Request a complete visual proposal for your company or business.",
      ),

    buttonLabel:
      createCreativeLocalizedCopy(
        "Solicitar identidad de marca",
        "Request branding",
      ),
  },

  CUSTOM_SOCIAL_MEDIA_DESIGN: {
    name:
      createCreativeLocalizedCopy(
        "Diseño para redes sociales",
        "Social media design",
      ),

    description:
      createCreativeLocalizedCopy(
        "Solicita publicaciones, historias, portadas o piezas digitales para tus redes.",
        "Request posts, stories, covers, or digital assets for your social media.",
      ),

    buttonLabel:
      createCreativeLocalizedCopy(
        "Solicitar diseño para redes",
        "Request social media design",
      ),
  },

  CUSTOM_OTHER: {
    name:
      createCreativeLocalizedCopy(
        "Trabajo personalizado",
        "Custom work",
      ),

    description:
      createCreativeLocalizedCopy(
        "Cuéntanos tu idea y solicita una propuesta personalizada.",
        "Tell us your idea and request a custom proposal.",
      ),

    buttonLabel:
      createCreativeLocalizedCopy(
        "Solicitar trabajo personalizado",
        "Request custom work",
      ),
  },
} as const satisfies Record<
  CreativeRequestKind,
  CreativeRequestKindCopy
>;

/* =========================================================
   LICENCIAS
   ========================================================= */

export const CREATIVE_LICENSE_TYPE_COPY = {
  PERSONAL_USE: {
    name:
      createCreativeLocalizedCopy(
        "Uso personal",
        "Personal use",
      ),

    shortDescription:
      createCreativeLocalizedCopy(
        "Permitido únicamente para proyectos personales.",
        "Allowed only for personal projects.",
      ),

    description:
      createCreativeLocalizedCopy(
        "La obra puede utilizarse en proyectos personales, pero no puede revenderse, redistribuirse ni utilizarse comercialmente.",
        "The work may be used in personal projects but cannot be resold, redistributed, or used commercially.",
      ),
  },

  COMMERCIAL_USE: {
    name:
      createCreativeLocalizedCopy(
        "Uso comercial",
        "Commercial use",
      ),

    shortDescription:
      createCreativeLocalizedCopy(
        "Permitido en proyectos comerciales según las condiciones indicadas.",
        "Allowed in commercial projects under the stated conditions.",
      ),

    description:
      createCreativeLocalizedCopy(
        "La obra puede utilizarse en proyectos comerciales respetando los límites, restricciones y condiciones de la licencia.",
        "The work may be used in commercial projects while respecting the license limits, restrictions, and conditions.",
      ),
  },

  EDITORIAL_USE: {
    name:
      createCreativeLocalizedCopy(
        "Uso editorial",
        "Editorial use",
      ),

    shortDescription:
      createCreativeLocalizedCopy(
        "Permitido para contenidos informativos o editoriales.",
        "Allowed for informational or editorial content.",
      ),

    description:
      createCreativeLocalizedCopy(
        "La obra puede utilizarse en publicaciones informativas, periodísticas o educativas, pero no para publicidad comercial directa.",
        "The work may be used in informational, journalistic, or educational publications, but not for direct commercial advertising.",
      ),
  },

  CUSTOM_TERMS: {
    name:
      createCreativeLocalizedCopy(
        "Condiciones personalizadas",
        "Custom terms",
      ),

    shortDescription:
      createCreativeLocalizedCopy(
        "El uso depende de las condiciones específicas de esta publicación.",
        "Usage depends on the specific conditions of this publication.",
      ),

    description:
      createCreativeLocalizedCopy(
        "Revisa cuidadosamente las condiciones particulares indicadas por FIXORA antes de utilizar el archivo.",
        "Carefully review the specific conditions provided by FIXORA before using the file.",
      ),
  },
} as const satisfies Record<
  CreativeLicenseType,
  CreativeLicenseCopy
>;

/* =========================================================
   POLÍTICAS DE DESCARGA
   ========================================================= */

export const CREATIVE_DOWNLOAD_POLICY_COPY = {
  PUBLIC: {
    name:
      createCreativeLocalizedCopy(
        "Descarga pública",
        "Public download",
      ),

    description:
      createCreativeLocalizedCopy(
        "El archivo puede descargarse sin iniciar sesión.",
        "The file can be downloaded without signing in.",
      ),

    requirement:
      createCreativeLocalizedCopy(
        "No requiere cuenta ni pago.",
        "No account or payment required.",
      ),
  },

  AFTER_APPROVED_PAYMENT: {
    name:
      createCreativeLocalizedCopy(
        "Descarga después del pago",
        "Download after payment",
      ),

    description:
      createCreativeLocalizedCopy(
        "El archivo se habilita cuando el administrador confirma el pago.",
        "The file is enabled after the administrator approves the payment.",
      ),

    requirement:
      createCreativeLocalizedCopy(
        "Requiere una sesión activa y un pago aprobado.",
        "Requires an active account and an approved payment.",
      ),
  },

  DISABLED: {
    name:
      createCreativeLocalizedCopy(
        "Descarga deshabilitada",
        "Download disabled",
      ),

    description:
      createCreativeLocalizedCopy(
        "Esta publicación está disponible únicamente como muestra visual.",
        "This publication is available only as a visual showcase.",
      ),

    requirement:
      createCreativeLocalizedCopy(
        "Puede solicitarse un trabajo similar o personalizado.",
        "A similar or custom design can be requested.",
      ),
  },
} as const satisfies Record<
  CreativeDownloadPolicy,
  CreativeDownloadPolicyCopy
>;

/* =========================================================
   ORDENAMIENTO DEL CATÁLOGO
   ========================================================= */

export const CREATIVE_CATALOG_SORT_COPY = {
  newest:
    createCreativeLocalizedCopy(
      "Más recientes",
      "Newest",
    ),

  oldest:
    createCreativeLocalizedCopy(
      "Más antiguos",
      "Oldest",
    ),

  "most-viewed":
    createCreativeLocalizedCopy(
      "Más vistos",
      "Most viewed",
    ),

  "most-liked":
    createCreativeLocalizedCopy(
      "Más gustados",
      "Most liked",
    ),

  "most-downloaded":
    createCreativeLocalizedCopy(
      "Más descargados",
      "Most downloaded",
    ),

  "most-popular":
    createCreativeLocalizedCopy(
      "Más populares",
      "Most popular",
    ),

  "price-low-to-high":
    createCreativeLocalizedCopy(
      "Precio: menor a mayor",
      "Price: low to high",
    ),

  "price-high-to-low":
    createCreativeLocalizedCopy(
      "Precio: mayor a menor",
      "Price: high to low",
    ),
} as const satisfies Record<
  CreativeCatalogSort,
  CreativeLocalizedCopy
>;

/* =========================================================
   ACCIÓN PRINCIPAL DEL VISOR
   ========================================================= */

export const CREATIVE_PRIMARY_ACTION_COPY = {
  DOWNLOAD_FREE:
    createCreativeLocalizedCopy(
      "Descargar gratis",
      "Download free",
    ),

  PURCHASE:
    createCreativeLocalizedCopy(
      "Comprar con Yape",
      "Purchase with Yape",
    ),

  REQUEST_SERVICE:
    createCreativeLocalizedCopy(
      "Solicitar un trabajo similar",
      "Request similar work",
    ),

  DOWNLOAD_PURCHASED:
    createCreativeLocalizedCopy(
      "Descargar archivo",
      "Download file",
    ),

  WAIT_PAYMENT_APPROVAL:
    createCreativeLocalizedCopy(
      "Pago en revisión",
      "Payment under review",
    ),

  NONE:
    createCreativeLocalizedCopy(
      "No disponible",
      "Unavailable",
    ),
} as const satisfies Record<
  CreativeViewerPrimaryAction,
  CreativeLocalizedCopy
>;

/* =========================================================
   TEXTOS GENERALES DEL MÓDULO
   ========================================================= */

export const CREATIVE_COPY = {
  module: {
    name:
      createCreativeLocalizedCopy(
        "Diseño",
        "Creative",
      ),

    fullName:
      createCreativeLocalizedCopy(
        "Diseño y contenido creativo",
        "Design and creative content",
      ),

    eyebrow:
      createCreativeLocalizedCopy(
        "Creative by FIXORA",
        "Creative by FIXORA",
      ),

    description:
      createCreativeLocalizedCopy(
        "Explora diseños, fotografías, identidades visuales y piezas creativas desarrolladas con precisión profesional.",
        "Explore designs, photographs, visual identities, and creative assets developed with professional precision.",
      ),
  },

  navigation: {
    catalog:
      createCreativeLocalizedCopy(
        "Catálogo",
        "Catalog",
      ),

    featured:
      createCreativeLocalizedCopy(
        "Destacados",
        "Featured",
      ),

    free:
      createCreativeLocalizedCopy(
        "Gratis",
        "Free",
      ),

    paid:
      createCreativeLocalizedCopy(
        "Premium",
        "Premium",
      ),

    portfolio:
      createCreativeLocalizedCopy(
        "Portafolio",
        "Portfolio",
      ),

    favorites:
      createCreativeLocalizedCopy(
        "Favoritos",
        "Favorites",
      ),

    myOrders:
      createCreativeLocalizedCopy(
        "Mis compras",
        "My purchases",
      ),

    myRequests:
      createCreativeLocalizedCopy(
        "Mis solicitudes",
        "My requests",
      ),

    administration:
      createCreativeLocalizedCopy(
        "Administración",
        "Administration",
      ),
  },

  hero: {
    badge:
      createCreativeLocalizedCopy(
        "Diseño profesional",
        "Professional design",
      ),

    title:
      createCreativeLocalizedCopy(
        "Ideas visuales creadas para destacar",
        "Visual ideas created to stand out",
      ),

    description:
      createCreativeLocalizedCopy(
        "Descubre recursos gratuitos, contenido premium y trabajos exclusivos que pueden convertirse en tu próximo proyecto personalizado.",
        "Discover free resources, premium content, and exclusive work that can become your next custom project.",
      ),

    primaryButton:
      createCreativeLocalizedCopy(
        "Explorar diseños",
        "Explore designs",
      ),

    secondaryButton:
      createCreativeLocalizedCopy(
        "Ver portafolio",
        "View portfolio",
      ),

    freeLabel:
      createCreativeLocalizedCopy(
        "Descargas gratuitas",
        "Free downloads",
      ),

    premiumLabel:
      createCreativeLocalizedCopy(
        "Contenido premium",
        "Premium content",
      ),

    customLabel:
      createCreativeLocalizedCopy(
        "Trabajos personalizados",
        "Custom work",
      ),
  },

  catalog: {
    title:
      createCreativeLocalizedCopy(
        "Catálogo creativo",
        "Creative catalog",
      ),

    description:
      createCreativeLocalizedCopy(
        "Encuentra el recurso visual adecuado o inspírate para solicitar una propuesta personalizada.",
        "Find the right visual resource or get inspired to request a custom proposal.",
      ),

    searchPlaceholder:
      createCreativeLocalizedCopy(
        "Buscar diseños, categorías o etiquetas...",
        "Search designs, categories, or tags...",
      ),

    searchLabel:
      createCreativeLocalizedCopy(
        "Buscar en el catálogo",
        "Search catalog",
      ),

    filters:
      createCreativeLocalizedCopy(
        "Filtros",
        "Filters",
      ),

    filterByType:
      createCreativeLocalizedCopy(
        "Tipo de contenido",
        "Content type",
      ),

    filterByCategory:
      createCreativeLocalizedCopy(
        "Categoría",
        "Category",
      ),

    filterByTool:
      createCreativeLocalizedCopy(
        "Herramienta",
        "Tool",
      ),

    sortBy:
      createCreativeLocalizedCopy(
        "Ordenar por",
        "Sort by",
      ),

    all:
      createCreativeLocalizedCopy(
        "Todos",
        "All",
      ),

    clearFilters:
      createCreativeLocalizedCopy(
        "Limpiar filtros",
        "Clear filters",
      ),

    applyFilters:
      createCreativeLocalizedCopy(
        "Aplicar filtros",
        "Apply filters",
      ),

    results:
      createCreativeLocalizedCopy(
        "resultados",
        "results",
      ),

    oneResult:
      createCreativeLocalizedCopy(
        "resultado",
        "result",
      ),

    loadMore:
      createCreativeLocalizedCopy(
        "Cargar más diseños",
        "Load more designs",
      ),

    loading:
      createCreativeLocalizedCopy(
        "Cargando diseños...",
        "Loading designs...",
      ),

    featured:
      createCreativeLocalizedCopy(
        "Destacado",
        "Featured",
      ),

    openDesign:
      createCreativeLocalizedCopy(
        "Ver diseño",
        "View design",
      ),

    openDetails:
      createCreativeLocalizedCopy(
        "Abrir detalles",
        "Open details",
      ),
  },

  card: {
    view:
      createCreativeLocalizedCopy(
        "Ver trabajo",
        "View work",
      ),

    like:
      createCreativeLocalizedCopy(
        "Me gusta",
        "Like",
      ),

    unlike:
      createCreativeLocalizedCopy(
        "Quitar Me gusta",
        "Unlike",
      ),

    favorite:
      createCreativeLocalizedCopy(
        "Guardar en favoritos",
        "Save to favorites",
      ),

    removeFavorite:
      createCreativeLocalizedCopy(
        "Quitar de favoritos",
        "Remove from favorites",
      ),

    share:
      createCreativeLocalizedCopy(
        "Compartir",
        "Share",
      ),

    priceFrom:
      createCreativeLocalizedCopy(
        "Precio",
        "Price",
      ),

    free:
      createCreativeLocalizedCopy(
        "Gratis",
        "Free",
      ),

    portfolio:
      createCreativeLocalizedCopy(
        "Solo muestra",
        "Showcase only",
      ),
  },

  viewer: {
    back:
      createCreativeLocalizedCopy(
        "Regresar",
        "Back",
      ),

    close:
      createCreativeLocalizedCopy(
        "Cerrar visor",
        "Close viewer",
      ),

    information:
      createCreativeLocalizedCopy(
        "Información",
        "Information",
      ),

    details:
      createCreativeLocalizedCopy(
        "Detalles del diseño",
        "Design details",
      ),

    description:
      createCreativeLocalizedCopy(
        "Descripción",
        "Description",
      ),

    category:
      createCreativeLocalizedCopy(
        "Categoría",
        "Category",
      ),

    tools:
      createCreativeLocalizedCopy(
        "Herramientas utilizadas",
        "Tools used",
      ),

    format:
      createCreativeLocalizedCopy(
        "Formato",
        "Format",
      ),

    resolution:
      createCreativeLocalizedCopy(
        "Resolución",
        "Resolution",
      ),

    fileSize:
      createCreativeLocalizedCopy(
        "Tamaño del archivo",
        "File size",
      ),

    license:
      createCreativeLocalizedCopy(
        "Licencia",
        "License",
      ),

    publishedAt:
      createCreativeLocalizedCopy(
        "Publicado",
        "Published",
      ),

    updatedAt:
      createCreativeLocalizedCopy(
        "Última actualización",
        "Last updated",
      ),

    createdBy:
      createCreativeLocalizedCopy(
        "Creado por",
        "Created by",
      ),

    tags:
      createCreativeLocalizedCopy(
        "Etiquetas",
        "Tags",
      ),

    related:
      createCreativeLocalizedCopy(
        "También podría interesarte",
        "You may also like",
      ),

    previous:
      createCreativeLocalizedCopy(
        "Diseño anterior",
        "Previous design",
      ),

    next:
      createCreativeLocalizedCopy(
        "Siguiente diseño",
        "Next design",
      ),

    loading:
      createCreativeLocalizedCopy(
        "Preparando el visor...",
        "Preparing viewer...",
      ),

    imageLoading:
      createCreativeLocalizedCopy(
        "Cargando imagen...",
        "Loading image...",
      ),

    imageError:
      createCreativeLocalizedCopy(
        "No fue posible cargar la imagen.",
        "The image could not be loaded.",
      ),
  },

  zoom: {
    zoomIn:
      createCreativeLocalizedCopy(
        "Acercar",
        "Zoom in",
      ),

    zoomOut:
      createCreativeLocalizedCopy(
        "Alejar",
        "Zoom out",
      ),

    reset:
      createCreativeLocalizedCopy(
        "Restablecer zoom",
        "Reset zoom",
      ),

    fullscreen:
      createCreativeLocalizedCopy(
        "Pantalla completa",
        "Fullscreen",
      ),

    exitFullscreen:
      createCreativeLocalizedCopy(
        "Salir de pantalla completa",
        "Exit fullscreen",
      ),

    fitImage:
      createCreativeLocalizedCopy(
        "Ajustar imagen",
        "Fit image",
      ),

    percentage:
      createCreativeLocalizedCopy(
        "Nivel de zoom",
        "Zoom level",
      ),

    maximumReached:
      createCreativeLocalizedCopy(
        "Se alcanzó el zoom máximo.",
        "Maximum zoom reached.",
      ),

    minimumReached:
      createCreativeLocalizedCopy(
        "Se alcanzó el zoom mínimo.",
        "Minimum zoom reached.",
      ),

    dragInstruction:
      createCreativeLocalizedCopy(
        "Arrastra la imagen para explorar sus detalles.",
        "Drag the image to explore its details.",
      ),
  },

  interactions: {
    like:
      createCreativeLocalizedCopy(
        "Me gusta",
        "Like",
      ),

    liked:
      createCreativeLocalizedCopy(
        "Te gusta",
        "Liked",
      ),

    favorite:
      createCreativeLocalizedCopy(
        "Guardar",
        "Save",
      ),

    favorited:
      createCreativeLocalizedCopy(
        "Guardado",
        "Saved",
      ),

    share:
      createCreativeLocalizedCopy(
        "Compartir",
        "Share",
      ),

    copyLink:
      createCreativeLocalizedCopy(
        "Copiar enlace",
        "Copy link",
      ),

    linkCopied:
      createCreativeLocalizedCopy(
        "Enlace copiado",
        "Link copied",
      ),

    nativeShare:
      createCreativeLocalizedCopy(
        "Compartir desde el dispositivo",
        "Share from device",
      ),

    views:
      createCreativeLocalizedCopy(
        "visualizaciones",
        "views",
      ),

    likes:
      createCreativeLocalizedCopy(
        "Me gusta",
        "likes",
      ),

    favorites:
      createCreativeLocalizedCopy(
        "guardados",
        "saves",
      ),

    downloads:
      createCreativeLocalizedCopy(
        "descargas",
        "downloads",
      ),

    comments:
      createCreativeLocalizedCopy(
        "comentarios",
        "comments",
      ),

    processing:
      createCreativeLocalizedCopy(
        "Procesando...",
        "Processing...",
      ),
  },

  comments: {
    title:
      createCreativeLocalizedCopy(
        "Comentarios",
        "Comments",
      ),

    addComment:
      createCreativeLocalizedCopy(
        "Agregar un comentario",
        "Add a comment",
      ),

    placeholder:
      createCreativeLocalizedCopy(
        "Comparte tu opinión sobre este trabajo...",
        "Share your thoughts about this work...",
      ),

    publish:
      createCreativeLocalizedCopy(
        "Publicar comentario",
        "Post comment",
      ),

    reply:
      createCreativeLocalizedCopy(
        "Responder",
        "Reply",
      ),

    replyTo:
      createCreativeLocalizedCopy(
        "Responder a",
        "Reply to",
      ),

    edit:
      createCreativeLocalizedCopy(
        "Editar comentario",
        "Edit comment",
      ),

    delete:
      createCreativeLocalizedCopy(
        "Eliminar comentario",
        "Delete comment",
      ),

    report:
      createCreativeLocalizedCopy(
        "Reportar comentario",
        "Report comment",
      ),

    showReplies:
      createCreativeLocalizedCopy(
        "Ver respuestas",
        "View replies",
      ),

    hideReplies:
      createCreativeLocalizedCopy(
        "Ocultar respuestas",
        "Hide replies",
      ),

    loadMore:
      createCreativeLocalizedCopy(
        "Cargar más comentarios",
        "Load more comments",
      ),

    noComments:
      createCreativeLocalizedCopy(
        "Todavía no hay comentarios. Sé la primera persona en compartir una opinión.",
        "There are no comments yet. Be the first person to share a thought.",
      ),

    loginRequired:
      createCreativeLocalizedCopy(
        "Inicia sesión para comentar o responder.",
        "Sign in to comment or reply.",
      ),

    commentPublished:
      createCreativeLocalizedCopy(
        "Tu comentario fue publicado.",
        "Your comment was posted.",
      ),

    commentUpdated:
      createCreativeLocalizedCopy(
        "Tu comentario fue actualizado.",
        "Your comment was updated.",
      ),

    commentDeleted:
      createCreativeLocalizedCopy(
        "El comentario fue eliminado.",
        "The comment was deleted.",
      ),

    commentReported:
      createCreativeLocalizedCopy(
        "El comentario fue enviado para revisión.",
        "The comment was submitted for review.",
      ),
  },

  authentication: {
    title:
      createCreativeLocalizedCopy(
        "Inicia sesión para continuar",
        "Sign in to continue",
      ),

    interactionDescription:
      createCreativeLocalizedCopy(
        "Necesitas una cuenta para dar Me gusta, guardar favoritos o comentar.",
        "You need an account to like, save favorites, or comment.",
      ),

    purchaseDescription:
      createCreativeLocalizedCopy(
        "Necesitas iniciar sesión para comprar este diseño y acceder a la descarga.",
        "You need to sign in to purchase this design and access the download.",
      ),

    requestDescription:
      createCreativeLocalizedCopy(
        "Necesitas iniciar sesión para enviar una solicitud personalizada.",
        "You need to sign in to submit a custom request.",
      ),

    login:
      createCreativeLocalizedCopy(
        "Iniciar sesión",
        "Sign in",
      ),

    register:
      createCreativeLocalizedCopy(
        "Crear una cuenta",
        "Create account",
      ),

    cancel:
      createCreativeLocalizedCopy(
        "Ahora no",
        "Not now",
      ),

    returnMessage:
      createCreativeLocalizedCopy(
        "Después de iniciar sesión regresarás a este diseño.",
        "After signing in, you will return to this design.",
      ),
  },

  download: {
    title:
      createCreativeLocalizedCopy(
        "Descargar diseño",
        "Download design",
      ),

    freeDescription:
      createCreativeLocalizedCopy(
        "Este recurso puede descargarse gratuitamente.",
        "This resource can be downloaded for free.",
      ),

    purchasedDescription:
      createCreativeLocalizedCopy(
        "Tu compra fue aprobada. El archivo ya está disponible.",
        "Your purchase was approved. The file is now available.",
      ),

    preparing:
      createCreativeLocalizedCopy(
        "Preparando descarga...",
        "Preparing download...",
      ),

    started:
      createCreativeLocalizedCopy(
        "La descarga ha comenzado.",
        "The download has started.",
      ),

    unavailable:
      createCreativeLocalizedCopy(
        "El archivo no está disponible temporalmente.",
        "The file is temporarily unavailable.",
      ),

    purchaseRequired:
      createCreativeLocalizedCopy(
        "Debes comprar este diseño antes de descargarlo.",
        "You must purchase this design before downloading it.",
      ),

    paymentPending:
      createCreativeLocalizedCopy(
        "Tu pago todavía está pendiente de revisión.",
        "Your payment is still pending review.",
      ),

    disabled:
      createCreativeLocalizedCopy(
        "Este trabajo pertenece al portafolio y no está disponible para descargar.",
        "This work belongs to the portfolio and is not available for download.",
      ),
  },

  purchase: {
    title:
      createCreativeLocalizedCopy(
        "Comprar diseño",
        "Purchase design",
      ),

    subtitle:
      createCreativeLocalizedCopy(
        "Desbloquea el archivo original mediante un pago seguro con Yape.",
        "Unlock the original file through a secure Yape payment.",
      ),

    price:
      createCreativeLocalizedCopy(
        "Precio",
        "Price",
      ),

    paymentMethod:
      createCreativeLocalizedCopy(
        "Método de pago",
        "Payment method",
      ),

    yape:
      createCreativeLocalizedCopy(
        "Yape",
        "Yape",
      ),

    continue:
      createCreativeLocalizedCopy(
        "Continuar con la compra",
        "Continue purchase",
      ),

    payWithYape:
      createCreativeLocalizedCopy(
        "Pagar con Yape",
        "Pay with Yape",
      ),

    referenceCode:
      createCreativeLocalizedCopy(
        "Código de referencia",
        "Reference code",
      ),

    amount:
      createCreativeLocalizedCopy(
        "Monto a pagar",
        "Amount to pay",
      ),

    accountHolder:
      createCreativeLocalizedCopy(
        "Titular",
        "Account holder",
      ),

    phoneNumber:
      createCreativeLocalizedCopy(
        "Número de Yape",
        "Yape number",
      ),

    uploadProof:
      createCreativeLocalizedCopy(
        "Subir comprobante",
        "Upload payment proof",
      ),

    replaceProof:
      createCreativeLocalizedCopy(
        "Reemplazar comprobante",
        "Replace payment proof",
      ),

    sendProof:
      createCreativeLocalizedCopy(
        "Enviar para revisión",
        "Submit for review",
      ),

    pendingPayment:
      createCreativeLocalizedCopy(
        "Esperando el pago",
        "Waiting for payment",
      ),

    pendingReview:
      createCreativeLocalizedCopy(
        "Comprobante en revisión",
        "Payment proof under review",
      ),

    approved:
      createCreativeLocalizedCopy(
        "Pago aprobado",
        "Payment approved",
      ),

    rejected:
      createCreativeLocalizedCopy(
        "Pago rechazado",
        "Payment rejected",
      ),

    completed:
      createCreativeLocalizedCopy(
        "Compra completada",
        "Purchase completed",
      ),

    cancelled:
      createCreativeLocalizedCopy(
        "Compra cancelada",
        "Purchase cancelled",
      ),

    proofUploaded:
      createCreativeLocalizedCopy(
        "El comprobante fue enviado correctamente.",
        "The payment proof was submitted successfully.",
      ),

    approvalMessage:
      createCreativeLocalizedCopy(
        "El administrador confirmó tu pago. Ya puedes descargar el archivo.",
        "The administrator approved your payment. You can now download the file.",
      ),

    reviewNotice:
      createCreativeLocalizedCopy(
        "Revisaremos tu comprobante antes de habilitar la descarga.",
        "We will review your payment proof before enabling the download.",
      ),
  },

  request: {
    title:
      createCreativeLocalizedCopy(
        "Solicitar trabajo personalizado",
        "Request custom work",
      ),

    description:
      createCreativeLocalizedCopy(
        "Cuéntanos qué necesitas y utiliza este diseño como referencia para tu proyecto.",
        "Tell us what you need and use this design as a reference for your project.",
      ),

    subject:
      createCreativeLocalizedCopy(
        "Asunto",
        "Subject",
      ),

    subjectPlaceholder:
      createCreativeLocalizedCopy(
        "Ejemplo: Necesito un logo para mi empresa",
        "Example: I need a logo for my company",
      ),

    message:
      createCreativeLocalizedCopy(
        "Describe tu proyecto",
        "Describe your project",
      ),

    messagePlaceholder:
      createCreativeLocalizedCopy(
        "Indica el tipo de diseño, colores, textos, medidas, fecha de entrega y cualquier detalle importante...",
        "Include the design type, colors, text, dimensions, delivery date, and any important details...",
      ),

    attachments:
      createCreativeLocalizedCopy(
        "Archivos de referencia",
        "Reference files",
      ),

    optional:
      createCreativeLocalizedCopy(
        "Opcional",
        "Optional",
      ),

    submit:
      createCreativeLocalizedCopy(
        "Enviar solicitud",
        "Submit request",
      ),

    submitted:
      createCreativeLocalizedCopy(
        "Tu solicitud fue enviada correctamente.",
        "Your request was submitted successfully.",
      ),

    pending:
      createCreativeLocalizedCopy(
        "Solicitud pendiente",
        "Request pending",
      ),

    contacted:
      createCreativeLocalizedCopy(
        "Contacto realizado",
        "Contacted",
      ),

    inProgress:
      createCreativeLocalizedCopy(
        "Trabajo en proceso",
        "Work in progress",
      ),

    completed:
      createCreativeLocalizedCopy(
        "Solicitud completada",
        "Request completed",
      ),

    cancelled:
      createCreativeLocalizedCopy(
        "Solicitud cancelada",
        "Request cancelled",
      ),
  },

  admin: {
    title:
      createCreativeLocalizedCopy(
        "Administración de Diseño",
        "Creative administration",
      ),

    description:
      createCreativeLocalizedCopy(
        "Gestiona publicaciones, archivos, compras, solicitudes, comentarios y estadísticas.",
        "Manage publications, files, purchases, requests, comments, and statistics.",
      ),

    dashboard:
      createCreativeLocalizedCopy(
        "Panel general",
        "Dashboard",
      ),

    addDesign:
      createCreativeLocalizedCopy(
        "Agregar diseño",
        "Add design",
      ),

    createDesign:
      createCreativeLocalizedCopy(
        "Crear publicación",
        "Create publication",
      ),

    editDesign:
      createCreativeLocalizedCopy(
        "Editar publicación",
        "Edit publication",
      ),

    duplicateDesign:
      createCreativeLocalizedCopy(
        "Duplicar publicación",
        "Duplicate publication",
      ),

    manageDesigns:
      createCreativeLocalizedCopy(
        "Administrar diseños",
        "Manage designs",
      ),

    manageOrders:
      createCreativeLocalizedCopy(
        "Administrar compras",
        "Manage purchases",
      ),

    manageRequests:
      createCreativeLocalizedCopy(
        "Administrar solicitudes",
        "Manage requests",
      ),

    manageComments:
      createCreativeLocalizedCopy(
        "Moderar comentarios",
        "Moderate comments",
      ),

    statistics:
      createCreativeLocalizedCopy(
        "Estadísticas",
        "Statistics",
      ),

    edit:
      createCreativeLocalizedCopy(
        "Editar",
        "Edit",
      ),

    publish:
      createCreativeLocalizedCopy(
        "Publicar",
        "Publish",
      ),

    hide:
      createCreativeLocalizedCopy(
        "Ocultar",
        "Hide",
      ),

    archive:
      createCreativeLocalizedCopy(
        "Archivar",
        "Archive",
      ),

    restore:
      createCreativeLocalizedCopy(
        "Restaurar",
        "Restore",
      ),

    delete:
      createCreativeLocalizedCopy(
        "Eliminar",
        "Delete",
      ),

    replacePreview:
      createCreativeLocalizedCopy(
        "Reemplazar imagen",
        "Replace image",
      ),

    replaceOriginal:
      createCreativeLocalizedCopy(
        "Reemplazar archivo original",
        "Replace original file",
      ),

    viewStatistics:
      createCreativeLocalizedCopy(
        "Ver estadísticas",
        "View statistics",
      ),

    saveDraft:
      createCreativeLocalizedCopy(
        "Guardar borrador",
        "Save draft",
      ),

    saveChanges:
      createCreativeLocalizedCopy(
        "Guardar cambios",
        "Save changes",
      ),

    publishNow:
      createCreativeLocalizedCopy(
        "Publicar ahora",
        "Publish now",
      ),

    preview:
      createCreativeLocalizedCopy(
        "Vista previa",
        "Preview",
      ),

    selectedItems:
      createCreativeLocalizedCopy(
        "elementos seleccionados",
        "selected items",
      ),

    bulkActions:
      createCreativeLocalizedCopy(
        "Acciones masivas",
        "Bulk actions",
      ),
  },

  form: {
    basicInformation:
      createCreativeLocalizedCopy(
        "Información principal",
        "Basic information",
      ),

    mediaFiles:
      createCreativeLocalizedCopy(
        "Imágenes y archivos",
        "Images and files",
      ),

    commercialSettings:
      createCreativeLocalizedCopy(
        "Configuración comercial",
        "Commercial settings",
      ),

    accessSettings:
      createCreativeLocalizedCopy(
        "Acceso y descarga",
        "Access and download",
      ),

    publicationSettings:
      createCreativeLocalizedCopy(
        "Publicación",
        "Publication",
      ),

    titleEs:
      createCreativeLocalizedCopy(
        "Título en español",
        "Spanish title",
      ),

    titleEn:
      createCreativeLocalizedCopy(
        "Título en inglés",
        "English title",
      ),

    slug:
      createCreativeLocalizedCopy(
        "Enlace permanente",
        "Permanent link",
      ),

    shortDescriptionEs:
      createCreativeLocalizedCopy(
        "Descripción corta en español",
        "Short description in Spanish",
      ),

    shortDescriptionEn:
      createCreativeLocalizedCopy(
        "Descripción corta en inglés",
        "Short description in English",
      ),

    descriptionEs:
      createCreativeLocalizedCopy(
        "Descripción completa en español",
        "Full description in Spanish",
      ),

    descriptionEn:
      createCreativeLocalizedCopy(
        "Descripción completa en inglés",
        "Full description in English",
      ),

    contentType:
      createCreativeLocalizedCopy(
        "Tipo de contenido",
        "Content type",
      ),

    status:
      createCreativeLocalizedCopy(
        "Estado",
        "Status",
      ),

    category:
      createCreativeLocalizedCopy(
        "Categoría",
        "Category",
      ),

    tools:
      createCreativeLocalizedCopy(
        "Programas utilizados",
        "Tools used",
      ),

    tags:
      createCreativeLocalizedCopy(
        "Etiquetas",
        "Tags",
      ),

    previewImage:
      createCreativeLocalizedCopy(
        "Imagen principal",
        "Main image",
      ),

    thumbnail:
      createCreativeLocalizedCopy(
        "Miniatura",
        "Thumbnail",
      ),

    generateThumbnail:
      createCreativeLocalizedCopy(
        "Generar miniatura automáticamente",
        "Generate thumbnail automatically",
      ),

    originalFile:
      createCreativeLocalizedCopy(
        "Archivo original editable",
        "Original editable file",
      ),

    downloadFile:
      createCreativeLocalizedCopy(
        "Archivo descargable",
        "Downloadable file",
      ),

    imageAltEs:
      createCreativeLocalizedCopy(
        "Texto alternativo en español",
        "Alternative text in Spanish",
      ),

    imageAltEn:
      createCreativeLocalizedCopy(
        "Texto alternativo en inglés",
        "Alternative text in English",
      ),

    price:
      createCreativeLocalizedCopy(
        "Precio",
        "Price",
      ),

    paymentMethods:
      createCreativeLocalizedCopy(
        "Métodos de pago",
        "Payment methods",
      ),

    requestType:
      createCreativeLocalizedCopy(
        "Tipo de solicitud",
        "Request type",
      ),

    requestButtonEs:
      createCreativeLocalizedCopy(
        "Texto del botón en español",
        "Spanish button label",
      ),

    requestButtonEn:
      createCreativeLocalizedCopy(
        "Texto del botón en inglés",
        "English button label",
      ),

    license:
      createCreativeLocalizedCopy(
        "Licencia",
        "License",
      ),

    watermark:
      createCreativeLocalizedCopy(
        "Marca de agua",
        "Watermark",
      ),

    watermarkText:
      createCreativeLocalizedCopy(
        "Texto de la marca de agua",
        "Watermark text",
      ),

    watermarkOpacity:
      createCreativeLocalizedCopy(
        "Opacidad de la marca de agua",
        "Watermark opacity",
      ),

    comments:
      createCreativeLocalizedCopy(
        "Permitir comentarios",
        "Allow comments",
      ),

    commentsRequireAuthentication:
      createCreativeLocalizedCopy(
        "Exigir inicio de sesión para comentar",
        "Require sign-in to comment",
      ),

    featured:
      createCreativeLocalizedCopy(
        "Marcar como destacado",
        "Mark as featured",
      ),

    required:
      createCreativeLocalizedCopy(
        "Obligatorio",
        "Required",
      ),

    optional:
      createCreativeLocalizedCopy(
        "Opcional",
        "Optional",
      ),
  },

  upload: {
    selectFile:
      createCreativeLocalizedCopy(
        "Seleccionar archivo",
        "Select file",
      ),

    changeFile:
      createCreativeLocalizedCopy(
        "Cambiar archivo",
        "Change file",
      ),

    removeFile:
      createCreativeLocalizedCopy(
        "Quitar archivo",
        "Remove file",
      ),

    dragAndDrop:
      createCreativeLocalizedCopy(
        "Arrastra el archivo aquí o haz clic para seleccionarlo",
        "Drag the file here or click to select it",
      ),

    uploading:
      createCreativeLocalizedCopy(
        "Subiendo archivo...",
        "Uploading file...",
      ),

    processing:
      createCreativeLocalizedCopy(
        "Procesando archivo...",
        "Processing file...",
      ),

    completed:
      createCreativeLocalizedCopy(
        "Archivo cargado correctamente",
        "File uploaded successfully",
      ),

    failed:
      createCreativeLocalizedCopy(
        "No fue posible cargar el archivo",
        "The file could not be uploaded",
      ),

    invalidType:
      createCreativeLocalizedCopy(
        "El formato seleccionado no está permitido.",
        "The selected format is not allowed.",
      ),

    tooLarge:
      createCreativeLocalizedCopy(
        "El archivo supera el tamaño máximo permitido.",
        "The file exceeds the maximum allowed size.",
      ),
  },

  confirmations: {
    leaveWithoutSavingTitle:
      createCreativeLocalizedCopy(
        "¿Salir sin guardar?",
        "Leave without saving?",
      ),

    leaveWithoutSavingDescription:
      createCreativeLocalizedCopy(
        "Los cambios realizados se perderán.",
        "Your changes will be lost.",
      ),

    archiveTitle:
      createCreativeLocalizedCopy(
        "¿Archivar esta publicación?",
        "Archive this publication?",
      ),

    archiveDescription:
      createCreativeLocalizedCopy(
        "La publicación dejará de estar disponible, pero sus datos se conservarán.",
        "The publication will become unavailable, but its data will be preserved.",
      ),

    deleteTitle:
      createCreativeLocalizedCopy(
        "¿Eliminar definitivamente?",
        "Delete permanently?",
      ),

    deleteDescription:
      createCreativeLocalizedCopy(
        "Esta acción puede afectar comentarios, favoritos, compras y solicitudes relacionadas. No podrá deshacerse.",
        "This action may affect related comments, favorites, purchases, and requests. It cannot be undone.",
      ),

    deleteCommentTitle:
      createCreativeLocalizedCopy(
        "¿Eliminar este comentario?",
        "Delete this comment?",
      ),

    deleteCommentDescription:
      createCreativeLocalizedCopy(
        "El comentario y sus respuestas dejarán de estar disponibles.",
        "The comment and its replies will no longer be available.",
      ),

    cancelOrderTitle:
      createCreativeLocalizedCopy(
        "¿Cancelar esta compra?",
        "Cancel this purchase?",
      ),

    cancelOrderDescription:
      createCreativeLocalizedCopy(
        "La operación será cancelada y el archivo no se habilitará.",
        "The operation will be cancelled and the file will not be enabled.",
      ),

    approvePaymentTitle:
      createCreativeLocalizedCopy(
        "¿Aprobar este pago?",
        "Approve this payment?",
      ),

    approvePaymentDescription:
      createCreativeLocalizedCopy(
        "El comprador recibirá acceso al archivo descargable.",
        "The buyer will receive access to the downloadable file.",
      ),

    rejectPaymentTitle:
      createCreativeLocalizedCopy(
        "¿Rechazar este comprobante?",
        "Reject this payment proof?",
      ),

    rejectPaymentDescription:
      createCreativeLocalizedCopy(
        "El comprador deberá revisar o reemplazar su comprobante.",
        "The buyer will need to review or replace the payment proof.",
      ),

    cancel:
      createCreativeLocalizedCopy(
        "Cancelar",
        "Cancel",
      ),

    confirm:
      createCreativeLocalizedCopy(
        "Confirmar",
        "Confirm",
      ),

    continue:
      createCreativeLocalizedCopy(
        "Continuar",
        "Continue",
      ),
  },

  feedback: {
    itemCreated:
      createCreativeLocalizedCopy(
        "La publicación fue creada correctamente.",
        "The publication was created successfully.",
      ),

    itemUpdated:
      createCreativeLocalizedCopy(
        "Los cambios fueron guardados correctamente.",
        "The changes were saved successfully.",
      ),

    itemPublished:
      createCreativeLocalizedCopy(
        "La publicación ya está disponible en el catálogo.",
        "The publication is now available in the catalog.",
      ),

    itemHidden:
      createCreativeLocalizedCopy(
        "La publicación fue ocultada.",
        "The publication was hidden.",
      ),

    itemArchived:
      createCreativeLocalizedCopy(
        "La publicación fue archivada.",
        "The publication was archived.",
      ),

    itemRestored:
      createCreativeLocalizedCopy(
        "La publicación fue restaurada.",
        "The publication was restored.",
      ),

    itemDeleted:
      createCreativeLocalizedCopy(
        "La publicación fue eliminada definitivamente.",
        "The publication was permanently deleted.",
      ),

    likeAdded:
      createCreativeLocalizedCopy(
        "Marcaste este trabajo como Me gusta.",
        "You liked this work.",
      ),

    likeRemoved:
      createCreativeLocalizedCopy(
        "Quitaste tu Me gusta.",
        "You removed your like.",
      ),

    favoriteAdded:
      createCreativeLocalizedCopy(
        "El diseño fue guardado en tus favoritos.",
        "The design was saved to your favorites.",
      ),

    favoriteRemoved:
      createCreativeLocalizedCopy(
        "El diseño fue eliminado de tus favoritos.",
        "The design was removed from your favorites.",
      ),

    linkCopied:
      createCreativeLocalizedCopy(
        "El enlace fue copiado al portapapeles.",
        "The link was copied to the clipboard.",
      ),
  },

  emptyStates: {
    catalogTitle:
      createCreativeLocalizedCopy(
        "No encontramos diseños",
        "No designs found",
      ),

    catalogDescription:
      createCreativeLocalizedCopy(
        "Prueba con otros términos o elimina algunos filtros.",
        "Try different terms or remove some filters.",
      ),

    favoritesTitle:
      createCreativeLocalizedCopy(
        "Todavía no guardaste diseños",
        "You have not saved any designs yet",
      ),

    favoritesDescription:
      createCreativeLocalizedCopy(
        "Utiliza el botón Guardar para crear tu colección de favoritos.",
        "Use the Save button to build your favorites collection.",
      ),

    ordersTitle:
      createCreativeLocalizedCopy(
        "Todavía no tienes compras",
        "You do not have any purchases yet",
      ),

    ordersDescription:
      createCreativeLocalizedCopy(
        "Los diseños premium que compres aparecerán en esta sección.",
        "Premium designs you purchase will appear in this section.",
      ),

    requestsTitle:
      createCreativeLocalizedCopy(
        "Todavía no tienes solicitudes",
        "You do not have any requests yet",
      ),

    requestsDescription:
      createCreativeLocalizedCopy(
        "Las solicitudes de trabajos personalizados aparecerán aquí.",
        "Custom work requests will appear here.",
      ),

    adminItemsTitle:
      createCreativeLocalizedCopy(
        "Todavía no hay publicaciones",
        "There are no publications yet",
      ),

    adminItemsDescription:
      createCreativeLocalizedCopy(
        "Crea el primer diseño para comenzar a construir el catálogo.",
        "Create the first design to start building the catalog.",
      ),

    commentsTitle:
      createCreativeLocalizedCopy(
        "No hay comentarios para moderar",
        "There are no comments to moderate",
      ),

    commentsDescription:
      createCreativeLocalizedCopy(
        "Los comentarios reportados o pendientes aparecerán aquí.",
        "Reported or pending comments will appear here.",
      ),
  },

  errors: {
    genericTitle:
      createCreativeLocalizedCopy(
        "Ocurrió un problema",
        "Something went wrong",
      ),

    genericDescription:
      createCreativeLocalizedCopy(
        "No pudimos completar la operación. Inténtalo nuevamente.",
        "We could not complete the operation. Please try again.",
      ),

    itemNotFound:
      createCreativeLocalizedCopy(
        "El diseño solicitado no existe o ya no está disponible.",
        "The requested design does not exist or is no longer available.",
      ),

    catalogLoadFailed:
      createCreativeLocalizedCopy(
        "No fue posible cargar el catálogo.",
        "The catalog could not be loaded.",
      ),

    viewerLoadFailed:
      createCreativeLocalizedCopy(
        "No fue posible abrir el visor.",
        "The viewer could not be opened.",
      ),

    interactionFailed:
      createCreativeLocalizedCopy(
        "No fue posible actualizar la interacción.",
        "The interaction could not be updated.",
      ),

    commentFailed:
      createCreativeLocalizedCopy(
        "No fue posible publicar el comentario.",
        "The comment could not be posted.",
      ),

    shareFailed:
      createCreativeLocalizedCopy(
        "No fue posible compartir este diseño.",
        "This design could not be shared.",
      ),

    downloadFailed:
      createCreativeLocalizedCopy(
        "No fue posible iniciar la descarga.",
        "The download could not be started.",
      ),

    purchaseFailed:
      createCreativeLocalizedCopy(
        "No fue posible iniciar la compra.",
        "The purchase could not be started.",
      ),

    requestFailed:
      createCreativeLocalizedCopy(
        "No fue posible enviar la solicitud.",
        "The request could not be submitted.",
      ),

    saveFailed:
      createCreativeLocalizedCopy(
        "No fue posible guardar los cambios.",
        "The changes could not be saved.",
      ),

    unauthorized:
      createCreativeLocalizedCopy(
        "Debes iniciar sesión para realizar esta acción.",
        "You must sign in to perform this action.",
      ),

    forbidden:
      createCreativeLocalizedCopy(
        "No tienes permisos para realizar esta acción.",
        "You do not have permission to perform this action.",
      ),

    rateLimited:
      createCreativeLocalizedCopy(
        "Realizaste demasiadas solicitudes. Espera un momento e inténtalo nuevamente.",
        "You made too many requests. Please wait a moment and try again.",
      ),

    retry:
      createCreativeLocalizedCopy(
        "Intentar nuevamente",
        "Try again",
      ),

    goBack:
      createCreativeLocalizedCopy(
        "Regresar al catálogo",
        "Return to catalog",
      ),
  },

  accessibility: {
    openViewer:
      createCreativeLocalizedCopy(
        "Abrir visor del diseño",
        "Open design viewer",
      ),

    closeViewer:
      createCreativeLocalizedCopy(
        "Cerrar el visor y regresar al catálogo",
        "Close the viewer and return to the catalog",
      ),

    mainImage:
      createCreativeLocalizedCopy(
        "Imagen principal del diseño",
        "Main design image",
      ),

    zoomToolbar:
      createCreativeLocalizedCopy(
        "Controles de zoom de la imagen",
        "Image zoom controls",
      ),

    interactions:
      createCreativeLocalizedCopy(
        "Interacciones de la publicación",
        "Publication interactions",
      ),

    comments:
      createCreativeLocalizedCopy(
        "Sección de comentarios",
        "Comments section",
      ),

    adminActions:
      createCreativeLocalizedCopy(
        "Acciones administrativas",
        "Administrative actions",
      ),

    previousDesign:
      createCreativeLocalizedCopy(
        "Abrir el diseño anterior",
        "Open previous design",
      ),

    nextDesign:
      createCreativeLocalizedCopy(
        "Abrir el siguiente diseño",
        "Open next design",
      ),

    loading:
      createCreativeLocalizedCopy(
        "Contenido cargando",
        "Content loading",
      ),

    imageZoomPercentage:
      createCreativeLocalizedCopy(
        "Porcentaje actual de ampliación de la imagen",
        "Current image zoom percentage",
      ),
  },
} as const;

/* =========================================================
   RESOLUCIÓN DE NOMBRES
   ========================================================= */

export function getCreativeContentTypeName(
  contentType:
    CreativeContentType,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_CONTENT_TYPE_COPY[
      contentType
    ].name,
    language,
  );
}

export function getCreativeContentTypeBadge(
  contentType:
    CreativeContentType,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_CONTENT_TYPE_COPY[
      contentType
    ].badge,
    language,
  );
}

export function getCreativeItemStatusName(
  status:
    CreativeItemStatus,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_ITEM_STATUS_COPY[
      status
    ].name,
    language,
  );
}

export function getCreativeCategoryName(
  categoryId:
    CreativeCategoryId,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_CATEGORY_COPY[
      categoryId
    ].name,
    language,
  );
}

export function getCreativeToolName(
  toolId:
    CreativeToolId,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_TOOL_COPY[
      toolId
    ].name,
    language,
  );
}

export function getCreativeRequestKindName(
  requestKind:
    CreativeRequestKind,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_REQUEST_KIND_COPY[
      requestKind
    ].name,
    language,
  );
}

export function getCreativeRequestButtonLabel(
  requestKind:
    CreativeRequestKind,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_REQUEST_KIND_COPY[
      requestKind
    ].buttonLabel,
    language,
  );
}

export function getCreativeLicenseName(
  licenseType:
    CreativeLicenseType,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_LICENSE_TYPE_COPY[
      licenseType
    ].name,
    language,
  );
}

export function getCreativeDownloadPolicyName(
  downloadPolicy:
    CreativeDownloadPolicy,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_DOWNLOAD_POLICY_COPY[
      downloadPolicy
    ].name,
    language,
  );
}

export function getCreativeCatalogSortLabel(
  sort:
    CreativeCatalogSort,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_CATALOG_SORT_COPY[
      sort
    ],
    language,
  );
}

export function getCreativePrimaryActionLabel(
  action:
    CreativeViewerPrimaryAction,
  language:
    CreativeCopyLanguage,
): string {
  return getCreativeCopyText(
    CREATIVE_PRIMARY_ACTION_COPY[
      action
    ],
    language,
  );
}
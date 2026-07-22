/*
 * Catálogo oficial de herramientas del módulo Diseño / Creative.
 *
 * Este archivo contiene:
 * - Herramientas y programas utilizados para crear diseños.
 * - Orden oficial para mostrarlos.
 * - Claves de iconos.
 * - Empresa desarrolladora.
 * - Capacidades de cada herramienta.
 * - Extensiones asociadas.
 * - Agrupaciones por especialidad.
 * - Búsqueda y validación.
 * - Conversión al idioma actual.
 *
 * No contiene:
 * - Componentes React.
 * - Iconos importados.
 * - Acceso a Prisma.
 * - Llamadas HTTP.
 * - Lógica de permisos.
 */

import {
  CREATIVE_TOOL_IDS,
} from "@/constants/creative/creative.constants";

import {
  CREATIVE_TOOL_COPY,
} from "@/constants/creative/creative.copy";

import type {
  CreativeCopyLanguage,
} from "@/constants/creative/creative.copy";

import type {
  CreativeToolDefinition,
  CreativeToolId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   CLAVES DE ICONOS
   ========================================================= */

/*
 * Estas claves se conectarán posteriormente con React Icons.
 *
 * Este archivo no importa componentes visuales para poder
 * utilizarse tanto en el servidor como en el navegador.
 */
export type CreativeToolIconKey =
  | "adobe-illustrator"
  | "adobe-photoshop"
  | "adobe-lightroom"
  | "adobe-indesign"
  | "figma"
  | "canva"
  | "other-tool";

/* =========================================================
   EMPRESAS DESARROLLADORAS
   ========================================================= */

export type CreativeToolCompany =
  | "Adobe"
  | "Figma"
  | "Canva"
  | "Other";

/* =========================================================
   CAPACIDADES DE LAS HERRAMIENTAS
   ========================================================= */

export type CreativeToolCapability =
  | "VECTOR_DESIGN"
  | "RASTER_EDITING"
  | "PHOTO_EDITING"
  | "PHOTO_COLOR_GRADING"
  | "PAGE_LAYOUT"
  | "BRANDING"
  | "ILLUSTRATION"
  | "SOCIAL_MEDIA_DESIGN"
  | "UI_UX_DESIGN"
  | "COLLABORATION"
  | "PROTOTYPING"
  | "PRINT_DESIGN"
  | "PRESENTATION_DESIGN"
  | "OTHER";

/* =========================================================
   DEFINICIÓN AMPLIADA
   ========================================================= */

export interface CreativeToolCatalogEntry
  extends CreativeToolDefinition {
  descriptionEs:
    string;

  descriptionEn:
    string;

  company:
    CreativeToolCompany;

  capabilities:
    CreativeToolCapability[];

  fileExtensions:
    string[];

  featured:
    boolean;
}

/* =========================================================
   ICONO POR HERRAMIENTA
   ========================================================= */

export const CREATIVE_TOOL_ICON_KEYS = {
  "adobe-illustrator":
    "adobe-illustrator",

  "adobe-photoshop":
    "adobe-photoshop",

  "adobe-lightroom":
    "adobe-lightroom",

  "adobe-indesign":
    "adobe-indesign",

  figma:
    "figma",

  canva:
    "canva",

  other:
    "other-tool",
} as const satisfies Record<
  CreativeToolId,
  CreativeToolIconKey
>;

/* =========================================================
   ESTADO HABILITADO
   ========================================================= */

export const CREATIVE_TOOL_ENABLED_STATE = {
  "adobe-illustrator":
    true,

  "adobe-photoshop":
    true,

  "adobe-lightroom":
    true,

  "adobe-indesign":
    true,

  figma:
    true,

  canva:
    true,

  other:
    true,
} as const satisfies Record<
  CreativeToolId,
  boolean
>;

/* =========================================================
   ORDEN OFICIAL
   ========================================================= */

export const CREATIVE_TOOL_ORDER = {
  "adobe-illustrator":
    1,

  "adobe-photoshop":
    2,

  "adobe-lightroom":
    3,

  "adobe-indesign":
    4,

  figma:
    5,

  canva:
    6,

  other:
    7,
} as const satisfies Record<
  CreativeToolId,
  number
>;

/* =========================================================
   EMPRESA POR HERRAMIENTA
   ========================================================= */

export const CREATIVE_TOOL_COMPANIES = {
  "adobe-illustrator":
    "Adobe",

  "adobe-photoshop":
    "Adobe",

  "adobe-lightroom":
    "Adobe",

  "adobe-indesign":
    "Adobe",

  figma:
    "Figma",

  canva:
    "Canva",

  other:
    "Other",
} as const satisfies Record<
  CreativeToolId,
  CreativeToolCompany
>;

/* =========================================================
   DESCRIPCIONES
   ========================================================= */

export const CREATIVE_TOOL_DESCRIPTIONS = {
  "adobe-illustrator": {
    es:
      "Herramienta profesional para ilustración vectorial, creación de logotipos, iconos, identidad visual y piezas gráficas escalables.",

    en:
      "Professional tool for vector illustration, logo creation, icons, visual identity, and scalable graphic assets.",
  },

  "adobe-photoshop": {
    es:
      "Herramienta profesional para edición de imágenes, retoque fotográfico, composiciones, restauración y diseño digital.",

    en:
      "Professional tool for image editing, photo retouching, compositions, restoration, and digital design.",
  },

  "adobe-lightroom": {
    es:
      "Herramienta especializada en revelado digital, corrección de color, iluminación y organización profesional de fotografías.",

    en:
      "Tool specialized in digital development, color correction, lighting, and professional photo organization.",
  },

  "adobe-indesign": {
    es:
      "Herramienta profesional para diagramación editorial, revistas, catálogos, folletos, documentos y materiales destinados a impresión.",

    en:
      "Professional tool for editorial layout, magazines, catalogs, brochures, documents, and print materials.",
  },

  figma: {
    es:
      "Plataforma colaborativa para diseño de interfaces, prototipos, sistemas visuales, componentes y experiencias digitales.",

    en:
      "Collaborative platform for interface design, prototypes, visual systems, components, and digital experiences.",
  },

  canva: {
    es:
      "Plataforma de diseño visual para publicaciones, presentaciones, contenido de redes sociales, materiales promocionales y composiciones rápidas.",

    en:
      "Visual design platform for posts, presentations, social media content, promotional materials, and rapid compositions.",
  },

  other: {
    es:
      "Otra herramienta, programa o técnica utilizada para desarrollar el contenido creativo.",

    en:
      "Another tool, program, or technique used to develop the creative content.",
  },
} as const satisfies Record<
  CreativeToolId,
  {
    es:
      string;

    en:
      string;
  }
>;

/* =========================================================
   CAPACIDADES POR HERRAMIENTA
   ========================================================= */

export const CREATIVE_TOOL_CAPABILITIES = {
  "adobe-illustrator": [
    "VECTOR_DESIGN",
    "BRANDING",
    "ILLUSTRATION",
    "PRINT_DESIGN",
  ],

  "adobe-photoshop": [
    "RASTER_EDITING",
    "PHOTO_EDITING",
    "ILLUSTRATION",
    "SOCIAL_MEDIA_DESIGN",
    "PRINT_DESIGN",
  ],

  "adobe-lightroom": [
    "PHOTO_EDITING",
    "PHOTO_COLOR_GRADING",
  ],

  "adobe-indesign": [
    "PAGE_LAYOUT",
    "PRINT_DESIGN",
    "BRANDING",
  ],

  figma: [
    "UI_UX_DESIGN",
    "COLLABORATION",
    "PROTOTYPING",
    "VECTOR_DESIGN",
    "BRANDING",
  ],

  canva: [
    "SOCIAL_MEDIA_DESIGN",
    "PRESENTATION_DESIGN",
    "PRINT_DESIGN",
    "COLLABORATION",
  ],

  other: [
    "OTHER",
  ],
} as const satisfies Record<
  CreativeToolId,
  readonly CreativeToolCapability[]
>;

/* =========================================================
   EXTENSIONES ASOCIADAS
   ========================================================= */

/*
 * Estas extensiones son informativas.
 *
 * La validación real de archivos se realizará posteriormente
 * mediante MIME type, extensión y firma binaria.
 */
export const CREATIVE_TOOL_FILE_EXTENSIONS = {
  "adobe-illustrator": [
    "ai",
    "eps",
    "svg",
    "pdf",
  ],

  "adobe-photoshop": [
    "psd",
    "psb",
    "png",
    "jpg",
    "jpeg",
    "webp",
    "tif",
    "tiff",
  ],

  "adobe-lightroom": [
    "dng",
    "xmp",
    "jpg",
    "jpeg",
    "png",
    "tif",
    "tiff",
  ],

  "adobe-indesign": [
    "indd",
    "idml",
    "pdf",
  ],

  figma: [
    "fig",
    "svg",
    "pdf",
    "png",
    "jpg",
  ],

  canva: [
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "svg",
    "pptx",
  ],

  other: [],
} as const satisfies Record<
  CreativeToolId,
  readonly string[]
>;

/* =========================================================
   HERRAMIENTAS DESTACADAS
   ========================================================= */

export const CREATIVE_FEATURED_TOOL_IDS = [
  "adobe-illustrator",
  "adobe-photoshop",
  "adobe-lightroom",
  "figma",
] as const satisfies readonly CreativeToolId[];

/* =========================================================
   HERRAMIENTAS DE ADOBE
   ========================================================= */

export const CREATIVE_ADOBE_TOOL_IDS = [
  "adobe-illustrator",
  "adobe-photoshop",
  "adobe-lightroom",
  "adobe-indesign",
] as const satisfies readonly CreativeToolId[];

/* =========================================================
   HERRAMIENTAS DE DISEÑO VECTORIAL
   ========================================================= */

export const CREATIVE_VECTOR_TOOL_IDS = [
  "adobe-illustrator",
  "figma",
  "canva",
] as const satisfies readonly CreativeToolId[];

/* =========================================================
   HERRAMIENTAS DE FOTOGRAFÍA
   ========================================================= */

export const CREATIVE_PHOTO_TOOL_IDS = [
  "adobe-photoshop",
  "adobe-lightroom",
] as const satisfies readonly CreativeToolId[];

/* =========================================================
   HERRAMIENTAS DE DIAGRAMACIÓN
   ========================================================= */

export const CREATIVE_LAYOUT_TOOL_IDS = [
  "adobe-indesign",
  "adobe-illustrator",
  "canva",
] as const satisfies readonly CreativeToolId[];

/* =========================================================
   HERRAMIENTAS COLABORATIVAS
   ========================================================= */

export const CREATIVE_COLLABORATIVE_TOOL_IDS = [
  "figma",
  "canva",
] as const satisfies readonly CreativeToolId[];

/* =========================================================
   DEFINICIONES COMPLETAS
   ========================================================= */

export const CREATIVE_TOOLS:
  readonly CreativeToolCatalogEntry[] =
    CREATIVE_TOOL_IDS
      .map(
        (
          toolId,
        ): CreativeToolCatalogEntry => ({
          id:
            toolId,

          /*
           * Nombre técnico principal.
           * Para mostrar textos localizados se debe utilizar
           * resolveCreativeTool().
           */
          name:
            CREATIVE_TOOL_COPY[
              toolId
            ].name.en,

          shortName:
            CREATIVE_TOOL_COPY[
              toolId
            ].shortName,

          iconKey:
            CREATIVE_TOOL_ICON_KEYS[
              toolId
            ],

          enabled:
            CREATIVE_TOOL_ENABLED_STATE[
              toolId
            ],

          order:
            CREATIVE_TOOL_ORDER[
              toolId
            ],

          descriptionEs:
            CREATIVE_TOOL_DESCRIPTIONS[
              toolId
            ].es,

          descriptionEn:
            CREATIVE_TOOL_DESCRIPTIONS[
              toolId
            ].en,

          company:
            CREATIVE_TOOL_COMPANIES[
              toolId
            ],

          capabilities: [
            ...CREATIVE_TOOL_CAPABILITIES[
              toolId
            ],
          ],

          fileExtensions: [
            ...CREATIVE_TOOL_FILE_EXTENSIONS[
              toolId
            ],
          ],

          featured:
            CREATIVE_FEATURED_TOOL_IDS.some(
              (
                featuredToolId,
              ) =>
                featuredToolId ===
                toolId,
            ),
        }),
      )
      .sort(
        (
          firstTool,
          secondTool,
        ) =>
          firstTool.order -
          secondTool.order,
      );

/* =========================================================
   MAPA POR IDENTIFICADOR
   ========================================================= */

export const CREATIVE_TOOL_BY_ID:
  Readonly<
    Record<
      CreativeToolId,
      CreativeToolCatalogEntry
    >
  > =
    CREATIVE_TOOLS.reduce(
      (
        accumulator,
        tool,
      ) => {
        accumulator[
          tool.id
        ] =
          tool;

        return accumulator;
      },
      {} as Record<
        CreativeToolId,
        CreativeToolCatalogEntry
      >,
    );

/* =========================================================
   CONJUNTO PARA VALIDACIÓN
   ========================================================= */

const CREATIVE_TOOL_ID_SET =
  new Set<string>(
    CREATIVE_TOOL_IDS,
  );

/* =========================================================
   HERRAMIENTA RESUELTA PARA LA INTERFAZ
   ========================================================= */

export interface CreativeResolvedTool {
  id:
    CreativeToolId;

  name:
    string;

  shortName:
    string;

  description:
    string;

  iconKey:
    CreativeToolIconKey;

  company:
    CreativeToolCompany;

  capabilities:
    CreativeToolCapability[];

  fileExtensions:
    string[];

  featured:
    boolean;

  enabled:
    boolean;

  order:
    number;
}

/* =========================================================
   OBTENER UNA HERRAMIENTA
   ========================================================= */

export function getCreativeToolById(
  toolId:
    CreativeToolId,
): CreativeToolCatalogEntry {
  return CREATIVE_TOOL_BY_ID[
    toolId
  ];
}

/* =========================================================
   BUSCAR SIN CONFIAR EN EL VALOR
   ========================================================= */

export function findCreativeToolById(
  toolId:
    string | null | undefined,
): CreativeToolCatalogEntry | null {
  if (
    !toolId ||
    !isCreativeToolId(
      toolId,
    )
  ) {
    return null;
  }

  return CREATIVE_TOOL_BY_ID[
    toolId
  ];
}

/* =========================================================
   VALIDAR IDENTIFICADOR
   ========================================================= */

export function isCreativeToolId(
  value:
    unknown,
): value is CreativeToolId {
  return (
    typeof value ===
      "string" &&
    CREATIVE_TOOL_ID_SET.has(
      value,
    )
  );
}

/* =========================================================
   HERRAMIENTAS HABILITADAS
   ========================================================= */

export function getEnabledCreativeTools():
  CreativeToolCatalogEntry[] {
  return CREATIVE_TOOLS.filter(
    (
      tool,
    ) =>
      tool.enabled,
  );
}

/* =========================================================
   HERRAMIENTAS DESTACADAS
   ========================================================= */

export function getFeaturedCreativeTools():
  CreativeToolCatalogEntry[] {
  return CREATIVE_FEATURED_TOOL_IDS
    .map(
      (
        toolId,
      ) =>
        CREATIVE_TOOL_BY_ID[
          toolId
        ],
    )
    .filter(
      (
        tool,
      ) =>
        tool.enabled,
    );
}

/* =========================================================
   HERRAMIENTAS DE ADOBE
   ========================================================= */

export function getAdobeCreativeTools():
  CreativeToolCatalogEntry[] {
  return CREATIVE_ADOBE_TOOL_IDS
    .map(
      (
        toolId,
      ) =>
        CREATIVE_TOOL_BY_ID[
          toolId
        ],
    )
    .filter(
      (
        tool,
      ) =>
        tool.enabled,
    );
}

/* =========================================================
   HERRAMIENTAS VECTORIALES
   ========================================================= */

export function getVectorCreativeTools():
  CreativeToolCatalogEntry[] {
  return CREATIVE_VECTOR_TOOL_IDS
    .map(
      (
        toolId,
      ) =>
        CREATIVE_TOOL_BY_ID[
          toolId
        ],
    )
    .filter(
      (
        tool,
      ) =>
        tool.enabled,
    );
}

/* =========================================================
   HERRAMIENTAS DE FOTOGRAFÍA
   ========================================================= */

export function getPhotoCreativeTools():
  CreativeToolCatalogEntry[] {
  return CREATIVE_PHOTO_TOOL_IDS
    .map(
      (
        toolId,
      ) =>
        CREATIVE_TOOL_BY_ID[
          toolId
        ],
    )
    .filter(
      (
        tool,
      ) =>
        tool.enabled,
    );
}

/* =========================================================
   HERRAMIENTAS DE DIAGRAMACIÓN
   ========================================================= */

export function getLayoutCreativeTools():
  CreativeToolCatalogEntry[] {
  return CREATIVE_LAYOUT_TOOL_IDS
    .map(
      (
        toolId,
      ) =>
        CREATIVE_TOOL_BY_ID[
          toolId
        ],
    )
    .filter(
      (
        tool,
      ) =>
        tool.enabled,
    );
}

/* =========================================================
   HERRAMIENTAS COLABORATIVAS
   ========================================================= */

export function getCollaborativeCreativeTools():
  CreativeToolCatalogEntry[] {
  return CREATIVE_COLLABORATIVE_TOOL_IDS
    .map(
      (
        toolId,
      ) =>
        CREATIVE_TOOL_BY_ID[
          toolId
        ],
    )
    .filter(
      (
        tool,
      ) =>
        tool.enabled,
    );
}

/* =========================================================
   HERRAMIENTAS POR CAPACIDAD
   ========================================================= */

export function getCreativeToolsByCapability(
  capability:
    CreativeToolCapability,
): CreativeToolCatalogEntry[] {
  return CREATIVE_TOOLS.filter(
    (
      tool,
    ) =>
      tool.enabled &&
      tool.capabilities.includes(
        capability,
      ),
  );
}

/* =========================================================
   HERRAMIENTAS POR EMPRESA
   ========================================================= */

export function getCreativeToolsByCompany(
  company:
    CreativeToolCompany,
): CreativeToolCatalogEntry[] {
  return CREATIVE_TOOLS.filter(
    (
      tool,
    ) =>
      tool.enabled &&
      tool.company ===
        company,
  );
}

/* =========================================================
   RESOLVER HERRAMIENTA EN EL IDIOMA ACTUAL
   ========================================================= */

export function resolveCreativeTool(
  tool:
    CreativeToolCatalogEntry,
  language:
    CreativeCopyLanguage,
): CreativeResolvedTool {
  return {
    id:
      tool.id,

    name:
      language ===
        "en"
        ? CREATIVE_TOOL_COPY[
            tool.id
          ].name.en
        : CREATIVE_TOOL_COPY[
            tool.id
          ].name.es,

    shortName:
      tool.shortName,

    description:
      language ===
        "en"
        ? tool.descriptionEn
        : tool.descriptionEs,

    iconKey:
      tool.iconKey as
        CreativeToolIconKey,

    company:
      tool.company,

    capabilities: [
      ...tool.capabilities,
    ],

    fileExtensions: [
      ...tool.fileExtensions,
    ],

    featured:
      tool.featured,

    enabled:
      tool.enabled,

    order:
      tool.order,
  };
}

/* =========================================================
   RESOLVER TODAS LAS HERRAMIENTAS
   ========================================================= */

export function resolveCreativeTools(
  language:
    CreativeCopyLanguage,
  options: {
    includeDisabled?:
      boolean;

    featuredOnly?:
      boolean;

    company?:
      CreativeToolCompany;

    capability?:
      CreativeToolCapability;
  } = {},
): CreativeResolvedTool[] {
  const {
    includeDisabled =
      false,

    featuredOnly =
      false,

    company,

    capability,
  } =
    options;

  return CREATIVE_TOOLS
    .filter(
      (
        tool,
      ) =>
        includeDisabled ||
        tool.enabled,
    )
    .filter(
      (
        tool,
      ) =>
        !featuredOnly ||
        tool.featured,
    )
    .filter(
      (
        tool,
      ) =>
        !company ||
        tool.company ===
          company,
    )
    .filter(
      (
        tool,
      ) =>
        !capability ||
        tool.capabilities.includes(
          capability,
        ),
    )
    .map(
      (
        tool,
      ) =>
        resolveCreativeTool(
          tool,
          language,
        ),
    )
    .sort(
      (
        firstTool,
        secondTool,
      ) =>
        firstTool.order -
        secondTool.order,
    );
}

/* =========================================================
   BUSCAR HERRAMIENTAS
   ========================================================= */

export function searchCreativeTools(
  search:
    string,
  language:
    CreativeCopyLanguage,
): CreativeResolvedTool[] {
  const normalizedSearch =
    search
      .trim()
      .toLocaleLowerCase(
        language ===
          "en"
          ? "en-US"
          : "es-PE",
      );

  const tools =
    resolveCreativeTools(
      language,
    );

  if (!normalizedSearch) {
    return tools;
  }

  return tools.filter(
    (
      tool,
    ) => {
      const searchableText =
        [
          tool.id,
          tool.name,
          tool.shortName,
          tool.description,
          tool.company,
          ...tool.capabilities,
          ...tool.fileExtensions,
        ]
          .join(
            " ",
          )
          .toLocaleLowerCase(
            language ===
              "en"
              ? "en-US"
              : "es-PE",
          );

      return searchableText.includes(
        normalizedSearch,
      );
    },
  );
}

/* =========================================================
   NOMBRE LOCALIZADO
   ========================================================= */

export function getCreativeToolLocalizedName(
  toolId:
    CreativeToolId,
  language:
    CreativeCopyLanguage,
): string {
  return language ===
    "en"
    ? CREATIVE_TOOL_COPY[
        toolId
      ].name.en
    : CREATIVE_TOOL_COPY[
        toolId
      ].name.es;
}

/* =========================================================
   DESCRIPCIÓN LOCALIZADA
   ========================================================= */

export function getCreativeToolLocalizedDescription(
  toolId:
    CreativeToolId,
  language:
    CreativeCopyLanguage,
): string {
  const tool =
    CREATIVE_TOOL_BY_ID[
      toolId
    ];

  return language ===
    "en"
    ? tool.descriptionEn
    : tool.descriptionEs;
}

/* =========================================================
   COMPROBAR SI ES DESTACADA
   ========================================================= */

export function isFeaturedCreativeTool(
  toolId:
    CreativeToolId,
): boolean {
  return CREATIVE_FEATURED_TOOL_IDS.some(
    (
      featuredToolId,
    ) =>
      featuredToolId ===
      toolId,
  );
}

/* =========================================================
   COMPROBAR SI ES DE ADOBE
   ========================================================= */

export function isAdobeCreativeTool(
  toolId:
    CreativeToolId,
): boolean {
  return CREATIVE_ADOBE_TOOL_IDS.some(
    (
      adobeToolId,
    ) =>
      adobeToolId ===
      toolId,
  );
}

/* =========================================================
   COMPROBAR CAPACIDAD
   ========================================================= */

export function creativeToolSupportsCapability(
  toolId:
    CreativeToolId,
  capability:
    CreativeToolCapability,
): boolean {
  return CREATIVE_TOOL_BY_ID[
    toolId
  ].capabilities.includes(
    capability,
  );
}

/* =========================================================
   COMPROBAR EXTENSIÓN
   ========================================================= */

export function creativeToolSupportsExtension(
  toolId:
    CreativeToolId,
  extension:
    string,
): boolean {
  const normalizedExtension =
    extension
      .trim()
      .toLowerCase()
      .replace(
        /^\./,
        "",
      );

  if (!normalizedExtension) {
    return false;
  }

  return CREATIVE_TOOL_BY_ID[
    toolId
  ].fileExtensions.some(
    (
      allowedExtension,
    ) =>
      allowedExtension ===
      normalizedExtension,
  );
}

/* =========================================================
   NORMALIZAR LISTA DE HERRAMIENTAS
   ========================================================= */

/*
 * Elimina:
 * - Identificadores inválidos.
 * - Valores repetidos.
 * - Herramientas deshabilitadas, salvo que se indique lo contrario.
 */
export function normalizeCreativeToolIds(
  values:
    readonly unknown[],
  options: {
    includeDisabled?:
      boolean;
  } = {},
): CreativeToolId[] {
  const {
    includeDisabled =
      false,
  } =
    options;

  const normalizedTools:
    CreativeToolId[] = [];

  for (
    const value
    of values
  ) {
    if (
      !isCreativeToolId(
        value,
      )
    ) {
      continue;
    }

    const tool =
      CREATIVE_TOOL_BY_ID[
        value
      ];

    if (
      !includeDisabled &&
      !tool.enabled
    ) {
      continue;
    }

    if (
      normalizedTools.includes(
        value,
      )
    ) {
      continue;
    }

    normalizedTools.push(
      value,
    );
  }

  return normalizedTools.sort(
    (
      firstToolId,
      secondToolId,
    ) =>
      CREATIVE_TOOL_ORDER[
        firstToolId
      ] -
      CREATIVE_TOOL_ORDER[
        secondToolId
      ],
  );
}

/* =========================================================
   ESTADÍSTICAS ESTÁTICAS
   ========================================================= */

export const CREATIVE_TOOL_STATIC_STATISTICS = {
  total:
    CREATIVE_TOOLS.length,

  enabled:
    CREATIVE_TOOLS.filter(
      (
        tool,
      ) =>
        tool.enabled,
    ).length,

  featured:
    CREATIVE_FEATURED_TOOL_IDS.length,

  adobe:
    CREATIVE_ADOBE_TOOL_IDS.length,

  vector:
    CREATIVE_VECTOR_TOOL_IDS.length,

  photo:
    CREATIVE_PHOTO_TOOL_IDS.length,

  layout:
    CREATIVE_LAYOUT_TOOL_IDS.length,

  collaborative:
    CREATIVE_COLLABORATIVE_TOOL_IDS.length,
} as const;
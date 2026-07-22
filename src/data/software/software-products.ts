import type { SoftwareProduct } from "@/types/software";

/* =========================================================
   PRODUCTOS LOCALES DEL CATÁLOGO DE SOFTWARE
   ========================================================= */

export const softwareProducts: SoftwareProduct[] = [
  {
    id: "software-001",
    slug: "office-pro-business",
    name: "Office Pro Business",
    shortDescription:
      "Herramientas de oficina, almacenamiento y colaboración para empresas.",
    fullDescription:
      "Suite de productividad diseñada para empresas, profesionales y equipos de trabajo. Permite crear documentos, hojas de cálculo, presentaciones y trabajar colaborativamente desde cualquier dispositivo.",
    categoryId: "productivity",
    licenseType: "subscription",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Computadora portátil mostrando herramientas digitales de productividad",
    features: [
      "Aplicaciones de oficina premium",
      "Almacenamiento en la nube de 1 TB",
      "Colaboración en tiempo real",
      "Actualizaciones automáticas",
    ],
    requirements: [
      "Windows 10, Windows 11 o macOS",
      "Conexión a internet",
      "4 GB de memoria RAM como mínimo",
    ],
    price: 359,
    previousPrice: 419,
    currency: "PEN",
    priceDetail: "Por usuario / año",
    badge: "best-seller",
    discountPercentage: 14,
    rating: 4.9,
    reviewCount: 324,
    featured: true,
  },

  {
    id: "software-002",
    slug: "secure-shield-antivirus",
    name: "SecureShield Antivirus",
    shortDescription:
      "Protección avanzada contra virus, ransomware y amenazas digitales.",
    fullDescription:
      "Solución de seguridad para proteger computadoras y archivos frente a malware, ransomware, sitios fraudulentos y otras amenazas digitales en tiempo real.",
    categoryId: "security",
    licenseType: "subscription",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Pantalla tecnológica representando seguridad y protección digital",
    features: [
      "Protección en tiempo real",
      "Bloqueo de ransomware",
      "Navegación segura",
      "Análisis automático de archivos",
    ],
    requirements: [
      "Windows 10 o Windows 11",
      "2 GB de memoria RAM",
      "Conexión a internet para actualizaciones",
    ],
    price: 89,
    previousPrice: 129,
    currency: "PEN",
    priceDetail: "1 dispositivo / año",
    badge: "offer",
    discountPercentage: 31,
    rating: 4.8,
    reviewCount: 198,
    featured: true,
  },

  {
    id: "software-003",
    slug: "creative-studio-suite",
    name: "Creative Studio Suite",
    shortDescription:
      "Herramientas profesionales para diseño, fotografía y contenido digital.",
    fullDescription:
      "Paquete creativo para diseñadores, fotógrafos y creadores de contenido. Incluye herramientas de edición de imágenes, composición gráfica y creación de piezas publicitarias.",
    categoryId: "design",
    licenseType: "subscription",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Espacio de trabajo digital utilizado para diseño gráfico",
    features: [
      "Edición profesional de imágenes",
      "Diseño gráfico y publicitario",
      "Recursos creativos incluidos",
      "Almacenamiento en la nube",
    ],
    requirements: [
      "Windows 10, Windows 11 o macOS",
      "8 GB de memoria RAM",
      "Pantalla con resolución mínima de 1280 × 800",
    ],
    price: 239,
    currency: "PEN",
    priceDetail: "Por usuario / mes",
    badge: "new",
    rating: 4.7,
    reviewCount: 152,
    featured: true,
  },

  {
    id: "software-004",
    slug: "windows-professional-11",
    name: "Windows Professional 11",
    shortDescription:
      "Sistema operativo moderno, seguro y optimizado para empresas.",
    fullDescription:
      "Sistema operativo profesional con funciones avanzadas de productividad, administración, seguridad y compatibilidad para equipos personales y empresariales.",
    categoryId: "productivity",
    licenseType: "permanent",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Computadora moderna utilizada para productividad profesional",
    features: [
      "Licencia digital permanente",
      "Seguridad avanzada",
      "Escritorios virtuales",
      "Compatibilidad empresarial",
    ],
    requirements: [
      "Procesador de 64 bits",
      "4 GB de memoria RAM",
      "64 GB de almacenamiento",
      "TPM 2.0",
    ],
    price: 599,
    currency: "PEN",
    priceDetail: "Licencia permanente",
    badge: "perpetual-license",
    rating: 4.8,
    reviewCount: 286,
    featured: false,
  },

  {
    id: "software-005",
    slug: "office-home-business",
    name: "Office Home & Business",
    shortDescription:
      "Aplicaciones esenciales para documentos, cálculos y presentaciones.",
    fullDescription:
      "Solución de oficina para hogares, profesionales independientes y pequeños negocios que necesitan herramientas confiables para trabajar diariamente.",
    categoryId: "productivity",
    licenseType: "permanent",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Persona trabajando con programas de oficina en una computadora",
    features: [
      "Procesador de textos",
      "Hojas de cálculo",
      "Presentaciones profesionales",
      "Gestión de correo electrónico",
    ],
    requirements: [
      "Windows 10 o Windows 11",
      "4 GB de memoria RAM",
      "4 GB de espacio disponible",
    ],
    price: 699,
    currency: "PEN",
    priceDetail: "Licencia permanente",
    badge: "perpetual-license",
    rating: 4.7,
    reviewCount: 216,
    featured: false,
  },

  {
    id: "software-006",
    slug: "cloud-backup-pro",
    name: "Cloud Backup Pro",
    shortDescription:
      "Respaldo automático y recuperación rápida de archivos importantes.",
    fullDescription:
      "Servicio de respaldo en la nube que protege documentos, imágenes, proyectos y archivos empresariales mediante copias automáticas y recuperación segura.",
    categoryId: "security",
    licenseType: "subscription",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Infraestructura tecnológica utilizada para almacenamiento en la nube",
    features: [
      "Respaldo automático",
      "Almacenamiento cifrado",
      "Recuperación de archivos",
      "Protección para varios dispositivos",
    ],
    requirements: [
      "Windows, macOS, Android o iOS",
      "Conexión a internet",
      "Cuenta de usuario activa",
    ],
    price: 129,
    previousPrice: 159,
    currency: "PEN",
    priceDetail: "Hasta 5 dispositivos / año",
    badge: "offer",
    discountPercentage: 19,
    rating: 4.6,
    reviewCount: 118,
    featured: false,
  },

  {
    id: "software-007",
    slug: "design-studio-pro",
    name: "Design Studio Pro",
    shortDescription:
      "Software completo para ilustración, edición y diseño vectorial.",
    fullDescription:
      "Herramienta profesional para crear logotipos, piezas publicitarias, ilustraciones, material para redes sociales y diseños impresos.",
    categoryId: "design",
    licenseType: "permanent",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Diseñador trabajando en una interfaz de diseño gráfico",
    features: [
      "Diseño vectorial",
      "Edición de fotografías",
      "Herramientas de ilustración",
      "Exportación en múltiples formatos",
    ],
    requirements: [
      "Windows 10 o Windows 11",
      "8 GB de memoria RAM",
      "5 GB de espacio disponible",
    ],
    price: 1199,
    currency: "PEN",
    priceDetail: "Licencia permanente",
    badge: "perpetual-license",
    rating: 4.7,
    reviewCount: 97,
    featured: false,
  },

  {
    id: "software-008",
    slug: "business-manager-plus",
    name: "Business Manager Plus",
    shortDescription:
      "Gestión integrada de ventas, clientes, inventario y reportes.",
    fullDescription:
      "Sistema de gestión para pequeños y medianos negocios que permite administrar clientes, ventas, inventario, reportes y actividades desde una sola plataforma.",
    categoryId: "management",
    licenseType: "business",
    availability: "on-request",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Panel empresarial con gráficos y estadísticas de gestión",
    features: [
      "Gestión de clientes",
      "Control de inventario",
      "Reportes de ventas",
      "Panel de indicadores",
    ],
    requirements: [
      "Navegador web actualizado",
      "Conexión estable a internet",
      "Configuración inicial por parte de FIXORA",
    ],
    price: 899,
    currency: "PEN",
    priceDetail: "Plan empresarial / año",
    badge: "new",
    rating: 4.8,
    reviewCount: 84,
    featured: false,
  },

  {
    id: "software-009",
    slug: "teamwork-project-suite",
    name: "TeamWork Project Suite",
    shortDescription:
      "Organiza proyectos, tareas, equipos y fechas de entrega.",
    fullDescription:
      "Plataforma colaborativa para planificar proyectos, asignar responsabilidades, supervisar tareas y mejorar la comunicación de los equipos de trabajo.",
    categoryId: "management",
    licenseType: "subscription",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Equipo profesional colaborando en la gestión de un proyecto",
    features: [
      "Gestión de tareas",
      "Calendario de proyectos",
      "Chat para equipos",
      "Reportes de productividad",
    ],
    requirements: [
      "Navegador web actualizado",
      "Conexión a internet",
      "Correo electrónico activo",
    ],
    price: 199,
    currency: "PEN",
    priceDetail: "Hasta 20 usuarios / año",
    badge: "best-seller",
    rating: 4.9,
    reviewCount: 247,
    featured: false,
  },

  {
    id: "software-010",
    slug: "academy-learning-platform",
    name: "Academy Learning Platform",
    shortDescription:
      "Plataforma educativa para cursos, materiales y evaluaciones.",
    fullDescription:
      "Sistema educativo que permite organizar clases virtuales, compartir materiales, evaluar estudiantes y supervisar el progreso académico.",
    categoryId: "education",
    licenseType: "academic",
    availability: "on-request",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Estudiantes utilizando herramientas tecnológicas educativas",
    features: [
      "Gestión de cursos",
      "Evaluaciones virtuales",
      "Materiales descargables",
      "Seguimiento de estudiantes",
    ],
    requirements: [
      "Navegador web actualizado",
      "Conexión a internet",
      "Configuración institucional",
    ],
    price: 749,
    currency: "PEN",
    priceDetail: "Plan académico / año",
    badge: "new",
    rating: 4.6,
    reviewCount: 73,
    featured: false,
  },

  {
    id: "software-011",
    slug: "code-studio-professional",
    name: "Code Studio Professional",
    shortDescription:
      "Entorno completo para programación y desarrollo de aplicaciones.",
    fullDescription:
      "Herramienta para desarrolladores con editor avanzado, depuración, integración con repositorios y funciones para crear aplicaciones profesionales.",
    categoryId: "development",
    licenseType: "permanent",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Pantalla mostrando código fuente de una aplicación",
    features: [
      "Editor de código avanzado",
      "Depuración integrada",
      "Control de versiones",
      "Extensiones para desarrollo",
    ],
    requirements: [
      "Windows 10, Windows 11 o macOS",
      "8 GB de memoria RAM",
      "20 GB de espacio disponible",
    ],
    price: 1099,
    currency: "PEN",
    priceDetail: "Licencia permanente",
    badge: "perpetual-license",
    rating: 4.8,
    reviewCount: 164,
    featured: false,
  },

  {
    id: "software-012",
    slug: "web-development-toolkit",
    name: "Web Development Toolkit",
    shortDescription:
      "Herramientas para crear, probar y publicar proyectos web.",
    fullDescription:
      "Paquete orientado a desarrolladores web que incluye herramientas de diseño, edición de código, pruebas, optimización y publicación de sitios modernos.",
    categoryId: "development",
    licenseType: "subscription",
    availability: "in-stock",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=85",
    imageAlt:
      "Desarrollador trabajando en la programación de un sitio web",
    features: [
      "Editor para desarrollo web",
      "Herramientas de pruebas",
      "Optimización de proyectos",
      "Soporte para tecnologías modernas",
    ],
    requirements: [
      "Windows, macOS o Linux",
      "8 GB de memoria RAM",
      "Conexión a internet",
    ],
    price: 259,
    previousPrice: 349,
    currency: "PEN",
    priceDetail: "Por usuario / año",
    badge: "offer",
    discountPercentage: 26,
    rating: 4.7,
    reviewCount: 139,
    featured: false,
  },
];

/* =========================================================
   PRODUCTOS DESTACADOS
   ========================================================= */

export const featuredSoftwareProducts: SoftwareProduct[] =
  softwareProducts.filter((product) => product.featured);

/* =========================================================
   FUNCIONES AUXILIARES
   ========================================================= */

export function getSoftwareProductById(
  productId: string,
): SoftwareProduct | undefined {
  return softwareProducts.find(
    (product) => product.id === productId,
  );
}

export function getSoftwareProductBySlug(
  productSlug: string,
): SoftwareProduct | undefined {
  return softwareProducts.find(
    (product) => product.slug === productSlug,
  );
}
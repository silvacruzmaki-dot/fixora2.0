import type {
  SoftwareSortItem,
  SoftwareStoreSettings,
} from "@/types/software";

/* =========================================================
   CONFIGURACIÓN GENERAL DE LA TIENDA DE SOFTWARE
   ========================================================= */

export const softwareStoreSettings: SoftwareStoreSettings = {
  /*
   * Número de WhatsApp en formato internacional.
   * No debe contener el símbolo +, espacios ni guiones.
   *
   * Ejemplo Perú:
   * 51987654321
   */
  whatsappNumber: "51987654321",

  quotationMessage:
    "Hola, deseo solicitar una cotización de los productos de software disponibles en FIXORA.",

  customSoftwareMessage:
    "Hola, deseo recibir asesoría para desarrollar un software a medida para mi empresa o proyecto.",

  /*
   * Cantidad inicial de productos mostrados en el catálogo.
   */
  initialVisibleProducts: 6,

  /*
   * Cantidad de productos adicionales al presionar
   * el botón «Ver más productos».
   */
  productsPerLoad: 3,
};

/* =========================================================
   OPCIONES DE ORDENAMIENTO
   ========================================================= */

export const softwareSortOptions: SoftwareSortItem[] = [
  {
    value: "recommended",
    label: "Más relevantes",
  },
  {
    value: "price-ascending",
    label: "Precio: menor a mayor",
  },
  {
    value: "price-descending",
    label: "Precio: mayor a menor",
  },
  {
    value: "name-ascending",
    label: "Nombre: A-Z",
  },
];

/* =========================================================
   LÍMITES GENERALES DE PRECIO
   ========================================================= */

export const softwarePriceLimits = {
  minimumPrice: 0,
  maximumPrice: 2000,
} as const;
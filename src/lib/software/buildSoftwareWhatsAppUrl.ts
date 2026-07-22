import { softwareStoreSettings } from "@/data/software";

import type { SoftwareProduct } from "@/types/software";

/* =========================================================
   CONSTANTES
   ========================================================= */

const WHATSAPP_BASE_URL = "https://wa.me";

/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

function formatSoftwarePrice(price: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(price);
}

/* =========================================================
   LIMPIAR NÚMERO DE WHATSAPP
   ========================================================= */

function sanitizeWhatsAppNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, "");
}

/* =========================================================
   CONSTRUIR ENLACE GENERAL
   ========================================================= */

export function buildWhatsAppUrl(message: string): string {
  const phoneNumber = sanitizeWhatsAppNumber(
    softwareStoreSettings.whatsappNumber,
  );

  const encodedMessage = encodeURIComponent(message.trim());

  return `${WHATSAPP_BASE_URL}/${phoneNumber}?text=${encodedMessage}`;
}

/* =========================================================
   ENLACE PARA COMPRAR UN PRODUCTO
   ========================================================= */

export function buildSoftwarePurchaseWhatsAppUrl(
  product: SoftwareProduct,
): string {
  const formattedPrice = formatSoftwarePrice(product.price);

  const message = [
    "Hola, deseo comprar el siguiente producto de FIXORA:",
    "",
    `Producto: ${product.name}`,
    `Precio: ${formattedPrice}`,
    `Licencia: ${product.priceDetail}`,
    `Código: ${product.id}`,
    "",
    "Por favor, deseo recibir información sobre el proceso de compra y activación.",
  ].join("\n");

  return buildWhatsAppUrl(message);
}

/* =========================================================
   ENLACE PARA COTIZAR UN PRODUCTO
   ========================================================= */

export function buildSoftwareProductQuotationWhatsAppUrl(
  product: SoftwareProduct,
): string {
  const formattedPrice = formatSoftwarePrice(product.price);

  const message = [
    "Hola, deseo solicitar una cotización del siguiente software:",
    "",
    `Producto: ${product.name}`,
    `Precio referencial: ${formattedPrice}`,
    `Tipo de licencia: ${product.priceDetail}`,
    `Código: ${product.id}`,
    "",
    "Agradecería recibir información sobre disponibilidad, condiciones y formas de pago.",
  ].join("\n");

  return buildWhatsAppUrl(message);
}

/* =========================================================
   ENLACE PARA COTIZACIÓN GENERAL
   ========================================================= */

export function buildGeneralSoftwareQuotationWhatsAppUrl(): string {
  return buildWhatsAppUrl(
    softwareStoreSettings.quotationMessage,
  );
}

/* =========================================================
   ENLACE PARA SOFTWARE A MEDIDA
   ========================================================= */

export function buildCustomSoftwareWhatsAppUrl(): string {
  return buildWhatsAppUrl(
    softwareStoreSettings.customSoftwareMessage,
  );
}
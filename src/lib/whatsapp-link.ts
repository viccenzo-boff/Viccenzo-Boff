import type { ContactInfo } from "@/types/cv.types";

export type WhatsAppLinkSource = Pick<ContactInfo, "phone" | "whatsappMessage">;

const BRAZIL_COUNTRY_CODE = "55";

/**
 * Monta o link oficial *click to chat* do WhatsApp (`wa.me`), sem API/chave.
 *
 * Contrato: `phone` deve conter apenas DDD + número, **sem** o DDI — ex.: `"49 99142-9722"`.
 * Toda formatação (parênteses, hífen, espaço, `+`) é removida e o DDI `55` é prefixado.
 * ⚠️ Se `phone` já incluir o `55`, o código é duplicado. Coberto por `whatsapp-link.test.ts`.
 */
export function buildWhatsAppChatUrl({ phone, whatsappMessage }: WhatsAppLinkSource): string {
  const phoneDigits = `${BRAZIL_COUNTRY_CODE}${phone.replace(/\D/g, "")}`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMessage)}`;
}

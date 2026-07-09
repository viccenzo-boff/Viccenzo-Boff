import type { ContactInfo } from "@/types/cv.types";

export type WhatsAppLinkSource = Pick<ContactInfo, "phone" | "whatsappMessage">;

const BRAZIL_COUNTRY_CODE = "55";

export function buildWhatsAppChatUrl({ phone, whatsappMessage }: WhatsAppLinkSource): string {
  const phoneDigits = `${BRAZIL_COUNTRY_CODE}${phone.replace(/\D/g, "")}`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMessage)}`;
}

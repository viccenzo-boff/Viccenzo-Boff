import { describe, it, expect } from "vitest";

import { buildWhatsAppChatUrl, type WhatsAppLinkSource } from "./whatsapp-link";

const source: WhatsAppLinkSource = {
  phone: "49 99142-9722",
  whatsappMessage: "Olá! Vi seu currículo.",
};

describe("buildWhatsAppChatUrl", () => {
  it("normaliza o telefone para dígitos e prefixa o DDI 55", () => {
    expect(buildWhatsAppChatUrl(source)).toBe(
      `https://wa.me/5549991429722?text=${encodeURIComponent(
        source.whatsappMessage
      )}`
    );
  });

  it("remove qualquer formatação (parênteses, hífen, espaço)", () => {
    const url = buildWhatsAppChatUrl({ ...source, phone: "(49) 99142-9722" });
    expect(url).toContain("wa.me/5549991429722?");
  });

  it("codifica a mensagem no parâmetro text (sem espaços crus)", () => {
    const url = buildWhatsAppChatUrl(source);
    expect(url).toContain(`?text=${encodeURIComponent(source.whatsappMessage)}`);
    expect(url).not.toContain(" ");
  });
});

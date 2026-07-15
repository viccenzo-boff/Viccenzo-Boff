import { describe, it, expect } from "vitest";

import {
  buildGmailComposeUrl,
  buildOutlookComposeUrl,
  buildMailtoUrl,
  type EmailLinkSource,
} from "./email-links";

const source: EmailLinkSource = {
  email: "viccenzoboff@gmail.com",
  // Assunto com espaços, "&" e traço acentuado força a checagem de encoding.
  emailSubject: "Oportunidade & Contato – Currículo",
};

describe("email-links", () => {
  describe("buildGmailComposeUrl", () => {
    it("aponta para o compose do Gmail com to/su codificados", () => {
      expect(buildGmailComposeUrl(source)).toBe(
        "https://mail.google.com/mail/?view=cm&fs=1&to=" +
          encodeURIComponent(source.email) +
          "&su=" +
          encodeURIComponent(source.emailSubject)
      );
    });

    it("codifica o assunto (usa su=, sem espaços crus)", () => {
      const url = buildGmailComposeUrl(source);
      expect(url).toContain(`&su=${encodeURIComponent(source.emailSubject)}`);
      expect(url).not.toContain(" ");
    });
  });

  describe("buildOutlookComposeUrl", () => {
    it("usa o parâmetro subject= (não su=) no deeplink do Outlook", () => {
      expect(buildOutlookComposeUrl(source)).toBe(
        "https://outlook.live.com/mail/0/deeplink/compose?to=" +
          encodeURIComponent(source.email) +
          "&subject=" +
          encodeURIComponent(source.emailSubject)
      );
    });
  });

  describe("buildMailtoUrl", () => {
    it("mantém o e-mail cru e codifica apenas o assunto", () => {
      expect(buildMailtoUrl(source)).toBe(
        `mailto:${source.email}?subject=${encodeURIComponent(source.emailSubject)}`
      );
      // O destinatário não é percent-encoded no esquema mailto:
      expect(buildMailtoUrl(source)).toContain(
        "mailto:viccenzoboff@gmail.com?subject="
      );
    });
  });
});

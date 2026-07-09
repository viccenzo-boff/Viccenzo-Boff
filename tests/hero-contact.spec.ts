import { test, expect } from "@playwright/test";

import { cvData } from "@/data/cv";
import {
  buildGmailComposeUrl,
  buildMailtoUrl,
  buildOutlookComposeUrl,
} from "@/lib/email-links";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp-link";

const { contact } = cvData;
const encodedSubject = encodeURIComponent(contact.emailSubject);

test.describe("Menu de contato por e-mail do Hero", () => {
  test("botão de e-mail abre o menu com as 4 opções de contato", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: contact.email }).click();

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem")).toHaveCount(4);
    await expect(menu.getByRole("menuitem", { name: "Abrir no Gmail" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Abrir no Outlook Web" })).toBeVisible();
    await expect(
      menu.getByRole("menuitem", { name: "Abrir no app de e-mail padrão" })
    ).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Copiar endereço" })).toBeVisible();
  });

  test("itens de webmail e mailto preservam destinatário e assunto automático", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: contact.email }).click();
    const menu = page.getByRole("menu");

    const gmailItem = menu.getByRole("menuitem", { name: "Abrir no Gmail" });
    await expect(gmailItem).toHaveAttribute("href", buildGmailComposeUrl(contact));
    await expect(gmailItem).toHaveAttribute("target", "_blank");
    await expect(gmailItem).toHaveAttribute("rel", "noopener noreferrer");
    expect(buildGmailComposeUrl(contact)).toContain(`su=${encodedSubject}`);

    const outlookItem = menu.getByRole("menuitem", { name: "Abrir no Outlook Web" });
    await expect(outlookItem).toHaveAttribute("href", buildOutlookComposeUrl(contact));
    await expect(outlookItem).toHaveAttribute("target", "_blank");
    await expect(outlookItem).toHaveAttribute("rel", "noopener noreferrer");
    expect(buildOutlookComposeUrl(contact)).toContain(`subject=${encodedSubject}`);

    const mailtoItem = menu.getByRole("menuitem", { name: "Abrir no app de e-mail padrão" });
    await expect(mailtoItem).toHaveAttribute("href", buildMailtoUrl(contact));
    expect(buildMailtoUrl(contact)).toBe(`mailto:${contact.email}?subject=${encodedSubject}`);
  });

  test("Copiar endereço copia o e-mail e anuncia a confirmação", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    await page.getByRole("button", { name: contact.email }).click();
    await page.getByRole("menuitem", { name: "Copiar endereço" }).click();

    // O menu permanece aberto e o item exibe a confirmação temporária.
    await expect(page.getByRole("menuitem", { name: "Endereço copiado" })).toBeVisible();
    await expect(page.getByTestId("email-copy-feedback")).toContainText(
      "Endereço de e-mail copiado"
    );

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(contact.email);
  });
});

test.describe("Botão de WhatsApp do Hero", () => {
  test("abre conversa no WhatsApp em nova aba com número e mensagem pré-preenchida", async ({
    page,
  }) => {
    await page.goto("/");

    const whatsappLink = page.getByRole("link", { name: "Conversar no WhatsApp" });
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toHaveAttribute("href", buildWhatsAppChatUrl(contact));
    await expect(whatsappLink).toHaveAttribute("target", "_blank");
    await expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(buildWhatsAppChatUrl(contact)).toBe(
      `https://wa.me/5549991429722?text=${encodeURIComponent(contact.whatsappMessage)}`
    );
  });
});

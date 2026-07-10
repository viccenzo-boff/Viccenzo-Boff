import { test, expect } from "@playwright/test";

import { CV_PDF_PATH } from "../src/lib/cv-pdf";

test.describe("Download do currículo em PDF", () => {
  test("exibe o botão no Hero com link estático de download", async ({ page }) => {
    await page.goto("/");

    const heroButton = page.getByRole("link", { name: "Baixar CV (PDF)" });
    await expect(heroButton).toBeVisible();
    await expect(heroButton).toHaveAttribute("href", CV_PDF_PATH);
    await expect(heroButton).toHaveAttribute("download", "");
  });

  test("exibe o botão compacto no SiteHeader com aria-label descritivo", async ({ page }) => {
    await page.goto("/");

    const headerButton = page.getByTestId("cv-download-header");
    await expect(headerButton).toBeVisible();
    await expect(headerButton).toHaveAttribute("aria-label", "Baixar currículo em PDF");
    await expect(headerButton).toHaveAttribute("href", CV_PDF_PATH);
    await expect(headerButton).toHaveAttribute("download", "");
  });

  test("o asset PDF é servido com 200 e content-type application/pdf", async ({ request }) => {
    const response = await request.get(CV_PDF_PATH);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");

    const body = await response.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");
  });
});

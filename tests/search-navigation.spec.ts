import { test, expect } from "@playwright/test";

test.describe("Busca e navegação ancorada", () => {
  test("abre com o botão, filtra por termo e navega até a seção correta", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Pesquisar no currículo" });
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const input = page.getByPlaceholder("Buscar por seção, empresa, competência…");
    await expect(input).toBeFocused();
    await input.fill("IXC Soft");

    const result = page.getByText("Suporte Técnico Fiscal/Contábil · IXC Soft");
    await expect(result).toBeVisible();
    await result.click();

    await expect(dialog).toBeHidden();
    await expect(page.locator("#experiencia-profissional")).toBeInViewport();
  });

  test("abre e fecha com o atalho de teclado Ctrl+K / Esc", async ({ page }) => {
    await page.goto("/");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeHidden();

    await page.keyboard.press("Control+K");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("exibe mensagem de vazio para termo sem correspondência", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Pesquisar no currículo" }).click();
    await page
      .getByPlaceholder("Buscar por seção, empresa, competência…")
      .fill("termo-inexistente-xyz");

    await expect(page.getByText("Nenhum resultado encontrado.")).toBeVisible();
  });
});

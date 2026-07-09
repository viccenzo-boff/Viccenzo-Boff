import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
  test("carrega em light por padrão, sem erros de console", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    expect(consoleErrors).toEqual([]);
  });

  test("alterna para dark, persiste após reload e volta para light", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTestId("mode-toggle");

    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("dark");

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("light");
  });

  test("não exibe FOUC: html já reflete o tema persistido antes do primeiro paint", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });

    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

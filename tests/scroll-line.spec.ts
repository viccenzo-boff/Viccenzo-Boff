import { expect, test } from "@playwright/test";

test.describe("Scroll Progress Line", () => {
  test("overlay decorativo não bloqueia interações e é desenhado conforme o scroll", async ({
    page,
  }) => {
    await page.goto("/");

    const container = page.getByTestId("scroll-progress-line");
    await expect(container).toHaveAttribute("aria-hidden", "true");
    await expect(container).toHaveCSS("pointer-events", "none");
    await expect(container).toHaveCSS("position", "absolute");

    const path = page.getByTestId("scroll-progress-path");
    const drawnRatio = async (): Promise<number> => {
      const dashArray = await path.evaluate((el) => el.getAttribute("stroke-dasharray") ?? "");
      const drawn = Number.parseFloat(dashArray);
      return Number.isNaN(drawn) ? 0 : drawn;
    };

    // No topo da página a linha ainda não foi desenhada
    expect(await drawnRatio()).toBeLessThan(0.2);

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    // A ponta segue o scroll com mola criticamente amortecida e teto de
    // velocidade de desenho (3000–6000px/s conforme o ponteiro): basta ver
    // o draw progredir bem além do estado inicial, sem esperar convergir.
    test.setTimeout(120_000);
    await expect.poll(drawnRatio, { timeout: 60_000 }).toBeGreaterThan(0.5);
  });
});

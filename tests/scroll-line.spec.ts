import { expect, test } from "@playwright/test";

test.describe("Scroll Progress Line", () => {
  test("overlay decorativo não bloqueia interações e o draw é função 1:1 do scroll", async ({
    page,
  }) => {
    await page.goto("/");

    const container = page.getByTestId("scroll-progress-line");
    await expect(container).toHaveAttribute("aria-hidden", "true");
    await expect(container).toHaveCSS("pointer-events", "none");
    await expect(container).toHaveCSS("position", "absolute");

    const path = page.getByTestId("scroll-progress-path");
    // Lê a fração desenhada após dois rAF — garante que o evento de scroll
    // já foi aplicado ao stroke-dasharray (o vínculo 1:1 não tem física nem
    // convergência: dois frames bastam em qualquer máquina).
    const drawnRatio = (): Promise<number> =>
      path.evaluate(
        (el) =>
          new Promise<number>((resolve) => {
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                const drawn = Number.parseFloat(el.getAttribute("stroke-dasharray") ?? "");
                resolve(Number.isNaN(drawn) ? 0 : drawn);
              }),
            );
          }),
      );
    // behavior "instant" fura o scroll-behavior: smooth do html — o teste
    // mede posições exatas, não a animação de rolagem
    const scrollTo = (top: number): Promise<void> =>
      page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);

    // No topo da página a linha ainda não foi desenhada
    expect(await drawnRatio()).toBeLessThan(0.2);

    const maxScroll = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    const midScroll = Math.round(maxScroll / 2);

    // Monotonia: a fração cresce com o scroll…
    await scrollTo(midScroll);
    const drawnAtMid = await drawnRatio();
    expect(drawnAtMid).toBeGreaterThan(0.05);

    // …e no fim da página o draw está bem avançado
    await scrollTo(maxScroll);
    const drawnAtBottom = await drawnRatio();
    expect(drawnAtBottom).toBeGreaterThan(drawnAtMid);
    expect(drawnAtBottom).toBeGreaterThan(0.5);

    // Determinismo do vínculo 1:1: voltar à mesma posição de scroll
    // reproduz exatamente a mesma fração (função pura do scroll — sem
    // física, histórico ou inércia)
    await scrollTo(midScroll);
    expect(await drawnRatio()).toBeCloseTo(drawnAtMid, 5);
  });
});

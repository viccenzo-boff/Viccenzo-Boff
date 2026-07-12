import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium, devices, type Page } from "@playwright/test";

/**
 * Gera os screenshots usados pelo README.md em docs/screenshots/.
 * Requer o site rodando (build de produção): `pnpm build && pnpm start`.
 * Uso: `pnpm generate:readme-screenshots` (URL customizável via SCREENSHOT_BASE_URL).
 */

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const OUTPUT_DIR = path.join(process.cwd(), "docs", "screenshots");

async function openHome(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.addInitScript(
    (value: string) => window.localStorage.setItem("theme", value),
    theme,
  );
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

async function main(): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  // reducedMotion desliga as animações de entrada/aurora do Hero (globals.css):
  // capturas determinísticas, sempre no estado visual final.
  const desktop = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });

  const lightPage = await desktop.newPage();
  await openHome(lightPage, "light");
  await lightPage.screenshot({ path: path.join(OUTPUT_DIR, "home-light.png") });

  await lightPage
    .locator("#painel-de-impacto")
    .screenshot({ path: path.join(OUTPUT_DIR, "impact-panel-light.png") });

  await lightPage.keyboard.press("ControlOrMeta+k");
  const searchInput = lightPage.getByPlaceholder(/^Buscar/);
  await searchInput.waitFor({ state: "visible" });
  await searchInput.fill("birthday");
  await lightPage.waitForTimeout(300);
  await lightPage.screenshot({ path: path.join(OUTPUT_DIR, "search-command.png") });
  await lightPage.close();

  const darkPage = await desktop.newPage();
  await openHome(darkPage, "dark");
  await darkPage.screenshot({ path: path.join(OUTPUT_DIR, "home-dark.png") });
  await darkPage.close();
  await desktop.close();

  const mobile = await browser.newContext({
    ...devices["Pixel 7"],
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const mobilePage = await mobile.newPage();
  await openHome(mobilePage, "light");
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, "mobile-light.png") });
  await mobilePage.close();
  await mobile.close();

  await browser.close();
  console.log(`Screenshots gravados em ${OUTPUT_DIR}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

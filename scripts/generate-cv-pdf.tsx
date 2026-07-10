import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

import { CV_PDF_FILENAME } from "@/lib/cv-pdf";

import {
  CV_PDF_MANIFEST_PATH,
  hashCvPrintHtml,
  renderCvPrintHtml,
} from "./cv-print-html";

// Gera public/curriculo-viccenzo-boff.pdf a partir de cvData e grava o hash do
// HTML de impressão em scripts/cv-pdf.manifest.json. PDF e manifesto são
// versionados no git; a guarda verify-cv-pdf (encadeada no `pnpm build`) usa o
// manifesto para impedir build/deploy com PDF dessincronizado. Requer o
// Chromium do Playwright instalado localmente (`playwright install chromium`)
// — a Vercel não executa este script (a imagem de build não suporta Chromium).

async function generateCvPdf(): Promise<void> {
  const html = renderCvPrintHtml();
  const outputPath = path.join(process.cwd(), "public", CV_PDF_FILENAME);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "16mm", bottom: "14mm", left: "16mm" },
    });
  } finally {
    await browser.close();
  }

  const manifestJson = JSON.stringify({ htmlSha256: hashCvPrintHtml(html) }, null, 2);
  await writeFile(CV_PDF_MANIFEST_PATH, `${manifestJson}\n`, "utf8");

  console.log(`PDF do currículo gerado em ${outputPath}`);
  console.log(`Manifesto de sincronização atualizado em ${CV_PDF_MANIFEST_PATH}`);
}

generateCvPdf().catch((error: unknown) => {
  console.error("Falha ao gerar o PDF do currículo:", error);
  process.exitCode = 1;
});

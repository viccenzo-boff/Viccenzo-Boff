import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";
import { renderToStaticMarkup } from "react-dom/server";

import { CVPrintDocument } from "@/components/print/cv-print-document";
import { CV_PDF_FILENAME } from "@/lib/cv-pdf";

// Gera public/curriculo-viccenzo-boff.pdf a partir de cvData, antes do
// `next build` (assets adicionados a public/ depois do build não entram no
// output da Vercel). Requer o Chromium do Playwright instalado no ambiente.

async function generateCvPdf(): Promise<void> {
  const html = `<!DOCTYPE html>${renderToStaticMarkup(<CVPrintDocument />)}`;
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

  console.log(`PDF do currículo gerado em ${outputPath}`);
}

generateCvPdf().catch((error: unknown) => {
  console.error("Falha ao gerar o PDF do currículo:", error);
  process.exitCode = 1;
});

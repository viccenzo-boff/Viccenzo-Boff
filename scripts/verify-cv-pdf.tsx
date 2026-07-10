import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { CV_PDF_FILENAME } from "@/lib/cv-pdf";

import {
  CV_PDF_MANIFEST_PATH,
  hashCvPrintHtml,
  isCvPdfManifest,
  renderCvPrintHtml,
} from "./cv-print-html";

// Guarda de sincronização do PDF do currículo, encadeada no `pnpm build`.
// Compara o hash SHA-256 do HTML de impressão atual (função pura de cvData +
// template) com o gravado no manifesto pela última geração. Não usa Chromium,
// então roda também no build da Vercel — é o que torna impossível deployar
// com PDF desatualizado em relação a cvData/template.

const REGENERATE_HINT =
  "Rode `pnpm generate:cv-pdf` e inclua public/" +
  `${CV_PDF_FILENAME} e scripts/cv-pdf.manifest.json no commit.`;

async function verifyCvPdf(): Promise<void> {
  const pdfPath = path.join(process.cwd(), "public", CV_PDF_FILENAME);

  const pdfStats = await stat(pdfPath).catch(() => null);
  if (pdfStats === null || pdfStats.size === 0) {
    throw new Error(
      `PDF do currículo ausente ou vazio em ${pdfPath}. ${REGENERATE_HINT}`,
    );
  }

  const manifestRaw = await readFile(CV_PDF_MANIFEST_PATH, "utf8").catch(() => null);
  if (manifestRaw === null) {
    throw new Error(
      `Manifesto de sincronização ausente em ${CV_PDF_MANIFEST_PATH}. ${REGENERATE_HINT}`,
    );
  }

  // BOM tolerado: editores no Windows podem reintroduzi-lo ao salvar o JSON.
  const bom = String.fromCharCode(0xfeff);
  const manifestJson = manifestRaw.startsWith(bom)
    ? manifestRaw.slice(bom.length)
    : manifestRaw;

  let manifest: unknown;
  try {
    manifest = JSON.parse(manifestJson);
  } catch {
    manifest = null;
  }
  if (!isCvPdfManifest(manifest)) {
    throw new Error(
      `Manifesto inválido em ${CV_PDF_MANIFEST_PATH} (esperado { htmlSha256: string }). ${REGENERATE_HINT}`,
    );
  }

  const currentHash = hashCvPrintHtml(renderCvPrintHtml());
  if (currentHash !== manifest.htmlSha256) {
    throw new Error(
      "PDF do currículo desatualizado: cvData ou o template de impressão " +
        `mudaram desde a última geração. ${REGENERATE_HINT}`,
    );
  }

  console.log("PDF do currículo sincronizado com cvData/template (hash confere).");
}

verifyCvPdf().catch((error: unknown) => {
  console.error("Falha na verificação do PDF do currículo:", error);
  process.exitCode = 1;
});

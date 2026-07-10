import { createHash } from "node:crypto";
import path from "node:path";

import { renderToStaticMarkup } from "react-dom/server";

import { CVPrintDocument } from "@/components/print/cv-print-document";

// Fonte única do HTML de impressão do currículo e do seu fingerprint.
// O PDF é função determinística deste HTML (que deriva de cvData + template),
// mas o binário do PDF não é (varia com a versão do Chromium) — por isso a
// sincronização PDF ↔ conteúdo é verificada pelo hash do HTML, gravado em
// cv-pdf.manifest.json no momento da geração. renderToStaticMarkup é puro
// Node/React, então a verificação roda em qualquer ambiente sem Chromium.

export const CV_PDF_MANIFEST_PATH = path.join(
  process.cwd(),
  "scripts",
  "cv-pdf.manifest.json",
);

export interface CvPdfManifest {
  htmlSha256: string;
}

export function isCvPdfManifest(value: unknown): value is CvPdfManifest {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).htmlSha256 === "string"
  );
}

export function renderCvPrintHtml(): string {
  return `<!DOCTYPE html>${renderToStaticMarkup(<CVPrintDocument />)}`;
}

export function hashCvPrintHtml(html: string): string {
  return createHash("sha256").update(html, "utf8").digest("hex");
}

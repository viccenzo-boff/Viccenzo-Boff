import { ChevronUp } from "lucide-react";

import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

// Stagger do reveal por linha (primitiva .section-reveal em globals.css). Vai no
// <li> — deep na árvore, nunca no h2 nem no <ul> irmão direto dele (âncoras da
// geometria da linha, §5.5). O hover-lift transform mora no .monitoria-row
// interno: elemento distinto do que recebe o transform do reveal (fill both),
// sem disputa de propriedade.
const ROW_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
  "section-reveal-5",
] as const;

export function AcademicMonitoring() {
  const { monitorias } = cvData;

  return (
    <section id="monitorias-academicas" className="scroll-mt-20 bg-background">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Monitorias Acadêmicas
        </h2>

        {/* Índice estilo sumário de livro: numeração fantasma + dot leaders. */}
        <ul className="mt-12 flex max-w-3xl flex-col gap-1">
          {monitorias.map((monitoria, index) => (
            <li key={monitoria.title} className={cn("section-reveal", ROW_STAGGER[index] ?? "")}>
              <div className="monitoria-row flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg bg-background px-3 py-3">
                <span className="monitoria-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="monitoria-title text-sm font-medium text-foreground">
                  {monitoria.title}
                </span>
                <span className="monitoria-leader" aria-hidden="true" />
                <span className="monitoria-period text-xs font-medium tabular-nums text-muted-foreground">
                  {monitoria.period}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Coda: cue de fechamento espelhando o scroll cue do Hero (simetria
            abertura/fechamento) — chevron para cima, âncora #inicio. */}
        <div className="mt-16 flex justify-center">
          <a
            href="#inicio"
            aria-label="Voltar ao início"
            className="flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <ChevronUp className="coda-cue-icon size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

import { ChevronUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cvData } from "@/data/cv";
import type { LanguageLevel } from "@/types/cv.types";
import { cn } from "@/lib/utils";

// Macro-seção "Formação e Desenvolvimento": funde as antigas seções acadêmicas
// (Formação Acadêmica e Idiomas + Monitorias Acadêmicas) numa única seção
// titulada, com um h2 só (âncora de portão da Scroll Progress Line, §5.5) e três
// blocos empilhados, cada um com seu subtítulo discreto. Os grids e cards de cada
// bloco são migrados VERBATIM dos componentes originais — classes Tailwind,
// reveals por view() e estrutura interna dos cards intactos; muda apenas o
// invólucro (seção/grid). Os `id` históricos (formacao-academica /
// monitorias-academicas) migram para os wrappers dos blocos, preservando os
// deep-links da busca (§6). Espelha a topologia de skills-and.tsx (macro-seção).

// Nível de idioma → nº de segmentos acesos no medidor. Record sobre o union
// LanguageLevel: o TypeScript exige uma entrada para cada nível (exaustivo,
// nada inventado) e o total de segmentos é o próprio tamanho da escala — a
// ordem Básico→Nativo já tipada em cv.types.ts.
const LANGUAGE_LEVEL_RANK: Record<LanguageLevel, number> = {
  "Básico": 1,
  "Intermediário": 2,
  "Avançado": 3,
  "Fluente": 4,
  "Nativo": 5,
};

const LANGUAGE_METER_SEGMENTS = Object.keys(LANGUAGE_LEVEL_RANK).length;

// Stagger do reveal por linha das monitorias (primitiva .section-reveal em
// globals.css). Vai no <li> — deep na árvore, nunca no h2 nem no <ul> irmão
// direto dele (âncoras da geometria da linha, §5.5). O hover-lift transform mora
// no .monitoria-row interno: elemento distinto do que recebe o transform do
// reveal (fill both), sem disputa de propriedade.
const ROW_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
  "section-reveal-5",
] as const;

// Subtítulo discreto de cada bloco: eyebrow em caixa alta um passo abaixo do h2
// (text-xs vs text-sm), muted e sem o tick da assinatura — lê como rótulo
// subordinado, não como cabeçalho de seção. É h3, invisível à geometria da linha
// (que só mede h2). Mesma primitiva de skills-and-tools.tsx (macro-seção irmã).
const BLOCK_SUBTITLE_CLASS =
  "text-xs font-semibold tracking-widest text-muted-foreground uppercase";

export function EducationAndDevelopment() {
  const { education, languages, monitorias } = cvData;

  return (
    <section className="scroll-mt-20 bg-background">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading bg-background text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Formação e Desenvolvimento
        </h2>

        <div className="mt-12 flex flex-col gap-16 sm:gap-24">
          {/* Bloco 1 — Base Acadêmica e Idiomas (migrado de academic-background.tsx).
              `id` histórico preservado no wrapper (deep-links da busca, §6). */}
          <div id="formacao-academica" className="scroll-mt-20">
            <h3 className={BLOCK_SUBTITLE_CLASS}>Base Acadêmica e Idiomas</h3>

            <Card size="sm" className="card-hairline signature-hover mt-6 bg-background">
              <CardContent>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="signature-hover-text text-lg font-semibold text-foreground">
                      {education.degree}
                    </h3>
                    <p className="text-sm font-medium text-foreground/80">
                      {education.institution}
                    </p>
                  </div>
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                    <span className="status-dot" aria-hidden="true" />
                    <span>
                      {education.status} · Previsão de conclusão em {education.completionYear}
                    </span>
                  </p>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="signature-hover-text text-sm font-semibold text-foreground">Idiomas</h3>
                  <ul className="mt-4 flex flex-col gap-5 sm:flex-row sm:gap-12">
                    {languages.map((language) => {
                      const filled = LANGUAGE_LEVEL_RANK[language.level];

                      return (
                        <li key={language.name} className="flex flex-col gap-2">
                          <div className="flex items-baseline gap-2 text-sm">
                            <span className="font-medium text-foreground">{language.name}</span>
                            <span className="font-medium text-foreground/70">{language.level}</span>
                          </div>
                          {/* Medidor decorativo (aria-hidden): o nível textual acima já
                              é o rótulo acessível. */}
                          <div className="language-meter" aria-hidden="true">
                            {Array.from({ length: LANGUAGE_METER_SEGMENTS }, (_, index) => (
                              <span
                                key={index}
                                className={cn(
                                  "language-meter-segment",
                                  index < filled && "language-meter-segment-filled",
                                )}
                              />
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bloco 2 — Certificações e Cursos. Ainda não há dados em cvData
              (nenhum campo `certifications`): o bloco fica estruturado, com um
              estado vazio discreto no lugar do grid. Quando os dados existirem,
              adicionar o campo em cv.ts + o grid aqui e o `id` no SECTION_ORDER /
              índice da busca (§6). O texto opaco sobre bg-background já respeita o
              invariante da linha (§5.5). */}
          <div id="certificacoes-e-cursos" className="scroll-mt-20">
            <h3 className={BLOCK_SUBTITLE_CLASS}>Certificações e Cursos</h3>

            <p className="mt-6 text-sm text-muted-foreground">
              Certificações e cursos de especialização serão adicionados em breve.
            </p>
          </div>

          {/* Bloco 3 — Liderança Acadêmica e Mentorias (migrado de
              academic-monitoring.tsx). `id` histórico preservado no wrapper. */}
          <div id="monitorias-academicas" className="scroll-mt-20">
            <h3 className={BLOCK_SUBTITLE_CLASS}>Liderança Acadêmica e Mentorias</h3>

            {/* Índice estilo sumário de livro: numeração fantasma + dot leaders. */}
            <ul className="mt-6 flex max-w-3xl flex-col gap-1">
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
          </div>
        </div>

        {/* Coda: cue de fechamento espelhando o scroll cue do Hero (simetria
            abertura/fechamento) — chevron para cima, âncora #inicio. É a última
            seção da página, então a coda segue sendo o fecho global. */}
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

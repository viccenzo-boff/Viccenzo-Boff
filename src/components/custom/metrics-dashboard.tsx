import type { CSSProperties } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

// Valor da métrica quebrado para o count-up CSS (globals.css): "+600" →
// prefixo "+", alvo 600, sufixo ""; "< 5%" → prefixo "< ", alvo 5, sufixo
// "%". Prefixo/sufixo ficam como texto; só o inteiro anima.
interface ParsedMetricValue {
  prefix: string;
  target: number;
  suffix: string;
}

function parseMetricValue(value: string): ParsedMetricValue | null {
  const match = /^(\D*)(\d+)(\D*)$/.exec(value);
  if (!match) return null;
  const [, prefix = "", digits = "", suffix = ""] = match;
  return { prefix, target: Number.parseInt(digits, 10), suffix };
}

// Stagger do reveal dos 3 cards (classes de globals.css); o reveal fica no
// wrapper — nunca no grid (âncora da linha) nem no Card (dono do hover-lift).
const REVEAL_STAGGER = ["", "section-reveal-2", "section-reveal-3"] as const;

export function MetricsDashboard() {
  const { impactMetrics } = cvData;

  return (
    <section id="painel-de-impacto" className="scroll-mt-20 border-b border-border bg-muted">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <h2 className="section-heading bg-muted text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Painel de Impacto
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {impactMetrics.map((metric, index) => {
            const parsed = parseMetricValue(metric.value);

            return (
              <div key={metric.label} className={cn("section-reveal", REVEAL_STAGGER[index])}>
                <Card className="signature-hover card-hairline h-full bg-background text-center hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
                  <CardHeader className="justify-items-center">
                    <p className="metallic-text metrics-figure text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
                      {parsed ? (
                        <>
                          <span className="sr-only">{metric.value}</span>
                          <span aria-hidden="true">
                            {parsed.prefix}
                            <span
                              className="metric-count"
                              style={{ "--metric-target": parsed.target } as CSSProperties}
                            >
                              <span className="metric-count-static">{parsed.target}</span>
                            </span>
                            {parsed.suffix}
                          </span>
                        </>
                      ) : (
                        metric.value
                      )}
                    </p>
                    <h3 className="text-sm font-medium text-foreground">
                      {metric.label}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

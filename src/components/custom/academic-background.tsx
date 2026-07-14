import { Card, CardContent } from "@/components/ui/card";
import { cvData } from "@/data/cv";
import type { LanguageLevel } from "@/types/cv.types";
import { cn } from "@/lib/utils";

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

export function AcademicBackground() {
  const { education, languages } = cvData;

  return (
    <section id="formacao-academica" className="scroll-mt-20 border-b border-border bg-muted">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading bg-muted text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Formação Acadêmica e Idiomas
        </h2>

        <Card size="sm" className="card-hairline signature-hover mt-12 bg-background">
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
    </section>
  );
}

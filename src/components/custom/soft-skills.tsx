import { Presentation } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

// Stagger do reveal dos cards (primitiva .section-reveal em globals.css). Fica em
// cada Card — deep na árvore, nunca no h2 nem no irmão direto dele (a grade é a
// âncora de conteúdo da geometria da linha, §5.5). São 4 cards.
const CARD_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
] as const;

export function SoftSkills() {
  const { softSkills } = cvData;

  return (
    <section id="competencias-comportamentais" className="scroll-mt-20 border-b border-border bg-background">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Competências Comportamentais
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {softSkills.map((skill, index) => (
            <Card
              key={skill.title}
              size="sm"
              className={cn(
                "soft-skill-card section-reveal signature-hover bg-background",
                CARD_STAGGER[index] ?? "",
              )}
            >
              <CardHeader>
                <h3 className="signature-hover-text text-sm font-semibold text-foreground">
                  {skill.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {skill.description}
                </p>
                {skill.evidence && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-background/60 p-3 backdrop-blur-sm">
                    <Presentation
                      className="mt-0.5 size-4 shrink-0 text-foreground/70"
                      aria-hidden="true"
                    />
                    <p className="text-xs leading-relaxed text-foreground/80">
                      {skill.evidence}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

// Stagger do slide dos cards (primitiva .section-reveal com o keyframe
// trocado por .experience-card-reveal — globals.css). O slide fica num
// wrapper dentro do <li>, nunca no próprio <li>: o nó da timeline é filho
// dele e deslizaria junto, saindo do trilho.
const SLIDE_STAGGER = ["", "section-reveal-2", "section-reveal-3"] as const;

export function ExperienceTimeline() {
  const { experiences } = cvData;

  return (
    <section id="experiencia-profissional" className="scroll-mt-20 border-b border-border bg-background">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Experiência Profissional
        </h2>

        {/* Wrapper irmão do h2 — âncora do conteúdo na geometria da linha
            global (architecture.md §5.5): nunca animado. O trilho vive aqui
            como irmão da <ol> (div dentro de <ol> é HTML inválido). */}
        <div className="relative mt-12">
          <div className="experience-rail" aria-hidden="true">
            <div className="experience-rail-ink" />
            <div className="experience-rail-cover" />
          </div>
          <ol className="relative ml-3">
            {experiences.map((experience, index) => (
              <li key={experience.id} className="relative ml-8 pb-14 last:pb-0">
                <span
                  className="experience-node absolute top-5 -left-10 size-4 rounded-full border-2 border-foreground bg-foreground"
                  aria-hidden="true"
                />
                <div className={cn("section-reveal experience-card-reveal", SLIDE_STAGGER[index])}>
                  <Card size="sm" className="bg-background">
                    <CardHeader>
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-lg font-semibold text-foreground">
                          {experience.role}
                        </h3>
                        <Badge
                          asChild
                          variant="outline"
                          className="h-auto rounded-full border-border/80 bg-background/70 px-3 py-1 text-muted-foreground backdrop-blur-sm"
                        >
                          <time>{experience.period}</time>
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground/80">
                        {experience.company} · {experience.location}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2.5">
                        {experience.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex gap-3 text-sm leading-relaxed text-foreground/80"
                          >
                            <span
                              className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground"
                              aria-hidden="true"
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

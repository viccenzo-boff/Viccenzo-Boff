import { Badge } from "@/components/ui/badge";
import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

// Stagger do reveal dos badges (primitiva .section-reveal em globals.css). Fica
// em cada Badge — deep na árvore, nunca no h2 nem no irmão direto dele (âncoras
// da geometria da linha, §5.5). A maior categoria tem 5 itens.
const BADGE_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
  "section-reveal-5",
] as const;

export function SkillsMatrix() {
  const { technicalSkills } = cvData;

  return (
    <section id="matriz-de-competencias" className="scroll-mt-20 border-b border-border bg-muted">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Competências e Metodologias
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {technicalSkills.map((group, groupIndex) => (
            <div
              key={group.category}
              className="skill-panel signature-hover relative overflow-clip rounded-xl border border-border bg-background p-6"
            >
              <span className="skill-panel-number" aria-hidden="true">
                {String(groupIndex + 1).padStart(2, "0")}
              </span>
              <h3 className="signature-hover-text relative text-sm font-semibold text-foreground">
                {group.category}
              </h3>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill, index) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className={cn(
                      "section-reveal rounded-md border-border bg-background px-2.5 py-1 font-normal text-muted-foreground",
                      BADGE_STAGGER[index] ?? "",
                    )}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { GithubIcon } from "@/components/custom/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

// Stagger do reveal dos badges da stack (primitiva .section-reveal de
// globals.css). Fica em cada Badge — deep na árvore, nunca no h2 nem no
// irmão direto dele (âncoras da geometria da linha, §5.5). A stack tem 6
// itens → base + -2…-6; itens extras futuros caem no base (revelam juntos).
const BADGE_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
  "section-reveal-5",
  "section-reveal-6",
] as const;

export function Projects() {
  const { projects } = cvData;

  return (
    <section id="projetos" className="scroll-mt-20 border-b border-border bg-muted">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading bg-muted text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Projetos
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="project-frame">
              <Card className="project-card bg-card">
                <div className="project-grid hero-grid" aria-hidden="true" />
                <CardHeader>
                  <CardTitle className="signature-hover-text text-lg font-semibold text-foreground">
                    {project.name}
                  </CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.stack.map((technology, index) => (
                      <Badge
                        key={technology}
                        variant="outline"
                        className={cn(
                          "section-reveal rounded-md border-border bg-background px-2.5 py-1 font-normal text-muted-foreground",
                          BADGE_STAGGER[index] ?? "",
                        )}
                      >
                        {technology}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {project.description}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {project.highlights.map((highlight) => (
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
                <CardFooter>
                  <Button asChild variant="outline" className="project-cta signature-hover">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver no GitHub — ${project.name}`}
                    >
                      <GithubIcon />
                      Ver no GitHub
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

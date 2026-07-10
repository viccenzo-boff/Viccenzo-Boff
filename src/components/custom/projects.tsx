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

export function Projects() {
  const { projects } = cvData;

  return (
    <section id="projetos" className="scroll-mt-20 border-b border-border bg-muted">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Projetos
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-background">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {project.name}
                </CardTitle>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.stack.map((technology) => (
                    <Badge
                      key={technology}
                      variant="outline"
                      className="rounded-md border-border bg-background px-2.5 py-1 font-normal text-muted-foreground"
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
                <Button asChild variant="outline">
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
          ))}
        </div>
      </div>
    </section>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cvData } from "@/data/cv";

export function SkillsMatrix() {
  const { technicalSkills } = cvData;

  return (
    <section id="matriz-de-competencias" className="scroll-mt-20 border-b border-border bg-muted">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Competências e Metodologias
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {technicalSkills.map((group) => (
            <Card key={group.category} size="sm" className="bg-background">
              <CardHeader>
                <h3 className="text-sm font-semibold text-foreground">
                  {group.category}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="rounded-md border-border bg-background px-2.5 py-1 font-normal text-muted-foreground"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

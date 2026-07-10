import { Badge } from "@/components/ui/badge";
import { cvData } from "@/data/cv";

export function Technologies() {
  const { technologies } = cvData;

  return (
    <section id="tecnologias" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Tecnologias
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {technologies.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold text-foreground">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

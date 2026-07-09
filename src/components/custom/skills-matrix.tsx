import { Badge } from "@/components/ui/badge";
import { cvData } from "@/data/cv";

export function SkillsMatrix() {
  const { technicalSkills } = cvData;

  return (
    <section className="border-b border-zinc-200 bg-zinc-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
          Matriz de Competências
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {technicalSkills.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold text-zinc-900">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="rounded-md border-zinc-200 bg-background px-2.5 py-1 font-normal text-zinc-600"
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

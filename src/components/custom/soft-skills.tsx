import { Presentation } from "lucide-react";

import { cvData } from "@/data/cv";

export function SoftSkills() {
  const { softSkills } = cvData;

  return (
    <section id="competencias-comportamentais" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Competências Comportamentais
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {softSkills.map((skill) => (
            <div key={skill.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {skill.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {skill.description}
              </p>
              {skill.evidence && (
                <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <Presentation className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  <span>{skill.evidence}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

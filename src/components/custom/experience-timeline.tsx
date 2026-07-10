import { cvData } from "@/data/cv";

export function ExperienceTimeline() {
  const { experiences } = cvData;

  return (
    <section id="experiencia-profissional" className="scroll-mt-20 border-b border-border bg-background">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Experiência Profissional
        </h2>

        <ol className="relative mt-12 ml-3 border-l border-border">
          {experiences.map((experience) => (
            <li key={experience.id} className="relative ml-8 pb-14 last:pb-0">
              <span
                className="absolute top-1 -left-10 size-4 rounded-full border-2 border-foreground bg-background"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  {experience.role}
                </h3>
                <time className="text-sm font-medium text-muted-foreground">
                  {experience.period}
                </time>
              </div>
              <p className="text-sm font-medium text-foreground/80">
                {experience.company} · {experience.location}
              </p>
              <ul className="mt-4 space-y-2.5">
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

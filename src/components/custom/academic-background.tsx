import { cvData } from "@/data/cv";

export function AcademicBackground() {
  const { education } = cvData;

  return (
    <section id="formacao-academica" className="scroll-mt-20 border-b border-border bg-muted">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Formação Acadêmica
        </h2>

        <div className="mt-12 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {education.degree}
            </h3>
            <p className="text-sm font-medium text-foreground/80">
              {education.institution}
            </p>
          </div>
          <p className="text-sm font-medium text-foreground/70">
            {education.status} · Previsão de conclusão em {education.completionYear}
          </p>
        </div>
      </div>
    </section>
  );
}

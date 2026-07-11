import { Card, CardContent } from "@/components/ui/card";
import { cvData } from "@/data/cv";

export function AcademicBackground() {
  const { education, languages } = cvData;

  return (
    <section id="formacao-academica" className="scroll-mt-20 border-b border-border bg-muted">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Formação Acadêmica e Idiomas
        </h2>

        <Card size="sm" className="mt-12 bg-background">
          <CardContent>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
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

            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground">Idiomas</h3>
              <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-10">
                {languages.map((language) => (
                  <li key={language.name} className="flex items-baseline gap-2 text-sm">
                    <span className="font-medium text-foreground">{language.name}</span>
                    <span className="font-medium text-foreground/70">{language.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

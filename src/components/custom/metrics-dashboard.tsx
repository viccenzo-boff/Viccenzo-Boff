import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cvData } from "@/data/cv";

export function MetricsDashboard() {
  const { impactMetrics } = cvData;

  return (
    <section className="border-b border-border bg-muted">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-foreground/70 uppercase">
          Painel de Impacto
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {impactMetrics.map((metric) => (
            <Card key={metric.label} className="bg-background text-center">
              <CardHeader className="justify-items-center">
                <p className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {metric.value}
                </p>
                <h3 className="text-sm font-medium text-foreground">
                  {metric.label}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

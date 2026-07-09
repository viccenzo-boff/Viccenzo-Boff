import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cvData } from "@/data/cv";

export function MetricsDashboard() {
  const { impactMetrics } = cvData;

  return (
    <section className="border-b border-zinc-200 bg-zinc-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {impactMetrics.map((metric) => (
            <Card key={metric.label} className="bg-background text-center">
              <CardHeader className="justify-items-center">
                <p className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                  {metric.value}
                </p>
                <h3 className="text-sm font-medium text-zinc-900">
                  {metric.label}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-zinc-500">
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

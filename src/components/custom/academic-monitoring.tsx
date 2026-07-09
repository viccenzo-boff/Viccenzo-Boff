import { cvData } from "@/data/cv";

export function AcademicMonitoring() {
  const { monitorias } = cvData;

  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
          Monitorias Acadêmicas
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {monitorias.map((monitoria) => (
            <li
              key={monitoria.title}
              className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 px-5 py-4"
            >
              <span className="text-sm font-medium text-zinc-900">
                {monitoria.title}
              </span>
              <span className="text-xs font-medium text-zinc-500">
                {monitoria.period}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

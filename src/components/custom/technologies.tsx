import { Bot, Code2, Cpu, Database, Server, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

// Ícone lucide por categoria (aria-hidden — o título textual segue sendo o
// rótulo acessível). Mapeamento tipado com fallback para categorias futuras:
// uma categoria nova sem entrada aqui cai no ícone genérico em vez de quebrar.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Linguagens e Frameworks": Code2,
  "Bancos de Dados": Database,
  "Infra, Deploy e Ferramentas": Server,
  "Integrações com IA": Bot,
};

const FALLBACK_CATEGORY_ICON: LucideIcon = Cpu;

// Stagger do pop-in dos badges (primitiva .section-reveal + variante
// .tech-badge-reveal em globals.css). Fica em cada Badge — deep na árvore,
// nunca no h2 nem no irmão direto dele (âncoras da geometria da linha, §5.5).
// A maior categoria tem 7 itens → o 7º cai no base (revela junto com o 1º).
const BADGE_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
  "section-reveal-5",
  "section-reveal-6",
] as const;

export function Technologies() {
  const { technologies } = cvData;

  return (
    <section id="tecnologias" className="scroll-mt-20 border-b border-border bg-background">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Tecnologias
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {technologies.map((group) => {
            const Icon = CATEGORY_ICONS[group.category] ?? FALLBACK_CATEGORY_ICON;

            return (
              <Card key={group.category} size="sm" className="tech-card signature-hover bg-background">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="tech-tile size-9" aria-hidden="true">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {group.category}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, index) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className={cn(
                          "tech-badge section-reveal tech-badge-reveal rounded-md border-border bg-background px-2.5 py-1 font-normal text-muted-foreground",
                          BADGE_STAGGER[index] ?? "",
                        )}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

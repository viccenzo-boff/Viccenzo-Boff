import { Bot, Code2, Cpu, Database, Presentation, Server, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

// Macro-seção "Habilidades e Ferramentas": funde três antigas seções (Tecnologias,
// Competências e Metodologias, Comportamentais) numa única seção titulada, com um
// h2 só (âncora de portão da Scroll Progress Line, §5.5) e três blocos empilhados,
// cada um com seu subtítulo discreto. Os grids e cards de cada bloco são migrados
// VERBATIM dos componentes originais — classes Tailwind, reveals por view() e
// estrutura interna dos cards intactos; muda apenas o invólucro (seção/grid). Os
// `id` históricos (tecnologias / matriz-de-competencias / competencias-comportamentais)
// migram para os wrappers dos blocos, preservando os deep-links da busca (§6).

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

// Stagger do pop-in dos badges de Tecnologias (primitiva .section-reveal + variante
// .tech-badge-reveal em globals.css). Fica em cada Badge — deep na árvore, nunca no
// h2 nem no irmão direto dele (âncoras da geometria da linha, §5.5). A maior
// categoria tem 7 itens → o 7º cai no base (revela junto com o 1º).
const TECH_BADGE_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
  "section-reveal-5",
  "section-reveal-6",
] as const;

// Stagger do reveal dos badges de Competências e Metodologias (primitiva
// .section-reveal). A maior categoria tem 5 itens.
const SKILL_BADGE_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
  "section-reveal-5",
] as const;

// Stagger do reveal dos cards Comportamentais (primitiva .section-reveal). São 4 cards.
const SOFT_CARD_STAGGER = [
  "",
  "section-reveal-2",
  "section-reveal-3",
  "section-reveal-4",
] as const;

// Subtítulo discreto de cada bloco: eyebrow em caixa alta um passo abaixo do h2
// (text-xs vs text-sm), muted e sem o tick da assinatura — lê como rótulo
// subordinado, não como cabeçalho de seção. É h3, invisível à geometria da linha
// (que só mede h2).
const BLOCK_SUBTITLE_CLASS =
  "text-xs font-semibold tracking-widest text-muted-foreground uppercase";

export function SkillsAndTools() {
  const { technologies, technicalSkills, softSkills } = cvData;

  return (
    <section className="scroll-mt-20 border-b border-border bg-background">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="section-heading bg-background text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Habilidades e Ferramentas
        </h2>

        <div className="mt-12 flex flex-col gap-16 sm:gap-24">
          {/* Bloco 1 — Stack Tecnológica (migrado de technologies.tsx) */}
          <div id="tecnologias" className="scroll-mt-20">
            <h3 className={BLOCK_SUBTITLE_CLASS}>Stack Tecnológica</h3>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                              "tech-badge section-reveal tech-badge-reveal h-auto max-w-full whitespace-normal rounded-md border-border bg-background px-2.5 py-1 font-normal text-muted-foreground",
                              TECH_BADGE_STAGGER[index] ?? "",
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

          {/* Bloco 2 — Engenharia e Metodologias (migrado de skills-matrix.tsx).
              Os painéis são flat bg-background e dependem de um fundo muted para o
              relevo (na seção original o muted era da própria <section>). Aqui o
              muted vira uma bandeja editorial arredondada em volta do grid, o que
              preserva o pop dos painéis sem quebrar a leitura de macro-seção única.
              O subtítulo fica FORA da bandeja (no bg-background da seção) para
              manter text-muted-foreground consistente com os outros blocos e o
              contraste §5.3. */}
          <div id="matriz-de-competencias" className="scroll-mt-20">
            <h3 className={BLOCK_SUBTITLE_CLASS}>Engenharia e Metodologias</h3>

            {/* Bandeja muted enxuta no mobile (p-3): os badges são nowrap +
                shrink-0 dentro do overflow-clip do painel, então cada pixel de
                padding come da largura útil e corta rótulos longos. p-3 mantém a
                largura do painel ≈ à da <section> muted original (mesmos ~8
                badges longos cortados no 375px — sem piorar o mobile); sm:p-8 dá
                a folga editorial no desktop, onde o grid de 2 colunas não corta. */}
            <div className="mt-6 rounded-2xl bg-muted p-3 sm:p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {technicalSkills.map((group) => (
                  <div
                    key={group.category}
                    className="skill-panel signature-hover relative overflow-clip rounded-xl border border-border bg-background p-6"
                  >
                    <h3 className="signature-hover-text relative text-sm font-semibold text-foreground">
                      {group.category}
                    </h3>
                    <div className="relative mt-4 flex flex-wrap gap-2">
                      {group.skills.map((skill, index) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className={cn(
                            "section-reveal h-auto max-w-full whitespace-normal rounded-md border-border bg-background px-2.5 py-1 font-normal text-muted-foreground",
                            SKILL_BADGE_STAGGER[index] ?? "",
                          )}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bloco 3 — Perfil Comportamental (migrado de soft-skills.tsx) */}
          <div id="competencias-comportamentais" className="scroll-mt-20">
            <h3 className={BLOCK_SUBTITLE_CLASS}>Perfil Comportamental</h3>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {softSkills.map((skill, index) => (
                <Card
                  key={skill.title}
                  size="sm"
                  className={cn(
                    "section-reveal signature-hover bg-background",
                    SOFT_CARD_STAGGER[index] ?? "",
                  )}
                >
                  <CardHeader>
                    <h3 className="signature-hover-text text-sm font-semibold text-foreground">
                      {skill.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {skill.description}
                    </p>
                    {skill.evidence && (
                      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-background/60 p-3 backdrop-blur-sm">
                        <Presentation
                          className="mt-0.5 size-4 shrink-0 text-foreground/70"
                          aria-hidden="true"
                        />
                        <p className="text-xs leading-relaxed text-foreground/80">
                          {skill.evidence}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

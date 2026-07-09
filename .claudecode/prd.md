# Product Requirement Document (PRD) — Currículo Técnico Premium

## 1. Visão Geral do Produto
O projeto é um portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, com foco em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site transparece rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

**Status:** V1.6 implementada. Este documento reflete o estado atual do sistema; o backlog (seção 10) está vazio no momento.

---

## 2. Objetivos Estratégicos
* **Conversão:** Reter a atenção do recrutador nos primeiros 10 segundos através de uma proposta de valor clara e um visual minimalista impecável.
* **Autoridade:** Demonstrar proficiência técnica não apenas pelo texto, mas pela própria engenharia, velocidade e estrutura do site.
* **Diferenciação:** Substituir a ideia de "jogos" por um **Painel de Impacto Interativo** (Dashboard de Métricas), provando capacidade analítica e foco em qualidade.

---

## 3. Stack e Infraestrutura
* **Next.js 16.2.10** (App Router) + **React 19.2.4** + TypeScript estrito.
* **Tailwind CSS v4** + **shadcn/ui** (baseColor `zinc`, estilo `radix-vega`).
* **next-themes** — alternância de tema (light/dark) via classe `dark` na tag `<html>`, persistida em `localStorage`.
* **cmdk** + `Dialog` do Radix — motor da busca global (seção 7).
* Ícones via `lucide-react`. Fonte via `next/font/google` (Inter, variável `--font-sans`).
* `lang="pt-BR"` no `<html>`, `suppressHydrationWarning` (necessário por causa do tema aplicado via script antes da hidratação).
* Deploy estático/serverless na Vercel, custo zero de infraestrutura.
* Aplicação de página única (SPA de rota única), sem backend, sem persistência em banco.

---

## 4. Arquitetura da Aplicação

### 4.1 Layout Global
`src/app/layout.tsx` envolve toda a aplicação com `ThemeProvider` (`src/app/providers.tsx`, client component sobre `next-themes`) e renderiza `SiteHeader` (`src/components/custom/site-header.tsx`) — uma barra sticky global, fora do fluxo de `page.tsx`, contendo `SearchCommand` (à esquerda) e `ModeToggle` (à direita), em layout `justify-between`. Ela existe fora de `page.tsx` propositalmente: precisa sobreviver ao scroll das 7 seções abaixo, e este SPA não tem nav fixo.

### 4.2 Seções da Página
`src/app/page.tsx` compõe as seções abaixo, nesta ordem, cada uma um componente isolado em `src/components/custom/`. Cada seção carrega um `id` HTML estável e `scroll-mt-20` (compensa a altura do `SiteHeader` sticky no scroll ancorado) — âncoras usadas pelo `SearchCommand` (seção 7). Os fundos alternam em faixas `bg-background` / `bg-muted` ao longo da página (ver regra de contraste na seção 6.3):

| # | Componente | `id` | Fundo | Conteúdo |
|---|---|---|---|---|
| 1 | `hero.tsx` | `inicio` | `bg-background` | Nome, cargo alvo, localização, resumo profissional e botões de contato (e-mail, telefone, GitHub). Único bloco da página com layout centralizado (`items-center text-center`); as demais 6 seções mantêm conteúdo alinhado à esquerda. O botão de e-mail é o trigger de um menu de contato (`email-contact-menu.tsx`, client component sobre o `DropdownMenu` do shadcn/ui) com 4 ações: **Abrir no Gmail** e **Abrir no Outlook Web** (nova aba, `rel="noopener noreferrer"`), **Abrir no app de e-mail padrão** (`mailto:`) e **Copiar endereço** (`navigator.clipboard.writeText` com confirmação temporária no item — o menu permanece aberto via `preventDefault` no `onSelect` — anunciada por região `aria-live`/`role="status"`, `data-testid="email-copy-feedback"`). Todas as ações preservam o assunto automático `cvData.contact.emailSubject` (`cv.types.ts` / `cv.ts`); as URLs são montadas pelas funções puras de `src/lib/email-links.ts` (Gmail usa `su=`, Outlook usa `subject=`, ambos com `encodeURIComponent`). |
| 2 | `metrics-dashboard.tsx` | `painel-de-impacto` | `bg-muted` | Grid de 3 cards com as métricas de impacto (+600 atendimentos, +150 cartões de melhoria, <5% retrabalho). |
| 3 | `experience-timeline.tsx` | `experiencia-profissional` | `bg-background` | Timeline vertical com as 3 experiências (Dotse, IXC Soft, Dona Loca) e seus highlights. |
| 4 | `skills-matrix.tsx` | `matriz-de-competencias` | `bg-muted` | Grid de badges agrupadas por categoria de competência técnica. |
| 5 | `soft-skills.tsx` | `competencias-comportamentais` | `bg-background` | Grid com as competências comportamentais (`cvData.softSkills`). |
| 6 | `academic-background.tsx` | `formacao-academica` | `bg-muted` | Graduação em andamento (`cvData.education`: curso, instituição, período/status e previsão de conclusão). |
| 7 | `academic-monitoring.tsx` | `monitorias-academicas` | `bg-background` | Lista das 5 monitorias acadêmicas consecutivas. |

---

## 5. Camada de Dados
* Fonte única de verdade: `src/data/cv.ts` (objeto `cvData`), tipado por `src/types/cv.types.ts`.
* Todo o conteúdo textual do currículo é estático e tipado — nenhuma chamada de API ou CMS.
* Todos os campos de `CVData` (`contact`, `summary`, `impactMetrics`, `experiences`, `education`, `monitorias`, `technicalSkills`, `softSkills`) são renderizados por algum componente — não há campos órfãos.

---

## 6. Design System

### 6.1 Tema
Light Mode como padrão (`defaultTheme="light"`), com Dark Mode disponível via alternância manual do usuário no `ModeToggle` (botão único, ícones `Sun`/`Moon`, sem dropdown, `aria-label` dinâmico + `aria-pressed`, `data-testid="mode-toggle"` para os testes). `enableSystem={false}` — decisão de produto deliberada de **não** seguir a preferência de tema do sistema operacional automaticamente, alinhada ao princípio de "Foco em Light Mode Corporativo" do `claude.md`; reavaliada com o usuário e mantida.

`ModeToggle` usa `useSyncExternalStore` (em vez do padrão `useState`+`useEffect`) para o guard de hidratação, porque a regra de lint `react-hooks/set-state-in-effect` (habilitada neste projeto) rejeita a segunda abordagem.

### 6.2 Paleta e Tokens
Paleta monocromática zinc, expressa via tokens semânticos do shadcn (`text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `bg-muted-foreground`) nos 7 componentes de negócio — nenhuma classe `zinc-*` hardcoded em `src/components/custom`. `src/app/globals.css` define os tokens `:root` (light) e `.dark` (dark) e o `@custom-variant dark`.

Para textos de corpo com leitura mais longa — resumo do Hero, linha empresa/local e highlights da timeline, descrição das soft skills, instituição na formação acadêmica — usa-se `text-foreground/80` em vez de `text-muted-foreground`, preservando um contraste mais alto (mais próximo do antigo `zinc-600`). Labels curtos, timestamps e categorias usam `text-muted-foreground`.

### 6.3 Regra de Contraste em Seções `bg-muted`
Título de seção (`h2`) sobre fundo `bg-muted` não pode usar `text-muted-foreground` (dá 4,39:1 em light, abaixo do mínimo de 4,5:1) — usa-se `text-foreground/70` (7,38:1 em light, 7,73:1 em dark) nesse caso específico. Aplica-se às 3 seções com fundo `bg-muted`: `metrics-dashboard.tsx`, `skills-matrix.tsx` e `academic-background.tsx` (esta última também usa `text-foreground/70` na linha de status "Cursando 6º Período · Previsão de conclusão..."). Nas 4 seções com fundo `bg-background`, o h2 usa `text-muted-foreground` normalmente.

### 6.4 Alinhamento do Hero
Todo o conteúdo do Hero — nome, cargo, badge de localização, resumo profissional (inclusive o texto do parágrafo, não apenas o bloco como grupo) e botões de contato — é centralizado (`text-center` / `justify-center`). Resolve o vazio desproporcional à direita que aparecia em telas largas (>1280px) com alinhamento à esquerda. Escopo deliberadamente restrito ao Hero; as demais 6 seções continuam com conteúdo alinhado à esquerda dentro do mesmo container `mx-auto max-w-5xl`.

---

## 7. Busca Global e Navegação Ancorada
* **Trigger:** botão no `SiteHeader` (`aria-label="Pesquisar no currículo"`, ícone de lupa, dica visual "Ctrl K" oculta em telas `sm-`) mais atalho de teclado global `Ctrl+K`/`Cmd+K` (listener em `document`, registrado por `SearchCommand`).
* **Overlay:** `CommandDialog` do shadcn/ui (`src/components/ui/command.tsx`, sobre `cmdk` + Radix `Dialog`) — Esc fecha, foco retorna ao trigger ao fechar, título/descrição acessíveis via `sr-only` (herdado do Radix Dialog).
* **Índice de busca:** `src/lib/search-index.ts` deriva os itens pesquisáveis diretamente de `cvData` (nenhum conteúdo duplicado) — um item por métrica de impacto, experiência, grupo de competências técnicas, soft skill e monitoria, mais um item de perfil (Hero) e um de formação acadêmica; cada item carrega `sectionId` (a âncora), `title`, `subtitle` opcional e `keywords[]`. A filtragem usa o suporte nativo do `cmdk` a `keywords` no `CommandItem`, então a busca casa tanto pelo título quanto por texto auxiliar (ex.: buscar "PostgreSQL" encontra o grupo "Bancos de Dados").
* **Navegação fluida:** `src/lib/scroll-to-section.ts` fecha o overlay e chama `element.scrollIntoView({ behavior: "smooth", block: "start" })` (ou `"auto"` se `prefers-reduced-motion: reduce`), depois aplica a classe `.anchor-highlight` por 1,6s — keyframe `anchor-highlight-pulse` em `globals.css` (pulso sutil de `box-shadow`/fundo usando os tokens `--ring`/`--foreground`, desativado sob `prefers-reduced-motion: reduce`). `html` tem `scroll-behavior: smooth` (fallback `auto` no mesmo media query).
* **Nota de manutenção:** o `CommandDialog` em `command.tsx` precisa envolver `{children}` em `<Command>` (`<Command>{children}</Command>`). O código gerado pelo CLI do shadcn (`npx shadcn@latest add command dialog`) não faz isso por padrão — sem o wrapper, os subcomponentes do `cmdk` ficam sem o contexto/store interno e o clique no trigger quebra em runtime (`Cannot read properties of undefined (reading 'subscribe')`). Se o componente for regenerado via CLI, reaplicar esse ajuste.

---

## 8. Qualidade, Acessibilidade e Testes
* **Lighthouse (categoria Acessibilidade):** 100/100 em light e 100/100 em dark, auditado contra o build de produção (`pnpm build && pnpm start`) via `npx lighthouse --only-categories=accessibility`.
* **Testes automatizados:** `@playwright/test` como devDependency; suíte em três arquivos — `tests/dark-mode.spec.ts` (tema padrão light, alternância para dark, persistência via `localStorage`, ausência de FOUC, zero erros de console; 3 testes), `tests/search-navigation.spec.ts` (abertura via botão/atalho, filtragem, navegação até a seção, fechamento via Esc, estado vazio; 3 testes) e `tests/hero-contact.spec.ts` (menu de contato por e-mail do Hero: abertura com as 4 opções, URLs de Gmail com `su=` e Outlook com `subject=` em nova aba, item `mailto:` preservando `cvData.contact.emailSubject`, cópia para o clipboard com confirmação visível e anúncio `aria-live` — usa `context.grantPermissions(["clipboard-read", "clipboard-write"])`; 3 testes) — 9 testes no total, executados em 2 projetos Playwright (Desktop Chrome 1280px e Mobile Chrome 375px via `devices["Pixel 7"]`), 18/18 passando. Config em `playwright.config.ts` (sobe o build de produção via `webServer`, porta 3100). Comando: `pnpm test:e2e`.

---

## 9. Fora de Escopo
* Backend dedicado com banco de dados relacional ativo — todo o conteúdo continua estático e tipado em `src/data/cv.ts`.
* Formulário de contato com persistência em banco — mantidos os links diretos de e-mail/telefone/GitHub.

---

## 10. Backlog / Próximas Atividades

_Sem atividades planejadas no momento._

---

## 11. Histórico de Versões

| Versão | Entrega | Commits |
|---|---|---|
| V1 → V1.1 | Dark Mode: `ThemeProvider`, `ModeToggle`, `SiteHeader`; migração de classes `zinc-*` hardcoded para tokens semânticos. | `01e65af`, `5001243` |
| V1.1 → V1.2 | Acessibilidade (Lighthouse 94→100), suíte Playwright inicial (dark mode), seções "Formação Acadêmica" e "Competências Comportamentais". | `08316a9`, `09e3754`, `ca0c3cd`, `4029ab1` |
| V1.2 → V1.3 | Busca global (`Ctrl+K`) e navegação ancorada: `id` estável + `scroll-mt-20` nas 7 seções, `SearchCommand`, `search-index.ts`, `scroll-to-section.ts`, testes `search-navigation.spec.ts`. | `c807e7a`, `241fcf1`, `703201f` |
| V1.3 → V1.4 | Hero centralizado (nome, cargo, resumo e botões de contato). | `7de8494` |
| V1.4 → V1.5 | Assunto automático no botão de e-mail do Hero: campo `emailSubject` em `ContactInfo`/`cvData.contact`, `href` do mailto com `?subject=` via `encodeURIComponent`, novo teste `tests/hero-contact.spec.ts`. | _(pendente commit do usuário)_ |
| V1.5 → V1.6 | Menu de contato por e-mail no Hero: `DropdownMenu` do shadcn com 4 ações (Gmail, Outlook Web, `mailto:`, Copiar endereço com feedback `aria-live`), funções puras em `src/lib/email-links.ts`, componente `email-contact-menu.tsx`, testes do menu em `hero-contact.spec.ts` (clipboard via `grantPermissions`), Lighthouse Acessibilidade 100 revalidado em light e dark. Motivação: `mailto:` sozinho falha silenciosamente sem cliente de e-mail configurado; não há API para detectar o webmail do visitante, então as opções são oferecidas explicitamente. | _(pendente commit do usuário)_ |

Todos os commits acima estão locais em `main`; nenhum push foi realizado. Commits neste repositório são feitos exclusivamente pelo usuário (ver `claude.md`, seção 3) — Claude Code não executa `git commit`/`git push`.

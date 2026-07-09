# Product Requirement Document (PRD) - Currículo Técnico Premium

## 1. Visão Geral do Produto
O projeto é um portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, com foco em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site transparece rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

**Status:** V1.3 em produção — busca global (`Ctrl+K`) com navegação ancorada e scroll suave até a seção correspondente, concluída sobre o V1.2 (acessibilidade, testes e conteúdo acadêmico/soft skills). Este documento reflete o estado atual do sistema e o backlog de evolução.

---

## 2. Objetivos Estratégicos
* **Conversão:** Reter a atenção do recrutador nos primeiros 10 segundos através de uma proposta de valor clara e um visual minimalista impecável.
* **Autoridade:** Demonstrar proficiência técnica não apenas pelo texto, mas pela própria engenharia, velocidade e estrutura do site.
* **Diferenciação:** Substituir a ideia de "jogos" por um **Painel de Impacto Interativo** (Dashboard de Métricas), provando capacidade analítica e foco em qualidade.

---

## 3. Estado Atual do Sistema (V1.1 em Produção)

### 3.1 Stack e Infraestrutura
* Next.js 16 (App Router) + React 19 + TypeScript estrito.
* Tailwind CSS v4 + shadcn/ui (baseColor `zinc`, estilo `radix-vega`).
* `next-themes` — alternância de tema (light/dark) via classe `dark` na tag `<html>`, persistida em `localStorage`.
* Ícones via `lucide-react`.
* Deploy estático/serverless na Vercel, custo zero de infraestrutura.
* Aplicação de página única (SPA de rota única), sem backend, sem persistência em banco.

### 3.2 Estrutura de Página
`src/app/layout.tsx` envolve toda a aplicação com `ThemeProvider` (`src/app/providers.tsx`, client component sobre `next-themes`) e renderiza `SiteHeader` (`src/components/custom/site-header.tsx`) — uma barra sticky global, fora do fluxo de `page.tsx`, contendo `SearchCommand` (`search-command.tsx`, à esquerda) e `ModeToggle` (`mode-toggle.tsx`, à direita). Ela existe fora de `page.tsx` propositalmente: precisa sobreviver ao scroll das 7 seções abaixo, e este SPA não tem nav fixo.

`src/app/page.tsx` compõe as seções nesta ordem, cada uma um componente isolado em `src/components/custom/`. Cada seção carrega um `id` HTML estável e `scroll-mt-20` (compensa a altura do `SiteHeader` sticky no scroll ancorado) — âncoras usadas pelo `SearchCommand` (ver 3.6):
1. **Hero** (`hero.tsx`, `id="inicio"`) — nome, cargo alvo, localização, resumo profissional e botões de contato (e-mail, telefone, GitHub).
2. **MetricsDashboard** (`metrics-dashboard.tsx`, `id="painel-de-impacto"`) — grid de 3 cards com as métricas de impacto (+600 atendimentos, +150 cartões de melhoria, <5% retrabalho).
3. **ExperienceTimeline** (`experience-timeline.tsx`, `id="experiencia-profissional"`) — timeline vertical com as 3 experiências (Dotse, IXC Soft, Dona Loca) e seus highlights.
4. **SkillsMatrix** (`skills-matrix.tsx`, `id="matriz-de-competencias"`) — grid de badges agrupadas por categoria de competência técnica.
5. **SoftSkills** (`soft-skills.tsx`, `id="competencias-comportamentais"`) — grid com as competências comportamentais (`cvData.softSkills`).
6. **AcademicBackground** (`academic-background.tsx`, `id="formacao-academica"`) — graduação em andamento (`cvData.education`: curso, instituição, período/status e previsão de conclusão).
7. **AcademicMonitoring** (`academic-monitoring.tsx`, `id="monitorias-academicas"`) — lista das 5 monitorias acadêmicas consecutivas.

### 3.3 Camada de Dados
* Fonte única de verdade: `src/data/cv.ts` (objeto `cvData`), tipado por `src/types/cv.types.ts`.
* Todo o conteúdo textual do currículo é estático e tipado — nenhuma chamada de API ou CMS.
* Todos os campos de `CVData` são renderizados por algum componente, incluindo `education` (via `academic-background.tsx`) e `softSkills` (via `soft-skills.tsx`) — não há mais campos órfãos.

### 3.4 Design System
* Light Mode como padrão (`defaultTheme="light"`), com Dark Mode disponível via alternância manual do usuário no `ModeToggle` (botão único, ícones `Sun`/`Moon`, sem dropdown, `aria-label` dinâmico + `aria-pressed`). `enableSystem={false}` — decisão de produto deliberada de **não** seguir a preferência de tema do sistema operacional automaticamente; reavaliada e **mantida** (ver changelog 2026-07-09, item 4.3 fechado sem alteração de código).
* Paleta monocromática zinc, expressa via tokens semânticos do shadcn (`text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `bg-muted-foreground`) nos 7 componentes de negócio — nenhuma classe `zinc-*` hardcoded restante em `src/components/custom` (validado via `grep -rn "zinc-" src/components/custom`).
* Decisão de execução (não estava explícita no plano original): para textos de corpo com leitura mais longa — resumo do Hero, linha empresa/local e highlights da timeline — usou-se `text-foreground/80` em vez de `text-muted-foreground`, preservando um contraste mais próximo do `zinc-600` original (mais alto que o de `zinc-500`/`muted-foreground`). Labels curtos, timestamps e categorias usam `text-muted-foreground`.
* **Regra de contraste em seções `bg-muted`:** título de seção (`h2`) sobre fundo `bg-muted` não pode usar `text-muted-foreground` (dá 4,39:1 em light, abaixo do mínimo de 4,5:1) — usar `text-foreground/70` (7,38:1 em light, 7,73:1 em dark) nesse caso específico. Aplica-se hoje a `metrics-dashboard.tsx` e `skills-matrix.tsx`; `text-muted-foreground` continua correto para títulos de seção sobre `bg-background`.
* `src/app/globals.css` mantém o bloco `.dark { ... }` e o `@custom-variant dark` sem alterações de paleta — a infraestrutura já existia (documentada na V1) e agora está efetivamente em uso.

### 3.5 Qualidade e Acessibilidade
* **Lighthouse (categoria Acessibilidade):** 100/100 em light e 100/100 em dark, auditado contra o build de produção (`pnpm build && pnpm start`) via `npx lighthouse --only-categories=accessibility` em 2026-07-09 — reconfirmado após a busca global (3.6) entrar em produção, mesmo resultado (0 auditorias reprovadas). Dois problemas haviam sido encontrados na primeira rodada da V1.2 (nota 94) e já estavam corrigidos (ver regra de contraste acima e o h2 "Painel de Impacto" em `metrics-dashboard.tsx`).
* **Testes automatizados:** `@playwright/test` como devDependency; suíte em dois arquivos — `tests/dark-mode.spec.ts` (tema padrão light, alternância para dark, persistência via `localStorage`, ausência de FOUC, zero erros de console) e `tests/search-navigation.spec.ts` (3.6) — executada em dois projetos Playwright (Desktop Chrome 1280px e Mobile Chrome 375px), 12/12 passando. Config em `playwright.config.ts` (sobe o build de produção via `webServer`). Comando: `pnpm test:e2e`.

### 3.6 Busca Global e Navegação Ancorada
* **Trigger:** botão no `SiteHeader` (`aria-label="Pesquisar no currículo"`, ícone de lupa, dica visual "Ctrl K" oculta em telas `sm-` para não competir por espaço no mobile) mais atalho de teclado global `Ctrl+K`/`Cmd+K` (listener em `document`, registrado por `SearchCommand`).
* **Overlay:** `CommandDialog` do shadcn/ui (`src/components/ui/command.tsx`, sobre `cmdk` + Radix `Dialog`) — Esc fecha, foco retorna ao trigger ao fechar, título/descrição acessíveis via `sr-only` (comportamento herdado do Radix Dialog, sem código adicional).
* **Índice de busca:** `src/lib/search-index.ts` deriva os itens pesquisáveis diretamente de `cvData` (nenhum conteúdo duplicado) — um item por métrica de impacto, experiência, grupo de competências técnicas, soft skill e monitoria, mais um item de perfil (Hero) e um de formação acadêmica; cada item carrega `sectionId` (a âncora), `title`, `subtitle` opcional e `keywords[]`. A filtragem usa o suporte nativo do `cmdk` a `keywords` no `CommandItem`, então a busca casa tanto pelo título quanto por texto auxiliar (ex: buscar "PostgreSQL" encontra o grupo "Bancos de Dados").
* **Navegação fluida:** `src/lib/scroll-to-section.ts` fecha o overlay e chama `element.scrollIntoView({ behavior: "smooth", block: "start" })` (ou `"auto"` se `prefers-reduced-motion: reduce`), depois aplica a classe `.anchor-highlight` por 1,6s — keyframe `anchor-highlight-pulse` em `globals.css` (um pulso sutil de `box-shadow`/fundo usando os tokens `--ring`/`--foreground`, desativado sob `prefers-reduced-motion: reduce`). `html` ganhou `scroll-behavior: smooth` (com fallback `auto` no mesmo media query).
* **Bug corrigido durante a implementação:** o `command.tsx` gerado pelo CLI do shadcn (`npx shadcn@latest add command dialog`) não envolvia `{children}` em `<Command>` dentro do `CommandDialog` — os subcomponentes do `cmdk` (`CommandInput`/`CommandList`/…) ficavam sem o contexto/store interno e o clique no trigger quebrava em runtime (`Cannot read properties of undefined (reading 'subscribe')`). Corrigido adicionando o wrapper `<Command>{children}</Command>` em `CommandDialog` — arquivo do shadcn tratado como código do projeto, conforme o próprio modelo do shadcn/ui.

---

## 4. Backlog / Próximas Atividades

Nenhum item em aberto no momento. O item 4.1 da versão anterior deste documento (ancoragem de seções + busca global fluida) foi concluído — ver changelog (seção 6) para detalhes.

---

## 5. Fora de Escopo (mantido)
* Backend dedicado com banco de dados relacional ativo — todo o conteúdo continua estático e tipado em `src/data/cv.ts`.
* Formulário de contato com persistência em banco — mantidos os links diretos de e-mail/telefone/GitHub.

---

## 6. Changelog

### 2026-07-09 — Busca Global e Navegação Ancorada (V1.2 → V1.3)
Execução completa do backlog 4.1 da versão anterior deste documento (removido da seção 4; conteúdo incorporado às seções 3.2 e 3.6).

**Arquivos novos:**
* `src/components/custom/search-command.tsx` — trigger de busca + `CommandDialog`, atalho `Ctrl+K`/`Cmd+K`, agrupa resultados por seção.
* `src/lib/search-index.ts` — índice de busca derivado de `cvData` (perfil, métricas, experiências, competências técnicas, soft skills, formação, monitorias).
* `src/lib/scroll-to-section.ts` — scroll suave até a âncora + destaque temporário, com guarda de `prefers-reduced-motion`.
* `src/components/ui/command.tsx`, `dialog.tsx`, `input.tsx`, `input-group.tsx`, `textarea.tsx` — instalados via `npx shadcn@latest add command dialog`.
* `tests/search-navigation.spec.ts` — abertura via botão/atalho, filtragem, navegação até a seção, fechamento via Esc, estado vazio.

**Arquivos alterados:**
* `hero.tsx`, `metrics-dashboard.tsx`, `experience-timeline.tsx`, `skills-matrix.tsx`, `soft-skills.tsx`, `academic-background.tsx`, `academic-monitoring.tsx` — adicionado `id` estável + `scroll-mt-20` na seção raiz de cada componente.
* `site-header.tsx` — `SearchCommand` adicionado ao lado do `ModeToggle`; layout mudou de `justify-end` para `justify-between`.
* `globals.css` — `scroll-behavior: smooth` em `html`; keyframe `anchor-highlight-pulse` + classe `.anchor-highlight`; ambos desativados sob `prefers-reduced-motion: reduce`.
* `package.json` / `pnpm-lock.yaml` — dependências do `cmdk` e dos componentes shadcn instalados.

**Bug corrigido:** `command.tsx` gerado pelo CLI do shadcn não envolvia os filhos do `CommandDialog` em `<Command>`, quebrando em runtime ao abrir o overlay (`Cannot read properties of undefined (reading 'subscribe')`) — ver detalhe em 3.6.

**Verificação realizada:** `pnpm lint` e `pnpm build` limpos. Suíte Playwright (`pnpm test:e2e`) 12/12 passando (Desktop Chrome + Mobile Chrome). Lighthouse de Acessibilidade via `npx lighthouse` contra build de produção — 100/100 em light e 100/100 em dark (dark validado com uma instância Chromium com CDP exposto, tema pré-setado em `localStorage` antes da auditoria), zero regressão em relação à V1.2.

**Commits:** `c807e7a` `feat(nav): ancora as 7 secoes com id estavel e scroll-margin`, `241fcf1` `feat(search): busca global fluida com Ctrl+K e navegacao ancorada`, `703201f` `test(e2e): cobre busca global e navegacao ancorada`, `b86be9b` `docs(prd): registra conclusao da busca global e navegacao ancorada (V1.2 -> V1.3)`. Nenhum push realizado — commits permanecem locais em `main`.

### 2026-07-09 — Acessibilidade, Testes e Conteúdo Acadêmico (V1.1 → V1.2)
Execução completa do backlog 4.1–4.5 da versão anterior deste documento (removido da seção 4; conteúdo incorporado às seções 3 e 6).

**Arquivos novos:**
* `src/components/custom/soft-skills.tsx` — seção "Competências Comportamentais", renderiza `cvData.softSkills`.
* `src/components/custom/academic-background.tsx` — seção "Formação Acadêmica", renderiza `cvData.education`.
* `playwright.config.ts` — configuração do Playwright (projetos Desktop Chrome 1280px e Mobile Chrome 375px, `webServer` sobe o build de produção).
* `tests/dark-mode.spec.ts` — suíte de regressão do Dark Mode (tema padrão, alternância, persistência via `localStorage`, ausência de FOUC, zero erros de console).

**Arquivos alterados:**
* `metrics-dashboard.tsx` — adicionado h2 "Painel de Impacto" (corrige heading-order: a seção pulava de h1 direto para h3).
* `skills-matrix.tsx` — h2 "Matriz de Competências" trocado de `text-muted-foreground` para `text-foreground/70` (corrige color-contrast de 4,39:1 para 7,38:1 sobre `bg-muted`).
* `mode-toggle.tsx` — `aria-label` estático trocado por rótulo dinâmico ("Mudar para modo escuro"/"Mudar para modo claro") + `aria-pressed`; adicionado `data-testid="mode-toggle"`.
* `page.tsx` — `SoftSkills` e `AcademicBackground` inseridos na composição, entre `SkillsMatrix` e `AcademicMonitoring`.
* `package.json` / `pnpm-lock.yaml` — dependência `@playwright/test` adicionada; script `test:e2e`.
* `.gitignore` — ignorados `/playwright-report`, `/test-results`, `/blob-report`.

**Decisão registrada (item 4.3):** `enableSystem`/`defaultTheme` reavaliados com o usuário e **mantidos** (`false`/`"light"`), alinhado ao princípio de "Foco em Light Mode Corporativo" do `claude.md`. Fechado sem alteração de código.

**Verificação realizada:** Lighthouse de Acessibilidade via `npx lighthouse` contra build de produção — 100/100 em light e 100/100 em dark (zero auditorias reprovadas; a primeira rodada, antes das correções acima, obteve 94/100 em light). Suíte Playwright (`pnpm test:e2e`) com 6/6 testes passando em Desktop Chrome e Mobile Chrome. `pnpm lint` e `pnpm build` limpos em todas as etapas.

**Commits:** `08316a9` `fix(a11y): corrige contraste e ordem de headings para Lighthouse 100/100`, `09e3754` `fix(a11y): rotulo dinamico e aria-pressed no ModeToggle`, `ca0c3cd` `test(e2e): adiciona Playwright e teste de regressao do Dark Mode`, `4029ab1` `feat(cv): renderiza Formacao Academica e Soft Skills`. Nenhum push realizado — commits permanecem locais em `main`.

### 2026-07-09 — Dark Mode (V1 → V1.1)
Implementação completa da especificação da antiga seção 4.1 (removida deste documento; conteúdo incorporado às seções 3 e 4 acima).

**Arquivos novos:**
* `src/app/providers.tsx` — `ThemeProvider` client component sobre `next-themes`.
* `src/components/custom/mode-toggle.tsx` — botão de alternância (Sun/Moon), usa `useSyncExternalStore` para o guard de hidratação em vez do padrão `useState`+`useEffect`, que a regra de lint `react-hooks/set-state-in-effect` (habilitada neste projeto) rejeita.
* `src/components/custom/site-header.tsx` — barra sticky global com o `ModeToggle`.

**Arquivos alterados:**
* `src/app/layout.tsx` — `ThemeProvider` + `SiteHeader` conectados, `suppressHydrationWarning` adicionado, `lang="en"` → `lang="pt-BR"`.
* `hero.tsx`, `metrics-dashboard.tsx`, `experience-timeline.tsx`, `skills-matrix.tsx`, `academic-monitoring.tsx` — migração de classes `zinc-*` hardcoded para tokens semânticos.
* `package.json` / `pnpm-lock.yaml` — dependência `next-themes` adicionada.

**Verificação realizada:** `pnpm lint` e `pnpm build` limpos; smoke test com Playwright (Chromium headless) cobrindo tema padrão light, alternância para dark, persistência pós-reload, viewport mobile (375px) e desktop (1280px), e checagem de `console --errors` (nenhum erro). Lighthouse de Acessibilidade **não** foi executado (ver 4.1).

**Commits:** `01e65af` `feat(theme): add dark mode toggle with next-themes`, `5001243` `refactor(ui): migrate hardcoded zinc colors to semantic tokens`. Nenhum push realizado — commits permanecem locais em `main`.

# Product Requirement Document (PRD) - Currículo Técnico Premium

## 1. Visão Geral do Produto
O projeto é um portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, com foco em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site transparece rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

**Status:** V1.1 em produção — Dark Mode ativado sobre o MVP (V1 — Light Mode). Este documento reflete o estado atual do sistema e o backlog de evolução.

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
`src/app/layout.tsx` envolve toda a aplicação com `ThemeProvider` (`src/app/providers.tsx`, client component sobre `next-themes`) e renderiza `SiteHeader` (`src/components/custom/site-header.tsx`) — uma barra sticky global, fora do fluxo de `page.tsx`, contendo apenas o `ModeToggle` (`src/components/custom/mode-toggle.tsx`). Ela existe fora de `page.tsx` propositalmente: precisa sobreviver ao scroll das 5 seções abaixo, e este SPA não tem nav fixo.

`src/app/page.tsx` compõe as seções nesta ordem, cada uma um componente isolado em `src/components/custom/`:
1. **Hero** (`hero.tsx`) — nome, cargo alvo, localização, resumo profissional e botões de contato (e-mail, telefone, GitHub).
2. **MetricsDashboard** (`metrics-dashboard.tsx`) — grid de 3 cards com as métricas de impacto (+600 atendimentos, +150 cartões de melhoria, <5% retrabalho).
3. **ExperienceTimeline** (`experience-timeline.tsx`) — timeline vertical com as 3 experiências (Dotse, IXC Soft, Dona Loca) e seus highlights.
4. **SkillsMatrix** (`skills-matrix.tsx`) — grid de badges agrupadas por categoria de competência técnica.
5. **AcademicMonitoring** (`academic-monitoring.tsx`) — lista das 5 monitorias acadêmicas consecutivas.

### 3.3 Camada de Dados
* Fonte única de verdade: `src/data/cv.ts` (objeto `cvData`), tipado por `src/types/cv.types.ts`.
* Todo o conteúdo textual do currículo é estático e tipado — nenhuma chamada de API ou CMS.
* **Gap conhecido:** os campos `education` (graduação/Unoesc) e `softSkills` existem no tipo `CVData` e em `cv.ts`, mas **não são renderizados por nenhum componente atualmente**. Se a seção acadêmica/soft skills for desejada na home, é necessário criar o componente correspondente (ex.: `academic-background.tsx` ou estender `academic-monitoring.tsx`) — não incluído neste documento por não ter sido solicitado ainda.

### 3.4 Design System
* Light Mode como padrão (`defaultTheme="light"`), com Dark Mode disponível via alternância manual do usuário no `ModeToggle` (botão único, ícones `Sun`/`Moon`, sem dropdown). `enableSystem={false}` — decisão de produto deliberada de **não** seguir a preferência de tema do sistema operacional automaticamente; permanece em aberto para reavaliação (ver 4.3).
* Paleta monocromática zinc, agora inteiramente expressa via tokens semânticos do shadcn (`text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `bg-muted-foreground`) nos 5 componentes de negócio — nenhuma classe `zinc-*` hardcoded restante em `src/components/custom` (validado via `grep -rn "zinc-" src/components/custom`).
* Decisão de execução (não estava explícita no plano original): para textos de corpo com leitura mais longa — resumo do Hero, linha empresa/local e highlights da timeline — usou-se `text-foreground/80` em vez de `text-muted-foreground`, preservando um contraste mais próximo do `zinc-600` original (mais alto que o de `zinc-500`/`muted-foreground`). Labels curtos, timestamps e categorias usam `text-muted-foreground`.
* `src/app/globals.css` mantém o bloco `.dark { ... }` e o `@custom-variant dark` sem alterações de paleta — a infraestrutura já existia (documentada na V1) e agora está efetivamente em uso.

---

## 4. Backlog / Próximas Atividades

### 4.1 Auditoria de Acessibilidade (Lighthouse) em ambos os temas
**Gap identificado na execução do Dark Mode:** a verificação de aceite foi feita via build/lint limpos e smoke test visual com Playwright (screenshots light/dark, desktop 1280px e mobile 375px, persistência pós-reload, zero erros de console) — mas o Lighthouse de Acessibilidade (RNF02 do MVP original, meta ~100) **não foi executado** em nenhum dos dois temas. Rodar e registrar a nota antes de considerar o dark mode como aceite final.

### 4.2 Persistir teste automatizado de regressão para o Dark Mode
**Gap identificado na execução:** a validação usou um script Playwright ad-hoc fora do repositório (scratchpad de sessão), descartado ao final. O projeto não tem nenhuma infraestrutura de testes hoje (sem `@playwright/test`, sem Vitest/Jest configurado). Decidir se vale introduzir testes automatizados no repo e, se sim, formalizar esse script como um teste de regressão (alternância de tema, persistência em reload, ausência de FOUC) em vez de validação manual a cada mudança futura no design system.

### 4.3 Reavaliar `enableSystem` (seguir preferência do SO do recrutador)
Decisão em aberto desde a especificação original: hoje o tema inicial é sempre `light`, independentemente do SO do visitante. Se o objetivo mudar para "respeitar o tema do sistema operacional", trocar `enableSystem` para `true` e `defaultTheme` para `"system"` em `src/app/providers.tsx`.

### 4.4 Melhorar rótulo acessível do ModeToggle
**Gap identificado na execução:** o `aria-label` do botão (`mode-toggle.tsx`) é estático ("Alternar tema claro/escuro") e não comunica a ação resultante nem o estado atual a tecnologias assistivas. Avaliar trocar por um rótulo dinâmico (ex.: "Mudar para modo escuro" / "Mudar para modo claro") ou adicionar `aria-pressed`.

### 4.5 Renderizar Formação Acadêmica e Soft Skills
Ver gap conhecido na seção 3.3 — dados já existem em `cv.ts`/`cv.types.ts`, falta componente e posicionamento na página.

---

## 5. Fora de Escopo (mantido)
* Backend dedicado com banco de dados relacional ativo — todo o conteúdo continua estático e tipado em `src/data/cv.ts`.
* Formulário de contato com persistência em banco — mantidos os links diretos de e-mail/telefone/GitHub.

---

## 6. Changelog

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

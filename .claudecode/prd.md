# Product Requirement Document (PRD) — Currículo Técnico Premium

## 1. Visão Geral do Produto
O projeto é um portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, com foco em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site transparece rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

**Status:** V1.8 implementada. Este documento reflete o estado atual do sistema. As 5 atividades do backlog anterior (B1 — Download do currículo em PDF; B2 — Idiomas; B3 — Evidência de oratória; B4 — Seção de Projetos; B5 — Seção de Tecnologias) foram implementadas em conjunto e movidas para o histórico (seção 11); a seção 10 lista apenas validações de conteúdo pendentes e tarefas externas.

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
* **Build em duas etapas:** `pnpm build` = `pnpm generate:cv-pdf && next build` — o PDF do currículo é gerado **antes** do `next build` (assets adicionados a `public/` depois do build não entram no output da Vercel). O script `vercel-build` (`playwright install chromium && pnpm build`) é o build command na Vercel — instala o Chromium do Playwright no ambiente de build (~30–60s adicionais, aceitável para deploys esporádicos). `tsx` como devDependency executa o script TypeScript/JSX; o build do `esbuild` (dependência do tsx) está aprovado em `pnpm-workspace.yaml` (`allowBuilds`).

---

## 4. Arquitetura da Aplicação

### 4.1 Layout Global
`src/app/layout.tsx` envolve toda a aplicação com `ThemeProvider` (`src/app/providers.tsx`, client component sobre `next-themes`) e renderiza `SiteHeader` (`src/components/custom/site-header.tsx`) — uma barra sticky global, fora do fluxo de `page.tsx`, contendo `SearchCommand` (à esquerda) e, à direita, o botão compacto de download do CV (ícone `Download`, `aria-label="Baixar currículo em PDF"`, `data-testid="cv-download-header"`, link estático com atributo `download`) ao lado do `ModeToggle`, em layout `justify-between`. Ela existe fora de `page.tsx` propositalmente: precisa sobreviver ao scroll das 9 seções abaixo, e este SPA não tem nav fixo — o download permanece acessível durante todo o scroll.

### 4.2 Seções da Página
`src/app/page.tsx` compõe as seções abaixo, nesta ordem, cada uma um componente isolado em `src/components/custom/`. Cada seção carrega um `id` HTML estável e `scroll-mt-20` (compensa a altura do `SiteHeader` sticky no scroll ancorado) — âncoras usadas pelo `SearchCommand` (seção 7). Os fundos alternam em faixas `bg-background` / `bg-muted` ao longo da página (ver regra de contraste na seção 6.3). As seções 4 e 5 foram inseridas em par adjacente na V1.8 — por isso a alternância das seções 6–9 permaneceu a mesma da V1.7, sem auditoria adicional de contraste:

| # | Componente | `id` | Fundo | Conteúdo |
|---|---|---|---|---|
| 1 | `hero.tsx` | `inicio` | `bg-background` | Nome, cargo alvo, localização, resumo profissional e botões de contato (e-mail, WhatsApp, GitHub, **Baixar CV (PDF)** — 4º botão, ícone `Download` do lucide, link estático `<a href download>` para o asset de `public/`, sem JavaScript). O botão de WhatsApp usa o link oficial de *click to chat* (`https://wa.me/<DDI+número>?text=<mensagem>`, sem API/chave), montado pela função pura `buildWhatsAppChatUrl` de `src/lib/whatsapp-link.ts` a partir de `contact.phone` (normalizado para dígitos + DDI 55) e `contact.whatsappMessage`; abre em nova aba (`rel="noopener noreferrer"`), rótulo visível "WhatsApp" + `aria-label="Conversar no WhatsApp"`, ícone via SVG inline `WhatsAppIcon` com `fill="currentColor"` (monocromático, adapta-se a light/dark — `lucide-react` não possui ícones de marca), mesmo padrão do `GithubIcon` — ambos os ícones de marca vivem em `src/components/custom/brand-icons.tsx` (compartilhados entre Hero e Projetos). Único bloco da página com layout centralizado (`items-center text-center`); as demais 8 seções mantêm conteúdo alinhado à esquerda. O botão de e-mail é o trigger de um menu de contato (`email-contact-menu.tsx`, client component sobre o `DropdownMenu` do shadcn/ui) com 4 ações: **Abrir no Gmail** e **Abrir no Outlook Web** (nova aba, `rel="noopener noreferrer"`), **Abrir no app de e-mail padrão** (`mailto:`) e **Copiar endereço** (`navigator.clipboard.writeText` com confirmação temporária no item — o menu permanece aberto via `preventDefault` no `onSelect` — anunciada por região `aria-live`/`role="status"`, `data-testid="email-copy-feedback"`). Todas as ações preservam o assunto automático `cvData.contact.emailSubject` (`cv.types.ts` / `cv.ts`); as URLs são montadas pelas funções puras de `src/lib/email-links.ts` (Gmail usa `su=`, Outlook usa `subject=`, ambos com `encodeURIComponent`). |
| 2 | `metrics-dashboard.tsx` | `painel-de-impacto` | `bg-muted` | Grid de 3 cards com as métricas de impacto (+600 atendimentos, +150 cartões de melhoria, <5% retrabalho). |
| 3 | `experience-timeline.tsx` | `experiencia-profissional` | `bg-background` | Timeline vertical com as 3 experiências (Dotse, IXC Soft, Dona Loca) e seus highlights. |
| 4 | `projects.tsx` | `projetos` | `bg-muted` | Card do **Birthday.ai** (`cvData.projects`): descrição, stack em badges, 4 highlights (orquestração do Gemini 2.5 Flash, integração WhatsApp via biblioteca não oficial como decisão de custo, full-stack TypeScript na Vercel, processo SDD + ciclo Plan–Execute–Review–Test) e CTA "Ver no GitHub" (nova aba, `aria-label` iniciando pelo texto visível — exigência WCAG 2.5.3 *Label in Name*, flagrada pelo Lighthouse na primeira auditoria). `liveUrl` existe nos dados mas **não é renderizada** — a demo exige login (beco sem saída para recrutador). |
| 5 | `technologies.tsx` | `tecnologias` | `bg-background` | Vitrine de hard skills otimizada para ATS (`cvData.technologies`): 4 grupos de badges — Linguagens e Frameworks, Bancos de Dados, Infra/Deploy/Ferramentas, Integrações com IA. 100% hard-tech; metodologias (SDD/PERT) ficam no card do Birthday.ai. |
| 6 | `skills-matrix.tsx` | `matriz-de-competencias` | `bg-muted` | **"Competências e Metodologias"** (retitulada na V1.8; `id` preservado para as âncoras da busca) — grid de badges por categoria (governança, gerência de projetos, IoT, desenvolvimento conceitual, fiscal). Os itens de tecnologia migraram para a seção 5, sem duplicação. |
| 7 | `soft-skills.tsx` | `competencias-comportamentais` | `bg-background` | Grid com as competências comportamentais (`cvData.softSkills`). O card "Comunicação Estratégica e Oratória" exibe linha de evidência (campo opcional `evidence`, renderizada apenas quando presente) com ícone `Presentation` do lucide, em `text-muted-foreground` corpo menor. |
| 8 | `academic-background.tsx` | `formacao-academica` | `bg-muted` | **"Formação Acadêmica e Idiomas"** (retitulada na V1.8; `id` preservado) — graduação em andamento (`cvData.education`) + bloco de idiomas (`cvData.languages`: Inglês — Avançado, Português — Nativo) separado por `border-t`. |
| 9 | `academic-monitoring.tsx` | `monitorias-academicas` | `bg-background` | Lista das 5 monitorias acadêmicas consecutivas. |

### 4.3 Download do currículo em PDF
* **Artefato:** `public/curriculo-viccenzo-boff.pdf` (nome/rota centralizados em `src/lib/cv-pdf.ts` — `CV_PDF_FILENAME`/`CV_PDF_PATH`, consumidos pelos 2 botões, pelo script de geração e pelos testes). Gitignored: é artefato de build, regenerado a cada `pnpm build` — impossível publicar site e PDF dessincronizados.
* **Geração em build-time:** `scripts/generate-cv-pdf.tsx` (executado via `tsx`) renderiza `src/components/print/cv-print-document.tsx` para HTML estático com `renderToStaticMarkup` (CSS embutido) e gera o PDF no Chromium do Playwright (`page.pdf()`, A4 retrato, margens 14/16mm, sempre light mode). Nenhuma dependência nova de produção, zero impacto no bundle do client.
* **Template de impressão:** componente puro que consome exclusivamente `cvData`, nunca servido pela aplicação (preserva a SPA de rota única, dispensa `noindex`). Fonte system stack (`Arial/Helvetica/Liberation Sans` — `next/font` não está disponível fora do app). Compatível com ATS: coluna única, texto real selecionável, hierarquia por headings, contatos legíveis como texto **e** clicáveis.
* **Ordem do PDF (ordem de recrutador ≠ ordem da tela):** cabeçalho com contatos → resumo → resultados de impacto → experiência → projetos (URL do repositório visível como texto) → tecnologias → competências e metodologias → formação acadêmica (monitorias como subitem) → idiomas → competências comportamentais (com evidência).
* O eslint do template carrega um disable pontual de `@next/next/no-head-element` (documento HTML autônomo, fora do Next).

---

## 5. Camada de Dados
* Fonte única de verdade: `src/data/cv.ts` (objeto `cvData`), tipado por `src/types/cv.types.ts`.
* Todo o conteúdo textual do currículo é estático e tipado — nenhuma chamada de API ou CMS.
* Todos os campos de `CVData` (`contact`, `summary`, `impactMetrics`, `experiences`, `projects`, `education`, `languages`, `monitorias`, `technologies`, `technicalSkills`, `softSkills`) são renderizados por algum componente e pelo template de impressão do PDF — não há campos órfãos. Exceção deliberada: `Project.liveUrl` (guardado nos dados, não renderizado enquanto a demo exigir login) — o PDF e a tela exibem apenas o repositório.
* Tipos estritos novos da V1.8: `Language` (`name` + `level` como union literal `"Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo"`), `Project` (`id`, `name`, `description`, `stack[]`, `highlights[]`, `repoUrl`, `liveUrl?`), campo opcional `SoftSkill.evidence?: string` e `technologies: SkillGroup[]` (reutiliza a forma `{ category, skills[] }` da matriz).
* Na migração B5, a categoria "Bancos de Dados" da matriz foi absorvida **integralmente** pela seção Tecnologias — incluindo os itens conceituais "Modelagem relacional" e "Controle de concorrência" (princípio de nenhum item perdido); "Versionamento com Git" migrou como badge "Git" para Infra/Deploy/Ferramentas.

---

## 6. Design System

### 6.1 Tema
Light Mode como padrão (`defaultTheme="light"`), com Dark Mode disponível via alternância manual do usuário no `ModeToggle` (botão único, ícones `Sun`/`Moon`, sem dropdown, `aria-label` dinâmico + `aria-pressed`, `data-testid="mode-toggle"` para os testes). `enableSystem={false}` — decisão de produto deliberada de **não** seguir a preferência de tema do sistema operacional automaticamente, alinhada ao princípio de "Foco em Light Mode Corporativo" do `claude.md`; reavaliada com o usuário e mantida.

`ModeToggle` usa `useSyncExternalStore` (em vez do padrão `useState`+`useEffect`) para o guard de hidratação, porque a regra de lint `react-hooks/set-state-in-effect` (habilitada neste projeto) rejeita a segunda abordagem.

### 6.2 Paleta e Tokens
Paleta monocromática zinc, expressa via tokens semânticos do shadcn (`text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `bg-muted-foreground`) nos 7 componentes de negócio — nenhuma classe `zinc-*` hardcoded em `src/components/custom`. `src/app/globals.css` define os tokens `:root` (light) e `.dark` (dark) e o `@custom-variant dark`.

Para textos de corpo com leitura mais longa — resumo do Hero, linha empresa/local e highlights da timeline, descrição das soft skills, instituição na formação acadêmica — usa-se `text-foreground/80` em vez de `text-muted-foreground`, preservando um contraste mais alto (mais próximo do antigo `zinc-600`). Labels curtos, timestamps e categorias usam `text-muted-foreground`.

### 6.3 Regra de Contraste em Seções `bg-muted`
Título de seção (`h2`) sobre fundo `bg-muted` não pode usar `text-muted-foreground` (dá 4,39:1 em light, abaixo do mínimo de 4,5:1) — usa-se `text-foreground/70` (7,38:1 em light, 7,73:1 em dark) nesse caso específico. Aplica-se às 4 seções com fundo `bg-muted`: `metrics-dashboard.tsx`, `projects.tsx`, `skills-matrix.tsx` e `academic-background.tsx` (esta última também usa `text-foreground/70` na linha de status da graduação e nos níveis de idioma). Nas 5 seções com fundo `bg-background`, o h2 usa `text-muted-foreground` normalmente. Badges (Tecnologias, Matriz, stack de Projetos) usam sempre `bg-background` + `text-muted-foreground`, independentemente do fundo da seção — garante ≥4,5:1 nos dois temas.

### 6.4 Alinhamento do Hero
Todo o conteúdo do Hero — nome, cargo, badge de localização, resumo profissional (inclusive o texto do parágrafo, não apenas o bloco como grupo) e botões de contato — é centralizado (`text-center` / `justify-center`). Resolve o vazio desproporcional à direita que aparecia em telas largas (>1280px) com alinhamento à esquerda. Escopo deliberadamente restrito ao Hero; as demais 6 seções continuam com conteúdo alinhado à esquerda dentro do mesmo container `mx-auto max-w-5xl`.

---

## 7. Busca Global e Navegação Ancorada
* **Trigger:** botão no `SiteHeader` (`aria-label="Pesquisar no currículo"`, ícone de lupa, dica visual "Ctrl K" oculta em telas `sm-`) mais atalho de teclado global `Ctrl+K`/`Cmd+K` (listener em `document`, registrado por `SearchCommand`).
* **Overlay:** `CommandDialog` do shadcn/ui (`src/components/ui/command.tsx`, sobre `cmdk` + Radix `Dialog`) — Esc fecha, foco retorna ao trigger ao fechar, título/descrição acessíveis via `sr-only` (herdado do Radix Dialog).
* **Índice de busca:** `src/lib/search-index.ts` deriva os itens pesquisáveis diretamente de `cvData` (nenhum conteúdo duplicado) — um item por métrica de impacto, experiência, projeto, grupo de tecnologias, grupo de competências/metodologias, soft skill e monitoria, mais um item de perfil (Hero), um de formação acadêmica e um de idiomas; cada item carrega `sectionId` (a âncora), `title`, `subtitle` opcional e `keywords[]`. A filtragem usa o suporte nativo do `cmdk` a `keywords` no `CommandItem`, então a busca casa tanto pelo título quanto por texto auxiliar (ex.: buscar "React", "Docker" ou "Java" encontra o grupo em Tecnologias; "inglês" encontra Idiomas; "Birthday", "Gemini", "SDD" ou "PERT" encontram o projeto; "oratória", "palestra", "Duna" encontram o card de Comunicação via keywords da evidência).
* **Navegação fluida:** `src/lib/scroll-to-section.ts` fecha o overlay e chama `element.scrollIntoView({ behavior: "smooth", block: "start" })` (ou `"auto"` se `prefers-reduced-motion: reduce`), depois aplica a classe `.anchor-highlight` por 1,6s — keyframe `anchor-highlight-pulse` em `globals.css` (pulso sutil de `box-shadow`/fundo usando os tokens `--ring`/`--foreground`, desativado sob `prefers-reduced-motion: reduce`). `html` tem `scroll-behavior: smooth` (fallback `auto` no mesmo media query).
* **Nota de manutenção:** o `CommandDialog` em `command.tsx` precisa envolver `{children}` em `<Command>` (`<Command>{children}</Command>`). O código gerado pelo CLI do shadcn (`npx shadcn@latest add command dialog`) não faz isso por padrão — sem o wrapper, os subcomponentes do `cmdk` ficam sem o contexto/store interno e o clique no trigger quebra em runtime (`Cannot read properties of undefined (reading 'subscribe')`). Se o componente for regenerado via CLI, reaplicar esse ajuste.

---

## 8. Qualidade, Acessibilidade e Testes
* **Lighthouse (categoria Acessibilidade):** 100/100 em light e 100/100 em dark, auditado contra o build de produção (`pnpm build && pnpm start`) via `npx lighthouse --only-categories=accessibility` — revalidado na V1.8 (a auditoria dark é feita invertendo temporariamente o `defaultTheme` do provider e rebuildando, já que o Lighthouse não injeta `localStorage`). A primeira auditoria da V1.8 flagrou `label-content-name-mismatch` (WCAG 2.5.3) no CTA do projeto; corrigido fazendo o `aria-label` começar pelo texto visível ("Ver no GitHub — Birthday.ai").
* **Testes automatizados:** `@playwright/test` como devDependency; suíte em quatro arquivos — `tests/dark-mode.spec.ts` (tema padrão light, alternância para dark, persistência via `localStorage`, ausência de FOUC, zero erros de console; 3 testes), `tests/search-navigation.spec.ts` (abertura via botão/atalho, filtragem, navegação até a seção, fechamento via Esc, estado vazio; 3 testes), `tests/hero-contact.spec.ts` (menu de contato por e-mail do Hero: abertura com as 4 opções, URLs de Gmail com `su=` e Outlook com `subject=` em nova aba, item `mailto:` preservando `cvData.contact.emailSubject`, cópia para o clipboard com confirmação visível e anúncio `aria-live` — usa `context.grantPermissions(["clipboard-read", "clipboard-write"])`; mais o botão de WhatsApp: href `wa.me` com número e `text=` codificado via `buildWhatsAppChatUrl`, abertura em nova aba; 4 testes) e `tests/cv-download.spec.ts` (botão do Hero com `href`/`download` corretos, botão compacto do SiteHeader com `aria-label`, asset PDF respondendo 200 com `content-type: application/pdf` e magic bytes `%PDF-`; 3 testes) — 13 testes no total, executados em 2 projetos Playwright (Desktop Chrome 1280px e Mobile Chrome 375px via `devices["Pixel 7"]`), 26/26 passando. Config em `playwright.config.ts` (sobe o build de produção via `webServer`, porta 3100 — o build já exige a geração do PDF). Comando: `pnpm test:e2e`.

---

## 9. Fora de Escopo
* Backend dedicado com banco de dados relacional ativo — todo o conteúdo continua estático e tipado em `src/data/cv.ts`.
* Formulário de contato com persistência em banco — mantidos os links diretos de e-mail/WhatsApp/GitHub.
* WhatsApp Business API (envio de mensagens pelo próprio site) — o contato via WhatsApp usa apenas o link *click to chat* (`wa.me`), sem chave, conta Business ou backend.

---

## 10. Backlog / Próximas Atividades

Nenhuma atividade de produto especificada no momento. Pendências de validação e tarefas externas remanescentes da V1.8 (implementada sob carta branca do usuário — decisões em aberto resolvidas pelas recomendações da própria especificação):

* **Validação de conteúdo (B3):** os dados da palestra sobre Duna foram implementados conforme a proposta da especificação — semestre 2026/1, formato "palestra/workshop", audiência ~40 pessoas na Unoesc. Confirmar/ajustar no campo `evidence` de `cvData.softSkills` se algum dado estiver incorreto.
* **Validação de conteúdo (B2):** posicionamento implementado foi a **opção A** recomendada (bloco dentro de "Formação Acadêmica e Idiomas"); a opção B (badge no Hero) segue disponível como reforço de visibilidade, não excludente.
* **Validação de conteúdo (B5):** "Git" foi incluído nas badges de Infra/Deploy/Ferramentas (já existia em `cvData`); os itens conceituais "Modelagem relacional" e "Controle de concorrência" foram mantidos no grupo Bancos de Dados de Tecnologias para cumprir o princípio de nenhum item perdido — revisar rotulagem se desejar a seção 100% ferramentas. Rotulagem do grupo de IA ("Orquestração de LLM (Gemini 2.5 Flash)") também aberta a ajuste. MVC, APIs RESTful e Clean Code permaneceram como competências conceituais na Matriz.
* **README do Birthday.ai (B4, repositório externo):** garantir README apresentável em `github.com/viccenzo-boff/birthday.ai` (o que o sistema faz, arquitetura resumida, stack, screenshots — mitigam a demo atrás de login — e instruções de execução). Pré-requisito de qualidade do link "Ver no GitHub"; tarefa fora deste repositório.
* **Primeiro deploy (B1):** configurar/validar na Vercel que o script `vercel-build` (`playwright install chromium && pnpm build`) é usado como build command e o PDF entra no output. Risco conhecido e aceito: +30–60s de build.

---

## 11. Histórico de Versões

| Versão | Entrega | Commits |
|---|---|---|
| V1 → V1.1 | Dark Mode: `ThemeProvider`, `ModeToggle`, `SiteHeader`; migração de classes `zinc-*` hardcoded para tokens semânticos. | `01e65af`, `5001243` |
| V1.1 → V1.2 | Acessibilidade (Lighthouse 94→100), suíte Playwright inicial (dark mode), seções "Formação Acadêmica" e "Competências Comportamentais". | `08316a9`, `09e3754`, `ca0c3cd`, `4029ab1` |
| V1.2 → V1.3 | Busca global (`Ctrl+K`) e navegação ancorada: `id` estável + `scroll-mt-20` nas 7 seções, `SearchCommand`, `search-index.ts`, `scroll-to-section.ts`, testes `search-navigation.spec.ts`. | `c807e7a`, `241fcf1`, `703201f` |
| V1.3 → V1.4 | Hero centralizado (nome, cargo, resumo e botões de contato). | `7de8494` |
| V1.4 → V1.5 | Assunto automático no botão de e-mail do Hero: campo `emailSubject` em `ContactInfo`/`cvData.contact`, `href` do mailto com `?subject=` via `encodeURIComponent`, novo teste `tests/hero-contact.spec.ts`. | `8c9e949` |
| V1.5 → V1.6 | Menu de contato por e-mail no Hero: `DropdownMenu` do shadcn com 4 ações (Gmail, Outlook Web, `mailto:`, Copiar endereço com feedback `aria-live`), funções puras em `src/lib/email-links.ts`, componente `email-contact-menu.tsx`, testes do menu em `hero-contact.spec.ts` (clipboard via `grantPermissions`), Lighthouse Acessibilidade 100 revalidado em light e dark. Motivação: `mailto:` sozinho falha silenciosamente sem cliente de e-mail configurado; não há API para detectar o webmail do visitante, então as opções são oferecidas explicitamente. | `8c9e949` |
| V1.6 → V1.7 | Botão de telefone do Hero convertido em botão de WhatsApp: campo `whatsappMessage` em `ContactInfo`/`cvData.contact`, função pura `buildWhatsAppChatUrl` em `src/lib/whatsapp-link.ts` (link *click to chat* `wa.me`, sem API/chave), `WhatsAppIcon` SVG inline `currentColor` em `hero.tsx` (rótulo "WhatsApp", nova aba), novo teste em `hero-contact.spec.ts` (20/20 passando). Motivação: ligação telefônica é canal em desuso; o contato real acontece via WhatsApp. | `6e62b1b` |
| V1.7 → V1.8 | Backlog completo (B1–B5) em entrega coordenada. **B2 — Idiomas:** tipo `Language` (union literal de níveis), `cvData.languages`, seção retitulada "Formação Acadêmica e Idiomas" (opção A; `id` preservado), item no índice de busca. **B3 — Evidência de oratória:** campo opcional `SoftSkill.evidence`, card "Comunicação Estratégica e Oratória" com linha de evidência (ícone `Presentation`), keywords de busca. **B4 — Projetos:** tipo `Project`, seção `projetos` na posição 4 com card do Birthday.ai e CTA para o GitHub; ícones de marca extraídos para `brand-icons.tsx` (reuso Hero/Projetos). **B5 — Tecnologias:** `cvData.technologies` (4 grupos ATS-friendly), seção `tecnologias` na posição 5, Matriz retitulada "Competências e Metodologias" com migração sem perda nem duplicação — a inserção das duas seções em par adjacente preservou a alternância de fundos das seções seguintes (auditoria 6.3 sem ajustes). **B1 — PDF:** `cv-print-document.tsx` (template de impressão em ordem de recrutador, já incorporando B2–B5), `scripts/generate-cv-pdf.tsx` via `tsx` + Chromium do Playwright encadeado no `build`, constantes em `src/lib/cv-pdf.ts`, botões no Hero (4º) e SiteHeader (compacto), script `vercel-build`, artefato gitignored, `tests/cv-download.spec.ts`. Correção WCAG 2.5.3 (*Label in Name*) no `aria-label` do CTA de projeto, flagrada pelo Lighthouse. Qualidade: lint zero warnings, 26/26 testes, Lighthouse Acessibilidade 100/100 em light e dark. | _(pendente commit do usuário)_ |

Todos os commits acima estão locais em `main`; nenhum push foi realizado. Commits neste repositório são feitos exclusivamente pelo usuário (ver `claude.md`, seção 3) — Claude Code não executa `git commit`/`git push`.

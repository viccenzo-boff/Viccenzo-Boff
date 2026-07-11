# Arquitetura — Currículo Técnico Premium

> Fonte de verdade **viva** da arquitetura técnica. Estado: V2.1 (2026-07-10). Papel dos demais documentos: `CLAUDE.md` §1.

## 1. Stack

| Camada | Tecnologia | Notas |
| --- | --- | --- |
| Framework | Next.js 16.2.10 (App Router) + React 19.2.4 | SPA de rota única; sem backend, API ou banco |
| Linguagem | TypeScript 5.x estrito | `any` proibido (`CLAUDE.md` §3) |
| Estilização | Tailwind CSS v4 | **Sem** `tailwind.config.js` — tokens em `src/app/globals.css` (`:root`/`.dark` + `@custom-variant dark`) |
| UI | shadcn/ui (baseColor `zinc`, estilo `radix-vega`) | Componentes locais em `src/components/ui`, instalados via CLI |
| Tema | next-themes | Classe `dark` no `<html>`, persistida em `localStorage` (§5.1) |
| Busca | cmdk + Radix `Dialog` | §6 |
| Animação | motion 12.x (sucessor do framer-motion) | Usada exclusivamente na Scroll Progress Line (§5.5): `useScroll`/`useSpring`/`motion.path` |
| Ícones | lucide-react + SVGs de marca próprios | GitHub/WhatsApp em `brand-icons.tsx` (lucide não tem ícones de marca) |
| Fonte | Inter via `next/font/google` | Variável `--font-sans` |
| Pacotes | pnpm | Build do `esbuild` (dep. do `tsx`) aprovado em `pnpm-workspace.yaml` (`allowBuilds`) |
| Scripts | tsx (devDependency) | Executa os scripts TypeScript/JSX de `scripts/` |
| Testes | @playwright/test | E2E (§8.2); o Chromium do Playwright também gera o PDF localmente (§7.2) |
| Deploy | Vercel — projeto `viccenzo-boff`, integração Git | Sem build command custom (preset Next.js); push na `main` dispara o deploy; custo zero |

Globais: `lang="pt-BR"` e `suppressHydrationWarning` no `<html>` (tema aplicado via script antes da hidratação); favicon dinâmico em `src/app/icon.tsx` (`ImageResponse` 32×32 com emoji 💻, via `next/og`).

## 2. Estrutura de Pastas

```text
├── CLAUDE.md                        # Regras de comportamento do Claude Code
├── README.md                        # Vitrine para recrutadores: screenshots, destaques, stack e instruções de desenvolvimento
├── .claudecode/                     # Documentação de contexto (prd.md, architecture.md, cv_base.md)
├── docs/
│   └── screenshots/                 # Screenshots do README, gerados por scripts/readme-screenshots.ts
├── public/
│   └── curriculo-viccenzo-boff.pdf  # PDF versionado no git, gerado localmente (§7)
├── scripts/
│   ├── cv-print-html.tsx            # Helper compartilhado: render do HTML de impressão + SHA-256 + validador do manifesto
│   ├── generate-cv-pdf.tsx          # Gera o PDF (Chromium do Playwright) + manifesto
│   ├── verify-cv-pdf.tsx            # Guarda de sincronização (sem Chromium) — encadeada no build
│   ├── readme-screenshots.ts        # Screenshots do README (`pnpm generate:readme-screenshots`, requer site em pnpm start)
│   └── cv-pdf.manifest.json         # Hash SHA-256 do HTML de impressão da última geração
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Layout raiz: metadados, fonte Inter, ThemeProvider, SiteHeader
│   │   ├── page.tsx                 # Composição das 9 seções (§3.2)
│   │   ├── providers.tsx            # ThemeProvider (client component sobre next-themes)
│   │   ├── globals.css              # Tokens de design, @custom-variant dark, keyframe anchor-highlight
│   │   └── icon.tsx                 # Favicon dinâmico (ImageResponse)
│   ├── components/
│   │   ├── ui/                      # shadcn/ui via CLI: badge, button, card, command, dialog, dropdown-menu, input, input-group, separator, textarea
│   │   ├── custom/                  # Componentes de negócio: 9 seções + site-header, search-command, mode-toggle, email-contact-menu, brand-icons, animated-scroll-line
│   │   └── print/
│   │       └── cv-print-document.tsx # Template de impressão do PDF (§7.4)
│   ├── data/
│   │   └── cv.ts                    # cvData — fonte única de todo o conteúdo (§4)
│   ├── types/
│   │   └── cv.types.ts              # Tipos do currículo (CVData e derivados)
│   └── lib/
│       ├── cv-pdf.ts                # CV_PDF_FILENAME / CV_PDF_PATH (nome/rota do artefato)
│       ├── email-links.ts           # URLs Gmail/Outlook/mailto (funções puras)
│       ├── whatsapp-link.ts         # buildWhatsAppChatUrl (link click to chat)
│       ├── search-index.ts          # Índice da busca derivado de cvData (§6)
│       ├── scroll-to-section.ts     # Scroll ancorado + highlight (§6)
│       └── utils.ts                 # cn() do shadcn
├── tests/                           # Suíte Playwright (§8.2)
├── playwright.config.ts             # webServer: build de produção na porta 3100
└── pnpm-workspace.yaml              # allowBuilds (esbuild para o tsx)
```

## 3. Composição da Página

### 3.1 Layout global

`src/app/layout.tsx` envolve tudo com `ThemeProvider` (`providers.tsx`) e renderiza `SiteHeader` (`site-header.tsx`) — barra **sticky** global, fora do fluxo de `page.tsx`: `SearchCommand` à esquerda; à direita, botão compacto de download do CV (ícone `Download`, `aria-label="Baixar currículo em PDF"`, `data-testid="cv-download-header"`, `<a download>` estático) + `ModeToggle`, em `justify-between`. O header vive fora de `page.tsx` de propósito: o SPA não tem nav fixo e o download precisa permanecer acessível durante o scroll das 9 seções.

### 3.2 Seções

`src/app/page.tsx` compõe 9 seções, nesta ordem, cada uma um componente isolado em `src/components/custom/`, com `id` HTML estável (âncoras da busca, §6) e `scroll-mt-20` (compensa o header sticky). Fundos alternam `bg-background`/`bg-muted` — regra de contraste em §5.3. Todo bloco de conteúdo assenta sobre fundo opaco — `Card` com `bg-background` (padrão do Painel de Impacto) ou item com `bg-background` (monitorias) — para a Scroll Progress Line passar por trás dos blocos e nunca pelo meio do texto (§5.5). Além das seções, `page.tsx` renderiza a linha como irmã do `<main>` (§5.5).

| # | Componente | `id` | Fundo | Conteúdo |
| --- | --- | --- | --- | --- |
| 1 | `hero.tsx` | `inicio` | `background` | Nome, cargo alvo, localização, resumo profissional e 4 botões de contato (§3.3). Única seção centralizada (§5.4) |
| 2 | `metrics-dashboard.tsx` | `painel-de-impacto` | `muted` | 3 cards de métricas de impacto (+600 atendimentos, +150 cartões de melhoria, <5% retrabalho) |
| 3 | `experience-timeline.tsx` | `experiencia-profissional` | `background` | Timeline vertical: Dotse, IXC Soft, Dona Loca, com highlights |
| 4 | `projects.tsx` | `projetos` | `muted` | Card do Birthday.ai (`cvData.projects`): descrição, stack em badges, 4 highlights, CTA "Ver no GitHub" (nova aba; `aria-label` inicia pelo texto visível — WCAG 2.5.3 *Label in Name*). `liveUrl` **não** renderizada (decisão de produto — PRD §6) |
| 5 | `technologies.tsx` | `tecnologias` | `background` | 4 grupos de badges hard-tech/ATS: Linguagens e Frameworks, Bancos de Dados, Infra/Deploy/Ferramentas, Integrações com IA |
| 6 | `skills-matrix.tsx` | `matriz-de-competencias` | `muted` | "Competências e Metodologias" — badges por categoria (governança, gerência de projetos, IoT, desenvolvimento conceitual, fiscal). `id` histórico preservado para as âncoras |
| 7 | `soft-skills.tsx` | `competencias-comportamentais` | `background` | Competências comportamentais; o card de Comunicação exibe a linha `evidence` opcional (ícone `Presentation`, `text-muted-foreground`) |
| 8 | `academic-background.tsx` | `formacao-academica` | `muted` | "Formação Acadêmica e Idiomas" — graduação em andamento + bloco de idiomas separado por `border-t`. `id` histórico preservado |
| 9 | `academic-monitoring.tsx` | `monitorias-academicas` | `background` | 5 monitorias acadêmicas consecutivas |

### 3.3 Hero — canais de contato

* **E-mail:** trigger de menu (`email-contact-menu.tsx`, client component sobre `DropdownMenu` do shadcn) com 4 ações — Abrir no Gmail, Abrir no Outlook Web (nova aba, `rel="noopener noreferrer"`), Abrir no app padrão (`mailto:`), Copiar endereço (`navigator.clipboard.writeText` com confirmação temporária no item — menu mantido aberto via `preventDefault` no `onSelect` — anunciada por `aria-live`/`role="status"`, `data-testid="email-copy-feedback"`). Todas preservam o assunto automático `cvData.contact.emailSubject`; URLs montadas pelas funções puras de `src/lib/email-links.ts` (Gmail usa `su=`, Outlook usa `subject=`, ambos com `encodeURIComponent`).
* **WhatsApp:** link oficial *click to chat* (`https://wa.me/<DDI+número>?text=<mensagem>`, sem API/chave), montado por `buildWhatsAppChatUrl` (`src/lib/whatsapp-link.ts`) a partir de `contact.phone` (normalizado para dígitos + DDI 55) e `contact.whatsappMessage`. Nova aba com `rel="noopener noreferrer"`, rótulo visível "WhatsApp" + `aria-label="Conversar no WhatsApp"`, ícone SVG inline `fill="currentColor"` (adapta-se a light/dark).
* **GitHub:** link direto; ícone em `brand-icons.tsx` (compartilhado com a seção Projetos).
* **Baixar CV (PDF):** 4º botão, `<a href download>` estático para o asset de `public/` — sem JavaScript.

## 4. Camada de Dados

* Fonte única de verdade: `src/data/cv.ts` (objeto `cvData`), tipado por `src/types/cv.types.ts`. Conteúdo 100% estático e tipado — nenhuma chamada de API ou CMS. Texto-fonte original em `.claudecode/cv_base.md`.
* Todos os campos de `CVData` (`contact`, `summary`, `impactMetrics`, `experiences`, `projects`, `education`, `languages`, `monitorias`, `technologies`, `technicalSkills`, `softSkills`) são renderizados na tela **e** no template do PDF — sem campos órfãos. Exceção deliberada: `Project.liveUrl` (guardado nos dados, não renderizado — PRD §6).
* Tipos relevantes: `Language` (`name` + `level` como union literal `"Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo"`); `Project` (`id`, `name`, `description`, `stack[]`, `highlights[]`, `repoUrl`, `liveUrl?`); `SoftSkill.evidence?: string` (renderizada só quando presente); `technologies: SkillGroup[]` (mesma forma `{ category, skills[] }` da matriz).

## 5. Design System

### 5.1 Tema

Light Mode padrão (`defaultTheme="light"`), Dark Mode via alternância manual no `ModeToggle` (botão único, ícones `Sun`/`Moon`, `aria-label` dinâmico + `aria-pressed`, `data-testid="mode-toggle"`). `enableSystem={false}` — decisão de produto (PRD §6). O `ModeToggle` usa `useSyncExternalStore` para o guard de hidratação (§9).

### 5.2 Tokens e tipografia

Paleta monocromática zinc expressa via tokens semânticos do shadcn — **nenhuma** classe `zinc-*` hardcoded em `src/components/custom`. Tokens definidos em `globals.css` (`:root` light, `.dark` dark). Textos de corpo com leitura longa (resumo do Hero, highlights da timeline, descrição das soft skills, instituição na formação) usam `text-foreground/80` (contraste mais alto); labels curtos, timestamps e categorias usam `text-muted-foreground`.

### 5.3 Contraste em seções `bg-muted`

Título `h2` sobre `bg-muted` **não pode** usar `text-muted-foreground` (4,39:1 em light — abaixo de 4,5:1); usa `text-foreground/70` (7,38:1 light / 7,73:1 dark). Vale para as 4 seções `bg-muted` (`metrics-dashboard`, `projects`, `skills-matrix`, `academic-background`). Nas 5 seções `bg-background`, o `h2` usa `text-muted-foreground` normalmente. A linha de status da graduação e os níveis de idioma mantêm `text-foreground/70` (hoje sobre card `bg-background` — contraste ainda maior). Badges usam sempre `bg-background` + `text-muted-foreground`, independentemente do fundo — garante ≥4,5:1 nos dois temas.

### 5.4 Alinhamento do Hero

Todo o conteúdo do Hero é centralizado (`text-center`/`justify-center`) — resolve o vazio à direita em telas >1280px. Escopo restrito ao Hero: as demais 8 seções ficam alinhadas à esquerda dentro do mesmo container `mx-auto max-w-5xl`.

### 5.5 Scroll Progress Line (`animated-scroll-line.tsx`)

Linha decorativa em SVG que nasce **fora da borda esquerda da tela**, no vão entre o título do Painel de Impacto e o primeiro card, desce o documento ancorada às seções reais do DOM (nunca cruzando o texto de um título) e é "desenhada" progressivamente na altura em que o usuário está conforme o scroll — a página carrega sem nenhum traço visível (client component; único consumidor da lib motion).

* **Pilha visual (sanduíche de z-index):** overlay `absolute inset-0` + `z-0` + `pointer-events-none` + `overflow-hidden` + `aria-hidden="true"`, ancorado no `<body className="relative">` e montado como irmão do `<main>`. A linha fica **acima dos fundos sólidos** das seções (elementos não-posicionados) e **atrás do texto**: o wrapper interno (`mx-auto max-w-5xl…`) de cada uma das 9 seções carrega `relative z-10`. Header sticky e overlays (`z-50`) ficam acima de tudo. **Invariante para seções novas:** fundo na `<section>` (não-posicionada) + conteúdo no wrapper `relative z-10` + blocos de texto sobre fundo opaco (`Card`/`bg-background`) — sem isso, o fundo esconde a linha, a linha cobre o texto ou vaza pelos vãos das letras e por elementos só com borda (§9).
* **Geometria (ancorada ao DOM):** o path é gerado em pixels reais do documento; o `ResizeObserver` do container (que cobre o documento inteiro) detecta qualquer reflow — viewport, fontes, conteúdo — e dispara a remedição das âncoras. Cada `main section` com `<h2>` fornece duas âncoras: a faixa vertical do título (retângulo do **texto** via `Range` — o bloco `h2` ocupa a largura toda e não serve) e o centro vertical do conteúdo. O início sai fora da borda esquerda (−16px esconde o linecap redondo) com tangente horizontal, no meio do vão entre o título da primeira seção e o primeiro card. Em cada seção seguinte, um **portão** prende a linha no trilho direito (`max(90% da largura, texto de título mais largo + 26px)`, limitado à borda) exatamente na faixa vertical do título, seguido de um **mergulho** ao centro do conteúdo — profundo à esquerda (7% da largura) em seções alternadas, suave ao meio (50%) nas demais (≈ mesmo ritmo de travessias do desenho original) — e a saída cruza o rodapé. Tangentes verticais com pontos de controle a meio vão tornam a curva G1-contínua (sem quinas) e **monotônica em y**: cada faixa de título é cruzada uma única vez, sempre presa no trilho — a linha não passa por cima de texto de título em nenhum viewport. O `viewBox` casa 1:1 com o tamanho medido (escala uniforme: espessura constante e normalização do `pathLength` preservada); o SVG só renderiza após a primeira medição (no SSR sai apenas o container vazio).
* **Animação (perseguição da ponta):** o scroll não alimenta o `pathLength` diretamente — comprimento não é proporcional à altura (varreduras horizontais consomem comprimento sem descer), e springs sobre a fração dão "arranques" a cada tick de scroll quando convergidos, com a ponta presa na base da tela. Em vez disso, a ponta vive em px do documento e **persegue uma âncora a ~45% do viewport** (deslizando até a base no fim da página, para o desenho terminar no rodapé) por aproximação proporcional com **velocidade limitada (~120px/s)** em `useAnimationFrame` — descida lenta, contínua e visível, calibrada com o usuário em quatro rodadas, sem overshoot (a linha nunca "desdesenha"); o teste e2e acompanha esse timing. Um mapa amostrado **y → fração do comprimento** (bem definido pela monotonia em y) converte a ponta na fração a desenhar; a ponta nasce presa no início do path, então a página carrega sem traço visível. A fração alimenta `pathLength` em dois `motion.path` — camada de glow (traço largo, `blur` + keyframe `scroll-line-pulse` de opacidade em `globals.css`) e linha principal fina por cima. Um fade via `useTransform` (opacity 0→1 no primeiro 1% do draw) esconde o ponto que o `strokeLinecap` redondo deixaria no início do path em repouso — no glow, o fade vive num `<g>` externo para não disputar a `opacity` com a animação CSS do pulse.
* **Cores:** gradiente vertical roxo→azul→vermelho via tokens dedicados `--scroll-line-from/via/to` + `--scroll-line-opacity` em `globals.css` (variantes light/dark) — exceção cromática deliberada à paleta monocromática (PRD §6).
* **Reduced motion:** guard com `useSyncExternalStore` sobre `matchMedia` (mesmo idioma do `mode-toggle`, §9) troca a perseguição pela posição-alvo direta — o desenho segue o scroll 1:1, sem inércia (progresso acionado pelo usuário, não animação autônoma); o pulse do glow é desativado na media query de `globals.css`. **Não** renderizar linha estática completa nesse modo: usuários com animações desativadas no SO veriam a linha inteira "fixa" — foi exatamente o comportamento rejeitado na revisão da V2.1.

## 6. Busca Global (Ctrl+K) e Navegação Ancorada

* **Trigger:** botão no `SiteHeader` (`aria-label="Pesquisar no currículo"`, ícone de lupa, dica "Ctrl K" oculta em telas `sm-`) + atalho global `Ctrl+K`/`Cmd+K` (listener em `document`, registrado por `SearchCommand`).
* **Overlay:** `CommandDialog` do shadcn (`src/components/ui/command.tsx`, sobre cmdk + Radix `Dialog`) — Esc fecha, foco retorna ao trigger, título/descrição acessíveis via `sr-only`. Atenção à armadilha do wrapper `<Command>` (§9).
* **Índice:** `src/lib/search-index.ts` deriva os itens diretamente de `cvData` (zero conteúdo duplicado) — um item por métrica, experiência, projeto, grupo de tecnologias, grupo de competências, soft skill e monitoria, mais perfil, formação e idiomas. Cada item: `sectionId`, `title`, `subtitle?`, `keywords[]`. A filtragem usa o suporte nativo do cmdk a `keywords` (ex.: "React", "inglês", "Gemini", "oratória" encontram as respectivas seções).
* **Navegação:** `src/lib/scroll-to-section.ts` fecha o overlay, chama `scrollIntoView({ behavior: "smooth" })` (ou `"auto"` sob `prefers-reduced-motion: reduce`) e aplica `.anchor-highlight` por 1,6s (keyframe em `globals.css` com tokens `--ring`/`--foreground`, desativado sob reduced motion). `html` tem `scroll-behavior: smooth` com o mesmo fallback.

## 7. Pipeline do PDF do Currículo

* **Artefato:** `public/curriculo-viccenzo-boff.pdf`, **versionado no git**. Nome/rota centralizados em `src/lib/cv-pdf.ts` (`CV_PDF_FILENAME`/`CV_PDF_PATH`), consumidos pelos 2 botões de download, pelos scripts e pelos testes.
* **Geração local (`pnpm generate:cv-pdf`):** `scripts/generate-cv-pdf.tsx` (via `tsx`) renderiza `cv-print-document.tsx` para HTML estático com `renderToStaticMarkup` (CSS embutido; render + hash no helper compartilhado `scripts/cv-print-html.tsx`) e imprime no Chromium do Playwright (`page.pdf()`, A4 retrato, margens 14/16mm, sempre light mode). Grava `scripts/cv-pdf.manifest.json` com o SHA-256 do HTML. Zero dependências de produção novas, zero impacto no bundle do client.
* **Guarda de sincronização:** `pnpm build` = `verify:cv-pdf && next build`. `scripts/verify-cv-pdf.tsx` recalcula o hash do HTML atual (puro Node/React, **sem Chromium** — roda também na Vercel) e falha com mensagem instrutiva ("rode `pnpm generate:cv-pdf`") se PDF/manifesto estiverem ausentes, inválidos ou dessincronizados. O binário do PDF **não** é comparado (não determinístico entre versões do Chromium) — o hash do HTML é o proxy de conteúdo (cobre `cvData` + template, o risco real). Invariante preservada: impossível publicar site e PDF dessincronizados.
* **Por que não gerar na Vercel:** a imagem de build (Amazon Linux) não executa o Chromium do Playwright — `playwright install chromium` baixa um fallback de Ubuntu cujas libs de sistema (`libnspr4.so`) não existem. Provado no deploy `dpl_AdGf4qFGpnuyaByzyHxCbzZRdBsx`.
* **Template de impressão (`src/components/print/cv-print-document.tsx`):** componente puro que consome exclusivamente `cvData`; nunca servido pela aplicação (preserva a SPA de rota única, dispensa `noindex`). Fonte system stack (`Arial/Helvetica/Liberation Sans` — `next/font` indisponível fora do app). Compatível com ATS: coluna única, texto real selecionável, hierarquia por headings, contatos legíveis como texto **e** clicáveis. Ordem de recrutador (≠ ordem da tela): contatos → resumo → impacto → experiência → projetos (URL do repositório como texto) → tecnologias → competências e metodologias → formação (monitorias como subitem) → idiomas → comportamentais (com evidência).

## 8. Qualidade e Testes

### 8.1 Lighthouse (Acessibilidade)

100/100 em light **e** dark, auditado contra o build de produção (`pnpm build && pnpm start` + `npx lighthouse --only-categories=accessibility`). Para auditar dark: inverter temporariamente o `defaultTheme` do provider e rebuildar (o Lighthouse não injeta `localStorage`).

### 8.2 Suíte Playwright (`pnpm test:e2e`)

| Arquivo | Cobre | Testes |
| --- | --- | --- |
| `tests/dark-mode.spec.ts` | Tema padrão light, alternância, persistência em `localStorage`, ausência de FOUC, zero erros de console | 3 |
| `tests/search-navigation.spec.ts` | Abertura via botão/atalho, filtragem, navegação até a seção, Esc, estado vazio | 3 |
| `tests/hero-contact.spec.ts` | Menu de e-mail (4 opções, URLs Gmail `su=`/Outlook `subject=`, `mailto:` com assunto, clipboard via `grantPermissions`) + WhatsApp (`wa.me` com `text=` codificado, nova aba) | 4 |
| `tests/cv-download.spec.ts` | Botões de download (Hero e header), asset 200 + `content-type: application/pdf` + magic bytes `%PDF-` | 3 |
| `tests/scroll-line.spec.ts` | Scroll Progress Line: overlay decorativo (`aria-hidden`, `pointer-events: none`, `position: absolute`) e draw progressivo do path com o scroll (`stroke-dasharray` >0,5 no fim da página, poll de 60s — a descida da ponta é deliberadamente lenta, ~120px/s, §5.5) | 1 |

14 testes × 2 projetos (Desktop Chrome 1280px e Mobile Chrome 375px via `devices["Pixel 7"]`) = **28**. `playwright.config.ts` sobe o build de produção via `webServer` na porta 3100 — o build já exercita a guarda do PDF.

## 9. Armadilhas Conhecidas (manutenção)

| Onde | Armadilha |
| --- | --- |
| `src/components/ui/command.tsx` | O `CommandDialog` **precisa** envolver `{children}` em `<Command>`. O código do CLI do shadcn não faz isso — sem o wrapper, o clique no trigger quebra em runtime (`Cannot read properties of undefined (reading 'subscribe')`). Reaplicar se o componente for regenerado. |
| `mode-toggle.tsx` | Guard de hidratação com `useSyncExternalStore` — a regra `react-hooks/set-state-in-effect` (ativa no projeto) rejeita o padrão `useState`+`useEffect`. |
| Build da Vercel | **Nunca** gerar o PDF lá (§7). O projeto usa o preset Next.js sem build command custom — não reintroduzir script `vercel-build`. |
| `scripts/cv-pdf.manifest.json` | O validador tolera BOM (editores no Windows podem reintroduzi-lo). |
| `cv-print-document.tsx` | Carrega disable pontual de `@next/next/no-head-element` (documento HTML autônomo, fora do Next). |
| `pnpm-workspace.yaml` | Build do `esbuild` (dependência do `tsx`) aprovado em `allowBuilds` — não remover. |
| `layout.tsx` | `suppressHydrationWarning` no `<html>` é necessário (tema aplicado via script pré-hidratação). |
| `search-command.tsx` | `SECTION_ORDER` é a lista **manual** de seções renderizadas no overlay — ao criar uma seção nova, incluir o `id` dela aqui, senão os itens existem no índice mas nunca aparecem na busca (bug que ocultou Projetos e Tecnologias na V1.8). |
| `animated-scroll-line.tsx` | **Não** usar `vector-effect="non-scaling-stroke"` junto com draw de `pathLength`: no Chromium o `stroke-dasharray` passa a ser medido em px de tela ao longo do path transformado e ignora a normalização do `pathLength` — a linha vira centenas de tracinhos repetidos. |
| `src/components/ui/button.tsx` | O variant `outline` foi editado: os `dark:bg-input/30`/`dark:hover:bg-input/50` originais do shadcn são **translúcidos** e deixavam a Scroll Progress Line vazar por dentro dos botões do Hero no dark. Substituídos por `color-mix` opaco de mesma cor renderizada. Reaplicar se o componente for regenerado via CLI. |
| Seções novas em `page.tsx` | Respeitar o sanduíche de z-index da Scroll Progress Line (§5.5): fundo na `<section>` não-posicionada, conteúdo no wrapper `relative z-10` e **blocos de texto sobre fundo opaco** (elementos só com borda deixam a linha vazar por dentro — bug original das monitorias). A geometria da linha ancora em `main section` com `<h2>` seguido do bloco de conteúdo (`nextElementSibling`) — manter essa estrutura, senão a seção fica invisível para a linha (sem portão/mergulho). Também incluir o `id` no `SECTION_ORDER` (linha acima). |

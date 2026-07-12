# PRD — Currículo Técnico Premium

> Documento de **produto**: visão, requisitos, decisões e status. A arquitetura técnica vive em `architecture.md`; as regras de trabalho no `CLAUDE.md` (§1 tem o mapa completo).

## 1. Visão e Público

Portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, focado em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site transparece rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

## 2. Objetivos Estratégicos

* **Conversão:** reter a atenção do recrutador nos primeiros 10 segundos com proposta de valor clara e visual minimalista impecável.
* **Autoridade:** demonstrar proficiência técnica pela própria engenharia, velocidade e estrutura do site.
* **Diferenciação:** o **Painel de Impacto** (dashboard de métricas) substitui a ideia de "jogos", provando capacidade analítica e foco em qualidade.

## 3. Status Atual

**Scroll Progress Line encerrada e em produção**: V2.3 (pontas G2) + V2.5 (vínculo 1:1, `data-line-version="v2.5-1to1"`) foram commitadas e refinadas pelo próprio usuário (`a7fa03f`→`d7ddb42`, testadas em produção — "vou deixar assim por enquanto"), seguidas do reposicionamento vertical do Hero (`b5886a1`). Post-mortem técnico das versões com física: `docs/scroll-line-postmortem.md`. **No working tree aguardando revisão e commit: V2.6 — camadas de profundidade do Hero** (mecânica em `architecture.md` §5.6; decisões a confirmar em §8). Próximo ciclo aprovado: **roadmap de estilização por seção (T0–T8, §8)** — o usuário dispara uma tarefa por vez.

## 4. Requisitos Funcionais

| # | Requisito |
| --- | --- |
| RF1 | **Conteúdo em 9 seções**, nesta ordem: Hero, Painel de Impacto, Experiência Profissional, Projetos (Birthday.ai), Tecnologias (ATS), Competências e Metodologias, Competências Comportamentais, Formação Acadêmica e Idiomas, Monitorias Acadêmicas. Mapa técnico: `architecture.md` §3.2. |
| RF2 | **Contato multicanal no Hero:** e-mail (menu com 4 ações e assunto automático), WhatsApp (*click to chat* com mensagem padrão), GitHub e download do CV. Download também disponível no header sticky durante todo o scroll. Detalhes: `architecture.md` §3.3. |
| RF3 | **Busca global** (`Ctrl+K`/`Cmd+K` + botão no header) cobrindo todo o conteúdo de `cvData`, com navegação ancorada suave, highlight da seção-destino e respeito a `prefers-reduced-motion`. |
| RF4 | **Tema:** light como padrão, dark disponível por alternância manual persistida. |
| RF5 | **PDF do currículo** ATS-friendly, com conteúdo sempre idêntico ao site (guarda de sincronização no build) e acessível por link estático, sem JavaScript. |
| RF6 | **Scroll Progress Line:** linha decorativa em SVG (gradiente roxo→azul→vermelho, glow com pulse) que nasce da borda esquerda da tela — no vão entre o título do Painel de Impacto e o primeiro card —, desce o documento ancorada às seções reais **atrás do texto**, sem nunca cruzar o texto de um título, e é desenhada progressivamente com a ponta perseguindo uma âncora a ~45% do viewport em velocidade limitada — desce de forma lenta, contínua e visível enquanto o usuário rola — e a página carrega sem traço visível. Overlay não interativo, visível em light e dark; sob `prefers-reduced-motion` o desenho segue o scroll 1:1, sem spring nem pulse. Detalhes técnicos: `architecture.md` §5.5. |

## 5. Requisitos Não-Funcionais

* **Acessibilidade:** Lighthouse Acessibilidade 100/100 em light e dark (baseline permanente); contrastes ≥4,5:1; WCAG 2.5.3 (*Label in Name*) nos CTAs.
* **Mobile first:** validado em 375px e 1280px pela suíte e2e.
* **Performance e custo:** site estático/serverless na Vercel, zero scripts externos, custo zero de infraestrutura.
* **Qualidade de engenharia:** TypeScript estrito, lint zero warnings, 28 testes e2e passando (Definição de Pronto: `CLAUDE.md` §5).

## 6. Decisões de Produto (registro permanente)

| Decisão | Racional |
| --- | --- |
| `enableSystem={false}` — não seguir o tema do SO | Light corporativo como padrão deliberado; reavaliada com o usuário e mantida. |
| Menu de e-mail com 4 opções explícitas | `mailto:` sozinho falha silenciosamente sem cliente configurado; não há como detectar o webmail do visitante. |
| WhatsApp no lugar de telefone | Ligação é canal em desuso; o contato real acontece via WhatsApp. Link `wa.me` sem API/chave/backend. |
| `liveUrl` do Birthday.ai não renderizada | A demo exige login — beco sem saída para recrutador; só o repositório é exibido (o campo permanece nos dados). |
| PDF versionado no git, não gerado no build | A imagem de build da Vercel não executa o Chromium do Playwright; a guarda de hash preserva a invariante "site e PDF nunca dessincronizados" (`architecture.md` §7). |
| Hero é a única seção centralizada | Resolve o vazio em telas largas; as demais seções permanecem alinhadas à esquerda. |
| Seção Tecnologias 100% hard-tech | Otimização para ATS; metodologias (SDD/PERT) ficam na Matriz e no card do projeto. |
| Itens conceituais permanecem em Bancos de Dados | "Modelagem relacional" e "Controle de concorrência" são competências reais e keywords de ATS; validado pelo usuário (fecha B5, incl. rótulo "Orquestração de LLM (Gemini 2.5 Flash)"). |
| Sem badge de idiomas no Hero | Preserva o Hero minimalista; idiomas vivem na seção "Formação Acadêmica e Idiomas" (fecha B2). |
| Ordem do PDF ≠ ordem da tela | O PDF segue ordem de recrutador (contatos → resumo → impacto → experiência → …). |
| Scroll Progress Line em fluxo do documento, **atrás do texto** e acima dos fundos | Direção dada pelo usuário na revisão da V2.1 (overlay fixo na viewport e sobre o texto foi rejeitado). Como as seções pintam fundos sólidos, a linha vive num sanduíche de z-index — fundo da seção → linha `z-0` → conteúdo `relative z-10` — percorrendo a página inteira e desenhada na altura do scroll. Mecanismo e invariante para seções novas: `architecture.md` §5.5. |
| Gradiente roxo→azul→vermelho na Scroll Progress Line | Única exceção deliberada à paleta monocromática zinc, pedida pelo usuário como assinatura visual. Expressa em tokens dedicados `--scroll-line-*` (light/dark) em `globals.css`; todo o restante do site permanece monocromático. |
| Todo bloco de conteúdo em fundo opaco (cards) | Revisão da V2.1 (feedback do usuário): mesmo atrás do texto, a linha vazava pelos vãos das letras e através de cartões só com borda (monitorias). Experiência, tecnologias, competências, comportamentais e formação ganharam `Card`s no padrão do Painel de Impacto; monitorias ganharam `bg-background`. A linha passa atrás dos blocos e só aparece nos vãos entre eles. |
| Scroll Progress Line ancorada ao DOM, com trilho direito nos títulos | Revisão da V2.2 (feedback do usuário com capturas): os nós em frações fixas do documento caíam em cima de títulos — em posições diferentes no mobile e no desktop — e o início "brotava" no meio da tela. Medição real confirmou invasão de até 13 títulos somando os 4 viewports e que só descer o início não resolveria. Agora as âncoras são medidas do DOM: a linha nasce fora da borda esquerda e passa cada faixa de título presa a um trilho à direita do texto (curva monotônica em y ⇒ impossível cruzar título), com verificação geométrica automatizada em 375/768/1280/1920px. |
| Scroll Progress Line com vínculo 1:1 — **sem física de perseguição** | Especificação final do usuário (2026-07-12): "se eu descer X% da tela, a linha deve preencher exatamente X% do caminho" — resolve a ambiguidade "caminhada A→B" vs. "linear atrelada ao scroll" que atravessou as V2.1–V2.4. A fração desenhada é função pura e determinística do scroll (linearizada pelo mapa y→fração para a ponta ficar na altura do usuário — o "X% do comprimento" literal faria a ponta fugir da tela, pois a tortuosidade varia por seção). Quatro versões com física (spring, perseguição limitada, exponencial, mola crítica) falharam pela mesma razão estrutural: qualquer dinâmica entre scroll e desenho ou atrasa (teleporte do traço inteiro) ou dispara (dardo por tick) — post-mortem completo em `docs/scroll-line-postmortem.md`. Não reintroduzir suavização (armadilha registrada em `architecture.md` §9). |
| Hero com camadas de profundidade reutilizando a assinatura | Pedido do usuário (2026-07-12): o minimalismo do Hero estava "simples até demais" para o primeiro impacto; solicitou sombreamento nas letras, movimento leve e complexidade visual sem quebrar a estética. Solução: auroras/sheen/separador usam **exclusivamente** os tokens `--scroll-line-*` já existentes — a assinatura cromática nasce difusa no Hero e se materializa como linha a partir do Painel de Impacto; nenhuma cor nova entra na paleta. Tudo CSS puro (server component preservado, zero JS), reduced-motion respeitado por construção (`architecture.md` §5.6). |

## 7. Fora de Escopo

* Backend dedicado ou banco de dados — todo o conteúdo é estático e tipado em `src/data/cv.ts`.
* Formulário de contato com persistência — mantidos os links diretos (e-mail/WhatsApp/GitHub).
* WhatsApp Business API — o contato usa apenas o link *click to chat*, sem chave ou conta Business.

## 8. Pendências e Backlog

### Roadmap de estilização por seção (V2.7+) — direção dada pelo usuário em 2026-07-12

Após aprovar a V2.6, o usuário pediu que **cada seção** ganhe uma estilização própria e inovadora, sem sair da estética. Execução **uma tarefa por vez**, disparada pelo usuário (ex.: "executa a T1"); cada entrega vira uma linha no histórico (§9). T0 é pré-requisito técnico das demais; a ordem sugerida das outras é a ordem da página.

**Regras comuns a todas as tarefas (não repetidas em cada uma):**

* Zinc monocromático via tokens; cor **somente** pelos tokens da assinatura `--scroll-line-*`, em dose homeopática — o Hero e a linha continuam os donos da assinatura.
* CSS puro em `globals.css` sempre que possível (a lib motion segue exclusiva da linha); animações disparadas por scroll via `animation-timeline: view()` **sempre gated por `@supports`** com fallback estático.
* Invariantes intocáveis: sanduíche de z-index da linha (fundo na `<section>` não-posicionada, wrapper `relative z-10`, texto sobre fundo opaco — `architecture.md` §5.5/§9), estrutura `h2` + bloco irmão (âncoras da geometria da linha), contraste §5.3, `prefers-reduced-motion` desliga todo movimento.
* Definição de Pronto por tarefa: lint zero warnings, 28/28 e2e, Lighthouse a11y 100/100 light+dark se tocou contraste, screenshots do README regenerados se o visual capturado mudou.

#### T0 — Infra de reveal por scroll + motivo unificado dos cabeçalhos *(pré-requisito das demais)*

* Primitiva `.section-reveal` (+ classes de stagger) em `globals.css` usando `animation-timeline: view()`, fallback estático via `@supports`, desligada em reduced motion; herdar a lição do `hero-rise` (fill `both` sobrescreve utilitários de `opacity`/`transform` — animar wrappers; armadilha em `architecture.md` §9).
* Motivo unificado nos `h2` das 8 seções: tick curto com o gradiente da assinatura à esquerda do título (mesma classe em todas), respeitando §5.3 nos fundos `muted`.
* Documentar a primitiva em `architecture.md` §5.

#### T1 — Painel de Impacto: números que contam ao entrar em cena

* Count-up 100% CSS (`@property` inteiro + `counter()` em pseudo-elemento, timeline `view()`, gated): o valor real permanece no DOM como texto (leitores de tela/ATS) e o contador animado é `aria-hidden`; parsing tipado de prefixo/sufixo ("+600", "<5%") no componente.
* Número com o gradiente metálico do nome do Hero (extrair classe compartilhada).
* Hairline da assinatura no topo de cada card; hover com lift sutil; reveal dos 3 cards em stagger.

#### T2 — Experiência Profissional: trilho que se acende

* Substituir o `border-l` da `<ol>` por um trilho que se preenche conforme o scroll atravessa a seção (`view()` + `scaleY`, transform-only), monocromático com a ponta na tinta da assinatura.
* Nós da timeline "acendem" (borda vazada → preenchida) quando o trilho os passa; `<time>` do período em pill glass (`bg-background/70`).
* Cards deslizam da esquerda em stagger. Atenção: a linha global mergulha nesta seção — validar visualmente que trilho local e linha não competem.

#### T3 — Projetos: card vitrine com borda viva

* Borda com o gradiente da assinatura em `conic-gradient` girando lentamente (rotação via `@property`, gated; fallback: borda gradiente estática) em opacidade baixa — o card do Birthday.ai vira o único elemento "moldurado" da página.
* Interior com a grade de pontos do Hero (reutilizar `hero-grid`/variante) em opacidade menor.
* Badges da stack em reveal com stagger; micro-interação no CTA "Ver no GitHub" (ícone desliza no hover).

#### T4 — Tecnologias: categorias com identidade

* Ícone lucide `aria-hidden` por categoria (ex.: `Code2`/`Database`/`Server`/`Bot`) num tile arredondado no header de cada card — mapeamento tipado com fallback para categorias futuras.
* Badges com pop-in em stagger no reveal; hover tinge a borda com `--scroll-line-via` em dose mínima.
* Objetivo explícito: deixar de ser idêntica à seção de Competências (hoje as duas têm o mesmo visual).

#### T5 — Competências e Metodologias: painéis editoriais numerados

* Trocar os Cards por painéis `bg-background` opacos (invariante da linha) com numeração fantasma gigante (`01`–`05`, `text-foreground/5`) no canto; hover tinge o número com a assinatura.
* Badges mantidos; reveal em stagger.
* Critério de aceite: ler **diferente** da T4 à primeira vista.

#### T6 — Competências Comportamentais: cards com barra de prova

* Barra de acento fina à esquerda de cada card, preenchendo com a assinatura no hover.
* Linha `evidence` (card de Comunicação) promovida a chip glass destacado — é a única prova concreta da seção.
* Reveal em stagger.

#### T7 — Formação Acadêmica e Idiomas: medidores de idioma

* Nível de idioma como medidor segmentado de 5 pontos **derivado do union `Language.level`** (Básico→Nativo — dado já tipado, nada inventado), preenchimento com tinta da assinatura; o texto do nível permanece visível (medidor `aria-hidden`).
* Ponto de status com pulse discreto junto a "Cursando" (tokens de foreground; pulse desligado em reduced motion).
* Hairline da assinatura no topo do card único.

#### T8 — Monitorias Acadêmicas: índice com pontilhado + coda da página

* *Dot leaders* tipográficos entre título e período (estilo sumário de livro); hover com lift leve e pontilhado tingido.
* Numeração fantasma discreta por linha (01–05).
* Coda de fechamento: cue "voltar ao topo" espelhando o cue do Hero (simetria abertura/fechamento), âncora `#inicio`.
* Reveal em stagger; é a última seção — conferir o encontro com o fim da linha global no rodapé.

**Backlog opcional (herdado da V2.5, segue válido):**

* **ScrollTimeline nativa** (`animation-timeline: scroll()`/WAAPI) animando `stroke-dashoffset` com keyframes gerados do `drawMap`: mesma semântica 1:1, zero JS por evento de scroll, sincronização garantida pelo motor de estilo. Exige detecção de suporte + fallback para o caminho atual. Ganho marginal — só vale se sobrar engasgo perceptível.
* **Perfilar o glow em dispositivo real se houver engasgo:** `filter: blur(6px)` sobre um path num SVG do tamanho do documento + pulse infinito de opacity é o suspeito nº 1 de jank de repaint (nunca perfilado — `docs/scroll-line-postmortem.md` §4.10). Alternativa barata: glow como traço largo semitransparente sem blur.

## 9. Histórico de Versões

| Versão | Entrega | Commits |
| --- | --- | --- |
| V1.1 | Dark Mode (`ThemeProvider`, `ModeToggle`, `SiteHeader`); migração de `zinc-*` hardcoded para tokens semânticos | `01e65af`, `5001243` |
| V1.2 | Lighthouse a11y 94→100; suíte Playwright inicial; seções Formação Acadêmica e Comportamentais | `08316a9`, `09e3754`, `ca0c3cd`, `4029ab1` |
| V1.3 | Busca global `Ctrl+K` + navegação ancorada | `c807e7a`, `241fcf1`, `703201f` |
| V1.4 | Hero centralizado | `7de8494` |
| V1.5 | Assunto automático no e-mail (`emailSubject`) | `8c9e949` |
| V1.6 | Menu de contato por e-mail com 4 ações | `8c9e949` |
| V1.7 | Botão WhatsApp substitui telefone | `6e62b1b` |
| V1.8 | Backlog B1–B5: PDF do currículo, Idiomas, evidência de oratória, seção Projetos (Birthday.ai), seção Tecnologias — decisões autônomas (B2/B3/B5) validadas pelo usuário em 2026-07-10 | `357a2fd` |
| V1.9 | B6: PDF versionado + guarda de hash no build (inversão após falha do deploy `dpl_AdGf4qFGpnuyaByzyHxCbzZRdBsx`) | `3987f2e` |
| V2.0 | B4 (README-vitrine do Birthday.ai, repo externo) + B7 (README-vitrine deste repo com screenshots automatizados) + correção do bug da busca (Projetos/Tecnologias fora do `SECTION_ORDER`) — decisões autônomas confirmadas e README externo revisado pelo usuário em 2026-07-10 | `168c063`, `184c002` |
| V2.1 | B8: Scroll Progress Line (lib `motion`, tokens `--scroll-line-*`, reduced-motion, +1 teste e2e → 28) — entregue sob carta branca e revisada em três rodadas de feedback do usuário no mesmo dia: linha em fluxo do documento atrás do texto (sanduíche de z-index), nascendo como sublinhado sob o resumo do Hero, e todos os blocos de conteúdo em fundo opaco (cards) para a linha nunca atravessar letras (`architecture.md` §5.5) | `f88fb8b`, `4083165` |
| V2.2 | Scroll Progress Line reancorada ao DOM real: nasce fora da borda esquerda no vão entre o título do Painel de Impacto e o 1º card, portões num trilho à direita impedem que ela cruze qualquer título (mobile e desktop), mergulhos alternados preservam o ritmo; desenho por perseguição da ponta: âncora a ~45% do viewport e velocidade limitada ~120px/s, calibrado em quatro rodadas com o usuário (antes o draw acontecia até ~430px fora da tela e um spring convergido dava "arranques" presos à base da tela); verificação geométrica automatizada em 4 viewports (folga mínima 26px vs. 13 títulos invadidos antes) | `1479d07` |
| V2.3 | Pontas dos portões do trilho perfeitamente redondas: junção G2 por equalização da curvatura pelo flanco mais apertado (antes, braços a meio vão davam raios até ~6× desiguais na emenda — o "bico" apontado pelo usuário em 4 capturas); âncoras, mergulhos, largura do traço e mobile intactos; folga dos títulos revalidada (mín. 26px) | `a7fa03f`→`d7ddb42` |
| V2.4 | Perseguição reescrita como mola criticamente amortecida em forma fechada, rigidez/teto por tipo de ponteiro — métricas Playwright ok nos 3 cenários, mas o usuário seguiu reportando teleporte | *(nunca commitada — substituída pela V2.5 no working tree; o aprendizado vive no post-mortem)* |
| V2.5 | Vínculo 1:1 definitivo da Scroll Progress Line (especificação final do usuário: "X% de scroll = X% do caminho"): toda a física de perseguição removida — fração desenhada é função pura e determinística do scroll, linearizada pelo mapa y→fração; recálculo por evento de scroll (sem loop por frame); viewport congelado por rebuild de layout (elimina o degrau da barra de URL no mobile); `data-line-version` no DOM para confirmar o build sob teste; teste e2e passa a validar monotonia + determinismo (28/28); post-mortem das 4 versões com física em `docs/scroll-line-postmortem.md` | `a7fa03f`→`d7ddb42` (commitada e refinada pelo usuário, validada em produção; Hero reposicionado em `b5886a1`) |
| V2.6 | Camadas de profundidade do Hero, 100% CSS (server component preservado, zero JS): grade de pontos mascarada + três auroras com os tokens da assinatura, nome com gradiente clipado + sheen periódico + sombra/glow, entrada em cascata, pill de localização glass, separador com o gradiente assinatura, hover-lift nos CTAs e scroll cue para o Painel de Impacto; reduced motion desliga todo movimento; screenshots do README regenerados com `reducedMotion: "reduce"` no script; Lighthouse a11y 100/100 revalidado em light **e** dark; mecânica em `architecture.md` §5.6 | *(aguardando commit)* |

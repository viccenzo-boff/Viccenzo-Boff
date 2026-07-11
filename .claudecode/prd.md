# PRD — Currículo Técnico Premium

> Documento de **produto**: visão, requisitos, decisões e status. A arquitetura técnica vive em `architecture.md`; as regras de trabalho no `CLAUDE.md` (§1 tem o mapa completo).

## 1. Visão e Público

Portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, focado em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site transparece rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

## 2. Objetivos Estratégicos

* **Conversão:** reter a atenção do recrutador nos primeiros 10 segundos com proposta de valor clara e visual minimalista impecável.
* **Autoridade:** demonstrar proficiência técnica pela própria engenharia, velocidade e estrutura do site.
* **Diferenciação:** o **Painel de Impacto** (dashboard de métricas) substitui a ideia de "jogos", provando capacidade analítica e foco em qualidade.

## 3. Status Atual

**V2.1 em produção** (B8 — Scroll Progress Line, commitada pelo usuário em `f88fb8b` + `4083165`). **V2.2 pronta no working tree** (linha reancorada ao DOM: nasce na borda esquerda da tela no vão do Painel de Impacto e não cruza mais nenhum título, em nenhum viewport — correção pedida pelo usuário com capturas em 2026-07-11) — aguardando revisão visual e commit; relatório em §8.

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

## 7. Fora de Escopo

* Backend dedicado ou banco de dados — todo o conteúdo é estático e tipado em `src/data/cv.ts`.
* Formulário de contato com persistência — mantidos os links diretos (e-mail/WhatsApp/GitHub).
* WhatsApp Business API — o contato usa apenas o link *click to chat*, sem chave ou conta Business.

## 8. Pendências e Backlog

### Relatório da entrega V2.2 (2026-07-11 — correção da Scroll Progress Line)

**1. Decisões tomadas que aguardam confirmação:**

* **Traçado novo: trilho direito nos títulos + mergulhos alternados.** Para garantir que a linha nunca cruze o texto de um título (em qualquer largura de tela), ela agora desce presa a um trilho à direita na altura de cada título e mergulha ao centro do conteúdo de cada seção — fundo à esquerda em seções alternadas, suave ao meio nas demais, preservando o ritmo de travessias anterior. Pergunta objetiva: o novo traçado agrada visualmente nos dois temas (light/dark)?

**2. Pendências que só o usuário pode resolver:**

* **Revisar visualmente e commitar a V2.2** (working tree). Conferir a linha em light/dark e no celular — em especial o desenho acompanhando o scroll; mensagem sugerida: `fix(ui): anchor scroll line to DOM sections and draw its tip at the viewport fold`.

**3. Novas tarefas descobertas durante a execução:**

* **Screenshots do README não mostram a linha** (herdado da V2.1, segue válido). O script captura tudo no topo da página, onde a linha ainda não foi desenhada (pathLength 0). Recomendação: se quiser exibir a linha no README, adicionar ao `scripts/readme-screenshots.ts` uma captura em meio de scroll com espera do spring; caso contrário, descartar.

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
| V2.2 | Scroll Progress Line reancorada ao DOM real: nasce fora da borda esquerda no vão entre o título do Painel de Impacto e o 1º card, portões num trilho à direita impedem que ela cruze qualquer título (mobile e desktop), mergulhos alternados preservam o ritmo; desenho por perseguição da ponta: âncora a ~45% do viewport e velocidade limitada ~120px/s, calibrado em quatro rodadas com o usuário (antes o draw acontecia até ~430px fora da tela e um spring convergido dava "arranques" presos à base da tela); verificação geométrica automatizada em 4 viewports (folga mínima 26px vs. 13 títulos invadidos antes) | *(aguardando commit)* |

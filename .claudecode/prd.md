# PRD — Currículo Técnico Premium

> Documento de **produto**: visão, requisitos, decisões e status. A arquitetura técnica vive em `architecture.md`; as regras de trabalho no `CLAUDE.md` (§1 tem o mapa completo).

## 1. Visão e Público

Portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, focado em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site transparece rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

## 2. Objetivos Estratégicos

* **Conversão:** reter a atenção do recrutador nos primeiros 10 segundos com proposta de valor clara e visual minimalista impecável.
* **Autoridade:** demonstrar proficiência técnica pela própria engenharia, velocidade e estrutura do site.
* **Diferenciação:** o **Painel de Impacto** (dashboard de métricas) substitui a ideia de "jogos", provando capacidade analítica e foco em qualidade.

## 3. Status Atual

**V2.2 commitada pelo usuário** (`1479d07` — linha reancorada ao DOM, não cruza títulos em nenhum viewport). Na revisão visual da V2.2 (2026-07-11, capturas do usuário) surgiu a **V2.3** (pontas não perfeitamente redondas em alguns portões — plano e relatório em §8) e, na sequência, a **V2.4** (linha "teletransportava" durante o scroll — perseguição reescrita: mola criticamente amortecida com rigidez por tipo de ponteiro + teto de velocidade de desenho). Ambas no working tree aguardando commit.

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

### Plano V2.3 — Pontas perfeitamente redondas nos portões do trilho direito (2026-07-11)

**Sintoma (capturas do usuário):** em alguns pontos onde a linha vira à direita (os "portões" do trilho, na faixa de cada título), a ponta da curva não é perfeitamente arredondada — um flanco varre largo e o outro fecha apertado, formando um "bico".

**Causa raiz identificada:** em cada portão encontram-se dois segmentos de Bézier cúbicos com tangente vertical contínua (junção G1 — sem quina de direção), mas com **curvatura descontínua** (não-G2). Como os pontos de controle ficam sempre a meio vão, o raio da ponta em cada flanco é `r = 1,5·(vão/2)²/percurso-horizontal` — e vão/percurso são diferentes acima e abaixo do portão (o vão depende da altura da seção vizinha; o percurso, de o mergulho vizinho ser profundo a 7% ou suave a 50% da largura). Resultado: raios que diferem por fator de até ~10× na emenda e, quando o vão vertical é curto, raios de ~10px sob um glow de 7px — quase um vértice. Os mergulhos à esquerda têm o mesmo defeito em grau leve (vãos maiores), fora do escopo desta correção.

**Subtasks (o que será feito, ponto a ponto):**

1. ✅ **Desacoplar os braços de controle por extremidade** em `buildSegments` (`animated-scroll-line.tsx`): hoje um único `controlY` a meio vão serve os dois lados de cada segmento; passam a existir offsets independentes de início e fim (tangentes seguem verticais).
2. ✅ **Igualar a curvatura pelo flanco mais apertado:** por portão, raio único `r = min(teto dos dois flancos)`, com teto `(3/8)·vão²/percurso` — o flanco que já era o mais fechado permanece exatamente como está (o teto **é** o raio implícito atual) e só o flanco largo é recolhido até ele; braços do lado dos mergulhos seguem a meio vão e a curva segue **monotônica em y** (invariante da V2.2 que impede a linha de cruzar títulos). *Descartado na execução* o raio-alvo fixo (90px) do plano original: medição real mostrou que ele estreitaria as curvas do mobile, que hoje são naturalmente amplas (raios implícitos de 300–1700px) — mexeria onde não foi pedido.
3. ✅ **Converter raio em braço de controle:** braço `d = √(2·r·percurso/3)` em cada lado do portão — curvatura idêntica dos dois flancos no ápice (junção G2), ponta perfeitamente redonda no lugar do "bico" (antes os raios diferiam por fator de até ~6× na emenda, ex.: 88px→16px no portão de Tecnologias em 1406px).
4. ✅ **Não mexer em mais nada:** âncoras (x e y), mergulhos à esquerda, largura do traço (2.5px linha / 7px glow), início e saída intactos — só a altura dos braços de controle junto aos portões muda (a "altura" da curva no entorno do ápice, autorizada pelo usuário).
5. ✅ **Validação visual antes/depois:** screenshots dos 7 portões em 1280px e 375px (Playwright com `reducedMotion` para a linha seguir o scroll 1:1) + verificação geométrica automática de que nenhum ponto do path invade a folga dos títulos.
6. ✅ **Qualidade:** `pnpm lint` zero warnings, 28/28 e2e, `architecture.md` §5.5 atualizado (geometria G2 dos portões).

### Relatório da entrega V2.3 (Protocolo de Carta Branca)

**1. Decisões tomadas que aguardam confirmação:**

* **Equalização pelo flanco mais apertado, sem raio-alvo global.** Cada ponta agora fecha com o raio que o flanco mais fechado daquele portão já tinha — o flanco largo é recolhido até ele. É a menor intervenção que elimina o "bico" (nada além dos portões muda; mobile fica visualmente idêntico), ao custo de os raios continuarem variando entre portões conforme o espaço disponível. Pergunta objetiva: as pontas agradam nos dois temas, desktop e celular?

**2. Pendências que só o usuário pode resolver:**

* **Revisar visualmente e commitar a V2.3** (working tree). Conferir as pontas dos portões em light/dark, desktop e celular; mensagem sugerida: `fix(ui): round rail gate tips with curvature-matched G2 joints`.
* **Screenshots do README não mostram a linha** (herdado da V2.1, segue válido). O script captura tudo no topo da página, onde a linha ainda não foi desenhada (pathLength 0). Recomendação: se quiser exibir a linha no README, adicionar ao `scripts/readme-screenshots.ts` uma captura em meio de scroll; caso contrário, descartar.

**3. Novas tarefas descobertas durante a execução:**

* **Dois portões seguem redondos porém bem fechados (Tecnologias e Monitorias, ~13–17px de raio em desktop largo).** Não é mais "bico" — a ponta é simétrica —, mas o vão vertical curto entre o título e o conteúdo dessas seções, combinado ao percurso horizontal enorme dos mergulhos profundos (7% da largura), não comporta raio maior sem mexer em outra coisa. Se incomodar: a saída é rebalancear a **altura dos mergulhos profundos vizinhos** (descê-los dentro da seção para dar mais vão ao portão) — mexe onde a linha cruza o conteúdo, por isso não foi feito sem autorização. Recomendação: avaliar visualmente antes de decidir.
* **Mergulhos à esquerda têm o mesmo defeito em grau leve.** A emenda de curvatura descontínua também existe nos pontos de mergulho (esquerda/meio), mas com vãos verticais maiores o desnível é pouco visível — o usuário não a apontou nas capturas. Recomendação: só estender a equalização G2 aos mergulhos se incomodar visualmente após esta entrega.

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
| V2.3 | Pontas dos portões do trilho perfeitamente redondas: junção G2 por equalização da curvatura pelo flanco mais apertado (antes, braços a meio vão davam raios até ~6× desiguais na emenda — o "bico" apontado pelo usuário em 4 capturas); âncoras, mergulhos, largura do traço e mobile intactos; folga dos títulos revalidada (mín. 26px) | *(aguardando commit)* |
| V2.4 | Avanço da linha fluido nos dois regimes de scroll (o "teletransporte" no desktop e a "tartaruga" no mobile apontados pelo usuário em 2 capturas + GIF + teste no celular): perseguição reescrita como mola criticamente amortecida em forma fechada sobre a fração desenhada, com rigidez e teto de desenho por tipo de ponteiro — toque: ponta desce junto com a tela mesmo em flings; mouse: cada tick de roda vira caminhada A→B de ~0,7s partindo de velocidade zero; calibrada por instrumentação Playwright em 3 cenários (ticks isolados, contínuo ~800px/s, flings ~2800px/s — ponta sempre visível nos três); traçado, cores e geometria intactos | *(aguardando commit)* |

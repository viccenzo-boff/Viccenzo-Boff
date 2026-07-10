# PRD — Currículo Técnico Premium

> Documento de **produto**: visão, requisitos, decisões e status. A arquitetura técnica vive em `architecture.md`; as regras de trabalho no `CLAUDE.md` (§1 tem o mapa completo).

## 1. Visão e Público

Portfólio/currículo digital de altíssimo nível para **Viccenzo Gottardo Boff**, focado em atrair e impressionar Recrutadores Seniores, Gerentes de Engenharia (EMs) e Diretores de TI. O site transparece rigor técnico, maturidade em engenharia de software e foco em resultados baseados em dados.

## 2. Objetivos Estratégicos

* **Conversão:** reter a atenção do recrutador nos primeiros 10 segundos com proposta de valor clara e visual minimalista impecável.
* **Autoridade:** demonstrar proficiência técnica pela própria engenharia, velocidade e estrutura do site.
* **Diferenciação:** o **Painel de Impacto** (dashboard de métricas) substitui a ideia de "jogos", provando capacidade analítica e foco em qualidade.

## 3. Status Atual

**V1.9 em produção** (`3987f2e`; deploy validado em 2026-07-10 — home e `/curriculo-viccenzo-boff.pdf` respondendo 200 em `viccenzo-boff.vercel.app`). Pendências e backlog: §8.

## 4. Requisitos Funcionais

| # | Requisito |
| --- | --- |
| RF1 | **Conteúdo em 9 seções**, nesta ordem: Hero, Painel de Impacto, Experiência Profissional, Projetos (Birthday.ai), Tecnologias (ATS), Competências e Metodologias, Competências Comportamentais, Formação Acadêmica e Idiomas, Monitorias Acadêmicas. Mapa técnico: `architecture.md` §3.2. |
| RF2 | **Contato multicanal no Hero:** e-mail (menu com 4 ações e assunto automático), WhatsApp (*click to chat* com mensagem padrão), GitHub e download do CV. Download também disponível no header sticky durante todo o scroll. Detalhes: `architecture.md` §3.3. |
| RF3 | **Busca global** (`Ctrl+K`/`Cmd+K` + botão no header) cobrindo todo o conteúdo de `cvData`, com navegação ancorada suave, highlight da seção-destino e respeito a `prefers-reduced-motion`. |
| RF4 | **Tema:** light como padrão, dark disponível por alternância manual persistida. |
| RF5 | **PDF do currículo** ATS-friendly, com conteúdo sempre idêntico ao site (guarda de sincronização no build) e acessível por link estático, sem JavaScript. |

## 5. Requisitos Não-Funcionais

* **Acessibilidade:** Lighthouse Acessibilidade 100/100 em light e dark (baseline permanente); contrastes ≥4,5:1; WCAG 2.5.3 (*Label in Name*) nos CTAs.
* **Mobile first:** validado em 375px e 1280px pela suíte e2e.
* **Performance e custo:** site estático/serverless na Vercel, zero scripts externos, custo zero de infraestrutura.
* **Qualidade de engenharia:** TypeScript estrito, lint zero warnings, 26 testes e2e passando (Definição de Pronto: `CLAUDE.md` §5).

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

## 7. Fora de Escopo

* Backend dedicado ou banco de dados — todo o conteúdo é estático e tipado em `src/data/cv.ts`.
* Formulário de contato com persistência — mantidos os links diretos (e-mail/WhatsApp/GitHub).
* WhatsApp Business API — o contato usa apenas o link *click to chat*, sem chave ou conta Business.

## 8. Pendências e Backlog

**Tarefas de backlog:**

* **B4 — README do Birthday.ai** (repositório externo `github.com/viccenzo-boff/birthday.ai`): garantir README apresentável (o que faz, arquitetura, stack, screenshots — mitigam a demo atrás de login, instruções). Pré-requisito de qualidade do CTA "Ver no GitHub".
* **B7 (candidata, não especificada):** reescrever o `README.md` deste repositório como vitrine para recrutadores (screenshots, arquitetura resumida) — o repositório também é peça do portfólio.

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

# Constituição — Currículo Técnico Premium de Viccenzo Gottardo Boff

> Artefato nativo do Spec Kit (`.specify/memory/`). Reúne os princípios que
> governam **todas** as entregas: visão de produto, regras invioláveis, padrões
> de engenharia e as decisões permanentes com o respectivo racional.
>
> **Como ler:** o que está aqui vale para toda spec futura e não se renegocia
> por entrega. Uma spec pode *acrescentar* restrição, nunca afrouxar as daqui.
> Mudar um artigo desta constituição é uma decisão consciente do dono do
> projeto — e a mudança entra no histórico de `specs/README.md`.

**Versão:** 1.0.0 · **Ratificada em:** 2026-09-02 (migração para Spec Kit)

---

## Artigo I — Visão e Público

Site de currículo técnico premium que substitui o PDF tradicional como cartão de
visitas profissional. É a vitrine de uma candidatura, não um blog nem um produto
com usuários.

* **Público-alvo:** recrutadores e lideranças técnicas avaliando o candidato para
  o cargo alvo de **Analista de Tecnologia da Informação**.
* **Leitura em minutos, não em cliques.** Página única, navegação ancorada, busca
  global. Nada exige cadastro, login ou interação para ser lido.
* **O PDF é cidadão de primeira classe.** Todo conteúdo da tela existe também no
  PDF, em ordem de recrutador, compatível com ATS (coluna única, texto real
  selecionável, hierarquia por headings).

### I.1 Objetivos estratégicos

Toda entrega serve a pelo menos um destes três. Entrega que não serve a nenhum
provavelmente não deveria existir.

* **Conversão:** reter a atenção do recrutador nos primeiros 10 segundos, com
  proposta de valor clara e visual minimalista impecável.
* **Autoridade:** demonstrar proficiência técnica pela própria engenharia,
  velocidade e estrutura do site — o meio é a mensagem.
* **Diferenciação:** o **Painel de Impacto** (dashboard de métricas) prova
  capacidade analítica e foco em qualidade.

## Artigo I-A — Requisitos do Produto

> Migrados do antigo `.claudecode/prd.md` §4/§5 na adoção do Spec Kit,
> preservados na íntegra. Requisito novo entra pela `spec.md` da entrega e é
> promovido para cá quando passa a valer permanentemente (Artigo V.1).

### I-A.1 Requisitos funcionais

| # | Requisito |
| --- | --- |
| RF1 | **Conteúdo em 6 seções**, nesta ordem: Hero, Painel de Impacto, Experiência Profissional, Projetos (um card por item de `cvData.projects`), **Habilidades e Ferramentas** (macro-seção com três blocos rotulados: Stack Tecnológica/ATS, Engenharia e Metodologias, Perfil Comportamental), **Formação e Desenvolvimento** (macro-seção com três blocos rotulados: Base Acadêmica e Idiomas, Certificações e Cursos, Liderança Acadêmica e Mentorias). Mapa técnico: `architecture.md` §3.2. |
| RF2 | **Contato multicanal no Hero:** e-mail (menu com 4 ações e assunto automático), WhatsApp (*click to chat* com mensagem padrão), GitHub e download do CV. Download também disponível no header sticky durante todo o scroll. Detalhes: `architecture.md` §3.3. |
| RF3 | **Busca global** (`Ctrl+K`/`Cmd+K` + botão no header) cobrindo todo o conteúdo de `cvData`, com navegação ancorada suave, highlight da seção-destino e respeito a `prefers-reduced-motion`. |
| RF4 | **Tema:** segue o esquema do sistema operacional (`prefers-color-scheme`) quando não há preferência salva, e acompanha a troca ao vivo; o `ModeToggle` grava a escolha manual, que prevalece. *(Corrigido na migração de 2026-09-02: o PRD antigo ainda dizia "light como padrão", contradizendo a decisão registrada em [`decisions.md`](decisions.md) que a inverteu em 2026-07-13. O código sempre seguiu a decisão.)* |
| RF5 | **PDF do currículo** ATS-friendly, com conteúdo sempre idêntico ao site (guarda de sincronização no build) e acessível por link estático, sem JavaScript. |
| RF6 | **Scroll Progress Line:** linha decorativa em SVG (gradiente roxo→azul→vermelho, glow com pulse) confinada a uma **faixa estreita à margem direita** da tela — nasce fora da borda direita no vão entre o título do Painel de Impacto e o primeiro card —, desce o documento ancorada às seções reais **atrás do texto**, sem nunca cruzar o centro, a esquerda nem o texto de um título, e é desenhada progressivamente em **vínculo 1:1 com o scroll** (X% de rolagem = X% do caminho, sem física) — a página carrega sem traço visível. Overlay não interativo, visível em light e dark; sob `prefers-reduced-motion` o desenho segue o scroll 1:1, sem spring nem pulse. Detalhes técnicos: `architecture.md` §5.5. |

### I-A.2 Requisitos não-funcionais

* **Acessibilidade:** Lighthouse Acessibilidade 100/100 em light e dark (baseline permanente); contrastes ≥4,5:1; WCAG 2.5.3 (*Label in Name*) nos CTAs.
* **Mobile first:** validado em 375px e 1280px pela suíte e2e.
* **Performance e custo:** site estático/serverless na Vercel, zero scripts externos, custo zero de infraestrutura.
* **Qualidade de engenharia:** TypeScript estrito, lint zero warnings, testes de unidade (Vitest) + 30 testes e2e passando (Definição de Pronto: Artigo IV).

## Artigo II — Regras Invioláveis

### II.1 Commit é do agente; `git push` é do usuário

O agente commita o trabalho concluído e o deixa pronto para publicação. **Nunca**
execute `git push` sem pedido explícito do usuário naquela conversa — é o passo
que sai da máquina dele e dispara o deploy de produção na Vercel.

Decidido em 2026-09-02, invertendo a proibição anterior de commits. Padrão de
mensagem e disciplina de índice: Artigo VI.

### II.2 O PDF do currículo é versionado, nunca gerado no build

Ao alterar `src/data/cv.ts` ou `src/components/print/cv-print-document.tsx`, rode
`pnpm generate:cv-pdf` e inclua `public/curriculo-viccenzo-boff.pdf` +
`scripts/cv-pdf.manifest.json` nas mudanças a commitar.

`pnpm build` = `verify:cv-pdf && next build`, e **falha** (local e na Vercel) se o
PDF estiver dessincronizado. **Nunca** tente gerar o PDF no build da Vercel: a
imagem de build não executa o Chromium do Playwright (`libnspr4.so` ausente —
causa da falha do primeiro deploy). Mecanismo completo:
[`architecture.md`](architecture.md) §7.

### II.3 Nenhuma afirmação sem prova executável

Este repositório é uma vitrine: cada afirmação vem acompanhada do link que
permite checá-la. Antes de escrever no currículo que o sistema X faz Y, **leia o
código que produz Y**. Frase no indicativo dentro de um entregável é hipótese a
conferir, não texto a transcrever.

Nasceu de um caso real (entrega 001): a spec afirmava que "um portão de
integração contínua recusa a divergência" entre `.bpmn` e `.svg`; o modo de
verificação existia, mas nenhum passo do workflow o invocava. Nenhum portão do
projeto pegaria — lint, testes, build e a guarda de hash saem todos em verde com
a frase errada dentro.

### II.4 Nenhum dado pessoal de terceiro

Nenhum texto do currículo cita nome de estudante, professor, cliente ou colega.
Empresas e instituições, sim; pessoas, não.

## Artigo III — Princípios de Engenharia

* **Dados primeiro.** Antes de escrever ou alterar um componente de tela, garanta
  que os dados que o alimentam estejam mapeados e tipados em `src/data/cv.ts`
  (fonte única de verdade), com o tipo em `src/types/cv.types.ts`.
* **`cv_base.md` é a spec de entrada; `cv.ts` é a fonte de verdade.** O usuário
  registra qualquer mudança de currículo real (curso, emprego, projeto, idioma,
  skill, métrica) primeiro em [`cv_base.md`](cv_base.md), em linguagem natural —
  ele descreve **o fato**, o agente traduz em código. Os dois ficam espelhados:
  nenhum campo de `cvData` pode faltar lá, e vice-versa.
* **TypeScript estrito.** Proibido `any`. Propriedades, retornos e payloads
  explicitamente tipados.
* **shadcn/ui primeiro.** Para qualquer elemento de UI, verifique o catálogo do
  shadcn/ui e instale via CLI antes de criar do zero.
* **Design system por tokens.** Paleta monocromática zinc expressa
  **exclusivamente** via tokens semânticos (`bg-background`, `bg-muted`,
  `text-foreground`, `text-muted-foreground`…). **Proibido** hardcodear classes
  `zinc-*` em `src/components/custom`. Dark Mode manual preservado em toda
  mudança visual.
* **Exceção cromática única.** O gradiente roxo→azul→vermelho da Scroll Progress
  Line é a única cor fora do monocromático, expressa nos tokens
  `--scroll-line-*`. Toda outra cor no site é derivada dela
  (`--signature-accent`) e em dose homeopática, só no `:hover`/`:focus-visible`.
* **Clean Code / SRP.** Componentes funcionais pequenos e focados.
* **Mobile first.** Layout planejado e testado para telas pequenas antes do
  desktop.
* **Acessibilidade.** HTML semântico, navegação por teclado, ARIA correto.
  Baseline: Lighthouse Acessibilidade 100/100 em light **e** dark.
* **Performance.** Imagens via `<Image />` do Next.js; nenhum script externo
  pesado.

## Artigo IV — Definição de Pronto

Uma tarefa só é marcada concluída no `tasks.md` da entrega quando:

| # | Portão | Comando |
| --- | --- | --- |
| 1 | ESLint sem warnings | `pnpm lint` |
| 2 | Testes de unidade verdes | `pnpm test:unit` |
| 3 | Suíte e2e 30/30 | `pnpm test:e2e` |
| 4 | Build verde, incluindo a guarda do PDF | `pnpm build` |
| 5 | PDF regenerado se `cvData`/template mudaram | `pnpm generate:cv-pdf` |
| 6 | Lighthouse a11y revalidado se tocou UI/contraste | manual |

**A Definição de Pronto é pré-requisito do commit, não do push.** Commit de
estado quebrado não existe: se um portão falhar, o trabalho fica no working tree
e o agente reporta a falha com a saída do comando.

**Resultado vazio não é evidência.** Comando que não acusou nada tem duas causas,
e só uma é boa notícia — prove que a leitura aconteceu antes de concluir que está
limpo.

## Artigo V — Fluxo Spec-Driven

Toda entrega não-trivial atravessa três artefatos em `specs/NNN-slug/`:

| Artefato | Responde | Tempo |
| --- | --- | --- |
| `spec.md` | **o quê** e **por quê** — objetivo, descobertas, decisões, escopo, critérios de aceite | congelado quando aprovado |
| `plan.md` | **como** — abordagem escolhida, alternativas descartadas, armadilhas da execução | congelado quando a entrega fecha |
| `tasks.md` | **em que pé está** — `T001…`, caixa de seleção, commit que fechou cada uma | vivo durante a entrega |

### V.1 A regra de promoção (impede dois donos do mesmo fato)

`plan.md` é **congelado e datado**: descreve como *aquela* entrega foi planejada.
[`architecture.md`](architecture.md) é **vivo**: descreve o estado *presente* do
sistema. Eles nunca afirmam o mesmo fato no presente.

Quando uma decisão do `plan.md` vira arquitetura permanente, ela é **promovida**
para o `architecture.md`, e o `plan.md` guarda o ponteiro. Quando vira princípio
que governa entregas futuras, é promovida para esta constituição.

### V.2 Onde cada fato mora

| Fato | Dono único |
| --- | --- |
| Princípio que vale para toda entrega | esta constituição |
| Estado presente do sistema (stack, componentes, pipeline, armadilhas) | [`architecture.md`](architecture.md) |
| Conteúdo do currículo em linguagem natural | [`cv_base.md`](cv_base.md) |
| O quê/por quê de uma entrega | `specs/NNN-slug/spec.md` |
| O como de uma entrega | `specs/NNN-slug/plan.md` |
| Status de execução | `specs/NNN-slug/tasks.md` |
| Índice de entregas, histórico e backlog | `specs/README.md` |
| Regras de comportamento do agente | `CLAUDE.md` (aponta para cá) |

**Sem duplicação:** cada fato vive em um único lugar; os demais referenciam.

### V.3 Simplicity Gate

Herdado do Spec Kit e levado a sério: proibido "future-proofing". Não se cria
artefato (`research.md`, `data-model.md`, `contracts/`) enquanto não houver
entrega que precise dele — pasta vazia é ruído. Não se cria spec para mudança
trivial de documentação.

## Artigo VI — Commits

### VI.1 As três respostas duráveis

| Pergunta | Resposta | Racional |
| --- | --- | --- |
| Quem commita? | o agente | O usuário revisa pelo histórico, não pelo working tree. |
| Quem publica? | o usuário | `git push` só com pedido explícito: é o gatilho do deploy de produção. |
| Branch ou `main`? | direto na `main` | Histórico linear, repositório solo. PR seria revisão de si para si — cerimônia sem revisor; os portões do Artigo IV são a rede de segurança. Reavaliar se houver segunda pessoa. |

### VI.2 Formato

Conventional Commits, em português **sem acentos na mensagem** (casa o histórico
recente e evita a camada de codificação do shell no Windows):

```text
tipo(escopo): assunto no imperativo, minusculo, sem ponto final

Corpo em ~72 colunas explicando o PORQUE: a alternativa descartada, a medicao
que sustentou a decisao, a restricao que forcou o caminho. O diff ja diz o QUE.

Refs: specs/001-slug/tasks.md T004
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

* Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`,
  `ci`, `chore`. Escopo: o subsistema (`cv`, `search`, `ui`, `pdf`, `specs`…).
* Assunto ≤ 72 caracteres, imperativo.
* Mensagem com corpo vai para **arquivo + `git commit -F`**, nunca por heredoc.
* `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` em todo commit do
  agente — atribuição honesta, e o histórico público mostra domínio de ferramenta
  de IA com método. (Os commits `7df6961` e `0d230cb` são anteriores à regra e
  ficam como estão.)

### VI.3 Corte por tema

Um commit é o que alguém poderia querer **ler ou reverter sozinho** — não "o que
compila sozinho". Correção de defeito anterior que a tarefa apenas revelou vai em
commit próprio, antes da funcionalidade.

Quando um arquivo compartilhado precisar entrar em dois commits, **prepare a
versão intermediária**: guarde a final, produza a do primeiro tema, commite,
restaure a final, commite o segundo — conferindo com `diff` que nada se perdeu.
Rebase interativo não roda neste ambiente.

### VI.4 Confira o índice antes de cada commit

`git commit` publica o **índice inteiro**, não o que você acabou de adicionar.
Rode `git diff --cached --name-only` e confira **item a item**; rode
`git ls-files --others --exclude-standard` e confirme que nada não rastreado
deveria estar entrando.

Não é zelo teórico: em 2026-09-02 o índice já estava integralmente preparado,
incluindo diretórios cuja inclusão ainda não fora decidida. **Nunca commite
artefato cuja inclusão o usuário não decidiu.**

### VI.5 Antes do `push`

`git fetch` primeiro e confirme que o ponto de partida não mudou; depois de
publicar, confirme que local e remoto apontam para o mesmo commit. Nunca
`--force` em branch publicada sem pedido explícito e específico.

## Artigo VII — Fora de Escopo (permanente)

* Backend dedicado ou banco de dados — todo o conteúdo é estático e tipado.
* Formulário de contato com persistência — mantidos os links diretos.
* WhatsApp Business API — apenas o link *click to chat*, sem chave nem conta.
* Blog, CMS ou área logada.

## Artigo VIII — Protocolo de Carta Branca

Quando o usuário se ausentar e autorizar decisão autônoma, a entrega só está
completa com um **relatório de retorno** — na resposta final e espelhado em
`specs/README.md` — separando três listas:

1. **Decisões tomadas que aguardam confirmação:** o que foi decidido, o que está
   alterado por causa disso, e a pergunta objetiva a responder.
2. **Pendências que só o usuário resolve:** fatos pessoais, credenciais, ações em
   sistemas externos — com a ação esperada descrita.
3. **Tarefas novas descobertas:** o que surgiu, por que importa, e a recomendação.

Cada item é autossuficiente: título descritivo + contexto direto. Identificadores
curtos são apelidos opcionais e **nunca** substituem a descrição.

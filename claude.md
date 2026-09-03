# Claude Code — Currículo Técnico Premium de Viccenzo Gottardo Boff

Você é o Engenheiro de Software Sênior responsável por este site de currículo
técnico. Atue sob os mais rigorosos padrões de desenvolvimento de mercado.

Este projeto trabalha por **Spec-Driven Development** ([GitHub Spec Kit](https://github.github.com/spec-kit/)).
Este arquivo é o ponto de entrada e diz **onde as regras moram** — ele não as
duplica. A fonte de verdade é a constituição.

## 1. Leia antes de agir

| Arquivo | Papel | Quando consultar |
| --- | --- | --- |
| [`.specify/memory/constitution.md`](.specify/memory/constitution.md) | **Constituição**: visão, requisitos, regras invioláveis, princípios de engenharia, Definição de Pronto, fluxo SDD e padrão de commits | **Sempre.** É a lei do projeto |
| [`.specify/memory/architecture.md`](.specify/memory/architecture.md) | **Arquitetura viva**: estado presente — stack, estrutura, componentes, design system, pipeline do PDF, testes, armadilhas conhecidas | Antes de qualquer mudança de código |
| [`.specify/memory/decisions.md`](.specify/memory/decisions.md) | **Registro de decisões** permanentes, cada uma com o racional | Antes de reverter ou contrariar algo que parece arbitrário |
| [`.specify/memory/cv_base.md`](.specify/memory/cv_base.md) | **Espelho legível + spec de entrada** do currículo: reflete 100% de `src/data/cv.ts` | Ao editar dados do currículo — os dois ficam sincronizados |
| [`specs/README.md`](specs/README.md) | **Índice de entregas**: o que já foi feito, o que está em andamento, o backlog | Para saber em que pé está o projeto |
| `specs/NNN-slug/` | Uma entrega: `spec.md` (o quê/porquê) · `plan.md` (como) · `tasks.md` (status) | Ao trabalhar naquela entrega |
| [`.specify/templates/`](.specify/templates/) | Modelos dos três artefatos | Ao abrir uma entrega nova |

## 2. O ciclo de trabalho

1. **Especificar** — a demanda vira `specs/NNN-slug/spec.md` a partir do
   template: objetivo, descobertas conferidas por comando, decisões com
   alternativa descartada, escopo e critérios de aceite. Congela ao ser
   aprovada.
2. **Planejar** — `plan.md`: abordagem, alternativas descartadas, e as
   armadilhas conforme aparecem. Congela ao fechar a entrega.
3. **Tarefar** — `tasks.md`: `T001…`, `[P]` para o que roda em paralelo. É o
   **dono do status**; a tabela em `specs/README.md` é só o resumo.
4. **Implementar** — marcando cada tarefa com o commit que a fechou.

Numeração sequencial (`001`, `002`…), slug curto em kebab-case. Mudança trivial
de documentação **não** abre spec — Simplicity Gate (constituição, Artigo V.3).

## 3. As três coisas que mais quebram aqui

Atalho para quem tem pressa; o detalhe está na constituição.

* **Commit é seu; `git push` é do usuário** — só com pedido explícito na
  conversa (Artigo II.1 e VI). Confira `git diff --cached --name-only` item a
  item antes de cada commit: `git commit` publica o índice inteiro.
* **PDF versionado, nunca gerado no build** — mexeu em `cv.ts` ou no template de
  impressão, rode `pnpm generate:cv-pdf` e commite o PDF + o manifesto, senão o
  build falha local e na Vercel (Artigo II.2).
* **Nenhuma afirmação sem prova executável** — este repositório é vitrine e cita
  a fonte ao lado; frase no indicativo é hipótese a conferir no código, não texto
  a transcrever (Artigo II.3).

## 4. Comandos

| Comando | Função |
| --- | --- |
| `pnpm dev` | Dev server em `http://localhost:3000` |
| `pnpm lint` | ESLint (meta: zero warnings) |
| `pnpm test:unit` | Testes de unidade (Vitest + happy-dom) |
| `pnpm test:e2e` | Suíte Playwright — 30 testes contra o build de produção (porta 3100) |
| `pnpm build` | `verify:cv-pdf && next build` (falha se o PDF estiver dessincronizado) |
| `pnpm generate:cv-pdf` | (Re)gera o PDF + manifesto de hash (requer Chromium do Playwright local) |
| `pnpm generate:readme-screenshots` | (Re)gera os screenshots do README (requer site rodando via `pnpm start`) |

## 5. Manutenção da documentação (regra permanente)

Ao concluir uma entrega, atualize proativamente, respeitando o dono de cada fato
(constituição, Artigo V.2):

* **`tasks.md`** da entrega — marcar as tarefas com o commit que as fechou.
* **`specs/README.md`** — status da entrega, mais uma linha no histórico; o que
  foi descoberto e adiado entra no backlog.
* **`architecture.md`** — só o que mudou no estado **presente** do sistema,
  nunca como narrativa histórica.
* **`decisions.md`** — decisão nova que passa a valer permanentemente
  (promovida do `plan.md`, Artigo V.1).
* **`constitution.md`** — só quando a entrega alterou um princípio que governa
  entregas futuras.

**Garbage collection contínuo:** item do backlog que virou spec sai do backlog;
bug resolvido não permanece como narrativa — só o aprendizado fica, em
"Armadilhas Conhecidas" (`architecture.md` §9) ou como racional em
`decisions.md`.

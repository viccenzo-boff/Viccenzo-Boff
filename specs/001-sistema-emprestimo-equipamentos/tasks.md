# Tarefas — 001 · Sistema de Empréstimo de Equipamentos no portfólio

**Spec:** [spec.md](spec.md) · **Plano:** [plan.md](plan.md)
**Status: ✅ concluída — 14/14 tarefas · 2026-09-02**

> `[x]` feito · `[ ]` a fazer · `[P]` paralelizável (não depende da anterior)
> A coluna de commit torna o "feito" **auditável**, e não declarado.
>
> **Nota de migração:** reconstruído na adoção do Spec Kit (2026-09-02) a partir
> do plano de ação da spec original (§5) e dos commits reais que fecharam cada
> item. Nenhuma tarefa foi inventada: cada uma corresponde a um arquivo que
> mudou de fato.

---

## Fase 1 — Reconciliação (antes da primeira edição)

- [x] T001 Ler a spec inteira e os arquivos que ela toca, mais os que ela não
      menciona mas atinge (consumidores de `cvData.projects`) — *sem commit: leitura*
- [x] T002 Varrer conflitos entre a spec e o projeto e agrupar numa pergunta só,
      com recomendação em cada item — *3 conflitos levantados, todos decididos pelo usuário*
- [x] T003 [P] Provar as premissas externas: as 5 URLs da entrega respondem 200,
      e as afirmações sobre o sistema de origem conferem contra o código
      (5 BPMN, 31 páginas, 3 portões) — *2 afirmações reprovadas, ver plan.md §3.1*

## Fase 2 — Correção do defeito da busca (commit próprio)

- [x] T004 Acrescentar `searchKeywords?: string[]` ao tipo `Project` — `7df6961`
- [x] T005 Mover as palavras-chave do Birthday.ai da constante do laço para o
      item em `cv.ts` — `7df6961`
- [x] T006 Fazer `search-index.ts` ler `project.searchKeywords` — `7df6961`
- [x] T007 Escrever o teste da regressão (comparação por elemento exato) e
      **validá-lo por mutação** — `7df6961`

## Fase 3 — O projeto novo (commit próprio)

- [x] T008 Acrescentar `docsUrl?: string` ao tipo `Project` — `0d230cb`
- [x] T009 Escrever o objeto do projeto em `cv.ts`, em primeiro no array, com o
      texto das duas afirmações corrigidas — `0d230cb`
- [x] T010 [P] Botão "Ver a wiki" condicional a `docsUrl` em `projects.tsx`,
      com `CardFooter` em `flex-wrap gap-3` — `0d230cb`
- [x] T011 [P] Linha "Documentação" condicional no template de impressão — `0d230cb`
- [x] T012 Espelhar o projeto novo em `cv_base.md`, campo a campo — `0d230cb`
- [x] T013 Regenerar o PDF e o manifesto (`pnpm generate:cv-pdf`) —
      hash `105c2cd8` → `863c79f1` — `0d230cb`

## Fase 4 — Automação no repositório de origem

- [x] T014 Hooks `pre-push` e `post-commit` de aviso de entrega, versionados em
      `.githooks/` com receita e caminho de volta no `CONTRIBUTING.md` —
      *repositório `sistema-emprestimo-equipamentos`, working tree*

---

## Verificação (Definição de Pronto — constituição, Artigo IV)

| Portão | Resultado |
| --- | --- |
| `pnpm lint` | zero warnings |
| `pnpm test:unit` | 21/21 (2 testes novos) |
| `pnpm build` | verde, "hash confere" |
| `pnpm test:e2e` | 30/30 |
| Comportamento B1–B8 | todos passaram em Chromium light + dark + 375px |
| Contraste do botão novo | 19,90:1 (light) · 20,11:1 (dark) — mínimo 4,5 |
| URLs da entrega | 5/5 em 200 |
| Hooks D1–D4 | aviso em `v1.0`/`v2.13`; silêncio em `v1`/`v1.1-rc1`/`rascunho`/branch; exit 0 inclusive com entrada vazia e malformada |

## Descoberto durante a execução (foi para o backlog)

* Erro de tipos pré-existente em `src/lib/scroll-to-section.test.ts:27`
  (`tsc --noEmit`), fora do escopo desta entrega —
  [backlog](../README.md#dívida-técnica-descoberta).

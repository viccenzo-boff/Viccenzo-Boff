# Tarefas — NNN · <Título da entrega>

**Spec:** [spec.md](spec.md) · **Plano:** [plan.md](plan.md)
**Status: 🚧 em andamento — N/M tarefas**

> `[x]` feito · `[ ]` a fazer · `[P]` paralelizável (não depende da anterior)
> Toda tarefa concluída carrega o **commit que a fechou** — é o que torna o
> "feito" auditável, e não declarado.
>
> **Este arquivo é o dono do status.** A tabela em [`specs/README.md`](../README.md)
> é só o resumo; quando divergirem, este vale.

---

## Fase 1 — Reconciliação (antes da primeira edição)

- [ ] T001 Ler a spec inteira e os arquivos que ela toca, mais os que ela não
      menciona mas atinge
- [ ] T002 Varrer conflitos entre a spec e o projeto (contra a convenção, contra
      o já feito, contra a reversibilidade) e agrupar numa pergunta só
- [ ] T003 [P] Provar as premissas externas com comando (URLs, formato de dado,
      comportamento de biblioteca)

## Fase 2 — <Tema 1>

- [ ] T004

## Fase 3 — <Tema 2>

- [ ] T00N

---

## Verificação (Definição de Pronto — constituição, Artigo IV)

| Portão | Resultado |
| --- | --- |
| `pnpm lint` | |
| `pnpm test:unit` | |
| `pnpm build` | |
| `pnpm test:e2e` | |

## Descoberto durante a execução

O que apareceu e não pertence a esta entrega vai para o backlog em
[`specs/README.md`](../README.md), com uma linha aqui apontando para lá.

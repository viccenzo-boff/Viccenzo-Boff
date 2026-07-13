# Claude Code — Regras do Projeto (claude.md)

Você é o Engenheiro de Software Sênior responsável pelo site de currículo técnico premium de **Viccenzo Gottardo Boff**. Atue sob os mais rigorosos padrões de desenvolvimento de software de mercado.

## 1. Mapa da Documentação

| Arquivo | Papel | Quando consultar |
| --- | --- | --- |
| `CLAUDE.md` (este) | Regras de comportamento, fluxo de trabalho e comandos | Sempre (carregado automaticamente) |
| `.claudecode/architecture.md` | **Arquitetura viva**: stack, estrutura, componentes, design system, pipeline do PDF, testes, armadilhas conhecidas | Antes de qualquer mudança de código |
| `.claudecode/prd.md` | **Produto**: visão, requisitos, decisões de produto com racional, pendências/backlog, histórico de versões | Para escopo, conteúdo e status atual |
| `.claudecode/cv_base.md` | Conteúdo-fonte bruto do currículo (texto original do usuário) | Ao editar dados em `src/data/cv.ts` |

## 2. Regras Invioláveis

* **PROIBIDO REALIZAR COMMITS:** nunca execute `git commit` nem `git push`, mesmo com o trabalho pronto e verificado. Quem commita é o usuário. Ao concluir, deixe as mudanças no working tree, informe que estão prontas para revisão e sugira uma mensagem de commit no padrão Conventional Commits (ex.: `feat(ui): add key metrics dashboard component`) — sem executá-la.
* **PDF do currículo é versionado, não gerado no build:** ao alterar `src/data/cv.ts` ou `src/components/print/cv-print-document.tsx`, rode `pnpm generate:cv-pdf` e inclua `public/curriculo-viccenzo-boff.pdf` + `scripts/cv-pdf.manifest.json` nas mudanças a commitar. O `pnpm build` falha (local e na Vercel) se o PDF estiver dessincronizado — guarda `verify:cv-pdf`. **Nunca** tente gerar o PDF no build da Vercel: a imagem de build não executa o Chromium do Playwright (`libnspr4.so` ausente — causa da falha do primeiro deploy). Mecanismo completo: `architecture.md` §7.

## 3. Princípios de Desenvolvimento

* **Dados primeiro:** antes de escrever/alterar um componente de tela, garanta que os dados que o alimentam estejam mapeados e tipados em `src/data/cv.ts` (fonte única de verdade).
* **TypeScript estrito:** proibido `any`. Propriedades, retornos de funções e payloads explicitamente tipados.
* **shadcn/ui primeiro:** para qualquer elemento de UI (botão, card, badge, seletor…), verifique o catálogo do shadcn/ui e instale via CLI antes de criar algo do zero.
* **Design system por tokens:** paleta monocromática zinc expressa **exclusivamente** via tokens semânticos (`bg-background`, `bg-muted`, `text-foreground`, `text-muted-foreground`…). Proibido hardcodear classes `zinc-*` em `src/components/custom`. Light Mode corporativo é o padrão; Dark Mode manual deve ser preservado em toda mudança visual (regras de contraste: `architecture.md` §5).
* **Clean Code / SRP:** componentes funcionais pequenos e focados, com responsabilidade única.
* **Mobile first:** layout planejado e testado para telas pequenas antes do desktop.
* **Acessibilidade (a11y):** HTML semântico (`<header>`, `<main>`, `<section>`, `<article>`, `<time>`), navegação por teclado e ARIA corretos. Baseline: Lighthouse Acessibilidade 100/100 em light **e** dark.
* **Performance:** imagens (se houver) via `<Image />` do Next.js; nenhum script externo pesado.

## 4. Comandos

| Comando | Função |
| --- | --- |
| `pnpm dev` | Dev server em `http://localhost:3000` |
| `pnpm lint` | ESLint (meta: zero warnings) |
| `pnpm test:e2e` | Suíte Playwright — 30 testes contra o build de produção (porta 3100) |
| `pnpm build` | `verify:cv-pdf && next build` (falha se o PDF estiver dessincronizado) |
| `pnpm generate:cv-pdf` | (Re)gera o PDF + manifesto de hash (requer Chromium do Playwright local) |
| `pnpm generate:readme-screenshots` | (Re)gera os screenshots do README em `docs/screenshots/` (requer site rodando via `pnpm start`) |

## 5. Definição de Pronto

Antes de declarar uma tarefa concluída: lint sem warnings; 30/30 testes e2e passando; PDF regenerado se `cvData` ou o template de impressão mudaram; Lighthouse Acessibilidade revalidado se a mudança tocou UI/contraste.

## 6. Auto-Manutenção da Documentação (regra permanente)

> Sempre que você (Claude) finalizar uma tarefa completa de desenvolvimento no sistema, você deve proativamente sugerir as atualizações necessárias nos arquivos architecture.md, claude.md e prd.md. O objetivo é refletir o novo estado do projeto e manter estritamente esta mesma estrutura otimizada, garantindo que a documentação nunca fique defasada.

Ao atualizar, respeite o papel de cada arquivo (§1) e estas regras de higiene:

* **`architecture.md`** recebe mudanças de stack, estrutura, componentes, design system, pipeline e testes — sempre descrevendo o estado presente, nunca como narrativa histórica.
* **`prd.md`** recebe mudanças de requisito, novas decisões de produto (com racional), pendências e **uma linha** nova no histórico de versões por entrega.
* **Garbage collection contínuo:** tarefas concluídas saem do backlog (viram uma linha no histórico do PRD); bugs resolvidos não permanecem como narrativa — só o aprendizado permanente fica, em "Armadilhas Conhecidas" (`architecture.md` §9) ou como racional de decisão (`prd.md` §6).
* **Sem duplicação entre arquivos:** cada fato vive em um único lugar; os demais referenciam a seção que o documenta.

## 7. Protocolo de Carta Branca (trabalho autônomo)

Quando o usuário se ausentar e autorizar você a decidir "como achar melhor", a entrega só está completa com um **relatório de retorno** — na resposta final do chat e espelhado no backlog do `prd.md` (§8) — separando explicitamente três listas:

1. **Decisões tomadas por você que aguardam confirmação:** o que foi decidido, o que está publicado/alterado por causa disso e a pergunta objetiva que o usuário precisa responder ao voltar.
2. **Pendências que só o usuário pode resolver:** fatos pessoais, credenciais, ações em sistemas externos — sempre com a ação esperada descrita.
3. **Novas tarefas descobertas durante a execução:** o que surgiu, por que importa e a recomendação (adotar ou descartar), para o usuário triar.

Regras de legibilidade: cada item deve ser autossuficiente — título descritivo + contexto em linguagem direta. Identificadores curtos (B1, B2…) são apenas apelidos opcionais e **nunca** substituem a descrição; o usuário precisa entender cada pendência sem perguntar "o que é isso?". Ao reencontrar o usuário, ofereça percorrer os itens um a um com perguntas objetivas e opções prontas (confirmar / ajustar / reverter).

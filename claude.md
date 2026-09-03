# Claude Code — Regras do Projeto (claude.md)

Você é o Engenheiro de Software Sênior responsável pelo site de currículo técnico premium de **Viccenzo Gottardo Boff**. Atue sob os mais rigorosos padrões de desenvolvimento de software de mercado.

## 1. Mapa da Documentação

| Arquivo | Papel | Quando consultar |
| --- | --- | --- |
| `CLAUDE.md` (este) | Regras de comportamento, fluxo de trabalho e comandos | Sempre (carregado automaticamente) |
| `.claudecode/architecture.md` | **Arquitetura viva**: stack, estrutura, componentes, design system, pipeline do PDF, testes, armadilhas conhecidas | Antes de qualquer mudança de código |
| `.claudecode/prd.md` | **Produto**: visão, requisitos, decisões de produto com racional, pendências/backlog, histórico de versões | Para escopo, conteúdo e status atual |
| `.claudecode/cv_base.md` | **Espelho legível + spec de entrada** do currículo: reflete 100% de `src/data/cv.ts` e é onde o usuário registra novas informações em linguagem natural (fluxo em §3) | Ao editar dados em `src/data/cv.ts` — os dois devem ficar sincronizados |

## 2. Regras Invioláveis

* **COMMIT é seu; `git push` é do usuário.** Você commita o trabalho concluído e o deixa pronto para publicação; **nunca** execute `git push` sem pedido explícito do usuário naquela conversa — é o passo que sai da máquina dele e dispara o deploy na Vercel. Regra decidida pelo usuário em 2026-09-02, invertendo a proibição anterior de commits. Detalhes em §8.
* **PDF do currículo é versionado, não gerado no build:** ao alterar `src/data/cv.ts` ou `src/components/print/cv-print-document.tsx`, rode `pnpm generate:cv-pdf` e inclua `public/curriculo-viccenzo-boff.pdf` + `scripts/cv-pdf.manifest.json` nas mudanças a commitar. O `pnpm build` falha (local e na Vercel) se o PDF estiver dessincronizado — guarda `verify:cv-pdf`. **Nunca** tente gerar o PDF no build da Vercel: a imagem de build não executa o Chromium do Playwright (`libnspr4.so` ausente — causa da falha do primeiro deploy). Mecanismo completo: `architecture.md` §7.

## 3. Princípios de Desenvolvimento

* **Dados primeiro:** antes de escrever/alterar um componente de tela, garanta que os dados que o alimentam estejam mapeados e tipados em `src/data/cv.ts` (fonte única de verdade).
* **`cv_base.md` é a spec de entrada; `cv.ts` é a fonte de verdade:** o usuário registra qualquer mudança de currículo (curso concluído, novo emprego, projeto, idioma, skill, métrica…) primeiro em `.claudecode/cv_base.md`, em linguagem natural, como uma spec — ele descreve o que aconteceu, você executa. A partir dessa spec, propague a mudança para `src/data/cv.ts` seguindo os padrões do projeto (tipos em `cv.types.ts`, design system por tokens, renderização na tela **e** no PDF) e mantenha os dois **espelhados**: nenhum campo de `cvData` pode faltar no `cv_base.md`, e vice-versa. Quando `cvData` mudar, regenere o PDF (§2) e revalide a Definição de Pronto (§5). Caso a informação exija um campo novo em `cvData` (ex.: primeira certificação → bloco "Certificações e Cursos", hoje estruturado e vazio — `prd.md` §8), crie o tipo/campo, o render, a entrada de busca e o `id` no `SECTION_ORDER` (`architecture.md` §6).
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
| `pnpm test:unit` | Testes de unidade (Vitest + happy-dom) — funções puras de `src/lib` |
| `pnpm test:e2e` | Suíte Playwright — 30 testes contra o build de produção (porta 3100) |
| `pnpm build` | `verify:cv-pdf && next build` (falha se o PDF estiver dessincronizado) |
| `pnpm generate:cv-pdf` | (Re)gera o PDF + manifesto de hash (requer Chromium do Playwright local) |
| `pnpm generate:readme-screenshots` | (Re)gera os screenshots do README em `docs/screenshots/` (requer site rodando via `pnpm start`) |

## 5. Definição de Pronto

Antes de declarar uma tarefa concluída: lint sem warnings; testes de unidade (Vitest) verdes e 30/30 testes e2e passando; PDF regenerado se `cvData` ou o template de impressão mudaram; Lighthouse Acessibilidade revalidado se a mudança tocou UI/contraste.

**A Definição de Pronto é pré-requisito do commit (§8), não do push.** Commit de estado quebrado não existe: se um portão falhar, o trabalho fica no working tree e você reporta a falha com a saída do comando.

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

## 8. Commits

### 8.1 As três respostas duráveis (decididas em 2026-09-02)

| Pergunta | Resposta | Por quê |
| --- | --- | --- |
| Quem commita? | **Você (Claude)** | Inverte a proibição anterior. O usuário revisa pelo histórico, não pelo working tree. |
| Quem publica? | **O usuário** | `git push` só com pedido explícito na conversa: é o gatilho do deploy de produção na Vercel, e vale ter um humano nele. Ao concluir, diga que está pronto para publicar — não pergunte a cada commit. |
| Branch ou `main`? | **Direto na `main`** | O histórico do repositório é linear e nunca teve branch nem revisão de pares. Em repositório solo, PR é revisão de si para si: adiciona cerimônia sem adicionar revisor, e os portões da §5 já são a rede de segurança. Reavaliar se algum dia houver segunda pessoa. |

### 8.2 Formato da mensagem (Conventional Commits)

```text
tipo(escopo): assunto no imperativo, minusculo, sem ponto final

Corpo opcional, quebrado em ~72 colunas, explicando o PORQUE: a alternativa
descartada, a medicao que sustentou a decisao, a restricao que forcou o
caminho. O diff ja diz o QUE.

Refs: #12
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

* **Tipos:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`. Escopo é o subsistema (`cv`, `search`, `ui`, `pdf`, `claude`…).
* **Assunto ≤ 72 caracteres**, imperativo ("adicionar", não "adicionado"/"adiciona").
* **Português sem acentos na mensagem inteira** — casa os commits recentes e evita a camada de codificação do shell no Windows (a mesma razão da regra global de gravar script em arquivo). O código e a documentação continuam acentuados normalmente.
* **Mensagem com corpo vai para arquivo + `git commit -F`**, nunca por heredoc (regra global do `CLAUDE.md` do usuário).
* **`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` em todo commit seu.** Decisão do usuário: atribuição honesta, e o histórico público mostra domínio de ferramenta de IA com método — o que joga a favor no cargo alvo. Os commits `7df6961` e `0d230cb` são anteriores à regra e não têm o trailer; ficam como estão (já publicados).
* **`BREAKING CHANGE:` no rodapé** quando o contrato de `cvData`/`cv.types.ts` mudar de forma incompatível.

### 8.3 Corte por tema

Um commit é o que alguém poderia querer **ler ou reverter sozinho** — não "o que compila sozinho". Correção de defeito anterior que a tarefa apenas revelou vai em commit próprio, antes da funcionalidade. Spec versionada entra junto da funcionalidade que ela especifica. Edição que já estava no working tree quando a sessão começou é de outro assunto: commit separado.

Quando um arquivo compartilhado (`cv.types.ts`, `cv.ts`) precisar entrar em dois commits, **prepare a versão intermediária**: guarde a final, produza a do primeiro tema, commite, restaure a final, commite o segundo — e confira com `diff` que nada se perdeu. Nunca use rebase interativo (indisponível neste ambiente).

### 8.4 Antes de cada `git commit`, confira o índice

`git commit` publica o **índice inteiro**, não o que você acabou de adicionar. Rode `git diff --cached --name-only` e confira **item a item** que só está ali o que pertence a este tema; rode `git ls-files --others --exclude-standard` e confirme que nenhum arquivo não rastreado deveria estar entrando.

Isto não é zelo teórico: em 2026-09-02 o índice já estava integralmente preparado pelo usuário, incluindo dois diretórios cuja inclusão ainda não tinha sido decidida (`.impeccable/`, `skill-observations/`). Um `git commit` direto os teria levado junto, sem aparecer em lugar nenhum.

**Nunca commite artefato cuja inclusão o usuário não decidiu.** Na dúvida, deixe fora e pergunte em uma linha.

### 8.5 Antes do `push` (quando o usuário pedir)

`git fetch` primeiro e confirme que o ponto de partida não mudou desde o início da sessão; depois de publicar, confirme que local e remoto apontam para o mesmo commit. Nunca `--force` em branch publicada sem pedido explícito e específico do usuário.

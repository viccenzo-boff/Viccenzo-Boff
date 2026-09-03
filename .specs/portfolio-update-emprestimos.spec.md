# Spec — Sistema de Empréstimo de Equipamentos no portfólio

**Repositório alvo:** `Viccenzo-Boff` (este)
**Repositório de origem:** [`sistema-emprestimo-equipamentos`](https://github.com/viccenzo-boff/sistema-emprestimo-equipamentos)
**Data:** 2026-09-01
**Status:** aguardando aprovação para a Fase 3

---

## 1. Objetivo

Acrescentar o Sistema de Empréstimo de Equipamentos como **segundo projeto em
destaque** do portfólio, respeitando o design system, o schema de dados e o
pipeline de build já existentes.

Esta spec é o contrato da mudança: nada fora do que está aqui deve ser tocado
na Fase 3, e cada arquivo listado na §5 tem o motivo pelo qual precisa mudar.

---

## 2. O que é o sistema (descoberta)

MVP full-stack para controlar o empréstimo de notebooks, tablets e extensões
dos cursos de Sistemas de Informação, Ciência da Computação e Engenharia da
Computação da Unoesc. Projetado para rodar na rede local, no computador da
secretaria, com duas frentes:

- **`/`** — portal de toque (tablet, na bancada): o estudante ou professor
  digita a matrícula, retira e devolve equipamento.
- **`/admin`** — painel (desktop, secretaria): fila de conferência física,
  empréstimos ativos, inventário, categorias e cadastro de pessoas.

### 2.1 Números conferidos

| Fato | Valor | Como foi conferido |
| --- | --- | --- |
| Commits | 132 | `git rev-list --count HEAD` |
| Linhas em `src/` | ~20.600 | `wc -l` sobre `.ts`/`.tsx` |
| Modelos de dados | 5 (`Pessoa`, `Administrador`, `Categoria`, `Equipamento`, `Emprestimo`) | `schema.prisma` |
| Migrations | 6 | `prisma/migrations/` |
| Rotas | 6 (1 portal + 5 painel) | `find src/app -name page.tsx` |
| Processos em BPMN | 5 | `docs/processos-fonte/*.bpmn` |
| Páginas de wiki | 31 (16 PT + 15 EN) | `find docs -name '*.md'` |
| Portões de CI da doc | 3 (MkDocs estrito, Vale, lychee) | `.github/workflows/docs.yml` |
| Versão congelada | tag `v1.0` | `git tag -l` |

### 2.2 Stack

Next.js 16 (App Router, Server Actions, Turbopack) · React 19 · TypeScript 5 ·
TailwindCSS 4 · Prisma 7 com driver adapter `better-sqlite3` · SQLite ·
`bcryptjs` · SheetJS (leitura de `.xlsx`) · MkDocs Material · BPMN 2.0 ·
Vale · lychee · GitHub Actions.

### 2.3 O que o torna diferente do Birthday.ai (e por isso vale entrar)

O Birthday.ai já ocupa o eixo "IA + integração + full-stack". Este projeto
ocupa um eixo que o portfólio ainda não tem, e que é justamente o eixo da
experiência profissional do Viccenzo (Suporte, QA e análise de regras de
negócio em ERP):

- **Análise de regra de negócio operacional.** A separação entre a devolução
  *declarada* pelo estudante e a baixa *física* conferida pela secretaria não
  é um detalhe técnico: é a modelagem de um processo de balcão em que o
  aparelho fica na bancada entre os dois eventos.
- **Modelagem formal de processo.** Cinco diagramas BPMN 2.0 versionados,
  com o SVG derivado do arquivo-fonte por script e conferido no CI.
- **Documentação como entrega.** Wiki bilíngue de 31 páginas com portões
  automatizados de qualidade — não é README, é manual de operação.
- **Disciplina de verificação.** Migrations ensaiadas em cópia do banco,
  verificação por navegador real e por HTTP contra as Server Actions.

### 2.4 Ponto de honestidade a confirmar

O README do sistema diz que ele "roda em rede local, hospedado no computador
da secretaria". Isso descreve o **desenho**, e não foi confirmado nesta sessão
que exista uma instalação em uso pela secretaria.

**Por padrão esta spec usa "projetado para rodar", que é verificável.** Se o
sistema já estiver de fato em uso, a frase pode virar "em operação na
secretaria" — o que é bem mais forte para um recrutador. **Decisão do
Viccenzo.**

---

## 3. Como o portfólio guarda projetos (descoberta)

**Fonte única de verdade:** `src/data/cv.ts`, tipado por `src/types/cv.types.ts`.
O array `projects` hoje tem **um** item (Birthday.ai). O tipo atual:

```ts
export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  highlights: string[];
  repoUrl: string;
  liveUrl?: string;
}
```

Quem consome esse array:

| Consumidor | Papel |
| --- | --- |
| `src/components/custom/projects.tsx` | Card na tela (título, badges de stack, descrição, destaques, botão do GitHub) |
| `src/components/print/cv-print-document.tsx` | Bloco equivalente no PDF do currículo |
| `src/lib/search-index.ts` | Entrada na busca (⌘K) |
| `.claudecode/cv_base.md` | Espelho legível — o `CLAUDE.md` §3 exige que fique sincronizado |

### 3.1 Três armadilhas encontradas na descoberta

Estas três não são visíveis no enunciado da tarefa e mudam o plano:

**(a) O `pnpm build` quebra se o PDF não for regenerado.**
`build` é `pnpm verify:cv-pdf && next build`. O `verify:cv-pdf` compara o
SHA-256 do HTML de impressão (função pura de `cvData` + template) com o hash
gravado em `scripts/cv-pdf.manifest.json`. Como o template de impressão
renderiza `projects`, **acrescentar um projeto invalida o hash** e o build
falha — local e na Vercel. Regenerar com `pnpm generate:cv-pdf` faz parte da
tarefa, não é passo opcional. O Chromium do Playwright, que o gerador exige,
foi confirmado presente nesta máquina.

**(b) `search-index.ts` tem palavras-chave do Birthday.ai dentro do laço
genérico.** O trecho que indexa projetos é:

```ts
for (const project of cvData.projects) {
  items.push({
    ...
    keywords: [
      project.description, ...project.stack, ...project.highlights,
      "projeto", "IA", "mensageria", "SDD", "Spec-Driven Development", "PERT",
    ],
  });
}
```

`"IA"`, `"mensageria"`, `"SDD"` e `"PERT"` descrevem **um** projeto, mas estão
na constante do laço. Enquanto houve um projeto só, propriedade do item e
propriedade da coleção eram indistinguíveis. Com o segundo projeto, o sistema
de empréstimo passa a ser encontrado por "mensageria" e "IA" — palavras sem
relação com ele — e nenhum portão acusa: o teste existente afirma
`countIn("projetos") === cvData.projects.length`, que continua verdadeiro com
as palavras erradas. **A correção entra nesta tarefa, em commit próprio.**

**(c) `BADGE_STAGGER` tem 6 posições.** O componente escalona o reveal dos
badges de stack em até 6 itens; do sétimo em diante todos revelam juntos. Não
é defeito (está documentado no comentário), mas define o teto: **a stack do
projeto novo tem 6 itens**, como a do Birthday.ai.

---

## 4. Decisões tomadas (aprovadas antes desta spec)

| # | Decisão | Alternativa descartada e por quê |
| --- | --- | --- |
| D1 | **Sem imagem.** Nenhum campo de imagem, nenhum arquivo em `public/`. | Adicionar imagem exigiria campo novo, componente de imagem e afetaria também o card do Birthday.ai, que ficaria sem. O design atual (texto + badges + grade em CSS) não usa `next/image` em lugar nenhum. |
| D2 | **Segundo botão "Ver a wiki"** no card, condicional a um campo `docsUrl` novo. | "Só citar nos highlights" deixaria a URL como texto, exigindo copiar e colar. "Usar o `liveUrl`" não teria efeito visível — aquele campo é deliberadamente não renderizado (`prd.md` §6). O botão condicional não altera o card do Birthday.ai, que não terá `docsUrl`. |
| D3 | **Hook `pre-push` + `post-commit`** no repositório de origem (Fase 4). | O Git **não tem** hook de criação de tag: `git tag` não dispara nada, e `post-commit` roda antes de você taguear no fluxo normal. Só o `pre-push` recebe `refs/tags/*`. |
| D4 | **A entrega pendente de certificações foi commitada antes** (autorização pontual do Viccenzo). | Editar por cima misturaria duas entregas temáticas no mesmo diff, sem fronteira para reverter uma sem a outra. |

### 4.1 Correção de fato descoberta na origem

O `AGENTS.md` do sistema de empréstimo afirma, em três lugares, que o GitHub
Pages "nunca foi apontado para a `gh-pages`" e que a URL responde 404.
**Isso está desatualizado.** Conferido por HTTP nesta sessão:

| URL | Resposta |
| --- | --- |
| `…/sistema-emprestimo-equipamentos/` | 200 — redireciona para `v1.0/` (padrão do `mike`) |
| `…/v1.0/` | 200 — título correto |
| `…/v1.0/en/` | 200 |
| `…/v1.0/portal/retirada/` | 200 |

A wiki **está publicada e navegável**, o que valida a decisão D2. A URL a usar
é a **raiz**, porque ela é estável: quando existir `v1.1`, o `mike set-default`
muda o destino do redirecionamento sem quebrar o link do portfólio.

Corrigir o `AGENTS.md` da origem fica como sugestão, fora do escopo desta spec.

---

## 5. Plano de ação — arquivos a modificar

### 5.1 No portfólio (`Viccenzo-Boff`)

| # | Arquivo | Mudança | Por quê |
| --- | --- | --- | --- |
| 1 | `src/types/cv.types.ts` | `Project` ganha `docsUrl?: string` e `searchKeywords?: string[]` | `docsUrl` sustenta o botão da wiki (D2); `searchKeywords` tira as palavras específicas de dentro do laço (§3.1b) |
| 2 | `src/data/cv.ts` | Novo objeto em `projects`; `searchKeywords` do Birthday.ai movidas para o item | Fonte única de verdade; "dados primeiro" (`CLAUDE.md` §3) |
| 3 | `src/lib/search-index.ts` | Remove as palavras literais do Birthday.ai do laço; passa a ler `project.searchKeywords` | Corrige §3.1b |
| 4 | `src/lib/search-index.test.ts` | Teste novo: cada projeto é indexado só pelas próprias palavras | Sem ele a regressão volta em silêncio |
| 5 | `src/components/custom/projects.tsx` | Botão "Ver a wiki", renderizado só quando há `docsUrl` | D2 |
| 6 | `src/components/print/cv-print-document.tsx` | Linha da wiki no bloco do projeto, quando houver | O PDF é currículo: precisa levar a URL |
| 7 | `.claudecode/cv_base.md` | Seção 5.2 com o projeto novo, espelhando `cv.ts` | Exigido pelo `CLAUDE.md` §3 |
| 8 | `public/curriculo-viccenzo-boff.pdf` | Regerado por `pnpm generate:cv-pdf` | Sem isso o build falha (§3.1a) |
| 9 | `scripts/cv-pdf.manifest.json` | Regerado no mesmo comando | Idem |
| 10 | `.claudecode/architecture.md` | Registrar `docsUrl`/`searchKeywords` e o botão condicional | `CLAUDE.md` §6 |
| 11 | `.claudecode/prd.md` | Decisão D2 com racional + uma linha no histórico de versões | `CLAUDE.md` §6 |
| 12 | `.specs/portfolio-update-emprestimos.spec.md` | Este arquivo | Entregável da Fase 2 |

**Não muda:** `globals.css`, `page.tsx`, componentes de UI, `SECTION_ORDER`
(a seção `projetos` já existe), nem qualquer teste e2e.

**`.specs/` NÃO vai para o `.gitignore`.** Não há dado sensível — nenhum
segredo, nenhuma credencial, nenhum dado pessoal de terceiro. A spec é
versionada, e ela própria é evidência do método SDD.

### 5.2 Conteúdo proposto do projeto

```ts
{
  id: "sistema-emprestimo-equipamentos",
  name: "Sistema de Empréstimo de Equipamentos",
  description:
    "Sistema full-stack para o controle de empréstimo de notebooks, tablets e extensões dos cursos de computação da Unoesc, projetado para rodar na rede local da secretaria: um portal de toque em que o estudante retira e devolve na bancada e um painel administrativo para a conferência física, o inventário e os cadastros.",
  stack: ["Next.js 16", "TypeScript", "Prisma 7", "SQLite", "BPMN 2.0", "MkDocs"],
  highlights: [
    "Modelagem de cinco processos de negócio em BPMN 2.0, com o diagrama publicado derivado do arquivo-fonte por um exportador próprio — um portão de integração contínua recusa a divergência entre os dois.",
    "Análise de regra de negócio a partir da operação real: a devolução declarada pelo estudante no tablet é separada da baixa física conferida pela secretaria, de modo que o equipamento só volta ao estoque depois de recolhido no balcão — o que torna mensurável o tempo em que ele fica parado na bancada.",
    "Wiki operacional bilíngue (português e inglês) de 31 páginas, publicada automaticamente por GitHub Actions com três portões de qualidade — build estrito, vocabulário controlado e verificação de links e âncoras — que bloqueiam o deploy da documentação.",
    "Verificação de cada entrega contra o sistema em execução, por navegador real e por chamadas HTTP às Server Actions, com migrations ensaiadas em cópia do banco antes de tocar o arquivo real para preservar o histórico de empréstimos.",
  ],
  searchKeywords: [
    "BPMN", "processo", "documentação", "wiki", "MkDocs",
    "regra de negócio", "inventário", "empréstimo", "Unoesc",
    "QA", "migration", "Server Actions", "SQLite", "Prisma",
  ],
  repoUrl: "https://github.com/viccenzo-boff/sistema-emprestimo-equipamentos",
  docsUrl: "https://viccenzo-boff.github.io/sistema-emprestimo-equipamentos/",
}
```

**Nome sem o sufixo "— Unoesc":** o card já é estreito e a instituição aparece
na primeira linha da descrição. O Birthday.ai também usa nome curto.

**Ordem no array:** o novo projeto entra **primeiro**, antes do Birthday.ai.
É o trabalho mais recente, o maior e o mais alinhado ao cargo alvo. Se
preferir manter a ordem cronológica de criação, é uma linha para trocar.

### 5.3 No sistema de empréstimo (Fase 4 — automação)

| # | Arquivo | Conteúdo |
| --- | --- | --- |
| 13 | `.git/hooks/pre-push` | Lê `refs/tags/*` da entrada padrão; se a tag casar com `v[0-9]+.[0-9]+`, imprime o aviso de nova entrega e o comando sugerido. Nunca bloqueia o push (sai sempre em 0). |
| 14 | `.git/hooks/post-commit` | Reforço: avisa quando o commit recém-criado está sobre um commit já tagueado como release. |
| 15 | `.githooks/` + nota no `CONTRIBUTING.md` | Cópia versionada dos dois, com uma linha de instalação |

**Sobre o item 15:** `.git/hooks/` **não é versionado** — os hooks somem em
qualquer clone novo e não existem para mais ninguém. Entregar só o item 13 e
14 é atender ao pedido ao pé da letra e deixar um automatismo que morre na
primeira troca de máquina. A cópia em `.githooks/` custa dois arquivos e uma
linha de `git config core.hooksPath .githooks`. **Se preferir manter só o
`.git/hooks/`, é só dizer.**

**Observação sobre a tag `v1.0`:** ela existe localmente e **não foi
publicada** (`git ls-remote --tags origin` não a encontra). Enquanto ela não
subir, o GitHub não mostra nenhuma Release — e o hook do item 13, que dispara
no `push` da tag, nunca terá rodado de verdade. Publicar com
`git push origin v1.0` cria a Release e exercita o hook. **Decisão do
Viccenzo** (o `AGENTS.md` reserva o `push` ao dono do repositório).

---

## 6. Critérios de aceite

Nenhum destes é declarado cumprido sem a saída do comando na mão.

### 6.1 Portões automatizados

| # | Critério | Comando |
| --- | --- | --- |
| A1 | ESLint sem warnings | `pnpm lint` sai em 0 |
| A2 | Testes de unidade verdes, incluindo o novo | `pnpm test:unit` |
| A3 | **O site compila** — inclui a guarda do PDF | `pnpm build` sai em 0, com `verify:cv-pdf` dizendo "hash confere" |
| A4 | Suíte e2e intacta | `pnpm test:e2e` — 30/30 |

### 6.2 Comportamento

| # | Critério | Como conferir |
| --- | --- | --- |
| B1 | O card do projeto novo aparece na seção Projetos com os 6 badges, a descrição e os 4 destaques | Navegador |
| B2 | O card novo tem **dois** botões; o do Birthday.ai continua com **um** | Navegador |
| B3 | O botão da wiki abre a URL correta em nova aba, com `rel="noopener noreferrer"` | Navegador |
| B4 | A busca (⌘K) encontra o projeto novo por "BPMN", "wiki" e "inventário" | Navegador |
| B5 | A busca **não** encontra o projeto novo por "mensageria" nem por "IA" — a regressão da §3.1b | Navegador + teste A2 |
| B6 | O PDF traz o projeto novo, com a URL da wiki | Abrir o PDF gerado |
| B7 | Dark mode e light mode sem quebra de contraste no botão novo | Navegador nos dois temas |
| B8 | Layout íntegro em tela pequena (mobile first) | Navegador estreito |

### 6.3 Consistência documental

| # | Critério |
| --- | --- |
| C1 | `.claudecode/cv_base.md` espelha `cv.ts`: nenhum campo do projeto novo falta lá, e vice-versa |
| C2 | `architecture.md` e `prd.md` atualizados conforme `CLAUDE.md` §6, sem duplicar fato entre arquivos |
| C3 | Nenhum dado pessoal de terceiro entra no portfólio — o texto não cita nome de estudante, professor ou administrador |
| C4 | Toda URL escrita na entrega responde 200 |

### 6.4 Fase 4

| # | Critério |
| --- | --- |
| D1 | `pre-push` dispara e imprime o aviso ao publicar uma tag `vN.N` — exercitado de verdade, não lido |
| D2 | O hook **nunca** bloqueia o push, inclusive quando não há tag |
| D3 | Push de branch sem tag não imprime nada |
| D4 | Os dois hooks são executáveis e rodam no Git Bash do Windows |

---

## 7. Fora de escopo

- Capturas de tela do sistema no portfólio (decisão D1).
- Mudança visual em qualquer seção que não seja Projetos.
- Alterar o card do Birthday.ai além de mover as `searchKeywords` dele.
- Corrigir o `AGENTS.md` da origem (§4.1) — sugestão, não entrega.
- Publicar a tag `v1.0` ou dar `push` em qualquer repositório.
- Commitar no portfólio: o `CLAUDE.md` §2 proíbe, e a autorização da D4 valeu
  só para a entrega de certificações. As mudanças ficam no working tree com
  mensagens sugeridas.

---

## 8. Commits sugeridos (para o Viccenzo executar)

Dois, cortados por tema — o defeito da busca é anterior a esta entrega:

1. `fix(search): tirar palavras-chave de um projeto do laco generico do indice`
2. `feat(cv): adicionar o sistema de emprestimo de equipamentos aos projetos`

# Plano — 001 · Sistema de Empréstimo de Equipamentos no portfólio

> **Documento congelado.** Descreve como *esta* entrega foi planejada e o que a
> execução ensinou, em 2026-09-01/02. Não se atualiza depois: o estado presente
> do sistema vive em [`architecture.md`](../../.specify/memory/architecture.md), e
> os princípios em [`constitution.md`](../../.specify/memory/constitution.md).
>
> **Nota de migração:** esta entrega foi executada antes da adoção do Spec Kit
> (2026-09-02), quando spec, plano e tarefas viviam num arquivo só em `.specs/`.
> Este `plan.md` foi reconstruído a partir da spec original e do que de fato
> aconteceu na execução — não é um documento retroativamente inventado: cada
> item abaixo tem commit, comando ou medição que o sustenta.

**Spec:** [spec.md](spec.md) · **Tarefas:** [tasks.md](tasks.md) · **Status:** concluída

---

## 1. Abordagem escolhida

Tratar a entrega como **dois temas independentes**, não como uma funcionalidade
só:

1. **Um defeito anterior**, que a entrega apenas revelou — as palavras-chave de
   busca de um projeto viviam na constante do laço genérico do índice.
2. **A funcionalidade** — o segundo projeto em destaque, com o campo `docsUrl`
   novo e o segundo CTA no card.

O corte importa porque o defeito é mais velho que a entrega e alguém vai querer
encontrá-lo sozinho depois. Resultado: commits `7df6961` (fix) e `0d230cb`
(feat).

## 2. Alternativas descartadas

| Alternativa | Por que não |
| --- | --- |
| Imagem/screenshot do sistema no card | Exigiria campo novo, componente de imagem e afetaria o card do Birthday.ai, que ficaria sem. O design atual (texto + badges + grade CSS) não usa `next/image` em lugar nenhum. |
| Citar a URL da wiki só nos highlights | Vira texto para copiar e colar — a evidência de "documentação como entrega" só vale se o recrutador chegar nela em um clique. |
| Reusar `liveUrl` para a wiki | Aquele campo é deliberadamente não renderizado (a demo do Birthday.ai exige login). Reusá-lo lhe daria dois significados. |
| Linkar `…/v1.0/` em vez da raiz do Pages | O `mike` redireciona a raiz para a versão padrão; linkar a versão fixa quebraria o link quando saísse a `v1.1`. |
| Hook de criação de tag (Fase 4) | O Git **não tem** esse hook: `git tag` não dispara nada e o `post-commit` roda antes de você taguear. Só o `pre-push` recebe `refs/tags/*`. |

## 3. Armadilhas encontradas na execução

### 3.1 Duas afirmações da spec não sobreviveram à leitura do código

A spec descrevia um sistema que já existe, e a metade descritiva do enunciado
(as frases no indicativo) é hipótese, não instrução.

* **"Um portão de integração contínua recusa a divergência" entre `.bpmn` e
  `.svg`.** Conferido: o exportador tem o modo `--verificar` e o docstring dele
  diz que é "para o CI", mas **nenhum passo do workflow o invoca** — os três
  portões são MkDocs estrito, Vale e lychee. Texto corrigido para descrever o
  modo de verificação, que é verdade.
* **"Em operação na secretaria".** O README do sistema descreve o **desenho**;
  não há evidência de instalação em uso. Adotado "projetado para rodar".

Nenhum portão do projeto pegaria: lint, testes, build e a guarda de hash do PDF
saem todos em verde com a frase errada dentro. Isto virou o Artigo II.3 da
constituição.

### 3.2 O critério de aceite B5 era inatingível como escrito

A spec pedia que a busca **não** encontrasse o projeto novo por "mensageria" nem
por "IA". Isso pressupõe casamento por substring; o cmdk pontua por
**subsequência**.

Prova de controle: o termo `zzqqxw`, inexistente no corpus, ainda devolve 1
resultado; `IA` devolve 30 de ~35 itens. Nenhum termo curto "não encontra" nada.

O defeito era real, mas o sintoma é **inversão de ordem**. Medido nos dois
estados, com dois termos de controle inalterados:

| termo | com o defeito | com o conserto |
| --- | --- | --- |
| mensageria | **Empréstimo** > Birthday.ai | Birthday.ai > Empréstimo |
| IA | **Empréstimo** > Birthday.ai | Birthday.ai > Empréstimo |
| Gemini | Birthday.ai > Empréstimo | *(inalterado)* |
| zzqqxw | só Birthday.ai | *(inalterado)* |

Asserção de busca neste projeto se escreve sobre **ordem relativa**, nunca sobre
ausência. Promovido para
[`architecture.md`](../../.specify/memory/architecture.md) §6.

### 3.3 O teste da regressão compara por elemento exato, não por substring

As `keywords` de um item incluem descrição e highlights inteiros, e uma palavra
curta como "processo" aparece na prosa de outro projeto por coincidência
("Processo de desenvolvimento disciplinado…"). Comparação por substring daria
falso positivo.

O teste foi validado por mutação: com o defeito reintroduzido, ele reprova com
`expected […] to not include 'IA'`.

### 3.4 Critério D1 × §7: exercitar o hook sem publicar

O critério pedia o hook `pre-push` **exercitado de verdade** ao publicar uma tag;
o escopo proibia `push` em qualquer repositório. Resolvido exercitando contra um
**repositório bare local descartável** no scratchpad — git de verdade, hook de
verdade, stdin de verdade, sem tocar o GitHub. Linha de base do repositório de
origem capturada antes e conferida item a item depois.

### 3.5 A leitura do PDF falhou junto com o controle

A primeira tentativa de extrair texto do PDF devolveu "tudo ausente" — mas o
termo de controle ("Viccenzo") também. Ausência de resultado tem duas causas, e
só uma é boa notícia: a extração estava quebrada (fonte com subset), não o PDF.
Refeito pelo caminho que o projeto usa como fonte do hash, com o controle
passando.

## 4. Fora de escopo (e por quê)

* Screenshots do sistema no portfólio — decisão D1 da spec.
* Mudança visual em qualquer seção que não Projetos.
* Corrigir o `AGENTS.md` do repositório de origem, que afirma desatualizadamente
  que o GitHub Pages nunca foi apontado (conferido: a wiki responde 200). Fica
  como sugestão ao dono daquele repositório.
* Publicar a tag `v1.0`, que existe local e não foi enviada ao GitHub.

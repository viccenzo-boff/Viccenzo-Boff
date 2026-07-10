# Currículo Técnico — Viccenzo Gottardo Boff

Portfólio/currículo digital de página única, projetado para recrutadores técnicos: conteúdo 100% tipado, busca global, dark mode, PDF ATS-friendly sempre sincronizado com o site e acessibilidade Lighthouse 100/100.

**🌐 Produção:** [viccenzo-boff.vercel.app](https://viccenzo-boff.vercel.app)

![Home em light mode](docs/screenshots/home-light.png)

## Destaques

* **Painel de Impacto** — métricas de resultado (+600 atendimentos de alta complexidade, +150 melhorias e falhas reportadas, <5% de retrabalho em QA) em vez de listas genéricas de habilidades.
* **Busca global (`Ctrl+K`)** — índice derivado automaticamente da fonte de dados única; qualquer competência, empresa ou projeto leva à seção correspondente com navegação ancorada suave.
* **Contato multicanal** — menu de e-mail com 4 ações (Gmail, Outlook Web, app padrão, copiar) e assunto preenchido automaticamente; WhatsApp *click to chat*; GitHub; download do CV sempre visível no header sticky.
* **PDF do currículo ATS-friendly** — gerado a partir dos mesmos dados do site, com guarda de hash no build que **impede o deploy se site e PDF divergirem**.
* **Dark mode** manual persistido, com contraste ≥ 4,5:1 auditado nos dois temas.

<p>
  <img src="docs/screenshots/home-dark.png" alt="Home em dark mode" width="68%" />
  <img src="docs/screenshots/mobile-light.png" alt="Layout mobile (375px)" width="26%" />
</p>

![Busca global com Ctrl+K](docs/screenshots/search-command.png)

## Stack e Arquitetura

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19, site estático na Vercel |
| Linguagem | TypeScript estrito (`any` proibido) |
| UI | Tailwind CSS v4 + shadcn/ui, paleta expressa só por tokens semânticos |
| Busca | cmdk + Radix Dialog, índice derivado de `src/data/cv.ts` |
| Testes | Playwright — 26 testes e2e contra o build de produção |

Princípios: **dados primeiro** (todo o conteúdo vive tipado em [`src/data/cv.ts`](src/data/cv.ts) — a tela e o PDF são projeções dele), componentes pequenos com responsabilidade única, mobile first e HTML semântico. A arquitetura completa está documentada em [`.claudecode/architecture.md`](.claudecode/architecture.md) e as decisões de produto em [`.claudecode/prd.md`](.claudecode/prd.md).

## Qualidade de Engenharia

* **Lighthouse Acessibilidade 100/100** em light e dark (baseline permanente).
* **26 testes e2e** (Desktop Chrome 1280px + Mobile Chrome 375px) cobrindo tema, busca, contato e download do PDF — incluindo magic bytes `%PDF-` do asset.
* **ESLint zero warnings** e TypeScript estrito.
* **Invariante de sincronização do PDF:** o build falha (local e na Vercel) se o PDF versionado não corresponder ao conteúdo atual — ver abaixo.

## PDF do currículo (guarda de sincronização)

`public/curriculo-viccenzo-boff.pdf` é **versionado no git** e gerado localmente a partir de `src/data/cv.ts` — a imagem de build da Vercel não executa o Chromium do Playwright, então o PDF não é gerado no deploy.

Ao alterar `src/data/cv.ts` ou `src/components/print/cv-print-document.tsx`:

1. Rode `pnpm generate:cv-pdf` (requer o Chromium do Playwright: `pnpm exec playwright install chromium`).
2. Commite o PDF junto com `scripts/cv-pdf.manifest.json`.

O `pnpm build` falha — local e na Vercel — se o PDF estiver dessincronizado com o conteúdo: a guarda `verify:cv-pdf` compara o hash SHA-256 do HTML de impressão com o manifesto gravado na última geração (sem precisar de Chromium).

## Desenvolvimento

Pré-requisitos: Node.js 24+ e pnpm.

```bash
pnpm install                       # instala as dependências
pnpm dev                           # servidor de desenvolvimento em http://localhost:3000
pnpm lint                          # ESLint
pnpm test:e2e                      # suíte Playwright (26 testes contra o build de produção)
pnpm build                         # verificação do PDF + next build
pnpm generate:cv-pdf               # (re)gera o PDF do currículo + manifesto de sincronização
pnpm generate:readme-screenshots   # (re)gera os screenshots deste README (site rodando via pnpm start)
```

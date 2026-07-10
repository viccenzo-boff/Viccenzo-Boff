# Currículo Técnico — Viccenzo Gottardo Boff

Portfólio/currículo digital de página única: Next.js (App Router) + TypeScript estrito + Tailwind CSS v4 + shadcn/ui, com deploy na Vercel.

A documentação viva está em [`.claudecode/prd.md`](.claudecode/prd.md) (produto) e [`.claudecode/architecture.md`](.claudecode/architecture.md) (arquitetura).

## Desenvolvimento

Pré-requisitos: Node.js 24+ e pnpm.

```bash
pnpm install          # instala as dependências
pnpm dev              # servidor de desenvolvimento em http://localhost:3000
pnpm lint             # ESLint
pnpm test:e2e         # suíte Playwright (26 testes contra o build de produção)
pnpm build            # verificação do PDF + next build
pnpm generate:cv-pdf  # (re)gera o PDF do currículo + manifesto de sincronização
```

## PDF do currículo (guarda de sincronização)

`public/curriculo-viccenzo-boff.pdf` é **versionado no git** e gerado localmente a partir de `src/data/cv.ts` — a imagem de build da Vercel não executa o Chromium do Playwright, então o PDF não é gerado no deploy.

Ao alterar `src/data/cv.ts` ou `src/components/print/cv-print-document.tsx`:

1. Rode `pnpm generate:cv-pdf` (requer o Chromium do Playwright: `pnpm exec playwright install chromium`).
2. Commite o PDF junto com `scripts/cv-pdf.manifest.json`.

O `pnpm build` falha — local e na Vercel — se o PDF estiver dessincronizado com o conteúdo: a guarda `verify:cv-pdf` compara o hash SHA-256 do HTML de impressão com o manifesto gravado na última geração (sem precisar de Chromium).

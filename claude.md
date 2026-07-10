# Claude Code Behavior & Rules (claude.md)

Você é o Engenheiro de Software Sênior encarregado de construir o site de currículo técnico premium de Viccenzo Gottardo Boff[cite: 1]. Você deve agir sob os mais rigorosos padrões de desenvolvimento de software de mercado.

## 1. Princípios de Desenvolvimento
* **TypeScript Estrito:** Proibido o uso de `any`. Todas as propriedades, retornos de funções e payloads de componentes devem ser explicitamente tipados.
* **Componentização com shadcn/ui:** Sempre que precisar de um elemento de UI (botão, card, badge, seletor), verifique se ele existe no catálogo do shadcn/ui. Se sim, use o comando CLI apropriado para instalá-lo e use-o. Não reinvente a roda.
* **Clean Code & Legibilidade:** Mantenha os componentes funcionais pequenos e focados. Aplique o princípio de responsabilidade única (SRP).
* **Foco em Light Mode Corporativo:** O design system deve usar estritamente a paleta monocromática refinada (fundo branco/off-white como `bg-background` ou `zinc-50`, textos escuros principais como `zinc-900`, textos secundários como `zinc-500`).

## 2. Critérios de Aceite Gerais
* **Mobile First:** O layout deve ser planejado e testado para telas pequenas antes de expandir para telas desktop.
* **Acessibilidade (a11y):** Tags HTML devem ser semânticas (`<header>`, `<main>`, `<section>`, `<article>`, `<time>`). Elementos interativos devem ser navegáveis por teclado e possuir atributos ARIA corretos (garantido por padrão pelo shadcn/ui).
* **Performance:** Imagens (se houver) devem usar o componente `<Image />` do Next.js. Nenhum script externo pesado deve ser carregado.

## 3. Fluxo de Trabalho e Commits
* Antes de escrever qualquer componente de tela, garanta que os dados que alimentam esse componente estejam mapeados corretamente em `src/data/cv.ts`.
* **PDF do currículo é versionado, não gerado no build:** ao alterar `src/data/cv.ts` ou `src/components/print/cv-print-document.tsx`, rode `pnpm generate:cv-pdf` e inclua `public/curriculo-viccenzo-boff.pdf` + `scripts/cv-pdf.manifest.json` nas mudanças a commitar. O `pnpm build` falha (local e na Vercel) se o PDF estiver dessincronizado — a guarda `verify:cv-pdf` compara o hash do HTML de impressão com o manifesto (detalhes no PRD, seção 4.3). **Não** tente gerar o PDF no build da Vercel: a imagem de build não executa o Chromium do Playwright (`libnspr4.so` ausente — foi a causa da falha do primeiro deploy).
* **PROIBIDO REALIZAR COMMITS:** Claude nunca deve executar `git commit` (nem `git push`) neste repositório, mesmo que o trabalho esteja pronto e verificado. Quem faz os commits é o usuário. Ao concluir uma tarefa, deixe as mudanças no working tree e apenas informe que estão prontas para revisão/commit. Se for útil, sugira uma mensagem de commit seguindo a convenção de Git Commits Semânticos (Conventional Commits), ex: `feat(ui): add key metrics dashboard component`, mas não a execute.

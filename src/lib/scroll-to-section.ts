const HIGHLIGHT_CLASS = "anchor-highlight";
const HIGHLIGHT_DURATION_MS = 1600;

/**
 * Rola suavemente até a seção `sectionId` e aplica um destaque temporário (`.anchor-highlight`, 1,6s).
 * No-op quando o elemento não existe. Respeita `prefers-reduced-motion` (usa scroll `"auto"` em vez de `"smooth"`).
 * Reinicia a animação de destaque via reflow forçado quando a mesma seção é reselecionada.
 */
export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  target.classList.remove(HIGHLIGHT_CLASS);
  // Força reflow para reiniciar a animação caso a mesma seção seja selecionada de novo.
  void target.offsetWidth;
  target.classList.add(HIGHLIGHT_CLASS);
  window.setTimeout(() => target.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_DURATION_MS);
}

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { scrollToSection } from "./scroll-to-section";

const HIGHLIGHT_CLASS = "anchor-highlight";
const HIGHLIGHT_DURATION_MS = 1600;

function mockMatchMedia(prefersReduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: prefersReduced,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("scrollToSection", () => {
  let scrollSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    scrollSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollSpy;
    mockMatchMedia(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("não faz nada quando a seção não existe", () => {
    expect(() => scrollToSection("secao-inexistente")).not.toThrow();
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("rola até a seção e aplica o destaque temporário", () => {
    const section = document.createElement("section");
    section.id = "projetos";
    document.body.appendChild(section);

    scrollToSection("projetos");

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(section.classList.contains(HIGHLIGHT_CLASS)).toBe(true);

    vi.advanceTimersByTime(HIGHLIGHT_DURATION_MS);
    expect(section.classList.contains(HIGHLIGHT_CLASS)).toBe(false);
  });

  it("usa scroll instantâneo sob prefers-reduced-motion", () => {
    mockMatchMedia(true);
    const section = document.createElement("section");
    section.id = "inicio";
    document.body.appendChild(section);

    scrollToSection("inicio");

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
  });
});

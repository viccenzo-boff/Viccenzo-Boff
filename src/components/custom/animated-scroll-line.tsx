"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

// A linha nasce como um sublinhado sob o resumo do Hero (~7,5% do documento),
// sai na horizontal e mergulha na serpentina. Nós em frações da página (x, y),
// com tangentes verticais e pontos de controle espelhados — curva C1-contínua,
// sem quinas. 8 travessias ≈ uma por seção da página.
const START: readonly [number, number] = [0.16, 0.108];

const NODES: ReadonlyArray<readonly [number, number]> = [
  [0.9, 0.185],
  [0.08, 0.28],
  [0.92, 0.4],
  [0.1, 0.52],
  [0.88, 0.64],
  [0.06, 0.77],
  [0.94, 0.9],
  [0.15, 1.02],
];

// Metade do vão vertical entre nós — controla a abertura de cada curva
const CONTROL_OFFSET = 0.06;

// Alcance horizontal da tangente de saída do sublinhado inicial (fração da largura)
const START_PULL = 0.4;

const GRADIENT_ID = "scroll-line-gradient";

interface OverlaySize {
  width: number;
  height: number;
}

// O path é gerado em pixels reais do documento (viewBox 1:1): escala uniforme
// mantém a espessura constante e preserva a normalização do pathLength no draw.
function buildPathD({ width, height }: OverlaySize): string {
  const [startX, startY] = START;
  const segments = [`M ${startX * width} ${startY * height}`];
  let previous: readonly [number, number] | null = null;
  for (const node of NODES) {
    const [x, y] = node;
    const control2 = `${x * width} ${(y - CONTROL_OFFSET) * height}`;
    if (previous === null) {
      // Saída horizontal (o sublinhado do Hero) rumo à primeira curva vertical
      segments.push(
        `C ${(startX + START_PULL) * width} ${startY * height}, ${control2}, ${x * width} ${y * height}`,
      );
    } else {
      const [previousX, previousY] = previous;
      segments.push(
        `C ${previousX * width} ${(previousY + CONTROL_OFFSET) * height}, ${control2}, ${x * width} ${y * height}`,
      );
    }
    previous = node;
  }
  return segments.join(" ");
}

function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getPrefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerPrefersReducedMotion(): boolean {
  return false;
}

export function AnimatedScrollLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<OverlaySize | null>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getPrefersReducedMotion,
    getServerPrefersReducedMotion,
  );
  const { scrollYProgress } = useScroll();
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });
  // Sob reduced motion o desenho segue o scroll 1:1 (progresso acionado pelo
  // usuário, não animação autônoma) — sem a inércia do spring; o pulse do glow
  // é desativado pela media query em globals.css.
  const pathLength = prefersReducedMotion ? scrollYProgress : smoothedProgress;
  // Sem isso, o linecap redondo deixa um ponto visível no início do path
  // mesmo com pathLength 0 — o traço só aparece quando o desenho começa.
  const strokeOpacity = useTransform(pathLength, [0, 0.01], [0, 1]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((previous) =>
        previous !== null && previous.width === width && previous.height === height
          ? previous
          : { width, height },
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sharedPathProps =
    size !== null
      ? ({
          d: buildPathD(size),
          stroke: `url(#${GRADIENT_ID})`,
          strokeLinecap: "round",
        } as const)
      : null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-testid="scroll-progress-line"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ opacity: "var(--scroll-line-opacity)" }}
    >
      {sharedPathProps !== null && size !== null && size.height > 0 && (
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--scroll-line-from)" }} />
              <stop offset="50%" style={{ stopColor: "var(--scroll-line-via)" }} />
              <stop offset="100%" style={{ stopColor: "var(--scroll-line-to)" }} />
            </linearGradient>
          </defs>
          {/* O fade fica no <g>: a animação CSS do pulse já ocupa a opacity do path */}
          <motion.g style={{ opacity: strokeOpacity }}>
            <motion.path
              {...sharedPathProps}
              strokeWidth={7}
              className="scroll-line-glow"
              style={{ pathLength }}
            />
          </motion.g>
          <motion.path
            {...sharedPathProps}
            strokeWidth={2.5}
            style={{ pathLength, opacity: strokeOpacity }}
            data-testid="scroll-progress-path"
          />
        </svg>
      )}
    </div>
  );
}

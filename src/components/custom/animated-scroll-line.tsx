"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring } from "motion/react";

// Nós da serpentina em frações da página (x, y). Tangentes verticais nos nós e
// pontos de controle espelhados entre segmentos — a curva é C1-contínua, sem quinas.
// 8 travessias ≈ uma por seção da página.
const NODES: ReadonlyArray<readonly [number, number]> = [
  [0.12, -0.02],
  [0.9, 0.12],
  [0.08, 0.25],
  [0.92, 0.38],
  [0.1, 0.51],
  [0.88, 0.64],
  [0.06, 0.77],
  [0.94, 0.9],
  [0.15, 1.02],
];

// Metade do vão vertical entre nós — controla a abertura de cada curva
const CONTROL_OFFSET = 0.065;

const GRADIENT_ID = "scroll-line-gradient";

interface OverlaySize {
  width: number;
  height: number;
}

// O path é gerado em pixels reais do documento (viewBox 1:1): escala uniforme
// mantém a espessura constante e preserva a normalização do pathLength no draw.
function buildPathD({ width, height }: OverlaySize): string {
  const segments: string[] = [];
  let previous: readonly [number, number] | null = null;
  for (const node of NODES) {
    const [x, y] = node;
    if (previous === null) {
      segments.push(`M ${x * width} ${y * height}`);
    } else {
      const [previousX, previousY] = previous;
      const control1Y = (previousY + CONTROL_OFFSET) * height;
      const control2Y = (y - CONTROL_OFFSET) * height;
      segments.push(
        `C ${previousX * width} ${control1Y}, ${x * width} ${control2Y}, ${x * width} ${y * height}`,
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
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

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
          {prefersReducedMotion ? (
            <path {...sharedPathProps} strokeWidth={2.5} data-testid="scroll-progress-path" />
          ) : (
            <>
              <motion.path
                {...sharedPathProps}
                strokeWidth={7}
                className="scroll-line-glow"
                style={{ pathLength }}
              />
              <motion.path
                {...sharedPathProps}
                strokeWidth={2.5}
                style={{ pathLength }}
                data-testid="scroll-progress-path"
              />
            </>
          )}
        </svg>
      )}
    </div>
  );
}

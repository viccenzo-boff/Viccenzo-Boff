"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";

// A linha nasce fora da borda esquerda da tela, no vão entre o título da
// primeira seção ("Painel de Impacto") e o primeiro card, e desce ancorada ao
// DOM real (nada de frações fixas do documento — elas caem em lugares
// diferentes no mobile e no desktop). Em cada seção seguinte: um "portão"
// prende a linha no trilho direito exatamente na faixa vertical do título e
// um mergulho leva ao centro do conteúdo — profundo à esquerda em seções
// alternadas, suave ao meio nas demais (~1 travessia por seção). Tangentes
// verticais em todas as âncoras: curva monotônica em y — cada faixa de
// título é cruzada uma única vez, sempre no trilho, o que garante que a
// linha nunca passa por cima do texto de um título. Nos portões, o flanco
// mais largo é recolhido até a curvatura do mais apertado (junção G2): a
// ponta no trilho fecha redonda, com o mesmo raio dos dois lados.
//
// A monotonia em y também alimenta o desenho: um mapa y → fração do
// comprimento converte a âncora perseguida (~45% da altura do viewport,
// deslizando até a base no fim da página) na fração-alvo; a fração desenhada
// segue o alvo com uma mola criticamente amortecida — rigidez por tipo de
// ponteiro — e teto de velocidade de desenho: no toque a ponta desce junto
// com a tela, no mouse cada tick de roda vira uma caminhada suave de A a B.

// Trilho direito: fração mínima da largura e folga além do título mais largo
const RAIL_X_FRACTION = 0.9;
const RAIL_TITLE_CLEARANCE = 26;
const RAIL_EDGE_MARGIN = 12;

// Mergulhos ao centro do conteúdo: profundo (esquerda) alterna com suave (meio)
const DIP_DEEP_X_FRACTION = 0.07;
const DIP_SHALLOW_X_FRACTION = 0.5;

// Início fora da tela (esconde o linecap redondo) com saída horizontal
const START_EDGE_OVERSHOOT = 16;
const START_PULL = 0.35;

// Saída pelo rodapé, além da borda inferior do documento
const EXIT_X_FRACTION = 0.6;
const EXIT_OVERSHOOT = 40;

// Resolução da amostragem do mapa y → fração do comprimento
const DRAW_MAP_STEPS_PER_SEGMENT = 24;

// Perseguição da ponta: repouso a ~45% do viewport (deslizando até a base no
// fim da página). A fração desenhada segue a fração-alvo com uma mola
// criticamente amortecida (sem oscilação nem overshoot — a linha nunca
// "desdesenha" sozinha), integrada em forma fechada: estável para qualquer
// dt, inclusive frames longos de jank no mobile. A mola parte de velocidade
// zero a cada mudança de alvo — movimento em "S", sem o arranque inicial
// que o alisamento exponencial (front-loaded) dava a cada tick de roda.
// A rigidez muda com o ponteiro primário, porque o scroll é outro:
// - toque (pointer: coarse): scroll contínuo com inércia — a ponta desce
//   "junto com a tela", acompanhando flings com atraso menor que meia tela;
// - mouse (pointer: fine): scroll em degraus — cada tick vira uma caminhada
//   A→B de ~0,5s, visível, nem dardo nem tartaruga.
// O teto de velocidade de desenho transforma saltos grandes do alvo (cauda
// inicial quase horizontal, pulo direto ao rodapé) em varredura contínua.
// Descartes medidos em quatro rodadas com o usuário: spring rígido sobre a
// fração ("arranques"), perseguição a ≤120px/s em y (ponta 1326px acima do
// viewport em scroll real — o traço inteiro saltava com a página) e
// alisamento exponencial único (dardo por tick no mouse, tartaruga no fling).
const TIP_ANCHOR_FRACTION = 0.45;
const TIP_STIFFNESS_FINE = 10; // rad/s — assentamento ~0,5s por tick de roda
const TIP_STIFFNESS_COARSE = 20; // rad/s — assentamento ~0,25s, cola no toque
const TIP_MAX_DRAW_SPEED_FINE = 3000; // px de comprimento do path por segundo
const TIP_MAX_DRAW_SPEED_COARSE = 6000; // flings não podem esbarrar no teto

const GRADIENT_ID = "scroll-line-gradient";

interface OverlaySize {
  width: number;
  height: number;
}

interface SectionAnchor {
  titleMidY: number;
  titleTextRight: number;
  gapMidY: number;
  contentMidY: number;
}

type LinePoint = readonly [number, number];

interface CubicSegment {
  from: LinePoint;
  control1: LinePoint;
  control2: LinePoint;
  to: LinePoint;
}

interface LineLayout {
  size: OverlaySize;
  d: string;
  // Amostras [y no documento, fração do comprimento], em y crescente
  drawMap: ReadonlyArray<LinePoint>;
  // Comprimento total do path em px — converte o limite de velocidade de
  // desenho (px/s) em fração por segundo
  totalLength: number;
}

// Mede as seções tituladas (h2) em coordenadas do documento. O retângulo do
// texto do título vem de um Range — o bloco h2 ocupa a largura toda e não
// serve para calcular a folga do trilho.
function measureSectionAnchors(): SectionAnchor[] {
  const anchors: SectionAnchor[] = [];
  const scrollY = window.scrollY;
  for (const section of document.querySelectorAll("main section")) {
    const title = section.querySelector("h2");
    const content = title?.nextElementSibling;
    if (!title || !content) continue;
    const range = document.createRange();
    range.selectNodeContents(title);
    const textRect = range.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    anchors.push({
      titleMidY: (textRect.top + textRect.bottom) / 2 + scrollY,
      titleTextRight: textRect.right,
      gapMidY: (titleRect.bottom + contentRect.top) / 2 + scrollY,
      contentMidY: (contentRect.top + sectionRect.bottom) / 2 + scrollY,
    });
  }
  return anchors;
}

function buildSegments(
  width: number,
  startY: number,
  points: ReadonlyArray<LinePoint>,
): CubicSegment[] {
  const start: LinePoint = [-START_EDGE_OVERSHOOT, startY];
  // Vão vertical e percurso horizontal efetivo de cada segmento (o braço do
  // 1º segmento nasce em START_PULL — a saída da borda é horizontal).
  const gaps: number[] = [];
  const runs: number[] = [];
  let previousMeasure = start;
  points.forEach((point, index) => {
    gaps.push(Math.max(point[1] - previousMeasure[1], 1));
    const armX = index === 0 ? width * START_PULL : previousMeasure[0];
    runs.push(Math.max(Math.abs(point[0] - armX), 1));
    previousMeasure = point;
  });
  // Braços de controle verticais de cada segmento, a meio vão por padrão —
  // com braço inicial + final ≤ vão, a curva permanece monotônica em y.
  const startArms = gaps.map((gap) => gap / 2);
  const endArms = gaps.map((gap) => gap / 2);
  // Portões (âncoras pares; a última âncora é a saída pelo rodapé): com
  // braços a meio vão, cada flanco fecha no ápice com raio próprio
  // r = (3/8)·vão²/percurso — raios desiguais na emenda liam-se como "bico"
  // (até ~6× entre flancos). O flanco mais largo é recolhido até o raio do
  // mais apertado — braço d = √(2·r·percurso/3) produz curvatura 1/r no
  // ápice — e a emenda vira G2: ponta redonda, sem alterar o flanco que já
  // era o mais fechado nem os braços do lado dos mergulhos (d ≤ meio vão
  // preserva a monotonia em y).
  for (let gate = 0; gate + 1 < points.length; gate += 2) {
    const gapIn = gaps[gate];
    const gapOut = gaps[gate + 1];
    const runIn = runs[gate];
    const runOut = runs[gate + 1];
    if (
      gapIn === undefined ||
      gapOut === undefined ||
      runIn === undefined ||
      runOut === undefined
    ) {
      continue;
    }
    const radius = Math.min(
      (3 * gapIn * gapIn) / (8 * runIn),
      (3 * gapOut * gapOut) / (8 * runOut),
    );
    endArms[gate] = Math.sqrt((2 * radius * runIn) / 3);
    startArms[gate + 1] = Math.sqrt((2 * radius * runOut) / 3);
  }
  const segments: CubicSegment[] = [];
  let previous = start;
  points.forEach((point, index) => {
    const [x, y] = point;
    const [previousX, previousY] = previous;
    // Saída horizontal rente à borda rumo ao primeiro portão no trilho
    const control1: LinePoint =
      index === 0
        ? [width * START_PULL, startY]
        : [previousX, previousY + (startArms[index] ?? 0)];
    segments.push({
      from: previous,
      control1,
      control2: [x, y - (endArms[index] ?? 0)],
      to: point,
    });
    previous = point;
  });
  return segments;
}

function buildPathD(segments: ReadonlyArray<CubicSegment>): string {
  const first = segments[0];
  if (first === undefined) return "";
  const parts = [`M ${first.from[0]} ${first.from[1]}`];
  for (const { control1, control2, to } of segments) {
    parts.push(
      `C ${control1[0]} ${control1[1]}, ${control2[0]} ${control2[1]}, ${to[0]} ${to[1]}`,
    );
  }
  return parts.join(" ");
}

function cubicPoint(segment: CubicSegment, t: number): LinePoint {
  const inverse = 1 - t;
  const a = inverse * inverse * inverse;
  const b = 3 * inverse * inverse * t;
  const c = 3 * inverse * t * t;
  const d = t * t * t;
  return [
    a * segment.from[0] + b * segment.control1[0] + c * segment.control2[0] + d * segment.to[0],
    a * segment.from[1] + b * segment.control1[1] + c * segment.control2[1] + d * segment.to[1],
  ];
}

// Amostra o path e associa cada y do documento à fração do comprimento já
// percorrida — bem definido porque a curva é monotônica em y.
function buildDrawMap(segments: ReadonlyArray<CubicSegment>): {
  entries: ReadonlyArray<LinePoint>;
  totalLength: number;
} {
  const entries: Array<[number, number]> = [];
  let length = 0;
  let previous: LinePoint | null = null;
  for (const segment of segments) {
    for (let step = previous === null ? 0 : 1; step <= DRAW_MAP_STEPS_PER_SEGMENT; step++) {
      const point = cubicPoint(segment, step / DRAW_MAP_STEPS_PER_SEGMENT);
      if (previous !== null) {
        length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
      }
      entries.push([point[1], length]);
      previous = point;
    }
  }
  const total = length > 0 ? length : 1;
  return {
    entries: entries.map(([y, cumulative]) => [y, cumulative / total] as const),
    totalLength: total,
  };
}

function lengthFractionAtY(drawMap: ReadonlyArray<LinePoint>, y: number): number {
  const first = drawMap[0];
  const last = drawMap[drawMap.length - 1];
  if (first === undefined || last === undefined) return 0;
  if (y <= first[0]) return 0;
  if (y >= last[0]) return 1;
  let low = 0;
  let high = drawMap.length - 1;
  while (high - low > 1) {
    const mid = (low + high) >> 1;
    const entry = drawMap[mid];
    if (entry === undefined) break;
    if (entry[0] <= y) low = mid;
    else high = mid;
  }
  const lowEntry = drawMap[low];
  const highEntry = drawMap[high];
  if (lowEntry === undefined || highEntry === undefined) return 0;
  const span = highEntry[0] - lowEntry[0];
  // Trechos quase horizontais (a cauda inicial) podem repetir o mesmo y
  if (span <= 0) return highEntry[1];
  return lowEntry[1] + ((y - lowEntry[0]) / span) * (highEntry[1] - lowEntry[1]);
}
function buildLayout(size: OverlaySize): LineLayout | null {
  const { width, height } = size;
  if (width === 0 || height === 0) return null;
  const anchors = measureSectionAnchors();
  const [firstSection, ...sections] = anchors;
  if (firstSection === undefined || sections.length === 0) return null;
  const railX = Math.min(
    Math.max(
      width * RAIL_X_FRACTION,
      Math.max(...anchors.map((anchor) => anchor.titleTextRight)) + RAIL_TITLE_CLEARANCE,
    ),
    width - RAIL_EDGE_MARGIN,
  );
  const points: Array<LinePoint> = [];
  sections.forEach((section, index) => {
    points.push([railX, section.titleMidY]);
    const dipXFraction = index % 2 === 0 ? DIP_DEEP_X_FRACTION : DIP_SHALLOW_X_FRACTION;
    points.push([width * dipXFraction, section.contentMidY]);
  });
  points.push([width * EXIT_X_FRACTION, height + EXIT_OVERSHOOT]);
  const segments = buildSegments(width, firstSection.gapMidY, points);
  const { entries, totalLength } = buildDrawMap(segments);
  return { size, d: buildPathD(segments), drawMap: entries, totalLength };
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

// Ponteiro primário grosso (toque) vs. fino (mouse) — decide a rigidez da mola
function subscribeToCoarsePointer(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia("(pointer: coarse)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getIsCoarsePointer(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

function getServerIsCoarsePointer(): boolean {
  return false;
}

export function AnimatedScrollLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<LineLayout | null>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getPrefersReducedMotion,
    getServerPrefersReducedMotion,
  );
  const isCoarsePointer = useSyncExternalStore(
    subscribeToCoarsePointer,
    getIsCoarsePointer,
    getServerIsCoarsePointer,
  );
  const { scrollYProgress } = useScroll();
  // Fração desenhada (0→1), derivada da posição da ponta em px do documento
  const pathLength = useMotionValue(0);
  // Estado da ponta: fração do comprimento já desenhada (0 = início do path,
  // nada desenhado no load) e velocidade da mola em fração por segundo. O
  // estado vive em fração — e não em y — para o teto de velocidade de
  // desenho valer nos trechos quase horizontais, onde y quase não distingue
  // posições ao longo da curva.
  const tipFractionRef = useRef(0);
  const tipVelocityRef = useRef(0);

  useAnimationFrame((_, delta) => {
    if (layout === null) return;
    const { drawMap, totalLength } = layout;
    const viewportHeight = window.innerHeight;
    const progress = scrollYProgress.get();
    // Âncora da ponta dentro do viewport, deslizando até a base da tela no
    // fim da página para o desenho terminar completo no rodapé
    const anchorY =
      viewportHeight * (TIP_ANCHOR_FRACTION + (1 - TIP_ANCHOR_FRACTION) * progress);
    const targetY = progress * Math.max(layout.size.height - viewportHeight, 0) + anchorY;
    const targetFraction = lengthFractionAtY(drawMap, targetY);
    const previousFraction = tipFractionRef.current;
    let fraction: number;
    if (prefersReducedMotion) {
      // Progresso acionado pelo usuário, não animação autônoma: segue o
      // scroll 1:1; o pulse do glow é desativado em globals.css.
      fraction = targetFraction;
      tipVelocityRef.current = 0;
    } else {
      // dt largo o bastante para frames de jank não "roubarem" tempo da
      // mola (a forma fechada é estável mesmo com passos longos)
      const dt = Math.min(delta, 250) / 1000;
      const omega = isCoarsePointer ? TIP_STIFFNESS_COARSE : TIP_STIFFNESS_FINE;
      const maxDrawSpeed = isCoarsePointer
        ? TIP_MAX_DRAW_SPEED_COARSE
        : TIP_MAX_DRAW_SPEED_FINE;
      // Mola criticamente amortecida com alvo fixo durante o frame, em forma
      // fechada: err(t) = e^(−ω·t) · (err0 + (v0 + ω·err0)·t)
      const err0 = previousFraction - targetFraction;
      const v0 = tipVelocityRef.current;
      const b = v0 + omega * err0;
      const decay = Math.exp(-omega * dt);
      let velocity = (v0 - omega * b * dt) * decay;
      fraction = targetFraction + (err0 + b * dt) * decay;
      // Teto de velocidade de desenho; a velocidade da mola acompanha o
      // corte para não acumular ímpeto fantasma enquanto o teto segura
      const maxStep = (maxDrawSpeed * dt) / totalLength;
      const step = fraction - previousFraction;
      if (Math.abs(step) > maxStep) {
        fraction = previousFraction + Math.sign(step) * maxStep;
        velocity = (Math.sign(step) * maxDrawSpeed) / totalLength;
      }
      tipVelocityRef.current = velocity;
    }
    tipFractionRef.current = fraction;
    if (Math.abs(fraction - pathLength.get()) > 0.00001) {
      pathLength.set(fraction);
    }
  });

  // Sem isso, o linecap redondo deixa um ponto visível no início do path
  // mesmo com pathLength 0 — o traço só aparece quando o desenho começa.
  const strokeOpacity = useTransform(pathLength, [0, 0.01], [0, 1]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    // O overlay cobre o documento inteiro: qualquer reflow (viewport, fontes,
    // conteúdo) muda o tamanho dele e dispara a remedição das âncoras.
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setLayout((previous) =>
        previous !== null &&
        previous.size.width === width &&
        previous.size.height === height
          ? previous
          : buildLayout({ width, height }),
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sharedPathProps =
    layout !== null
      ? ({
          d: layout.d,
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
      {sharedPathProps !== null && layout !== null && (
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${layout.size.width} ${layout.size.height}`}
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

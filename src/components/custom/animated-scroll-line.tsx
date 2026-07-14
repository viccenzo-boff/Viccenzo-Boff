"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";

// A linha vive inteiramente numa FAIXA ESTREITA À DIREITA da tela: nasce fora
// da borda direita, no vão entre o título da primeira seção ("Painel de
// Impacto") e o primeiro card, e desce ancorada ao DOM real (nada de frações
// fixas do documento — elas caem em lugares diferentes no mobile e no
// desktop). Em cada seção seguinte: um "portão" prende a linha no extremo
// direito da faixa exatamente na faixa vertical do título e um mergulho recua
// só até a borda interna da faixa (~1 oscilação por seção). A curva JAMAIS
// cruza o centro nem a esquerda, onde ficam os títulos alinhados à esquerda —
// o não-cruzamento passa a ser garantido pela GEOMETRIA (a faixa é disjunta
// da coluna dos títulos), reforçado pela monotonia em y (cada faixa vertical
// de título é atravessada uma única vez, sempre presa ao trilho direito).
// Tangentes verticais em todas as âncoras. Nos portões, o flanco mais largo é
// recolhido até a curvatura do mais apertado (junção G2): a ponta no trilho
// fecha redonda, com o mesmo raio dos dois lados.
//
// A monotonia em y também alimenta o desenho: um mapa y → fração do
// comprimento converte a âncora da ponta (~45% da altura do viewport,
// deslizando até a base no fim da página) na fração desenhada — vínculo 1:1
// com o scroll: a fração é função pura da posição de scroll, e a linha só se
// move quando (e na exata proporção em que) a página se move.

// Extremo direito da faixa: fração mínima da largura (âncora do título/portão)
// e folga além do título mais largo, limitada à borda direita.
const RAIL_X_FRACTION = 0.92;
const RAIL_TITLE_CLEARANCE = 26;
const RAIL_EDGE_MARGIN = 12;

// Borda interna da faixa: o quanto o mergulho ao conteúdo recua para dentro,
// ainda dentro da margem direita (jamais no miolo do texto, à esquerda). A
// oscilação da linha fica confinada a ≈ [DIP_X_FRACTION, RAIL_X_FRACTION].
const DIP_X_FRACTION = 0.76;

// Início fora da borda DIREITA (esconde o linecap redondo). O braço de
// controle horizontal também mora na faixa, então a entrada varre de cima
// para baixo dentro da margem direita — sem nunca atravessar a tela.
const START_EDGE_OVERSHOOT = 16;
const START_ARM_X_FRACTION = 0.88;

// Saída pelo rodapé, além da borda inferior do documento, mantida na faixa
const EXIT_X_FRACTION = 0.8;
const EXIT_OVERSHOOT = 40;

// Resolução da amostragem do mapa y → fração do comprimento
const DRAW_MAP_STEPS_PER_SEGMENT = 24;

// Âncora da ponta em repouso: ~45% do viewport, deslizando até a base da
// tela no fim da página (o desenho termina completo no rodapé)
const TIP_ANCHOR_FRACTION = 0.45;

// Marcador de build no DOM (data-line-version): durante a investigação de
// fluidez (docs/scroll-line-postmortem.md), retestes do usuário rodaram
// versões velhas em produção sem ninguém perceber — confirme a versão sob
// teste antes de tirar qualquer conclusão sobre o comportamento da linha.
// v2.20: geometria confinada à margem direita (semântica de desenho 1:1 da
// v2.5 preservada — só as coordenadas x das âncoras mudaram).
const LINE_VERSION = "v2.20-right-margin";

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
  // Altura do viewport congelada no rebuild do layout. Nunca ler
  // window.innerHeight por frame: no mobile ela muda quando a barra de URL
  // recolhe no meio do scroll, e um denominador vivo deslocaria âncora e
  // progresso sem nenhum input de scroll — um degrau visível na linha.
  viewportHeight: number;
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
  const start: LinePoint = [width + START_EDGE_OVERSHOOT, startY];
  // Vão vertical e percurso horizontal efetivo de cada segmento (o braço do
  // 1º segmento nasce em START_ARM_X_FRACTION — a saída da borda direita é
  // horizontal e dentro da faixa).
  const gaps: number[] = [];
  const runs: number[] = [];
  let previousMeasure = start;
  points.forEach((point, index) => {
    gaps.push(Math.max(point[1] - previousMeasure[1], 1));
    const armX = index === 0 ? width * START_ARM_X_FRACTION : previousMeasure[0];
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
    // Saída horizontal rente à borda direita rumo ao primeiro portão no trilho
    const control1: LinePoint =
      index === 0
        ? [width * START_ARM_X_FRACTION, startY]
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
function buildDrawMap(segments: ReadonlyArray<CubicSegment>): ReadonlyArray<LinePoint> {
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
  return entries.map(([y, cumulative]) => [y, cumulative / total] as const);
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
  sections.forEach((section) => {
    points.push([railX, section.titleMidY]);
    points.push([width * DIP_X_FRACTION, section.contentMidY]);
  });
  points.push([width * EXIT_X_FRACTION, height + EXIT_OVERSHOOT]);
  const segments = buildSegments(width, firstSection.gapMidY, points);
  return {
    size,
    d: buildPathD(segments),
    drawMap: buildDrawMap(segments),
    viewportHeight: window.innerHeight,
  };
}

// Vínculo 1:1 com o scroll: a fração desenhada é uma função pura e
// determinística da posição de scroll — sem física de perseguição. Mola,
// alisamento exponencial e tetos de velocidade foram tentados em quatro
// versões e removidos de propósito: qualquer sistema dinâmico entre o
// scroll e o desenho ou atrasa (a ponta sai da tela e o traço inteiro salta
// junto com a página — o "teleporte") ou dispara (dardo a cada tick de
// roda). Não reintroduzir suavização aqui; histórico e medições em
// docs/scroll-line-postmortem.md.
function drawnFractionAt(layout: LineLayout, scrollY: number): number {
  const scrollRange = Math.max(layout.size.height - layout.viewportHeight, 0);
  // Clamp cobre overscroll elástico (scrollY negativo ou além do fim)
  const clampedY = Math.min(Math.max(scrollY, 0), scrollRange);
  const progress = scrollRange > 0 ? clampedY / scrollRange : 1;
  const anchorY =
    layout.viewportHeight * (TIP_ANCHOR_FRACTION + (1 - TIP_ANCHOR_FRACTION) * progress);
  return lengthFractionAtY(layout.drawMap, clampedY + anchorY);
}

export function AnimatedScrollLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<LineLayout | null>(null);
  // scrollY cru (px), não scrollYProgress: o denominador do progresso vem do
  // layout congelado (drawnFractionAt) — o denominador vivo do motion muda
  // com a barra de URL do mobile e criaria degraus sem input de scroll.
  const { scrollY } = useScroll();
  // Fração desenhada (0→1) do comprimento do path
  const pathLength = useMotionValue(0);

  // Recalcula por evento de scroll e por rebuild de layout — fora disso nada
  // roda (não há loop por frame). Sob prefers-reduced-motion o comportamento
  // é o mesmo: o draw já é progresso acionado pelo usuário, não animação
  // autônoma; o pulse do glow é desativado em globals.css.
  useEffect(() => {
    if (layout === null) return;
    const update = (value: number) => {
      const fraction = drawnFractionAt(layout, value);
      if (Math.abs(fraction - pathLength.get()) > 0.00001) {
        pathLength.set(fraction);
      }
    };
    // Cobre scroll restaurado pelo navegador no load e o rebuild de layout
    update(scrollY.get());
    return scrollY.on("change", update);
  }, [layout, scrollY, pathLength]);

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
      data-line-version={LINE_VERSION}
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

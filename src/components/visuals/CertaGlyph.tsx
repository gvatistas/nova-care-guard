import * as React from "react";
import { motion } from "framer-motion";

/**
 * CertaGlyph — animated pixel/maze plate built on the same geometric DNA as
 * the Certa mark: square cell grid, right-angle traces, central node, and
 * registration brackets. Renders as crisp vector pixels (no raster). Used as
 * hero/architecture visual.
 *
 * Cell coordinates live in a UNITxUNIT grid; SVG viewBox auto-fits.
 */

type Props = {
  size?: number;
  /** unit grid resolution (must be even). Default 24. */
  unit?: number;
  className?: string;
  /** Render an outer rounded-square frame like the brandmark. */
  frame?: boolean;
  /** Ambient animation speed multiplier. */
  speed?: number;
};

const COLORS = {
  base: "hsl(213 11% 88%)",        // bone — primary trace
  dim:  "hsl(220 13% 22%)",        // rule — dim grid
  ink:  "hsl(224 24% 14%)",        // ink — bg
  carbon: "hsl(220 43% 8%)",
  blue: "hsl(217 91% 60%)",
  amber:"hsl(32 95% 44%)",
  green:"hsl(158 82% 39%)",
};

/* Curated maze paths — orthogonal, mirror-symmetric, evoking the brandmark.
   Coordinates in a 24x24 grid; each path is a polyline of grid points. */
const MAZE_PATHS: { pts: [number, number][]; tone: "base" | "blue" | "amber" | "green" }[] = [
  // outer ring fragments (top-left quadrant), then mirrored
  { pts: [[2,4],[2,2],[6,2],[6,5],[9,5],[9,8]], tone: "base" },
  { pts: [[4,8],[4,11],[7,11],[7,9]], tone: "base" },
  { pts: [[2,10],[2,14],[5,14]], tone: "base" },
  { pts: [[5,17],[2,17],[2,21],[6,21],[6,19],[9,19],[9,16]], tone: "base" },
  // top-right (mirrored)
  { pts: [[22,4],[22,2],[18,2],[18,5],[15,5],[15,8]], tone: "base" },
  { pts: [[20,8],[20,11],[17,11],[17,9]], tone: "base" },
  { pts: [[22,10],[22,14],[19,14]], tone: "base" },
  { pts: [[19,17],[22,17],[22,21],[18,21],[18,19],[15,19],[15,16]], tone: "base" },
  // diagonal arrow stubs from corners pointing inward (axial)
  { pts: [[3,3],[5,3],[5,5]], tone: "blue" },
  { pts: [[21,3],[19,3],[19,5]], tone: "blue" },
  { pts: [[3,21],[5,21],[5,19]], tone: "blue" },
  { pts: [[21,21],[19,21],[19,19]], tone: "blue" },
  // inner cross arms reaching the central square
  { pts: [[12,4],[12,9]], tone: "amber" },
  { pts: [[12,15],[12,20]], tone: "amber" },
  { pts: [[4,12],[9,12]], tone: "amber" },
  { pts: [[15,12],[20,12]], tone: "amber" },
];

const polyD = (pts: [number, number][]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

const Packet = ({ d, delay, dur, color }: { d: string; delay: number; dur: number; color: string }) => (
  <g>
    <circle r={0.42} fill={color} opacity={0.95} style={{ filter: `drop-shadow(0 0 0.6px ${color})` }}>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${delay}s`} path={d} rotate="auto" />
      <animate attributeName="opacity" values="0;1;1;0" dur={`${dur}s`} repeatCount="indefinite" begin={`${delay}s`} />
    </circle>
  </g>
);

const CertaGlyph: React.FC<Props> = ({
  size = 520,
  unit = 24,
  className = "",
  frame = true,
  speed = 1,
}) => {
  const pad = 1.5;
  const vb = unit + pad * 2;

  // Pre-render a faint pixel grid (every cell)
  const grid = [];
  for (let i = 0; i <= unit; i++) {
    grid.push(
      <line key={`h${i}`} x1={0} y1={i} x2={unit} y2={i} stroke={COLORS.dim} strokeWidth={0.04} opacity={0.55} />,
      <line key={`v${i}`} x1={i} y1={0} x2={i} y2={unit} stroke={COLORS.dim} strokeWidth={0.04} opacity={0.55} />
    );
  }

  // Pixel "studs" at the maze vertices for the chunky-pixel aesthetic
  const studs = MAZE_PATHS.flatMap((p, pi) =>
    p.pts.map(([x, y], i) => (
      <rect
        key={`s-${pi}-${i}`}
        x={x - 0.18}
        y={y - 0.18}
        width={0.36}
        height={0.36}
        fill={COLORS.base}
        opacity={0.85}
      />
    ))
  );

  return (
    <div className={className} style={{ width: size, height: size, position: "relative" }}>
      {/* soft halo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -size * 0.08,
          background:
            "radial-gradient(circle at 50% 50%, hsla(217,91%,60%,0.08), transparent 60%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <svg
        viewBox={`${-pad} ${-pad} ${vb} ${vb}`}
        width={size}
        height={size}
        style={{ position: "relative", display: "block", shapeRendering: "crispEdges" }}
        aria-hidden
      >
        {/* outer rounded frame, brandmark-style */}
        {frame && (
          <rect
            x={0.5}
            y={0.5}
            width={unit - 1}
            height={unit - 1}
            rx={1.4}
            ry={1.4}
            fill="none"
            stroke={COLORS.base}
            strokeWidth={0.18}
            opacity={0.9}
          />
        )}

        {/* faint pixel grid */}
        <g>{grid}</g>

        {/* maze traces */}
        {MAZE_PATHS.map((p, i) => {
          const stroke =
            p.tone === "blue"  ? COLORS.blue  :
            p.tone === "amber" ? COLORS.amber :
            p.tone === "green" ? COLORS.green : COLORS.base;
          const d = polyD(p.pts);
          return (
            <motion.path
              key={`p${i}`}
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={0.34}
              strokeLinecap="square"
              strokeLinejoin="miter"
              style={{ filter: p.tone !== "base" ? `drop-shadow(0 0 0.5px ${stroke})` : undefined }}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: p.tone === "base" ? 0.78 : 0.95 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.6, delay: 0.12 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}

        {/* pixel studs at vertices */}
        <g>{studs}</g>

        {/* central reactor — concentric pixel squares */}
        <g transform={`translate(${unit / 2} ${unit / 2})`}>
          <rect x={-2.4} y={-2.4} width={4.8} height={4.8} fill="none" stroke={COLORS.base} strokeWidth={0.18} opacity={0.6} />
          <rect x={-1.6} y={-1.6} width={3.2} height={3.2} fill="none" stroke={COLORS.base} strokeWidth={0.22} />
          <motion.rect
            x={-0.85} y={-0.85} width={1.7} height={1.7}
            fill={COLORS.base}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.6 / speed, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* expanding ring */}
          <motion.rect
            x={-1.6} y={-1.6} width={3.2} height={3.2}
            fill="none" stroke={COLORS.blue} strokeWidth={0.12}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: [1, 2.2, 2.2], opacity: [0.6, 0, 0] }}
            transition={{ duration: 3.4 / speed, repeat: Infinity, ease: "easeOut" }}
            style={{ transformOrigin: "0px 0px" }}
          />
        </g>

        {/* corner registration ticks */}
        {[
          [1, 1, 1, 1], [unit - 1, 1, -1, 1],
          [1, unit - 1, 1, -1], [unit - 1, unit - 1, -1, -1],
        ].map(([x, y, dx, dy], i) => (
          <g key={`tk${i}`} stroke={COLORS.base} strokeWidth={0.1} opacity={0.55}>
            <line x1={x} y1={y} x2={x + 0.9 * dx} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + 0.9 * dy} />
          </g>
        ))}

        {/* data packets along amber arms (4 directions) */}
        {[
          { d: polyD([[12, 4], [12, 9]]), delay: 0.0, color: COLORS.amber },
          { d: polyD([[12, 20], [12, 15]]), delay: 0.6, color: COLORS.amber },
          { d: polyD([[4, 12], [9, 12]]),   delay: 1.2, color: COLORS.amber },
          { d: polyD([[20, 12], [15, 12]]), delay: 1.8, color: COLORS.amber },
        ].map((p, i) => (
          <Packet key={`pk${i}`} d={p.d} delay={p.delay} dur={2.4 / speed} color={p.color} />
        ))}

        {/* packets along blue corner stubs (cycle inward) */}
        {[
          { d: polyD([[3, 3], [5, 3], [5, 5]]),     delay: 0.2 },
          { d: polyD([[21, 3], [19, 3], [19, 5]]),  delay: 0.7 },
          { d: polyD([[3, 21], [5, 21], [5, 19]]),  delay: 1.2 },
          { d: polyD([[21, 21], [19, 21], [19, 19]]), delay: 1.7 },
        ].map((p, i) => (
          <Packet key={`pkb${i}`} d={p.d} delay={p.delay} dur={3.2 / speed} color={COLORS.blue} />
        ))}
      </svg>
    </div>
  );
};

export default CertaGlyph;

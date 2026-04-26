import { motion } from "framer-motion";
import { type FC } from "react";

/**
 * Layered isometric stack — visual cousin of the MMDP Palantir cover.
 * Different palette per layer (signal-blue, signal-amber, bone, graphite).
 * No text labels embedded inside the SVG — labels live in the HTML
 * legend underneath. The image is the diagram; the words live elsewhere.
 */

type Layer = { num: string; name: string; sub: string; desc: string; nodes: string[] };

const ISO_X = 0.866; // cos(30°)
const ISO_Y = 0.5;    // sin(30°)

/** project (gx, gy, gz) → screen (x, y).  z is layer offset. */
const proj = (gx: number, gy: number, gz: number) => ({
  x: (gx - gy) * ISO_X,
  y: (gx + gy) * ISO_Y - gz,
});

/** Single isometric tile — diamond from above with two side faces. */
const Tile: FC<{
  gx: number; gy: number; gz: number;
  size?: number; height?: number;
  topFill: string; leftFill: string; rightFill: string;
  edge?: string;
  delay?: number;
  glow?: string;
}> = ({ gx, gy, gz, size = 24, height = 8, topFill, leftFill, rightFill, edge = "rgba(255,255,255,0.18)", delay = 0, glow }) => {
  const t = proj(gx, gy, gz);
  const tr = proj(gx + size, gy, gz);
  const bl = proj(gx, gy + size, gz);
  const br = proj(gx + size, gy + size, gz);
  // bottom corners (drop by 'height')
  const trB = { x: tr.x, y: tr.y + height };
  const blB = { x: bl.x, y: bl.y + height };
  const brB = { x: br.x, y: br.y + height };

  const top = `M ${t.x} ${t.y} L ${tr.x} ${tr.y} L ${br.x} ${br.y} L ${bl.x} ${bl.y} Z`;
  const right = `M ${tr.x} ${tr.y} L ${br.x} ${br.y} L ${brB.x} ${brB.y} L ${trB.x} ${trB.y} Z`;
  const left = `M ${bl.x} ${bl.y} L ${br.x} ${br.y} L ${brB.x} ${brB.y} L ${blB.x} ${blB.y} Z`;

  return (
    <motion.g
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ filter: glow ? `drop-shadow(0 0 6px ${glow})` : undefined }}
    >
      <path d={right} fill={rightFill} stroke={edge} strokeWidth={0.4} />
      <path d={left} fill={leftFill} stroke={edge} strokeWidth={0.4} />
      <path d={top} fill={topFill} stroke={edge} strokeWidth={0.4} />
    </motion.g>
  );
};

/** A platform = a rectangular grid of tiles, with a few elevated chips. */
const Platform: FC<{
  layerIndex: number;
  zOffset: number;
  cols: number;
  rows: number;
  palette: { topA: string; topB: string; left: string; right: string; chipTop: string; chipLeft: string; chipRight: string; glow: string };
  highlights: { col: number; row: number; lift: number }[];
  origin: { gx: number; gy: number };
  tile?: number;
  height?: number;
}> = ({ layerIndex, zOffset, cols, rows, palette, highlights, origin, tile = 22, height = 6 }) => {
  const tiles: JSX.Element[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const gx = origin.gx + c * tile;
      const gy = origin.gy + r * tile;
      const checker = (r + c) % 2 === 0;
      tiles.push(
        <Tile
          key={`${layerIndex}-${r}-${c}`}
          gx={gx}
          gy={gy}
          gz={zOffset}
          size={tile}
          height={height}
          topFill={checker ? palette.topA : palette.topB}
          leftFill={palette.left}
          rightFill={palette.right}
          delay={0.2 + layerIndex * 0.15 + (r + c) * 0.012}
        />
      );
    }
  }
  // elevated chips (logo cubes / processor chips on the platform)
  highlights.forEach((h, i) => {
    const gx = origin.gx + h.col * tile + tile * 0.15;
    const gy = origin.gy + h.row * tile + tile * 0.15;
    tiles.push(
      <Tile
        key={`hl-${layerIndex}-${i}`}
        gx={gx}
        gy={gy}
        gz={zOffset + h.lift}
        size={tile * 0.7}
        height={4}
        topFill={palette.chipTop}
        leftFill={palette.chipLeft}
        rightFill={palette.chipRight}
        delay={0.6 + layerIndex * 0.15 + i * 0.05}
        glow={palette.glow}
      />
    );
  });
  return <g>{tiles}</g>;
};

/** Connecting beam between two layers (vertical column at center). */
const ConnectorBeam: FC<{ x: number; yTop: number; yBottom: number; color: string; delay: number }> = ({
  x, yTop, yBottom, color, delay,
}) => (
  <motion.line
    x1={x} y1={yBottom} x2={x} y2={yTop}
    stroke={color} strokeWidth={0.6} strokeDasharray="2 3"
    initial={{ pathLength: 0, opacity: 0 }}
    whileInView={{ pathLength: 1, opacity: 0.5 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, delay, ease: "easeOut" }}
  />
);

/** Animated data packet that travels down through the stack along the central axis. */
const Packet: FC<{ x: number; yTop: number; yBottom: number; color: string; delay: number }> = ({ x, yTop, yBottom, color, delay }) => (
  <motion.circle
    cx={x}
    r={1.4}
    fill={color}
    initial={{ cy: yTop, opacity: 0 }}
    animate={{ cy: [yTop, yBottom], opacity: [0, 1, 1, 0] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "linear" }}
    style={{ filter: `drop-shadow(0 0 3px ${color})` }}
  />
);

const IsometricStack: FC<{ layers: Layer[] }> = ({ layers }) => {
  /* Four layers, top-down: L1 Interface, L2 Artifact, L3 Verification, L4 Ingest.
     Each layer drawn at decreasing z so layer 1 sits on top. */

  const palettes = [
    // L1 INTERFACE — signal-blue
    { topA: "#1B2A44", topB: "#152134", left: "#0E1828", right: "#1A263B", chipTop: "#3B82F6", chipLeft: "#1E4FB8", chipRight: "#2B6BD8", glow: "rgba(59,130,246,0.55)" },
    // L2 ARTIFACT — bone / silver
    { topA: "#2A3042", topB: "#21263A", left: "#161B2C", right: "#252B3E", chipTop: "#DDE1E6", chipLeft: "#A8AEB8", chipRight: "#C4CAD3", glow: "rgba(221,225,230,0.4)" },
    // L3 VERIFICATION — signal-amber
    { topA: "#2B2235", topB: "#231C2C", left: "#171121", right: "#28202F", chipTop: "#F59E0B", chipLeft: "#A36406", chipRight: "#D38609", glow: "rgba(245,158,11,0.5)" },
    // L4 INGEST — graphite
    { topA: "#1F2535", topB: "#181D2B", left: "#0E1422", right: "#1B2130", chipTop: "#5C6679", chipLeft: "#363E50", chipRight: "#4B5364", glow: "rgba(168,174,184,0.3)" },
  ];

  const layerSpacing = 70;
  const baseZ = 40;
  const platforms = layers.map((_, i) => ({
    z: baseZ + (3 - i) * layerSpacing, // layer 0 highest
    palette: palettes[i],
  }));

  // viewBox bounds (computed roughly for a 6x6 grid)
  const cols = 6, rows = 6, tile = 22;
  const origin = { gx: -((cols * tile) / 2), gy: -((rows * tile) / 2) };
  const corners = [
    proj(origin.gx, origin.gy, baseZ + 3 * layerSpacing),
    proj(origin.gx + cols * tile, origin.gy + rows * tile, 0),
  ];
  const minX = Math.min(corners[0].x, corners[1].x) - 40;
  const maxX = Math.max(corners[0].x, corners[1].x) + 40;
  const minY = corners[0].y - 30;
  const maxY = corners[1].y + 50;
  const w = maxX - minX;
  const h = maxY - minY;

  // Center axis x in projected space ≈ 0 (since grid centered)
  const axisX = 0;
  const yTopForLayer = (i: number) => proj(origin.gx + (cols * tile) / 2, origin.gy + (rows * tile) / 2, platforms[i].z).y;

  return (
    <div className="relative w-full overflow-hidden border border-rule bg-carbon">
      {/* faint grid background */}
      <div className="absolute inset-0 texture-crosshatch opacity-30" />
      <svg viewBox={`${minX} ${minY} ${w} ${h}`} className="relative w-full block" style={{ aspectRatio: `${w}/${h}` }}>
        <defs>
          <radialGradient id="iso-vignette" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
          </radialGradient>
        </defs>

        {/* draw deepest first */}
        {[3, 2, 1, 0].map((i) => {
          const p = platforms[i];
          const highlights =
            i === 0
              ? [{ col: 1, row: 1, lift: 14 }, { col: 4, row: 2, lift: 10 }, { col: 2, row: 4, lift: 16 }]
              : i === 1
              ? [{ col: 2, row: 2, lift: 12 }, { col: 3, row: 3, lift: 12 }]
              : i === 2
              ? [{ col: 1, row: 4, lift: 10 }, { col: 4, row: 1, lift: 10 }]
              : [{ col: 0, row: 0, lift: 8 }, { col: 5, row: 5, lift: 8 }, { col: 0, row: 5, lift: 8 }, { col: 5, row: 0, lift: 8 }];

          return (
            <Platform
              key={i}
              layerIndex={i}
              zOffset={p.z}
              cols={cols}
              rows={rows}
              palette={p.palette}
              highlights={highlights}
              origin={origin}
              tile={tile}
              height={6}
            />
          );
        })}

        {/* Connector beams between consecutive layers */}
        {[0, 1, 2].map((i) => {
          const yTop = yTopForLayer(i);
          const yBottom = yTopForLayer(i + 1);
          return (
            <ConnectorBeam
              key={`beam-${i}`}
              x={axisX}
              yTop={yTop}
              yBottom={yBottom}
              color={platforms[i].palette.glow}
              delay={1 + i * 0.2}
            />
          );
        })}

        {/* Data packets travelling down between layers */}
        {[0, 1, 2].map((i) =>
          [0, 1.3, 2.6].map((d, k) => (
            <Packet
              key={`pk-${i}-${k}`}
              x={axisX}
              yTop={yTopForLayer(i)}
              yBottom={yTopForLayer(i + 1)}
              color={platforms[i].palette.glow}
              delay={d + i * 0.4}
            />
          ))
        )}

        {/* Layer side-labels (mono caps, like the Palantir cover) */}
        {layers.map((l, i) => {
          const labelY = yTopForLayer(i);
          const labelX = minX + 18;
          return (
            <g key={`lbl-${i}`}>
              <motion.text
                x={labelX}
                y={labelY + 4}
                fill="rgba(221,225,230,0.55)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="6"
                letterSpacing="1.2"
                initial={{ opacity: 0, x: labelX - 6 }}
                whileInView={{ opacity: 1, x: labelX }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
              >
                ↑ {l.num} {l.name}
              </motion.text>
              <motion.line
                x1={labelX + 60}
                y1={labelY + 2}
                x2={labelX + 110}
                y2={labelY + 2}
                stroke="rgba(221,225,230,0.18)"
                strokeWidth="0.3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }}
              />
            </g>
          );
        })}

        {/* vignette for depth */}
        <rect x={minX} y={minY} width={w} height={h} fill="url(#iso-vignette)" pointerEvents="none" />
      </svg>

      {/* Corner registration ticks */}
      {(["tl", "tr", "bl", "br"] as const).map((p) => (
        <span
          key={p}
          className="absolute pointer-events-none"
          style={{
            top: p.startsWith("t") ? 12 : "auto",
            bottom: p.startsWith("b") ? 12 : "auto",
            left: p.endsWith("l") ? 12 : "auto",
            right: p.endsWith("r") ? 12 : "auto",
            width: 10,
            height: 10,
            borderTop: p.startsWith("t") ? "1px solid rgba(221,225,230,0.4)" : "none",
            borderBottom: p.startsWith("b") ? "1px solid rgba(221,225,230,0.4)" : "none",
            borderLeft: p.endsWith("l") ? "1px solid rgba(221,225,230,0.4)" : "none",
            borderRight: p.endsWith("r") ? "1px solid rgba(221,225,230,0.4)" : "none",
          }}
        />
      ))}
    </div>
  );
};

export default IsometricStack;

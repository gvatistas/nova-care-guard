import { type FC } from "react";
import { motion } from "framer-motion";

/* ── Diagnostic card data ── */
const CARDS: {
  label: string;
  status: string;
  statusLabel: string;
  color: string;
  // Position relative to silhouette viewBox (0-400 x, 0-700 y)
  anchorX: number;
  anchorY: number;
  cardSide: "left" | "right";
}[] = [
  {
    label: "Depression Screen",
    status: "OPTIMIZED",
    statusLabel: "PHQ-9 due",
    color: "#EA580C",
    anchorX: 200,
    anchorY: 65,
    cardSide: "right",
  },
  {
    label: "LDCT Screening",
    status: "COMPILED",
    statusLabel: "Scheduled",
    color: "#059669",
    anchorX: 240,
    anchorY: 195,
    cardSide: "right",
  },
  {
    label: "BP + Lipid Panel",
    status: "MISSED",
    statusLabel: "Unreviewed",
    color: "#DC2626",
    anchorX: 160,
    anchorY: 210,
    cardSide: "left",
  },
  {
    label: "HbA1c",
    status: "FLAGGED",
    statusLabel: "6.1% Pre-diabetic",
    color: "#D97706",
    anchorX: 135,
    anchorY: 290,
    cardSide: "left",
  },
  {
    label: "Colonoscopy",
    status: "VERIFIED",
    statusLabel: "Age + risk matched",
    color: "#0D9488",
    anchorX: 230,
    anchorY: 380,
    cardSide: "right",
  },
];

/* ── Scan line animation ── */
const ScanLine: FC = () => (
  <motion.rect
    x="100"
    y="0"
    width="200"
    height="2"
    rx="1"
    fill="#9CA3AF"
    opacity={0.3}
    animate={{ y: [20, 580, 20] }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
  />
);

/* ── Human silhouette path ── */
const SILHOUETTE_PATH = `
  M 200,20
  C 220,20 240,35 240,60
  C 240,85 225,95 215,100
  L 220,105
  C 265,115 290,140 290,170
  L 290,260
  C 290,270 285,275 280,275
  L 260,275
  L 265,440
  C 267,460 260,470 245,470
  L 230,470
  C 220,470 215,460 215,450
  L 210,320
  L 200,320
  L 190,320
  L 185,450
  C 185,460 180,470 170,470
  L 155,470
  C 140,470 133,460 135,440
  L 140,275
  L 120,275
  C 115,275 110,270 110,260
  L 110,170
  C 110,140 135,115 180,105
  L 185,100
  C 175,95 160,85 160,60
  C 160,35 180,20 200,20
  Z
`;

/* ── Diagnostic Card Component ── */
const DiagCard: FC<{
  card: typeof CARDS[0];
  index: number;
}> = ({ card, index }) => {
  // Card positions outside silhouette
  const cardX = card.cardSide === "right" ? 310 : -110;
  const cardY = card.anchorY - 20;
  const lineEndX = card.cardSide === "right" ? 310 : 90;

  return (
    <motion.g
      initial={{ opacity: 0, x: card.cardSide === "right" ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 + index * 0.3 }}
    >
      {/* Dashed connecting line */}
      <line
        x1={card.anchorX}
        y1={card.anchorY}
        x2={lineEndX}
        y2={cardY + 20}
        stroke="#9CA3AF"
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity={0.5}
      />
      {/* Small dot on body */}
      <circle cx={card.anchorX} cy={card.anchorY} r="3" fill={card.color} opacity={0.8} />
      <circle cx={card.anchorX} cy={card.anchorY} r="6" fill={card.color} opacity={0.15} />

      {/* Card background */}
      <foreignObject x={cardX} y={cardY} width="200" height="56">
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            display: "flex",
            overflow: "hidden",
            height: "100%",
          }}
        >
          {/* Color bar */}
          <div style={{ width: 3, background: card.color, flexShrink: 0 }} />
          <div style={{ padding: "8px 10px", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: card.color,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
                {card.label}
              </span>
            </div>
            <p style={{ fontSize: 9.5, color: card.color, fontWeight: 500, marginTop: 3, letterSpacing: "0.02em" }}>
              {card.status} → {card.statusLabel}
            </p>
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
};

/* ── Main Hero Section ── */
const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "#E5E7EB" }}>
      <div className="relative z-10 flex h-screen w-full items-center">
        <div className="max-w-[1440px] mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-center">

          {/* ── Left: Text + Buttons ── */}
          <div className="flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-light"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#111827",
              }}
            >
              Unlocking proactive healthcare for all.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-base"
              style={{ lineHeight: 1.7, letterSpacing: "-0.01em", color: "#374151", maxWidth: 480 }}
            >
              Medient compiles all clinical guidelines into deterministic,
              verified decision infrastructure; bridging AI and
              evidence-based care across all data sources, EHRs and
              patient encounters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 flex flex-row gap-5"
            >
              <a
                href="#contact"
                className="group relative text-[13px] font-semibold uppercase text-white px-8 py-3.5 transition-all duration-500 overflow-hidden hover:bg-[#374151]"
                style={{ letterSpacing: "0.08em", backgroundColor: "#111827" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">Request Demo</span>
              </a>
              <a
                href="#pipeline"
                className="group relative text-[13px] font-medium uppercase px-8 py-3.5 transition-all duration-500 overflow-hidden border hover:bg-[#111827] hover:text-white hover:border-[#111827]"
                style={{ letterSpacing: "0.08em", color: "#374151", borderColor: "#374151" }}
              >
                <span className="relative z-10 transition-colors duration-300">Read White Paper</span>
              </a>
            </motion.div>
          </div>

          {/* ── Right: Patient Scan Visual ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:flex items-center justify-center"
          >
            <svg
              viewBox="-120 -10 640 520"
              className="w-full"
              style={{ maxHeight: "80vh", maxWidth: 600 }}
            >
              {/* Scan grid overlay */}
              <defs>
                <pattern id="scan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#9CA3AF" strokeWidth="0.4" opacity="0.15" />
                </pattern>
                <clipPath id="body-clip">
                  <path d={SILHOUETTE_PATH} />
                </clipPath>
              </defs>

              {/* Silhouette */}
              <path
                d={SILHOUETTE_PATH}
                fill="#374151"
                opacity={0.6}
              />

              {/* Grid inside body */}
              <rect
                x="100"
                y="10"
                width="210"
                height="470"
                fill="url(#scan-grid)"
                clipPath="url(#body-clip)"
              />

              {/* Scan line */}
              <g clipPath="url(#body-clip)">
                <ScanLine />
              </g>

              {/* Diagnostic cards */}
              {CARDS.map((card, i) => (
                <DiagCard key={card.label} card={card} index={i} />
              ))}
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium uppercase" style={{ letterSpacing: "0.3em", color: "rgba(107,114,128,0.5)" }}>
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: "rgba(107,114,128,0.5)" }}
          className="text-sm"
        >
          ▾
        </motion.span>
      </motion.div>
    </section>
  );
};

export default HeroSection;

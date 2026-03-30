import { useRef, useState, useEffect, type FC } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const TEAL = "#00d4aa";
const RED = "#cc3333";
const ORANGE = "#e8922a";

/* ── Shapeshifting Crown Logo — dark grayscale palette ── */
const MORPH_SHAPES = [
  // Crown silhouette
  "M 50,90 L 65,40 L 80,60 L 100,15 L 120,60 L 135,40 L 150,90 Z",
  // Diamond facet
  "M 100,10 L 150,55 L 100,100 L 50,55 Z",
  // Hexagonal crystal
  "M 100,8 L 148,32 L 148,75 L 100,98 L 52,75 L 52,32 Z",
  // Angular shield
  "M 100,5 L 155,30 L 150,80 L 100,105 L 50,80 L 45,30 Z",
  // Octagonal
  "M 75,10 L 125,10 L 155,40 L 155,70 L 125,100 L 75,100 L 45,70 L 45,40 Z",
  // Crown again (loop)
  "M 50,90 L 65,40 L 80,60 L 100,15 L 120,60 L 135,40 L 150,90 Z",
];

const INNER_STRUCTURES: string[][] = [
  // Crown internals
  ["M 65,40 L 100,90", "M 135,40 L 100,90", "M 100,15 L 100,90", "M 50,90 L 100,50 L 150,90", "M 80,60 L 120,60", "M 65,40 L 135,40"],
  // Diamond internals
  ["M 100,10 L 100,100", "M 50,55 L 150,55", "M 75,32 L 125,78", "M 125,32 L 75,78", "M 100,10 L 50,55 L 100,100", "M 100,10 L 150,55 L 100,100"],
  // Hex internals
  ["M 100,8 L 100,98", "M 52,32 L 148,75", "M 148,32 L 52,75", "M 52,32 L 100,53 L 148,32", "M 52,75 L 100,53 L 148,75", "M 100,8 L 100,53"],
  // Shield internals
  ["M 100,5 L 100,105", "M 45,30 L 150,80", "M 155,30 L 50,80", "M 100,5 L 45,30 L 50,80 L 100,55", "M 100,5 L 155,30 L 150,80 L 100,55", "M 100,55 L 100,105"],
  // Octagon internals
  ["M 75,10 L 125,100", "M 125,10 L 75,100", "M 45,40 L 155,70", "M 155,40 L 45,70", "M 100,10 L 100,100", "M 45,55 L 155,55"],
  // Crown again
  ["M 65,40 L 100,90", "M 135,40 L 100,90", "M 100,15 L 100,90", "M 50,90 L 100,50 L 150,90", "M 80,60 L 120,60", "M 65,40 L 135,40"],
];

// Dark grayscale fills matching the brand logo
const FACET_FILLS = [
  [{ d: "M 65,40 L 100,15 L 100,90 Z", fill: "#4A4A4A" }, { d: "M 100,15 L 135,40 L 100,90 Z", fill: "#7A7A7A" }, { d: "M 50,90 L 65,40 L 100,90 Z", fill: "#5A5A5A" }, { d: "M 135,40 L 150,90 L 100,90 Z", fill: "#3A3A3A" }],
  [{ d: "M 100,10 L 150,55 L 100,55 Z", fill: "#5A5A5A" }, { d: "M 100,10 L 50,55 L 100,55 Z", fill: "#7A7A7A" }, { d: "M 50,55 L 100,100 L 100,55 Z", fill: "#4A4A4A" }, { d: "M 150,55 L 100,100 L 100,55 Z", fill: "#3A3A3A" }],
  [{ d: "M 100,8 L 148,32 L 100,53 Z", fill: "#6A6A6A" }, { d: "M 52,32 L 100,8 L 100,53 Z", fill: "#8A8A8A" }, { d: "M 148,32 L 148,75 L 100,53 Z", fill: "#4A4A4A" }, { d: "M 52,75 L 52,32 L 100,53 Z", fill: "#5A5A5A" }],
  [{ d: "M 100,5 L 155,30 L 100,55 Z", fill: "#5A5A5A" }, { d: "M 45,30 L 100,5 L 100,55 Z", fill: "#7A7A7A" }, { d: "M 155,30 L 150,80 L 100,55 Z", fill: "#3A3A3A" }, { d: "M 50,80 L 45,30 L 100,55 Z", fill: "#4A4A4A" }],
  [{ d: "M 75,10 L 125,10 L 100,55 Z", fill: "#6A6A6A" }, { d: "M 125,10 L 155,40 L 100,55 Z", fill: "#4A4A4A" }, { d: "M 155,40 L 155,70 L 100,55 Z", fill: "#3A3A3A" }, { d: "M 45,40 L 75,10 L 100,55 Z", fill: "#8A8A8A" }],
  [{ d: "M 65,40 L 100,15 L 100,90 Z", fill: "#4A4A4A" }, { d: "M 100,15 L 135,40 L 100,90 Z", fill: "#7A7A7A" }, { d: "M 50,90 L 65,40 L 100,90 Z", fill: "#5A5A5A" }, { d: "M 135,40 L 150,90 L 100,90 Z", fill: "#3A3A3A" }],
];

const ShapeshiftingLogo: FC<{ size?: number }> = ({ size = 120 }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx((p) => (p + 1) % (MORPH_SHAPES.length - 1)), 2200);
    return () => clearInterval(interval);
  }, []);

  const nextIdx = (idx + 1) % MORPH_SHAPES.length;

  return (
    <svg width={size} height={size} viewBox="0 0 200 110" className="overflow-visible shrink-0">
      <defs>
        <filter id="crown-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Filled facets with morphing */}
      <AnimatePresence mode="wait">
        <motion.g key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          {FACET_FILLS[idx]?.map((f, i) => (
            <motion.path key={i} d={f.d} fill={f.fill} opacity={0.85}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.08 }} />
          ))}
        </motion.g>
      </AnimatePresence>

      {/* Outer wireframe */}
      <motion.path
        d={MORPH_SHAPES[idx]}
        fill="none" stroke="#B0B0B0" strokeWidth="1.5" strokeLinejoin="miter"
        filter="url(#crown-glow)"
        initial={false}
        animate={{ d: MORPH_SHAPES[nextIdx] }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Inner structure */}
      <AnimatePresence mode="wait">
        <motion.g key={`s${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {INNER_STRUCTURES[idx]?.map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#9A9A9A" strokeWidth="0.6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.35 }}
              transition={{ duration: 0.8, delay: i * 0.1 }} />
          ))}
        </motion.g>
      </AnimatePresence>

      {/* Center vertex pulse */}
      <circle cx="100" cy="55" r="2" fill="#C0C0C0" opacity="0.6">
        <animate attributeName="r" values="1.5;4;1.5" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* Outer edge stroke (secondary) for depth */}
      <motion.path
        d={MORPH_SHAPES[idx]}
        fill="none" stroke="#E8E8E8" strokeWidth="0.4" strokeLinejoin="miter"
        initial={false}
        animate={{ d: MORPH_SHAPES[nextIdx] }}
        transition={{ duration: 2, ease: "easeInOut" }}
        opacity={0.2}
      />
    </svg>
  );
};

/* ── Patient Card ── */
const PatientCard: FC = () => (
  <div className="relative border border-white/[0.08] p-6 md:p-8" style={{ background: "#22262b" }}>
    {/* Top bar */}
    <div className="flex items-center gap-2 mb-6">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
      <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">Patient Record · Active</span>
    </div>

    {/* Avatar + Name */}
    <div className="flex items-center gap-5 mb-6">
      <div className="w-14 h-14 rounded border border-white/10 flex items-center justify-center" style={{ background: "#2a2e34" }}>
        <svg viewBox="0 0 40 40" width="32" height="32">
          {/* Geometric avatar — faceted profile */}
          <polygon points="20,4 30,12 28,26 20,32 12,26 10,12" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />
          <polygon points="20,8 26,14 24,24 20,28 16,24 14,14" fill="white" opacity="0.06" />
          <circle cx="20" cy="15" r="4" fill="none" stroke="white" strokeWidth="0.6" opacity="0.3" />
          <path d="M 14,24 Q 20,20 26,24" fill="none" stroke="white" strokeWidth="0.6" opacity="0.25" />
        </svg>
      </div>
      <div>
        <h3 className="text-xl text-white font-light" style={{ letterSpacing: "-0.02em" }}>Jane Doe</h3>
        <p className="text-white/30 text-xs mt-0.5">52 · Female · BMI 28.4 · Smoker (12 pk-yr)</p>
      </div>
    </div>

    {/* Vitals strip */}
    <div className="grid grid-cols-4 gap-px mb-6">
      {[
        { label: "BP", value: "138/88" },
        { label: "A1c", value: "6.1%" },
        { label: "LDL", value: "142" },
        { label: "Risk", value: "Elevated" },
      ].map((v) => (
        <div key={v.label} className="text-center py-2 border border-white/[0.04]" style={{ background: "#1e2227" }}>
          <p className="text-[9px] uppercase tracking-[0.1em] text-white/25 mb-1">{v.label}</p>
          <p className="text-xs text-white/70">{v.value}</p>
        </div>
      ))}
    </div>

    {/* Visit context */}
    <p className="text-white/25 text-[11px] tracking-wide">Routine visit · 3 undetected risk factors in chart</p>
  </div>
);

/* ── Test Result Row ── */
type Status = "caught" | "partial" | "missed";
const statusConfig: Record<Status, { color: string; bg: string; border: string }> = {
  caught: { color: TEAL, bg: `${TEAL}12`, border: `${TEAL}25` },
  partial: { color: ORANGE, bg: `${ORANGE}12`, border: `${ORANGE}25` },
  missed: { color: RED, bg: `${RED}12`, border: `${RED}25` },
};

const tests: { test: string; withLabel: string; withoutLabel: string; withoutStatus: Status }[] = [
  { test: "LDCT Lung Screening", withLabel: "Ordered", withoutLabel: "Not flagged", withoutStatus: "missed" },
  { test: "Colonoscopy", withLabel: "Scheduled", withoutLabel: "Delayed 2 yrs", withoutStatus: "partial" },
  { test: "BP + Lipid Panel", withLabel: "Statin pathway compiled", withoutLabel: "Reviewed, no action", withoutStatus: "caught" },
  { test: "HbA1c", withLabel: "Pre-diabetes detected", withoutLabel: "Not tested", withoutStatus: "missed" },
];

/* ── Main Section ── */
const PatientNarrativeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden" style={{ background: "#1a1d21" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/25 mb-3">Clinical Decision Divergence</p>
          <h2 className="text-3xl md:text-4xl text-white font-light" style={{ letterSpacing: "-0.03em" }}>
            Same patient. Different infrastructure.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left — Patient Card + Shapeshifting Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <PatientCard />

            {/* Medient AI badge with shapeshifting logo */}
            <div className="flex items-center gap-5 border border-white/[0.06] p-5" style={{ background: "#1e2227" }}>
              <ShapeshiftingLogo size={120} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] mb-1" style={{ color: TEAL }}>Medient Engine</p>
                <p className="text-white/35 text-[11px] leading-relaxed">
                  Compiled clinical decision infrastructure analyzing 23 guideline pathways in &lt;0.3s
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — Screening Results + Outcomes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Column headers */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
              <span className="flex-1 text-[10px] uppercase tracking-[0.1em] text-white/30">Screening</span>
              <span className="text-[10px] uppercase tracking-[0.1em] shrink-0 w-[120px] text-center" style={{ color: TEAL }}>With Medient</span>
              <span className="text-[10px] uppercase tracking-[0.1em] shrink-0 w-[120px] text-center text-white/30">Without</span>
            </div>

            {/* Test rows */}
            <div className="space-y-1 mb-8">
              {tests.map((row, i) => {
                const st = statusConfig[row.withoutStatus];
                return (
                  <motion.div
                    key={row.test}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-3 py-3 border-b border-white/[0.04]"
                  >
                    <span className="text-white/45 text-sm flex-1 min-w-0">{row.test}</span>
                    <span
                      className="text-[11px] px-2.5 py-1 shrink-0 w-[120px] text-center"
                      style={{ color: TEAL, background: `${TEAL}10`, border: `1px solid ${TEAL}20` }}
                    >
                      {row.withLabel}
                    </span>
                    <span
                      className="text-[11px] px-2.5 py-1 shrink-0 w-[120px] text-center"
                      style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}
                    >
                      {row.withoutLabel}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Outcome cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="border border-white/[0.06] p-5"
                style={{ background: `${TEAL}06` }}
              >
                <p className="text-[10px] uppercase font-medium mb-3" style={{ color: TEAL, letterSpacing: "0.1em" }}>
                  With Medient
                </p>
                <p className="text-white text-xl font-light" style={{ letterSpacing: "-0.02em" }}>Stage IA</p>
                <p className="text-white/35 text-xs mt-1.5">$4,200 · 92% survival</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="border border-white/[0.06] p-5"
                style={{ background: `${RED}06` }}
              >
                <p className="text-[10px] uppercase font-medium mb-3" style={{ color: RED, letterSpacing: "0.1em" }}>
                  Without
                </p>
                <p className="text-white text-xl font-light" style={{ letterSpacing: "-0.02em" }}>Stage IIIB</p>
                <p className="text-white/35 text-xs mt-1.5">$288K+ · 23% survival</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-px bg-white/[0.04]"
        >
          {[
            { val: "340+", label: "Early detections / year" },
            { val: "$96M", label: "Downstream costs avoided" },
            { val: "94%", label: "Screening gaps closed" },
          ].map((s) => (
            <div key={s.val} className="p-5 text-center" style={{ background: "#1a1d21" }}>
              <p className="text-xl font-light text-white" style={{ letterSpacing: "-0.02em" }}>{s.val}</p>
              <p className="text-white/30 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PatientNarrativeSection;

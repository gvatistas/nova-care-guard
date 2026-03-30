import { useRef, useState, useEffect, type FC } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const TEAL = "#00d4aa";
const RED = "#cc3333";
const ORANGE = "#e8922a";

/* ── Shapeshifting Crown Logo — dark grayscale palette ── */
const MORPH_SHAPES = [
  "M 50,90 L 65,40 L 80,60 L 100,15 L 120,60 L 135,40 L 150,90 Z",
  "M 100,10 L 150,55 L 100,100 L 50,55 Z",
  "M 100,8 L 148,32 L 148,75 L 100,98 L 52,75 L 52,32 Z",
  "M 100,5 L 155,30 L 150,80 L 100,105 L 50,80 L 45,30 Z",
  "M 75,10 L 125,10 L 155,40 L 155,70 L 125,100 L 75,100 L 45,70 L 45,40 Z",
  "M 50,90 L 65,40 L 80,60 L 100,15 L 120,60 L 135,40 L 150,90 Z",
];
const INNER_STRUCTURES: string[][] = [
  ["M 65,40 L 100,90", "M 135,40 L 100,90", "M 100,15 L 100,90", "M 50,90 L 100,50 L 150,90", "M 80,60 L 120,60", "M 65,40 L 135,40"],
  ["M 100,10 L 100,100", "M 50,55 L 150,55", "M 75,32 L 125,78", "M 125,32 L 75,78", "M 100,10 L 50,55 L 100,100", "M 100,10 L 150,55 L 100,100"],
  ["M 100,8 L 100,98", "M 52,32 L 148,75", "M 148,32 L 52,75", "M 52,32 L 100,53 L 148,32", "M 52,75 L 100,53 L 148,75", "M 100,8 L 100,53"],
  ["M 100,5 L 100,105", "M 45,30 L 150,80", "M 155,30 L 50,80", "M 100,5 L 45,30 L 50,80 L 100,55", "M 100,5 L 155,30 L 150,80 L 100,55", "M 100,55 L 100,105"],
  ["M 75,10 L 125,100", "M 125,10 L 75,100", "M 45,40 L 155,70", "M 155,40 L 45,70", "M 100,10 L 100,100", "M 45,55 L 155,55"],
  ["M 65,40 L 100,90", "M 135,40 L 100,90", "M 100,15 L 100,90", "M 50,90 L 100,50 L 150,90", "M 80,60 L 120,60", "M 65,40 L 135,40"],
];
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
      <AnimatePresence mode="wait">
        <motion.g key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          {FACET_FILLS[idx]?.map((f, i) => (
            <motion.path key={i} d={f.d} fill={f.fill} opacity={0.85}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.08 }} />
          ))}
        </motion.g>
      </AnimatePresence>
      <motion.path d={MORPH_SHAPES[idx]} fill="none" stroke="#B0B0B0" strokeWidth="1.5" strokeLinejoin="miter"
        filter="url(#crown-glow)" initial={false} animate={{ d: MORPH_SHAPES[nextIdx] }}
        transition={{ duration: 2, ease: "easeInOut" }} />
      <AnimatePresence mode="wait">
        <motion.g key={`s${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {INNER_STRUCTURES[idx]?.map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#9A9A9A" strokeWidth="0.6"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.35 }}
              transition={{ duration: 0.8, delay: i * 0.1 }} />
          ))}
        </motion.g>
      </AnimatePresence>
      <circle cx="100" cy="55" r="2" fill="#C0C0C0" opacity="0.6">
        <animate attributeName="r" values="1.5;4;1.5" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <motion.path d={MORPH_SHAPES[idx]} fill="none" stroke="#E8E8E8" strokeWidth="0.4" strokeLinejoin="miter"
        initial={false} animate={{ d: MORPH_SHAPES[nextIdx] }} transition={{ duration: 2, ease: "easeInOut" }} opacity={0.2} />
    </svg>
  );
};

/* ── Animated pulse dot that travels down a path ── */
const PulseDot: FC<{ color: string; delay: number; duration: number }> = ({ color, delay, duration }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
    initial={{ top: 0, opacity: 0 }}
    animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
    transition={{ duration, delay, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
  />
);

/* ── Connector line between nodes ── */
const Connector: FC<{ color: string; height?: number }> = ({ color, height = 40 }) => (
  <div className="relative flex justify-center" style={{ height }}>
    <div className="w-px h-full" style={{ background: `${color}30` }} />
    <PulseDot color={color} delay={0.5} duration={1.2} />
  </div>
);

/* ── Decision Node ── */
const Node: FC<{
  label: string;
  sublabel?: string;
  color: string;
  delay: number;
  inView: boolean;
  large?: boolean;
  stat?: string;
}> = ({ label, sublabel, color, delay, inView, large, stat }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay }}
    className="border px-4 py-3 text-center"
    style={{
      borderColor: `${color}30`,
      background: `${color}08`,
    }}
  >
    <p className={`${large ? "text-base" : "text-[12px]"} font-light`} style={{ color, letterSpacing: "0.01em" }}>
      {label}
    </p>
    {sublabel && <p className="text-white/30 text-[10px] mt-1">{sublabel}</p>}
    {stat && (
      <p className="text-white text-lg font-light mt-1" style={{ letterSpacing: "-0.02em" }}>{stat}</p>
    )}
  </motion.div>
);

/* ── Main Section ── */
const PatientNarrativeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden" style={{ background: "#1a1d21" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── TOP: Jane Doe Patient Node ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto border border-white/[0.08] p-6 text-center relative"
          style={{ background: "#22262b" }}
        >
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center" style={{ background: "#2a2e34" }}>
              <svg viewBox="0 0 40 40" width="28" height="28">
                <polygon points="20,4 30,12 28,26 20,32 12,26 10,12" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />
                <polygon points="20,8 26,14 24,24 20,28 16,24 14,14" fill="white" opacity="0.06" />
                <circle cx="20" cy="15" r="4" fill="none" stroke="white" strokeWidth="0.6" opacity="0.3" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl text-white font-light" style={{ letterSpacing: "-0.02em" }}>Jane Doe, 52</h3>
              <p className="text-white/30 text-[11px] mt-0.5">Female · BMI 28.4 · Smoker (12 pk-yr)</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-px mt-4">
            {[{ l: "BP", v: "138/88" }, { l: "A1c", v: "6.1%" }, { l: "LDL", v: "142" }, { l: "Risk", v: "Elevated" }].map((x) => (
              <div key={x.l} className="py-1.5 border border-white/[0.04] text-center" style={{ background: "#1e2227" }}>
                <p className="text-[8px] uppercase tracking-[0.1em] text-white/20">{x.l}</p>
                <p className="text-[11px] text-white/60">{x.v}</p>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-[10px] mt-3 tracking-wide">Routine visit · 3 undetected risk factors in chart</p>
        </motion.div>

        {/* ── FORK: Two lines diverge ── */}
        <div className="flex justify-center mt-2">
          <div className="relative h-12 w-px" style={{ background: "rgba(255,255,255,0.08)" }}>
            <PulseDot color="#ffffff" delay={0.3} duration={0.8} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-2"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">Decision point</p>
        </motion.div>

        {/* ── TWO LANES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4">

          {/* ── LEFT: Without Medient ── */}
          <div className="flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-[10px] uppercase tracking-[0.15em] mb-4 font-medium"
              style={{ color: RED }}
            >
              Without Medient
            </motion.p>

            <Node label="LDCT Lung Screening" sublabel="Not flagged — missed entirely" color={RED} delay={0.5} inView={inView} />
            <Connector color={RED} />
            <Node label="Colonoscopy" sublabel="Delayed 2 years — partially deferred" color={ORANGE} delay={0.65} inView={inView} />
            <Connector color={ORANGE} />
            <Node label="BP + Lipid Panel" sublabel="Reviewed, no action taken" color={ORANGE} delay={0.75} inView={inView} />
            <Connector color={RED} height={32} />
            <Node label="HbA1c" sublabel="Not tested — missed entirely" color={RED} delay={0.85} inView={inView} />

            <Connector color={RED} height={48} />

            {/* Patient outcome */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.0 }}
              className="border p-5 text-center w-full"
              style={{ borderColor: `${RED}30`, background: `${RED}08` }}
            >
              <p className="text-[10px] uppercase tracking-[0.1em] mb-2" style={{ color: RED }}>Patient Outcome</p>
              <p className="text-white text-2xl font-light" style={{ letterSpacing: "-0.02em" }}>Stage IIIB</p>
              <p className="text-white/30 text-xs mt-1">Late-stage diagnosis · 23% survival</p>
            </motion.div>

            <Connector color={RED} height={32} />

            {/* Macro cost */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.15 }}
              className="border p-4 text-center w-full"
              style={{ borderColor: `${RED}20`, background: `${RED}05` }}
            >
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/25 mb-1">Direct cost</p>
              <p className="text-white text-xl font-light">$288,000+</p>
              <p className="text-white/25 text-[10px] mt-2 leading-relaxed">
                Chemo, radiation, ICU stays, lost productivity. Multiplied across millions of patients, this is the GDP-scale crisis a16z calls "the cost of infinite healthcare."
              </p>
            </motion.div>
          </div>

          {/* ── RIGHT: With Medient ── */}
          <div className="flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-[10px] uppercase tracking-[0.15em] mb-4 font-medium"
              style={{ color: TEAL }}
            >
              With Medient
            </motion.p>

            <Node label="LDCT Lung Screening" sublabel="Auto-ordered by compiled guideline" color={TEAL} delay={0.5} inView={inView} />
            <Connector color={TEAL} />
            <Node label="Colonoscopy" sublabel="Scheduled — age + risk flagged" color={TEAL} delay={0.65} inView={inView} />
            <Connector color={TEAL} />
            <Node label="BP + Lipid Panel" sublabel="Statin pathway compiled" color={TEAL} delay={0.75} inView={inView} />
            <Connector color={TEAL} height={32} />
            <Node label="HbA1c" sublabel="Pre-diabetes detected at 6.1%" color={TEAL} delay={0.85} inView={inView} />

            <Connector color={TEAL} height={48} />

            {/* Patient outcome */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.0 }}
              className="border p-5 text-center w-full"
              style={{ borderColor: `${TEAL}30`, background: `${TEAL}08` }}
            >
              <p className="text-[10px] uppercase tracking-[0.1em] mb-2" style={{ color: TEAL }}>Patient Outcome</p>
              <p className="text-white text-2xl font-light" style={{ letterSpacing: "-0.02em" }}>Stage IA</p>
              <p className="text-white/30 text-xs mt-1">Caught early · 92% survival</p>
            </motion.div>

            <Connector color={TEAL} height={32} />

            {/* Macro savings */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.15 }}
              className="border p-4 text-center w-full"
              style={{ borderColor: `${TEAL}20`, background: `${TEAL}05` }}
            >
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/25 mb-1">Direct cost</p>
              <p className="text-white text-xl font-light">$4,200</p>
              <p className="text-white/25 text-[10px] mt-2 leading-relaxed">
                Outpatient screening, early intervention. 68x cheaper. Scaled across populations, this is how you bend the healthcare cost curve.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Medient Engine badge (centered between lanes) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="flex items-center justify-center gap-5 border border-white/[0.06] p-5 mt-12 max-w-md mx-auto"
          style={{ background: "#1e2227" }}
        >
          <ShapeshiftingLogo size={100} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] mb-1" style={{ color: TEAL }}>Medient Engine</p>
            <p className="text-white/35 text-[11px] leading-relaxed">
              Compiled clinical decision infrastructure analyzing 23 guideline pathways in &lt;0.3s
            </p>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-px bg-white/[0.04]"
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

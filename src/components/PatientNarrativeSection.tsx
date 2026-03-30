import { useRef, useState, useEffect, type FC } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const POSITIVE = "#c8d6e5";
const RED = "#ef4444";
const ORANGE = "#e8922a";
const GREEN = "#8fbc8f";

/* ── Shapeshifting background for right lane ── */
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

/* ── Background Shapeshifting Engine visual for right lane ── */
const EngineBackground: FC = () => {
  const [idx, setIdx] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx((p) => (p + 1) % (MORPH_SHAPES.length - 1)), 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let raf: number;
    let t = 0;
    const spin = () => { t += 0.002; setRotation(t * 12); raf = requestAnimationFrame(spin); };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nextIdx = (idx + 1) % MORPH_SHAPES.length;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.06 }}>
      <svg width="100%" height="100%" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
        <defs>
          <radialGradient id="eng-bg-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={POSITIVE} stopOpacity="0.4" />
            <stop offset="100%" stopColor={POSITIVE} stopOpacity="0" />
          </radialGradient>
        </defs>
        <g style={{ transformOrigin: "100px 55px", transform: `rotate(${rotation}deg)` }}>
          <circle cx="100" cy="55" r="52" fill="none" stroke={POSITIVE} strokeWidth="0.4" strokeDasharray="8 12" />
          <circle cx="100" cy="55" r="48" fill="none" stroke={POSITIVE} strokeWidth="0.25" strokeDasharray="3 20" />
        </g>
        <g style={{ transformOrigin: "100px 55px", transform: `rotate(${-rotation * 0.6}deg)` }}>
          <circle cx="100" cy="55" r="56" fill="none" stroke={POSITIVE} strokeWidth="0.2" strokeDasharray="2 16" />
        </g>
        <AnimatePresence mode="wait">
          <motion.g key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            {FACET_FILLS[idx]?.map((f, i) => (
              <motion.path key={i} d={f.d} fill={POSITIVE} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0.3] }} transition={{ duration: 1, delay: i * 0.1 }} />
            ))}
          </motion.g>
        </AnimatePresence>
        <motion.path d={MORPH_SHAPES[idx]} fill="none" stroke={POSITIVE} strokeWidth="1.5" strokeLinejoin="miter" initial={false} animate={{ d: MORPH_SHAPES[nextIdx] }} transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }} />
        <AnimatePresence mode="wait">
          <motion.g key={`s${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            {INNER_STRUCTURES[idx]?.map((d, i) => (
              <motion.path key={i} d={d} fill="none" stroke={POSITIVE} strokeWidth="0.6" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 0.6, 0.3] }} transition={{ duration: 1.2, delay: i * 0.12 }} />
            ))}
          </motion.g>
        </AnimatePresence>
        <circle cx="100" cy="55" r="2" fill={POSITIVE} opacity="0.5">
          <animate attributeName="r" values="1;6;1" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3.2s" repeatCount="indefinite" />
        </circle>
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <g key={i} style={{ transformOrigin: "100px 55px", transform: `rotate(${angle + rotation * 2}deg)` }}>
            <circle cx="140" cy="55" r="0.8" fill={POSITIVE} opacity={0.3}>
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
};

/* ── Small Shapeshifting Crown Logo for Medient Engine badge ── */
const ShapeshiftingLogo: FC<{ size?: number }> = ({ size = 120 }) => {
  const [idx, setIdx] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx((p) => (p + 1) % (MORPH_SHAPES.length - 1)), 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let raf: number; let t = 0;
    const spin = () => { t += 0.003; setRotation(t * 15); raf = requestAnimationFrame(spin); };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nextIdx = (idx + 1) % MORPH_SHAPES.length;
  const uid = `crown-${size}`;

  return (
    <svg width={size} height={size} viewBox="0 0 200 110" className="overflow-visible shrink-0">
      <defs>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" in="SourceGraphic" />
          <feMerge><feMergeNode in="blur1" /><feMergeNode in="blur2" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`${uid}-inner`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-sweep`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0"><animate attributeName="stopOpacity" values="0;0.15;0" dur="3.2s" repeatCount="indefinite" /></stop>
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08"><animate attributeName="stopOpacity" values="0.08;0.25;0.08" dur="3.2s" repeatCount="indefinite" /></stop>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"><animate attributeName="stopOpacity" values="0;0.1;0" dur="3.2s" repeatCount="indefinite" /></stop>
        </linearGradient>
      </defs>
      <g style={{ transformOrigin: "100px 55px", transform: `rotate(${rotation}deg)` }}>
        <circle cx="100" cy="55" r="52" fill="none" stroke="white" strokeWidth="0.3" opacity="0.06" strokeDasharray="8 12" />
      </g>
      <AnimatePresence mode="wait">
        <motion.g key={idx} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          {FACET_FILLS[idx]?.map((f, i) => (
            <motion.path key={i} d={f.d} fill={f.fill} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0.75] }} transition={{ duration: 1, delay: i * 0.1 }} />
          ))}
          <motion.path d={MORPH_SHAPES[idx]} fill={`url(#${uid}-inner)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
          <motion.path d={MORPH_SHAPES[idx]} fill={`url(#${uid}-sweep)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
        </motion.g>
      </AnimatePresence>
      <motion.path d={MORPH_SHAPES[idx]} fill="none" stroke="#C8C8C8" strokeWidth="1.2" strokeLinejoin="miter" filter={`url(#${uid}-glow)`} initial={false} animate={{ d: MORPH_SHAPES[nextIdx] }} transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }} />
      <AnimatePresence mode="wait">
        <motion.g key={`s${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          {INNER_STRUCTURES[idx]?.map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#A0A0A0" strokeWidth="0.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 0.4, 0.25] }} transition={{ duration: 1.2, delay: i * 0.12 }} />
          ))}
        </motion.g>
      </AnimatePresence>
      <circle cx="100" cy="55" r="2" fill="white" opacity="0.7">
        <animate attributeName="r" values="1;5;1" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.08;0.7" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="55" r="1" fill="white" opacity="0.9">
        <animate attributeName="r" values="0.8;2;0.8" dur="3.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

/* ── Animated pulse dot ── */
const PulseDot: FC<{ color: string; delay: number; duration: number }> = ({ color, delay, duration }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
    initial={{ top: 0, opacity: 0 }}
    animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
    transition={{ duration, delay, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
  />
);

/* ── Connector line ── */
const Connector: FC<{ color: string; height?: number }> = ({ color, height = 28 }) => (
  <div className="relative flex justify-center" style={{ height }}>
    <div className="w-px h-full" style={{ background: `${color}30` }} />
    <PulseDot color={color} delay={0.5} duration={1} />
  </div>
);

/* ── Status indicator dot ── */
const StatusDot: FC<{ color: string; pulse?: boolean }> = ({ color, pulse }) => (
  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2.5 shrink-0 mt-[3px] ${pulse ? "animate-pulse" : ""}`}
    style={{ background: color, boxShadow: pulse ? `0 0 12px ${color}, 0 0 24px ${color}50` : `0 0 6px ${color}40` }} />
);

/* ── Screening Node ── */
const ScreeningNode: FC<{
  label: string; sublabel: string; color: string; status: string;
  delay: number; inView: boolean; critical?: boolean;
}> = ({ label, sublabel, color, status, delay, inView, critical }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay }}
    className="border px-5 py-4 w-full relative overflow-hidden"
    style={{
      borderColor: `${color}30`,
      background: `${color}08`,
      boxShadow: critical ? `inset 0 0 20px ${color}10, 0 0 15px ${color}08` : `0 0 10px ${color}05`,
    }}
  >
    {critical && (
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }} />
    )}
    <div className="flex items-center justify-between mb-1.5 relative">
      <p className="text-[16px] text-white/90 font-normal" style={{ letterSpacing: "-0.01em" }}>{label}</p>
      <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-0.5 ${critical ? "animate-pulse" : ""}`}
        style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}>{status}</span>
    </div>
    <div className="flex items-center relative">
      <StatusDot color={color} pulse={critical} />
      <p className="text-white/50 text-[14px] leading-relaxed">{sublabel}</p>
    </div>
  </motion.div>
);

/* ── Alternating lane controller ── */
const CYCLE_DURATION = 5000; // ms per side

/* ── Main Section ── */
const PatientNarrativeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveSide((s) => (s === "left" ? "right" : "left"));
    }, CYCLE_DURATION);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section ref={ref} className="py-28 px-6 relative overflow-hidden" style={{ background: "#1a1d21" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── TOP: Jane Doe Patient Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto border border-white/[0.08] p-7 relative"
          style={{ background: "#22262b" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded border border-white/10 flex items-center justify-center shrink-0" style={{ background: "#2a2e34" }}>
              <svg viewBox="0 0 40 40" width="30" height="30">
                <polygon points="20,4 30,12 28,26 20,32 12,26 10,12" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />
                <polygon points="20,8 26,14 24,24 20,28 16,24 14,14" fill="white" opacity="0.06" />
                <circle cx="20" cy="15" r="4" fill="none" stroke="white" strokeWidth="0.6" opacity="0.3" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl text-white font-light" style={{ letterSpacing: "-0.02em" }}>Jane Doe, 52</h3>
              <p className="text-white/40 text-sm mt-0.5">Female · BMI 28.4 · Smoker (12 pk-yr)</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-px mt-2">
            {[{ l: "BP", v: "138/88" }, { l: "A1c", v: "6.1%" }, { l: "LDL", v: "142" }, { l: "Risk", v: "Elevated" }].map((x) => (
              <div key={x.l} className="py-2.5 border border-white/[0.04] text-center" style={{ background: "#1e2227" }}>
                <p className="text-[10px] uppercase tracking-[0.1em] text-white/30">{x.l}</p>
                <p className="text-[15px] text-white/60 mt-0.5">{x.v}</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-4 tracking-wide text-center">Routine visit · 3 undetected risk factors in chart</p>
        </motion.div>

        {/* ── FORK ── */}
        <div className="flex justify-center mt-2">
          <div className="relative h-10 w-px" style={{ background: "rgba(255,255,255,0.08)" }}>
            <PulseDot color="#ffffff" delay={0.3} duration={0.8} />
          </div>
        </div>

        {/* ── Decision point with alternating indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/30">Decision point</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{ background: activeSide === "left" ? RED : "#ffffff15", boxShadow: activeSide === "left" ? `0 0 12px ${RED}` : "none" }}
              transition={{ duration: 0.6 }}
            />
            <p className="text-[11px] text-white/20 uppercase tracking-widest">
              {activeSide === "left" ? "Without" : "With"} Medient
            </p>
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{ background: activeSide === "right" ? POSITIVE : "#ffffff15", boxShadow: activeSide === "right" ? `0 0 12px ${POSITIVE}` : "none" }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.div>

        {/* ── TWO LANES — alternating focus ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 mt-6">

          {/* ── LEFT: Without Medient ── */}
          <motion.div
            className="flex flex-col items-center"
            animate={{
              opacity: activeSide === "left" ? 1 : 0.25,
              scale: activeSide === "left" ? 1 : 0.97,
              filter: activeSide === "left" ? "blur(0px)" : "blur(1px)",
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-[13px] uppercase tracking-[0.15em] mb-6 font-semibold px-5 py-2.5 border self-center"
              style={{ color: RED, borderColor: `${RED}25`, background: `${RED}08` }}
            >
              ✕ Without Medient
            </motion.div>

            <div className="w-full max-w-sm flex flex-col items-center gap-0">
              <ScreeningNode label="BP + Lipid Panel" sublabel="Reviewed and noted — within standard workflow" color={GREEN} status="Completed" delay={0.5} inView={inView} />
              <Connector color={GREEN} />
              <ScreeningNode label="Colonoscopy" sublabel="Ordered on schedule — completed as routine" color={GREEN} status="Completed" delay={0.6} inView={inView} />
              <Connector color={ORANGE} />
              <ScreeningNode label="HbA1c" sublabel="Pre-diabetic range flagged but not followed up" color={ORANGE} status="Deferred" delay={0.7} inView={inView} />
              <Connector color={RED} />
              <ScreeningNode label="LDCT Lung Screening" sublabel="Not flagged — missed entirely" color={RED} status="Missed" delay={0.8} inView={inView} critical />
            </div>

            <Connector color={RED} height={36} />

            {/* Patient outcome */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.0 }}
              className="border p-7 text-center w-full max-w-sm relative overflow-hidden"
              style={{ borderColor: `${RED}35`, background: `${RED}0a`, boxShadow: `0 0 30px ${RED}12, inset 0 0 20px ${RED}08` }}
            >
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0, 0.10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: `radial-gradient(circle at 50% 30%, ${RED}30, transparent 70%)` }} />
              <p className="text-xs uppercase tracking-[0.12em] mb-2 relative font-semibold" style={{ color: RED }}>Patient Outcome</p>
              <p className="text-white text-4xl font-light relative" style={{ letterSpacing: "-0.02em" }}>Stage IIIB</p>
              <p className="text-white/45 text-[15px] mt-2 relative">Late-stage diagnosis · 23% survival</p>
            </motion.div>

            <Connector color={RED} height={24} />

            {/* Cost */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.15 }}
              className="border p-7 text-center w-full relative overflow-hidden"
              style={{ borderColor: `${RED}25`, background: `${RED}06`, boxShadow: `0 0 20px ${RED}08` }}
            >
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0, 0.06, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ background: `linear-gradient(180deg, ${RED}18, transparent)` }} />
              <p className="text-xs uppercase tracking-[0.12em] text-white/40 mb-2 relative font-medium">Direct cost</p>
              <p className="text-white text-4xl font-light relative">$288,000+</p>
              <p className="text-white/40 text-[14px] mt-3 leading-relaxed max-w-xs mx-auto relative">
                Chemo, radiation, ICU stays, lost productivity. Multiplied across millions of patients, this is the GDP-scale crisis a16z calls "the cost of infinite healthcare."
              </p>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: With Medient ── */}
          <motion.div
            className="flex flex-col items-center relative"
            animate={{
              opacity: activeSide === "right" ? 1 : 0.25,
              scale: activeSide === "right" ? 1 : 0.97,
              filter: activeSide === "right" ? "blur(0px)" : "blur(1px)",
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Engine background — only visible when right is active */}
            <motion.div
              animate={{ opacity: activeSide === "right" ? 1 : 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 pointer-events-none"
            >
              <EngineBackground />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-[13px] uppercase tracking-[0.15em] mb-6 font-semibold px-5 py-2.5 border self-center relative z-10"
              style={{ color: POSITIVE, borderColor: `${POSITIVE}25`, background: `${POSITIVE}08`, boxShadow: `0 0 12px ${POSITIVE}10` }}
            >
              ✓ With Medient
            </motion.div>

            <div className="w-full max-w-sm flex flex-col items-center gap-0 relative z-10">
              <ScreeningNode label="LDCT Lung Screening" sublabel="Auto-ordered by compiled guideline" color={POSITIVE} status="Compiled" delay={0.5} inView={inView} />
              <Connector color={POSITIVE} />
              <ScreeningNode label="Colonoscopy" sublabel="Scheduled — age + risk flagged" color={POSITIVE} status="Scheduled" delay={0.6} inView={inView} />
              <Connector color={POSITIVE} />
              <ScreeningNode label="BP + Lipid Panel" sublabel="Statin pathway compiled" color={POSITIVE} status="Optimized" delay={0.7} inView={inView} />
              <Connector color={POSITIVE} />
              <ScreeningNode label="HbA1c" sublabel="Pre-diabetes detected at 6.1%" color={POSITIVE} status="Detected" delay={0.8} inView={inView} />
            </div>

            <Connector color={POSITIVE} height={36} />

            {/* Patient outcome */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.0 }}
              className="border p-7 text-center w-full max-w-sm relative overflow-hidden z-10"
              style={{ borderColor: `${POSITIVE}35`, background: `${POSITIVE}0a`, boxShadow: `0 0 30px ${POSITIVE}12, inset 0 0 20px ${POSITIVE}08` }}
            >
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0, 0.10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: `radial-gradient(circle at 50% 30%, ${POSITIVE}25, transparent 70%)` }} />
              <p className="text-xs uppercase tracking-[0.12em] mb-2 relative font-semibold" style={{ color: POSITIVE }}>Patient Outcome</p>
              <p className="text-white text-4xl font-light relative" style={{ letterSpacing: "-0.02em" }}>Stage IA</p>
              <p className="text-white/45 text-[15px] mt-2 relative">Caught early · 92% survival</p>
            </motion.div>

            <Connector color={POSITIVE} height={24} />

            {/* Cost */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.15 }}
              className="border p-7 text-center w-full relative overflow-hidden z-10"
              style={{ borderColor: `${TEAL}25`, background: `${TEAL}06`, boxShadow: `0 0 20px ${TEAL}08` }}
            >
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0, 0.05, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ background: `linear-gradient(180deg, ${TEAL}15, transparent)` }} />
              <p className="text-xs uppercase tracking-[0.12em] text-white/40 mb-2 relative font-medium">Direct cost</p>
              <p className="text-white text-4xl font-light relative">$4,200</p>
              <p className="text-white/40 text-[14px] mt-3 leading-relaxed max-w-xs mx-auto relative">
                Outpatient screening, early intervention. 68x cheaper. Scaled across populations, this is how you bend the healthcare cost curve.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Medient Engine badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="flex items-center justify-center gap-5 border border-white/[0.06] p-6 mt-14 max-w-md mx-auto"
          style={{ background: "#1e2227" }}
        >
          <ShapeshiftingLogo size={100} />
          <div>
            <p className="text-xs uppercase tracking-[0.12em] mb-1" style={{ color: TEAL }}>Medient Engine</p>
            <p className="text-white/45 text-[13px] leading-relaxed">
              Compiled clinical decision infrastructure analyzing 23 guideline pathways in &lt;0.3s
            </p>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-14 grid grid-cols-3 gap-px bg-white/[0.04]"
        >
          {[
            { val: "340+", label: "Early detections / year" },
            { val: "$96M", label: "Downstream costs avoided" },
            { val: "94%", label: "Screening gaps closed" },
          ].map((s) => (
            <div key={s.val} className="p-6 text-center" style={{ background: "#1a1d21" }}>
              <p className="text-2xl font-light text-white" style={{ letterSpacing: "-0.02em" }}>{s.val}</p>
              <p className="text-white/40 text-[14px] mt-1.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PatientNarrativeSection;

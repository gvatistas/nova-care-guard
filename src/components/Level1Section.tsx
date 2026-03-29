import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const TEAL = "#4AEDC4";
const RED = "#FF5555";
const AMBER = "#F5A623";
const GREEN = "#4AED7C";

/* ── Animated counter ── */
const Counter = ({ value, active }: { value: number; active: boolean }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [value, active]);
  return <>{display}</>;
};

/* ── Alert Badge — animated pop-in ── */
const AlertBadge = ({ label, color, delay, status }: { label: string; color: string; delay: number; status: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, type: "spring", damping: 12, stiffness: 200 }}
    className="flex items-center gap-3 px-4 py-3 border"
    style={{
      borderColor: `${color}33`,
      background: `${color}0A`,
    }}
  >
    <motion.div
      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: delay + 0.5 }}
      className="w-2.5 h-2.5 rounded-full shrink-0"
      style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}66` }}
    />
    <div className="flex-1 min-w-0">
      <div className="font-mono text-[11px] text-white/90 tracking-wide">{label}</div>
    </div>
    <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-1 border rounded-sm shrink-0"
      style={{ color, borderColor: `${color}44`, backgroundColor: `${color}11` }}>
      {status}
    </span>
  </motion.div>
);

/* ── Animated Decision Flow — SVG with particles ── */
const DecisionFlow = ({ isWithout, inView }: { isWithout: boolean; inView: boolean }) => {
  // Both paths start from the same 3 alerts at top, flow through a decision engine, 
  // then diverge to outcomes

  const pathColor = isWithout ? RED : TEAL;
  const engineColor = isWithout ? "#444" : TEAL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="w-full"
    >
      <svg viewBox="0 0 600 380" className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id={`glow-${isWithout ? 'r' : 'g'}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`flow-${isWithout ? 'r' : 'g'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pathColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={pathColor} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* ── TOP: Three alert sources ── */}
        {[
          { x: 100, label: "LUNG RISK", color: RED, icon: "⚠" },
          { x: 300, label: "COLON RISK", color: AMBER, icon: "⚠" },
          { x: 500, label: "CARDIAC RISK", color: RED, icon: "⚠" },
        ].map((alert, i) => (
          <g key={i}>
            {/* Alert node */}
            <rect x={alert.x - 55} y={8} width={110} height={32} rx="3"
              fill={`${alert.color}15`} stroke={alert.color} strokeWidth="1" opacity={0.8} />
            <text x={alert.x} y={28} textAnchor="middle" fontFamily="monospace" fontSize="9"
              fill={alert.color} letterSpacing="1.5" opacity={0.9}>
              {alert.label}
            </text>
            {/* Pulsing dot */}
            <circle cx={alert.x - 42} cy={24} r="3" fill={alert.color} opacity={0.7}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              <animate attributeName="r" values="2;4;2" dur="1.8s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>

            {/* Lines down to engine */}
            <line x1={alert.x} y1={42} x2={300} y2={95}
              stroke={pathColor} strokeWidth="1" opacity={0.2}
              strokeDasharray={isWithout ? "4 4" : "none"} />

            {/* Flowing particles */}
            {!isWithout && (
              <circle r="2.5" fill={TEAL} opacity={0.7}>
                <animate attributeName="cx" values={`${alert.x};300`}
                  dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
                <animate attributeName="cy" values="42;95"
                  dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
                <animate attributeName="opacity" values="0;0.8;0"
                  dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
            )}
          </g>
        ))}

        {/* ── MIDDLE: Decision Engine ── */}
        <g>
          {/* Engine box */}
          <rect x={200} y={85} width={200} height={50} rx="4"
            fill={`${engineColor}12`} stroke={engineColor} strokeWidth={isWithout ? 0.5 : 1.5}
            opacity={isWithout ? 0.3 : 0.8} />

          {/* Engine label */}
          <text x={300} y={107} textAnchor="middle" fontFamily="monospace" fontSize="10"
            fill={engineColor} letterSpacing="3" fontWeight="500"
            opacity={isWithout ? 0.3 : 0.9}>
            {isWithout ? "MANUAL REVIEW" : "MEDIENT ENGINE"}
          </text>
          <text x={300} y={125} textAnchor="middle" fontFamily="monospace" fontSize="7"
            fill={engineColor} letterSpacing="2" opacity={isWithout ? 0.2 : 0.5}>
            {isWithout ? "TIME-CONSTRAINED · ERROR-PRONE" : "GUIDELINE COMPILER · DETERMINISTIC"}
          </text>

          {/* Processing animation for WITH */}
          {!isWithout && (
            <>
              <rect x={215} y={130} width={170} height={2} rx="1" fill={`${TEAL}22`} />
              <rect x={215} y={130} width={170} height={2} rx="1" fill={TEAL} opacity={0.5}>
                <animate attributeName="width" values="0;170;0" dur="2.5s" repeatCount="indefinite" />
              </rect>
            </>
          )}
        </g>

        {/* ── BOTTOM: Branching outcomes ── */}
        {[
          { x: 100, label: isWithout ? "NOT ORDERED" : "LDCT ORDERED", risk: "LUNG", delay: 0 },
          { x: 300, label: isWithout ? "NOT ORDERED" : "COLONOSCOPY SCHEDULED", risk: "COLON", delay: 0.3 },
          { x: 500, label: isWithout ? "OVERLOOKED" : "BP MANAGEMENT", risk: "CARDIAC", delay: 0.6 },
        ].map((outcome, i) => {
          const outColor = isWithout ? "#555" : (i === 0 ? RED : i === 1 ? AMBER : TEAL);
          const statusColor = isWithout ? RED : GREEN;
          return (
            <g key={`out${i}`}>
              {/* Line from engine to outcome */}
              <line x1={300} y1={137} x2={outcome.x} y2={195}
                stroke={pathColor} strokeWidth="1" opacity={0.2}
                strokeDasharray={isWithout ? "4 4" : "none"} />

              {/* Flowing particles */}
              {!isWithout && (
                <circle r="2.5" fill={TEAL} opacity={0.6}>
                  <animate attributeName="cx" values={`300;${outcome.x}`}
                    dur="1.8s" repeatCount="indefinite" begin={`${0.8 + i * 0.3}s`} />
                  <animate attributeName="cy" values="137;195"
                    dur="1.8s" repeatCount="indefinite" begin={`${0.8 + i * 0.3}s`} />
                  <animate attributeName="opacity" values="0;0.7;0"
                    dur="1.8s" repeatCount="indefinite" begin={`${0.8 + i * 0.3}s`} />
                </circle>
              )}

              {/* Outcome card */}
              <rect x={outcome.x - 70} y={195} width={140} height={50} rx="3"
                fill={`${statusColor}0A`} stroke={`${statusColor}44`} strokeWidth="1" />

              {/* Risk type */}
              <text x={outcome.x} y={213} textAnchor="middle" fontFamily="monospace" fontSize="7"
                fill={outColor} letterSpacing="2" opacity={0.7}>
                {outcome.risk}
              </text>

              {/* Outcome label */}
              <text x={outcome.x} y={228} textAnchor="middle" fontFamily="monospace" fontSize="8"
                fill={statusColor} letterSpacing="1" fontWeight="500">
                {outcome.label}
              </text>

              {/* Status indicator */}
              <circle cx={outcome.x} cy={237} r="2" fill={statusColor} opacity={0.6}>
                {!isWithout && (
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                )}
              </circle>

              {/* Lines to final outcome */}
              <line x1={outcome.x} y1={247} x2={300} y2={290}
                stroke={statusColor} strokeWidth="0.8" opacity={0.15}
                strokeDasharray={isWithout ? "3 3" : "none"} />
            </g>
          );
        })}

        {/* ── FINAL: Outcome summary ── */}
        <g>
          <rect x={200} y={285} width={200} height={55} rx="4"
            fill={isWithout ? `${RED}0A` : `${GREEN}0A`}
            stroke={isWithout ? `${RED}44` : `${GREEN}44`}
            strokeWidth="1.5" />

          <text x={300} y={308} textAnchor="middle" fontFamily="monospace" fontSize="18"
            fill={isWithout ? RED : GREEN} fontWeight="300"
            filter={`url(#glow-${isWithout ? 'r' : 'g'})`}>
            {isWithout ? "0 / 3" : "3 / 3"}
          </text>
          <text x={300} y={328} textAnchor="middle" fontFamily="monospace" fontSize="8"
            fill={isWithout ? `${RED}88` : `${GREEN}88`} letterSpacing="3">
            {isWithout ? "SCREENINGS MISSED" : "SCREENINGS COMPLETED"}
          </text>

          {/* Pulsing ring for WITH */}
          {!isWithout && (
            <rect x={195} y={280} width={210} height={65} rx="6"
              fill="none" stroke={GREEN} strokeWidth="0.5" opacity={0.2}>
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite" />
            </rect>
          )}
        </g>

        {/* ── Ambient particles for WITH ── */}
        {!isWithout && Array.from({ length: 15 }).map((_, i) => {
          const sx = 100 + Math.random() * 400;
          const sy = 50 + Math.random() * 280;
          return (
            <circle key={`amb${i}`} cx={sx} cy={sy} r="1" fill={TEAL} opacity={0.15}>
              <animate attributeName="opacity" values="0.05;0.25;0.05"
                dur={`${2 + (i % 4) * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>
          );
        })}
      </svg>
    </motion.div>
  );
};

/* ── Outcome metrics — compact row ── */
const OutcomeMetrics = ({ isWithout, inView }: { isWithout: boolean; inView: boolean }) => {
  const metrics = isWithout
    ? [
        { val: "$280K+", label: "Treatment cost", color: RED },
        { val: "18 mo", label: "Delayed diagnosis", color: RED },
        { val: "Stage IIIB", label: "At diagnosis", color: RED },
        { val: "8%", label: "5-year survival", color: RED },
      ]
    : [
        { val: "$4,200", label: "Screening cost", color: TEAL },
        { val: "0 days", label: "Time to action", color: TEAL },
        { val: "Stage IA", label: "At diagnosis", color: GREEN },
        { val: "92%", label: "5-year survival", color: GREEN },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8"
    >
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.1 + i * 0.1, type: "spring", damping: 15 }}
          className="text-center py-4 px-3 border border-white/[0.06] bg-white/[0.015]"
        >
          <div className="font-mono text-2xl md:text-3xl font-light" style={{ color: m.color }}>{m.val}</div>
          <div className="text-gray-500 text-[10px] font-mono tracking-[0.1em] uppercase mt-1">{m.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* ── Main section ── */
const Level1Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeView, setActiveView] = useState<"without" | "with">("without");
  const isWithout = activeView === "without";

  // Auto-cycle to show both paths
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    if (hasInteracted || !inView) return;
    const timer = setTimeout(() => {
      setActiveView("with");
    }, 4000);
    return () => clearTimeout(timer);
  }, [inView, hasInteracted]);

  const alerts = [
    { label: "Lung Cancer — LDCT overdue, 20 pack-year history", color: RED, status: "CRITICAL" },
    { label: "Colorectal — No colonoscopy on record, age 52", color: AMBER, status: "HIGH" },
    { label: "Cardiovascular — BP 142/88, statin evaluation needed", color: RED, status: "ELEVATED" },
  ];

  return (
    <section ref={ref} className="relative py-16 md:py-24 texture-diamonds">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(74,237,196,0.02),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-8">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-mono font-light leading-[1.15] tracking-[-0.02em]">
            Same patient. Same clinic. <span className="text-gray-500">Different outcome.</span>
          </h2>
        </motion.div>

        {/* Alerts — always visible at top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3">
            Patient: Sarah Mitchell, 52 — Detected Risk Alerts
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {alerts.map((a, i) => (
              <AlertBadge key={i} {...a} delay={0.3 + i * 0.15} />
            ))}
          </div>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-1 mb-6 bg-white/[0.03] border border-white/[0.06] p-1.5 w-fit"
        >
          {(["without", "with"] as const).map((v) => (
            <button key={v}
              onClick={() => { setActiveView(v); setHasInteracted(true); }}
              className={`font-mono text-sm tracking-[0.1em] uppercase px-6 md:px-8 py-3 transition-all duration-500 border ${
                activeView === v
                  ? v === "without"
                    ? "bg-[hsl(0,72%,60%)]/10 text-[hsl(0,72%,60%)] border-[hsl(0,72%,60%)]/20 shadow-[0_0_20px_rgba(200,50,50,0.1)]"
                    : "bg-accent/10 text-accent border-accent/20 shadow-[0_0_20px_rgba(74,237,196,0.1)]"
                  : "text-gray-500 hover:text-gray-300 border-transparent"
              }`}>
              {v === "without" ? "Without Medient" : "With Medient"}
            </button>
          ))}
        </motion.div>

        {/* Decision Flow Visualization */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="border border-white/[0.06] bg-white/[0.01] p-4 md:p-8"
              style={{ borderColor: isWithout ? "hsl(0,72%,60%,0.1)" : "hsl(160,82%,61%,0.1)" }}>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-4">
                {isWithout ? "Clinical Decision Path — Standard Workflow" : "Clinical Decision Path — Medient Pipeline"}
              </div>
              <DecisionFlow isWithout={isWithout} inView={inView} />
            </div>

            {/* Outcome Metrics */}
            <OutcomeMetrics isWithout={isWithout} inView={inView} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Level1Section;

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stages = [
  { num: "01", name: "INGEST", short: "Parse & Structure", desc: "Clinical guidelines deconstructed from unstructured knowledge into atomic logical components.", icon: "↓" },
  { num: "02", name: "MODEL", short: "Type & Constrain", desc: "Decision schema with explicit constraints, typed branches, and deterministic pathways.", icon: "◇" },
  { num: "03", name: "VERIFY", short: "Prove Correctness", desc: "Formal verification via SMT solver proves exhaustiveness, determinism, and safety properties across the entire input space.", icon: "✓" },
  { num: "04", name: "ANALYZE", short: "Validate & Audit", desc: "Graph analysis confirms no orphan nodes or unreachable states. Complete decision provenance from input to source guideline paragraph.", icon: "△" },
  { num: "05", name: "DEPLOY", short: "Ship as Infrastructure", desc: "Compiled into a FHIR-native artifact. On-premises or cloud. Air-gapped network support. Zero inference at runtime.", icon: "→" },
];

const differentiators = [
  {
    id: "deterministic", label: "Deterministic", icon: "◆", accentHsl: "160 82% 61%",
    headline: "Zero inference. Zero hallucination.",
    description: "Unlike LLM-based clinical tools, Medient artifacts produce identical outputs for identical inputs — every time, everywhere. No temperature. No drift. No probabilistic liability.",
    comparison: [
      { metric: "Hallucination rate", medient: "0.0%", others: "2–8%" },
      { metric: "Output consistency", medient: "100%", others: "~92%" },
      { metric: "Audit trail", medient: "Complete", others: "Partial" },
      { metric: "Regulatory pathway", medient: "SaMD Class II", others: "Undefined" },
    ],
  },
  {
    id: "compiled", label: "Compiled", icon: "⬡", accentHsl: "210 70% 55%",
    headline: "Not interpreted. Not prompted. Compiled.",
    description: "Medient doesn't 'read' guidelines at query time. Each guideline is compiled once into a verified decision artifact — a typed, exhaustively tested logical structure that runs as deterministic infrastructure.",
    comparison: [
      { metric: "Processing model", medient: "Compile-once", others: "Query-time" },
      { metric: "Latency", medient: "<1ms", others: "200–800ms" },
      { metric: "Verification", medient: "SMT-proven", others: "Unit tests" },
      { metric: "Edge case coverage", medient: "Exhaustive", others: "Sample-based" },
    ],
  },
  {
    id: "traceable", label: "Traceable", icon: "◈", accentHsl: "270 50% 60%",
    headline: "Every recommendation has a source.",
    description: "Full provenance tracing from output recommendation to the exact guideline paragraph, page number, and publication. No black box. Just verified clinical logic.",
    comparison: [
      { metric: "Source attribution", medient: "Page-level", others: "None" },
      { metric: "Decision path", medient: "Fully visible", others: "Opaque" },
      { metric: "Reproducibility", medient: "Guaranteed", others: "Variable" },
      { metric: "Compliance readiness", medient: "Immediate", others: "6–12 months" },
    ],
  },
  {
    id: "scalable", label: "Scalable", icon: "◇", accentHsl: "35 50% 60%",
    headline: "$0 marginal cost per encounter.",
    description: "Once compiled, a Medient artifact costs nothing additional to run. No token usage. No API calls. No per-query fees. Deploy across an entire health system and the unit economics only improve.",
    comparison: [
      { metric: "Cost per query", medient: "$0.00", others: "$0.02–0.15" },
      { metric: "Scaling model", medient: "Linear O(1)", others: "Linear O(n)" },
      { metric: "Infrastructure", medient: "FHIR-native", others: "Custom API" },
      { metric: "Deployment", medient: "Embeddable", others: "Cloud-only" },
    ],
  },
];

const nodePositions = [
  { x: 120, y: 380 },
  { x: 360, y: 200 },
  { x: 600, y: 80 },
  { x: 840, y: 200 },
  { x: 1080, y: 380 },
];

const crownPath = "M 120,380 L 360,200 L 480,300 L 600,80 L 720,300 L 840,200 L 1080,380";

const TEAL = "hsl(160, 82%, 61%)";
const TEAL_RGB = "74,237,196";
const BLUE = "hsl(210, 70%, 55%)";

const PipelineVisual = ({ hoveredStage, setHoveredStage, autoStage }: {
  hoveredStage: number | null;
  setHoveredStage: (i: number | null) => void;
  autoStage: number;
}) => {
  const activeIdx = hoveredStage ?? autoStage;

  return (
    <div className="relative w-full" style={{ aspectRatio: "2.4/1" }}>
      <svg viewBox="0 0 1200 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowSoft">
            <feGaussianBlur stdDeviation="12" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.15" />
            <stop offset="50%" stopColor={TEAL} stopOpacity="0.4" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.12" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fine grid */}
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="white" strokeWidth="0.3" opacity="0.02" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="1200" y2={i * 50} stroke="white" strokeWidth="0.3" opacity="0.02" />
        ))}

        {/* Crown silhouette — ghost outline */}
        <path d={crownPath} fill="none" stroke="url(#crownGrad)" strokeWidth="0.8" opacity="0.2" />
        <path d={`${crownPath} Z`} fill={TEAL} opacity="0.008" />

        {/* Inner struts */}
        {[[360,200,480,300],[600,80,480,300],[600,80,720,300],[840,200,720,300]].map(([x1,y1,x2,y2], i) => (
          <line key={`s${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.4" opacity="0.04" />
        ))}

        {/* Flow particles — two streams */}
        {[0, -120].map((offset, fi) => (
          <path key={fi} d={crownPath} fill="none" stroke={TEAL} strokeWidth={fi === 0 ? 1.5 : 1} opacity={fi === 0 ? 0.35 : 0.15}
            strokeDasharray={fi === 0 ? "30 170" : "15 185"} strokeDashoffset={offset}>
            <animate attributeName="stroke-dashoffset" values={`${offset};${offset - 200}`} dur="4s" repeatCount="indefinite" />
          </path>
        ))}

        {/* Connection lines — lit progressively to active node */}
        {nodePositions.map((pos, i) => {
          if (i === 0) return null;
          const prev = nodePositions[i - 1]!;
          const isLit = i <= activeIdx;
          return (
            <line key={`c${i}`} x1={prev.x} y1={prev.y} x2={pos.x} y2={pos.y}
              stroke={isLit ? TEAL : "white"}
              strokeWidth={isLit ? 1.2 : 0.5}
              opacity={isLit ? 0.4 : 0.06}
              style={{ transition: "all 0.6s ease" }} />
          );
        })}

        {/* Nodes */}
        {nodePositions.map((pos, i) => {
          const stage = stages[i]!;
          const isActive = i === activeIdx;
          const isCompleted = i < activeIdx;

          return (
            <g key={i}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
              className="cursor-pointer">

              {/* Ambient glow */}
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r="60" fill="url(#nodeGlow)" filter="url(#glowSoft)">
                  <animate attributeName="r" values="55;70;55" dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Outer orbit ring */}
              <circle cx={pos.x} cy={pos.y} r={isActive ? 38 : 28}
                fill="none" stroke={isActive ? TEAL : "white"}
                strokeWidth={isActive ? 0.8 : 0.3}
                opacity={isActive ? 0.5 : 0.08}
                strokeDasharray={isActive ? "5 5" : "3 9"}
                style={{ transition: "all 0.6s ease" }}>
                <animateTransform attributeName="transform" type="rotate"
                  from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`}
                  dur={isActive ? "8s" : "30s"} repeatCount="indefinite" />
              </circle>

              {/* Second orbit */}
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r="46" fill="none" stroke={TEAL}
                  strokeWidth="0.4" opacity="0.2" strokeDasharray="2 10">
                  <animateTransform attributeName="transform" type="rotate"
                    from={`360 ${pos.x} ${pos.y}`} to={`0 ${pos.x} ${pos.y}`}
                    dur="12s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Diamond node */}
              <rect x={pos.x - 16} y={pos.y - 16} width="32" height="32" rx="2"
                transform={`rotate(45 ${pos.x} ${pos.y})`}
                fill={isActive ? `rgba(${TEAL_RGB}, 0.08)` : "hsl(0, 0%, 3%)"}
                stroke={isActive ? TEAL : isCompleted ? TEAL : "white"}
                strokeWidth={isActive ? 1.5 : isCompleted ? 0.8 : 0.4}
                opacity={isActive ? 1 : isCompleted ? 0.6 : 0.3}
                filter={isActive ? "url(#glow)" : undefined}
                style={{ transition: "all 0.5s ease" }} />

              {/* Number */}
              <text x={pos.x} y={pos.y + 5} textAnchor="middle"
                fontFamily="monospace" fontSize="12" fontWeight="300"
                fill={isActive ? TEAL : isCompleted ? TEAL : "#666"}
                opacity={isActive ? 1 : 0.7}
                style={{ transition: "fill 0.5s ease" }}>
                {stage.num}
              </text>

              {/* Name */}
              <text x={pos.x} y={pos.y + 56} textAnchor="middle"
                fontFamily="monospace" fontSize="12" letterSpacing="3"
                fill={isActive ? TEAL : isCompleted ? `rgba(${TEAL_RGB}, 0.6)` : "#555"}
                style={{ transition: "fill 0.5s ease" }}>
                {stage.name}
              </text>

              {/* Subtitle on active */}
              {isActive && (
                <text x={pos.x} y={pos.y + 72} textAnchor="middle"
                  fontFamily="monospace" fontSize="9" letterSpacing="1.5"
                  fill="#888" opacity="0.7">
                  {stage.short}
                </text>
              )}

              {/* Pulse dot */}
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r="2.5" fill={TEAL} opacity="0.9" filter="url(#glow)">
                  <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Completed check */}
              {isCompleted && !isActive && (
                <circle cx={pos.x + 14} cy={pos.y - 14} r="4" fill={TEAL} opacity="0.5" />
              )}

              {/* Hit area */}
              <circle cx={pos.x} cy={pos.y} r="55" fill="transparent" />
            </g>
          );
        })}

        {/* Input / Output labels */}
        <g opacity="0.25">
          <polygon points="52,380 68,374 68,386" fill={TEAL} />
          <line x1="58" y1="380" x2="88" y2="380" stroke={TEAL} strokeWidth="0.6" />
          <text x="120" y="430" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#555" letterSpacing="4">GUIDELINE</text>
        </g>
        <g opacity="0.25">
          <polygon points="1148,380 1132,374 1132,386" fill={TEAL} />
          <line x1="1112" y1="380" x2="1142" y2="380" stroke={TEAL} strokeWidth="0.6" />
          <text x="1080" y="430" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#555" letterSpacing="4">ARTIFACT</text>
        </g>
      </svg>
    </div>
  );
};

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [autoStage, setAutoStage] = useState(0);
  const [activeDiff, setActiveDiff] = useState(0);
  const diff = differentiators[activeDiff]!;

  // Auto-cycle when not hovering
  useEffect(() => {
    if (hoveredStage !== null || !inView) return;
    const interval = setInterval(() => {
      setAutoStage((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, [hoveredStage, inView]);

  const activeIdx = hoveredStage ?? autoStage;
  const activeStage = stages[activeIdx]!;

  return (
    <section id="pipeline" ref={ref} className="relative py-14 md:py-20 texture-facets">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(91,141,239,0.025),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 mb-6">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-[hsl(210,70%,55%)]/70 mb-3">Architecture</div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
              Five stages. <span className="text-gray-500">Verified at every gate.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              No inference at runtime. Compiled once, verified exhaustively, deployed as <span className="text-white font-normal">deterministic infrastructure</span>.
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="border border-white/[0.06] bg-white/[0.01] panel-3d overflow-hidden">
          <div className="hidden md:block">
            <PipelineVisual hoveredStage={hoveredStage} setHoveredStage={setHoveredStage} autoStage={autoStage} />
          </div>

          {/* Detail panel */}
          <div className="px-6 md:px-8 py-5 border-t border-white/[0.06]"
            style={{
              background: `linear-gradient(135deg, rgba(${TEAL_RGB}, 0.03), transparent 60%)`,
              transition: "background 0.5s ease",
            }}>
            <motion.div key={activeIdx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }} className="flex items-start md:items-center gap-5 md:gap-8 flex-col md:flex-row">
              <div className="flex items-center gap-4 shrink-0">
                <span className="w-8 h-8 flex items-center justify-center border border-accent/30 rotate-45">
                  <span className="-rotate-45 font-mono text-accent text-sm">{activeStage.num}</span>
                </span>
                <div>
                  <span className="font-mono text-white text-lg md:text-xl font-light tracking-wide">{activeStage.name}</span>
                  <span className="font-mono text-gray-600 text-xs ml-3 tracking-[0.15em]">{activeStage.short}</span>
                </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/[0.06]" />
              <p className="text-gray-300 text-base leading-relaxed flex-1">{activeStage.desc}</p>
              {/* Progress dots */}
              <div className="flex items-center gap-2 shrink-0">
                {stages.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: i === activeIdx ? TEAL : i < activeIdx ? `rgba(${TEAL_RGB}, 0.4)` : "#333",
                      transform: i === activeIdx ? "scale(1.5)" : "scale(1)",
                    }} />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Differentiators — integrated below pipeline */}
        <div className="mt-8">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-1.5 mb-5">
            {differentiators.map((d, i) => (
              <button key={d.id} onClick={() => setActiveDiff(i)}
                className={`font-mono text-sm tracking-wide px-4 py-2.5 border transition-all duration-400 panel-3d ${
                  activeDiff === i ? "border-current bg-current/10" : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
                }`}
                style={activeDiff === i ? { color: `hsl(${d.accentHsl})`, borderColor: `hsl(${d.accentHsl} / 0.3)`, backgroundColor: `hsl(${d.accentHsl} / 0.08)` } : undefined}>
                <span className="mr-2 text-xs">{d.icon}</span>{d.label}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={activeDiff} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="border border-white/[0.06] overflow-hidden panel-3d"
              style={{ borderColor: `hsl(${diff.accentHsl} / 0.15)` }}>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="px-6 md:px-8 py-5 border-b lg:border-b-0 lg:border-r border-white/[0.06]"
                  style={{ background: `linear-gradient(135deg, hsl(${diff.accentHsl} / 0.05), transparent 60%)` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl" style={{ color: `hsl(${diff.accentHsl})` }}>{diff.icon}</span>
                    <h3 className="font-mono text-xl md:text-2xl font-light" style={{ color: `hsl(${diff.accentHsl})` }}>{diff.headline}</h3>
                  </div>
                  <p className="text-gray-300 text-base leading-[1.7]">{diff.description}</p>
                </div>
                <div className="grid grid-cols-1 divide-y divide-white/[0.06]">
                  <div className="px-6 md:px-8 py-3 flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500">Metric</span>
                    <div className="flex items-center gap-8">
                      <span className="font-mono text-xs tracking-[0.15em] uppercase" style={{ color: `hsl(${diff.accentHsl})` }}>Medient</span>
                      <span className="font-mono text-xs tracking-[0.15em] uppercase text-gray-600 w-20 text-right">Others</span>
                    </div>
                  </div>
                  {diff.comparison.map((row, ri) => (
                    <div key={ri} className="px-6 md:px-8 py-3.5 flex items-center justify-between hover:bg-white/[0.015] transition-colors duration-300">
                      <span className="text-gray-300 text-base">{row.metric}</span>
                      <div className="flex items-center gap-8">
                        <span className="font-mono text-lg font-light" style={{ color: `hsl(${diff.accentHsl})` }}>{row.medient}</span>
                        <span className="font-mono text-base text-gray-600 w-20 text-right">{row.others}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile fallback */}
        <div className="md:hidden mt-4 border-t border-white/[0.06]">
          {stages.map((stage, i) => (
            <motion.div key={stage.num} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="border-b border-white/[0.06] py-4 px-2">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-mono text-accent/50 text-sm">{stage.num}</span>
                <h3 className="font-mono text-white text-base font-light">{stage.name}</h3>
                <span className="font-mono text-gray-600 text-xs">— {stage.short}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed pl-9">{stage.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;

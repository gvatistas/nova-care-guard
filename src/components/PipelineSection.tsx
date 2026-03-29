import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const stages = [
  { num: "01", name: "Ingest", short: "Parse & structure", desc: "Unstructured clinical knowledge transformed into structured logic with full source fidelity." },
  { num: "02", name: "Model", short: "Type & constrain", desc: "Decision schema with explicit constraints, typed branches, and deterministic pathways." },
  { num: "03", name: "Verify", short: "Prove correctness", desc: "Formal verification proves exhaustiveness and determinism across the entire input space." },
  { num: "04", name: "Analyze", short: "Validate topology", desc: "Graph analysis confirms no orphan nodes, unreachable states, or infinite loops." },
  { num: "05", name: "Deploy", short: "Ship as infrastructure", desc: "Compiled into a FHIR-native artifact. Deterministic at runtime. Zero inference." },
];

/* Crown-inspired node positions for the SVG pipeline (viewBox 0 0 1200 500) */
const nodePositions = [
  { x: 120, y: 380 },  // Ingest — left base
  { x: 360, y: 200 },  // Model — left peak
  { x: 600, y: 80 },   // Verify — crown apex
  { x: 840, y: 200 },  // Analyze — right peak
  { x: 1080, y: 380 }, // Deploy — right base
];

/* Crown outline vertices (matches Medient crown shape) */
const crownPath = "M 120,380 L 360,200 L 480,300 L 600,80 L 720,300 L 840,200 L 1080,380";

const PipelineVisual = ({ hoveredStage, setHoveredStage, inView }: {
  hoveredStage: number | null;
  setHoveredStage: (i: number | null) => void;
  inView: boolean;
}) => {
  return (
    <div className="relative w-full" style={{ aspectRatio: "12/5" }}>
      <svg viewBox="0 0 1200 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Gradient for the crown path */}
          <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(160, 82%, 61%)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="hsl(210, 70%, 55%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(160, 82%, 61%)" stopOpacity="0.4" />
          </linearGradient>
          {/* Animated dash */}
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(160, 82%, 61%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(160, 82%, 61%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(160, 82%, 61%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background grid — subtle angular */}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" stroke="white" strokeWidth="0.5" opacity="0.03" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} stroke="white" strokeWidth="0.5" opacity="0.03" />
        ))}

        {/* Crown silhouette — very faint */}
        <path d={crownPath} fill="none" stroke="url(#crownGrad)" strokeWidth="1" opacity="0.15" />
        {/* Crown fill — barely visible */}
        <path d={`${crownPath} Z`} fill="hsl(160, 82%, 61%)" opacity="0.01" />

        {/* Animated flow particles along the crown path */}
        <path d={crownPath} fill="none" stroke="url(#flowGrad)" strokeWidth="2" opacity="0.3"
          strokeDasharray="40 160" strokeDashoffset="0">
          <animate attributeName="stroke-dashoffset" values="0;-200" dur="3s" repeatCount="indefinite" />
        </path>
        <path d={crownPath} fill="none" stroke="url(#flowGrad)" strokeWidth="1.5" opacity="0.2"
          strokeDasharray="20 180" strokeDashoffset="-100">
          <animate attributeName="stroke-dashoffset" values="-100;-300" dur="3s" repeatCount="indefinite" />
        </path>

        {/* Connection lines between consecutive nodes */}
        {nodePositions.map((pos, i) => {
          if (i === 0) return null;
          const prev = nodePositions[i - 1];
          const isAdjacentHovered = hoveredStage === i || hoveredStage === i - 1;
          return (
            <line key={`conn${i}`} x1={prev.x} y1={prev.y} x2={pos.x} y2={pos.y}
              stroke={isAdjacentHovered ? "hsl(160, 82%, 61%)" : "white"}
              strokeWidth={isAdjacentHovered ? 1.5 : 0.8}
              opacity={isAdjacentHovered ? 0.5 : 0.08}
              style={{ transition: "all 0.5s ease" }} />
          );
        })}

        {/* Inner crown struts — the V shapes */}
        <line x1="360" y1="200" x2="480" y2="300" stroke="white" strokeWidth="0.5" opacity="0.06" />
        <line x1="600" y1="80" x2="480" y2="300" stroke="white" strokeWidth="0.5" opacity="0.06" />
        <line x1="600" y1="80" x2="720" y2="300" stroke="white" strokeWidth="0.5" opacity="0.06" />
        <line x1="840" y1="200" x2="720" y2="300" stroke="white" strokeWidth="0.5" opacity="0.06" />

        {/* Radial burst lines from each node */}
        {nodePositions.map((pos, i) => {
          const isHovered = hoveredStage === i;
          const burstCount = 6;
          return Array.from({ length: burstCount }).map((_, bi) => {
            const angle = (bi / burstCount) * Math.PI * 2;
            const len = isHovered ? 45 : 25;
            return (
              <line key={`burst${i}-${bi}`}
                x1={pos.x} y1={pos.y}
                x2={pos.x + Math.cos(angle) * len} y2={pos.y + Math.sin(angle) * len}
                stroke="hsl(160, 82%, 61%)"
                strokeWidth={isHovered ? 0.8 : 0.3}
                opacity={isHovered ? 0.3 : 0.06}
                style={{ transition: "all 0.5s ease" }} />
            );
          });
        })}

        {/* Nodes */}
        {nodePositions.map((pos, i) => {
          const stage = stages[i];
          const isHovered = hoveredStage === i;
          return (
            <g key={i}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
              className="cursor-pointer"
              style={{ transition: "all 0.5s ease" }}>
              {/* Outer ring — pulsing */}
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 42 : 32}
                fill="none" stroke="hsl(160, 82%, 61%)"
                strokeWidth={isHovered ? 1 : 0.4}
                opacity={isHovered ? 0.5 : 0.12}
                strokeDasharray={isHovered ? "6 4" : "4 8"}
                style={{ transition: "all 0.5s ease" }}>
                <animateTransform attributeName="transform" type="rotate"
                  from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`}
                  dur={isHovered ? "6s" : "20s"} repeatCount="indefinite" />
              </circle>

              {/* Middle ring */}
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 30 : 24}
                fill="none" stroke={isHovered ? "hsl(160, 82%, 61%)" : "white"}
                strokeWidth={isHovered ? 1.2 : 0.5}
                opacity={isHovered ? 0.6 : 0.1}
                style={{ transition: "all 0.5s ease" }}>
                <animateTransform attributeName="transform" type="rotate"
                  from={`360 ${pos.x} ${pos.y}`} to={`0 ${pos.x} ${pos.y}`}
                  dur="12s" repeatCount="indefinite" />
              </circle>

              {/* Inner diamond — the node itself */}
              <rect x={pos.x - 14} y={pos.y - 14} width="28" height="28"
                rx="2"
                transform={`rotate(45 ${pos.x} ${pos.y})`}
                fill={isHovered ? "hsl(160, 82%, 61%)" : "hsl(0, 0%, 4%)"}
                fillOpacity={isHovered ? 0.15 : 0.8}
                stroke={isHovered ? "hsl(160, 82%, 61%)" : "white"}
                strokeWidth={isHovered ? 1.5 : 0.6}
                opacity={isHovered ? 1 : 0.4}
                filter={isHovered ? "url(#glow)" : undefined}
                style={{ transition: "all 0.4s ease" }} />

              {/* Number inside diamond */}
              <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                fontFamily="monospace" fontSize="11"
                fill={isHovered ? "hsl(160, 82%, 61%)" : "#888"}
                fontWeight="400"
                style={{ transition: "fill 0.4s ease" }}>
                {stage.num}
              </text>

              {/* Stage name below */}
              <text x={pos.x} y={pos.y + 58} textAnchor="middle"
                fontFamily="monospace" fontSize="13"
                fill={isHovered ? "hsl(160, 82%, 61%)" : "#666"}
                letterSpacing="2"
                style={{ transition: "fill 0.4s ease", textTransform: "uppercase" }}>
                {stage.name}
              </text>

              {/* Short descriptor — visible on hover */}
              {isHovered && (
                <text x={pos.x} y={pos.y + 76} textAnchor="middle"
                  fontFamily="monospace" fontSize="10"
                  fill="#999" letterSpacing="1" opacity="0.7">
                  {stage.short}
                </text>
              )}

              {/* Glow dot at center */}
              {isHovered && (
                <circle cx={pos.x} cy={pos.y} r="3"
                  fill="hsl(160, 82%, 61%)" opacity="0.8" filter="url(#glowStrong)">
                  <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Hover hit area */}
              <circle cx={pos.x} cy={pos.y} r="50" fill="transparent" />
            </g>
          );
        })}

        {/* "INPUT" and "OUTPUT" labels */}
        <text x="120" y="440" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#444" letterSpacing="3">GUIDELINE</text>
        <text x="1080" y="440" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#444" letterSpacing="3">ARTIFACT</text>

        {/* Arrow indicators */}
        <polygon points="55,380 70,375 70,385" fill="hsl(160, 82%, 61%)" opacity="0.2" />
        <polygon points="1145,380 1130,375 1130,385" fill="hsl(160, 82%, 61%)" opacity="0.2" />
        <line x1="60" y1="380" x2="85" y2="380" stroke="hsl(160, 82%, 61%)" strokeWidth="0.5" opacity="0.2" />
        <line x1="1115" y1="380" x2="1140" y2="380" stroke="hsl(160, 82%, 61%)" strokeWidth="0.5" opacity="0.2" />
      </svg>
    </div>
  );
};

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  const activeStage = hoveredStage !== null ? stages[hoveredStage] : null;

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
              No inference at runtime. Compiled once, verified exhaustively, deployed as <span className="text-white">deterministic infrastructure</span>.
            </p>
          </motion.div>
        </div>

        {/* Visual pipeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="border border-white/[0.06] bg-white/[0.01] panel-3d overflow-hidden">
          <div className="hidden md:block">
            <PipelineVisual hoveredStage={hoveredStage} setHoveredStage={setHoveredStage} inView={inView} />
          </div>

          {/* Detail panel — appears on hover */}
          <div className="px-6 md:px-8 py-4 border-t border-white/[0.06] min-h-[80px] flex items-center"
            style={{
              background: activeStage
                ? "linear-gradient(135deg, rgba(74,237,196,0.04), transparent 60%)"
                : "transparent",
              transition: "background 0.5s ease",
            }}>
            {activeStage ? (
              <motion.div key={activeStage.num} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }} className="flex items-center gap-6 w-full">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-accent text-lg">{activeStage.num}</span>
                  <span className="font-mono text-white text-lg md:text-xl font-light">{activeStage.name}</span>
                </div>
                <div className="w-px h-8 bg-white/[0.08] hidden md:block" />
                <p className="text-gray-300 text-base leading-relaxed">{activeStage.desc}</p>
              </motion.div>
            ) : (
              <p className="text-gray-500 text-sm font-mono tracking-wide">Hover a node to explore each stage</p>
            )}
          </div>
        </motion.div>

        {/* Mobile fallback — compact list */}
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

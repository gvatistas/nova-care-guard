import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ── Animated counter ── */
const Counter = ({ value, active }: { value: number; active: boolean }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) return;
    const end = value;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [value, active]);
  return <>{display}</>;
};

/* ── 3D Holographic Patient Model ── */
const PatientModel = ({ isWithout, hoveredCard }: { isWithout: boolean; hoveredCard: number | null }) => {
  const teal = "#4AEDC4";
  const red = "#FF5555";
  const amber = "#F5A623";
  const accentColor = isWithout ? "#444" : teal;

  // Wireframe human torso — polygonal mesh style
  const torsoPolygons = [
    // Head
    "M0,-95 L-12,-85 L-15,-70 L-12,-55 L0,-50 L12,-55 L15,-70 L12,-85 Z",
    // Neck
    "M-6,-50 L6,-50 L8,-40 L-8,-40 Z",
    // Shoulders + upper torso
    "M-8,-40 L-35,-35 L-38,-28 L-35,-20 L-30,-15 L-22,-10 L-18,0 L18,0 L22,-10 L30,-15 L35,-20 L38,-28 L35,-35 L8,-40 Z",
    // Core torso
    "M-18,0 L-20,15 L-22,35 L-18,50 L-12,55 L12,55 L18,50 L22,35 L20,15 L18,0 Z",
    // Left leg
    "M-12,55 L-16,70 L-18,90 L-16,110 L-12,120 L-6,120 L-4,110 L-6,90 L-4,70 L-2,55 Z",
    // Right leg
    "M2,55 L4,70 L6,90 L4,110 L6,120 L12,120 L16,110 L18,90 L16,70 L12,55 Z",
  ];

  // Internal organ zones for scanning
  const scanZones = [
    { cx: 0, cy: -25, rx: 16, ry: 12, label: "LUNG", color: isWithout ? "#555" : red, cardIdx: 0 },
    { cx: 0, cy: 25, rx: 14, ry: 16, label: "COLON", color: isWithout ? "#555" : amber, cardIdx: 1 },
    { cx: 8, cy: -10, rx: 8, ry: 8, label: "CARDIO", color: isWithout ? "#555" : teal, cardIdx: 2 },
  ];

  return (
    <div className="relative w-full aspect-[3/4] max-w-[280px] mx-auto">
      <svg viewBox="-55 -110 110 250" className="w-full h-full">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="scanLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={teal} stopOpacity="0" />
            <stop offset="50%" stopColor={teal} stopOpacity={isWithout ? "0" : "0.6"} />
            <stop offset="100%" stopColor={teal} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wireframe mesh body */}
        {torsoPolygons.map((d, i) => (
          <path key={i} d={d} fill="url(#bodyGrad)" stroke={accentColor}
            strokeWidth="0.6" opacity={isWithout ? 0.3 : 0.5} />
        ))}

        {/* Internal mesh lines for 3D depth */}
        {[[-8, -40, -8, 55], [8, -40, 8, 55], [0, -50, 0, 55],
          [-18, 0, 18, 0], [-22, 35, 22, 35], [-20, 15, 20, 15]
        ].map(([x1, y1, x2, y2], i) => (
          <line key={`mesh${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={accentColor} strokeWidth="0.3" opacity={0.15}
            strokeDasharray="2 4" />
        ))}

        {/* Cross-section rings for 3D effect */}
        {[-35, -15, 10, 35].map((y, i) => (
          <ellipse key={`ring${i}`} cx="0" cy={y}
            rx={14 + Math.abs(y) * 0.15} ry="3"
            fill="none" stroke={accentColor} strokeWidth="0.4"
            opacity={isWithout ? 0.1 : 0.2} strokeDasharray="2 3" />
        ))}

        {/* Scanning beam — horizontal sweep */}
        {!isWithout && (
          <rect x="-50" y="-110" width="100" height="2" fill="url(#scanLine)">
            <animate attributeName="y" values="-110;130;-110" dur="3s" repeatCount="indefinite" />
          </rect>
        )}

        {/* Organ scan zones */}
        {scanZones.map((zone, i) => {
          const isHovered = hoveredCard === zone.cardIdx;
          const isActive = !isWithout;
          return (
            <g key={i}>
              {/* Zone ellipse */}
              <ellipse cx={zone.cx} cy={zone.cy} rx={zone.rx} ry={zone.ry}
                fill={zone.color} fillOpacity={isActive ? 0.08 : 0}
                stroke={zone.color}
                strokeWidth={isHovered ? 1.5 : 0.8}
                strokeDasharray={isActive ? "none" : "3 3"}
                opacity={isActive ? (isHovered ? 0.9 : 0.45) : 0.15}>
                {isActive && (
                  <animate attributeName="opacity"
                    values={isHovered ? "0.9;0.6;0.9" : "0.45;0.3;0.45"}
                    dur="2s" repeatCount="indefinite" />
                )}
              </ellipse>

              {/* Ripple ring on hover */}
              {isActive && isHovered && (
                <ellipse cx={zone.cx} cy={zone.cy}
                  rx={zone.rx + 6} ry={zone.ry + 4}
                  fill="none" stroke={zone.color} strokeWidth="0.5" opacity={0.3}>
                  <animate attributeName="rx" values={`${zone.rx + 6};${zone.rx + 12};${zone.rx + 6}`} dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="ry" values={`${zone.ry + 4};${zone.ry + 8};${zone.ry + 4}`} dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.5s" repeatCount="indefinite" />
                </ellipse>
              )}

              {/* Status indicator */}
              {isWithout ? (
                <g opacity={0.5}>
                  <line x1={zone.cx - 5} y1={zone.cy - 5} x2={zone.cx + 5} y2={zone.cy + 5} stroke={red} strokeWidth="1.5" />
                  <line x1={zone.cx + 5} y1={zone.cy - 5} x2={zone.cx - 5} y2={zone.cy + 5} stroke={red} strokeWidth="1.5" />
                </g>
              ) : (
                <g opacity={0.9} filter="url(#glow)">
                  <circle cx={zone.cx} cy={zone.cy} r="3" fill={zone.color} opacity={0.8} />
                </g>
              )}

              {/* Zone label */}
              <text x={zone.cx + zone.rx + 6} y={zone.cy + 3}
                fontFamily="monospace" fontSize="7" fill={zone.color}
                opacity={isActive ? 0.7 : 0.25} letterSpacing="1.5">
                {zone.label}
              </text>
            </g>
          );
        })}

        {/* Data points along the body — particle effect */}
        {!isWithout && Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const rx = 25 + (i % 3) * 5;
          const ry = 40 + (i % 2) * 10;
          const cx = Math.cos(angle) * rx * 0.4;
          const cy = -20 + Math.sin(angle) * ry * 0.5;
          return (
            <circle key={`dp${i}`} cx={cx} cy={cy} r="1" fill={teal} opacity={0.3}>
              <animate attributeName="opacity" values="0.1;0.5;0.1"
                dur={`${1.5 + (i % 3) * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
            </circle>
          );
        })}
      </svg>

      {/* Patient label */}
      <div className="text-center mt-2">
        <div className="font-mono text-xs tracking-[0.2em] text-gray-500 uppercase">Sarah Mitchell, 52</div>
      </div>
    </div>
  );
};

/* ── Decision Tree Visualization ── */
const DecisionTree = ({ isWithout }: { isWithout: boolean }) => {
  const teal = "#4AEDC4";
  const red = "#FF5555";
  const amber = "#F5A623";
  const gray = "#444";

  const nodeColor = isWithout ? gray : teal;

  // Tree structure
  const nodes = isWithout
    ? [
        { x: 150, y: 20, label: "PATIENT VISIT", color: "#888", size: "lg" },
        { x: 150, y: 70, label: "MANUAL REVIEW", color: gray, size: "sm" },
        { x: 60, y: 120, label: "TIME PRESSURE", color: red, size: "sm" },
        { x: 240, y: 120, label: "NO CDS ALERT", color: red, size: "sm" },
        { x: 150, y: 170, label: "GUIDELINES SKIPPED", color: red, size: "md" },
        { x: 150, y: 220, label: "0 SCREENINGS", color: red, size: "lg" },
      ]
    : [
        { x: 150, y: 20, label: "PATIENT VISIT", color: "#888", size: "lg" },
        { x: 150, y: 65, label: "MEDIENT ENGINE", color: teal, size: "md" },
        { x: 50, y: 110, label: "EHR INGESTED", color: teal, size: "sm" },
        { x: 150, y: 110, label: "GUIDELINES COMPILED", color: teal, size: "sm" },
        { x: 250, y: 110, label: "RISK SCORED", color: teal, size: "sm" },
        { x: 80, y: 160, label: "LUNG CT", color: red, size: "sm" },
        { x: 150, y: 160, label: "COLORECTAL", color: amber, size: "sm" },
        { x: 220, y: 160, label: "BP MGMT", color: teal, size: "sm" },
        { x: 150, y: 210, label: "3 / 3 ORDERED", color: teal, size: "lg" },
      ];

  const edges = isWithout
    ? [[0,1],[1,2],[1,3],[2,4],[3,4],[4,5]]
    : [[0,1],[1,2],[1,3],[1,4],[2,5],[3,6],[4,7],[5,8],[6,8],[7,8]];

  return (
    <div className="w-full">
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3 px-1">
        {isWithout ? "Clinical Decision Path — Standard" : "Clinical Decision Path — With Medient"}
      </div>
      <svg viewBox="0 0 300 240" className="w-full" style={{ maxHeight: 240 }}>
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map(([from, to], i) => {
          const f = nodes[from!]!;
          const t = nodes[to!]!;
          return (
            <line key={`e${i}`} x1={f.x} y1={f.y + 12} x2={t.x} y2={t.y - 8}
              stroke={isWithout ? `${red}44` : `${teal}44`}
              strokeWidth="1" strokeDasharray={isWithout ? "3 3" : "none"}>
              {!isWithout && (
                <animate attributeName="stroke-opacity" values="0.15;0.4;0.15"
                  dur="2s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
              )}
            </line>
          );
        })}

        {/* Flowing particles along edges (WITH only) */}
        {!isWithout && edges.map(([from, to], i) => {
          const f = nodes[from!]!;
          const t = nodes[to!]!;
          return (
            <circle key={`p${i}`} r="2" fill={teal} opacity={0.6}>
              <animate attributeName="cx" values={`${f.x};${t.x}`}
                dur={`${1 + (i % 3) * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
              <animate attributeName="cy" values={`${f.y + 12};${t.y - 8}`}
                dur={`${1 + (i % 3) * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
            </circle>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isLarge = node.size === "lg";
          const isMedium = node.size === "md";
          const w = isLarge ? 100 : isMedium ? 90 : 70;
          const h = isLarge ? 24 : 18;
          return (
            <g key={`n${i}`}>
              <rect x={node.x - w / 2} y={node.y - h / 2} width={w} height={h}
                rx="2" fill={`${node.color}15`} stroke={node.color}
                strokeWidth={isLarge ? 1 : 0.6} opacity={0.8}
                filter={isLarge && !isWithout ? "url(#nodeGlow)" : undefined} />
              <text x={node.x} y={node.y + 3.5} textAnchor="middle"
                fontFamily="monospace" fontSize={isLarge ? 8 : 6.5}
                fill={node.color} letterSpacing="1" opacity={0.9}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ── Screening card ── */
const ScreeningCard = ({ urgency, urgencyColor, name, status, isWithout, index, onHover }: {
  urgency: string; urgencyColor: string; name: string; status: string;
  isWithout: boolean; index: number; onHover: (i: number | null) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: isWithout ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 + index * 0.12, type: "spring", damping: 20 }}
    className="flex items-center gap-4 py-3 px-4 border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group cursor-default"
    style={{ background: isWithout ? "rgba(255,255,255,0.01)" : `${urgencyColor}08` }}
    onMouseEnter={() => onHover(index)}
    onMouseLeave={() => onHover(null)}
  >
    <div className="w-1 h-10 rounded-full transition-all duration-500 group-hover:h-12"
      style={{ backgroundColor: urgencyColor, opacity: isWithout ? 0.3 : 0.8 }} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase px-1.5 py-0.5 border rounded-sm"
          style={{ color: urgencyColor, borderColor: `${urgencyColor}44`, backgroundColor: `${urgencyColor}11` }}>
          {urgency}
        </span>
      </div>
      <h4 className={`font-mono text-base font-light transition-colors duration-300 ${
        isWithout ? "text-gray-600 line-through decoration-gray-700" : "text-white"
      }`}>{name}</h4>
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      {!isWithout && (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: urgencyColor }} />
      )}
      <span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: isWithout ? "#555" : urgencyColor }}>
        {status}
      </span>
    </div>
  </motion.div>
);

/* ── Metric pill ── */
const MetricPill = ({ val, label, color, delay }: { val: string; label: string; color: string; delay: number }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring", damping: 15 }}
    className="text-center p-4 border border-white/[0.06] bg-white/[0.015] panel-3d">
    <div className="font-mono text-3xl md:text-4xl font-light" style={{ color }}>{val}</div>
    <div className="text-gray-500 text-xs font-mono tracking-[0.1em] uppercase mt-1">{label}</div>
  </motion.div>
);

/* ── Main section ── */
const Level1Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeView, setActiveView] = useState<"without" | "with">("without");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const isWithout = activeView === "without";

  const screenings = isWithout
    ? [
        { urgency: "MISSED", urgencyColor: "#666", name: "Low-Dose CT Lung Screening", status: "NOT ORDERED" },
        { urgency: "MISSED", urgencyColor: "#666", name: "Colorectal Cancer Screening", status: "NOT ORDERED" },
        { urgency: "MISSED", urgencyColor: "#666", name: "Hypertension Management", status: "OVERLOOKED" },
      ]
    : [
        { urgency: "CRITICAL", urgencyColor: "#FF5555", name: "Low-Dose CT Lung Screening", status: "ORDERED" },
        { urgency: "HIGH", urgencyColor: "#F5A623", name: "Colorectal Cancer Screening", status: "SCHEDULED" },
        { urgency: "MODERATE", urgencyColor: "#4AEDC4", name: "Hypertension Management", status: "FLAGGED" },
      ];

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-diamonds">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(74,237,196,0.02),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-6">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
            Same patient. Same clinic. <span className="text-gray-500">Different outcome.</span>
          </h2>
        </motion.div>

        {/* Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="flex items-center gap-1 mb-8 bg-white/[0.03] border border-white/[0.06] p-1.5 w-fit">
          {(["without", "with"] as const).map((v) => (
            <button key={v} onClick={() => setActiveView(v)}
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

        <AnimatePresence mode="wait">
          <motion.div key={activeView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT: Patient 3D model + decision tree */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="w-full border border-white/[0.06] bg-white/[0.01] p-5 panel-3d"
                  style={{ borderColor: isWithout ? "hsl(0,72%,60%,0.12)" : "hsl(160,82%,61%,0.12)" }}>
                  <PatientModel isWithout={isWithout} hoveredCard={hoveredCard} />
                </motion.div>

                {/* Decision tree */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", damping: 20 }}
                  className="w-full border border-white/[0.06] bg-white/[0.01] p-4 panel-3d"
                  style={{ borderColor: isWithout ? "hsl(0,72%,60%,0.08)" : "hsl(160,82%,61%,0.08)" }}>
                  <DecisionTree isWithout={isWithout} />
                </motion.div>
              </div>

              {/* CENTER: Screening cards */}
              <div className="lg:col-span-4 flex flex-col gap-2">
                <div className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 px-1">
                  {isWithout ? "Screenings: Not Evaluated" : "Eligible Screenings — Prioritized"}
                </div>
                {screenings.map((s, i) => (
                  <ScreeningCard key={activeView + i} {...s} isWithout={isWithout} index={i} onHover={setHoveredCard} />
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="mt-2 flex items-center justify-between px-4 py-3 border border-white/[0.06] bg-white/[0.01]">
                  <span className="text-gray-500 text-sm font-mono">Identified</span>
                  <span className={`font-mono text-2xl font-light ${isWithout ? "text-[hsl(0,72%,60%)]" : "text-accent"}`}>
                    {isWithout ? "0 / 3" : "3 / 3"}
                  </span>
                </motion.div>

                {/* Outcome stat */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 15 }}
                  className={`w-full text-center py-5 mt-2 border panel-3d ${
                    isWithout
                      ? "border-[hsl(0,72%,60%)]/20 bg-[hsl(0,72%,60%)]/[0.03]"
                      : "border-accent/20 bg-accent/[0.03]"
                  }`}>
                  <div className={`font-mono text-5xl md:text-6xl font-light ${isWithout ? "text-[hsl(0,72%,60%)]" : "text-accent"}`}>
                    <Counter value={isWithout ? 8 : 92} active={inView} />%
                  </div>
                  <div className="text-gray-400 text-sm mt-1 font-mono">
                    {isWithout ? "5-year survival — late stage" : "5-year survival — caught early"}
                  </div>
                </motion.div>
              </div>

              {/* RIGHT: Metrics */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-3 content-start">
                {(isWithout
                  ? [
                      { val: "$280K+", label: "Treatment cost", color: "#FF5555" },
                      { val: "18 mo", label: "Delayed diagnosis", color: "#FF5555" },
                      { val: "0", label: "Screenings ordered", color: "#666" },
                      { val: "Stage IIIB", label: "At diagnosis", color: "#FF5555" },
                    ]
                  : [
                      { val: "$4,200", label: "Screening cost", color: "#4AEDC4" },
                      { val: "0 days", label: "Time to screening", color: "#4AEDC4" },
                      { val: "+$8K", label: "Quality bonus", color: "#4AEDC4" },
                      { val: "Stage IA", label: "At diagnosis", color: "#4AEDC4" },
                    ]
                ).map((m, i) => (
                  <MetricPill key={m.label} {...m} delay={0.15 + i * 0.08} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Level1Section;

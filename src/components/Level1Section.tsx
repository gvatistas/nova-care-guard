import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ── Animated counter ── */
const Counter = ({ value, active }: { value: number; active: boolean }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const end = value;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [value, active]);
  return <>{display}</>;
};

/* ── Patient body SVG ── */
const PatientVisual = ({ isWithout, hoveredCard }: { isWithout: boolean; hoveredCard: number | null }) => {
  const bodyColor = isWithout ? "#555" : "#fff";
  const screeningZones = [
    { cx: 0, cy: -50, r: 18, label: "LUNG", color: isWithout ? "#444" : "#FF5555" },
    { cx: 0, cy: 10, r: 22, label: "COLON", color: isWithout ? "#444" : "#F5A623" },
    { cx: 20, cy: -20, r: 14, label: "BP", color: isWithout ? "#444" : "#4AEDC4" },
  ];

  return (
    <svg viewBox="-80 -120 160 280" className="w-full max-w-[200px] mx-auto">
      {/* Body */}
      <circle cx="0" cy="-70" r="20" fill="none" stroke={bodyColor} strokeWidth="1.5" opacity={0.7} />
      <line x1="0" y1="-50" x2="0" y2="30" stroke={bodyColor} strokeWidth="1.5" opacity={0.7} />
      <line x1="0" y1="-30" x2="-28" y2="5" stroke={bodyColor} strokeWidth="1.2" opacity={0.6} />
      <line x1="0" y1="-30" x2="28" y2="5" stroke={bodyColor} strokeWidth="1.2" opacity={0.6} />
      <line x1="0" y1="30" x2="-18" y2="70" stroke={bodyColor} strokeWidth="1.2" opacity={0.6} />
      <line x1="0" y1="30" x2="18" y2="70" stroke={bodyColor} strokeWidth="1.2" opacity={0.6} />

      {/* Screening zones */}
      {screeningZones.map((zone, i) => {
        const isHovered = hoveredCard === i;
        const isActive = !isWithout;
        return (
          <g key={i}>
            <circle cx={zone.cx} cy={zone.cy} r={zone.r} fill="none"
              stroke={zone.color} strokeWidth={isHovered ? 2 : 0.8}
              strokeDasharray={isActive ? "none" : "3 3"}
              opacity={isActive ? (isHovered ? 0.9 : 0.5) : 0.2}>
              {isActive && (
                <animate attributeName="r" values={`${zone.r};${zone.r + 3};${zone.r}`} dur="2s" repeatCount="indefinite" />
              )}
            </circle>
            {isActive && isHovered && (
              <circle cx={zone.cx} cy={zone.cy} r={zone.r + 8} fill="none"
                stroke={zone.color} strokeWidth="0.4" opacity={0.3}>
                <animate attributeName="r" values={`${zone.r + 8};${zone.r + 14};${zone.r + 8}`} dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* X mark for without */}
            {isWithout && (
              <>
                <line x1={zone.cx - 6} y1={zone.cy - 6} x2={zone.cx + 6} y2={zone.cy + 6}
                  stroke="#FF5555" strokeWidth="1.5" opacity={0.5} />
                <line x1={zone.cx + 6} y1={zone.cy - 6} x2={zone.cx - 6} y2={zone.cy + 6}
                  stroke="#FF5555" strokeWidth="1.5" opacity={0.5} />
              </>
            )}
            {/* Check for with */}
            {isActive && (
              <g opacity={0.8}>
                <circle cx={zone.cx + zone.r - 2} cy={zone.cy - zone.r + 2} r="5" fill={zone.color} />
                <polyline points={`${zone.cx + zone.r - 5},${zone.cy - zone.r + 2} ${zone.cx + zone.r - 2},${zone.cy - zone.r + 5} ${zone.cx + zone.r + 2},${zone.cy - zone.r - 2}`}
                  fill="none" stroke="#000" strokeWidth="1.5" />
              </g>
            )}
          </g>
        );
      })}

      {/* Scan beam for WITH */}
      {!isWithout && (
        <rect x="-60" y="-100" width="120" height="3" fill="#4AEDC4" opacity={0.15}>
          <animate attributeName="y" values="-100;80;-100" dur="3s" repeatCount="indefinite" />
        </rect>
      )}
    </svg>
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
    {/* Color bar */}
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
    {/* Status */}
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
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70 mb-3">Two Paths — One Patient</div>
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
              {/* LEFT: Patient visual + outcome */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center gap-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="w-full border border-white/[0.06] bg-white/[0.01] p-6 panel-3d"
                  style={{ borderColor: isWithout ? "hsl(0,72%,60%,0.12)" : "hsl(160,82%,61%,0.12)" }}>
                  <PatientVisual isWithout={isWithout} hoveredCard={hoveredCard} />
                  <div className="text-center mt-4">
                    <div className="font-mono text-xs tracking-[0.2em] text-gray-500 uppercase">Sarah Mitchell, 52</div>
                  </div>
                </motion.div>

                {/* Big outcome stat */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 15 }}
                  className={`w-full text-center py-6 border panel-3d ${
                    isWithout
                      ? "border-[hsl(0,72%,60%)]/20 bg-[hsl(0,72%,60%)]/[0.03]"
                      : "border-accent/20 bg-accent/[0.03]"
                  }`}>
                  <div className={`font-mono text-6xl md:text-7xl font-light ${isWithout ? "text-[hsl(0,72%,60%)]" : "text-accent"}`}>
                    <Counter value={isWithout ? 8 : 92} active={inView} />%
                  </div>
                  <div className="text-gray-400 text-sm mt-2 font-mono">
                    {isWithout ? "5-year survival — late stage" : "5-year survival — caught early"}
                  </div>
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

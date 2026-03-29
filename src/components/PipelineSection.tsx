import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Lock } from "lucide-react";

const stages = [
  { num: "01", name: "INGEST", short: "Parse & Structure", desc: "Clinical guidelines deconstructed from unstructured knowledge into atomic logical components.", icon: "↓", badge: "Real-time EHR sync", badgeType: "pulse" as const },
  { num: "02", name: "MODEL", short: "Type & Constrain", desc: "Decision schema with explicit constraints, typed branches, and deterministic pathways.", icon: "◇", badge: "0.0% hallucination rate", badgeType: "mono" as const },
  { num: "03", name: "VERIFY", short: "Prove Correctness", desc: "Formal verification via SMT solver proves exhaustiveness, determinism, and safety properties across the entire input space.", icon: "✓", badge: "100% guideline consistency", badgeType: "mono" as const },
  { num: "04", name: "ANALYZE", short: "Validate & Audit", desc: "Graph analysis confirms no orphan nodes or unreachable states. Complete decision provenance from input to source guideline paragraph.", icon: "△", badge: "Automated order generation", badgeType: "check" as const },
  { num: "05", name: "DEPLOY", short: "Ship as Infrastructure", desc: "Compiled into a FHIR-native artifact. On-premises or cloud. Air-gapped network support. Zero inference at runtime.", icon: "→", badge: "Full audit trail", badgeType: "lock" as const },
];




const TEAL = "hsl(160, 82%, 61%)";
const TEAL_RGB = "74,237,196";

const CROWN_TIPS = [
  { x: 375, y: 40 },
  { x: 600, y: 20 },
  { x: 825, y: 40 },
  { x: 1050, y: 60 },
];
const CROWN_BASE_Y = 240;
const CROWN_VALLEYS = [
  { x: 262, y: 190 },
  { x: 487, y: 170 },
  { x: 713, y: 170 },
  { x: 938, y: 190 },
];

// Card anchor positions (below the crown)
const CARD_TOPS = [
  { x: 150, y: 340 },
  { x: 375, y: 340 },
  { x: 600, y: 340 },
  { x: 825, y: 340 },
  { x: 1050, y: 340 },
];

const PipelineVisual = ({ hoveredStage, setHoveredStage, autoStage }: {
  hoveredStage: number | null;
  setHoveredStage: (i: number | null) => void;
  autoStage: number;
}) => {
  const activeIdx = hoveredStage ?? autoStage;

  // Build faceted crown triangles
  const crownFacets: { points: string; side: "left" | "right" | "center"; tipIdx: number }[] = [];
  CROWN_TIPS.forEach((tip, i) => {
    // Left base of this point
    const leftBase = i === 0
      ? { x: 50, y: CROWN_BASE_Y }
      : CROWN_VALLEYS[i - 1]!;
    // Right base of this point
    const rightBase = i === CROWN_TIPS.length - 1
      ? { x: 1150, y: CROWN_BASE_Y }
      : CROWN_VALLEYS[i]!;

    // Left facet triangle
    crownFacets.push({
      points: `${tip.x},${tip.y} ${leftBase.x},${leftBase.y} ${(tip.x + leftBase.x) / 2},${CROWN_BASE_Y}`,
      side: "left",
      tipIdx: i,
    });
    // Right facet triangle
    crownFacets.push({
      points: `${tip.x},${tip.y} ${rightBase.x},${rightBase.y} ${(tip.x + rightBase.x) / 2},${CROWN_BASE_Y}`,
      side: "right",
      tipIdx: i,
    });
  });

  return (
    <div className="relative w-full" style={{ aspectRatio: "2.4/1" }}>
      <svg viewBox="0 0 1200 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowSoft">
            <feGaussianBlur stdDeviation="14" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="crownGradL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="crownGradR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id="crownGradActive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="tipGlow">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fine grid background */}
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="white" strokeWidth="0.3" opacity="0.02" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="1200" y2={i * 50} stroke="white" strokeWidth="0.3" opacity="0.02" />
        ))}

        {/* Crown base band */}
        <rect x="50" y={CROWN_BASE_Y - 2} width="1100" height="4" fill="#2dd4bf" opacity="0.12" rx="1" />
        <rect x="50" y={CROWN_BASE_Y - 1} width="1100" height="2" fill="#2dd4bf" opacity="0.25" rx="0.5" />

        {/* Faceted triangles */}
        {crownFacets.map((facet, i) => {
          const isActive = facet.tipIdx === activeIdx;
          const fillId = isActive
            ? "url(#crownGradActive)"
            : facet.side === "left"
            ? "url(#crownGradL)"
            : "url(#crownGradR)";

          return (
            <polygon
              key={i}
              points={facet.points}
              fill={fillId}
              stroke="#2dd4bf"
              strokeWidth={isActive ? 0.8 : 0.3}
              opacity={isActive ? 1 : 0.6}
              style={{ transition: "all 0.5s ease" }}
            />
          );
        })}

        {/* White edge highlights on facet edges */}
        {CROWN_TIPS.map((tip, i) => {
          const leftBase = i === 0 ? { x: 50, y: CROWN_BASE_Y } : CROWN_VALLEYS[i - 1]!;
          const rightBase = i === CROWN_TIPS.length - 1 ? { x: 1150, y: CROWN_BASE_Y } : CROWN_VALLEYS[i]!;
          const isActive = i === activeIdx;
          return (
            <g key={`edges-${i}`}>
              {/* Left edge */}
              <line x1={tip.x} y1={tip.y} x2={leftBase.x} y2={leftBase.y}
                stroke="white" strokeWidth="0.6" opacity={isActive ? 0.15 : 0.06}
                style={{ transition: "opacity 0.5s ease" }} />
              {/* Right edge */}
              <line x1={tip.x} y1={tip.y} x2={rightBase.x} y2={rightBase.y}
                stroke="white" strokeWidth="0.6" opacity={isActive ? 0.2 : 0.08}
                style={{ transition: "opacity 0.5s ease" }} />
              {/* Center line (facet seam) */}
              <line x1={tip.x} y1={tip.y} x2={tip.x} y2={CROWN_BASE_Y}
                stroke="white" strokeWidth="0.4" opacity={isActive ? 0.12 : 0.04}
                style={{ transition: "opacity 0.5s ease" }} />
            </g>
          );
        })}

        {/* Tip glows & interactive areas */}
        {CROWN_TIPS.map((tip, i) => {
          const isActive = i === activeIdx;
          const stage = stages[i]!;
          return (
            <g key={`tip-${i}`}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
              className="cursor-pointer"
            >
              {/* Ambient glow on active */}
              {isActive && (
                <circle cx={tip.x} cy={tip.y} r="50" fill="url(#tipGlow)" filter="url(#glowSoft)">
                  <animate attributeName="r" values="45;60;45" dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Tip diamond marker */}
              <rect
                x={tip.x - 10} y={tip.y - 10} width="20" height="20" rx="1"
                transform={`rotate(45 ${tip.x} ${tip.y})`}
                fill={isActive ? "rgba(45,212,191,0.15)" : "rgba(45,212,191,0.03)"}
                stroke="#2dd4bf"
                strokeWidth={isActive ? 1.2 : 0.5}
                opacity={isActive ? 1 : 0.4}
                filter={isActive ? "url(#glow)" : undefined}
                style={{ transition: "all 0.5s ease" }}
              />

              {/* Stage number inside diamond */}
              <text x={tip.x} y={tip.y + 4} textAnchor="middle"
                fontFamily="monospace" fontSize="10" fontWeight="300"
                fill={isActive ? "#2dd4bf" : "#666"}
                style={{ transition: "fill 0.5s ease" }}>
                {stage.num}
              </text>

              {/* Stage name below tip */}
              <text x={tip.x} y={tip.y - 22} textAnchor="middle"
                fontFamily="monospace" fontSize="11" letterSpacing="3"
                fill={isActive ? "#2dd4bf" : "#555"}
                opacity={isActive ? 1 : 0.6}
                style={{ transition: "all 0.5s ease" }}>
                {stage.name}
              </text>

              {/* Pulse on active tip */}
              {isActive && (
                <circle cx={tip.x} cy={tip.y} r="2" fill="#2dd4bf" opacity="0.9" filter="url(#glow)">
                  <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Hit area */}
              <circle cx={tip.x} cy={tip.y} r="50" fill="transparent" />
            </g>
          );
        })}

        {/* Connecting lines from crown tips down to card positions */}
        {CROWN_TIPS.map((tip, i) => {
          const card = CARD_TOPS[i]!;
          const isActive = i === activeIdx;
          return (
            <g key={`conn-${i}`}>
              <line
                x1={tip.x} y1={CROWN_BASE_Y + 2}
                x2={card.x} y2={card.y}
                stroke="#2dd4bf"
                strokeWidth={isActive ? 1 : 0.4}
                opacity={isActive ? 0.4 : 0.08}
                strokeDasharray={isActive ? "none" : "3 6"}
                style={{ transition: "all 0.5s ease" }}
              />
              {/* Small terminal dot */}
              <circle cx={card.x} cy={card.y} r={isActive ? 3 : 1.5}
                fill={isActive ? "#2dd4bf" : "#555"}
                opacity={isActive ? 0.7 : 0.3}
                style={{ transition: "all 0.5s ease" }}
              />
            </g>
          );
        })}

        {/* Animated flow particles along crown outline */}
        {(() => {
          // Build crown outline path
          const pts = [{ x: 50, y: CROWN_BASE_Y }];
          for (let i = 0; i < CROWN_TIPS.length; i++) {
            pts.push(CROWN_TIPS[i]!);
            if (i < CROWN_VALLEYS.length) pts.push(CROWN_VALLEYS[i]!);
          }
          pts.push({ x: 1150, y: CROWN_BASE_Y });
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");

          return [0, -100, -200].map((offset, fi) => (
            <path key={fi} d={d} fill="none" stroke="#2dd4bf"
              strokeWidth={fi === 0 ? 1.5 : 0.8}
              opacity={fi === 0 ? 0.4 : 0.15}
              strokeDasharray={fi === 0 ? "20 180" : "10 190"}
              strokeDashoffset={offset}>
              <animate attributeName="stroke-dashoffset" values={`${offset};${offset - 200}`} dur="5s" repeatCount="indefinite" />
            </path>
          ));
        })()}

        {/* Input / Output labels */}
        <g opacity="0.25">
          <polygon points={`52,${CROWN_BASE_Y} 68,${CROWN_BASE_Y - 6} 68,${CROWN_BASE_Y + 6}`} fill="#2dd4bf" />
          <text x="85" y={CROWN_BASE_Y + 4} fontFamily="monospace" fontSize="9" fill="#555" letterSpacing="4">GUIDELINE</text>
        </g>
        <g opacity="0.25">
          <polygon points={`1148,${CROWN_BASE_Y} 1132,${CROWN_BASE_Y - 6} 1132,${CROWN_BASE_Y + 6}`} fill="#2dd4bf" />
          <text x="1115" y={CROWN_BASE_Y + 4} textAnchor="end" fontFamily="monospace" fontSize="9" fill="#555" letterSpacing="4">ARTIFACT</text>
        </g>
      </svg>
    </div>
  );
};

const StageBadge = ({ stage }: { stage: typeof stages[0] }) => (
  <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem]" style={{ color: "rgba(255,255,255,0.5)" }}>
    {stage.badgeType === "pulse" && (
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
    )}
    {stage.badgeType === "check" && (
      <Check size={11} strokeWidth={2.5} className="text-accent/70" />
    )}
    {stage.badgeType === "lock" && (
      <Lock size={11} strokeWidth={2} className="text-accent/70" />
    )}
    {stage.badge}
  </span>
);

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [autoStage, setAutoStage] = useState(0);

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
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
              Five stages. <span className="text-gray-500">Verified at every gate.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              No inference at runtime. Compiled once, verified exhaustively, deployed as <span className="text-white font-normal">deterministic infrastructure</span>. Zero patient data exposure.
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
          <div className="px-6 md:px-8 py-5 border-t border-[rgba(45,212,191,0.15)]"
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
                <div className="flex flex-col">
                  <div>
                    <span className="font-mono text-white text-lg md:text-xl font-light tracking-wide">{activeStage.name}</span>
                    <span className="font-mono text-gray-600 text-xs ml-3 tracking-[0.15em]">{activeStage.short}</span>
                  </div>
                  <StageBadge stage={activeStage} />
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

        {/* Compliance & Standards bar */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
          {[
            { name: "SOC 2 Type II", status: "In Progress", color: "hsl(35,50%,60%)" },
            { name: "HIPAA", status: "Compliant", color: "hsl(160,82%,61%)" },
            { name: "FHIR R4", status: "Native", color: "hsl(160,82%,61%)" },
            { name: "FDA SaMD", status: "Pathway Active", color: "hsl(35,50%,60%)" },
          ].map((cert, i) => (
            <div key={i} className="bg-background/80 p-4 md:p-5 panel-3d group hover:bg-white/[0.015] transition-all duration-500 flex items-center justify-between">
              <h4 className="font-mono text-base text-white font-light group-hover:text-accent transition-colors duration-300">{cert.name}</h4>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: cert.color, opacity: 0.7 }} />
                <span className="font-mono text-xs tracking-[0.15em] uppercase" style={{ color: cert.color, opacity: 0.7 }}>{cert.status}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PipelineSection;

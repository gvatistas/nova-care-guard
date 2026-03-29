import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Lock } from "lucide-react";

const stages = [
  { num: "01", name: "INGEST", short: "Parse & Structure", desc: "Clinical guidelines deconstructed from unstructured knowledge into atomic logical components.", badge: "Real-time EHR sync", badgeType: "pulse" as const },
  { num: "02", name: "NORMALIZE", short: "Type & Constrain", desc: "Decision schema with explicit constraints, typed branches, and deterministic pathways.", badge: "0.0% hallucination rate", badgeType: "mono" as const },
  { num: "03", name: "COMPILE", short: "Prove Correctness", desc: "Formal verification via SMT solver proves exhaustiveness, determinism, and safety properties across the entire input space.", badge: "100% guideline consistency", badgeType: "mono" as const },
  { num: "04", name: "VERIFY", short: "Validate & Audit", desc: "Graph analysis confirms no orphan nodes or unreachable states. Complete decision provenance from input to source guideline paragraph.", badge: "Automated order generation", badgeType: "check" as const },
  { num: "05", name: "DEPLOY", short: "Ship as Infrastructure", desc: "Compiled into a FHIR-native artifact. On-premises or cloud. Air-gapped network support. Zero inference at runtime.", badge: "Full audit trail", badgeType: "lock" as const },
];

/* Faceted crystal wireframe shapes for each stage */
const STAGE_GEOMETRIES = [
  // INGEST - Faceted hexagonal prism with triangular subdivisions
  {
    paths: [
      "M 100,20 L 145,40 L 145,85 L 100,105 L 55,85 L 55,40 Z",
      "M 100,20 L 100,105",
      "M 145,40 L 55,85", "M 55,40 L 145,85",
      "M 100,20 L 55,85", "M 100,20 L 145,85",
      "M 55,40 L 100,105", "M 145,40 L 100,105",
    ],
    fills: [
      { points: "100,20 145,40 100,62", opacity: 0.15 },
      { points: "100,20 55,40 100,62", opacity: 0.1 },
      { points: "55,40 55,85 100,62", opacity: 0.2 },
      { points: "145,40 145,85 100,62", opacity: 0.12 },
    ],
  },
  // NORMALIZE - Faceted octahedron (diamond)
  {
    paths: [
      "M 100,10 L 160,62 L 100,115 L 40,62 Z",
      "M 100,10 L 100,115", "M 40,62 L 160,62",
      "M 70,36 L 130,88", "M 130,36 L 70,88",
      "M 100,36 L 130,62 L 100,88 L 70,62 Z",
      "M 70,36 L 100,10", "M 130,36 L 100,10",
      "M 70,88 L 100,115", "M 130,88 L 100,115",
    ],
    fills: [
      { points: "100,10 160,62 100,62", opacity: 0.12 },
      { points: "100,10 40,62 100,62", opacity: 0.18 },
      { points: "40,62 100,115 100,62", opacity: 0.15 },
      { points: "160,62 100,115 100,62", opacity: 0.1 },
    ],
  },
  // COMPILE - Angular crystal cluster (3 overlapping shards)
  {
    paths: [
      "M 70,15 L 110,60 L 70,110 L 40,60 Z",
      "M 100,25 L 140,65 L 100,115 L 65,65 Z",
      "M 130,10 L 165,55 L 130,105 L 95,55 Z",
      "M 70,15 L 70,110", "M 100,25 L 100,115", "M 130,10 L 130,105",
      "M 40,60 L 110,60", "M 65,65 L 140,65", "M 95,55 L 165,55",
    ],
    fills: [
      { points: "70,15 110,60 70,60", opacity: 0.1 },
      { points: "100,25 140,65 100,65", opacity: 0.15 },
      { points: "130,10 165,55 130,55", opacity: 0.12 },
    ],
  },
  // VERIFY - Faceted geodesic sphere (triangular mesh)
  {
    paths: [
      "M 100,15 L 150,42 L 155,90 L 120,118 L 80,118 L 45,90 L 50,42 Z",
      "M 100,15 L 100,118", "M 50,42 L 155,90", "M 150,42 L 45,90",
      "M 100,15 L 45,90", "M 100,15 L 155,90",
      "M 50,42 L 120,118", "M 150,42 L 80,118",
      "M 100,66 L 50,42", "M 100,66 L 150,42",
      "M 100,66 L 45,90", "M 100,66 L 155,90",
      "M 100,66 L 80,118", "M 100,66 L 120,118",
    ],
    fills: [
      { points: "100,15 150,42 100,66", opacity: 0.12 },
      { points: "100,15 50,42 100,66", opacity: 0.18 },
      { points: "50,42 45,90 100,66", opacity: 0.1 },
      { points: "150,42 155,90 100,66", opacity: 0.15 },
      { points: "45,90 80,118 100,66", opacity: 0.2 },
      { points: "155,90 120,118 100,66", opacity: 0.08 },
    ],
  },
  // DEPLOY - Crown silhouette matching the logo
  {
    paths: [
      "M 30,110 L 52,55 L 72,38 L 100,25 L 128,38 L 148,55 L 170,110 Z",
      "M 52,55 L 52,110", "M 72,38 L 72,110", "M 100,25 L 100,110",
      "M 128,38 L 128,110", "M 148,55 L 148,110",
      "M 36,85 L 164,85", "M 42,68 L 158,68", "M 48,55 L 152,55",
      "M 30,110 L 170,110",
    ],
    fills: [
      { points: "52,55 30,110 52,110", opacity: 0.12 },
      { points: "72,38 52,110 72,110", opacity: 0.18 },
      { points: "100,25 72,110 100,110", opacity: 0.22 },
      { points: "100,25 128,110 100,110", opacity: 0.15 },
      { points: "128,38 148,110 128,110", opacity: 0.18 },
      { points: "148,55 170,110 148,110", opacity: 0.12 },
    ],
  },
];

const GeometricWireframe = ({ stageIdx, isActive }: { stageIdx: number; isActive: boolean }) => {
  const stage = STAGE_GEOMETRIES[stageIdx];
  if (!stage) return null;
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Subtle grid */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`g${i}`} x1={i * 25} y1="0" x2={i * 25} y2="140" stroke="white" strokeWidth="0.3" opacity="0.03" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 28} x2="200" y2={i * 28} stroke="white" strokeWidth="0.3" opacity="0.03" />
      ))}

      {/* Faceted fill triangles */}
      {stage.fills.map((f, i) => (
        <motion.polygon
          key={`f${i}`}
          points={f.points}
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? f.opacity : f.opacity * 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: "easeInOut" }}
        />
      ))}

      {/* Wireframe paths */}
      {stage.paths.map((d, i) => (
        <motion.path
          key={`p${i}`}
          d={d}
          fill="none"
          stroke="white"
          strokeWidth={isActive ? (i === 0 ? 1.2 : 0.7) : 0.4}
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isActive ? 1 : 0.6,
            opacity: isActive ? (i === 0 ? 0.6 : 0.4) : 0.1,
          }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: "easeInOut" }}
        />
      ))}

      {/* Pulse node at center */}
      {isActive && (
        <>
          <circle cx="100" cy="62" r="3" fill="white" opacity="0.5">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="62" r="12" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15">
            <animate attributeName="r" values="8;16;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0.03;0.15" dur="3s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};

const StageBadge = ({ stage }: { stage: typeof stages[0] }) => (
  <span className="inline-flex items-center gap-1.5 font-mono" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
    {stage.badgeType === "pulse" && (
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#10b981" }} />
    )}
    {stage.badgeType === "check" && (
      <Check size={14} strokeWidth={2.5} style={{ color: "rgba(255,255,255,0.5)" }} />
    )}
    {stage.badgeType === "lock" && (
      <Lock size={14} strokeWidth={2} style={{ color: "rgba(255,255,255,0.5)" }} />
    )}
    {stage.badge}
  </span>
);

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeStage, setActiveStage] = useState(0);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  useEffect(() => {
    if (hoveredStage !== null || !inView) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, [hoveredStage, inView]);

  const currentIdx = hoveredStage ?? activeStage;
  const current = stages[currentIdx]!;

  return (
    <section id="pipeline" ref={ref} className="relative py-24 md:py-32">
      {/* Background grid pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-7">
            <h2 className="text-white font-mono font-light leading-[1.15] tracking-[-0.02em]" style={{ fontSize: "2.5rem" }}>
              Five stages. <span style={{ color: "rgba(255,255,255,0.45)" }}>Verified at every gate.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-5 flex items-end">
            <p className="font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>
              No inference at runtime. Compiled once, verified exhaustively, deployed as <span className="text-white font-normal">deterministic infrastructure</span>. Zero patient data exposure.
            </p>
          </motion.div>
        </div>

        {/* Horizontal timeline progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative mb-8"
        >
          {/* Track */}
          <div className="h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
          {/* Progress fill */}
          <motion.div
            className="absolute top-0 left-0 h-px"
            style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
            animate={{ width: `${((currentIdx + 1) / 5) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          {/* Stage markers */}
          <div className="absolute top-0 left-0 w-full flex justify-between" style={{ transform: "translateY(-50%)" }}>
            {stages.map((stage, i) => {
              const isActive = i === currentIdx;
              const isPast = i < currentIdx;
              return (
                <button
                  key={i}
                  className="flex flex-col items-center cursor-pointer group"
                  onMouseEnter={() => setHoveredStage(i)}
                  onMouseLeave={() => setHoveredStage(null)}
                  onClick={() => { setActiveStage(i); setHoveredStage(null); }}
                >
                  {/* Diamond marker */}
                  <div
                    className="w-3 h-3 rotate-45 transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? "white" : isPast ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)",
                      border: isActive ? "none" : "1px solid rgba(255,255,255,0.2)",
                      boxShadow: isActive ? "0 0 12px rgba(255,255,255,0.3)" : "none",
                      transform: `rotate(45deg) ${isActive ? "scale(1.3)" : "scale(1)"}`,
                    }}
                  />
                  {/* Label */}
                  <span
                    className="font-mono mt-3 tracking-[0.15em] transition-all duration-300"
                    style={{
                      fontSize: "0.75rem",
                      color: isActive ? "white" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {stage.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Main content area: wireframe + detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/[0.08] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          {/* Left: Geometric wireframe visualization */}
          <div className="relative p-8 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/[0.06]" style={{ minHeight: "320px" }}>
            {/* Animated wireframe for current stage */}
            <div className="w-full max-w-[280px] aspect-square relative">
              {stages.map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: i === currentIdx ? 1 : 0 }}
                >
                  <GeometricWireframe stageIdx={i} isActive={i === currentIdx} />
                </div>
              ))}
            </div>

            {/* Stage number overlay */}
            <div className="absolute bottom-6 left-8 font-mono" style={{ fontSize: "4rem", color: "rgba(255,255,255,0.04)", fontWeight: 300, lineHeight: 1 }}>
              {current.num}
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-white/[0.1]" />
            <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-white/[0.1]" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-white/[0.1]" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-white/[0.1]" />
          </div>

          {/* Right: Stage detail */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 flex items-center justify-center border border-white/20 rotate-45">
                  <span className="-rotate-45 font-mono text-white" style={{ fontSize: "0.875rem" }}>{current.num}</span>
                </span>
                <span className="font-mono text-white/30 tracking-[0.15em]" style={{ fontSize: "0.75rem" }}>{current.short}</span>
              </div>

              <h3 className="font-mono text-white font-light tracking-wide mb-4" style={{ fontSize: "1.5rem" }}>
                {current.name}
              </h3>

              <p className="leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.125rem", lineHeight: 1.7 }}>
                {current.desc}
              </p>

              <StageBadge stage={current} />

              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-6">
                {stages.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: i === currentIdx ? "24px" : "6px",
                      backgroundColor: i === currentIdx ? "white" : i < currentIdx ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile stage list */}
        <div className="md:hidden mt-6 space-y-2">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className="border border-white/[0.08] p-4 cursor-pointer transition-all duration-300"
              style={{ background: i === currentIdx ? "rgba(255,255,255,0.03)" : "transparent" }}
              onClick={() => setActiveStage(i)}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-white/40" style={{ fontSize: "0.875rem" }}>{stage.num}</span>
                <h3 className="font-mono text-white font-light" style={{ fontSize: "1.125rem" }}>{stage.name}</h3>
                <span className="font-mono text-white/20 tracking-[0.1em]" style={{ fontSize: "0.75rem" }}>{stage.short}</span>
              </div>
              {i === currentIdx && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-8">
                  <p className="leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem" }}>{stage.desc}</p>
                  <StageBadge stage={stage} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Compliance & Standards bar */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
          {[
            { name: "SOC 2 Type II", status: "In Progress", color: "#f59e0b" },
            { name: "HIPAA", status: "Compliant", color: "#10b981" },
            { name: "FHIR R4", status: "Native", color: "#10b981" },
            { name: "FDA SaMD", status: "Pathway Active", color: "#f59e0b" },
          ].map((cert, i) => (
            <div key={i} className="bg-black p-4 md:p-5 group hover:bg-white/[0.015] transition-all duration-300 flex items-center justify-between">
              <h4 className="font-mono text-white font-light transition-colors duration-300" style={{ fontSize: "1.125rem" }}>{cert.name}</h4>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: cert.color, opacity: 0.7 }} />
                <span className="font-mono tracking-[0.15em] uppercase" style={{ color: cert.color, opacity: 0.7, fontSize: "0.875rem" }}>{cert.status}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PipelineSection;

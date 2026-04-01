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

const STAGE_GEOMETRIES = [
  {
    paths: ["M 100,20 L 145,40 L 145,85 L 100,105 L 55,85 L 55,40 Z", "M 100,20 L 100,105", "M 145,40 L 55,85", "M 55,40 L 145,85", "M 100,20 L 55,85", "M 100,20 L 145,85", "M 55,40 L 100,105", "M 145,40 L 100,105"],
    fills: [{ points: "100,20 145,40 100,62", opacity: 0.15 }, { points: "100,20 55,40 100,62", opacity: 0.1 }, { points: "55,40 55,85 100,62", opacity: 0.2 }, { points: "145,40 145,85 100,62", opacity: 0.12 }],
  },
  {
    paths: ["M 100,10 L 160,62 L 100,115 L 40,62 Z", "M 100,10 L 100,115", "M 40,62 L 160,62", "M 70,36 L 130,88", "M 130,36 L 70,88", "M 100,36 L 130,62 L 100,88 L 70,62 Z"],
    fills: [{ points: "100,10 160,62 100,62", opacity: 0.12 }, { points: "100,10 40,62 100,62", opacity: 0.18 }, { points: "40,62 100,115 100,62", opacity: 0.15 }, { points: "160,62 100,115 100,62", opacity: 0.1 }],
  },
  {
    paths: ["M 70,15 L 110,60 L 70,110 L 40,60 Z", "M 100,25 L 140,65 L 100,115 L 65,65 Z", "M 130,10 L 165,55 L 130,105 L 95,55 Z", "M 70,15 L 70,110", "M 100,25 L 100,115", "M 130,10 L 130,105"],
    fills: [{ points: "70,15 110,60 70,60", opacity: 0.1 }, { points: "100,25 140,65 100,65", opacity: 0.15 }, { points: "130,10 165,55 130,55", opacity: 0.12 }],
  },
  {
    paths: ["M 100,15 L 150,42 L 155,90 L 120,118 L 80,118 L 45,90 L 50,42 Z", "M 100,15 L 100,118", "M 50,42 L 155,90", "M 150,42 L 45,90", "M 100,66 L 50,42", "M 100,66 L 150,42", "M 100,66 L 45,90", "M 100,66 L 155,90", "M 100,66 L 80,118", "M 100,66 L 120,118"],
    fills: [{ points: "100,15 150,42 100,66", opacity: 0.12 }, { points: "100,15 50,42 100,66", opacity: 0.18 }, { points: "50,42 45,90 100,66", opacity: 0.1 }, { points: "150,42 155,90 100,66", opacity: 0.15 }, { points: "45,90 80,118 100,66", opacity: 0.2 }],
  },
  {
    paths: ["M 30,110 L 52,55 L 72,38 L 100,25 L 128,38 L 148,55 L 170,110 Z", "M 52,55 L 52,110", "M 72,38 L 72,110", "M 100,25 L 100,110", "M 128,38 L 128,110", "M 148,55 L 148,110", "M 36,85 L 164,85", "M 30,110 L 170,110"],
    fills: [{ points: "52,55 30,110 52,110", opacity: 0.12 }, { points: "72,38 52,110 72,110", opacity: 0.18 }, { points: "100,25 72,110 100,110", opacity: 0.22 }, { points: "100,25 128,110 100,110", opacity: 0.15 }, { points: "128,38 148,110 128,110", opacity: 0.18 }, { points: "148,55 170,110 148,110", opacity: 0.12 }],
  },
];

const GeometricWireframe = ({ stageIdx, isActive }: { stageIdx: number; isActive: boolean }) => {
  const stage = STAGE_GEOMETRIES[stageIdx];
  if (!stage) return null;
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {stage.fills.map((f, i) => (
        <motion.polygon key={`f${i}`} points={f.points} fill="#6B7280"
          initial={{ opacity: 0 }} animate={{ opacity: isActive ? f.opacity : f.opacity * 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.05 }} />
      ))}
      {stage.paths.map((d, i) => (
        <motion.path key={`p${i}`} d={d} fill="none" stroke="#9CA3AF"
          strokeWidth={isActive ? (i === 0 ? 1.2 : 0.7) : 0.4} strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: isActive ? 1 : 0.6, opacity: isActive ? (i === 0 ? 0.6 : 0.4) : 0.1 }}
          transition={{ duration: 0.6, delay: i * 0.06 }} />
      ))}
      {isActive && (
        <circle cx="100" cy="62" r="3" fill="#374151" opacity="0.5">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
};

const StageBadge = ({ stage }: { stage: typeof stages[0] }) => (
  <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "#6B7280" }}>
    {stage.badgeType === "pulse" && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#059669" }} />}
    {stage.badgeType === "check" && <Check size={14} strokeWidth={2.5} style={{ color: "#059669" }} />}
    {stage.badgeType === "lock" && <Lock size={14} strokeWidth={2} style={{ color: "#6B7280" }} />}
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
    const interval = setInterval(() => setActiveStage((prev) => (prev + 1) % 5), 3000);
    return () => clearInterval(interval);
  }, [hoveredStage, inView]);

  const currentIdx = hoveredStage ?? activeStage;
  const current = stages[currentIdx]!;

  return (
    <section id="pipeline" ref={ref} className="relative py-24 md:py-32" style={{ background: "#FFFFFF" }}>
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ backgroundImage: `linear-gradient(rgba(107,114,128,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(107,114,128,0.07) 1px, transparent 1px)`, backgroundSize: "35px 35px" }} />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }} className="lg:col-span-7">
            <h2 className="font-normal text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em", color: "#111827" }}>
              How it works.
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }} className="lg:col-span-5 flex items-end justify-end">
            <div className="flex flex-row flex-wrap items-center gap-5">
              {["Zero hallucination.", "Zero inference cost variability."].map((text) => (
                <span key={text} className="inline-flex items-center gap-2" style={{ color: "#6B7280" }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                    style={{ background: "#059669", boxShadow: "0 0 8px rgba(5,150,105,0.5)" }}
                  />
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="relative mb-8 mt-6">
          <div className="h-px w-full" style={{ backgroundColor: "#E5E7EB" }} />
          <motion.div className="absolute top-0 left-0 h-px" style={{ backgroundColor: "#111827" }}
            animate={{ width: `${((currentIdx + 1) / 5) * 100}%` }} transition={{ duration: 0.6 }} />
          <div className="absolute top-0 left-0 w-full flex justify-between" style={{ transform: "translateY(-50%)" }}>
            {stages.map((stage, i) => {
              const isActive = i === currentIdx;
              const isPast = i < currentIdx;
              return (
                <button key={i} className="flex flex-col items-center cursor-pointer group"
                  onMouseEnter={() => setHoveredStage(i)} onMouseLeave={() => setHoveredStage(null)}
                  onClick={() => { setActiveStage(i); setHoveredStage(null); }}>
                  <div className="w-3 h-3 rotate-45 transition-all duration-300" style={{
                    backgroundColor: isActive ? "#111827" : isPast ? "#6B7280" : "#E5E7EB",
                    border: isActive ? "none" : "1px solid #E5E7EB",
                    boxShadow: isActive ? "0 0 12px rgba(17,24,39,0.3)" : "none",
                    transform: `rotate(45deg) ${isActive ? "scale(1.3)" : "scale(1)"}`,
                  }} />
                  <span className="mt-3 text-[12px] font-medium uppercase transition-all duration-300" style={{
                    color: isActive ? "#111827" : "#6B7280", letterSpacing: "0.05em",
                  }}>{stage.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-0 border overflow-hidden"
          style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }}>
          <div className="relative p-8 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r" style={{ minHeight: "320px", borderColor: "#E5E7EB" }}>
            <div className="w-full max-w-[280px] aspect-square relative">
              {stages.map((_, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: i === currentIdx ? 1 : 0 }}>
                  <GeometricWireframe stageIdx={i} isActive={i === currentIdx} />
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 left-8 text-[4rem] font-light" style={{ lineHeight: 1, color: "rgba(107,114,128,0.08)" }}>{current.num}</div>
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center">
            <motion.div key={currentIdx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 flex items-center justify-center border rotate-45" style={{ borderColor: "#374151" }}>
                  <span className="-rotate-45 text-sm" style={{ color: "#111827" }}>{current.num}</span>
                </span>
                <span className="text-[12px] font-medium uppercase" style={{ letterSpacing: "0.05em", color: "#6B7280" }}>{current.short}</span>
              </div>
              <h3 className="font-semibold text-xl mb-4" style={{ letterSpacing: "-0.02em", color: "#111827" }}>{current.name}</h3>
              <p className="text-base mb-5" style={{ lineHeight: 1.7, letterSpacing: "-0.01em", color: "#374151" }}>{current.desc}</p>
              
              <div className="flex items-center gap-2 mt-6">
                {stages.map((_, i) => (
                  <div key={i} className="h-1 rounded-full transition-all duration-500" style={{
                    width: i === currentIdx ? "24px" : "6px",
                    backgroundColor: i === currentIdx ? "#111827" : i < currentIdx ? "#6B7280" : "#E5E7EB",
                  }} />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Compliance bar */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-3 gap-px" style={{ backgroundColor: "#E5E7EB" }}>
          {[
            { name: "HIPAA", status: "Compliant", color: "#059669" },
            { name: "FHIR R4", status: "Native", color: "#059669" },
            { name: "HL7 CDS Hooks", status: "Supported", color: "#059669" },
          ].map((c) => (
            <div key={c.name} className="p-4 text-center" style={{ background: "#F3F4F6" }}>
              <span className="text-[11px] font-medium uppercase block mb-1" style={{ letterSpacing: "0.1em", color: "#6B7280" }}>{c.name}</span>
              <span className="text-[13px] font-medium" style={{ color: c.color, letterSpacing: "0.05em" }}>{c.status}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PipelineSection;

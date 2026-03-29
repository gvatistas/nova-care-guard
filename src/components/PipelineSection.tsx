import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const stages = [
  {
    num: "01",
    name: "Ingestion",
    desc: "Clinical guideline PDF is parsed into structured clinical logic with full source fidelity verification.",
    detail: "Every assertion traced to its original page and paragraph. Nothing is inferred — everything is extracted.",
  },
  {
    num: "02",
    name: "Schema Generation",
    desc: "Structured logic is transformed into a typed decision schema with explicit constraint types and branching rules.",
    detail: "No ambiguity survives this stage. Every branch is explicitly typed. Every condition formally bounded.",
  },
  {
    num: "03",
    name: "Formal Verification",
    desc: "An SMT solver mathematically proves exhaustiveness, determinism, and reachability across infinite input space.",
    detail: "Proof across infinite input space. Every reachable state verified. No edge case left unconsidered.",
  },
  {
    num: "04",
    name: "Structural Analysis",
    desc: "Graph analysis validates the topology — no orphan nodes, unreachable states, or infinite loops exist.",
    detail: "Complete structural integrity guaranteed before any artifact reaches production.",
  },
  {
    num: "05",
    name: "Composition",
    desc: "The verified artifact is compiled into a deployable FHIR PlanDefinition bundle — deterministic at runtime.",
    detail: "Production-ready. Zero inference required. Zero hallucination possible. Fully auditable.",
  },
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <section id="pipeline" ref={ref} className="relative py-24 md:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-20">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-6 md:mb-8">Architecture</div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-light leading-[1.1] tracking-[-0.02em]">
              Five stages.
              <br />
              <span className="text-gray-500">Verified at every gate.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">
              No inference at runtime. No probabilistic output. The artifact is compiled once,
              verified exhaustively, then deployed as deterministic infrastructure.
            </p>
          </motion.div>
        </div>

        {/* Visual pipeline flow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="hidden md:flex items-center justify-between mb-16 relative"
        >
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-accent/30 via-accent/10 to-accent/30 origin-left"
          />
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
              className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
                hoveredStage === i ? "scale-110" : ""
              }`}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 ${
                hoveredStage === i
                  ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(74,237,196,0.15)]"
                  : "border-white/10 bg-background"
              }`}>
                <span className={`font-mono text-sm transition-colors duration-300 ${
                  hoveredStage === i ? "text-accent" : "text-gray-500"
                }`}>{stage.num}</span>
              </div>
              <span className="font-mono text-xs text-gray-400 mt-3 tracking-wide">{stage.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stages detail */}
        <div className="border-t border-white/[0.06]">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.12 }}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
              className="group border-b border-white/[0.06] py-8 md:py-10 grid grid-cols-12 gap-4 md:gap-8 items-start hover:bg-white/[0.015] transition-all duration-500 px-2 md:px-4 cursor-default"
            >
              <div className="col-span-2 md:col-span-1">
                <span className={`font-mono text-base transition-colors duration-500 ${
                  hoveredStage === i ? "text-accent" : "text-gray-600"
                }`}>
                  {stage.num}
                </span>
              </div>
              <div className="col-span-10 md:col-span-3">
                <h3 className="font-mono text-white text-lg md:text-xl font-light group-hover:text-accent transition-colors duration-500">
                  {stage.name}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-5">
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{stage.desc}</p>
              </div>
              <div className="col-span-12 md:col-span-3">
                <motion.p
                  initial={false}
                  animate={{ opacity: hoveredStage === i ? 1 : 0, y: hoveredStage === i ? 0 : 5 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500 text-sm leading-relaxed"
                >
                  {stage.detail}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;

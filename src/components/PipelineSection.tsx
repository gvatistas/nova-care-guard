import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const stages = [
  { num: "01", name: "Ingestion", desc: "Clinical guideline PDF parsed into structured clinical logic with full source fidelity.", detail: "Every assertion traced to its original page. Nothing inferred." },
  { num: "02", name: "Schema Gen", desc: "Transformed into a typed decision schema with explicit constraints and branching rules.", detail: "No ambiguity survives. Every branch explicitly typed." },
  { num: "03", name: "Verification", desc: "SMT solver proves exhaustiveness, determinism, and reachability across infinite input space.", detail: "Every reachable state verified. No edge case unconsidered." },
  { num: "04", name: "Analysis", desc: "Graph analysis validates topology — no orphan nodes, unreachable states, or infinite loops.", detail: "Complete structural integrity before production." },
  { num: "05", name: "Composition", desc: "Compiled into a deployable FHIR PlanDefinition — deterministic at runtime.", detail: "Zero inference. Zero hallucination. Fully auditable." },
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <section id="pipeline" ref={ref} className="relative py-14 md:py-20 texture-facets">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(91,141,239,0.025),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 mb-8">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-[hsl(210,70%,55%)]/70 mb-3">Architecture</div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
              Five stages. <span className="text-gray-500">Verified at every gate.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              No inference at runtime. The artifact is compiled once, verified exhaustively, deployed as <span className="text-white">deterministic infrastructure</span>.
            </p>
          </motion.div>
        </div>

        {/* Pipeline nodes */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
          className="hidden md:flex items-center justify-between mb-6 relative">
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-accent/30 via-[hsl(210,70%,55%)]/20 to-accent/30 origin-left" />
          {stages.map((stage, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
              className="relative z-10 flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setHoveredStage(i)} onMouseLeave={() => setHoveredStage(null)}>
              <div className={`w-11 h-11 rotate-45 border flex items-center justify-center transition-all duration-500 ${
                hoveredStage === i
                  ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(74,237,196,0.2)] scale-110"
                  : "border-white/10 bg-background hover:border-white/20"
              }`}>
                <span className={`-rotate-45 font-mono text-xs transition-colors duration-300 ${hoveredStage === i ? "text-accent" : "text-gray-500"}`}>{stage.num}</span>
              </div>
              <span className={`font-mono text-xs mt-3 tracking-wide transition-colors duration-300 ${hoveredStage === i ? "text-accent" : "text-gray-400"}`}>{stage.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="border-t border-white/[0.06]">
          {stages.map((stage, i) => (
            <motion.div key={stage.num} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.12 }}
              onMouseEnter={() => setHoveredStage(i)} onMouseLeave={() => setHoveredStage(null)}
              className={`group border-b border-white/[0.06] py-4 md:py-5 grid grid-cols-12 gap-4 md:gap-6 items-start px-2 md:px-4 cursor-default transition-all duration-500 ${
                hoveredStage === i ? "bg-accent/[0.02]" : "hover:bg-white/[0.01]"
              }`}>
              <div className="col-span-2 md:col-span-1">
                <span className={`font-mono text-base transition-colors duration-500 ${hoveredStage === i ? "text-accent" : "text-gray-600"}`}>{stage.num}</span>
              </div>
              <div className="col-span-10 md:col-span-3">
                <h3 className={`font-mono text-base md:text-lg font-light transition-colors duration-500 ${hoveredStage === i ? "text-accent" : "text-white"}`}>{stage.name}</h3>
              </div>
              <div className="col-span-12 md:col-span-5">
                <p className="text-gray-300 text-base leading-relaxed">{stage.desc}</p>
              </div>
              <div className="col-span-12 md:col-span-3">
                <motion.p initial={false} animate={{ opacity: hoveredStage === i ? 1 : 0, y: hoveredStage === i ? 0 : 5 }}
                  transition={{ duration: 0.3 }} className="text-gray-500 text-sm leading-relaxed">{stage.detail}</motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;

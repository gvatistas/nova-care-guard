import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import pipelineViz from "@/assets/pipeline-visualization.png";

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
    desc: "Structured logic is transformed into a typed decision schema with explicit constraint types.",
    detail: "No ambiguity survives this stage. Every branch is explicitly typed. Every condition formally bounded.",
  },
  {
    num: "03",
    name: "Formal Verification",
    desc: "An SMT solver mathematically proves exhaustiveness, determinism, and reachability.",
    detail: "Proof across infinite input space. Every reachable state verified. No edge case left unconsidered.",
  },
  {
    num: "04",
    name: "Structural Analysis",
    desc: "Graph analysis validates the topology — no orphan nodes, unreachable states, or infinite loops.",
    detail: "Complete structural integrity guaranteed before any artifact reaches production.",
  },
  {
    num: "05",
    name: "Composition",
    desc: "The verified artifact is compiled into a deployable FHIR PlanDefinition bundle.",
    detail: "Production-ready. Deterministic at runtime. Zero inference required. Zero hallucination possible.",
  },
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <section id="pipeline" ref={ref} className="relative py-32 md:py-44">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-8">Architecture</div>
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-mono font-light leading-[1.1] tracking-[-0.02em]">
              Five stages.
              <br />
              <span className="text-gray-500">Verified at every gate.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-400 text-lg font-light leading-relaxed">
              No inference at runtime. No probabilistic output. The artifact is compiled once,
              verified exhaustively, then deployed as deterministic infrastructure.
            </p>
          </motion.div>
        </div>

        {/* Pipeline image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative mb-20 overflow-hidden"
        >
          <img src={pipelineViz} alt="Pipeline visualization" loading="lazy" width={1920} height={800} className="w-full opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
          <div className="absolute inset-0 flex items-center justify-between px-[8%]">
            {stages.map((stage, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 + i * 0.15 }} className="text-center">
                <div className="font-mono text-accent text-xs tracking-[0.2em] mb-1">{stage.num}</div>
                <div className="font-mono text-white text-sm font-light">{stage.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stages */}
        <div className="border-t border-white/[0.06]">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.12 }}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
              className="group border-b border-white/[0.06] py-10 md:py-12 grid grid-cols-12 gap-8 items-start hover:bg-white/[0.015] transition-all duration-500 px-4 cursor-default"
            >
              <div className="col-span-2 md:col-span-1">
                <span className={`font-mono text-base transition-colors duration-500 ${hoveredStage === i ? "text-accent" : "text-gray-600"}`}>
                  {stage.num}
                </span>
              </div>
              <div className="col-span-10 md:col-span-3">
                <h3 className="font-mono text-white text-xl md:text-2xl font-light group-hover:text-accent transition-colors duration-500">
                  {stage.name}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-5">
                <p className="text-gray-400 text-base leading-relaxed">{stage.desc}</p>
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

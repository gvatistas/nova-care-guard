import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stages = [
  {
    num: "01",
    name: "Ingestion",
    desc: "Clinical guideline PDF → structured clinical logic. Source fidelity verified.",
  },
  {
    num: "02",
    name: "Schema Generation",
    desc: "Logic → typed decision schema with constraint types. No ambiguity survives.",
  },
  {
    num: "03",
    name: "Formal Verification",
    desc: "SMT solver proves exhaustiveness, determinism, and reachability across infinite input space.",
  },
  {
    num: "04",
    name: "Structural Analysis",
    desc: "Graph analysis ensures no orphan nodes, unreachable states, or infinite loops.",
  },
  {
    num: "05",
    name: "Composition",
    desc: "Verified artifact compiled into deployable FHIR PlanDefinition bundle.",
  },
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pipeline" ref={ref} className="relative py-40 md:py-56">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header — asymmetric Palantir layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="lg:col-span-7"
          >
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-600 mb-8">
              Architecture
            </div>
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.15] tracking-[-0.02em]">
              Five stages.
              <br />
              Verified at every gate.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 flex items-end"
          >
            <p className="text-gray-500 text-base font-light leading-relaxed">
              No inference at runtime. No probabilistic output. 
              The artifact is compiled once, verified exhaustively, 
              then deployed as deterministic infrastructure.
            </p>
          </motion.div>
        </div>

        {/* Stages — clean vertical list */}
        <div className="border-t border-white/[0.06]">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.12 }}
              className="group border-b border-white/[0.06] py-10 md:py-14 grid grid-cols-12 gap-8 items-start hover:bg-white/[0.01] transition-colors duration-500 px-2"
            >
              <div className="col-span-2 md:col-span-1">
                <span className="font-mono text-gray-600 text-sm">{stage.num}</span>
              </div>
              <div className="col-span-10 md:col-span-3">
                <h3 className="font-mono text-white text-lg md:text-xl font-light group-hover:text-teal transition-colors duration-500">
                  {stage.name}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-8">
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;

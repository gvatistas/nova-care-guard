import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stages = [
  {
    num: "01",
    name: "Ingestion",
    icon: "⬡",
    desc: "Clinical guideline PDF → structured clinical logic",
    proof: "Source fidelity ✓",
    detail: "Natural language processing extracts every decision point, threshold, and recommendation from narrative text.",
  },
  {
    num: "02",
    name: "Schema",
    icon: "⬢",
    desc: "Logic → typed decision schema with constraint types",
    proof: "Type safety ✓",
    detail: "Each decision point is encoded with input types, ranges, and output enumerations. No ambiguity survives this stage.",
  },
  {
    num: "03",
    name: "Verification",
    icon: "◎",
    desc: "SMT solver proves exhaustiveness, determinism, reachability",
    proof: "Formal proof ✓",
    detail: "An SMT solver evaluates every possible patient input. It proves: every input reaches a recommendation, no input triggers contradictory outputs, and every recommendation is reachable.",
  },
  {
    num: "04",
    name: "Structural",
    icon: "◉",
    desc: "Graph analysis ensures no orphan nodes or infinite loops",
    proof: "Graph integrity ✓",
    detail: "The decision graph is analyzed for orphan nodes, unreachable states, and cyclic dependencies. The artifact must be a clean DAG.",
  },
  {
    num: "05",
    name: "Composition",
    icon: "⬟",
    desc: "Verified artifact compiled into deployable FHIR bundle",
    proof: "Deploy ready ✓",
    detail: "The verified logic is serialized into a FHIR PlanDefinition bundle ready for deployment via EHR integration or MCP API.",
  },
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pipeline" ref={ref} className="relative py-40">
      <div className="absolute inset-0 dot-grid opacity-[0.04]" />

      <div className="relative max-w-[1400px] mx-auto px-6">
        {/* Asymmetric header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="lg:col-span-8"
          >
            <div className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-4">
              ▸ System Architecture
            </div>
            <h2 className="font-mono text-3xl md:text-5xl font-light text-pearl tracking-[-0.02em]">
              Five stages. Formally verified at every gate.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 flex items-end"
          >
            <p className="font-mono text-warm-gray text-sm font-light leading-relaxed">
              No inference at runtime. No probabilistic output. 
              The artifact is compiled once and verified exhaustively before deployment.
            </p>
          </motion.div>
        </div>

        {/* Pipeline diagram — horizontal connected stages */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-grid-line -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="relative group"
              >
                {/* Connection dot */}
                <div className="hidden lg:block absolute -top-[1px] left-1/2 -translate-x-1/2 -translate-y-[calc(50%+48px)]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.2 }}
                    className="w-3 h-3 rounded-full bg-void border-2 border-teal/60"
                  />
                </div>

                <div className="bg-deep-field border border-grid-line group-hover:border-teal/40 transition-all duration-300 p-6 h-full rounded-lg">
                  {/* Stage number + icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs tracking-[0.15em] text-teal">{stage.num}</span>
                    <span className="text-teal/40 text-2xl group-hover:text-teal/80 transition-colors">{stage.icon}</span>
                  </div>

                  <h3 className="font-mono text-pearl text-base font-light mb-2">{stage.name}</h3>
                  <p className="text-warm-gray text-xs font-light leading-relaxed mb-4">{stage.desc}</p>
                  <div className="font-mono text-teal text-[11px] mb-3">{stage.proof}</div>

                  {/* Expandable detail on hover */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500">
                    <div className="pt-3 border-t border-grid-line">
                      <p className="text-warm-gray/70 text-[11px] font-light leading-relaxed">{stage.detail}</p>
                    </div>
                  </div>
                </div>

                {/* Flowing dot connector */}
                {i < stages.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      animate={{ x: [0, 12, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-1.5 h-1.5 rounded-full bg-teal/80"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;

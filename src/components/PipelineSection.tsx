import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stages = [
  { num: "01", name: "Ingestion", desc: "Clinical guideline PDF → structured clinical logic", proof: "Source fidelity ✓" },
  { num: "02", name: "Schema", desc: "Logic → typed decision schema with constraint types", proof: "Type safety ✓" },
  { num: "03", name: "Verification", desc: "SMT solver proves exhaustiveness, determinism, reachability", proof: "Formal proof ✓" },
  { num: "04", name: "Structural", desc: "Graph analysis ensures no orphan nodes or infinite loops", proof: "Graph integrity ✓" },
  { num: "05", name: "Composition", desc: "Verified artifact compiled into deployable FHIR bundle", proof: "Deploy ready ✓" },
];

const compileLines = [
  { text: "$ pcare compile --guideline uspstf-lung-screening", color: "pearl" },
  { text: "[1/5] Ingesting clinical guideline... ✓", color: "warm-gray" },
  { text: "[2/5] Generating decision schema... ✓", color: "warm-gray" },
  { text: "[3/5] Formal verification: exhaustive ✓ deterministic ✓ reachable ✓", color: "teal" },
  { text: "[4/5] Structural verification: no orphans ✓ no cycles ✓", color: "teal" },
  { text: "[5/5] Composing FHIR artifact... ✓", color: "warm-gray" },
  { text: "", color: "warm-gray" },
  { text: "✓ Artifact ready. Zero inference at runtime.", color: "teal" },
];

const PipelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pipeline" ref={ref} className="relative py-40">
      <div className="absolute inset-0 dot-grid opacity-[0.03]" />

      <div className="relative max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-20"
        >
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-4">
            ▸ System Architecture
          </div>
          <h2 className="font-mono text-3xl md:text-5xl font-light text-pearl tracking-[-0.02em] max-w-2xl">
            Five stages. Formally verified at every gate.
          </h2>
        </motion.div>

        {/* Pipeline stages */}
        <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-4 mb-20">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex-1 relative"
            >
              <div className="bg-deep-field border border-grid-line hover:border-teal/40 transition-all duration-300 p-5 h-full"
                style={{ borderRadius: "8px" }}>
                <div className="font-mono text-xs tracking-[0.15em] text-teal mb-3">{stage.num}</div>
                <h3 className="font-mono text-pearl text-base font-light mb-2">{stage.name}</h3>
                <p className="text-warm-gray text-xs font-light leading-relaxed mb-4">{stage.desc}</p>
                <div className="font-mono text-teal text-[11px]">{stage.proof}</div>
              </div>
              {/* Connector */}
              {i < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-px bg-teal/40 relative">
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-teal top-1/2 -translate-y-1/2 right-0 animate-pulse" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="bg-deep-field border border-grid-line overflow-hidden"
          style={{ borderRadius: "8px" }}
        >
          {/* Chrome bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-grid-line">
            <div className="w-2 h-2 rounded-full bg-coral/60" />
            <div className="w-2 h-2 rounded-full bg-gold/60" />
            <div className="w-2 h-2 rounded-full bg-teal/60" />
            <span className="font-mono text-warm-gray text-xs ml-2">~/pcare compile</span>
          </div>
          {/* Lines */}
          <div className="p-6 space-y-1">
            {compileLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 + i * 0.2 }}
                className={`font-mono text-sm font-light ${
                  line.color === "teal" ? "text-teal" : line.color === "pearl" ? "text-pearl" : "text-warm-gray"
                }`}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PipelineSection;

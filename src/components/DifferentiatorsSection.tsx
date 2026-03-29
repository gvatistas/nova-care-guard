import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const differentiators = [
  {
    id: "deterministic", label: "Deterministic", icon: "◆", accentHsl: "0 0% 100%",
    headline: "Zero inference. Zero hallucination.",
    description: "Unlike LLM-based clinical tools, Medient artifacts produce identical outputs for identical inputs — every time, everywhere. No temperature. No drift. No probabilistic liability.",
    comparison: [
      { metric: "Hallucination rate", medient: "0.0%", others: "2–8%" },
      { metric: "Output consistency", medient: "100%", others: "~92%" },
      { metric: "Audit trail", medient: "Complete", others: "Partial" },
      { metric: "Regulatory pathway", medient: "SaMD Class II", others: "Undefined" },
    ],
  },
  {
    id: "compiled", label: "Compiled", icon: "⬡", accentHsl: "0 0% 100%",
    headline: "Not interpreted. Not prompted. Compiled.",
    description: "Medient doesn't 'read' guidelines at query time. Each guideline is compiled once into a verified decision artifact — a typed, exhaustively tested logical structure that runs as deterministic infrastructure.",
    comparison: [
      { metric: "Processing model", medient: "Compile-once", others: "Query-time" },
      { metric: "Latency", medient: "<1ms", others: "200–800ms" },
      { metric: "Verification", medient: "SMT-proven", others: "Unit tests" },
      { metric: "Edge case coverage", medient: "Exhaustive", others: "Sample-based" },
    ],
  },
  {
    id: "traceable", label: "Traceable", icon: "◈", accentHsl: "0 0% 100%",
    headline: "Every recommendation has a source.",
    description: "Full provenance tracing from output recommendation to the exact guideline paragraph, page number, and publication. No black box. No 'the model thinks'. Just verified clinical logic.",
    comparison: [
      { metric: "Source attribution", medient: "Page-level", others: "None" },
      { metric: "Decision path", medient: "Fully visible", others: "Opaque" },
      { metric: "Reproducibility", medient: "Guaranteed", others: "Variable" },
      { metric: "Compliance readiness", medient: "Immediate", others: "6–12 months" },
    ],
  },
  {
    id: "scalable", label: "Scalable", icon: "◇", accentHsl: "0 0% 100%",
    headline: "$0 marginal cost per encounter.",
    description: "Once compiled, a Medient artifact costs nothing additional to run. No token usage. No API calls. No per-query fees. Deploy across an entire health system and the unit economics only improve.",
    comparison: [
      { metric: "Cost per query", medient: "$0.00", others: "$0.02–0.15" },
      { metric: "Scaling model", medient: "Linear O(1)", others: "Linear O(n)" },
      { metric: "Infrastructure", medient: "FHIR-native", others: "Custom API" },
      { metric: "Deployment", medient: "Embeddable", others: "Cloud-only" },
    ],
  },
];

const DifferentiatorsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeDiff, setActiveDiff] = useState(0);
  const diff = differentiators[activeDiff];

  return (
    <section ref={ref} className="relative py-24 md:py-32 texture-angular">
      <div className="absolute inset-0 transition-all duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.02), transparent 60%)` }} />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 mb-6">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <h2 className="text-white font-mono font-light leading-[1.15] tracking-[-0.02em]" style={{ fontSize: "2.5rem" }}>
              Not another AI wrapper. <span style={{ color: "rgba(255,255,255,0.45)" }}>A compiler.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>
              Every clinical AI product generates answers probabilistically. Medient is the only platform that <span className="text-white font-normal">compiles guidelines into verified, deterministic logic</span>.
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-1.5 mb-6">
          {differentiators.map((d, i) => (
            <button key={d.id} onClick={() => setActiveDiff(i)}
              className={`font-mono tracking-wide px-4 py-2.5 border transition-all duration-400 panel-3d ${
                activeDiff === i ? "border-white/30 bg-white/[0.08] text-white" : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
              }`}
              style={{ fontSize: "1rem" }}>
              <span className="mr-2" style={{ fontSize: "0.875rem" }}>{d.icon}</span>{d.label}
            </button>
          ))}
        </motion.div>

        <motion.div key={activeDiff} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-white/[0.08] overflow-hidden panel-3d">
          <div className="px-6 md:px-8 py-4 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.04), transparent 60%)` }}>
            <span className="text-white" style={{ fontSize: "1.5rem" }}>{diff.icon}</span>
            <h3 className="font-mono font-light text-white" style={{ fontSize: "1.5rem" }}>{diff.headline}</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="px-6 md:px-8 py-5 md:py-6 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
              <p className="leading-[1.7]" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>{diff.description}</p>
            </div>

            <div className="grid grid-cols-1 divide-y divide-white/[0.06]">
              <div className="px-6 md:px-8 py-3 flex items-center justify-between">
                <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>Metric</span>
                <div className="flex items-center gap-8">
                  <span className="font-mono tracking-[0.15em] uppercase text-white" style={{ fontSize: "0.875rem" }}>Medient</span>
                  <span className="font-mono tracking-[0.15em] uppercase w-20 text-right" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.35)" }}>Others</span>
                </div>
              </div>
              {diff.comparison.map((row, ri) => (
                <div key={ri} className="px-6 md:px-8 py-3.5 md:py-4 flex items-center justify-between hover:bg-white/[0.015] transition-colors duration-300">
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>{row.metric}</span>
                  <div className="flex items-center gap-8">
                    <span className="font-mono font-light text-white" style={{ fontSize: "1.125rem" }}>{row.medient}</span>
                    <span className="font-mono w-20 text-right" style={{ fontSize: "1rem", color: "rgba(255,255,255,0.35)" }}>{row.others}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DifferentiatorsSection;

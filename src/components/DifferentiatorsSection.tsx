import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const differentiators = [
  {
    id: "deterministic", label: "Deterministic", icon: "◆",
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
    id: "compiled", label: "Compiled", icon: "⬡",
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
    id: "traceable", label: "Traceable", icon: "◈",
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
    id: "scalable", label: "Scalable", icon: "◇",
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
    <section ref={ref} className="relative py-24 md:py-32" style={{ background: "#141d2e" }}>
      <div className="relative max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 mb-6">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <h2 className="font-mono font-bold leading-[1.15] tracking-[-0.02em]" style={{ fontSize: "2.5rem", color: "#F3F4F6" }}>
              Not another AI wrapper. <span style={{ color: "#6B7280" }}>A compiler.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="font-light leading-relaxed" style={{ color: "#D1D5DB", fontSize: "1.125rem" }}>
              Every clinical AI product generates answers probabilistically. Medient is the only platform that <span className="font-normal" style={{ color: "#F3F4F6" }}>compiles guidelines into verified, deterministic logic</span>.
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-1.5 mb-6">
          {differentiators.map((d, i) => (
            <button key={d.id} onClick={() => setActiveDiff(i)}
              className={`font-mono tracking-wide px-4 py-2.5 border transition-all duration-400 ${
                activeDiff === i ? "border-[#FFFFFF] bg-[#FFFFFF]/5 text-[#F3F4F6]" : "border-[#2A3548] text-[#6B7280] hover:text-[#D1D5DB] hover:border-[#6B7280]"
              }`}
              style={{ fontSize: "1rem" }}>
              <span className="mr-2" style={{ fontSize: "0.875rem" }}>{d.icon}</span>{d.label}
            </button>
          ))}
        </motion.div>

        <motion.div key={activeDiff} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border overflow-hidden" style={{ borderColor: "#2A3548", background: "#1A2536" }}>
          <div className="px-6 md:px-8 py-4 flex items-center gap-4"
            style={{ background: "#1F2B3E", borderBottom: "1px solid #2A3548" }}>
            <span style={{ fontSize: "1.5rem", color: "#D1D5DB" }}>{diff.icon}</span>
            <h3 className="font-mono font-light" style={{ fontSize: "1.5rem", color: "#F3F4F6" }}>{diff.headline}</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="px-6 md:px-8 py-5 md:py-6 border-b lg:border-b-0 lg:border-r" style={{ borderColor: "#2A3548" }}>
              <p className="leading-[1.7]" style={{ color: "#D1D5DB", fontSize: "1.125rem" }}>{diff.description}</p>
            </div>

            <div className="grid grid-cols-1 divide-y" style={{ borderColor: "#2A3548" }}>
              <div className="px-6 md:px-8 py-3 flex items-center justify-between" style={{ borderColor: "#2A3548" }}>
                <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "0.875rem", color: "#6B7280" }}>Metric</span>
                <div className="flex items-center gap-8">
                  <span className="font-mono tracking-[0.15em] uppercase" style={{ fontSize: "0.875rem", color: "#F3F4F6" }}>Medient</span>
                  <span className="font-mono tracking-[0.15em] uppercase w-20 text-right" style={{ fontSize: "0.875rem", color: "#6B7280" }}>Others</span>
                </div>
              </div>
              {diff.comparison.map((row, ri) => (
                <div key={ri} className="px-6 md:px-8 py-3.5 md:py-4 flex items-center justify-between hover:bg-[#1F2B3E] transition-colors duration-300" style={{ borderColor: "#2A3548" }}>
                  <span style={{ color: "#D1D5DB", fontSize: "1.125rem" }}>{row.metric}</span>
                  <div className="flex items-center gap-8">
                    <span className="font-mono font-light" style={{ fontSize: "1.125rem", color: "#F3F4F6" }}>{row.medient}</span>
                    <span className="font-mono w-20 text-right" style={{ fontSize: "1rem", color: "#6B7280" }}>{row.others}</span>
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

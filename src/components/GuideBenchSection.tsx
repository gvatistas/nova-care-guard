import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const lines = [
  { text: "GUIDEBENCH v0.1 — Clinical Decision Logic Evaluation Framework", color: "pearl" },
  { text: "", color: "warm-gray" },
  { text: "• Exact outcome match: Does the artifact produce the guideline-intended", color: "warm-gray", highlight: "Exact outcome match:" },
  { text: "  recommendation for every synthetic patient?", color: "warm-gray" },
  { text: "• Counterfactual robustness: Does changing one non-relevant input", color: "warm-gray", highlight: "Counterfactual robustness:" },
  { text: "  leave the recommendation unchanged?", color: "warm-gray" },
  { text: "• Provenance traceability: Can every recommendation be traced to a", color: "warm-gray", highlight: "Provenance traceability:" },
  { text: "  specific source page and paragraph?", color: "warm-gray" },
  { text: "", color: "warm-gray" },
  { text: "10 representative guidelines. 50–100 synthetic patients each. 4 fidelity metrics.", color: "pearl" },
  { text: "", color: "warm-gray" },
  { text: "Open source. Any pipeline can be evaluated against it. ✓", color: "teal" },
];

const GuideBenchSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-40">
      <div className="relative max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-16"
        >
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-4">
            ▸ Evaluation Protocol
          </div>
          <h2 className="font-mono text-3xl md:text-4xl font-light text-pearl tracking-[-0.02em]">
            GuideBench
          </h2>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="bg-deep-field border border-grid-line overflow-hidden"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-grid-line">
            <div className="w-2 h-2 rounded-full bg-coral/60" />
            <div className="w-2 h-2 rounded-full bg-gold/60" />
            <div className="w-2 h-2 rounded-full bg-teal/60" />
            <span className="font-mono text-warm-gray text-xs ml-2">~/guidebench run</span>
          </div>
          <div className="p-6 space-y-0.5">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`font-mono text-sm font-light ${
                  line.color === "teal" ? "text-teal" : line.color === "pearl" ? "text-pearl" : "text-warm-gray"
                }`}
              >
                {line.highlight ? (
                  <>
                    • <span className="text-teal">{line.highlight}</span>{line.text.split(line.highlight)[1]}
                  </>
                ) : (
                  line.text || "\u00A0"
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
          className="mt-12 text-center"
        >
          <p className="font-mono text-pearl text-xl md:text-2xl font-light">
            We wrote the test. Then we open-sourced it.
          </p>
          <a href="#" className="inline-block font-mono text-teal text-sm mt-4 hover:underline transition-all">
            Explore GuideBench →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GuideBenchSection;

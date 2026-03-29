import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const metrics = [
  { name: "Exact outcome match", desc: "Does the artifact produce the guideline-intended recommendation for every synthetic patient?" },
  { name: "Counterfactual robustness", desc: "Does changing one non-relevant input leave the recommendation unchanged?" },
  { name: "Provenance traceability", desc: "Can every recommendation be traced to a specific source page and paragraph?" },
  { name: "Boundary precision", desc: "Does the artifact correctly handle patients at exact threshold boundaries?" },
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
          <p className="font-mono text-warm-gray text-sm font-light mt-4 max-w-xl">
            The open-source clinical decision logic evaluation framework.
            10 representative guidelines. 50–100 synthetic patients each. 4 fidelity metrics.
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="bg-deep-field border border-grid-line p-6 rounded-lg hover:border-teal/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-teal font-mono text-sm mt-0.5">✓</span>
                <div>
                  <h3 className="font-mono text-pearl text-sm font-light mb-2">{metric.name}</h3>
                  <p className="text-warm-gray text-xs font-light leading-relaxed">{metric.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center space-y-4"
        >
          <p className="font-mono text-pearl text-xl md:text-2xl font-light">
            We wrote the test. Then we open-sourced it.
          </p>
          <a href="#" className="inline-block font-mono text-teal text-sm hover:underline transition-all">
            Explore GuideBench →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GuideBenchSection;

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const metrics = [
  { name: "Exact outcome match", score: "98.7%", desc: "Does the artifact produce the guideline-intended recommendation for every synthetic patient?" },
  { name: "Counterfactual robustness", score: "99.2%", desc: "Does changing one non-relevant input leave the recommendation unchanged?" },
  { name: "Provenance traceability", score: "100%", desc: "Can every recommendation be traced to a specific source page and paragraph?" },
  { name: "Boundary precision", score: "97.4%", desc: "Does the artifact correctly handle patients at exact threshold boundaries?" },
];

const GuideBenchSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-5">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-6 md:mb-8">Open Source</div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-mono font-light leading-[1.1] tracking-[-0.02em] mb-6 md:mb-8">
              GuideBench
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
              The open-source clinical decision logic evaluation framework.
              10 representative guidelines. 50–100 synthetic patients each.
              4 fidelity metrics.
            </p>
            <p className="text-white text-lg md:text-xl font-light mb-8">
              We wrote the test. Then we open-sourced it.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-white/[0.02] border border-white/[0.06] p-6 md:p-8 mb-8"
            >
              <div className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-3">Aggregate Score</div>
              <div className="font-mono text-accent text-4xl md:text-5xl font-light tracking-tight">98.8%</div>
              <div className="text-gray-500 text-sm mt-2">across 10 guidelines, 750+ synthetic patients</div>
            </motion.div>

            <a href="#" className="font-mono text-sm tracking-[0.1em] uppercase text-gray-400 hover:text-white transition-colors duration-300 border-b border-gray-700 pb-1 inline-flex items-center gap-2">
              Explore GuideBench <span className="text-base">→</span>
            </a>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="border-t border-white/[0.06]">
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="border-b border-white/[0.06] py-8 md:py-9 px-3 md:px-4 hover:bg-white/[0.015] transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-accent text-sm">✓</span>
                      <h3 className="font-mono text-white text-sm md:text-base font-light">{metric.name}</h3>
                    </div>
                    <span className="font-mono text-accent text-sm md:text-base">{metric.score}</span>
                  </div>
                  <div className="h-px bg-white/[0.06] mb-4 overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: parseFloat(metric.score) / 100 } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 1, ease: "easeOut" }}
                      className="h-full bg-accent/30 origin-left"
                    />
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{metric.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideBenchSection;

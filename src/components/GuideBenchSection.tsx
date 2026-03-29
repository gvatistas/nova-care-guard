import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const metrics = [
  { name: "Exact outcome match", score: "98.7%", desc: "Artifact produces the guideline-intended recommendation for every synthetic patient." },
  { name: "Counterfactual robustness", score: "99.2%", desc: "Changing one non-relevant input leaves the recommendation unchanged." },
  { name: "Provenance traceability", score: "100%", desc: "Every recommendation traced to a specific source page and paragraph." },
  { name: "Boundary precision", score: "97.4%", desc: "Correctly handles patients at exact threshold boundaries." },
];

const GuideBenchSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-16 md:py-24 texture-facets">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(74,237,196,0.025),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-5">
            <div className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70 mb-3">Open Source</div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-mono font-light leading-[1.15] tracking-[-0.02em] mb-4">GuideBench</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              The open-source clinical decision logic evaluation framework.
              <span className="text-white font-normal"> 10 guidelines. 750+ synthetic patients. 4 fidelity metrics.</span>
            </p>
            <p className="text-white text-xl font-light mb-5">
              We wrote the test. Then we open-sourced it.
            </p>

            <div className="border border-accent/20 bg-accent/[0.04] p-5 mb-5 panel-3d">
              <div className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">Aggregate Score</div>
              <div className="font-mono text-accent text-5xl font-light tracking-tight">98.8%</div>
              <div className="text-gray-400 text-base mt-2">across all guidelines and synthetic patients</div>
            </div>

            <a href="#" className="font-mono text-base tracking-[0.1em] uppercase text-accent hover:text-white transition-colors duration-300 inline-flex items-center gap-2">
              Explore GuideBench <span className="text-lg">→</span>
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
                  className="border-b border-white/[0.06] py-5 px-4 transition-all duration-500 cursor-default"
                  style={{
                    background: hoveredMetric === i ? "linear-gradient(135deg, rgba(74,237,196,0.04), transparent 60%)" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredMetric(i)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-base transition-all duration-300 ${hoveredMetric === i ? "text-accent" : "text-accent/50"}`}>✓</span>
                      <h3 className={`font-mono text-base md:text-lg font-light transition-colors duration-300 ${hoveredMetric === i ? "text-accent" : "text-white"}`}>{metric.name}</h3>
                    </div>
                    <span className="font-mono text-accent text-lg md:text-xl">{metric.score}</span>
                  </div>
                  <div className="h-px bg-white/[0.06] mb-2 overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: parseFloat(metric.score) / 100 } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 1, ease: "easeOut" }}
                      className="h-full bg-accent/30 origin-left"
                    />
                  </div>
                  <p className="text-gray-300 text-base leading-relaxed">{metric.desc}</p>
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

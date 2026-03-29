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
    <section ref={ref} className="relative py-40 md:py-56">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="lg:col-span-5"
          >
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-600 mb-8">
              Open Source
            </div>
            <h2 className="text-white text-3xl md:text-5xl font-mono font-light leading-[1.15] tracking-[-0.02em] mb-8">
              GuideBench
            </h2>
            <p className="text-gray-500 text-base font-light leading-relaxed mb-10">
              The open-source clinical decision logic evaluation framework.
              10 representative guidelines. 50–100 synthetic patients each.
              4 fidelity metrics.
            </p>
            <p className="text-white text-lg font-light mb-6">
              We wrote the test. Then we open-sourced it.
            </p>
            <a
              href="#"
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors duration-300 border-b border-gray-700 pb-1"
            >
              Explore GuideBench →
            </a>
          </motion.div>

          {/* Right — metrics */}
          <div className="lg:col-span-7">
            <div className="border-t border-white/[0.06]">
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="border-b border-white/[0.06] py-10 grid grid-cols-12 gap-6 hover:bg-white/[0.01] transition-colors duration-300 px-2"
                >
                  <div className="col-span-1">
                    <span className="font-mono text-teal text-sm">✓</span>
                  </div>
                  <div className="col-span-4">
                    <h3 className="font-mono text-white text-sm font-light">{metric.name}</h3>
                  </div>
                  <div className="col-span-7">
                    <p className="text-gray-500 text-sm font-light leading-relaxed">{metric.desc}</p>
                  </div>
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

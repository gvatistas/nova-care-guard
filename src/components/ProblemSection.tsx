import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "54%", unit: "", desc: "of guideline-recommended care is delivered" },
  { value: "20", unit: "years", desc: "without improvement" },
  { value: "1M+", unit: "", desc: "preventable deaths per year in North America" },
];

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-40 md:py-56">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-600 mb-16"
        >
          The Problem
        </motion.div>

        {/* Statement */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-white text-3xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.15] tracking-[-0.02em] max-w-4xl"
        >
          Healthcare has a
          <br />
          compiler problem.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-gray-500 text-lg font-light mt-10 max-w-2xl leading-relaxed"
        >
          Clinical guidelines exist as unstructured PDFs. Every clinical decision 
          requires a human to interpret, recall, and apply them in real-time. 
          The result is systemic failure at population scale.
        </motion.p>

        {/* Stats — massive numbers */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.2 }}
              className="bg-background p-10 md:p-14"
            >
              <div className="font-mono text-white text-5xl md:text-7xl font-light tracking-[-0.03em]">
                {stat.value}
                {stat.unit && (
                  <span className="text-gray-600 text-2xl md:text-3xl ml-2">{stat.unit}</span>
                )}
              </div>
              <div className="text-gray-500 text-sm font-light mt-4 leading-relaxed">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

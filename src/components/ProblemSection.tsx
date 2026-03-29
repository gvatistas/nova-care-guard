import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "54%", desc: "of guideline-recommended care is actually delivered.", color: "text-coral" },
    { value: "20 yrs", desc: "This number hasn't moved in two decades.", color: "text-pearl" },
    { value: "~1M", desc: "preventable deaths per year in North America.", color: "text-pearl" },
  ];

  return (
    <section ref={ref} className="relative py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-deep-field/50 to-void" />
      
      <div className="relative max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-coral mb-8">
            ▸ Threat Assessment
          </div>
          
          <div className="space-y-12 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.5, duration: 0.8 }}
                className="text-center"
              >
                <div className={`font-mono text-5xl md:text-6xl font-light ${stat.color} mb-3`}>
                  {stat.value}
                </div>
                <p className="font-mono text-warm-gray text-lg font-light">{stat.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 2.2 }}
            className="mt-20 border border-grid-line p-8 max-w-2xl mx-auto"
          >
            <p className="font-mono text-pearl text-sm font-light leading-relaxed">
              Healthcare has a compiler problem. Clinical guidelines exist as{" "}
              <span className="text-coral">unstructured PDFs</span>. Every clinical decision
              requires a human to interpret, recall, and apply them in real-time.{" "}
              <span className="text-teal">We compile them into formally verified, deterministic artifacts.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimatedCounter = ({ value, inView }: { value: number; inView: boolean }) => {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return () => controls.stop();
  }, [inView, value]);
  return <>{display}</>;
};

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-44">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute left-0 top-1/4 w-px h-1/2 bg-gradient-to-b from-transparent via-accent/20 to-transparent origin-top"
      />

      <div className="max-w-[1400px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-12"
        >
          The Problem
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-white text-4xl md:text-6xl lg:text-7xl font-mono font-light leading-[1.1] tracking-[-0.02em] max-w-4xl"
        >
          Healthcare has a
          <br />
          <span className="text-gray-500">compiler problem.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-xl md:text-2xl font-light mt-10 max-w-2xl leading-relaxed"
        >
          Clinical guidelines exist as unstructured PDFs. Every clinical decision
          requires a human to interpret, recall, and apply them in real-time.
          The result is systemic failure at population scale.
        </motion.p>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
          {[
            { value: 54, suffix: "%", desc: "of guideline-recommended care is actually delivered" },
            { value: 20, suffix: " yrs", desc: "without meaningful improvement" },
            { value: 1, suffix: "M+", desc: "preventable deaths per year in North America" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.2 }}
              className="bg-background p-10 md:p-14 group hover:bg-white/[0.015] transition-colors duration-500"
            >
              <div className="font-mono text-white text-6xl md:text-8xl font-light tracking-[-0.03em]">
                <AnimatedCounter value={stat.value} inView={inView} />
                <span className="text-gray-500 text-3xl md:text-4xl ml-1">{stat.suffix}</span>
              </div>
              <div className="text-gray-400 text-base font-light mt-5 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
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

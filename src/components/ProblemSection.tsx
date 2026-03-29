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
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-20 md:py-28">
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70 mb-4"
        >
          The Problem
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em] max-w-4xl"
        >
          Healthcare has a <span className="text-accent">compiler problem.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-gray-300 text-lg md:text-xl font-light mt-6 max-w-2xl leading-relaxed"
        >
          Clinical guidelines exist as unstructured PDFs — opened once, then forgotten.
          Every clinical decision requires a human to interpret, recall, and apply them
          in real-time. <span className="text-white font-normal">The result is systemic failure at population scale.</span>
        </motion.p>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
          {[
            { value: 54, suffix: "%", desc: "of guideline-recommended care is actually delivered to patients", color: "text-accent" },
            { value: 20, suffix: " yrs", desc: "without meaningful improvement in guideline adherence rates", color: "text-blue-400" },
            { value: 1, suffix: "M+", desc: "preventable deaths per year in North America alone", color: "text-red-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.2 }}
              className="bg-background p-6 md:p-10 group transition-all duration-500 cursor-default"
              style={{
                background: hoveredStat === i
                  ? `linear-gradient(135deg, rgba(255,255,255,0.03), transparent 60%)`
                  : undefined,
                transform: hoveredStat === i ? "translateY(-2px)" : undefined,
              }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`font-mono text-4xl md:text-6xl font-light tracking-[-0.03em] ${stat.color}`}>
                <AnimatedCounter value={stat.value} inView={inView} />
                <span className="text-xl md:text-2xl ml-1 opacity-60">{stat.suffix}</span>
              </div>
              <div className="text-gray-300 text-base font-light mt-3 leading-relaxed group-hover:text-white transition-colors duration-500">
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

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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={ref} className="relative py-20 md:py-32" onMouseMove={handleMouse}>
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.015), transparent 50%)`,
        }}
      />

      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute left-0 top-1/4 w-px h-1/2 bg-gradient-to-b from-transparent via-accent/15 to-transparent origin-top"
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-6"
        >
          The Problem
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.1] tracking-[-0.02em] max-w-4xl"
        >
          Healthcare has a <span className="text-gray-500">compiler problem.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-base md:text-lg font-light mt-6 max-w-2xl leading-relaxed"
        >
          Clinical guidelines exist as unstructured PDFs — opened once, then forgotten.
          Every clinical decision requires a human to interpret, recall, and apply them
          in real-time. The result is systemic failure at population scale.
        </motion.p>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
          {[
            { value: 54, suffix: "%", desc: "of guideline-recommended care is actually delivered to patients" },
            { value: 20, suffix: " yrs", desc: "without meaningful improvement in guideline adherence rates" },
            { value: 1, suffix: "M+", desc: "preventable deaths per year in North America alone" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.2 }}
              className="bg-background p-6 md:p-10 group transition-all duration-500 cursor-default"
              style={{
                background: hoveredStat === i
                  ? `linear-gradient(135deg, rgba(255,255,255,0.02), transparent 60%)`
                  : undefined,
                boxShadow: hoveredStat === i
                  ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 30px rgba(0,0,0,0.3)"
                  : undefined,
                transform: hoveredStat === i ? "translateY(-2px)" : undefined,
              }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className="font-mono text-white text-4xl md:text-6xl font-light tracking-[-0.03em]">
                <AnimatedCounter value={stat.value} inView={inView} />
                <span className="text-gray-500 text-xl md:text-2xl ml-1">{stat.suffix}</span>
              </div>
              <div className="text-gray-400 text-sm md:text-base font-light mt-3 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
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

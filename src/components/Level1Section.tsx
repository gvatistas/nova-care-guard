import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import pixelWithout from "@/assets/pixel-without-medient.png";
import pixelWith from "@/assets/pixel-with-medient.png";

const comparisonPoints = [
  { without: "Doctor relies on memory", with: "Verified artifact queried in 14ms" },
  { without: "Guideline PDF last opened 14 months ago", with: "Every guideline compiled and current" },
  { without: "3 eligible screenings missed", with: "3 screenings returned, 0 missed" },
  { without: "Patient waits 4.2 hours average", with: "Deterministic pathway, no bottleneck" },
  { without: "54% guideline adherence", with: "Near-100% adherence, verified" },
];

const Level1Section = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeView, setActiveView] = useState<"without" | "with">("without");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={ref} className="relative py-32 md:py-48">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-20"
        >
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-600 mb-8">
            The Difference
          </div>
          <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.1] tracking-[-0.02em] max-w-4xl">
            Same hospital.
            <br />
            <span className="text-gray-600">Different infrastructure.</span>
          </h2>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 mb-12 bg-white/[0.03] p-1 w-fit"
        >
          <button
            onClick={() => setActiveView("without")}
            className={`font-mono text-[11px] tracking-[0.15em] uppercase px-6 py-3 transition-all duration-300 ${
              activeView === "without"
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Without Medient
          </button>
          <button
            onClick={() => setActiveView("with")}
            className={`font-mono text-[11px] tracking-[0.15em] uppercase px-6 py-3 transition-all duration-300 ${
              activeView === "with"
                ? "bg-accent/20 text-accent"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            With Medient
          </button>
        </motion.div>

        {/* Main comparison area */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/[0.06]">
          {/* Image panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 bg-background relative overflow-hidden"
          >
            <motion.div style={{ y: imageY }} className="relative">
              {/* Without image */}
              <motion.img
                src={pixelWithout}
                alt="Hospital without Medient — chaos, missed screenings"
                loading="lazy"
                width={1920}
                height={1080}
                className="w-full"
                animate={{
                  opacity: activeView === "without" ? 0.85 : 0,
                  scale: activeView === "without" ? 1 : 1.05,
                }}
                transition={{ duration: 0.8 }}
                style={{ position: activeView === "without" ? "relative" : "absolute", top: 0 }}
              />
              {/* With image */}
              <motion.img
                src={pixelWith}
                alt="Hospital with Medient — streamlined, verified pathways"
                loading="lazy"
                width={1920}
                height={1080}
                className="w-full"
                animate={{
                  opacity: activeView === "with" ? 0.9 : 0,
                  scale: activeView === "with" ? 1 : 1.05,
                }}
                transition={{ duration: 0.8 }}
                style={{ position: activeView === "with" ? "relative" : "absolute", top: 0 }}
              />
            </motion.div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

            {/* Status badge */}
            <div className="absolute top-6 left-6">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 ${
                  activeView === "without"
                    ? "bg-red-500/20 text-red-400 border border-red-500/20"
                    : "bg-accent/20 text-accent border border-accent/20"
                }`}
              >
                {activeView === "without" ? "⬤ Uncompiled" : "⬤ Compiled"}
              </motion.div>
            </div>
          </motion.div>

          {/* Comparison points panel */}
          <div className="lg:col-span-5 bg-background">
            {comparisonPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="border-b border-white/[0.06] p-6 md:p-8 hover:bg-white/[0.01] transition-colors duration-300"
              >
                <motion.div
                  key={activeView + i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  {activeView === "without" ? (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-red-500/60 text-xs mt-0.5">✕</span>
                        <p className="text-gray-400 text-sm font-light leading-relaxed">
                          {point.without}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-accent text-xs mt-0.5">✓</span>
                        <p className="text-gray-300 text-sm font-light leading-relaxed">
                          {point.with}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            ))}

            {/* Summary stat */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="p-6 md:p-8"
            >
              <motion.div
                key={activeView}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {activeView === "without" ? (
                  <div>
                    <div className="font-mono text-red-400/70 text-3xl md:text-4xl font-light">54%</div>
                    <div className="text-gray-600 text-xs font-light mt-2">average guideline adherence</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-mono text-accent text-3xl md:text-4xl font-light">~100%</div>
                    <div className="text-gray-600 text-xs font-light mt-2">verified guideline adherence</div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Level1Section;

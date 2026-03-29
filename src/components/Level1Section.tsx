import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import pixelWithout from "@/assets/pixel-without-medient.png";
import pixelWith from "@/assets/pixel-with-medient.png";

const comparisonPoints = [
  { without: "Doctor relies on memory to recall screening criteria", with: "Verified decision artifact queried in 14 milliseconds" },
  { without: "Guideline PDF last opened 14 months ago by any staff", with: "Every guideline compiled, current, and auto-deployed" },
  { without: "3 eligible cancer screenings silently missed", with: "All 3 screenings surfaced and scheduled — zero missed" },
  { without: "Patient waits 4.2 hours due to unstructured workflows", with: "Deterministic care pathway eliminates bottlenecks" },
  { without: "54% average guideline adherence across the network", with: "Near-100% verified adherence with full audit trail" },
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
    <section ref={ref} className="relative py-32 md:py-44">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-16"
        >
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-8">
            The Difference
          </div>
          <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-mono font-light leading-[1.1] tracking-[-0.02em] max-w-4xl">
            Same hospital.
            <br />
            <span className="text-gray-500">Different infrastructure.</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light mt-8 max-w-2xl leading-relaxed">
            Two identical emergency departments. One runs on human memory and PDF guidelines.
            The other runs on compiled, formally verified clinical decision artifacts.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 mb-10 bg-white/[0.03] p-1.5 w-fit"
        >
          <button
            onClick={() => setActiveView("without")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-8 py-3.5 transition-all duration-300 ${
              activeView === "without" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Without Medient
          </button>
          <button
            onClick={() => setActiveView("with")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-8 py-3.5 transition-all duration-300 ${
              activeView === "with" ? "bg-accent/20 text-accent" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            With Medient
          </button>
        </motion.div>

        {/* Comparison */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/[0.06]">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 bg-background relative overflow-hidden"
          >
            <motion.div style={{ y: imageY }} className="relative">
              <motion.img
                src={pixelWithout}
                alt="Hospital without Medient"
                loading="lazy"
                width={1920}
                height={1080}
                className="w-full"
                animate={{ opacity: activeView === "without" ? 0.85 : 0, scale: activeView === "without" ? 1 : 1.05 }}
                transition={{ duration: 0.8 }}
                style={{ position: activeView === "without" ? "relative" : "absolute", top: 0 }}
              />
              <motion.img
                src={pixelWith}
                alt="Hospital with Medient"
                loading="lazy"
                width={1920}
                height={1080}
                className="w-full"
                animate={{ opacity: activeView === "with" ? 0.9 : 0, scale: activeView === "with" ? 1 : 1.05 }}
                transition={{ duration: 0.8 }}
                style={{ position: activeView === "with" ? "relative" : "absolute", top: 0 }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-6 left-6">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`font-mono text-xs tracking-[0.15em] uppercase px-5 py-2.5 ${
                  activeView === "without"
                    ? "bg-red-500/20 text-red-400 border border-red-500/20"
                    : "bg-accent/20 text-accent border border-accent/20"
                }`}
              >
                {activeView === "without" ? "● Uncompiled" : "● Compiled"}
              </motion.div>
            </div>
          </motion.div>

          {/* Points */}
          <div className="lg:col-span-5 bg-background">
            {comparisonPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="border-b border-white/[0.06] p-6 md:p-8 hover:bg-white/[0.015] transition-colors duration-300"
              >
                <motion.div key={activeView + i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  {activeView === "without" ? (
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-base mt-0.5 shrink-0">✕</span>
                      <p className="text-gray-400 text-base leading-relaxed">{point.without}</p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <span className="text-accent text-base mt-0.5 shrink-0">✓</span>
                      <p className="text-gray-300 text-base leading-relaxed">{point.with}</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1 }} className="p-6 md:p-8">
              <motion.div key={activeView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {activeView === "without" ? (
                  <div>
                    <div className="font-mono text-red-400/80 text-4xl md:text-5xl font-light">54%</div>
                    <div className="text-gray-500 text-sm mt-2">average guideline adherence</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-mono text-accent text-4xl md:text-5xl font-light">~100%</div>
                    <div className="text-gray-500 text-sm mt-2">verified guideline adherence</div>
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

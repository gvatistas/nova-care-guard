import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const segments = [
  {
    name: "Frontier Labs",
    icon: "◇",
    short: "Training Data",
    desc: "Structured clinical decision schemas for fine-tuning. Zero hallucination training data.",
  },
  {
    name: "Clinical AI Products",
    icon: "⬡",
    short: "Drop-in Logic",
    desc: "Pre-compiled guideline logic. Drop-in clinical decision module.",
  },
  {
    name: "Clinical Networks",
    icon: "△",
    short: "Network Adherence",
    desc: "Network-wide screening adherence. One artifact across all sites.",
  },
  {
    name: "Clinics",
    icon: "◻",
    short: "Point of Care",
    desc: "Point-of-care decision support. 90% intake time reduction.",
  },
  {
    name: "Patients",
    icon: "○",
    short: "Consumer AI",
    desc: "Consumer-facing AI health companion. Guideline-backed, physician-verified.",
  },
  {
    name: "Insurers",
    icon: "⬢",
    short: "Preventive ROI",
    desc: "Preventive care ROI. Reduce downstream claims through upstream detection.",
  },
];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-24 md:py-32">
      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <p className="text-[12px] font-medium uppercase text-white/30 mb-3" style={{ letterSpacing: "0.1em" }}>
            Deployment Architecture
          </p>
          <h2 className="text-white font-semibold text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em" }}>
            Market Architecture
          </h2>
          <p className="text-white/50 mt-2 text-lg max-w-2xl" style={{ letterSpacing: "-0.01em" }}>
            One compiled artifact. Six deployment surfaces.
          </p>
        </motion.div>

        {/* Horizontal chain */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="mt-12 overflow-x-auto"
        >
          <div className="flex items-stretch gap-0 min-w-[900px]">
            {segments.map((seg, i) => {
              const isActive = selected === i;
              return (
                <div key={seg.name} className="flex items-stretch flex-1">
                  <button
                    onClick={() => setSelected(isActive ? null : i)}
                    className="flex-1 border border-white/[0.08] p-5 text-left cursor-pointer transition-all duration-300 hover:bg-white/[0.03]"
                    style={{
                      borderColor: isActive ? `${TEAL}44` : "rgba(255,255,255,0.08)",
                      background: isActive ? "rgba(0,212,170,0.04)" : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <div className="text-2xl mb-3 text-white/30">{seg.icon}</div>
                    <p className="text-[12px] font-medium uppercase text-white/40 mb-1" style={{ letterSpacing: "0.1em" }}>
                      {seg.short}
                    </p>
                    <p className="text-white font-medium text-sm" style={{ letterSpacing: "-0.01em" }}>{seg.name}</p>
                  </button>
                  {i < segments.length - 1 && (
                    <div className="flex items-center px-1">
                      <span className="text-white/15 text-xs">→</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Expanded detail */}
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 border border-white/[0.08] p-8"
            style={{ background: "rgba(0,212,170,0.02)" }}
          >
            <div className="flex items-start gap-6">
              <span className="text-4xl text-white/20">{segments[selected].icon}</span>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2" style={{ letterSpacing: "-0.02em" }}>
                  {segments[selected].name}
                </h3>
                <p className="text-white/60 text-base" style={{ letterSpacing: "-0.01em" }}>
                  {segments[selected].desc}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const TEAL = "#00d4aa";

export default SegmentsSection;
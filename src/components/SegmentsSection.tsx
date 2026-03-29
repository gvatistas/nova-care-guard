import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const segments = [
  {
    name: "Health Systems",
    icon: "◆",
    hook: "Deploy once, cover your whole population.",
    value: "Per-guideline subscription. Zero marginal cost per encounter. FHIR integration into existing EHR workflows.",
    metric: "45%",
    metricLabel: "reduction in missed screenings",
  },
  {
    name: "Government",
    icon: "◇",
    hook: "The prevention mandate is funded. The tools aren't built.",
    value: "B2G procurement. SBIR/STTR. IRAP. RHTP mandates evidence-based prevention — this IS that tool.",
    metric: "$2.1B",
    metricLabel: "RHTP funding available",
  },
  {
    name: "Medicare / Medicaid",
    icon: "△",
    hook: "RHTP funding is looking for exactly this.",
    value: "Auditable FHIR artifacts mapping to CMS quality measures. Grant-subsidized pilots.",
    metric: "100%",
    metricLabel: "CMS measure alignment",
  },
  {
    name: "Payers",
    icon: "○",
    hook: "Early detection is cheaper than late treatment.",
    value: "Population-level guideline bundles. Per-member-per-month. Every prevented late-stage case is $100K+ saved.",
    metric: "$100K+",
    metricLabel: "saved per prevented case",
  },
  {
    name: "Clinical AI",
    icon: "⬡",
    hook: "Clinical reasoning without the liability.",
    value: "MCP API for frontier labs, medical scribes, and wrappers. Zero inference cost. Verified clinical logic layer.",
    metric: "0ms",
    metricLabel: "inference latency",
  },
  {
    name: "Guideline Societies",
    icon: "□",
    hook: "Your guidelines, actually followed.",
    value: "Narrative guidelines compiled into verified, deployable artifacts. Adherence from ~54% to near-100%.",
    metric: "~100%",
    metricLabel: "adherence rate",
  },
];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-40 md:py-56">
      <div className="max-w-[1400px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-24"
        >
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-600 mb-8">
            Markets
          </div>
          <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.1] tracking-[-0.02em] max-w-3xl">
            One artifact.
            <br />
            <span className="text-gray-600">Six markets.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="group bg-background p-10 md:p-12 hover:bg-white/[0.02] transition-all duration-500 cursor-default relative overflow-hidden"
            >
              {/* Accent line on hover */}
              <motion.div
                initial={false}
                animate={{ scaleX: active === i ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 right-0 h-px bg-accent origin-left"
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-gray-700 text-lg">{seg.icon}</span>
                <h3 className="font-mono text-white text-base font-light group-hover:text-accent transition-colors duration-500">
                  {seg.name}
                </h3>
              </div>
              <p className="text-gray-400 text-sm font-light mb-6 leading-relaxed">
                {seg.hook}
              </p>

              {/* Expanded content on hover */}
              <motion.div
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, height: active === i ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-gray-600 text-xs font-light leading-relaxed mb-4">
                  {seg.value}
                </p>
                <div className="border-t border-white/[0.06] pt-4">
                  <div className="font-mono text-white text-xl font-light">{seg.metric}</div>
                  <div className="text-gray-600 text-[10px] font-mono tracking-[0.1em] uppercase mt-1">
                    {seg.metricLabel}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SegmentsSection;

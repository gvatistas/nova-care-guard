import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const segments = [
  {
    name: "Health Systems",
    hook: "Deploy once, cover your whole population.",
    value: "Per-guideline subscription. Zero marginal cost per encounter. FHIR integration into existing EHR workflows.",
  },
  {
    name: "Medicare / Medicaid",
    hook: "RHTP funding is looking for exactly this.",
    value: "Auditable FHIR artifacts mapping to CMS quality measures. Grant-subsidized pilots.",
  },
  {
    name: "Payers",
    hook: "Early detection is cheaper than late treatment.",
    value: "Population-level guideline bundles. Per-member-per-month. Every prevented late-stage case is $100K+ saved.",
  },
  {
    name: "Consumer Platforms",
    hook: "Clinical reasoning without a clinical team.",
    value: "MCP API for Apple Health, Oura, Withings. Zero inference cost. Zero clinical team.",
  },
  {
    name: "Guideline Societies",
    hook: "Your guidelines, actually followed.",
    value: "Narrative guidelines compiled into verified, deployable artifacts. Adherence from ~54% to near-100%.",
  },
  {
    name: "Government",
    hook: "The prevention mandate is funded. The tools aren't built.",
    value: "B2G procurement. SBIR/STTR. IRAP. RHTP mandates evidence-based prevention — this IS that tool.",
  },
];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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
          <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-mono font-light leading-[1.15] tracking-[-0.02em] max-w-3xl">
            One artifact.
            <br />
            Six markets.
          </h2>
        </motion.div>

        {/* 3×2 grid — clean, no icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="group bg-background p-10 md:p-12 hover:bg-white/[0.02] transition-colors duration-500"
            >
              <h3 className="font-mono text-white text-base font-light mb-3 group-hover:text-teal transition-colors duration-500">
                {seg.name}
              </h3>
              <p className="text-gray-400 text-sm font-light mb-6 leading-relaxed">
                {seg.hook}
              </p>
              <p className="text-gray-600 text-xs font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {seg.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SegmentsSection;

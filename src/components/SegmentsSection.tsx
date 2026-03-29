import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const segments = [
  {
    icon: "✚",
    name: "Health Systems",
    hook: "Deploy once, cover your whole population.",
    value: "Per-guideline subscription. Zero marginal cost per encounter. Deploy via FHIR integration into existing EHR workflows.",
  },
  {
    icon: "◈",
    name: "Medicare / Medicaid",
    hook: "RHTP funding is looking for exactly this.",
    value: "Auditable FHIR artifacts mapping directly to CMS quality measures (MIPS/APM). Grant-subsidized pilots. Purpose-built for the regulatory moment.",
  },
  {
    icon: "⛊",
    name: "Payers",
    hook: "Early detection is cheaper than late treatment.",
    value: "Population-level guideline bundles. Per-member-per-month pricing. Every prevented late-stage case is $100K+ saved.",
  },
  {
    icon: "☎",
    name: "Consumer Platforms",
    hook: "Add clinical reasoning without building a clinical team.",
    value: "MCP API. Clinical reasoning as a service for Apple Health, Oura, Withings. Zero inference cost. Zero clinical team required.",
  },
  {
    icon: "⚕",
    name: "Guideline Societies",
    hook: "Your guidelines, actually followed.",
    value: "Compilation-as-a-service. Narrative guidelines compiled into formally verified, deployable artifacts. Adherence from ~54% to near-100%.",
  },
  {
    icon: "🏛",
    name: "Government",
    hook: "The prevention mandate is funded. The tools aren't built.",
    value: "B2G procurement. SBIR/STTR. IRAP. RHTP mandates evidence-based prevention tools — this IS that tool.",
  },
];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-40">
      <div className="relative max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-20"
        >
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-4">
            ▸ Market Intelligence
          </div>
          <h2 className="font-mono text-3xl md:text-4xl font-light text-pearl tracking-[-0.02em] max-w-3xl">
            One artifact. Six markets.
            <br />
            <span className="text-warm-gray">Zero marginal cost per encounter.</span>
          </h2>
        </motion.div>

        {/* 3×2 grid with staggered offsets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12 }}
              style={{ marginTop: i >= 3 ? 16 : 0 }}
              className="group bg-deep-field border border-grid-line p-6 hover:border-teal/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(74,237,196,0.06)] rounded-xl"
            >
              <span className="text-teal/50 text-2xl group-hover:text-teal transition-colors duration-300 block mb-4">
                {seg.icon}
              </span>
              <h3 className="font-mono text-pearl text-base font-light mb-2">{seg.name}</h3>
              <p className="font-mono text-warm-gray text-sm font-light mb-4">{seg.hook}</p>
              <p className="text-warm-gray/60 text-xs font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-40 overflow-hidden">
                {seg.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Zero Marginal Cost chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-24 max-w-xl mx-auto"
        >
          <div className="bg-deep-field border border-grid-line p-8 rounded-lg">
            <div className="font-mono text-xs tracking-[0.15em] uppercase text-warm-gray mb-8">
              Cost per Query vs. Usage
            </div>
            <div className="relative h-40">
              {/* Axes */}
              <div className="absolute left-8 top-0 bottom-8 w-px bg-grid-line" />
              <div className="absolute bottom-8 left-8 right-0 h-px bg-grid-line" />

              <svg className="absolute left-8 top-0 right-0 bottom-8" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* LLM line — rising, dashed, coral */}
                <motion.line
                  x1="0" y1="110" x2="380" y2="15"
                  stroke="hsl(0 100% 71%)"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ delay: 1.5, duration: 1.5 }}
                />
                {/* Compiled line — flat, solid, teal */}
                <motion.line
                  x1="0" y1="110" x2="380" y2="110"
                  stroke="hsl(160 82% 61%)"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ delay: 1.5, duration: 1.5 }}
                />
              </svg>

              {/* Labels */}
              <div className="absolute right-2 top-2 font-mono text-coral text-[10px]">Inference LLM ↗</div>
              <div className="absolute right-2 bottom-10 font-mono text-teal text-[10px]">Compiled Artifact →</div>

              {/* Y label */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-warm-gray text-[9px] tracking-widest">
                COST
              </div>
            </div>
            <div className="flex justify-between ml-8">
              <span className="font-mono text-warm-gray text-[10px]">0</span>
              <span className="font-mono text-warm-gray text-[10px]">Usage (encounters) →</span>
            </div>
          </div>
          <p className="font-mono text-warm-gray text-xs text-center mt-6 font-light">
            Every competitor using inference-time LLMs faces a per-query cost floor. We don't.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SegmentsSection;

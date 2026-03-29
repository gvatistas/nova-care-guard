import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Shield, Smartphone, Landmark, HeartPulse, Brain } from "lucide-react";

const segments = [
  {
    icon: HeartPulse,
    name: "Care Staff",
    hook: "Deploy once, cover your whole population.",
    value: "Per-guideline subscription. Zero marginal cost per encounter. Compiled artifacts integrate via FHIR into existing EHR workflows — no retraining required.",
  },
  {
    icon: Brain,
    name: "Clinical AI Products",
    hook: "Clinical correctness as a service.",
    value: "MCP API for frontier labs, medical wrappers, and AI scribes. Your model handles conversation. Our artifact handles clinical reasoning. Zero inference cost.",
  },
  {
    icon: Shield,
    name: "Insurance & Payers",
    hook: "Early detection is cheaper than late treatment.",
    value: "Population-level guideline bundles. Per-member-per-month pricing. Every prevented late-stage case is $100K+ saved. Auditable FHIR outputs.",
  },
  {
    icon: Landmark,
    name: "Government",
    hook: "The prevention mandate is funded. The tools aren't built.",
    value: "B2G procurement. SBIR/STTR. IRAP. RHTP mandates evidence-based prevention tools — this IS that tool. Defense-grade verification for public health infrastructure.",
  },
  {
    icon: Building2,
    name: "Health Networks",
    hook: "Guideline adherence at population scale.",
    value: "Network-wide deployment of compiled clinical artifacts. See Project Beta: 5 networks, 4.5M patients, measurable outcome improvements across Quebec.",
  },
  {
    icon: Smartphone,
    name: "Consumer Platforms",
    hook: "Add clinical reasoning without building a clinical team.",
    value: "API for Apple Health, Oura, Withings, and any consumer health app. Clinical reasoning as infrastructure. Zero clinical team required.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12 }}
              style={{ marginTop: i % 2 === 1 ? 16 : 0, borderRadius: "12px" }}
              className="group bg-deep-field border border-grid-line p-6 hover:border-teal/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(74,237,196,0.06)]"
            >
              <seg.icon className="w-6 h-6 text-teal/60 group-hover:text-teal transition-colors mb-4" />
              <h3 className="font-mono text-pearl text-base font-light mb-2">{seg.name}</h3>
              <p className="font-mono text-warm-gray text-sm font-light mb-4">{seg.hook}</p>
              <p className="text-warm-gray/70 text-xs font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {seg.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cost chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-20 max-w-xl mx-auto"
        >
          <div className="bg-deep-field border border-grid-line p-8" style={{ borderRadius: "8px" }}>
            <div className="font-mono text-xs tracking-[0.15em] uppercase text-warm-gray mb-6">Cost per Query vs. Usage</div>
            <div className="relative h-32">
              {/* Y axis */}
              <div className="absolute left-0 top-0 bottom-6 w-px bg-grid-line" />
              {/* X axis */}
              <div className="absolute bottom-6 left-0 right-0 h-px bg-grid-line" />
              {/* LLM line (coral, rising) */}
              <svg className="absolute inset-0" viewBox="0 0 400 100" preserveAspectRatio="none">
                <line x1="0" y1="90" x2="380" y2="10" stroke="hsl(0 100% 71%)" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="0" y1="90" x2="380" y2="90" stroke="hsl(160 82% 61%)" strokeWidth="2" />
              </svg>
              {/* Labels */}
              <div className="absolute right-0 top-0 font-mono text-coral text-[10px]">Inference LLM</div>
              <div className="absolute right-0 bottom-7 font-mono text-teal text-[10px]">Compiled Artifact</div>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-warm-gray text-[10px]">0</span>
              <span className="font-mono text-warm-gray text-[10px]">Usage (encounters) →</span>
            </div>
          </div>
          <p className="font-mono text-warm-gray text-xs text-center mt-4 font-light">
            Every competitor using inference-time LLMs faces a per-query cost floor. We don't.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SegmentsSection;

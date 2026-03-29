import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const segments = [
  {
    name: "Health Systems & Networks",
    accentColor: "text-accent",
    borderColor: "border-accent/20",
    icon: "◆",
    tagline: "Deploy once. Cover your whole population.",
    description: "Health systems struggle with inconsistent guideline adherence across departments, shifts, and facilities. Medient compiles every clinical guideline into a verified decision artifact that integrates directly into your existing EHR through FHIR — ensuring every clinician, at every touchpoint, follows the same evidence-based protocol.",
    useCase: "A 12-hospital network deploys Medient's lung cancer screening artifact. Within 90 days, every eligible patient across all facilities is automatically flagged — no manual chart review, no missed screenings.",
    metrics: [
      { value: "45%", label: "reduction in missed screenings" },
      { value: "$0", label: "marginal cost per encounter" },
    ],
  },
  {
    name: "Government & Defense",
    accentColor: "text-blue",
    borderColor: "border-blue/20",
    icon: "◇",
    tagline: "The prevention mandate is funded. The tools aren't built.",
    description: "Government health agencies have clear mandates and dedicated funding for evidence-based prevention — RHTP, SBIR/STTR, IRAP — but lack the infrastructure to operationalize clinical guidelines at population scale. Medient provides auditable, deterministic clinical decision artifacts purpose-built for public health deployment and regulatory compliance.",
    useCase: "A federal agency deploys compiled USPSTF screening guidelines across 200+ community health centers. Every recommendation is traceable to its source. Every decision is auditable. Zero inference, zero liability.",
    metrics: [
      { value: "$2.1B", label: "RHTP funding available" },
      { value: "100%", label: "audit traceability" },
    ],
  },
  {
    name: "Medicare & Medicaid",
    accentColor: "text-accent",
    borderColor: "border-accent/20",
    icon: "△",
    tagline: "Auditable artifacts mapped to CMS quality measures.",
    description: "CMS quality programs require precise alignment between clinical actions and reporting measures. Medient's compiled artifacts map directly to CMS quality measures — enabling automated compliance, reducing administrative burden, and qualifying for grant-subsidized pilot programs through RHTP pathways.",
    useCase: "A Medicaid managed care organization integrates Medient artifacts to automate HEDIS measure compliance. Guideline adherence data flows directly into quality reporting — no manual abstraction required.",
    metrics: [
      { value: "100%", label: "CMS measure alignment" },
      { value: "80%", label: "reduction in manual abstraction" },
    ],
  },
  {
    name: "Payers & Insurance",
    accentColor: "text-warm",
    borderColor: "border-warm/20",
    icon: "○",
    tagline: "Early detection is cheaper than late treatment. Always.",
    description: "For payers, every missed screening is a future catastrophic claim. Medient enables population-level guideline deployment on a per-member-per-month basis — catching eligible patients before they become late-stage cases. The ROI is immediate and compounding: every prevented late-stage cancer diagnosis saves $100K+ in treatment costs.",
    useCase: "A regional health plan deploys Medient's colorectal cancer screening artifact across 800K members. Within one year, screening rates increase 38%, catching 2,400 additional cases at stage I vs. stage III.",
    metrics: [
      { value: "$100K+", label: "saved per prevented late-stage case" },
      { value: "38%", label: "screening rate improvement" },
    ],
  },
  {
    name: "Clinical AI Products",
    accentColor: "text-blue",
    borderColor: "border-blue/20",
    icon: "⬡",
    tagline: "Clinical reasoning without the liability.",
    description: "Frontier labs, medical scribes, and AI wrappers need clinical decision logic but can't afford the liability of probabilistic inference. Medient provides a verified clinical logic layer through an MCP API — giving your AI product deterministic, guideline-compliant reasoning at zero inference cost and zero clinical risk.",
    useCase: "A medical AI scribe integrates Medient's API. When a physician dictates a patient encounter, the scribe automatically surfaces relevant screening recommendations — not from inference, but from formally verified clinical artifacts.",
    metrics: [
      { value: "0ms", label: "inference latency" },
      { value: "0%", label: "hallucination rate" },
    ],
  },
  {
    name: "Guideline Societies",
    accentColor: "text-accent",
    borderColor: "border-accent/20",
    icon: "□",
    tagline: "Your guidelines, actually followed.",
    description: "Medical societies spend years developing evidence-based guidelines that languish as PDFs — opened once, then forgotten. Medient compiles your narrative guidelines into verified, deployable decision artifacts that integrate directly into clinical workflows. Adherence goes from the current ~54% average to near-100%.",
    useCase: "A major cardiology society partners with Medient to compile their hypertension management guidelines. Within 6 months, participating health systems report near-universal adherence to updated treatment thresholds.",
    metrics: [
      { value: "~100%", label: "guideline adherence rate" },
      { value: "10x", label: "faster guideline adoption" },
    ],
  },
];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-32 md:py-44">
      <div className="max-w-[1400px] mx-auto px-8">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-20">
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-gray-500 mb-8">Markets</div>
          <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-mono font-light leading-[1.1] tracking-[-0.02em] max-w-3xl">
            One artifact.
            <br />
            <span className="text-gray-500">Six markets.</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light mt-8 max-w-2xl leading-relaxed">
            A single compiled clinical decision artifact serves every stakeholder in the healthcare ecosystem — from the bedside to the boardroom to the legislature.
          </p>
        </motion.div>

        {/* Segment cards — full width, expandable */}
        <div className="border-t border-white/[0.06]">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.08 }}
              className={`border-b border-white/[0.06] transition-all duration-500 cursor-pointer ${
                expanded === i ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
              }`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              {/* Header row */}
              <div className="py-8 md:py-10 px-4 md:px-6 grid grid-cols-12 gap-6 items-center">
                <div className="col-span-1">
                  <span className={`text-xl ${seg.accentColor}`}>{seg.icon}</span>
                </div>
                <div className="col-span-5 md:col-span-4">
                  <h3 className={`font-mono text-lg md:text-xl font-light transition-colors duration-300 ${
                    expanded === i ? seg.accentColor : "text-white"
                  }`}>
                    {seg.name}
                  </h3>
                </div>
                <div className="col-span-5 md:col-span-6">
                  <p className="text-gray-400 text-base leading-relaxed">{seg.tagline}</p>
                </div>
                <div className="col-span-1 text-right">
                  <motion.span
                    animate={{ rotate: expanded === i ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block text-gray-500 text-xl font-light"
                  >
                    +
                  </motion.span>
                </div>
              </div>

              {/* Expanded content */}
              <motion.div
                initial={false}
                animate={{
                  height: expanded === i ? "auto" : 0,
                  opacity: expanded === i ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 md:px-6 pb-10 md:pb-14">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pl-0 md:pl-[calc(8.333%+1.5rem)]">
                    {/* Description */}
                    <div className="md:col-span-6">
                      <p className="text-gray-300 text-base leading-[1.8] mb-8">{seg.description}</p>

                      {/* Use case */}
                      <div className={`border-l-2 ${seg.borderColor} pl-6 py-2`}>
                        <div className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-3">Use Case</div>
                        <p className="text-gray-400 text-sm leading-[1.8] italic">{seg.useCase}</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
                        {seg.metrics.map((m, mi) => (
                          <div key={mi} className="bg-background p-8">
                            <div className={`font-mono text-3xl md:text-4xl font-light ${seg.accentColor}`}>
                              {m.value}
                            </div>
                            <div className="text-gray-500 text-sm mt-2">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
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

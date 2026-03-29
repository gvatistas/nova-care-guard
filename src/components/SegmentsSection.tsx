import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const segments = [
  {
    name: "Health Systems & Networks",
    icon: "🏥",
    accentHsl: "160 82% 61%",
    tagline: "Deploy once. Cover your whole population.",
    description: "Health systems struggle with inconsistent guideline adherence across departments, shifts, and facilities. Medient compiles every clinical guideline into a verified decision artifact that integrates directly into your existing EHR through FHIR.",
    stats: [
      { value: "45%", label: "reduction in missed screenings" },
      { value: "$0", label: "marginal cost per encounter" },
      { value: "<30s", label: "time to recommendation" },
    ],
    features: ["FHIR-native EHR integration", "Multi-facility deployment", "Real-time eligibility flagging"],
  },
  {
    name: "Government & Defense",
    icon: "🛡️",
    accentHsl: "210 70% 55%",
    tagline: "The prevention mandate is funded. The tools aren't built.",
    description: "Government health agencies have clear mandates and dedicated funding for evidence-based prevention but lack the infrastructure to operationalize clinical guidelines at population scale. Medient provides fully auditable, deterministic infrastructure.",
    stats: [
      { value: "$2.1B", label: "RHTP funding available" },
      { value: "100%", label: "audit traceability" },
      { value: "200+", label: "deployable CHCs" },
    ],
    features: ["Complete audit trail", "Classified-grade security", "Population-scale deployment"],
  },
  {
    name: "Medicare & Medicaid",
    icon: "📋",
    accentHsl: "160 82% 61%",
    tagline: "Auditable artifacts mapped to CMS quality measures.",
    description: "CMS quality programs require precise alignment between clinical actions and reporting measures. Medient's compiled artifacts map directly to CMS quality measures — enabling automated compliance and eliminating manual chart abstraction.",
    stats: [
      { value: "100%", label: "CMS measure alignment" },
      { value: "80%", label: "less manual abstraction" },
      { value: "5-star", label: "quality rating impact" },
    ],
    features: ["HEDIS measure automation", "Star rating optimization", "Automated quality reporting"],
  },
  {
    name: "Payers & Insurance",
    icon: "💰",
    accentHsl: "35 50% 60%",
    tagline: "Early detection is cheaper than late treatment. Always.",
    description: "For payers, every missed screening is a future catastrophic claim. Medient enables population-level guideline deployment on a per-member-per-month basis — turning prevention from aspiration into infrastructure.",
    stats: [
      { value: "$100K+", label: "saved per prevented case" },
      { value: "38%", label: "screening rate uplift" },
      { value: "PMPM", label: "pricing model" },
    ],
    features: ["Per-member-per-month pricing", "Population risk stratification", "Claims reduction analytics"],
  },
  {
    name: "Clinical AI Products",
    icon: "🤖",
    accentHsl: "270 50% 60%",
    tagline: "Clinical reasoning without the liability.",
    description: "Frontier labs, medical scribes, and AI wrappers need clinical decision logic but can't afford the liability of probabilistic inference. Medient provides a verified clinical logic layer through an MCP API — zero hallucination, zero latency.",
    stats: [
      { value: "0ms", label: "inference latency" },
      { value: "0%", label: "hallucination rate" },
      { value: "API", label: "MCP-native integration" },
    ],
    features: ["MCP API access", "Deterministic outputs", "Liability-safe clinical logic"],
  },
  {
    name: "Guideline Societies",
    icon: "📖",
    accentHsl: "160 82% 61%",
    tagline: "Your guidelines, actually followed.",
    description: "Medical societies spend years developing evidence-based guidelines that languish as PDFs. Medient compiles your narrative guidelines into verified, deployable decision artifacts — turning authorship into infrastructure.",
    stats: [
      { value: "~100%", label: "adherence rate" },
      { value: "10x", label: "faster adoption" },
      { value: "Full", label: "provenance tracing" },
    ],
    features: ["Narrative-to-logic compilation", "Source fidelity verification", "Deployment analytics"],
  },
];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeSegment, setActiveSegment] = useState(0);

  const seg = segments[activeSegment];

  return (
    <section ref={ref} className="relative py-16 md:py-24 texture-angular">
      {/* Dynamic accent glow based on active segment */}
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 70% 30%, hsl(${seg.accentHsl} / 0.03), transparent 60%)`,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-8">
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70 mb-3">Markets</div>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em] max-w-3xl">
            One artifact. <span className="text-gray-500">Six markets.</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-light mt-4 max-w-2xl leading-relaxed">
            A single compiled clinical decision artifact serves every stakeholder — from the bedside to the boardroom to the legislature.
          </p>
        </motion.div>

        {/* Segment tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {segments.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveSegment(i)}
              className={`font-mono text-sm tracking-wide px-4 py-2.5 border transition-all duration-400 panel-3d ${
                activeSegment === i
                  ? "border-current bg-current/10"
                  : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
              }`}
              style={activeSegment === i ? { color: `hsl(${s.accentHsl})`, borderColor: `hsl(${s.accentHsl} / 0.3)`, backgroundColor: `hsl(${s.accentHsl} / 0.08)` } : undefined}
            >
              <span className="mr-2">{s.icon}</span>
              {s.name}
            </button>
          ))}
        </motion.div>

        {/* Active segment detail */}
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-white/[0.06] overflow-hidden panel-3d"
          style={{ borderColor: `hsl(${seg.accentHsl} / 0.15)` }}
        >
          {/* Header bar */}
          <div
            className="px-6 md:px-10 py-5 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg, hsl(${seg.accentHsl} / 0.08), transparent 60%)` }}
          >
            <span className="text-2xl">{seg.icon}</span>
            <div>
              <h3 className="font-mono text-xl md:text-2xl font-light" style={{ color: `hsl(${seg.accentHsl})` }}>{seg.name}</h3>
              <p className="text-gray-300 text-base md:text-lg mt-0.5">{seg.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: description + features */}
            <div className="px-6 md:px-10 py-6 md:py-8 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
              <p className="text-gray-300 text-base md:text-lg leading-[1.8] mb-5">{seg.description}</p>
              <div className="space-y-3">
                {seg.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: `hsl(${seg.accentHsl})` }} />
                    <span className="text-white text-base">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stats grid */}
            <div className="grid grid-cols-1 divide-y divide-white/[0.06]">
              {seg.stats.map((stat, si) => (
                <div key={si} className="px-6 md:px-10 py-5 md:py-6 flex items-center justify-between">
                  <span className="text-gray-300 text-base">{stat.label}</span>
                  <span
                    className="font-mono text-2xl md:text-3xl font-light"
                    style={{ color: `hsl(${seg.accentHsl})` }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SegmentsSection;

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Building2, Shield, FileText, Coins, Bot, BookOpen } from "lucide-react";

const segments = [
  {
    name: "Health Systems", Icon: Building2, accentHsl: "160 82% 61%",
    tagline: "Deploy once. Cover your whole population.",
    stats: [{ value: "45%", label: "↓ missed screenings" }, { value: "$0", label: "marginal cost/encounter" }, { value: "<30s", label: "to recommendation" }],
    features: ["FHIR-native EHR integration", "Multi-facility deployment", "Real-time eligibility flagging"],
  },
  {
    name: "Government", Icon: Shield, accentHsl: "210 70% 55%",
    tagline: "The prevention mandate is funded. The tools aren't built.",
    stats: [{ value: "$2.1B", label: "RHTP funding" }, { value: "100%", label: "audit traceability" }, { value: "200+", label: "deployable CHCs" }],
    features: ["Complete audit trail", "Classified-grade security", "Population-scale deployment"],
  },
  {
    name: "Medicare / Medicaid", Icon: FileText, accentHsl: "270 50% 60%",
    tagline: "Artifacts mapped directly to CMS quality measures.",
    stats: [{ value: "100%", label: "CMS alignment" }, { value: "80%", label: "↓ manual abstraction" }, { value: "5-star", label: "quality impact" }],
    features: ["HEDIS measure automation", "Star rating optimization", "Automated quality reporting"],
  },
  {
    name: "Payers & Insurance", Icon: Coins, accentHsl: "35 50% 60%",
    tagline: "Early detection is cheaper than late treatment. Always.",
    stats: [{ value: "$100K+", label: "saved per case" }, { value: "38%", label: "screening uplift" }, { value: "PMPM", label: "pricing model" }],
    features: ["Per-member-per-month pricing", "Population risk stratification", "Claims reduction analytics"],
  },
  {
    name: "Clinical AI", Icon: Bot, accentHsl: "340 60% 60%",
    tagline: "Clinical reasoning without the liability.",
    stats: [{ value: "0ms", label: "inference latency" }, { value: "0%", label: "hallucination rate" }, { value: "API", label: "MCP-native" }],
    features: ["MCP API access", "Deterministic outputs", "Liability-safe clinical logic"],
  },
  {
    name: "Guideline Societies", Icon: BookOpen, accentHsl: "160 82% 61%",
    tagline: "Your guidelines, actually followed.",
    stats: [{ value: "~100%", label: "adherence rate" }, { value: "10x", label: "faster adoption" }, { value: "Full", label: "provenance tracing" }],
    features: ["Narrative-to-logic compilation", "Source fidelity verification", "Deployment analytics"],
  },
];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeSegment, setActiveSegment] = useState(0);
  const seg = segments[activeSegment]!;

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-angular">
      <div className="absolute inset-0 transition-all duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 70% 30%, hsl(${seg.accentHsl} / 0.03), transparent 60%)` }} />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-6">
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70 mb-3">Markets</div>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em] max-w-3xl">
            One artifact. <span className="text-gray-500">Six markets.</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-1.5 mb-6">
          {segments.map((s, i) => {
            const SIcon = s.Icon;
            return (
              <button key={s.name} onClick={() => setActiveSegment(i)}
                className={`font-mono text-sm tracking-wide px-4 py-2.5 border transition-all duration-400 panel-3d flex items-center gap-2 ${
                  activeSegment === i ? "border-current bg-current/10" : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
                }`}
                style={activeSegment === i ? { color: `hsl(${s.accentHsl})`, borderColor: `hsl(${s.accentHsl} / 0.3)`, backgroundColor: `hsl(${s.accentHsl} / 0.08)` } : undefined}>
                <SIcon size={16} />{s.name}
              </button>
            );
          })}
        </motion.div>

        <motion.div key={activeSegment} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-white/[0.06] overflow-hidden panel-3d"
          style={{ borderColor: `hsl(${seg.accentHsl} / 0.15)` }}>

          {/* Header with large icon */}
          <div className="px-6 md:px-8 py-6 flex items-center gap-6"
            style={{ background: `linear-gradient(135deg, hsl(${seg.accentHsl} / 0.08), transparent 60%)` }}>
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border rounded-lg shrink-0"
              style={{ borderColor: `hsl(${seg.accentHsl} / 0.3)`, backgroundColor: `hsl(${seg.accentHsl} / 0.06)` }}>
              <seg.Icon size={36} style={{ color: `hsl(${seg.accentHsl})` }} />
            </div>
            <div>
              <h3 className="font-mono text-2xl md:text-3xl font-light" style={{ color: `hsl(${seg.accentHsl})` }}>{seg.name}</h3>
              <p className="text-gray-300 text-lg mt-1">{seg.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Features — compact */}
            <div className="lg:col-span-2 px-6 md:px-8 py-5 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
              <div className="space-y-3">
                {seg.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-3">
                    <div className="w-2 h-2 rotate-45" style={{ backgroundColor: `hsl(${seg.accentHsl})` }} />
                    <span className="text-white text-base font-light">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Stats — large and visual */}
            <div className="lg:col-span-3 grid grid-cols-3 divide-x divide-white/[0.06]">
              {seg.stats.map((stat, si) => (
                <div key={si} className="px-4 md:px-6 py-6 md:py-8 text-center">
                  <div className="font-mono text-3xl md:text-4xl font-light" style={{ color: `hsl(${seg.accentHsl})` }}>{stat.value}</div>
                  <div className="text-gray-500 text-sm mt-2">{stat.label}</div>
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

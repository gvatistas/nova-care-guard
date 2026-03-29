import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* ── 3D Isometric Icon Components ── */
const HealthSystemsIcon = ({ color, size = 48 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Isometric building base */}
    <path d="M24 38L8 29V15L24 24V38Z" fill={color} opacity="0.15" />
    <path d="M24 38L40 29V15L24 24V38Z" fill={color} opacity="0.25" />
    <path d="M8 15L24 6L40 15L24 24L8 15Z" fill={color} opacity="0.1" />
    {/* Edges */}
    <path d="M24 38L8 29V15L24 24V38Z" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M24 38L40 29V15L24 24V38Z" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M8 15L24 6L40 15L24 24L8 15Z" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    {/* Cross on front face */}
    <line x1="24" y1="28" x2="24" y2="35" stroke={color} strokeWidth="1.5" opacity="0.8" />
    <line x1="21" y1="31.5" x2="27" y2="31.5" stroke={color} strokeWidth="1.5" opacity="0.8" />
    {/* Inner windows grid */}
    <rect x="28" y="19" width="3" height="3" fill={color} opacity="0.3" transform="skewY(-26)" />
    <rect x="33" y="19" width="3" height="3" fill={color} opacity="0.2" transform="skewY(-26)" />
    <rect x="28" y="24" width="3" height="3" fill={color} opacity="0.2" transform="skewY(-26)" />
    {/* Glow dot */}
    <circle cx="24" cy="6" r="2" fill={color} opacity="0.5" />
  </svg>
);

const GovernmentIcon = ({ color, size = 48 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Shield shape — 3D extruded */}
    <path d="M24 6L38 12V24C38 32 32 38 24 42C16 38 10 32 10 24V12L24 6Z" fill={color} opacity="0.1" />
    <path d="M24 6L38 12V24C38 32 32 38 24 42C16 38 10 32 10 24V12L24 6Z" stroke={color} strokeWidth="1.2" opacity="0.6" />
    {/* Inner shield */}
    <path d="M24 11L34 15V24C34 30 29 35 24 38C19 35 14 30 14 24V15L24 11Z" fill={color} opacity="0.08" />
    <path d="M24 11L34 15V24C34 30 29 35 24 38C19 35 14 30 14 24V15L24 11Z" stroke={color} strokeWidth="0.6" opacity="0.4" />
    {/* Check mark */}
    <polyline points="18,24 22,28 30,18" stroke={color} strokeWidth="2" fill="none" opacity="0.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Corner accents */}
    <circle cx="24" cy="6" r="1.5" fill={color} opacity="0.4" />
    <circle cx="10" cy="12" r="1" fill={color} opacity="0.2" />
    <circle cx="38" cy="12" r="1" fill={color} opacity="0.2" />
  </svg>
);

const MedicareIcon = ({ color, size = 48 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 3D document stack */}
    <path d="M12 10H32L36 14V38H12V10Z" fill={color} opacity="0.1" />
    <path d="M12 10H32L36 14V38H12V10Z" stroke={color} strokeWidth="1" opacity="0.5" />
    {/* Folded corner */}
    <path d="M32 10V14H36L32 10Z" fill={color} opacity="0.25" />
    <path d="M32 10V14H36" stroke={color} strokeWidth="0.8" opacity="0.5" />
    {/* Back document shadow */}
    <path d="M14 8H34L37 11V36" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2" />
    {/* Text lines */}
    <line x1="17" y1="20" x2="31" y2="20" stroke={color} strokeWidth="1" opacity="0.5" />
    <line x1="17" y1="24" x2="28" y2="24" stroke={color} strokeWidth="1" opacity="0.35" />
    <line x1="17" y1="28" x2="30" y2="28" stroke={color} strokeWidth="1" opacity="0.35" />
    {/* Star badge */}
    <circle cx="28" cy="33" r="4" fill={color} opacity="0.15" stroke={color} strokeWidth="0.8" />
    <text x="28" y="35" textAnchor="middle" fontSize="6" fill={color} opacity="0.7" fontFamily="monospace">★</text>
  </svg>
);

const PayersIcon = ({ color, size = 48 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Isometric coin stack */}
    {[0, 4, 8].map((offset, i) => (
      <g key={i}>
        <ellipse cx="24" cy={30 - offset} rx="14" ry="5" fill={color} opacity={0.06 + i * 0.04} />
        <ellipse cx="24" cy={30 - offset} rx="14" ry="5" stroke={color} strokeWidth="0.8" fill="none" opacity={0.3 + i * 0.1} />
        {i < 2 && (
          <>
            <line x1="10" y1={30 - offset} x2="10" y2={30 - offset - 4} stroke={color} strokeWidth="0.6" opacity="0.2" />
            <line x1="38" y1={30 - offset} x2="38" y2={30 - offset - 4} stroke={color} strokeWidth="0.6" opacity="0.2" />
          </>
        )}
      </g>
    ))}
    {/* Dollar sign on top */}
    <text x="24" y="24" textAnchor="middle" fontSize="10" fill={color} opacity="0.7" fontFamily="monospace" fontWeight="300">$</text>
    {/* Arrow up */}
    <path d="M36 16L40 12L44 16" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
    <line x1="40" y1="12" x2="40" y2="20" stroke={color} strokeWidth="1" opacity="0.4" />
  </svg>
);

const ClinicalAIIcon = ({ color, size = 48 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Neural network nodes */}
    {/* Layer 1 */}
    {[14, 24, 34].map((y, i) => (
      <circle key={`l1-${i}`} cx="10" cy={y} r="3" fill={color} opacity={0.15} stroke={color} strokeWidth="0.8" />
    ))}
    {/* Layer 2 */}
    {[17, 27, 37].map((y, i) => (
      <circle key={`l2-${i}`} cx="24" cy={y - 3} r="3.5" fill={color} opacity={0.2} stroke={color} strokeWidth="0.8" />
    ))}
    {/* Layer 3 */}
    <circle cx="38" cy="24" r="4" fill={color} opacity={0.25} stroke={color} strokeWidth="1" />
    {/* Connections */}
    {[14, 24, 34].map((y1) =>
      [14, 24, 34].map((y2, j) => (
        <line key={`c1-${y1}-${j}`} x1="13" y1={y1} x2="21" y2={y2} stroke={color} strokeWidth="0.4" opacity="0.2" />
      ))
    )}
    {[14, 24, 34].map((y, i) => (
      <line key={`c2-${i}`} x1="27" y1={y} x2="35" y2="24" stroke={color} strokeWidth="0.5" opacity="0.3" />
    ))}
    {/* Pulse on output */}
    <circle cx="38" cy="24" r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3">
      <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Brain outline hint */}
    <path d="M38 20C40 18 42 20 42 22C43 24 42 26 40 27C41 28 40 30 38 28" stroke={color} strokeWidth="0.5" opacity="0.25" fill="none" />
  </svg>
);

const GuidelineIcon = ({ color, size = 48 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Open book — 3D perspective */}
    <path d="M24 12V40" stroke={color} strokeWidth="1" opacity="0.5" />
    {/* Left page */}
    <path d="M24 12C20 10 14 9 8 10V38C14 37 20 38 24 40" fill={color} opacity="0.08" />
    <path d="M24 12C20 10 14 9 8 10V38C14 37 20 38 24 40" stroke={color} strokeWidth="0.8" opacity="0.5" />
    {/* Right page */}
    <path d="M24 12C28 10 34 9 40 10V38C34 37 28 38 24 40" fill={color} opacity="0.12" />
    <path d="M24 12C28 10 34 9 40 10V38C34 37 28 38 24 40" stroke={color} strokeWidth="0.8" opacity="0.5" />
    {/* Text lines left */}
    <line x1="12" y1="18" x2="21" y2="19" stroke={color} strokeWidth="0.6" opacity="0.3" />
    <line x1="12" y1="22" x2="20" y2="23" stroke={color} strokeWidth="0.6" opacity="0.25" />
    <line x1="12" y1="26" x2="21" y2="27" stroke={color} strokeWidth="0.6" opacity="0.3" />
    <line x1="12" y1="30" x2="19" y2="31" stroke={color} strokeWidth="0.6" opacity="0.2" />
    {/* Text lines right */}
    <line x1="27" y1="19" x2="36" y2="18" stroke={color} strokeWidth="0.6" opacity="0.3" />
    <line x1="27" y1="23" x2="35" y2="22" stroke={color} strokeWidth="0.6" opacity="0.25" />
    <line x1="27" y1="27" x2="36" y2="26" stroke={color} strokeWidth="0.6" opacity="0.3" />
    {/* Glow on spine */}
    <line x1="24" y1="10" x2="24" y2="8" stroke={color} strokeWidth="1.5" opacity="0.4" />
    <circle cx="24" cy="8" r="1.5" fill={color} opacity="0.3" />
  </svg>
);

const iconComponents = [HealthSystemsIcon, GovernmentIcon, MedicareIcon, PayersIcon, ClinicalAIIcon, GuidelineIcon];

const segments = [
  {
    name: "Health Systems", accentHsl: "160 82% 61%",
    tagline: "Deploy once. Cover your whole population.",
    stats: [{ value: "45%", label: "↓ missed screenings" }, { value: "$0", label: "marginal cost/encounter" }, { value: "<30s", label: "to recommendation" }],
    features: ["FHIR-native EHR integration", "Multi-facility deployment", "Real-time eligibility flagging"],
  },
  {
    name: "Government", accentHsl: "210 70% 55%",
    tagline: "The prevention mandate is funded. The tools aren't built.",
    stats: [{ value: "$2.1B", label: "RHTP funding" }, { value: "100%", label: "audit traceability" }, { value: "200+", label: "deployable CHCs" }],
    features: ["Complete audit trail", "Classified-grade security", "Population-scale deployment"],
  },
  {
    name: "Medicare / Medicaid", accentHsl: "270 50% 60%",
    tagline: "Artifacts mapped directly to CMS quality measures.",
    stats: [{ value: "100%", label: "CMS alignment" }, { value: "80%", label: "↓ manual abstraction" }, { value: "5-star", label: "quality impact" }],
    features: ["HEDIS measure automation", "Star rating optimization", "Automated quality reporting"],
  },
  {
    name: "Payers & Insurance", accentHsl: "35 50% 60%",
    tagline: "Early detection is cheaper than late treatment. Always.",
    stats: [{ value: "$100K+", label: "saved per case" }, { value: "38%", label: "screening uplift" }, { value: "PMPM", label: "pricing model" }],
    features: ["Per-member-per-month pricing", "Population risk stratification", "Claims reduction analytics"],
  },
  {
    name: "Clinical AI", accentHsl: "340 60% 60%",
    tagline: "Clinical reasoning without the liability.",
    stats: [{ value: "0ms", label: "inference latency" }, { value: "0%", label: "hallucination rate" }, { value: "API", label: "MCP-native" }],
    features: ["MCP API access", "Deterministic outputs", "Liability-safe clinical logic"],
  },
  {
    name: "Guideline Societies", accentHsl: "160 82% 61%",
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
  const ActiveIcon = iconComponents[activeSegment]!;

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-angular">
      <div className="absolute inset-0 transition-all duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 70% 30%, hsl(${seg.accentHsl} / 0.03), transparent 60%)` }} />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-6">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em] max-w-3xl">
            One artifact. <span className="text-gray-500">Six markets.</span>
          </h2>
        </motion.div>

        {/* Segment tabs — card-style with 3D icons */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          {segments.map((s, i) => {
            const TabIcon = iconComponents[i]!;
            const isActive = activeSegment === i;
            const accentColor = `hsl(${s.accentHsl})`;
            return (
              <button key={s.name} onClick={() => setActiveSegment(i)}
                className="relative text-left p-3 md:p-4 border transition-all duration-400 panel-3d group overflow-hidden"
                style={{
                  borderColor: isActive ? `hsl(${s.accentHsl} / 0.4)` : "rgba(255,255,255,0.06)",
                  background: isActive
                    ? `linear-gradient(145deg, hsl(${s.accentHsl} / 0.12), hsl(${s.accentHsl} / 0.03))`
                    : "rgba(255,255,255,0.01)",
                  boxShadow: isActive ? `0 4px 24px hsl(${s.accentHsl} / 0.1), inset 0 1px 0 hsl(${s.accentHsl} / 0.1)` : "none",
                }}>
                {/* Background glow on active */}
                {isActive && (
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, hsl(${s.accentHsl} / 0.15), transparent 70%)` }} />
                )}
                <div className="relative">
                  <TabIcon color={isActive ? accentColor : "#666"} size={40} />
                  <div className={`font-mono text-xs md:text-sm tracking-wide mt-2 transition-colors duration-300 ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                  }`}>
                    {s.name}
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Active segment detail card */}
        <motion.div key={activeSegment} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-white/[0.06] overflow-hidden panel-3d"
          style={{ borderColor: `hsl(${seg.accentHsl} / 0.15)` }}>

          {/* Header */}
          <div className="px-6 md:px-8 py-6 flex items-center gap-6"
            style={{ background: `linear-gradient(135deg, hsl(${seg.accentHsl} / 0.08), transparent 60%)` }}>
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border rounded-lg shrink-0 relative"
              style={{
                borderColor: `hsl(${seg.accentHsl} / 0.3)`,
                backgroundColor: `hsl(${seg.accentHsl} / 0.06)`,
                boxShadow: `0 0 20px hsl(${seg.accentHsl} / 0.08), inset 0 0 12px hsl(${seg.accentHsl} / 0.04)`,
              }}>
              <ActiveIcon color={`hsl(${seg.accentHsl})`} size={52} />
            </div>
            <div>
              <h3 className="font-mono text-2xl md:text-3xl font-light" style={{ color: `hsl(${seg.accentHsl})` }}>{seg.name}</h3>
              <p className="text-gray-300 text-lg mt-1">{seg.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5">
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

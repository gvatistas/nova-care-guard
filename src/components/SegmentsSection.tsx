import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* ── Rich 3D Icon Components with multi-color gradients ── */
const HealthSystemsIcon = ({ color, size = 48, hsl }: { color: string; size?: number; hsl: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="hs-face1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="hs-face2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="hs-top" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={color} stopOpacity="0.45" />
        <stop offset="100%" stopColor={color} stopOpacity="0.15" />
      </linearGradient>
      <filter id="hs-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Building — isometric 3D with proper shading */}
    <path d="M32 50L10 38V18L32 30V50Z" fill="url(#hs-face2)" />
    <path d="M32 50L54 38V18L32 30V50Z" fill="url(#hs-face1)" />
    <path d="M10 18L32 6L54 18L32 30L10 18Z" fill="url(#hs-top)" />
    {/* Edges */}
    <path d="M32 50L10 38V18L32 30V50Z" stroke={color} strokeWidth="0.8" fill="none" opacity="0.7" />
    <path d="M32 50L54 38V18L32 30V50Z" stroke={color} strokeWidth="0.8" fill="none" opacity="0.7" />
    <path d="M10 18L32 6L54 18L32 30L10 18Z" stroke={color} strokeWidth="0.8" fill="none" opacity="0.7" />
    {/* Glowing cross on front */}
    <line x1="32" y1="35" x2="32" y2="46" stroke={color} strokeWidth="2.5" opacity="0.9" filter="url(#hs-glow)" />
    <line x1="27" y1="40.5" x2="37" y2="40.5" stroke={color} strokeWidth="2.5" opacity="0.9" filter="url(#hs-glow)" />
    {/* Windows — right face */}
    {[0, 6, 12].map((dy, i) => (
      <rect key={i} x={37} y={22 + dy} width="4" height="3" rx="0.5" fill={color} opacity={0.4 - i * 0.08} transform="skewY(-26)" />
    ))}
    {/* Accent corners */}
    <circle cx="32" cy="6" r="2.5" fill={color} opacity="0.6" filter="url(#hs-glow)" />
    <circle cx="10" cy="18" r="1.5" fill={color} opacity="0.25" />
    <circle cx="54" cy="18" r="1.5" fill={color} opacity="0.25" />
    {/* Ambient glow */}
    <ellipse cx="32" cy="52" rx="18" ry="3" fill={color} opacity="0.06" />
  </svg>
);

const GovernmentIcon = ({ color, size = 48, hsl }: { color: string; size?: number; hsl: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="gov-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="gov-inner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
      </linearGradient>
      <filter id="gov-glow">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Outer shield with gradient fill */}
    <path d="M32 6L52 14V30C52 42 43 51 32 56C21 51 12 42 12 30V14L32 6Z" fill="url(#gov-fill)" />
    <path d="M32 6L52 14V30C52 42 43 51 32 56C21 51 12 42 12 30V14L32 6Z" stroke={color} strokeWidth="1.2" opacity="0.7" />
    {/* Inner shield layer */}
    <path d="M32 12L46 18V30C46 39 39 46 32 50C25 46 18 39 18 30V18L32 12Z" fill="url(#gov-inner)" />
    <path d="M32 12L46 18V30C46 39 39 46 32 50C25 46 18 39 18 30V18L32 12Z" stroke={color} strokeWidth="0.6" opacity="0.35" />
    {/* Glowing checkmark */}
    <polyline points="24,30 29,36 40,22" stroke={color} strokeWidth="3" fill="none" opacity="0.9"
      strokeLinecap="round" strokeLinejoin="round" filter="url(#gov-glow)" />
    {/* Accent dots along shield edge */}
    {[0, 1, 2, 3, 4].map((i) => {
      const angle = (-0.8 + i * 0.4);
      const r = 23;
      return <circle key={i} cx={32 + Math.sin(angle) * r} cy={28 - Math.cos(angle) * r + 4}
        r="1" fill={color} opacity={0.2 + i * 0.05} />;
    })}
    {/* Ground glow */}
    <ellipse cx="32" cy="58" rx="16" ry="2.5" fill={color} opacity="0.06" />
  </svg>
);

const MedicareIcon = ({ color, size = 48, hsl }: { color: string; size?: number; hsl: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="med-doc" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0.04" />
      </linearGradient>
      <linearGradient id="med-fold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.45" />
        <stop offset="100%" stopColor={color} stopOpacity="0.15" />
      </linearGradient>
      <filter id="med-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Back document shadow */}
    <rect x="18" y="8" width="30" height="40" rx="2" fill={color} opacity="0.04" stroke={color} strokeWidth="0.4" />
    {/* Main document */}
    <path d="M14 12H40L48 20V52H14V12Z" fill="url(#med-doc)" />
    <path d="M14 12H40L48 20V52H14V12Z" stroke={color} strokeWidth="1" opacity="0.6" />
    {/* Folded corner with gradient */}
    <path d="M40 12V20H48L40 12Z" fill="url(#med-fold)" />
    <path d="M40 12V20H48" stroke={color} strokeWidth="0.8" opacity="0.5" />
    {/* Content lines with varying opacity */}
    <line x1="20" y1="27" x2="38" y2="27" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <line x1="20" y1="32" x2="34" y2="32" stroke={color} strokeWidth="1" opacity="0.35" />
    <line x1="20" y1="37" x2="36" y2="37" stroke={color} strokeWidth="1" opacity="0.3" />
    <line x1="20" y1="42" x2="30" y2="42" stroke={color} strokeWidth="1" opacity="0.2" />
    {/* Star seal — glowing */}
    <circle cx="38" cy="44" r="5" fill={color} opacity="0.15" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <text x="38" y="46.5" textAnchor="middle" fontSize="7" fill={color} opacity="0.8" fontFamily="monospace" filter="url(#med-glow)">★</text>
    {/* Ground shadow */}
    <ellipse cx="31" cy="55" rx="15" ry="2" fill={color} opacity="0.05" />
  </svg>
);

const PayersIcon = ({ color, size = 48, hsl }: { color: string; size?: number; hsl: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="pay-coin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0.08" />
      </linearGradient>
      <filter id="pay-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Stacked coins with depth */}
    {[0, 6, 12].map((offset, i) => (
      <g key={i}>
        {/* Coin side */}
        {i < 2 && (
          <path d={`M12,${40 - offset} L12,${34 - offset} A20,7 0 0,0 52,${34 - offset} L52,${40 - offset}`}
            fill={color} opacity={0.05 + i * 0.03} />
        )}
        {/* Coin face */}
        <ellipse cx="32" cy={34 - offset} rx="20" ry="7" fill="url(#pay-coin)" opacity={0.6 + i * 0.15} />
        <ellipse cx="32" cy={34 - offset} rx="20" ry="7" stroke={color} strokeWidth={0.6 + i * 0.2} fill="none" opacity={0.4 + i * 0.15} />
        {/* Inner ring on top coin */}
        {i === 2 && (
          <ellipse cx="32" cy={34 - offset} rx="14" ry="5" stroke={color} strokeWidth="0.4" fill="none" opacity="0.25" />
        )}
      </g>
    ))}
    {/* Dollar sign — glowing */}
    <text x="32" y="26" textAnchor="middle" fontSize="14" fill={color} opacity="0.85" fontFamily="monospace" fontWeight="300" filter="url(#pay-glow)">$</text>
    {/* Rising arrow */}
    <path d="M48 18L52 12L56 18" stroke={color} strokeWidth="1.5" opacity="0.5" fill="none" strokeLinecap="round" />
    <line x1="52" y1="12" x2="52" y2="24" stroke={color} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    {/* Sparkle dots */}
    <circle cx="48" cy="10" r="1" fill={color} opacity="0.3" />
    <circle cx="56" cy="14" r="0.8" fill={color} opacity="0.2" />
    {/* Ground shadow */}
    <ellipse cx="32" cy="44" rx="18" ry="3" fill={color} opacity="0.06" />
  </svg>
);

const ClinicalAIIcon = ({ color, size = 48, hsl }: { color: string; size?: number; hsl: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="ai-node" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0.1" />
      </linearGradient>
      <filter id="ai-glow">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Connection lines first (behind nodes) */}
    {[16, 32, 48].map((y1) =>
      [20, 32, 44].map((y2, j) => (
        <line key={`c1-${y1}-${j}`} x1="14" y1={y1} x2="28" y2={y2}
          stroke={color} strokeWidth="0.5" opacity="0.15" />
      ))
    )}
    {[20, 32, 44].map((y, i) => (
      <line key={`c2-${i}`} x1="36" y1={y} x2="50" y2="32"
        stroke={color} strokeWidth="0.6" opacity="0.25" />
    ))}
    {/* Layer 1 nodes */}
    {[16, 32, 48].map((y, i) => (
      <g key={`l1-${i}`}>
        <circle cx="12" cy={y} r="5" fill="url(#ai-node)" stroke={color} strokeWidth="0.8" opacity="0.7" />
        <circle cx="12" cy={y} r="2" fill={color} opacity="0.5" />
      </g>
    ))}
    {/* Layer 2 nodes */}
    {[20, 32, 44].map((y, i) => (
      <g key={`l2-${i}`}>
        <circle cx="32" cy={y} r="5.5" fill="url(#ai-node)" stroke={color} strokeWidth="0.8" opacity="0.8" />
        <circle cx="32" cy={y} r="2.5" fill={color} opacity="0.6" />
      </g>
    ))}
    {/* Output node — largest, glowing */}
    <circle cx="52" cy="32" r="7" fill="url(#ai-node)" stroke={color} strokeWidth="1.2" opacity="0.9" />
    <circle cx="52" cy="32" r="3.5" fill={color} opacity="0.7" filter="url(#ai-glow)" />
    {/* Pulse rings */}
    <circle cx="52" cy="32" r="10" fill="none" stroke={color} strokeWidth="0.6" opacity="0.2">
      <animate attributeName="r" values="10;16;10" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.2;0.02;0.2" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="52" cy="32" r="14" fill="none" stroke={color} strokeWidth="0.3" opacity="0.1">
      <animate attributeName="r" values="14;20;14" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.1;0.01;0.1" dur="3s" repeatCount="indefinite" />
    </circle>
    {/* Data flow particles */}
    {[0, 1, 2].map((i) => (
      <circle key={`p${i}`} r="1.5" fill={color} opacity="0.5">
        <animate attributeName="cx" values={`12;32;52`} dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
        <animate attributeName="cy" values={`${16 + i * 16};${20 + i * 12};32`} dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
        <animate attributeName="opacity" values="0;0.6;0" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
      </circle>
    ))}
  </svg>
);

const GuidelineIcon = ({ color, size = 48, hsl }: { color: string; size?: number; hsl: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="guide-left" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0.04" />
      </linearGradient>
      <linearGradient id="guide-right" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0.06" />
      </linearGradient>
      <filter id="guide-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Spine */}
    <line x1="32" y1="12" x2="32" y2="52" stroke={color} strokeWidth="1.5" opacity="0.5" />
    {/* Left page with gradient */}
    <path d="M32 14C26 12 18 11 8 12V50C18 49 26 50 32 52" fill="url(#guide-left)" />
    <path d="M32 14C26 12 18 11 8 12V50C18 49 26 50 32 52" stroke={color} strokeWidth="0.8" opacity="0.5" />
    {/* Right page with gradient */}
    <path d="M32 14C38 12 46 11 56 12V50C46 49 38 50 32 52" fill="url(#guide-right)" />
    <path d="M32 14C38 12 46 11 56 12V50C46 49 38 50 32 52" stroke={color} strokeWidth="0.8" opacity="0.5" />
    {/* Text lines — left page */}
    {[22, 27, 32, 37, 42].map((y, i) => (
      <line key={`l${i}`} x1={14} y1={y} x2={28 - i} y2={y + 1} stroke={color} strokeWidth="0.8" opacity={0.4 - i * 0.05} />
    ))}
    {/* Text lines — right page */}
    {[22, 27, 32, 37, 42].map((y, i) => (
      <line key={`r${i}`} x1={36 + i} y1={y + 1} x2={50} y2={y} stroke={color} strokeWidth="0.8" opacity={0.4 - i * 0.05} />
    ))}
    {/* Glowing spine beacon */}
    <circle cx="32" cy="10" r="3" fill={color} opacity="0.5" filter="url(#guide-glow)" />
    <circle cx="32" cy="10" r="5" fill="none" stroke={color} strokeWidth="0.4" opacity="0.2">
      <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Ground shadow */}
    <ellipse cx="32" cy="54" rx="20" ry="2.5" fill={color} opacity="0.05" />
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
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
            One artifact. <span className="text-gray-500">Six markets.</span>
          </h2>
        </motion.div>

        {/* Segment tabs — rich 3D cards */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          {segments.map((s, i) => {
            const TabIcon = iconComponents[i]!;
            const isActive = activeSegment === i;
            const accentColor = `hsl(${s.accentHsl})`;
            return (
              <button key={s.name} onClick={() => setActiveSegment(i)}
                className="relative text-left p-4 md:p-5 border transition-all duration-400 group overflow-hidden"
                style={{
                  borderColor: isActive ? `hsl(${s.accentHsl} / 0.4)` : "rgba(255,255,255,0.06)",
                  background: isActive
                    ? `linear-gradient(145deg, hsl(${s.accentHsl} / 0.14), hsl(${s.accentHsl} / 0.03), rgba(0,0,0,0.3))`
                    : "linear-gradient(145deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2))",
                  boxShadow: isActive
                    ? `0 8px 32px hsl(${s.accentHsl} / 0.12), inset 0 1px 0 hsl(${s.accentHsl} / 0.15), 0 1px 0 hsl(${s.accentHsl} / 0.1)`
                    : "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.2)",
                }}>
                {/* Multi-layer glow on active */}
                {isActive && (
                  <>
                    <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
                      style={{ background: `radial-gradient(circle, hsl(${s.accentHsl} / 0.2), transparent 65%)` }} />
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full pointer-events-none"
                      style={{ background: `radial-gradient(circle, hsl(${s.accentHsl} / 0.08), transparent 70%)` }} />
                  </>
                )}
                <div className="relative flex flex-col items-center text-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                    <TabIcon color={isActive ? accentColor : "#555"} size={isActive ? 64 : 56} hsl={s.accentHsl} />
                  </div>
                  <div className={`font-mono text-xs md:text-sm tracking-wide transition-colors duration-300 ${
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
          className="border border-white/[0.06] overflow-hidden"
          style={{
            borderColor: `hsl(${seg.accentHsl} / 0.15)`,
            boxShadow: `0 4px 24px hsl(${seg.accentHsl} / 0.05)`,
          }}>

          {/* Header */}
          <div className="px-6 md:px-8 py-6 flex items-center gap-6"
            style={{ background: `linear-gradient(135deg, hsl(${seg.accentHsl} / 0.1), hsl(${seg.accentHsl} / 0.02) 50%, transparent)` }}>
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border rounded-lg shrink-0 relative"
              style={{
                borderColor: `hsl(${seg.accentHsl} / 0.3)`,
                background: `linear-gradient(145deg, hsl(${seg.accentHsl} / 0.1), hsl(${seg.accentHsl} / 0.02))`,
                boxShadow: `0 0 24px hsl(${seg.accentHsl} / 0.1), inset 0 0 16px hsl(${seg.accentHsl} / 0.05)`,
              }}>
              <ActiveIcon color={`hsl(${seg.accentHsl})`} size={60} hsl={seg.accentHsl} />
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

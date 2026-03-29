import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* ─── Segment data ─── */
const segments = [
  {
    name: "Federally Qualified Health Centers",
    abbr: "FQHCs",
    stat: "1,400+ eligible facilities",
    desc: "Deploy verified clinical decision artifacts across the FQHC network — the largest safety-net infrastructure in the U.S.",
  },
  {
    name: "Rural Health Clinics",
    abbr: "RHCs",
    stat: "4,700+ eligible facilities",
    desc: "Air-gapped, low-bandwidth deployment for clinics operating in connectivity-constrained environments.",
  },
  {
    name: "Tribal Health Programs",
    abbr: "IHS / Tribal",
    stat: "574 federally recognized tribes",
    desc: "Culturally-aligned clinical intelligence for Indian Health Service and tribal health organizations.",
  },
  {
    name: "Community Health Centers",
    abbr: "CHCs",
    stat: "31M+ patients served annually",
    desc: "Network-wide screening adherence across multi-site community health organizations.",
  },
];

/* ─── Angular SVG Icons ─── */

const FQHCIcon = ({ active }: { active: boolean }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="fqhc-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2dd4bf" stopOpacity={active ? 0.35 : 0.12} />
        <stop offset="100%" stopColor="#0d9488" stopOpacity={active ? 0.15 : 0.04} />
      </linearGradient>
      <linearGradient id="fqhc-r" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2dd4bf" stopOpacity={active ? 0.5 : 0.18} />
        <stop offset="100%" stopColor="#0d9488" stopOpacity={active ? 0.2 : 0.06} />
      </linearGradient>
    </defs>
    {/* Shield base */}
    <path d="M32 6L52 16V34C52 44 43 52 32 58C21 52 12 44 12 34V16L32 6Z" fill="url(#fqhc-l)" />
    <path d="M32 6L52 16V34C52 44 43 52 32 58C21 52 12 44 12 34V16L32 6Z" stroke="#2dd4bf" strokeWidth={active ? 1.2 : 0.6} opacity={active ? 0.8 : 0.3} />
    {/* Faceted inner triangles */}
    <path d="M32 6L42 12L32 20Z" fill="#2dd4bf" opacity={active ? 0.2 : 0.06} />
    <path d="M32 6L22 12L32 20Z" fill="#0d9488" opacity={active ? 0.15 : 0.04} />
    <path d="M32 20L42 12L52 16L48 28Z" fill="#2dd4bf" opacity={active ? 0.12 : 0.04} />
    <path d="M32 20L22 12L12 16L16 28Z" fill="#0d9488" opacity={active ? 0.08 : 0.03} />
    {/* Building silhouette inside */}
    <rect x="26" y="28" width="12" height="18" fill="#2dd4bf" opacity={active ? 0.15 : 0.06} />
    <rect x="26" y="28" width="12" height="18" stroke="#2dd4bf" strokeWidth="0.5" opacity={active ? 0.4 : 0.15} fill="none" />
    <line x1="32" y1="28" x2="32" y2="46" stroke="#2dd4bf" strokeWidth="0.4" opacity={active ? 0.3 : 0.1} />
    <line x1="26" y1="36" x2="38" y2="36" stroke="#2dd4bf" strokeWidth="0.4" opacity={active ? 0.3 : 0.1} />
    {/* Cross on building */}
    <line x1="32" y1="31" x2="32" y2="41" stroke="#2dd4bf" strokeWidth="1.5" opacity={active ? 0.7 : 0.25} />
    <line x1="28" y1="36" x2="36" y2="36" stroke="#2dd4bf" strokeWidth="1.5" opacity={active ? 0.7 : 0.25} />
  </svg>
);

const RuralIcon = ({ active }: { active: boolean }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rural-pin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2dd4bf" stopOpacity={active ? 0.45 : 0.15} />
        <stop offset="100%" stopColor="#0d9488" stopOpacity={active ? 0.1 : 0.03} />
      </linearGradient>
    </defs>
    {/* Terrain lines */}
    {[44, 48, 52, 56].map((y, i) => (
      <path key={i}
        d={`M${6 + i * 2},${y} L${18 - i},${y - 3 + i} L${28 + i * 2},${y + 1} L${40 - i},${y - 2} L${50 + i},${y + 2} L${58 - i * 2},${y}`}
        stroke="#2dd4bf" strokeWidth="0.5" opacity={active ? 0.2 - i * 0.03 : 0.06} fill="none" />
    ))}
    {/* Pin — angular diamond shape */}
    <path d="M32 8L42 22L32 50L22 22Z" fill="url(#rural-pin)" />
    <path d="M32 8L42 22L32 50L22 22Z" stroke="#2dd4bf" strokeWidth={active ? 1 : 0.5} opacity={active ? 0.7 : 0.25} fill="none" />
    {/* Faceted left/right */}
    <path d="M32 8L22 22L32 28Z" fill="#0d9488" opacity={active ? 0.15 : 0.05} />
    <path d="M32 8L42 22L32 28Z" fill="#2dd4bf" opacity={active ? 0.25 : 0.08} />
    {/* Inner diamond */}
    <path d="M32 16L37 22L32 30L27 22Z" stroke="#2dd4bf" strokeWidth="0.6" opacity={active ? 0.5 : 0.15} fill="none" />
    {/* Center dot */}
    <circle cx="32" cy="22" r="3" fill="#2dd4bf" opacity={active ? 0.6 : 0.2} />
    <circle cx="32" cy="22" r="1.5" fill="#2dd4bf" opacity={active ? 0.9 : 0.3} />
  </svg>
);

const TribalIcon = ({ active }: { active: boolean }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    {/* Outer circle */}
    <circle cx="32" cy="32" r="24" stroke="#2dd4bf" strokeWidth={active ? 1 : 0.5} opacity={active ? 0.5 : 0.15} fill="none" />
    <circle cx="32" cy="32" r="24" fill="#2dd4bf" opacity={active ? 0.04 : 0.01} />
    {/* Inner circle */}
    <circle cx="32" cy="32" r="14" stroke="#2dd4bf" strokeWidth={active ? 0.8 : 0.4} opacity={active ? 0.4 : 0.12} fill="none" />
    {/* Cross lines (medicine wheel) */}
    <line x1="32" y1="8" x2="32" y2="56" stroke="#2dd4bf" strokeWidth={active ? 0.8 : 0.4} opacity={active ? 0.35 : 0.1} />
    <line x1="8" y1="32" x2="56" y2="32" stroke="#2dd4bf" strokeWidth={active ? 0.8 : 0.4} opacity={active ? 0.35 : 0.1} />
    {/* Faceted quadrants */}
    <path d="M32 8L32 32L56 32A24 24 0 0 0 32 8Z" fill="#2dd4bf" opacity={active ? 0.12 : 0.03} />
    <path d="M32 56L32 32L8 32A24 24 0 0 0 32 56Z" fill="#2dd4bf" opacity={active ? 0.12 : 0.03} />
    <path d="M8 32L32 32L32 8A24 24 0 0 0 8 32Z" fill="#0d9488" opacity={active ? 0.08 : 0.02} />
    <path d="M56 32L32 32L32 56A24 24 0 0 0 56 32Z" fill="#0d9488" opacity={active ? 0.08 : 0.02} />
    {/* Cardinal diamonds */}
    {[
      [32, 10], [32, 54], [10, 32], [54, 32],
    ].map(([cx, cy], i) => (
      <rect key={i} x={(cx ?? 0) - 3} y={(cy ?? 0) - 3} width="6" height="6"
        transform={`rotate(45 ${cx} ${cy})`}
        fill="#2dd4bf" opacity={active ? 0.5 : 0.15} />
    ))}
    {/* Center */}
    <circle cx="32" cy="32" r="4" fill="#2dd4bf" opacity={active ? 0.5 : 0.15} />
    <circle cx="32" cy="32" r="2" fill="#2dd4bf" opacity={active ? 0.8 : 0.25} />
  </svg>
);

const CommunityIcon = ({ active }: { active: boolean }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    {/* Connection lines */}
    {[
      [16, 16, 48, 16], [48, 16, 48, 48], [48, 48, 16, 48], [16, 48, 16, 16],
      [16, 16, 48, 48], [48, 16, 16, 48],
      [32, 8, 16, 16], [32, 8, 48, 16],
      [32, 56, 16, 48], [32, 56, 48, 48],
      [32, 32, 16, 16], [32, 32, 48, 16], [32, 32, 16, 48], [32, 32, 48, 48],
    ].map(([x1, y1, x2, y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#2dd4bf" strokeWidth="0.4" opacity={active ? 0.2 : 0.06} />
    ))}
    {/* Corner nodes — angular diamonds */}
    {[
      [16, 16], [48, 16], [48, 48], [16, 48],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <rect x={(cx ?? 0) - 6} y={(cy ?? 0) - 6} width="12" height="12"
          transform={`rotate(45 ${cx} ${cy})`}
          fill="#2dd4bf" opacity={active ? 0.12 : 0.04}
          stroke="#2dd4bf" strokeWidth={active ? 0.8 : 0.4} />
        <circle cx={cx} cy={cy} r="2.5" fill="#2dd4bf" opacity={active ? 0.6 : 0.2} />
      </g>
    ))}
    {/* Top and bottom nodes */}
    {[[32, 8], [32, 56]].map(([cx, cy], i) => (
      <g key={`tb-${i}`}>
        <rect x={(cx ?? 0) - 4} y={(cy ?? 0) - 4} width="8" height="8"
          transform={`rotate(45 ${cx} ${cy})`}
          fill="#0d9488" opacity={active ? 0.15 : 0.05}
          stroke="#2dd4bf" strokeWidth={active ? 0.6 : 0.3} />
        <circle cx={cx} cy={cy} r="2" fill="#2dd4bf" opacity={active ? 0.5 : 0.15} />
      </g>
    ))}
    {/* Center hub */}
    <rect x="25" y="25" width="14" height="14" transform="rotate(45 32 32)"
      fill="#2dd4bf" opacity={active ? 0.15 : 0.05}
      stroke="#2dd4bf" strokeWidth={active ? 1 : 0.5} />
    <circle cx="32" cy="32" r="4" fill="#2dd4bf" opacity={active ? 0.5 : 0.15} />
    <circle cx="32" cy="32" r="2" fill="#2dd4bf" opacity={active ? 0.8 : 0.3} />
    {/* Pulse on center when active */}
    {active && (
      <circle cx="32" cy="32" r="8" fill="none" stroke="#2dd4bf" strokeWidth="0.5" opacity="0.3">
        <animate attributeName="r" values="8;16;8" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.02;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
    )}
  </svg>
);

const ICONS = [FQHCIcon, RuralIcon, TribalIcon, CommunityIcon];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-angular">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(45,212,191,0.03),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-8">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
            Deployment targets. <span className="text-gray-500">Select sector.</span>
          </h2>
          <p className="text-gray-400 text-lg font-light mt-3 max-w-2xl">
            One compiled artifact. Multiple deployment surfaces across the U.S. safety-net healthcare infrastructure.
          </p>
        </motion.div>

        {/* 2x2 tactical grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {segments.map((seg, i) => {
            const Icon = ICONS[i]!;
            const isHovered = hovered === i;
            return (
              <motion.div
                key={seg.abbr}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="relative group cursor-default"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(45,212,191,0.1)",
                  transition: "all 300ms ease",
                  boxShadow: isHovered ? "0 0 30px rgba(45,212,191,0.08), inset 0 0 20px rgba(45,212,191,0.03)" : "none",
                  borderColor: isHovered ? "rgba(45,212,191,0.35)" : "rgba(45,212,191,0.1)",
                }}
              >
                <div className="p-6 md:p-8 flex items-start gap-5">
                  {/* Icon with 3D tilt on hover */}
                  <div
                    className="shrink-0 mt-1"
                    style={{
                      transition: "transform 300ms ease",
                      transform: isHovered
                        ? "perspective(800px) rotateY(5deg) rotateX(-2deg)"
                        : "perspective(800px) rotateY(0deg) rotateX(0deg)",
                    }}
                  >
                    <Icon active={isHovered} />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <h3
                        className="font-mono text-base md:text-lg font-light tracking-wide"
                        style={{
                          color: isHovered ? "#2dd4bf" : "rgba(255,255,255,0.85)",
                          transition: "color 300ms ease",
                        }}
                      >
                        {seg.name}
                      </h3>
                      <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase"
                        style={{ color: "rgba(255,255,255,0.25)" }}>
                        {seg.abbr}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{seg.desc}</p>

                    {/* Stat readout — revealed on hover */}
                    <div
                      className="font-mono text-[0.65rem] tracking-[0.1em] flex items-center gap-2"
                      style={{
                        color: "rgba(45,212,191,0.6)",
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "translateY(0)" : "translateY(4px)",
                        transition: "all 300ms ease",
                      }}
                    >
                      <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                      {seg.stat}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SegmentsSection;

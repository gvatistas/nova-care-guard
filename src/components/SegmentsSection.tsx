import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const segments = [
  { name: "Federally Qualified Health Centers", abbr: "FQHCs", stat: "1,400+ eligible facilities", desc: "Deploy verified clinical decision artifacts across the FQHC network — the largest safety-net infrastructure in North America.", value: "Cut screening gaps by 60% in the most underserved communities." },
  { name: "Rural Health Clinics", abbr: "RHCs", stat: "4,700+ eligible facilities", desc: "Air-gapped, low-bandwidth deployment for clinics operating in connectivity-constrained environments.", value: "Zero-latency clinical guidance — no internet required." },
  { name: "Tribal Health Programs", abbr: "IHS / Tribal", stat: "574 federally recognized tribes", desc: "Culturally-aligned clinical intelligence for Indian Health Service and tribal health organizations.", value: "Sovereign health data. Deterministic, auditable decisions." },
  { name: "Community Health Centers", abbr: "CHCs", stat: "31M+ patients served annually", desc: "Network-wide screening adherence across multi-site community health organizations.", value: "One compiled artifact scales across entire networks." },
];

const FQHCIcon = ({ active }: { active: boolean }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <path d="M32 6L52 16V34C52 44 43 52 32 58C21 52 12 44 12 34V16L32 6Z" stroke="white" strokeWidth={active ? 1.2 : 0.6} opacity={active ? 0.5 : 0.2} fill={active ? "rgba(255,255,255,0.04)" : "none"} />
    <path d="M32 6L42 12L32 20Z" fill="white" opacity={active ? 0.12 : 0.04} />
    <path d="M32 6L22 12L32 20Z" fill="white" opacity={active ? 0.08 : 0.03} />
    <rect x="26" y="28" width="12" height="18" stroke="white" strokeWidth="0.5" opacity={active ? 0.3 : 0.1} fill="none" />
    <line x1="32" y1="31" x2="32" y2="41" stroke="white" strokeWidth="1.5" opacity={active ? 0.5 : 0.2} />
    <line x1="28" y1="36" x2="36" y2="36" stroke="white" strokeWidth="1.5" opacity={active ? 0.5 : 0.2} />
  </svg>
);

const RuralIcon = ({ active }: { active: boolean }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    {[44, 48, 52, 56].map((y, i) => (
      <path key={i} d={`M${6 + i * 2},${y} L${18 - i},${y - 3 + i} L${28 + i * 2},${y + 1} L${40 - i},${y - 2} L${50 + i},${y + 2} L${58 - i * 2},${y}`}
        stroke="white" strokeWidth="0.5" opacity={active ? 0.15 - i * 0.03 : 0.05} fill="none" />
    ))}
    <path d="M32 8L42 22L32 50L22 22Z" stroke="white" strokeWidth={active ? 1 : 0.5} opacity={active ? 0.5 : 0.2} fill={active ? "rgba(255,255,255,0.04)" : "none"} />
    <circle cx="32" cy="22" r="3" fill="white" opacity={active ? 0.4 : 0.15} />
  </svg>
);

const TribalIcon = ({ active }: { active: boolean }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="24" stroke="white" strokeWidth={active ? 1 : 0.5} opacity={active ? 0.35 : 0.12} fill="none" />
    <circle cx="32" cy="32" r="14" stroke="white" strokeWidth={active ? 0.8 : 0.4} opacity={active ? 0.25 : 0.08} fill="none" />
    <line x1="32" y1="8" x2="32" y2="56" stroke="white" strokeWidth={active ? 0.8 : 0.4} opacity={active ? 0.25 : 0.08} />
    <line x1="8" y1="32" x2="56" y2="32" stroke="white" strokeWidth={active ? 0.8 : 0.4} opacity={active ? 0.25 : 0.08} />
    <circle cx="32" cy="32" r="4" fill="white" opacity={active ? 0.4 : 0.12} />
  </svg>
);

const CommunityIcon = ({ active }: { active: boolean }) => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    {[[16,16,48,16],[48,16,48,48],[48,48,16,48],[16,48,16,16],[16,16,48,48],[48,16,16,48]].map(([x1,y1,x2,y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.4" opacity={active ? 0.15 : 0.05} />
    ))}
    {[[16,16],[48,16],[48,48],[16,48]].map(([cx, cy], i) => (
      <g key={i}>
        <rect x={(cx ?? 0) - 6} y={(cy ?? 0) - 6} width="12" height="12"
          transform={`rotate(45 ${cx} ${cy})`}
          fill="white" opacity={active ? 0.06 : 0.02}
          stroke="white" strokeWidth={active ? 0.8 : 0.4} />
        <circle cx={cx} cy={cy} r="2.5" fill="white" opacity={active ? 0.4 : 0.15} />
      </g>
    ))}
    <circle cx="32" cy="32" r="4" fill="white" opacity={active ? 0.4 : 0.12} />
  </svg>
);

const ICONS = [FQHCIcon, RuralIcon, TribalIcon, CommunityIcon];

const SegmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-24 md:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-10">
          <h2 className="text-white font-mono font-light leading-[1.15] tracking-[-0.02em]" style={{ fontSize: "2.5rem" }}>
            Deployment targets. <span style={{ color: "rgba(255,255,255,0.45)" }}>Select sector.</span>
          </h2>
          <p className="font-light mt-3 max-w-2xl" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>
            One compiled artifact. Multiple deployment surfaces across the North American safety-net healthcare infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments.map((seg, i) => {
            const Icon = ICONS[i]!;
            const isHovered = hovered === i;
            return (
              <motion.div
                key={seg.abbr}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative group cursor-default"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                  border: "1px solid",
                  borderColor: isHovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  transition: "all 300ms ease",
                  boxShadow: isHovered
                    ? "0 0 40px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.06)"
                    : "none",
                }}
              >
                <div className="p-6 md:p-8 flex items-start gap-5">
                  <div className="shrink-0 mt-1"
                    style={{
                      transition: "transform 300ms ease",
                      transform: isHovered ? "perspective(800px) rotateY(5deg) rotateX(-2deg)" : "perspective(800px) rotateY(0deg) rotateX(0deg)",
                    }}>
                    <Icon active={isHovered} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <h3 className="font-mono font-light tracking-wide text-white"
                        style={{ transition: "color 300ms ease", fontSize: "1.125rem" }}>
                        {seg.name}
                      </h3>
                      <span className="font-mono tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.875rem" }}>
                        {seg.abbr}
                      </span>
                    </div>

                    <p className="leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.6 }}>{seg.desc}</p>

                    {/* Value proposition */}
                    <p className="font-mono mb-3" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", letterSpacing: "0.02em" }}>
                      → {seg.value}
                    </p>

                    <div className="font-mono tracking-[0.1em] flex items-center gap-2"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "translateY(0)" : "translateY(4px)",
                        transition: "all 300ms ease",
                        fontSize: "0.875rem",
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#10b981" }} />
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

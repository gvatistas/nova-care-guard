import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";

const GREEN = "#22C55E";
const RED = "#FF5555";

// Seeded random for consistent clinic positions
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const networks = [
  { name: "Montérégie", pop: "1.6M", adherenceBefore: 31, adherenceAfter: 72, cx: 52, cy: 74 },
  { name: "Capitale-Nationale", pop: "740K", adherenceBefore: 28, adherenceAfter: 66, cx: 60, cy: 35 },
  { name: "Laval", pop: "440K", adherenceBefore: 22, adherenceAfter: 74, cx: 48, cy: 60 },
  { name: "Centre-Sud", pop: "1.1M", adherenceBefore: 25, adherenceAfter: 72, cx: 53, cy: 64 },
  { name: "Laurentides", pop: "620K", adherenceBefore: 33, adherenceAfter: 68, cx: 42, cy: 48 },
];

// Generate 20 clinic positions around each network hub
function generateClinics(hub: { cx: number; cy: number }, seed: number) {
  const rand = seededRandom(seed);
  return Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2 + rand() * 0.5;
    const dist = 3 + rand() * 7;
    return {
      x: hub.cx + Math.cos(angle) * dist,
      y: hub.cy + Math.sin(angle) * dist,
      delay: rand() * 4,
    };
  });
}

const ProjectBetaSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredNetwork, setHoveredNetwork] = useState<number | null>(null);
  const [activated, setActivated] = useState(false);

  const allClinics = useMemo(() => networks.map((n, i) => generateClinics(n, (i + 1) * 1337)), []);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setActivated(true), 2200);
    return () => clearTimeout(timer);
  }, [inView]);

  return (
    <section id="project-alpha" ref={ref} className="relative py-14 md:py-20 texture-crosshatch">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,237,196,0.03)_0%,transparent_50%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
              Project Alpha
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="flex items-end">
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              Five health networks. <span className="text-white font-normal">4.5 million patients.</span> Population-level screening adherence, transformed.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Map — high-tech network visualization */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
            className="relative border border-white/[0.06] bg-black/40 aspect-[4/5] overflow-hidden">

            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
              }}
            />

            <svg viewBox="0 0 100 100" className="w-full h-full relative z-0" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="hubGlow">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="greenGlow">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feFlood floodColor={GREEN} floodOpacity="0.6" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={GREEN} stopOpacity="0" />
                  <stop offset="50%" stopColor={GREEN} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Hex grid background */}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="white" strokeWidth="0.08" opacity="0.05" />
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="white" strokeWidth="0.08" opacity="0.05" />
              ))}

              {/* Province outline */}
              <path d="M30,10 L45,8 L55,5 L68,8 L75,12 L80,20 L82,30 L78,38 L72,42 L70,50 L68,55 L65,58 L62,62 L60,65 L58,68 L55,72 L52,75 L48,78 L44,80 L40,82 L36,80 L33,76 L30,72 L28,68 L26,62 L25,55 L24,48 L23,42 L22,35 L24,28 L26,22 L28,16 Z"
                fill="none" stroke="white" strokeWidth="0.3" opacity="0.08" strokeDasharray="1 1" />

              {/* Clinic nodes + connections per network */}
              {networks.map((network, ni) => {
                const clinics = allClinics[ni];
                const isHovered = hoveredNetwork === ni;
                return (
                  <g key={ni}>
                    {/* Connection lines from hub to each clinic */}
                    {clinics.map((clinic, ci) => (
                      <g key={`conn-${ni}-${ci}`}>
                        <line
                          x1={network.cx} y1={network.cy}
                          x2={clinic.x} y2={clinic.y}
                          stroke="white" strokeWidth="0.08"
                          opacity={isHovered ? 0.15 : 0.04}
                          className="transition-opacity duration-500"
                        />
                        {/* Green pulse traveling along the line when activated */}
                        {activated && (
                          <circle r="0.4" fill={GREEN} opacity="0">
                            <animateMotion
                              path={`M${network.cx},${network.cy} L${clinic.x},${clinic.y}`}
                              dur={`${1.5 + clinic.delay * 0.5}s`}
                              begin={`${clinic.delay}s`}
                              repeatCount="indefinite"
                            />
                            <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${1.5 + clinic.delay * 0.5}s`} begin={`${clinic.delay}s`} repeatCount="indefinite" />
                          </circle>
                        )}
                      </g>
                    ))}

                    {/* Clinic dots */}
                    {clinics.map((clinic, ci) => (
                      <circle key={`clinic-${ni}-${ci}`}
                        cx={clinic.x} cy={clinic.y}
                        r={isHovered ? 0.5 : 0.35}
                        fill={activated ? GREEN : "white"}
                        opacity={activated ? 0.4 : 0.12}
                        className="transition-all duration-700"
                      >
                        {activated && (
                          <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${2 + clinic.delay * 0.3}s`} begin={`${clinic.delay}s`} repeatCount="indefinite" />
                        )}
                      </circle>
                    ))}
                  </g>
                );
              })}

              {/* Inter-network backbone connections */}
              {networks.map((n, i) => networks.slice(i + 1).map((m, j) => (
                <line key={`backbone-${i}-${j}`} x1={n.cx} y1={n.cy} x2={m.cx} y2={m.cy}
                  stroke="white" strokeWidth="0.15" opacity="0.08" strokeDasharray="0.5 0.5" />
              )))}

              {/* Network hub nodes */}
              {networks.map((n, i) => {
                const isHovered = hoveredNetwork === i;
                return (
                  <g key={`hub-${i}`}
                    onMouseEnter={() => setHoveredNetwork(i)}
                    onMouseLeave={() => setHoveredNetwork(null)}
                    className="cursor-pointer"
                  >
                    {/* Outer pulse ring */}
                    <circle cx={n.cx} cy={n.cy} r="2" fill="none"
                      stroke={activated ? GREEN : "white"} strokeWidth="0.15" opacity="0.2">
                      <animate attributeName="r" values="2;5;2" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                      <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                    </circle>

                    {/* Second pulse ring */}
                    {activated && (
                      <circle cx={n.cx} cy={n.cy} r="2" fill="none"
                        stroke={GREEN} strokeWidth="0.1" opacity="0.15">
                        <animate attributeName="r" values="2;7;2" dur="4s" repeatCount="indefinite" begin={`${i * 0.6 + 1}s`} />
                        <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite" begin={`${i * 0.6 + 1}s`} />
                      </circle>
                    )}

                    {/* Hub dot */}
                    <circle cx={n.cx} cy={n.cy} r={isHovered ? 2.2 : 1.5}
                      fill={activated ? GREEN : (isHovered ? "white" : RED)}
                      opacity={activated ? 0.9 : 0.8}
                      filter={isHovered || activated ? "url(#hubGlow)" : undefined}
                      className="transition-all duration-500"
                    />

                    {/* Hub inner ring */}
                    <circle cx={n.cx} cy={n.cy} r={isHovered ? 3 : 2.2}
                      fill="none" stroke={activated ? GREEN : "white"}
                      strokeWidth="0.12" opacity={isHovered ? 0.4 : 0.15}
                      className="transition-all duration-300"
                    />

                    {/* Hover tooltip */}
                    {isHovered && (
                      <g>
                        <rect x={n.cx + 4} y={n.cy - 7} width={24} height={12} rx="0.5"
                          fill="hsl(0,0%,4%)" stroke="white" strokeWidth="0.12" opacity="0.95" />
                        <text x={n.cx + 6} y={n.cy - 3} fill="white" fontSize="2.2" fontFamily="monospace" opacity="0.9">
                          {n.name}
                        </text>
                        <text x={n.cx + 6} y={n.cy + 1} fill={activated ? GREEN : "white"} fontSize="2" fontFamily="monospace" opacity="0.7">
                          {n.pop} · {activated ? `${n.adherenceAfter}%` : `${n.adherenceBefore}%`}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom status bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${activated ? "bg-green-500" : "bg-red-400"}`}>
                  {activated && (
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                  )}
                </div>
                <span className="font-mono text-[10px] text-gray-500">
                  {activated ? "100 clinics · active" : "5 networks · baseline"}
                </span>
              </div>
              <span className={`font-mono text-[10px] ${activated ? "text-green-500/70" : "text-red-400/50"}`}>
                {activated ? "LIVE" : "PRE-DEPLOYMENT"}
              </span>
            </div>
          </motion.div>

          {/* Right: adherence bars */}
          <div>
            {/* Toggle */}
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActivated(false)}
                className={`font-mono text-xs tracking-[0.1em] uppercase px-4 py-2 border transition-all duration-400 ${
                  !activated ? "text-red-400 border-red-400/30 bg-red-400/[0.06]" : "text-gray-500 border-transparent"
                }`}>
                Before
              </button>
              <button onClick={() => setActivated(true)}
                className={`font-mono text-xs tracking-[0.1em] uppercase px-4 py-2 border transition-all duration-400 ${
                  activated ? "text-white border-white/20 bg-white/[0.04]" : "text-gray-500 border-transparent"
                }`}>
                After Medient
              </button>
            </div>

            {/* Network adherence rows */}
            <div className="space-y-3">
              {networks.map((network, i) => {
                const value = activated ? network.adherenceAfter : network.adherenceBefore;
                const barColor = activated ? GREEN : RED;
                return (
                  <motion.div key={network.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`p-4 border border-white/[0.04] transition-all duration-300 ${
                      hoveredNetwork === i ? "bg-white/[0.03] border-white/[0.1]" : ""
                    }`}
                    onMouseEnter={() => setHoveredNetwork(i)}
                    onMouseLeave={() => setHoveredNetwork(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-white/80">{network.name} · {network.pop}</span>
                      <span className="font-mono text-lg font-light" style={{ color: barColor }}>
                        {value}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${value}%` } : {}}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full transition-all duration-700"
                        style={{ backgroundColor: barColor, opacity: activated ? 0.85 : 0.5 }}
                      />
                    </div>
                    {activated && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mt-1.5 font-mono text-xs text-white/40">
                        +{network.adherenceAfter - network.adherenceBefore}% screening adherence
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Summary stats */}
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1 }}
              className="mt-4 grid grid-cols-3 gap-px bg-white/[0.06]">
              {[
                { num: "4.5M", label: "Patients" },
                { num: activated ? "+42%" : "28%", label: activated ? "Adherence Δ" : "Baseline" },
                { num: "100", label: "Clinics" },
              ].map((stat, i) => (
                <div key={i} className="bg-background/80 p-4">
                  <div className="font-mono text-2xl md:text-3xl font-light transition-colors duration-500"
                    style={{ color: activated ? GREEN : RED }}>
                    {stat.num}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectBetaSection;

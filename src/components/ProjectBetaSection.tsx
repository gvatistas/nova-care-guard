import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const networks = [
  { name: "Network A — Montérégie", pop: "1.6M", adherenceBefore: 31, adherenceAfter: 72, cx: 52, cy: 72 },
  { name: "Network B — Capitale-Nationale", pop: "740K", adherenceBefore: 28, adherenceAfter: 66, cx: 58, cy: 42 },
  { name: "Network C — Laval", pop: "440K", adherenceBefore: 22, adherenceAfter: 74, cx: 50, cy: 62 },
  { name: "Network D — Centre-Sud", pop: "1.1M", adherenceBefore: 25, adherenceAfter: 72, cx: 51, cy: 66 },
  { name: "Network E — Laurentides", pop: "620K", adherenceBefore: 33, adherenceAfter: 68, cx: 46, cy: 55 },
];

const TEAL = "hsl(160, 82%, 61%)";
const RED = "#FF5555";

const ProjectBetaSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredNetwork, setHoveredNetwork] = useState<number | null>(null);
  const [activated, setActivated] = useState(false);

  // Auto-activate after scroll-in to show red→remedied transition
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setActivated(true), 2000);
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
          {/* Map */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
            className="relative border border-white/[0.06] bg-white/[0.01] aspect-[4/5] overflow-hidden texture-diamonds">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="mapGlow">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Subtle grid */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 10 + 10} y1="0" x2={i * 10 + 10} y2="100" stroke="white" strokeWidth="0.1" opacity="0.04" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 10 + 10} x2="100" y2={i * 10 + 10} stroke="white" strokeWidth="0.1" opacity="0.04" />
              ))}

              {/* Province outline */}
              <path d="M30,10 L45,8 L55,5 L68,8 L75,12 L80,20 L82,30 L78,38 L72,42 L70,50 L68,55 L65,58 L62,62 L60,65 L58,68 L55,72 L52,75 L48,78 L44,80 L40,82 L36,80 L33,76 L30,72 L28,68 L26,62 L25,55 L24,48 L23,42 L22,35 L24,28 L26,22 L28,16 Z"
                fill="none" stroke="white" strokeWidth="0.2" opacity="0.15" />

              {/* Connection lines */}
              {networks.map((n, i) => networks.slice(i + 1).map((m, j) => (
                <line key={`${i}-${j}`} x1={n.cx} y1={n.cy} x2={m.cx} y2={m.cy}
                  stroke="white" strokeWidth="0.12" opacity="0.06" />
              )))}

              {/* Network nodes — red before activation, white after */}
              {networks.map((n, i) => {
                const isHovered = hoveredNetwork === i;
                const dotColor = activated ? "white" : RED;
                return (
                  <g key={i} onMouseEnter={() => setHoveredNetwork(i)} onMouseLeave={() => setHoveredNetwork(null)} className="cursor-pointer">
                    {/* Pulse ring */}
                    <circle cx={n.cx} cy={n.cy} r="3" fill="none" stroke={dotColor} strokeWidth="0.2" opacity="0.3">
                      <animate attributeName="r" values="3;6;3" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                      <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                    </circle>

                    {/* Core dot */}
                    <circle cx={n.cx} cy={n.cy} r={isHovered ? 2 : 1.3} fill={dotColor}
                      opacity={isHovered ? 1 : 0.8} filter={isHovered ? "url(#mapGlow)" : undefined}>
                      <animate attributeName="fill" values={activated ? `${RED};white` : RED} dur="0.8s" fill="freeze" />
                    </circle>

                    {/* Hover label */}
                    {isHovered && (
                      <g>
                        <rect x={n.cx + 3} y={n.cy - 5} width={22} height={9} rx="0.5"
                          fill="hsl(0,0%,4%)" stroke="white" strokeWidth="0.15" opacity="0.95" />
                        <text x={n.cx + 5} y={n.cy} fill="white" fontSize="2.5" fontFamily="monospace" opacity="0.9">
                          {n.pop}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom status */}
            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
              <span className="font-mono text-xs text-gray-500">{activated ? "5 networks — active" : "5 networks — baseline"}</span>
              <span className={`font-mono text-xs ${activated ? "text-white/60" : "text-red-400/60"}`}>
                {activated ? "DEPLOYED" : "PRE-DEPLOYMENT"}
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
                const barColor = activated ? "white" : RED;
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
                      <span className="font-mono text-sm text-white/80">{network.pop} patients</span>
                      <span className="font-mono text-lg font-light" style={{ color: barColor }}>
                        {value}%
                      </span>
                    </div>
                    {/* Adherence bar */}
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${value}%` } : {}}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full transition-all duration-700"
                        style={{ backgroundColor: barColor, opacity: activated ? 0.8 : 0.5 }}
                      />
                    </div>
                    {/* Delta indicator when activated */}
                    {activated && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1.5 font-mono text-xs text-white/40"
                      >
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
                { num: "5", label: "Networks" },
              ].map((stat, i) => (
                <div key={i} className="bg-background/80 p-4">
                  <div className="font-mono text-2xl md:text-3xl font-light transition-colors duration-500"
                    style={{ color: activated ? "white" : RED }}>
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

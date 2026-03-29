import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const networks = [
  { name: "Réseau Santé Montérégie", pop: "1.6M", metric: "+41%", cx: 52, cy: 72 },
  { name: "CIUSSS de la Capitale-Nationale", pop: "740K", metric: "+38%", cx: 58, cy: 42 },
  { name: "CISSS de Laval", pop: "440K", metric: "+52%", cx: 50, cy: 62 },
  { name: "CIUSSS du Centre-Sud", pop: "1.1M", metric: "+47%", cx: 51, cy: 66 },
  { name: "CISSS des Laurentides", pop: "620K", metric: "+35%", cx: 46, cy: 55 },
];

const ProjectBetaSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredNetwork, setHoveredNetwork] = useState<number | null>(null);

  return (
    <section id="project-beta" ref={ref} className="relative py-20 md:py-28">
      <div className="absolute top-0 left-6 md:left-8 right-6 md:right-8 h-px bg-white/[0.06]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,237,196,0.03)_0%,transparent_50%)]" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 mb-10">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-accent/60 animate-pulse" />
              <span className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70">Case Study — Classified</span>
            </div>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">Project Beta</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="lg:col-span-5 flex items-end">
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              Five health networks across the province of Quebec. <span className="text-white font-normal">4.5 million patients.</span> The largest deployment of compiled clinical decision artifacts in North America.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quebec Map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="relative border border-white/[0.06] bg-white/[0.01] aspect-[4/5] overflow-hidden"
          >
            {/* Map label */}
            <div className="absolute top-4 left-5 z-10 font-mono text-xs tracking-[0.2em] uppercase text-gray-500">Province de Québec</div>

            {/* SVG Quebec outline */}
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Simplified Quebec province shape */}
              <path
                d="M30,10 L45,8 L55,5 L68,8 L75,12 L80,20 L82,30 L78,38 L72,42 L70,50 L68,55 L65,58 L62,62 L60,65 L58,68 L55,72 L52,75 L48,78 L44,80 L40,82 L36,80 L33,76 L30,72 L28,68 L26,62 L25,55 L24,48 L23,42 L22,35 L24,28 L26,22 L28,16 Z"
                fill="none"
                stroke="hsl(160, 82%, 61%)"
                strokeWidth="0.3"
                opacity="0.3"
              />
              <path
                d="M30,10 L45,8 L55,5 L68,8 L75,12 L80,20 L82,30 L78,38 L72,42 L70,50 L68,55 L65,58 L62,62 L60,65 L58,68 L55,72 L52,75 L48,78 L44,80 L40,82 L36,80 L33,76 L30,72 L28,68 L26,62 L25,55 L24,48 L23,42 L22,35 L24,28 L26,22 L28,16 Z"
                fill="hsl(160, 82%, 61%)"
                opacity="0.03"
              />

              {/* Grid lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 10 + 10} y1="0" x2={i * 10 + 10} y2="100" stroke="white" strokeWidth="0.1" opacity="0.05" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 10 + 10} x2="100" y2={i * 10 + 10} stroke="white" strokeWidth="0.1" opacity="0.05" />
              ))}

              {/* Network nodes */}
              {networks.map((n, i) => {
                const isHovered = hoveredNetwork === i;
                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredNetwork(i)}
                    onMouseLeave={() => setHoveredNetwork(null)}
                    className="cursor-pointer"
                  >
                    {/* Pulse ring */}
                    <circle
                      cx={n.cx}
                      cy={n.cy}
                      r={isHovered ? 4 : 2.5}
                      fill="none"
                      stroke="hsl(160, 82%, 61%)"
                      strokeWidth="0.3"
                      opacity={isHovered ? 0.8 : 0.4}
                      className="transition-all duration-300"
                    >
                      <animate attributeName="r" values={isHovered ? "4;6;4" : "2.5;3.5;2.5"} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values={isHovered ? "0.8;0.2;0.8" : "0.4;0.1;0.4"} dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Core dot */}
                    <circle
                      cx={n.cx}
                      cy={n.cy}
                      r={isHovered ? 2 : 1.2}
                      fill="hsl(160, 82%, 61%)"
                      opacity={isHovered ? 1 : 0.7}
                      className="transition-all duration-300"
                    />
                    {/* Label */}
                    {isHovered && (
                      <g>
                        <rect
                          x={n.cx + 3}
                          y={n.cy - 5}
                          width={28}
                          height={10}
                          rx="0.5"
                          fill="hsl(0, 0%, 5%)"
                          stroke="hsl(160, 82%, 61%)"
                          strokeWidth="0.2"
                          opacity="0.95"
                        />
                        <text x={n.cx + 5} y={n.cy - 0.5} fill="hsl(160, 82%, 61%)" fontSize="2.5" fontFamily="monospace">
                          {n.pop} · {n.metric}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Connection lines between nodes */}
              {networks.map((n, i) =>
                networks.slice(i + 1).map((m, j) => (
                  <line
                    key={`${i}-${j}`}
                    x1={n.cx}
                    y1={n.cy}
                    x2={m.cx}
                    y2={m.cy}
                    stroke="hsl(160, 82%, 61%)"
                    strokeWidth="0.15"
                    opacity="0.1"
                  />
                ))
              )}
            </svg>

            {/* Bottom legend */}
            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs text-gray-500">5 active networks</span>
              </div>
              <span className="font-mono text-xs text-accent/60">4.5M patients</span>
            </div>
          </motion.div>

          {/* Network list + stats */}
          <div>
            <div className="border-t border-white/[0.06]">
              {networks.map((network, i) => (
                <motion.div
                  key={network.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.12 }}
                  className={`py-5 px-4 border-b border-white/[0.06] transition-all duration-300 cursor-default ${
                    hoveredNetwork === i ? "bg-accent/[0.04]" : "hover:bg-white/[0.015]"
                  }`}
                  onMouseEnter={() => setHoveredNetwork(i)}
                  onMouseLeave={() => setHoveredNetwork(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-gray-600 text-base">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`font-mono text-base font-light transition-colors duration-300 ${
                        hoveredNetwork === i ? "text-accent" : "text-white"
                      }`}>{network.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-gray-400 text-base hidden md:block">{network.pop}</span>
                      <span className="font-mono text-accent text-lg">{network.metric}</span>
                      <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase text-accent/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-pulse" />
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Aggregate stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="mt-6 grid grid-cols-3 gap-px bg-white/[0.06]"
            >
              {[
                { num: "4.5M", label: "Patients covered" },
                { num: "+42%", label: "Avg adherence Δ" },
                { num: "5", label: "Networks deployed" },
              ].map((stat, i) => (
                <div key={i} className="bg-background p-5 md:p-6">
                  <div className="font-mono text-accent text-3xl md:text-4xl font-light">{stat.num}</div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
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

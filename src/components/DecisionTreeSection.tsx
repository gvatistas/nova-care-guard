import { useState } from "react";
import { motion } from "framer-motion";

const PATHWAYS = [
  {
    id: "lung",
    label: "LUNG CANCER",
    color: "#00d4aa",
    nodes: ["Age ≥ 50?", "≥ 20 pack-years?", "LDCT Eligible", "USPSTF A — ORDER LDCT"],
  },
  {
    id: "colorectal",
    label: "COLORECTAL CANCER",
    color: "#f59e0b",
    nodes: ["Age ≥ 45?", "Family Hx?", "Risk Stratified", "COLONOSCOPY DUE"],
  },
  {
    id: "cardio",
    label: "CARDIOVASCULAR",
    color: "#ef4444",
    nodes: ["BP > 130/80?", "10yr ASCVD ≥ 7.5%?", "Statin Candidate", "ACC/AHA PROTOCOL"],
  },
  {
    id: "diabetes",
    label: "TYPE 2 DIABETES",
    color: "#a855f7",
    nodes: ["BMI ≥ 25?", "A1C ≥ 5.7?", "Prediabetes Flag", "ADA SCREENING"],
  },
];

const STATS = [
  { value: "4 Pathways", desc: "Analyzed simultaneously" },
  { value: "23 Decision Points", desc: "Evaluated in <0.3s" },
  { value: "100% Guideline-Backed", desc: "USPSTF · ACC/AHA · ADA" },
  { value: "1 Compiled Output", desc: "Per patient encounter" },
];

// Diamond shape as SVG path centered at (0,0) with given size
const diamondPath = (s: number) =>
  `M 0 ${-s} L ${s} 0 L 0 ${s} L ${-s} 0 Z`;

const DecisionTreeSection = () => {
  const [hoveredPathway, setHoveredPathway] = useState<string | null>(null);

  // Layout constants
  const colWidth = 220;
  const totalWidth = colWidth * 4 + 60;
  const nodeSpacingY = 100;
  const topY = 80;
  const startNodeY = topY;
  const pathwayStartY = startNodeY + 90;
  const bottomNodeY = pathwayStartY + (3 * nodeSpacingY) + 100;
  const svgHeight = bottomNodeY + 80;

  const getColX = (i: number) => (totalWidth / 2) - ((3 * colWidth) / 2) + i * colWidth + colWidth / 2 - 30;

  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: "#1a1d21" }}>
      <div className="max-w-6xl mx-auto">
        {/* Headings */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-3xl md:text-4xl font-light text-white text-center mb-4"
        >
          Clinical Decision Architecture
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-center text-white/50 text-lg mb-16 font-sans"
        >
          Real-time guideline compilation across multiple disease pathways
        </motion.p>

        {/* Desktop SVG Tree */}
        <div className="hidden md:block overflow-x-auto">
          <svg
            viewBox={`0 0 ${totalWidth} ${svgHeight}`}
            className="w-full max-w-5xl mx-auto"
            style={{ minWidth: 700 }}
          >
            <defs>
              {PATHWAYS.map((p) => (
                <filter key={`glow-${p.id}`} id={`glow-${p.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feFlood floodColor={p.color} floodOpacity="0.6" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#ffffff" floodOpacity="0.5" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Animated dash pattern */}
              <style>{`
                @keyframes dashFlow {
                  to { stroke-dashoffset: -20; }
                }
                .flow-line {
                  stroke-dasharray: 8 12;
                  animation: dashFlow 1.5s linear infinite;
                }
              `}</style>
            </defs>

            {/* Top node: PATIENT DATA INGESTED */}
            <circle cx={totalWidth / 2 - 30} cy={startNodeY} r={14} fill="none" stroke="#ffffff" strokeWidth={2} filter="url(#glow-white)" />
            <circle cx={totalWidth / 2 - 30} cy={startNodeY} r={5} fill="#ffffff" />
            <text x={totalWidth / 2 - 30} y={startNodeY - 24} textAnchor="middle" fill="#ffffff" fontSize={10} fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
              PATIENT DATA INGESTED
            </text>

            {/* Branches from top to each pathway */}
            {PATHWAYS.map((p, i) => {
              const cx = getColX(i);
              const opacity = hoveredPathway === null ? 1 : hoveredPathway === p.id ? 1 : 0.2;
              return (
                <g
                  key={p.id}
                  style={{ opacity, transition: "opacity 0.3s ease" }}
                  onMouseEnter={() => setHoveredPathway(p.id)}
                  onMouseLeave={() => setHoveredPathway(null)}
                >
                  {/* Line from top node to first pathway node */}
                  <line
                    x1={totalWidth / 2 - 30} y1={startNodeY + 14}
                    x2={cx} y2={pathwayStartY - 30}
                    stroke={p.color} strokeWidth={1.5} className="flow-line" opacity={0.6}
                  />

                  {/* Pathway label */}
                  <text x={cx} y={pathwayStartY - 42} textAnchor="middle" fill={p.color} fontSize={9} fontFamily="'JetBrains Mono', monospace" letterSpacing="0.15em" fontWeight={500}>
                    {p.label}
                  </text>

                  {/* Decision nodes */}
                  {p.nodes.map((label, ni) => {
                    const ny = pathwayStartY + ni * nodeSpacingY;
                    const isLast = ni === p.nodes.length - 1;
                    return (
                      <g key={ni}>
                        {/* Connection line to next node */}
                        {ni < p.nodes.length - 1 && (
                          <line
                            x1={cx} y1={ny + 22}
                            x2={cx} y2={ny + nodeSpacingY - 22}
                            stroke={p.color} strokeWidth={1.2} className="flow-line" opacity={0.5}
                          />
                        )}
                        {/* Diamond node */}
                        <path
                          d={diamondPath(isLast ? 24 : 20)}
                          transform={`translate(${cx}, ${ny})`}
                          fill={isLast ? p.color + "20" : "transparent"}
                          stroke={p.color}
                          strokeWidth={isLast ? 2 : 1.5}
                          filter={isLast ? `url(#glow-${p.id})` : undefined}
                        />
                        {/* Node label */}
                        <text
                          x={cx} y={ny + 4}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={8}
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {label.length > 18 ? (
                            <>
                              <tspan x={cx} dy="-4">{label.split(" ").slice(0, Math.ceil(label.split(" ").length / 2)).join(" ")}</tspan>
                              <tspan x={cx} dy="11">{label.split(" ").slice(Math.ceil(label.split(" ").length / 2)).join(" ")}</tspan>
                            </>
                          ) : label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Line from last node to bottom convergence */}
                  <line
                    x1={cx} y1={pathwayStartY + 3 * nodeSpacingY + 24}
                    x2={totalWidth / 2 - 30} y2={bottomNodeY - 18}
                    stroke={p.color} strokeWidth={1.2} className="flow-line" opacity={0.4}
                  />
                </g>
              );
            })}

            {/* Bottom convergence node */}
            <circle cx={totalWidth / 2 - 30} cy={bottomNodeY} r={16} fill="none" stroke="#ffffff" strokeWidth={2} filter="url(#glow-white)" />
            <circle cx={totalWidth / 2 - 30} cy={bottomNodeY} r={6} fill="#ffffff" />
            <text x={totalWidth / 2 - 30} y={bottomNodeY + 34} textAnchor="middle" fill="#ffffff" fontSize={10} fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
              COMPILED CLINICAL ACTION PLAN
            </text>
          </svg>
        </div>

        {/* Mobile: stacked vertical pathways */}
        <div className="md:hidden space-y-10">
          {/* Top node */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white mb-2">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-white">PATIENT DATA INGESTED</p>
          </div>

          {PATHWAYS.map((p) => (
            <div key={p.id} className="border-l-2 ml-6 pl-6 pb-4" style={{ borderColor: p.color + "60" }}>
              <p className="font-mono text-xs tracking-[0.15em] mb-4" style={{ color: p.color }}>{p.label}</p>
              <div className="space-y-3">
                {p.nodes.map((label, ni) => (
                  <div key={ni} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 flex-shrink-0 rotate-45 border"
                      style={{
                        borderColor: p.color,
                        backgroundColor: ni === p.nodes.length - 1 ? p.color + "30" : "transparent",
                      }}
                    />
                    <span className="font-mono text-[10px] text-white/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom node */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white mb-2">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-white">COMPILED CLINICAL ACTION PLAN</p>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 border-t border-white/10 pt-10"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-mono text-sm text-white tracking-wide">{s.value}</p>
              <p className="text-xs text-white/40 mt-1 font-sans">{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DecisionTreeSection;

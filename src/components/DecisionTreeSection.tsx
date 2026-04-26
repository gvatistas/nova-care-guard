import { useState } from "react";
import { motion } from "framer-motion";

/* Data pathway colors are MEANINGFUL — these indicate different clinical pathways */
const PATHWAYS = [
  {
    id: "lung",
    label: "LUNG CANCER",
    color: "#059669",
    nodes: ["Age ≥ 50?", "≥ 20 pack-years?", "LDCT Eligible", "USPSTF A — ORDER LDCT"],
  },
  {
    id: "colorectal",
    label: "COLORECTAL CANCER",
    color: "#D97706",
    nodes: ["Age ≥ 45?", "Family Hx?", "Risk Stratified", "COLONOSCOPY DUE"],
  },
  {
    id: "cardio",
    label: "CARDIOVASCULAR",
    color: "#E11D48",
    nodes: ["BP > 130/80?", "10yr ASCVD ≥ 7.5%?", "Statin Candidate", "ACC/AHA PROTOCOL"],
  },
  {
    id: "diabetes",
    label: "TYPE 2 DIABETES",
    color: "#6B7280",
    nodes: ["BMI ≥ 25?", "A1C ≥ 5.7?", "Prediabetes Flag", "ADA SCREENING"],
  },
];

const STATS = [
  { value: "4 Pathways", desc: "Analyzed simultaneously" },
  { value: "23 Decision Points", desc: "Evaluated in <0.3s" },
  { value: "100% Guideline-Backed", desc: "USPSTF · ACC/AHA · ADA" },
  { value: "1 Compiled Output", desc: "Per patient encounter" },
];

const diamondPath = (s: number) =>
  `M 0 ${-s} L ${s} 0 L 0 ${s} L ${-s} 0 Z`;

const DecisionTreeSection = () => {
  const [hoveredPathway, setHoveredPathway] = useState<string | null>(null);

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
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: "#141d2e" }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-3xl md:text-4xl font-light text-center mb-4"
          style={{ color: "#F3F4F6" }}
        >
          Clinical Decision Architecture
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-center text-lg mb-16 font-sans"
          style={{ color: "#6B7280" }}
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
                  <feFlood floodColor={p.color} floodOpacity="0.4" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#374151" floodOpacity="0.3" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
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

            <circle cx={totalWidth / 2 - 30} cy={startNodeY} r={14} fill="none" stroke="#374151" strokeWidth={2} filter="url(#glow-white)" />
            <circle cx={totalWidth / 2 - 30} cy={startNodeY} r={5} fill="#374151" />
            <text x={totalWidth / 2 - 30} y={startNodeY - 24} textAnchor="middle" fill="#111827" fontSize={10} fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
              PATIENT DATA INGESTED
            </text>

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
                  <line
                    x1={totalWidth / 2 - 30} y1={startNodeY + 14}
                    x2={cx} y2={pathwayStartY - 30}
                    stroke={p.color} strokeWidth={1.5} className="flow-line" opacity={0.6}
                  />
                  <text x={cx} y={pathwayStartY - 42} textAnchor="middle" fill={p.color} fontSize={9} fontFamily="'JetBrains Mono', monospace" letterSpacing="0.15em" fontWeight={500}>
                    {p.label}
                  </text>
                  {p.nodes.map((label, ni) => {
                    const ny = pathwayStartY + ni * nodeSpacingY;
                    const isLast = ni === p.nodes.length - 1;
                    return (
                      <g key={ni}>
                        {ni < p.nodes.length - 1 && (
                          <line
                            x1={cx} y1={ny + 22}
                            x2={cx} y2={ny + nodeSpacingY - 22}
                            stroke={p.color} strokeWidth={1.2} className="flow-line" opacity={0.5}
                          />
                        )}
                        <path
                          d={diamondPath(isLast ? 24 : 20)}
                          transform={`translate(${cx}, ${ny})`}
                          fill={isLast ? p.color + "20" : "transparent"}
                          stroke={p.color}
                          strokeWidth={isLast ? 2 : 1.5}
                          filter={isLast ? `url(#glow-${p.id})` : undefined}
                        />
                        <text
                          x={cx} y={ny + 4}
                          textAnchor="middle"
                          fill="#111827"
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
                  <line
                    x1={cx} y1={pathwayStartY + 3 * nodeSpacingY + 24}
                    x2={totalWidth / 2 - 30} y2={bottomNodeY - 18}
                    stroke={p.color} strokeWidth={1.2} className="flow-line" opacity={0.4}
                  />
                </g>
              );
            })}

            <circle cx={totalWidth / 2 - 30} cy={bottomNodeY} r={16} fill="none" stroke="#374151" strokeWidth={2} filter="url(#glow-white)" />
            <circle cx={totalWidth / 2 - 30} cy={bottomNodeY} r={6} fill="#374151" />
            <text x={totalWidth / 2 - 30} y={bottomNodeY + 34} textAnchor="middle" fill="#111827" fontSize={10} fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em">
              COMPILED CLINICAL ACTION PLAN
            </text>
          </svg>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2" style={{ borderColor: "#4A5568" }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#374151" }} />
            </div>
            <p className="font-mono text-[10px] tracking-[0.15em]" style={{ color: "#F3F4F6" }}>PATIENT DATA INGESTED</p>
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
                    <span className="font-mono text-[10px]" style={{ color: "#D1D5DB" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2" style={{ borderColor: "#4A5568" }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#374151" }} />
            </div>
            <p className="font-mono text-[10px] tracking-[0.15em]" style={{ color: "#F3F4F6" }}>COMPILED CLINICAL ACTION PLAN</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 border-t pt-10"
          style={{ borderColor: "#2A3548" }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-mono text-sm tracking-wide" style={{ color: "#F3F4F6" }}>{s.value}</p>
              <p className="text-xs mt-1 font-sans" style={{ color: "#6B7280" }}>{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DecisionTreeSection;

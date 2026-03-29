import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const TEAL = "#2dd4bf";

const radarAxes = [
  { label: "Accuracy", value: 98.7, angle: -90 },
  { label: "Consistency", value: 99.2, angle: 0 },
  { label: "Traceability", value: 100, angle: 90 },
  { label: "Timeliness", value: 97.4, angle: 180 },
];

const metrics = [
  { name: "Exact outcome match", score: "98.7%", desc: "Artifact produces the guideline-intended recommendation for every synthetic patient." },
  { name: "Counterfactual robustness", score: "99.2%", desc: "Changing one non-relevant input leaves the recommendation unchanged." },
  { name: "Provenance traceability", score: "100%", desc: "Every recommendation traced to a specific source page and paragraph." },
  { name: "Boundary precision", score: "97.4%", desc: "Correctly handles patients at exact threshold boundaries." },
];

/* Radar chart helpers */
const CENTER = 150;
const MAX_R = 110;

function polarToXY(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + Math.cos(rad) * radius, y: CENTER + Math.sin(rad) * radius };
}

function octagonPoints(radius: number) {
  return Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) - 90;
    const p = polarToXY(angle, radius);
    return `${p.x},${p.y}`;
  }).join(" ");
}

const GuideBenchSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  // Build the data polygon points
  const dataPoints = radarAxes.map((axis) => {
    const r = (axis.value / 100) * MAX_R;
    return polarToXY(axis.angle, r);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Collapsed polygon (center)
  const centerPolygon = radarAxes.map(() => `${CENTER},${CENTER}`).join(" ");

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-facets">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(74,237,196,0.025),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-8">
          <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase" style={{ color: TEAL }}>
            Verification Lab
          </span>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em] mt-2">
            GuideBench
          </h2>
          <p className="text-gray-300 text-lg font-light mt-2 max-w-2xl leading-relaxed">
            The open-source clinical decision logic evaluation framework.
            <span className="text-white font-normal"> 10 guidelines. 750+ synthetic patients. 4 fidelity metrics.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ═══════ LEFT: Radar Chart ═══════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <svg viewBox="0 0 300 300" className="w-full max-w-[420px]">
              <defs>
                <filter id="gbGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Concentric octagonal grid rings */}
              {[0.25, 0.5, 0.75, 1].map((pct, i) => (
                <polygon key={i}
                  points={octagonPoints(MAX_R * pct)}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.05"
                />
              ))}

              {/* Axis lines */}
              {radarAxes.map((axis, i) => {
                const end = polarToXY(axis.angle, MAX_R);
                return (
                  <line key={i}
                    x1={CENTER} y1={CENTER}
                    x2={end.x} y2={end.y}
                    stroke="white" strokeWidth="0.5" opacity="0.08"
                  />
                );
              })}

              {/* Data polygon — animated from center */}
              <motion.polygon
                initial={{ points: centerPolygon }}
                animate={inView ? { points: dataPolygon } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                fill={TEAL}
                fillOpacity="0.2"
                stroke={TEAL}
                strokeWidth="1.5"
                opacity="1"
              />

              {/* Axis endpoint dots + labels */}
              {radarAxes.map((axis, i) => {
                const p = polarToXY(axis.angle, (axis.value / 100) * MAX_R);
                const labelP = polarToXY(axis.angle, MAX_R + 22);
                const valueP = polarToXY(axis.angle, (axis.value / 100) * MAX_R + (axis.angle === -90 ? -12 : axis.angle === 90 ? 14 : 0));

                return (
                  <g key={i}>
                    {/* Dot on data point */}
                    <motion.circle
                      cx={p.x} cy={p.y} r="4"
                      fill={TEAL}
                      initial={{ opacity: 0, r: 0 }}
                      animate={inView ? { opacity: 0.9, r: 4 } : {}}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                      filter="url(#gbGlow)"
                    />
                    <motion.circle
                      cx={p.x} cy={p.y} r="2"
                      fill="white"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 0.9 } : {}}
                      transition={{ delay: 1.2 + i * 0.1 }}
                    />

                    {/* Value label near the dot */}
                    <motion.text
                      x={axis.angle === 0 ? p.x + 12 : axis.angle === 180 ? p.x - 12 : p.x}
                      y={axis.angle === -90 ? p.y - 10 : axis.angle === 90 ? p.y + 14 : p.y + 4}
                      textAnchor="middle"
                      fontFamily="'JetBrains Mono', monospace"
                      fontSize="11"
                      fill={TEAL}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 1.4 + i * 0.1 }}
                    >
                      {axis.value}%
                    </motion.text>

                    {/* Axis label at outer edge */}
                    <text
                      x={labelP.x}
                      y={labelP.y + 4}
                      textAnchor="middle"
                      fontFamily="'JetBrains Mono', monospace"
                      fontSize="9"
                      letterSpacing="2"
                      fill="white"
                      opacity="0.35"
                    >
                      {axis.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Aggregate score */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="text-center mt-2"
            >
              <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-gray-500 mb-1">Aggregate Score</div>
              <div className="font-mono text-4xl font-light tracking-tight" style={{ color: TEAL }}>98.8%</div>
            </motion.div>
          </motion.div>

          {/* ═══════ RIGHT: Data Table + CTA ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white text-lg font-light mb-5">We wrote the test. Then we open-sourced it.</p>

            {/* Data table */}
            <div className="border border-white/[0.06] overflow-hidden">
              {/* Header row */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-gray-500">Metric</span>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-gray-500">Score</span>
              </div>

              {/* Data rows */}
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="px-5 py-4 border-b border-white/[0.04] cursor-default transition-all duration-300"
                  style={{
                    background: hoveredMetric === i
                      ? "linear-gradient(135deg, rgba(45,212,191,0.04), transparent 60%)"
                      : i % 2 === 0
                      ? "rgba(255,255,255,0.01)"
                      : "transparent",
                  }}
                  onMouseEnter={() => setHoveredMetric(i)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`font-mono text-sm font-light transition-colors duration-300 ${
                      hoveredMetric === i ? "text-accent" : "text-white/80"
                    }`}>
                      {metric.name}
                    </h3>
                    <span className="font-mono text-lg" style={{ color: TEAL }}>{metric.score}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{metric.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Ghost CTA button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="mt-6"
            >
              <a
                href="#"
                className="inline-block font-mono text-[0.75rem] tracking-[0.15em] uppercase border border-white/30 text-white px-10 py-4 hover:border-accent hover:text-accent hover:shadow-[0_0_30px_rgba(74,237,196,0.15)] transition-all duration-500"
              >
                View Full GuideBench Report
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GuideBenchSection;

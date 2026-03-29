import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

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

  const dataPoints = radarAxes.map((axis) => polarToXY(axis.angle, (axis.value / 100) * MAX_R));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const centerPolygon = radarAxes.map(() => `${CENTER},${CENTER}`).join(" ");

  return (
    <section ref={ref} className="relative py-24 md:py-32 texture-facets">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(255,255,255,0.015),transparent_70%)] pointer-events-none" />
      <div className="relative max-w-[1440px] mx-auto px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-8">
          <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>
            Verification Lab
          </span>
          <h2 className="text-white font-mono font-light leading-[1.15] tracking-[-0.02em] mt-2" style={{ fontSize: "2.5rem" }}>
            GuideBench
          </h2>
          <p className="font-light mt-2 max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>
            The open-source clinical decision logic evaluation framework.
            <span className="text-white font-normal"> 10 guidelines. 750+ synthetic patients. 4 fidelity metrics.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="flex flex-col items-center">
            <svg viewBox="0 0 300 300" className="w-full max-w-[420px]">
              <defs>
                <filter id="gbGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>

              {[0.25, 0.5, 0.75, 1].map((pct, i) => (
                <polygon key={i} points={octagonPoints(MAX_R * pct)} fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" />
              ))}

              {radarAxes.map((axis, i) => {
                const end = polarToXY(axis.angle, MAX_R);
                return <line key={i} x1={CENTER} y1={CENTER} x2={end.x} y2={end.y} stroke="white" strokeWidth="0.5" opacity="0.08" />;
              })}

              <motion.polygon
                initial={{ points: centerPolygon }}
                animate={inView ? { points: dataPolygon } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                fill="white"
                fillOpacity="0.08"
                stroke="white"
                strokeWidth="1.5"
                opacity="0.6"
              />

              {radarAxes.map((axis, i) => {
                const p = polarToXY(axis.angle, (axis.value / 100) * MAX_R);
                const labelP = polarToXY(axis.angle, MAX_R + 22);
                return (
                  <g key={i}>
                    <motion.circle cx={p.x} cy={p.y} r="4" fill="white"
                      initial={{ opacity: 0, r: 0 }}
                      animate={inView ? { opacity: 0.7, r: 4 } : {}}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                      filter="url(#gbGlow)" />
                    <motion.circle cx={p.x} cy={p.y} r="2" fill="white"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 0.9 } : {}}
                      transition={{ delay: 1.2 + i * 0.1 }} />
                    <motion.text
                      x={axis.angle === 0 ? p.x + 12 : axis.angle === 180 ? p.x - 12 : p.x}
                      y={axis.angle === -90 ? p.y - 10 : axis.angle === 90 ? p.y + 14 : p.y + 4}
                      textAnchor="middle"
                      fontFamily="'JetBrains Mono', monospace"
                      fontSize="12"
                      fill="white"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 0.8 } : {}}
                      transition={{ delay: 1.4 + i * 0.1 }}>
                      {axis.value}%
                    </motion.text>
                    <text x={labelP.x} y={labelP.y + 4} textAnchor="middle"
                      fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="2" fill="white" opacity="0.3">
                      {axis.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1 }} className="text-center mt-2">
              <div className="font-mono tracking-[0.2em] uppercase mb-1" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>Aggregate Score</div>
              <div className="font-mono font-light tracking-tight text-white" style={{ fontSize: "3rem" }}>98.8%</div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }}>
            <p className="text-white font-light mb-5" style={{ fontSize: "1.125rem" }}>We wrote the test. Then we open-sourced it.</p>

            <div className="border border-white/[0.06] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>Metric</span>
                <span className="font-mono tracking-[0.2em] uppercase" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>Score</span>
              </div>

              {metrics.map((metric, i) => (
                <motion.div key={metric.name}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="px-5 py-4 border-b border-white/[0.04] cursor-default transition-all duration-300"
                  style={{
                    background: hoveredMetric === i ? "linear-gradient(135deg, rgba(255,255,255,0.03), transparent 60%)" : i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredMetric(i)}
                  onMouseLeave={() => setHoveredMetric(null)}>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`font-mono font-light transition-colors duration-300 ${hoveredMetric === i ? "text-white" : "text-white/80"}`} style={{ fontSize: "1rem" }}>
                      {metric.name}
                    </h3>
                    <span className="font-mono text-white" style={{ fontSize: "1.125rem" }}>{metric.score}</span>
                  </div>
                  <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem" }}>{metric.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.2 }} className="mt-6">
              <a href="#" className="inline-block font-mono tracking-[0.15em] uppercase border border-white/30 text-white px-10 py-4 hover:bg-white hover:text-black transition-all duration-300"
                style={{ fontSize: "1rem" }}>
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

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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

// 3D faceted diamond vertices (viewed from slight angle)
const DIAMOND = {
  top: { x: 150, y: 20 },
  right: { x: 265, y: 130 },
  bottom: { x: 150, y: 240 },
  left: { x: 35, y: 130 },
  center: { x: 150, y: 130 },
  // Inner facet points for 3D illusion
  innerTop: { x: 150, y: 65 },
  innerRight: { x: 225, y: 130 },
  innerBottom: { x: 150, y: 195 },
  innerLeft: { x: 75, y: 130 },
};

const GuideBenchSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  // Slow rotation
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    let start: number | null = null;
    const animate = (t: number) => {
      if (!start) start = t;
      setRotation(((t - start) / 80) % 360);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  // Diamond facet faces with varying brightness for 3D effect
  const facets = [
    // Top-left face (brightest - light-facing)
    { points: `${DIAMOND.top.x},${DIAMOND.top.y} ${DIAMOND.left.x},${DIAMOND.left.y} ${DIAMOND.innerLeft.x},${DIAMOND.innerLeft.y} ${DIAMOND.innerTop.x},${DIAMOND.innerTop.y}`, opacity: 0.12 },
    // Top-right face
    { points: `${DIAMOND.top.x},${DIAMOND.top.y} ${DIAMOND.right.x},${DIAMOND.right.y} ${DIAMOND.innerRight.x},${DIAMOND.innerRight.y} ${DIAMOND.innerTop.x},${DIAMOND.innerTop.y}`, opacity: 0.08 },
    // Bottom-right face (shadow)
    { points: `${DIAMOND.bottom.x},${DIAMOND.bottom.y} ${DIAMOND.right.x},${DIAMOND.right.y} ${DIAMOND.innerRight.x},${DIAMOND.innerRight.y} ${DIAMOND.innerBottom.x},${DIAMOND.innerBottom.y}`, opacity: 0.04 },
    // Bottom-left face
    { points: `${DIAMOND.bottom.x},${DIAMOND.bottom.y} ${DIAMOND.left.x},${DIAMOND.left.y} ${DIAMOND.innerLeft.x},${DIAMOND.innerLeft.y} ${DIAMOND.innerBottom.x},${DIAMOND.innerBottom.y}`, opacity: 0.06 },
    // Center top
    { points: `${DIAMOND.innerTop.x},${DIAMOND.innerTop.y} ${DIAMOND.innerRight.x},${DIAMOND.innerRight.y} ${DIAMOND.center.x},${DIAMOND.center.y}`, opacity: 0.1 },
    // Center right
    { points: `${DIAMOND.innerRight.x},${DIAMOND.innerRight.y} ${DIAMOND.innerBottom.x},${DIAMOND.innerBottom.y} ${DIAMOND.center.x},${DIAMOND.center.y}`, opacity: 0.05 },
    // Center bottom
    { points: `${DIAMOND.innerBottom.x},${DIAMOND.innerBottom.y} ${DIAMOND.innerLeft.x},${DIAMOND.innerLeft.y} ${DIAMOND.center.x},${DIAMOND.center.y}`, opacity: 0.03 },
    // Center left
    { points: `${DIAMOND.innerLeft.x},${DIAMOND.innerLeft.y} ${DIAMOND.innerTop.x},${DIAMOND.innerTop.y} ${DIAMOND.center.x},${DIAMOND.center.y}`, opacity: 0.08 },
  ];

  // Axis endpoints on diamond edges
  const axisPositions = [
    { ...DIAMOND.top, label: radarAxes[0]! },    // Accuracy at top
    { ...DIAMOND.right, label: radarAxes[1]! },  // Consistency at right
    { ...DIAMOND.bottom, label: radarAxes[2]! },  // Traceability at bottom
    { ...DIAMOND.left, label: radarAxes[3]! },    // Timeliness at left
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32">
      {/* Diamond/checkered background pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(45deg, rgba(255,255,255,0.015) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(255,255,255,0.015) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.015) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.015) 75%)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
      }} />

      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="mb-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* 3D Diamond visualization */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="flex flex-col items-center">
            <div style={{
              transform: `perspective(800px) rotateY(${Math.sin(rotation * Math.PI / 180) * 8}deg) rotateX(${Math.cos(rotation * Math.PI / 180) * 3}deg)`,
              transition: "transform 50ms linear",
            }}>
              <svg viewBox="-10 -10 320 280" className="w-full max-w-[420px]">
                <defs>
                  <filter id="gbGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  <filter id="gbEdgeGlow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>

                {/* Outer diamond outline */}
                <polygon
                  points={`${DIAMOND.top.x},${DIAMOND.top.y} ${DIAMOND.right.x},${DIAMOND.right.y} ${DIAMOND.bottom.x},${DIAMOND.bottom.y} ${DIAMOND.left.x},${DIAMOND.left.y}`}
                  fill="none" stroke="white" strokeWidth="1.2" opacity="0.25"
                />

                {/* Faceted surfaces */}
                {facets.map((facet, i) => (
                  <motion.polygon
                    key={i}
                    points={facet.points}
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: facet.opacity } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                    stroke="white" strokeWidth="0.4" strokeOpacity="0.15"
                  />
                ))}

                {/* Inner diamond edges */}
                <polygon
                  points={`${DIAMOND.innerTop.x},${DIAMOND.innerTop.y} ${DIAMOND.innerRight.x},${DIAMOND.innerRight.y} ${DIAMOND.innerBottom.x},${DIAMOND.innerBottom.y} ${DIAMOND.innerLeft.x},${DIAMOND.innerLeft.y}`}
                  fill="none" stroke="white" strokeWidth="0.6" opacity="0.2"
                />

                {/* Diagonal inner lines to center */}
                {[DIAMOND.innerTop, DIAMOND.innerRight, DIAMOND.innerBottom, DIAMOND.innerLeft].map((p, i) => (
                  <line key={i} x1={p.x} y1={p.y} x2={DIAMOND.center.x} y2={DIAMOND.center.y}
                    stroke="white" strokeWidth="0.4" opacity="0.1" />
                ))}

                {/* Center point */}
                <circle cx={DIAMOND.center.x} cy={DIAMOND.center.y} r="3" fill="white" opacity="0.3" filter="url(#gbGlow)" />

                {/* Axis labels and values at diamond corners */}
                {axisPositions.map((pos, i) => {
                  const offsetX = i === 1 ? 20 : i === 3 ? -20 : 0;
                  const offsetY = i === 0 ? -14 : i === 2 ? 18 : 0;
                  return (
                    <g key={i}>
                      {/* Corner diamond marker */}
                      <motion.rect
                        x={pos.x - 4} y={pos.y - 4} width="8" height="8"
                        transform={`rotate(45 ${pos.x} ${pos.y})`}
                        fill="white" stroke="white" strokeWidth="0.5"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 0.5 } : {}}
                        transition={{ delay: 1 + i * 0.1 }}
                        filter="url(#gbEdgeGlow)"
                      />
                      <motion.text
                        x={pos.x + offsetX} y={pos.y + offsetY + (i === 0 ? -4 : i === 2 ? 8 : 4)}
                        textAnchor="middle"
                        fontFamily="'Montserrat', sans-serif" fontSize="13" fontWeight="600"
                        fill="white"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 0.85 } : {}}
                        transition={{ delay: 1.2 + i * 0.1 }}>
                        {pos.label.value}%
                      </motion.text>
                      <text
                        x={pos.x + offsetX * 1.8} y={pos.y + offsetY * 1.5 + (i === 0 ? -18 : i === 2 ? 22 : 4)}
                        textAnchor="middle"
                        fontFamily="'JetBrains Mono', monospace" fontSize="8" letterSpacing="2" fill="white" opacity="0.3">
                        {pos.label.label.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Aggregate score - more prominent */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.2 }}
              className="text-center mt-4">
              <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>Aggregate Score</div>
              <div className="font-mono font-light tracking-tight text-white" style={{ fontSize: "4.5rem", lineHeight: 1 }}>98.8%</div>
            </motion.div>
          </motion.div>

          {/* Right column - metrics table */}
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

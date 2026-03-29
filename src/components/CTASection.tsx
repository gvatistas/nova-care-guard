import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

// Crown geometry - sharp angular 5-point crown
const CROWN = {
  tips: [
    { x: 120, y: 18 }, { x: 195, y: 8 }, { x: 270, y: 4 }, { x: 345, y: 8 }, { x: 420, y: 18 },
  ],
  valleys: [
    { x: 157, y: 48 }, { x: 232, y: 42 }, { x: 308, y: 42 }, { x: 383, y: 48 },
  ],
  baseY: 58,
  baseLeft: 85,
  baseRight: 455,
};

function buildCrownOutline() {
  const pts = [{ x: CROWN.baseLeft, y: CROWN.baseY }];
  for (let i = 0; i < CROWN.tips.length; i++) {
    pts.push(CROWN.tips[i]!);
    if (i < CROWN.valleys.length) pts.push(CROWN.valleys[i]!);
  }
  pts.push({ x: CROWN.baseRight, y: CROWN.baseY });
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

// Scattered particle positions (will converge to crown vertices)
function generateParticles() {
  const crownPts: { x: number; y: number }[] = [];
  // Add all crown geometry points
  CROWN.tips.forEach(p => crownPts.push(p));
  CROWN.valleys.forEach(p => crownPts.push(p));
  crownPts.push({ x: CROWN.baseLeft, y: CROWN.baseY });
  crownPts.push({ x: CROWN.baseRight, y: CROWN.baseY });
  // Add midpoints along edges for more particles
  for (let i = 0; i < CROWN.tips.length; i++) {
    const tip = CROWN.tips[i]!;
    if (i > 0) {
      const valley = CROWN.valleys[i - 1]!;
      crownPts.push({ x: (tip.x + valley.x) / 2, y: (tip.y + valley.y) / 2 });
    }
    if (i < CROWN.valleys.length) {
      const valley = CROWN.valleys[i]!;
      crownPts.push({ x: (tip.x + valley.x) / 2, y: (tip.y + valley.y) / 2 });
    }
    crownPts.push({ x: tip.x, y: CROWN.baseY });
  }

  return crownPts.map((target, i) => ({
    target,
    scatter: {
      x: target.x + (Math.random() - 0.5) * 400,
      y: target.y + (Math.random() - 0.5) * 200,
    },
    delay: 0.1 + i * 0.04,
    size: 1 + Math.random() * 1.5,
    driftAngle: Math.random() * Math.PI * 2,
  }));
}

const PARTICLES = generateParticles();

// Post-assembly drifting particles
const DRIFT_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  startX: CROWN.tips[i % 5]!.x + (Math.random() - 0.5) * 30,
  startY: CROWN.tips[i % 5]!.y + Math.random() * 30,
  endX: CROWN.tips[i % 5]!.x + (Math.random() - 0.5) * 200,
  endY: CROWN.tips[i % 5]!.y - 20 - Math.random() * 60,
  size: 0.5 + Math.random() * 1,
  delay: 2.5 + i * 0.08,
}));

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const crownRef = useRef(null);
  const crownInView = useInView(crownRef, { once: true, margin: "-50px" });
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    if (crownInView) {
      const t = setTimeout(() => setAssembled(true), 2200);
      return () => clearTimeout(t);
    }
  }, [crownInView]);

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <h2 className="text-white font-mono font-light leading-[1.15] tracking-[-0.02em] mb-4" style={{ fontSize: "2.5rem" }}>
            Unlocking the proactive healthcare patients deserve.
          </h2>
          <p className="font-light leading-relaxed mb-8 max-w-3xl" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem", lineHeight: 1.7 }}>
            The healthcare system wasn't built for prevention. We're changing that — replacing outdated, reactive workflows with intelligent clinical infrastructure that catches what matters before it's too late.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a href="#" className="font-mono uppercase transition-all duration-300 bg-white text-black hover:bg-gray-200"
              style={{ fontSize: "1rem", letterSpacing: "0.15em", padding: "16px 48px" }}>
              Request Demo
            </a>
            <a href="#" className="font-mono uppercase transition-all duration-300 text-white border border-white/30 hover:bg-white hover:text-black"
              style={{ fontSize: "1rem", letterSpacing: "0.15em", padding: "16px 48px" }}>
              Read White Paper
            </a>
          </div>
        </motion.div>
      </div>

      {/* Crown assembly animation */}
      <div ref={crownRef} className="mt-24 flex flex-col items-center px-8">
        <svg viewBox="0 0 540 80" className="w-full max-w-[600px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="crownAssemblyGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="particleDrift">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Particles converging to crown vertices */}
          {PARTICLES.map((p, i) => (
            <motion.circle
              key={`p-${i}`}
              cx={p.scatter.x}
              cy={p.scatter.y}
              r={p.size}
              fill="white"
              initial={{ cx: p.scatter.x, cy: p.scatter.y, opacity: 0 }}
              animate={crownInView ? {
                cx: p.target.x,
                cy: p.target.y,
                opacity: [0, 0.6, 0.8, 0.4],
              } : {}}
              transition={{
                duration: 1.8,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}

          {/* Crown outline - draws after particles arrive */}
          <motion.path
            d={buildCrownOutline()}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={crownInView ? { pathLength: 1, opacity: [0, 0, 0.5, 0.5, 0.3] } : {}}
            transition={{ duration: 2, delay: 1.5, ease: [0.42, 0, 0.58, 1] }}
            filter="url(#crownAssemblyGlow)"
          />

          {/* Base line */}
          <motion.line
            x1={CROWN.baseLeft} y1={CROWN.baseY}
            x2={CROWN.baseRight} y2={CROWN.baseY}
            stroke="white" strokeWidth="1.8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={crownInView ? { pathLength: 1, opacity: [0, 0, 0.35, 0.35, 0.2] } : {}}
            transition={{ duration: 1.5, delay: 1.8, ease: [0.42, 0, 0.58, 1] }}
          />

          {/* Faceted inner triangles */}
          {CROWN.tips.map((tip, i) => {
            const leftBase = i === 0 ? { x: CROWN.baseLeft, y: CROWN.baseY } : CROWN.valleys[i - 1]!;
            const rightBase = i === CROWN.tips.length - 1 ? { x: CROWN.baseRight, y: CROWN.baseY } : CROWN.valleys[i]!;
            return (
              <g key={`facet-${i}`}>
                <motion.polygon
                  points={`${tip.x},${tip.y} ${leftBase.x},${leftBase.y} ${tip.x},${CROWN.baseY}`}
                  fill="white"
                  initial={{ opacity: 0 }}
                  animate={crownInView ? { opacity: [0, 0, 0.06, 0.03] } : {}}
                  transition={{ duration: 1.5, delay: 2.2 + i * 0.1 }}
                />
                <motion.polygon
                  points={`${tip.x},${tip.y} ${rightBase.x},${rightBase.y} ${tip.x},${CROWN.baseY}`}
                  fill="white"
                  initial={{ opacity: 0 }}
                  animate={crownInView ? { opacity: [0, 0, 0.09, 0.05] } : {}}
                  transition={{ duration: 1.5, delay: 2.2 + i * 0.1 }}
                />
                {/* Sharp tip marker */}
                <motion.circle
                  cx={tip.x} cy={tip.y} r="1.5"
                  fill="white"
                  initial={{ opacity: 0 }}
                  animate={crownInView ? { opacity: [0, 0, 0.7, 0.25] } : {}}
                  transition={{ duration: 2, delay: 2 + i * 0.08 }}
                  filter="url(#crownAssemblyGlow)"
                />
              </g>
            );
          })}

          {/* Drifting particles post-assembly */}
          {assembled && DRIFT_PARTICLES.map((dp, i) => (
            <motion.circle
              key={`drift-${i}`}
              r={dp.size}
              fill="white"
              initial={{ cx: dp.startX, cy: dp.startY, opacity: 0.4 }}
              animate={{ cx: dp.endX, cy: dp.endY, opacity: 0 }}
              transition={{ duration: 3, delay: i * 0.1, ease: "easeOut" }}
              filter="url(#particleDrift)"
            />
          ))}
        </svg>

        <motion.div
          initial={{ opacity: 0 }}
          animate={crownInView ? { opacity: 1 } : {}}
          transition={{ delay: 3.2, duration: 1.2 }}
          className="mt-5 font-mono tracking-[0.3em] uppercase"
          style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.25)" }}
        >
          Medient Health
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
        className="mt-16 border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>© 2026 Medient Health. All rights reserved.</div>
          <div className="flex items-center gap-8 font-mono tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
            <a href="#" className="hover:text-white transition-colors duration-300">Whitepaper</a>
            <a href="#" className="hover:text-white transition-colors duration-300">GuideBench</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Contact</a>
          </div>
        </div>
      </motion.footer>
    </section>
  );
};

export default CTASection;

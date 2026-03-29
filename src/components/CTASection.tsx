import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import medientWatermark from "@/assets/medient-watermark.png";

/* Crown silhouette path — 5 angular points converging to center */
const CROWN_TIPS = [
  { x: 100, y: 15 },
  { x: 175, y: 8 },
  { x: 250, y: 3 },
  { x: 325, y: 8 },
  { x: 400, y: 15 },
];
const VALLEYS = [
  { x: 137, y: 52 },
  { x: 212, y: 45 },
  { x: 288, y: 45 },
  { x: 363, y: 52 },
];
const BASE_Y = 65;

// Build the crown outline path
function buildCrownPath() {
  const pts = [{ x: 60, y: BASE_Y }];
  for (let i = 0; i < CROWN_TIPS.length; i++) {
    pts.push(CROWN_TIPS[i]!);
    if (i < VALLEYS.length) pts.push(VALLEYS[i]!);
  }
  pts.push({ x: 440, y: BASE_Y });
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

// Lines from viewport edges converging to crown tips
const CONVERGE_LINES = CROWN_TIPS.map((tip, i) => {
  const origins = [
    { x: -50, y: 80 },
    { x: 50, y: -30 },
    { x: 250, y: -40 },
    { x: 450, y: -30 },
    { x: 550, y: 80 },
  ];
  return { from: origins[i]!, to: tip };
});

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const crownRef = useRef(null);
  const crownInView = useInView(crownRef, { once: true, margin: "-50px" });

  return (
    <section id="contact" ref={ref} className="relative py-14 md:py-20 overflow-hidden texture-diamonds">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,237,196,0.04),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
        <img src={medientWatermark} alt="" className="w-[500px] opacity-[0.02] invert translate-x-1/4" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em] mb-4">
            Unlocking the proactive healthcare patients deserve.
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-8">
            The healthcare system wasn't built for prevention. We're changing that — replacing outdated, reactive workflows with intelligent clinical infrastructure that catches what matters before it's too late.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href="#"
              className="font-mono uppercase transition-all duration-300"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                backgroundColor: "#2dd4bf",
                color: "#000",
                padding: "16px 48px",
                boxShadow: "0 0 30px rgba(45,212,191,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 50px rgba(45,212,191,0.5)";
                e.currentTarget.style.backgroundColor = "#5eead4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px rgba(45,212,191,0.3)";
                e.currentTarget.style.backgroundColor = "#2dd4bf";
              }}
            >
              Request Demo
            </a>
            <a
              href="#"
              className="font-mono uppercase transition-all duration-300"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                color: "#2dd4bf",
                padding: "16px 48px",
                border: "1px solid rgba(45,212,191,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(45,212,191,0.7)";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(45,212,191,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(45,212,191,0.4)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Read White Paper
            </a>
          </div>
        </motion.div>
      </div>

      {/* ═══════ Closing Crown Animation ═══════ */}
      <div ref={crownRef} className="mt-20 flex flex-col items-center">
        <svg viewBox="0 0 500 90" className="w-full max-w-[600px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="crownEndGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Converging lines from edges */}
          {CONVERGE_LINES.map((line, i) => (
            <motion.line
              key={i}
              x1={line.from.x} y1={line.from.y}
              x2={line.from.x} y2={line.from.y}
              animate={crownInView ? { x2: line.to.x, y2: line.to.y } : {}}
              transition={{ duration: 2, delay: i * 0.1, ease: [0.42, 0, 0.58, 1] }}
              stroke="#2dd4bf"
              strokeWidth="0.6"
              opacity="0.25"
            />
          ))}

          {/* Crown outline — draws in */}
          <motion.path
            d={buildCrownPath()}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="1.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={crownInView ? { pathLength: 1, opacity: [0, 0.8, 0.8, 0.3] } : {}}
            transition={{ duration: 2.5, delay: 0.5, ease: [0.42, 0, 0.58, 1] }}
            filter="url(#crownEndGlow)"
          />

          {/* Base band */}
          <motion.line
            x1="60" y1={BASE_Y} x2="440" y2={BASE_Y}
            stroke="#2dd4bf"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={crownInView ? { pathLength: 1, opacity: [0, 0.6, 0.6, 0.25] } : {}}
            transition={{ duration: 2, delay: 1, ease: [0.42, 0, 0.58, 1] }}
          />

          {/* Faceted inner triangles — appear after crown forms */}
          {CROWN_TIPS.map((tip, i) => {
            const leftBase = i === 0 ? { x: 60, y: BASE_Y } : VALLEYS[i - 1]!;
            const rightBase = i === CROWN_TIPS.length - 1 ? { x: 440, y: BASE_Y } : VALLEYS[i]!;
            return (
              <g key={`facet-${i}`}>
                <motion.polygon
                  points={`${tip.x},${tip.y} ${leftBase.x},${leftBase.y} ${tip.x},${BASE_Y}`}
                  fill="#2dd4bf"
                  initial={{ opacity: 0 }}
                  animate={crownInView ? { opacity: [0, 0.08, 0.04] } : {}}
                  transition={{ duration: 1.5, delay: 2 + i * 0.1, ease: "easeOut" }}
                />
                <motion.polygon
                  points={`${tip.x},${tip.y} ${rightBase.x},${rightBase.y} ${tip.x},${BASE_Y}`}
                  fill="#2dd4bf"
                  initial={{ opacity: 0 }}
                  animate={crownInView ? { opacity: [0, 0.12, 0.06] } : {}}
                  transition={{ duration: 1.5, delay: 2 + i * 0.1, ease: "easeOut" }}
                />
              </g>
            );
          })}

          {/* Tip diamonds — flash then settle */}
          {CROWN_TIPS.map((tip, i) => (
            <motion.rect
              key={`td-${i}`}
              x={tip.x - 3} y={tip.y - 3} width="6" height="6"
              transform={`rotate(45 ${tip.x} ${tip.y})`}
              fill="#2dd4bf"
              initial={{ opacity: 0, scale: 0 }}
              animate={crownInView ? { opacity: [0, 0.8, 0.25], scale: 1 } : {}}
              transition={{ duration: 1.5, delay: 2.2 + i * 0.08 }}
            />
          ))}
        </svg>

        {/* MEDIENT HEALTH text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={crownInView ? { opacity: 1 } : {}}
          transition={{ delay: 3, duration: 1 }}
          className="mt-4 font-mono text-[0.7rem] tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Medient Health
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
        className="mt-12 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-gray-500 text-sm">© 2026 Medient Health. All rights reserved.</div>
          <div className="flex items-center gap-8 font-mono text-gray-500 text-sm tracking-[0.1em] uppercase">
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

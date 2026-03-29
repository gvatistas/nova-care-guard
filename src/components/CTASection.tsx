import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CROWN_TIPS = [
  { x: 100, y: 15 }, { x: 175, y: 8 }, { x: 250, y: 3 }, { x: 325, y: 8 }, { x: 400, y: 15 },
];
const VALLEYS = [
  { x: 137, y: 52 }, { x: 212, y: 45 }, { x: 288, y: 45 }, { x: 363, y: 52 },
];
const BASE_Y = 65;

function buildCrownPath() {
  const pts = [{ x: 60, y: BASE_Y }];
  for (let i = 0; i < CROWN_TIPS.length; i++) {
    pts.push(CROWN_TIPS[i]!);
    if (i < VALLEYS.length) pts.push(VALLEYS[i]!);
  }
  pts.push({ x: 440, y: BASE_Y });
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

const CONVERGE_LINES = CROWN_TIPS.map((tip, i) => {
  const origins = [{ x: -50, y: 80 }, { x: 50, y: -30 }, { x: 250, y: -40 }, { x: 450, y: -30 }, { x: 550, y: 80 }];
  return { from: origins[i]!, to: tip };
});

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const crownRef = useRef(null);
  const crownInView = useInView(crownRef, { once: true, margin: "-50px" });

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 overflow-hidden texture-diamonds">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <h2 className="text-white font-mono font-light leading-[1.15] tracking-[-0.02em] mb-4" style={{ fontSize: "2.5rem" }}>
            Unlocking the proactive healthcare patients deserve.
          </h2>
          <p className="font-light leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>
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

      {/* Closing Crown Animation */}
      <div ref={crownRef} className="mt-20 flex flex-col items-center">
        <svg viewBox="0 0 500 90" className="w-full max-w-[600px]" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="crownEndGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>

          {CONVERGE_LINES.map((line, i) => (
            <motion.line key={i}
              x1={line.from.x} y1={line.from.y}
              x2={line.from.x} y2={line.from.y}
              animate={crownInView ? { x2: line.to.x, y2: line.to.y } : {}}
              transition={{ duration: 2, delay: i * 0.1, ease: [0.42, 0, 0.58, 1] }}
              stroke="white" strokeWidth="0.6" opacity="0.15"
            />
          ))}

          <motion.path d={buildCrownPath()} fill="none" stroke="white" strokeWidth="1.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={crownInView ? { pathLength: 1, opacity: [0, 0.6, 0.6, 0.25] } : {}}
            transition={{ duration: 2.5, delay: 0.5, ease: [0.42, 0, 0.58, 1] }}
            filter="url(#crownEndGlow)" />

          <motion.line x1="60" y1={BASE_Y} x2="440" y2={BASE_Y} stroke="white" strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={crownInView ? { pathLength: 1, opacity: [0, 0.4, 0.4, 0.2] } : {}}
            transition={{ duration: 2, delay: 1, ease: [0.42, 0, 0.58, 1] }} />

          {CROWN_TIPS.map((tip, i) => {
            const leftBase = i === 0 ? { x: 60, y: BASE_Y } : VALLEYS[i - 1]!;
            const rightBase = i === CROWN_TIPS.length - 1 ? { x: 440, y: BASE_Y } : VALLEYS[i]!;
            return (
              <g key={`facet-${i}`}>
                <motion.polygon points={`${tip.x},${tip.y} ${leftBase.x},${leftBase.y} ${tip.x},${BASE_Y}`} fill="white"
                  initial={{ opacity: 0 }} animate={crownInView ? { opacity: [0, 0.06, 0.03] } : {}}
                  transition={{ duration: 1.5, delay: 2 + i * 0.1, ease: "easeOut" }} />
                <motion.polygon points={`${tip.x},${tip.y} ${rightBase.x},${rightBase.y} ${tip.x},${BASE_Y}`} fill="white"
                  initial={{ opacity: 0 }} animate={crownInView ? { opacity: [0, 0.08, 0.04] } : {}}
                  transition={{ duration: 1.5, delay: 2 + i * 0.1, ease: "easeOut" }} />
              </g>
            );
          })}

          {CROWN_TIPS.map((tip, i) => (
            <motion.rect key={`td-${i}`} x={tip.x - 3} y={tip.y - 3} width="6" height="6"
              transform={`rotate(45 ${tip.x} ${tip.y})`} fill="white"
              initial={{ opacity: 0, scale: 0 }}
              animate={crownInView ? { opacity: [0, 0.6, 0.2], scale: 1 } : {}}
              transition={{ duration: 1.5, delay: 2.2 + i * 0.08 }} />
          ))}
        </svg>

        <motion.div initial={{ opacity: 0 }} animate={crownInView ? { opacity: 1 } : {}} transition={{ delay: 3, duration: 1 }}
          className="mt-4 font-mono tracking-[0.3em] uppercase" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.3)" }}>
          Medient Health
        </motion.div>
      </div>

      <motion.footer initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
        className="mt-12 border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem" }}>© 2026 Medient Health. All rights reserved.</div>
          <div className="flex items-center gap-8 font-mono tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem" }}>
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

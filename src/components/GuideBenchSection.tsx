import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, type FC } from "react";

const guidelines = [
  { name: "USPSTF Lung Cancer (LDCT)", patients: 142, fidelity: 99.1, status: "Verified" },
  { name: "ACS Colorectal Screening", patients: 128, fidelity: 98.4, status: "Verified" },
  { name: "ACC/AHA Cardiovascular Risk", patients: 156, fidelity: 97.8, status: "Verified" },
  { name: "ADA Type 2 Diabetes", patients: 134, fidelity: 99.3, status: "Verified" },
  { name: "USPSTF Breast Cancer (Mammography)", patients: 98, fidelity: 98.9, status: "Verified" },
  { name: "USPSTF Cervical Cancer (Pap/HPV)", patients: 92, fidelity: 99.5, status: "Verified" },
];

const benchmarks = [
  { label: "Medient", score: 98.7, color: "#c8d6e5" },
  { label: "Industry Avg", score: 72.3, color: "rgba(255,255,255,0.12)" },
];

/* ── Verification brain — shapeshifting geometric entity ── */
const SHAPES = [
  "M 50,15 L 90,5 L 130,15 L 150,50 L 130,85 L 90,95 L 50,85 L 30,50 Z",
  "M 90,5 L 150,30 L 160,70 L 130,95 L 50,95 L 20,70 L 30,30 Z",
  "M 60,8 L 120,8 L 155,35 L 155,65 L 120,92 L 60,92 L 25,65 L 25,35 Z",
  "M 90,2 L 145,25 L 158,60 L 135,90 L 90,98 L 45,90 L 22,60 L 35,25 Z",
  "M 50,15 L 90,5 L 130,15 L 150,50 L 130,85 L 90,95 L 50,85 L 30,50 Z",
];
const INNER_LINES: string[][] = [
  ["M 50,15 L 130,85", "M 130,15 L 50,85", "M 90,5 L 90,95", "M 30,50 L 150,50", "M 50,15 L 90,50 L 130,15", "M 50,85 L 90,50 L 130,85"],
  ["M 90,5 L 90,95", "M 20,70 L 160,70", "M 30,30 L 130,95", "M 150,30 L 50,95", "M 90,5 L 90,50", "M 20,70 L 90,50 L 160,70"],
  ["M 60,8 L 120,92", "M 120,8 L 60,92", "M 25,35 L 155,65", "M 155,35 L 25,65", "M 90,50 L 60,8", "M 90,50 L 155,35"],
  ["M 90,2 L 90,98", "M 22,60 L 158,60", "M 35,25 L 135,90", "M 145,25 L 45,90", "M 90,50 L 90,2", "M 90,50 L 158,60"],
  ["M 50,15 L 130,85", "M 130,15 L 50,85", "M 90,5 L 90,95", "M 30,50 L 150,50", "M 50,15 L 90,50 L 130,15", "M 50,85 L 90,50 L 130,85"],
];

const VerificationBrain: FC<{ activeRow: number }> = ({ activeRow }) => {
  const [idx, setIdx] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx(p => (p + 1) % (SHAPES.length - 1)), 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let raf: number; let t = 0;
    const spin = () => { t += 0.002; setRotation(t * 10); raf = requestAnimationFrame(spin); };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nextIdx = (idx + 1) % SHAPES.length;
  // Pulse intensity based on active row verification
  const pulseIntensity = 0.3 + (activeRow % 6) * 0.1;

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: 200 }}>
      <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
        <defs>
          <filter id="brain-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="1.5" result="blur2" in="SourceGraphic" />
            <feMerge><feMergeNode in="blur1" /><feMergeNode in="blur2" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="brain-inner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="brain-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0">
              <animate attributeName="stopOpacity" values="0;0.12;0" dur="3.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.06">
              <animate attributeName="stopOpacity" values="0.06;0.2;0.06" dur="3.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0">
              <animate attributeName="stopOpacity" values="0;0.08;0" dur="3.5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Orbital rings */}
        <g style={{ transformOrigin: "90px 50px", transform: `rotate(${rotation}deg)` }}>
          <circle cx="90" cy="50" r="46" fill="none" stroke="white" strokeWidth="0.3" opacity="0.05" strokeDasharray="6 10" />
          <circle cx="90" cy="50" r="42" fill="none" stroke="white" strokeWidth="0.2" opacity="0.03" strokeDasharray="3 18" />
        </g>
        <g style={{ transformOrigin: "90px 50px", transform: `rotate(${-rotation * 0.7}deg)` }}>
          <circle cx="90" cy="50" r="50" fill="none" stroke="white" strokeWidth="0.15" opacity="0.04" strokeDasharray="2 14" />
        </g>

        {/* Shape morph */}
        <AnimatePresence mode="wait">
          <motion.g key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <motion.path d={SHAPES[idx]} fill="url(#brain-inner)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
            <motion.path d={SHAPES[idx]} fill="url(#brain-sweep)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
            {/* Facets */}
            <motion.path d={SHAPES[idx]} fill="white" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.03, 0.02] }} transition={{ duration: 1 }} />
          </motion.g>
        </AnimatePresence>

        {/* Outline */}
        <motion.path
          d={SHAPES[idx]} fill="none" stroke="#b8c4d0" strokeWidth="1" strokeLinejoin="miter"
          filter="url(#brain-glow)"
          initial={false} animate={{ d: SHAPES[nextIdx] }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={SHAPES[nextIdx]} fill="none" stroke="white" strokeWidth="0.2" strokeLinejoin="miter"
          initial={false} animate={{ d: SHAPES[(nextIdx + 1) % SHAPES.length] }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }} opacity={0.04}
        />

        {/* Inner structure lines */}
        <AnimatePresence mode="wait">
          <motion.g key={`s${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            {INNER_LINES[idx]?.map((d, i) => (
              <motion.path key={i} d={d} fill="none" stroke="#8899aa" strokeWidth="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.3, 0.15] }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </motion.g>
        </AnimatePresence>

        {/* Core pulse — intensity tied to verification */}
        <circle cx="90" cy="50" r="2" fill="white" opacity={pulseIntensity}>
          <animate attributeName="r" values="1;5;1" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${pulseIntensity};0.05;${pulseIntensity}`} dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="90" cy="50" r="1" fill="white" opacity="0.8">
          <animate attributeName="r" values="0.5;2;0.5" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Satellite dots */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={i} style={{ transformOrigin: "90px 50px", transform: `rotate(${angle + rotation * 1.5}deg)` }}>
            <circle cx="130" cy="50" r="0.7" fill="white" opacity={0.15 + (i % 3) * 0.08}>
              <animate attributeName="opacity" values={`${0.1 + i * 0.03};0.03;${0.1 + i * 0.03}`} dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>

      {/* Active verification label */}
      <motion.div
        className="absolute bottom-2 text-center"
        key={activeRow}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/20">
          Verifying: {guidelines[activeRow % guidelines.length].name.split(' ')[0]}
        </p>
      </motion.div>
    </div>
  );
};

const GuideBenchSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [counter, setCounter] = useState(0);
  const [activeRow, setActiveRow] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const target = 98.7;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCounter(parseFloat((progress * target).toFixed(1)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView]);

  // Cycle through rows to show brain "verifying" each
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => setActiveRow(p => (p + 1) % guidelines.length), 2800);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#1a1d21" }}>
      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[12px] font-medium uppercase text-white/25 mb-3" style={{ letterSpacing: "0.1em" }}>
            Verification Lab
          </p>
          <h2 className="text-white font-semibold text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em" }}>
            GuideBench
          </h2>
          <p className="text-white/45 mt-2 text-lg max-w-2xl" style={{ letterSpacing: "-0.01em" }}>
            The open-source clinical decision logic evaluation framework.
            <span className="text-white/70 font-medium"> 10 guidelines. 750+ synthetic patients. 4 fidelity metrics.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Counter + brain + benchmark chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="text-center mb-4">
                <div className="text-7xl font-semibold tabular-nums" style={{ letterSpacing: "-0.04em", lineHeight: 1, color: "#4ade80" }}>
                {counter}%
              </div>
              <p className="text-[12px] font-medium uppercase text-white/25 mt-3" style={{ letterSpacing: "0.1em" }}>
                Aggregate Fidelity Score
              </p>
            </div>

            {/* Shapeshifting verification brain */}
            <VerificationBrain activeRow={activeRow} />

            {/* Benchmark bars */}
            <div className="w-full space-y-3">
              {benchmarks.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-white/35" style={{ letterSpacing: "0.05em" }}>{b.label}</span>
                    <span className="text-[13px] font-semibold text-white/60">{b.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04]">
                    <motion.div
                      className="h-full"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${b.score}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      style={{ backgroundColor: b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Data table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="border border-white/[0.08] overflow-hidden" style={{ background: "#1e2227" }}>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-b border-white/[0.08]" style={{ background: "rgba(255,255,255,0.02)" }}>
                {["Guideline", "Patients", "Fidelity", "Status"].map((h) => (
                  <span key={h} className="text-[11px] font-semibold uppercase text-white/40" style={{ letterSpacing: "0.12em" }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Table rows */}
              {guidelines.map((g, i) => (
                <motion.div
                  key={g.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className={`grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-b border-white/[0.04] transition-all duration-500 group cursor-default ${
                    activeRow === i ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <span className={`text-sm font-medium transition-colors duration-300 ${activeRow === i ? "text-white" : "text-white/80 group-hover:text-white"}`} style={{ letterSpacing: "-0.01em" }}>{g.name}</span>
                  <span className="text-white/45 text-sm tabular-nums font-mono">{g.patients}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: activeRow === i ? "linear-gradient(90deg, #c8d6e5, #ffffff)" : "linear-gradient(90deg, #5a6a7a, #8899aa)" }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${g.fidelity}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <span className={`font-semibold text-sm tabular-nums font-mono transition-colors duration-300 ${activeRow === i ? "text-white" : "text-white/70"}`}>{g.fidelity}%</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      animate={{
                        background: activeRow === i ? "#ffffff" : "#5a6a7a",
                        boxShadow: activeRow === i ? "0 0 8px rgba(255,255,255,0.5)" : "0 0 4px rgba(90,106,122,0.3)",
                      }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className={`text-[11px] font-semibold uppercase transition-colors duration-300 ${activeRow === i ? "text-white" : "text-white/40"}`} style={{ letterSpacing: "0.06em" }}>{g.status}</span>
                  </span>
                </motion.div>
              ))}

              {/* Table footer — aggregate */}
              <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-t border-white/[0.08]" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="text-white/50 text-sm font-semibold uppercase" style={{ letterSpacing: "0.06em" }}>Aggregate</span>
                <span className="text-white/45 text-sm tabular-nums font-mono">750</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #c8d6e5, #ffffff)" }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: "98.7%" } : {}}
                      transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm tabular-nums font-mono">98.7%</span>
                </div>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ffffff", boxShadow: "0 0 8px rgba(255,255,255,0.5)" }} />
                  <span className="text-[11px] font-bold uppercase text-white/70" style={{ letterSpacing: "0.06em" }}>Live</span>
                </span>
              </div>
            </div>

            {/* Statement + CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="mt-8"
            >
              <p className="text-white font-semibold text-xl mb-6" style={{ letterSpacing: "-0.02em" }}>
                We wrote the test. Then we open-sourced it.
              </p>
              <a
                href="#"
                className="inline-block text-[13px] font-medium uppercase text-white border border-white/20 px-8 py-3.5 hover:bg-white hover:text-black transition-all duration-300"
                style={{ letterSpacing: "0.05em" }}
              >
                View on GitHub
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GuideBenchSection;

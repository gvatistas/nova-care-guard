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
  { label: "Medient", score: 98.7, color: "#374151" },
  { label: "Industry Avg", score: 72.3, color: "#E5E7EB" },
];

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
            <stop offset="0%" stopColor="#6B7280" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6B7280" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="brain-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B7280" stopOpacity="0">
              <animate attributeName="stopOpacity" values="0;0.12;0" dur="3.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#6B7280" stopOpacity="0.06">
              <animate attributeName="stopOpacity" values="0.06;0.2;0.06" dur="3.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#6B7280" stopOpacity="0">
              <animate attributeName="stopOpacity" values="0;0.08;0" dur="3.5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        <g style={{ transformOrigin: "90px 50px", transform: `rotate(${rotation}deg)` }}>
          <circle cx="90" cy="50" r="46" fill="none" stroke="#9CA3AF" strokeWidth="0.3" opacity="0.15" strokeDasharray="6 10" />
          <circle cx="90" cy="50" r="42" fill="none" stroke="#D1D5DB" strokeWidth="0.2" opacity="0.1" strokeDasharray="3 18" />
        </g>
        <g style={{ transformOrigin: "90px 50px", transform: `rotate(${-rotation * 0.7}deg)` }}>
          <circle cx="90" cy="50" r="50" fill="none" stroke="#9CA3AF" strokeWidth="0.15" opacity="0.1" strokeDasharray="2 14" />
        </g>

        <AnimatePresence mode="wait">
          <motion.g key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <motion.path d={SHAPES[idx]} fill="url(#brain-inner)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
            <motion.path d={SHAPES[idx]} fill="url(#brain-sweep)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
            <motion.path d={SHAPES[idx]} fill="#6B7280" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.03, 0.02] }} transition={{ duration: 1 }} />
          </motion.g>
        </AnimatePresence>

        <motion.path
          d={SHAPES[idx]} fill="none" stroke="#374151" strokeWidth="1" strokeLinejoin="miter"
          filter="url(#brain-glow)"
          initial={false} animate={{ d: SHAPES[nextIdx] }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={SHAPES[nextIdx]} fill="none" stroke="#9CA3AF" strokeWidth="0.2" strokeLinejoin="miter"
          initial={false} animate={{ d: SHAPES[(nextIdx + 1) % SHAPES.length] }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }} opacity={0.1}
        />

        <AnimatePresence mode="wait">
          <motion.g key={`s${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            {INNER_LINES[idx]?.map((d, i) => (
              <motion.path key={i} d={d} fill="none" stroke="#9CA3AF" strokeWidth="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.3, 0.15] }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </motion.g>
        </AnimatePresence>

        <circle cx="90" cy="50" r="2" fill="#374151" opacity={pulseIntensity}>
          <animate attributeName="r" values="1;5;1" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${pulseIntensity};0.05;${pulseIntensity}`} dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="90" cy="50" r="1" fill="#9CA3AF" opacity="0.8">
          <animate attributeName="r" values="0.5;2;0.5" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={i} style={{ transformOrigin: "90px 50px", transform: `rotate(${angle + rotation * 1.5}deg)` }}>
            <circle cx="130" cy="50" r="0.7" fill="#6B7280" opacity={0.15 + (i % 3) * 0.08}>
              <animate attributeName="opacity" values={`${0.1 + i * 0.03};0.03;${0.1 + i * 0.03}`} dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>

      <motion.div
        className="absolute bottom-2 text-center"
        key={activeRow}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "#6B7280" }}>
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

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => setActiveRow(p => (p + 1) % guidelines.length), 2800);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#F3F4F6" }}>
      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[12px] font-medium uppercase mb-3" style={{ letterSpacing: "0.1em", color: "#6B7280" }}>
            Verification Lab
          </p>
          <h2 className="font-semibold text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em", color: "#111827" }}>
            GuideBench
          </h2>
          <p className="mt-2 text-lg max-w-2xl" style={{ letterSpacing: "-0.01em", color: "#374151" }}>
            The open-source clinical decision logic evaluation framework.
            <span className="font-medium" style={{ color: "#111827" }}> 10 guidelines. 750+ synthetic patients. 4 fidelity metrics.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="text-center mb-4">
              {/* Fidelity score — DATA, so color is earned */}
              <div className="text-7xl font-semibold tabular-nums" style={{ letterSpacing: "-0.04em", lineHeight: 1, color: "#2563EB" }}>
                {counter}%
              </div>
              <p className="text-[12px] font-medium uppercase mt-3" style={{ letterSpacing: "0.1em", color: "#6B7280" }}>
                Aggregate Fidelity Score
              </p>
            </div>

            <VerificationBrain activeRow={activeRow} />

            <div className="w-full space-y-3">
              {benchmarks.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium" style={{ letterSpacing: "0.05em", color: "#6B7280" }}>{b.label}</span>
                    <span className="text-[13px] font-semibold" style={{ color: "#111827" }}>{b.score}%</span>
                  </div>
                  <div className="h-1.5" style={{ background: "#E5E7EB" }}>
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }}>
              <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-b" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
                {["Guideline", "Patients", "Fidelity", "Status"].map((h) => (
                  <span key={h} className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: "#6B7280" }}>
                    {h}
                  </span>
                ))}
              </div>

              {guidelines.map((g, i) => (
                <motion.div
                  key={g.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-b transition-all duration-500 group cursor-default"
                  style={{
                    borderColor: "#E5E7EB20",
                    backgroundColor: activeRow === i ? "rgba(17,24,39,0.03)" : "transparent",
                  }}
                >
                  <span className="text-sm font-medium transition-colors duration-300" style={{ letterSpacing: "-0.01em", color: activeRow === i ? "#111827" : "#374151" }}>{g.name}</span>
                  <span className="text-sm tabular-nums font-mono" style={{ color: "#6B7280" }}>{g.patients}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: activeRow === i ? "#374151" : "#D1D5DB" }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${g.fidelity}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="font-semibold text-sm tabular-nums font-mono transition-colors duration-300" style={{ color: activeRow === i ? "#111827" : "#6B7280" }}>{g.fidelity}%</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      animate={{
                        background: activeRow === i ? "#2563EB" : "#D1D5DB",
                        boxShadow: activeRow === i ? "0 0 8px rgba(37,99,235,0.4)" : "none",
                      }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="text-[11px] font-semibold uppercase transition-colors duration-300" style={{ letterSpacing: "0.06em", color: activeRow === i ? "#2563EB" : "#6B7280" }}>{g.status}</span>
                  </span>
                </motion.div>
              ))}

              <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-t" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
                <span className="text-sm font-semibold uppercase" style={{ letterSpacing: "0.06em", color: "#6B7280" }}>Aggregate</span>
                <span className="text-sm tabular-nums font-mono" style={{ color: "#6B7280" }}>750</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#374151" }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: "98.7%" } : {}}
                      transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  <span className="font-bold text-sm tabular-nums font-mono" style={{ color: "#111827" }}>98.7%</span>
                </div>
                <span className="inline-flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#2563EB", boxShadow: "0 0 8px rgba(37,99,235,0.4)" }} />
                   <span className="text-[11px] font-bold uppercase" style={{ letterSpacing: "0.06em", color: "#2563EB" }}>Live</span>
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="mt-8"
            >
              <a
                href="#"
                className="inline-block text-[13px] font-medium uppercase border px-8 py-3.5 transition-all duration-300 hover:bg-[#111827] hover:text-white hover:border-[#111827]"
                style={{ letterSpacing: "0.05em", color: "#111827", borderColor: "#374151" }}
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

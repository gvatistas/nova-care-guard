import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const guidelines = [
  { name: "USPSTF Lung Cancer (LDCT)", patients: 142, fidelity: 99.1, status: "Verified" },
  { name: "ACS Colorectal Screening", patients: 128, fidelity: 98.4, status: "Verified" },
  { name: "ACC/AHA Cardiovascular Risk", patients: 156, fidelity: 97.8, status: "Verified" },
  { name: "ADA Type 2 Diabetes", patients: 134, fidelity: 99.3, status: "Verified" },
  { name: "USPSTF Breast Cancer (Mammography)", patients: 98, fidelity: 98.9, status: "Verified" },
  { name: "USPSTF Cervical Cancer (Pap/HPV)", patients: 92, fidelity: 99.5, status: "Verified" },
];

const benchmarks = [
  { label: "Medient", score: 98.7, color: "#00d4aa" },
  { label: "Industry Avg", score: 72.3, color: "rgba(255,255,255,0.25)" },
];

const GuideBenchSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [counter, setCounter] = useState(0);

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

  return (
    <section ref={ref} className="relative py-24 md:py-32" style={{ background: "#0d1117" }}>
      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[12px] font-medium uppercase text-white/30 mb-3" style={{ letterSpacing: "0.1em" }}>
            Verification Lab
          </p>
          <h2 className="text-white font-semibold text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em" }}>
            GuideBench
          </h2>
          <p className="text-white/50 mt-2 text-lg max-w-2xl" style={{ letterSpacing: "-0.01em" }}>
            The open-source clinical decision logic evaluation framework.
            <span className="text-white font-medium"> 10 guidelines. 750+ synthetic patients. 4 fidelity metrics.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Counter + benchmark chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="text-center mb-8">
              <div className="text-7xl font-semibold text-white tabular-nums" style={{ letterSpacing: "-0.04em", lineHeight: 1 }}>
                {counter}%
              </div>
              <p className="text-[12px] font-medium uppercase text-white/30 mt-3" style={{ letterSpacing: "0.1em" }}>
                Aggregate Fidelity Score
              </p>
            </div>

            {/* Benchmark bars */}
            <div className="w-full space-y-3">
              {benchmarks.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-white/40" style={{ letterSpacing: "0.05em" }}>{b.label}</span>
                    <span className="text-[13px] font-semibold text-white/70">{b.score}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.04]">
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
            <div className="border border-white/[0.12] overflow-hidden" style={{ background: "#141a22" }}>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-b border-white/[0.12]" style={{ background: "rgba(0,212,170,0.08)" }}>
                {["Guideline", "Patients", "Fidelity", "Status"].map((h) => (
                  <span key={h} className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: "#00d4aa" }}>
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
                  className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-b border-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 group cursor-default"
                >
                  <span className="text-white/90 text-sm font-medium group-hover:text-white transition-colors" style={{ letterSpacing: "-0.01em" }}>{g.name}</span>
                  <span className="text-white/50 text-sm tabular-nums font-mono">{g.patients}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #00d4aa, #00e8bb)" }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${g.fidelity}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-white font-semibold text-sm tabular-nums font-mono">{g.fidelity}%</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00d4aa", boxShadow: "0 0 6px rgba(0,212,170,0.5)" }} />
                    <span className="text-[11px] font-semibold uppercase" style={{ color: "#00d4aa", letterSpacing: "0.06em" }}>{g.status}</span>
                  </span>
                </motion.div>
              ))}

              {/* Table footer — aggregate */}
              <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-6 py-4 border-t border-white/[0.12]" style={{ background: "rgba(0,212,170,0.06)" }}>
                <span className="text-white/60 text-sm font-semibold uppercase" style={{ letterSpacing: "0.06em" }}>Aggregate</span>
                <span className="text-white/50 text-sm tabular-nums font-mono">750</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #00d4aa, #00ffcc)" }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: "98.7%" } : {}}
                      transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm tabular-nums font-mono" style={{ color: "#00d4aa" }}>98.7%</span>
                </div>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d4aa", boxShadow: "0 0 8px rgba(0,212,170,0.6)" }} />
                  <span className="text-[11px] font-bold uppercase" style={{ color: "#00d4aa", letterSpacing: "0.06em" }}>Live</span>
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
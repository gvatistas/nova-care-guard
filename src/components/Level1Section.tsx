import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const RED = "#ef4444";
const AMBER = "#f59e0b";
const WHITE = "#ffffff";

const Level1Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setStep((s) => (s < 4 ? s + 1 : s));
    }, 2200);
    return () => clearInterval(interval);
  }, [inView]);

  const stepLabels = ["Patient arrives", "Risks detected", "Clinical analysis", "Screenings ordered", "Patient outcome"];

  return (
    <section ref={ref} className="relative py-24 md:py-32 texture-diamonds">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.01),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-10">
          <h2 className="text-white font-mono font-light leading-[1.15] tracking-[-0.02em]" style={{ fontSize: "2.5rem" }}>
            Same patient. Same clinic. <span style={{ color: "rgba(255,255,255,0.45)" }}>Different outcome.</span>
          </h2>
          <p className="font-mono mt-3" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>Sarah Mitchell, 52 — 3 undetected risks enter the same clinical workflow.</p>
        </motion.div>

        {/* Timeline progress */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
          className="flex items-center gap-0 mb-10 w-full">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-1.5 w-full">
                <button onClick={() => setStep(i)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono transition-all duration-500 ${
                    step >= i
                      ? "border-white/60 bg-white/10 text-white"
                      : "border-white/10 text-gray-600"
                  }`}
                  style={{ fontSize: "0.875rem" }}>
                  {i + 1}
                </button>
                <span className={`font-mono tracking-[0.1em] uppercase transition-colors duration-300 ${step >= i ? "text-white/60" : "text-gray-600"}`} style={{ fontSize: "0.75rem" }}>
                  {label}
                </span>
              </div>
              {i < 4 && (
                <div className="flex-1 h-px mx-1 relative">
                  <div className="absolute inset-0 bg-white/10" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white/40"
                    animate={{ width: step > i ? "100%" : "0%" }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Side by side paths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* WITHOUT MEDIENT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="border border-red-500/10 bg-white/[0.01] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between"
              style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.06), transparent)" }}>
              <span className="font-mono tracking-[0.15em] uppercase" style={{ color: RED, fontSize: "1rem" }}>Without Medient</span>
              <span className="font-mono tracking-[0.1em] uppercase" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>Standard workflow</span>
            </div>

            <div className="p-5 space-y-0">
              <AnimatePresence mode="wait">
                {step >= 0 && (
                  <motion.div key="w-patient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                        <span className="font-mono text-white/60" style={{ fontSize: "1.125rem" }}>S</span>
                      </div>
                      <div>
                        <div className="font-mono text-white" style={{ fontSize: "1rem" }}>Sarah Mitchell, 52</div>
                        <div className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>Routine 15-min visit</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step >= 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>Risk signals (3 present)</div>
                  {[
                    { label: "Lung — 20 pack-year smoking history", found: step >= 2 },
                    { label: "Colorectal — No colonoscopy, age 52", found: false },
                    { label: "Cardiovascular — BP 142/88", found: false },
                  ].map((risk, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: risk.found ? AMBER : `${RED}66` }}
                      />
                      <span className={`font-mono ${risk.found ? "text-white/70" : "text-gray-600"}`} style={{ fontSize: "0.875rem" }}>{risk.label}</span>
                      {!risk.found && step >= 2 && (
                        <span className="ml-auto font-mono tracking-[0.1em] uppercase" style={{ color: RED, fontSize: "0.75rem" }}>MISSED</span>
                      )}
                      {risk.found && (
                        <span className="ml-auto font-mono tracking-[0.1em] uppercase text-amber-400" style={{ fontSize: "0.75rem" }}>NOTICED</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {step >= 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="py-3 px-4 border border-white/[0.06] bg-white/[0.01]">
                    <div className="font-mono tracking-[0.15em] uppercase mb-2" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>MD Manual Review</div>
                    <div className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Time pressure · No decision support · Guidelines not consulted</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1 bg-white/[0.06]">
                        <motion.div animate={{ width: "33%" }} className="h-full" style={{ backgroundColor: AMBER }} />
                      </div>
                      <span className="font-mono" style={{ color: AMBER, fontSize: "0.875rem" }}>1 / 3</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>Screenings ordered</div>
                  <div className="py-2 px-3 border-l-2 mb-1" style={{ borderColor: AMBER, background: `${AMBER}08` }}>
                    <span className="font-mono text-white/70" style={{ fontSize: "0.875rem" }}>Chest X-ray ordered</span>
                    <span className="font-mono ml-2" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>(not LDCT — wrong test)</span>
                  </div>
                  <div className="py-2 px-3 border-l-2 mb-1" style={{ borderColor: `${RED}44`, background: `${RED}06` }}>
                    <span className="font-mono text-gray-600 line-through" style={{ fontSize: "0.875rem" }}>Colonoscopy</span>
                    <span className="font-mono ml-2" style={{ color: RED, fontSize: "0.75rem" }}>Not ordered</span>
                  </div>
                  <div className="py-2 px-3 border-l-2" style={{ borderColor: `${RED}44`, background: `${RED}06` }}>
                    <span className="font-mono text-gray-600 line-through" style={{ fontSize: "0.875rem" }}>BP Management</span>
                    <span className="font-mono ml-2" style={{ color: RED, fontSize: "0.75rem" }}>Not addressed</span>
                  </div>
                </motion.div>
              )}

              {step >= 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="border py-4 px-4 text-center" style={{ borderColor: `${RED}33`, background: `${RED}08` }}>
                  <div className="font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${RED}AA`, fontSize: "0.75rem" }}>18 months later</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Late-stage diagnosis</span>
                      <span className="font-mono" style={{ color: RED, fontSize: "1rem" }}>Stage IIIB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Treatment cost</span>
                      <span className="font-mono" style={{ color: RED, fontSize: "1rem" }}>$280K+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Survival rate</span>
                      <span className="font-mono" style={{ color: RED, fontSize: "1rem" }}>Significantly reduced</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* WITH MEDIENT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="border border-white/10 bg-white/[0.01] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between"
              style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.04), transparent)" }}>
              <span className="font-mono tracking-[0.15em] uppercase text-white" style={{ fontSize: "1rem" }}>With Medient</span>
              <span className="font-mono tracking-[0.1em] uppercase" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>Clinical logic pipeline</span>
            </div>

            <div className="p-5 space-y-0">
              {step >= 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center bg-white/[0.04]">
                      <span className="font-mono text-white/80" style={{ fontSize: "1.125rem" }}>S</span>
                    </div>
                    <div>
                      <div className="font-mono text-white" style={{ fontSize: "1rem" }}>Sarah Mitchell, 52</div>
                      <div className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>EHR data auto-ingested in &lt;0.3s</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step >= 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>All risk signals identified</div>
                  {[
                    { label: "Lung — LDCT eligible, USPSTF criteria met", color: RED, tag: "CRITICAL" },
                    { label: "Colorectal — Colonoscopy overdue per ACS", color: AMBER, tag: "HIGH" },
                    { label: "Cardiovascular — Statin evaluation per ACC/AHA", color: WHITE, tag: "ELEVATED" },
                  ].map((risk, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.15 }}
                      className="flex items-center gap-3 py-2 border-b border-white/[0.04]"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: risk.color }}
                      />
                      <span className="font-mono text-white/80 flex-1" style={{ fontSize: "0.875rem" }}>{risk.label}</span>
                      <span className="font-mono tracking-[0.1em] uppercase px-1.5 py-0.5 border rounded-sm"
                        style={{ color: risk.color, borderColor: `${risk.color}44`, fontSize: "0.75rem" }}>
                        {risk.tag}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {step >= 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="py-3 px-4 border border-white/[0.1] bg-white/[0.02]">
                    <div className="font-mono tracking-[0.15em] uppercase text-white/60 mb-2" style={{ fontSize: "0.875rem" }}>Medient Clinical Engine</div>
                    <div className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Deterministic · Guideline-compiled · Every pathway verified</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1 bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-white/60"
                        />
                      </div>
                      <span className="font-mono text-white/70" style={{ fontSize: "0.875rem" }}>3 / 3</span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {["INGEST", "COMPILE", "VERIFY", "EXECUTE"].map((s, i) => (
                        <motion.span key={s}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.25 }}
                          className="font-mono tracking-[0.15em] uppercase text-white/50 border border-white/10 px-1.5 py-0.5"
                          style={{ fontSize: "0.75rem" }}>
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>Screenings ordered</div>
                  {[
                    { name: "Low-Dose CT Lung Screening", status: "ORDERED", guideline: "USPSTF A" },
                    { name: "Colonoscopy", status: "SCHEDULED", guideline: "ACS" },
                    { name: "Hypertension Management + Statin", status: "FLAGGED", guideline: "ACC/AHA" },
                  ].map((order, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="py-2 px-3 border-l-2 border-white/40 mb-1 bg-white/[0.02] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-white/80" style={{ fontSize: "0.875rem" }}>{order.name}</span>
                        <span className="font-mono ml-2" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>{order.guideline}</span>
                      </div>
                      <span className="font-mono tracking-[0.1em] uppercase text-white/60" style={{ fontSize: "0.75rem" }}>{order.status}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {step >= 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="border border-white/20 py-4 px-4 text-center bg-white/[0.03]">
                  <div className="font-mono tracking-[0.2em] uppercase text-white/50 mb-3" style={{ fontSize: "0.75rem" }}>Same visit · Same day</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Detection</span>
                      <span className="font-mono text-white" style={{ fontSize: "1rem" }}>Caught early — Stage IA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Screening cost</span>
                      <span className="font-mono text-white" style={{ fontSize: "1rem" }}>$4,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Survival rate</span>
                      <span className="font-mono text-white" style={{ fontSize: "1rem" }}>Significantly improved</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {step >= 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
            <button onClick={() => setStep(0)}
              className="font-mono tracking-[0.15em] uppercase text-gray-500 hover:text-white border border-white/10 px-6 py-2 transition-colors duration-300"
              style={{ fontSize: "1rem" }}>
              Replay
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Level1Section;

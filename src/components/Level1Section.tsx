import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const RED = "#E11D48";
const AMBER = "#F59E0B";
const WHITE_TEXT = "#0F172A";

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
    <section ref={ref} className="relative py-24 md:py-32" style={{ background: "#F8FAFC" }}>
      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-10">
          <h2 className="font-mono font-light leading-[1.15] tracking-[-0.02em]" style={{ fontSize: "2.5rem", color: "#0F172A" }}>
            Same patient. Same clinic. <span style={{ color: "#64748B" }}>Different outcome.</span>
          </h2>
          <p className="font-mono mt-3" style={{ color: "#334155", fontSize: "1.125rem" }}>Sarah Mitchell, 52 — 3 undetected risks enter the same clinical workflow.</p>
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
                      ? "border-[#2563EB] bg-[#2563EB]/10 text-[#0F172A]"
                      : "border-[#E2E8F0] text-[#94A3B8]"
                  }`}
                  style={{ fontSize: "0.875rem" }}>
                  {i + 1}
                </button>
                <span className={`font-mono tracking-[0.1em] uppercase transition-colors duration-300 ${step >= i ? "text-[#334155]" : "text-[#94A3B8]"}`} style={{ fontSize: "0.75rem" }}>
                  {label}
                </span>
              </div>
              {i < 4 && (
                <div className="flex-1 h-px mx-1 relative">
                  <div className="absolute inset-0" style={{ background: "#E2E8F0" }} />
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{ background: "#2563EB" }}
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
            className="border overflow-hidden" style={{ borderColor: "#E2E8F0", background: "#FFF1F2" }}
          >
            <div className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "#E2E8F0", background: "linear-gradient(90deg, rgba(225,29,72,0.06), transparent)" }}>
              <span className="font-mono tracking-[0.15em] uppercase" style={{ color: RED, fontSize: "1rem" }}>Without Medient</span>
              <span className="font-mono tracking-[0.1em] uppercase" style={{ fontSize: "0.75rem", color: "#64748B" }}>Standard workflow</span>
            </div>

            <div className="p-5 space-y-0" style={{ background: "#FFFFFF" }}>
              <AnimatePresence mode="wait">
                {step >= 0 && (
                  <motion.div key="w-patient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: "#E2E8F0" }}>
                        <span className="font-mono" style={{ fontSize: "1.125rem", color: "#334155" }}>S</span>
                      </div>
                      <div>
                        <div className="font-mono" style={{ fontSize: "1rem", color: "#0F172A" }}>Sarah Mitchell, 52</div>
                        <div className="font-mono" style={{ fontSize: "0.875rem", color: "#64748B" }}>Routine 15-min visit</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step >= 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.75rem", color: "#64748B" }}>Risk signals (3 present)</div>
                  {[
                    { label: "Lung — 20 pack-year smoking history", found: step >= 2 },
                    { label: "Colorectal — No colonoscopy, age 52", found: false },
                    { label: "Cardiovascular — BP 142/88", found: false },
                  ].map((risk, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "#E2E8F010" }}>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: risk.found ? AMBER : `${RED}66` }}
                      />
                      <span className={`font-mono ${risk.found ? "" : ""}`} style={{ fontSize: "0.875rem", color: risk.found ? "#334155" : "#94A3B8" }}>{risk.label}</span>
                      {!risk.found && step >= 2 && (
                        <span className="ml-auto font-mono tracking-[0.1em] uppercase" style={{ color: RED, fontSize: "0.75rem" }}>MISSED</span>
                      )}
                      {risk.found && (
                        <span className="ml-auto font-mono tracking-[0.1em] uppercase" style={{ fontSize: "0.75rem", color: "#64748B" }}>NOTICED</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {step >= 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="py-3 px-4 border" style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
                    <div className="font-mono tracking-[0.15em] uppercase mb-2" style={{ fontSize: "0.875rem", color: "#64748B" }}>MD Manual Review</div>
                    <div className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Time pressure · No decision support · Guidelines not consulted</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1" style={{ background: "#E2E8F0" }}>
                        <motion.div animate={{ width: "33%" }} className="h-full" style={{ backgroundColor: AMBER }} />
                      </div>
                      <span className="font-mono" style={{ color: AMBER, fontSize: "0.875rem" }}>1 / 3</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.75rem", color: "#64748B" }}>Screenings ordered</div>
                  <div className="py-2 px-3 border-l-2 mb-1" style={{ borderColor: AMBER, background: `${AMBER}08` }}>
                    <span className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Chest X-ray ordered</span>
                    <span className="font-mono ml-2" style={{ fontSize: "0.75rem", color: "#64748B" }}>(not LDCT — wrong test)</span>
                  </div>
                  <div className="py-2 px-3 border-l-2 mb-1" style={{ borderColor: `${RED}44`, background: `${RED}06` }}>
                    <span className="font-mono line-through" style={{ fontSize: "0.875rem", color: "#94A3B8" }}>Colonoscopy</span>
                    <span className="font-mono ml-2" style={{ color: RED, fontSize: "0.75rem" }}>Not ordered</span>
                  </div>
                  <div className="py-2 px-3 border-l-2" style={{ borderColor: `${RED}44`, background: `${RED}06` }}>
                    <span className="font-mono line-through" style={{ fontSize: "0.875rem", color: "#94A3B8" }}>BP Management</span>
                    <span className="font-mono ml-2" style={{ color: RED, fontSize: "0.75rem" }}>Not addressed</span>
                  </div>
                </motion.div>
              )}

              {step >= 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="border py-4 px-4 text-center" style={{ borderColor: `${RED}33`, background: "#FFF1F2" }}>
                  <div className="font-mono tracking-[0.2em] uppercase mb-3" style={{ color: `${RED}AA`, fontSize: "0.75rem" }}>18 months later</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Late-stage diagnosis</span>
                      <span className="font-mono" style={{ color: RED, fontSize: "1rem" }}>Stage IIIB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Treatment cost</span>
                      <span className="font-mono" style={{ color: RED, fontSize: "1rem" }}>$280K+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Survival rate</span>
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
            className="border overflow-hidden" style={{ borderColor: "#E2E8F0", background: "#F0FDFA" }}
          >
            <div className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "#E2E8F0", background: "linear-gradient(90deg, rgba(20,184,166,0.06), transparent)" }}>
              <span className="font-mono tracking-[0.15em] uppercase" style={{ color: "#14B8A6", fontSize: "1rem" }}>With Medient</span>
              <span className="font-mono tracking-[0.1em] uppercase" style={{ fontSize: "0.75rem", color: "#64748B" }}>Clinical logic pipeline</span>
            </div>

            <div className="p-5 space-y-0" style={{ background: "#FFFFFF" }}>
              {step >= 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: "#14B8A6", background: "rgba(20,184,166,0.05)" }}>
                      <span className="font-mono" style={{ fontSize: "1.125rem", color: "#0F172A" }}>S</span>
                    </div>
                    <div>
                      <div className="font-mono" style={{ fontSize: "1rem", color: "#0F172A" }}>Sarah Mitchell, 52</div>
                      <div className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>EHR data auto-ingested in &lt;0.3s</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step >= 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.75rem", color: "#64748B" }}>All risk signals identified</div>
                  {[
                    { label: "Lung — LDCT eligible, USPSTF criteria met", color: RED, tag: "CRITICAL" },
                    { label: "Colorectal — Colonoscopy overdue per ACS", color: AMBER, tag: "HIGH" },
                    { label: "Cardiovascular — Statin evaluation per ACC/AHA", color: "#0F172A", tag: "ELEVATED" },
                  ].map((risk, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.15 }}
                      className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "#E2E8F020" }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: risk.color }}
                      />
                      <span className="font-mono flex-1" style={{ fontSize: "0.875rem", color: "#334155" }}>{risk.label}</span>
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
                  <div className="py-3 px-4 border" style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
                    <div className="font-mono tracking-[0.15em] uppercase mb-2" style={{ fontSize: "0.875rem", color: "#334155" }}>Medient Clinical Engine</div>
                    <div className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Deterministic · Guideline-compiled · Every pathway verified</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1" style={{ background: "#E2E8F0" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full" style={{ background: "#2563EB" }}
                        />
                      </div>
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "#0F172A" }}>3 / 3</span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {["INGEST", "COMPILE", "VERIFY", "EXECUTE"].map((s, i) => (
                        <motion.span key={s}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.25 }}
                          className="font-mono tracking-[0.15em] uppercase border px-1.5 py-0.5"
                          style={{ fontSize: "0.75rem", color: "#64748B", borderColor: "#E2E8F0" }}>
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <div className="font-mono tracking-[0.2em] uppercase mb-2" style={{ fontSize: "0.75rem", color: "#64748B" }}>Screenings ordered</div>
                  {[
                    { name: "Low-Dose CT Lung Screening", status: "ORDERED", guideline: "USPSTF A" },
                    { name: "Colonoscopy", status: "SCHEDULED", guideline: "ACS" },
                    { name: "Hypertension Management + Statin", status: "FLAGGED", guideline: "ACC/AHA" },
                  ].map((order, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="py-2 px-3 border-l-2 mb-1 flex items-center justify-between"
                      style={{ borderColor: "#14B8A6", background: "rgba(20,184,166,0.04)" }}
                    >
                      <div>
                        <span className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>{order.name}</span>
                        <span className="font-mono ml-2" style={{ fontSize: "0.75rem", color: "#64748B" }}>{order.guideline}</span>
                      </div>
                      <span className="font-mono tracking-[0.1em] uppercase" style={{ fontSize: "0.75rem", color: "#06B6D4" }}>{order.status}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {step >= 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="border py-4 px-4 text-center" style={{ borderColor: "#14B8A6", background: "#F0FDFA" }}>
                  <div className="font-mono tracking-[0.2em] uppercase mb-3" style={{ color: "#64748B", fontSize: "0.75rem" }}>Same visit · Same day</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Detection</span>
                      <span className="font-mono" style={{ color: "#0F172A", fontSize: "1rem" }}>Caught early — Stage IA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Screening cost</span>
                      <span className="font-mono" style={{ color: "#0F172A", fontSize: "1rem" }}>$4,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono" style={{ fontSize: "0.875rem", color: "#334155" }}>Survival rate</span>
                      <span className="font-mono" style={{ color: "#0F172A", fontSize: "1rem" }}>Significantly improved</span>
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
              className="font-mono tracking-[0.15em] uppercase border px-6 py-2 transition-colors duration-300 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]"
              style={{ fontSize: "1rem", color: "#64748B", borderColor: "#E2E8F0" }}>
              Replay
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Level1Section;

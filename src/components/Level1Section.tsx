import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

/* ── Screening cards data ── */
const withScreenings = [
  {
    urgency: "CRITICAL",
    urgencyColor: "hsl(0, 72%, 60%)",
    grade: "USPSTF Grade B",
    name: "Low-Dose CT Lung Screening",
    detail: "30 pack-year history, age 50-80, active smoker",
    status: "ORDERED → EARLY DETECTION",
  },
  {
    urgency: "HIGH",
    urgencyColor: "hsl(35, 80%, 55%)",
    grade: "USPSTF Grade A",
    name: "Colorectal Cancer Screening",
    detail: "Age 52, no prior colonoscopy on record",
    status: "SCHEDULED",
  },
  {
    urgency: "MODERATE",
    urgencyColor: "hsl(160, 82%, 61%)",
    grade: "ACC/AHA Stage 1",
    name: "Hypertension Management",
    detail: "BP 138/88 — lifestyle intervention threshold",
    status: "FLAGGED",
  },
];

const withoutScreenings = [
  {
    urgency: "MISSED",
    urgencyColor: "hsl(0, 0%, 35%)",
    grade: "USPSTF Grade B",
    name: "Low-Dose CT Lung Screening",
    detail: "Eligible but not considered during visit",
    status: "NOT ORDERED",
  },
  {
    urgency: "MISSED",
    urgencyColor: "hsl(0, 0%, 35%)",
    grade: "USPSTF Grade A",
    name: "Colorectal Cancer Screening",
    detail: "Eligible but not flagged in workflow",
    status: "NOT ORDERED",
  },
  {
    urgency: "MISSED",
    urgencyColor: "hsl(0, 0%, 35%)",
    grade: "ACC/AHA Stage 1",
    name: "Hypertension Management",
    detail: "BP recorded but threshold not evaluated",
    status: "OVERLOOKED",
  },
];

const withSteps = [
  { step: "01", title: "Patient visits clinic", desc: "Same patient. Same clinic. Medient runs silently in the background." },
  { step: "02", title: "Instant eligibility analysis", desc: "All applicable guidelines evaluated in <1 second. Zero clinician effort." },
  { step: "03", title: "Screenings prioritized & ordered", desc: "LDCT flagged as critical. Ordered with full traceability." },
  { step: "04", title: "Early detection", desc: "9mm pulmonary nodule found. Stage IA. 5-year survival: 92%." },
  { step: "05", title: "System-wide benefit", desc: "CMS quality bonuses. Higher adherence. Better reimbursement." },
];

const withoutSteps = [
  { step: "01", title: "Patient visits clinic", desc: "Sarah, 52, sees her PCP for a routine checkup. 30-pack-year smoker." },
  { step: "02", title: "Doctor relies on memory", desc: "The physician can't recall exact USPSTF lung screening criteria." },
  { step: "03", title: "Screening not ordered", desc: "No LDCT scan ordered. Visit ends with routine bloodwork only." },
  { step: "04", title: "18 months later", desc: "Stage IIIB non-small cell lung cancer. 5-year survival: 8%." },
  { step: "05", title: "Catastrophic cost", desc: "Treatment exceeds $280,000. Preventable tragedy." },
];

const Level1Section = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeView, setActiveView] = useState<"without" | "with">("without");

  const steps = activeView === "without" ? withoutSteps : withSteps;
  const screenings = activeView === "with" ? withScreenings : withoutScreenings;
  const isWithout = activeView === "without";

  return (
    <section ref={ref} className="relative py-14 md:py-20 texture-diamonds">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(74,237,196,0.02),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-6">
          <div className="font-mono text-sm tracking-[0.25em] uppercase text-accent/70 mb-3">Two Paths — One Patient</div>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em] max-w-4xl">
            Same patient. Same clinic. <span className="text-gray-500">Different outcome.</span>
          </h2>
        </motion.div>

        {/* Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="flex items-center gap-1 mb-6 bg-white/[0.03] border border-white/[0.06] p-1.5 w-fit">
          <button onClick={() => setActiveView("without")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-6 md:px-8 py-3 transition-all duration-300 ${
              activeView === "without"
                ? "bg-[hsl(0,72%,60%)]/10 text-[hsl(0,72%,60%)] border border-[hsl(0,72%,60%)]/20"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}>Without Medient</button>
          <button onClick={() => setActiveView("with")}
            className={`font-mono text-sm tracking-[0.1em] uppercase px-6 md:px-8 py-3 transition-all duration-300 ${
              activeView === "with"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}>With Medient</button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* LEFT: Screening illustration card */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="border border-white/[0.06] bg-white/[0.01] panel-3d overflow-hidden"
                style={{
                  borderColor: isWithout ? "hsl(0, 0%, 15%)" : "hsl(160, 82%, 61%, 0.15)",
                }}>
                {/* Card header */}
                <div className="px-6 py-4 border-b border-white/[0.06]"
                  style={{
                    background: isWithout
                      ? "linear-gradient(135deg, rgba(255,255,255,0.02), transparent 60%)"
                      : "linear-gradient(135deg, rgba(74,237,196,0.06), transparent 60%)",
                  }}>
                  <div className="font-mono text-xs tracking-[0.25em] uppercase text-gray-500 mb-1">
                    {isWithout ? "Screenings: Not Evaluated" : "Eligible Screenings"}
                  </div>
                  <h3 className={`font-mono text-xl md:text-2xl font-light ${isWithout ? "text-gray-500" : "text-white"}`}>
                    {isWithout ? "No decision support active" : "Prioritized by clinical urgency"}
                  </h3>
                </div>

                {/* Screening items */}
                <div className="divide-y divide-white/[0.04]">
                  {screenings.map((s, i) => (
                    <motion.div
                      key={activeView + i}
                      initial={{ opacity: 0, x: isWithout ? 0 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
                      className={`px-6 py-5 transition-all duration-500 ${
                        isWithout ? "opacity-50" : "hover:bg-white/[0.015]"
                      }`}>
                      {/* Urgency + Grade */}
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="font-mono text-[11px] tracking-[0.15em] uppercase px-2 py-0.5 border"
                          style={{
                            color: s.urgencyColor,
                            borderColor: `${s.urgencyColor}44`,
                            backgroundColor: `${s.urgencyColor}11`,
                          }}>
                          {s.urgency}
                        </span>
                        <span className="font-mono text-xs tracking-[0.1em] text-gray-600">{s.grade}</span>
                      </div>

                      {/* Name */}
                      <h4 className={`font-mono text-lg md:text-xl font-light mb-1 transition-colors duration-300 ${
                        isWithout ? "text-gray-600" : "text-white"
                      }`}>{s.name}</h4>

                      {/* Detail */}
                      <p className="text-gray-500 text-sm leading-relaxed">{s.detail}</p>

                      {/* Status indicator (WITH only) */}
                      {!isWithout && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          transition={{ delay: 0.4 + i * 0.12 }}
                          className="mt-3 inline-flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rotate-45 animate-pulse"
                            style={{ backgroundColor: s.urgencyColor }} />
                          <span className="font-mono text-xs tracking-[0.12em] uppercase"
                            style={{ color: s.urgencyColor }}>{s.status}</span>
                        </motion.div>
                      )}

                      {/* Strike-through line for WITHOUT */}
                      {isWithout && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                          className="mt-3 h-px bg-gray-700 origin-left" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Bottom summary */}
                <div className="px-6 py-4 border-t border-white/[0.06]"
                  style={{
                    background: isWithout
                      ? "linear-gradient(135deg, rgba(200,50,50,0.04), transparent 60%)"
                      : "linear-gradient(135deg, rgba(74,237,196,0.04), transparent 60%)",
                  }}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {isWithout ? "Screenings identified" : "Screenings identified"}
                    </span>
                    <span className={`font-mono text-2xl font-light ${isWithout ? "text-[hsl(0,72%,60%)]" : "text-accent"}`}>
                      {isWithout ? "0 / 3" : "3 / 3"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Outcome stat */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView + "-outcome"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`mt-3 border p-5 text-center panel-3d ${
                  isWithout
                    ? "border-[hsl(0,72%,60%)]/20 bg-[hsl(0,72%,60%)]/[0.04]"
                    : "border-accent/20 bg-accent/[0.04]"
                }`}>
                <div className={`font-mono text-4xl md:text-5xl font-light ${isWithout ? "text-[hsl(0,72%,60%)]" : "text-accent"}`}>
                  {isWithout ? "8%" : "92%"}
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {isWithout ? "5-year survival — diagnosed late" : "5-year survival — caught early"}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Journey steps + metrics */}
          <div className="lg:col-span-7">
            <div className="border-t border-white/[0.06]">
              <AnimatePresence mode="wait">
                <motion.div key={activeView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {steps.map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.07, duration: 0.35 }}
                      className="border-b border-white/[0.06] py-3.5 md:py-4 px-2 md:px-4 hover:bg-white/[0.015] transition-colors duration-300 group">
                      <div className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-1">
                          <span className={`font-mono text-sm transition-colors duration-300 ${
                            isWithout ? "text-[hsl(0,72%,60%)]/50 group-hover:text-[hsl(0,72%,60%)]" : "text-accent/50 group-hover:text-accent"
                          }`}>{step.step}</span>
                        </div>
                        <div className="col-span-3">
                          <h4 className={`font-mono text-white text-base font-light transition-colors duration-300 ${
                            isWithout ? "group-hover:text-[hsl(0,72%,60%)]" : "group-hover:text-accent"
                          }`}>{step.title}</h4>
                        </div>
                        <div className="col-span-8">
                          <p className="text-gray-300 text-base leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom metrics */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView + "-metrics"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
                {(isWithout
                  ? [
                      { val: "$280K+", label: "Treatment cost" },
                      { val: "18 mo", label: "Delayed diagnosis" },
                      { val: "8%", label: "Survival rate" },
                      { val: "0", label: "Screenings ordered" },
                    ]
                  : [
                      { val: "$4,200", label: "Screening cost" },
                      { val: "0 days", label: "Time to screening" },
                      { val: "92%", label: "Survival rate" },
                      { val: "+$8K", label: "Quality bonus" },
                    ]
                ).map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }} className="bg-background/80 p-4 panel-3d">
                    <div className={`font-mono text-2xl md:text-3xl font-light ${isWithout ? "text-[hsl(0,72%,60%)]/80" : "text-accent"}`}>{stat.val}</div>
                    <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Level1Section;

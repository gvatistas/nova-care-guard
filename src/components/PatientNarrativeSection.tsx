import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const WITHOUT_STEPS = [
  {
    title: "Patient Arrives",
    desc: "Routine 15-min visit",
    detail: null,
    missed: null,
    outcome: null,
  },
  {
    title: "Risk Signals",
    desc: "3 present, only 1 noticed",
    detail: null,
    missed: [
      { label: "Lung cancer risk", status: "MISSED" },
      { label: "Cardiovascular risk", status: "MISSED" },
    ],
    noticed: "Colonoscopy (recalled from chart)",
    outcome: null,
  },
  {
    title: "MD Manual Review",
    desc: "Time pressure. No decision support. Guidelines not consulted.",
    detail: null,
    missed: null,
    outcome: null,
  },
  {
    title: "Screenings Ordered",
    desc: null,
    detail: [
      { text: "Chest X-ray ordered (not LDCT — wrong test)", dim: true },
      { text: "Colonoscopy: Not ordered", strikethrough: true },
      { text: "BP Management: Not addressed", strikethrough: true },
    ],
    missed: null,
    outcome: null,
  },
  {
    title: "18 MONTHS LATER",
    desc: null,
    detail: null,
    missed: null,
    outcome: {
      lines: [
        "Late-stage diagnosis: Stage IIIB",
        "Treatment cost: $288K+",
        "Survival rate: Significantly reduced",
      ],
    },
  },
];

const WITH_STEPS = [
  {
    title: "Patient Arrives",
    desc: "EHR data auto-ingested in <0.3s",
    risks: null,
    pipeline: null,
    ordered: null,
    outcome: null,
  },
  {
    title: "All Risk Signals Identified",
    desc: null,
    risks: [
      { label: "Lung — LDCT eligible, USPSTF criteria met", tag: "CRITICAL", tagColor: "#ef4444" },
      { label: "Colorectal — Colonoscopy overdue per ACS", tag: "HIGH", tagColor: "#f59e0b" },
      { label: "Cardiovascular — Statin evaluation per ACC/AHA", tag: "ELEVATED", tagColor: "#eab308" },
    ],
    pipeline: null,
    ordered: null,
    outcome: null,
  },
  {
    title: "Medient Clinical Engine",
    desc: "Deterministic. Guideline-compiled. Every pathway verified.",
    risks: null,
    pipeline: ["INGEST", "COMPILE", "VERIFY", "EXECUTE"],
    ordered: null,
    outcome: null,
  },
  {
    title: "Screenings Ordered",
    desc: null,
    risks: null,
    pipeline: null,
    ordered: [
      "Low-Dose CT Lung Screening USPSTF A — ORDERED",
      "Colonoscopy ACS — SCHEDULED",
      "Hypertension Management + Statin ACC/AHA — FLAGGED",
    ],
    outcome: null,
  },
  {
    title: "SAME VISIT. SAME DAY.",
    desc: null,
    risks: null,
    pipeline: null,
    ordered: null,
    outcome: {
      lines: [
        "Detection: Caught early — Stage IA",
        "Screening cost: $4,200",
        "Survival rate: Significantly improved",
      ],
    },
  },
];

const TimelineNode = ({
  color,
  isOutcome,
}: {
  color: string;
  isOutcome?: boolean;
}) => (
  <div className="relative flex-shrink-0 z-10">
    <div
      className="w-3 h-3 rounded-full border-2"
      style={{
        borderColor: color,
        backgroundColor: isOutcome ? color : "transparent",
        boxShadow: isOutcome ? `0 0 12px ${color}` : "none",
      }}
    />
  </div>
);

const WithoutStep = ({ step, index }: { step: (typeof WITHOUT_STEPS)[0]; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const dimFactor = 1 - index * 0.12;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: dimFactor, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex gap-4 pb-10 relative"
    >
      <div className="flex flex-col items-center">
        <TimelineNode color="#ef4444" isOutcome={index === 4} />
        {index < 4 && (
          <div className="w-px flex-1 min-h-[20px]" style={{ backgroundColor: "rgba(239,68,68,0.2)" }} />
        )}
      </div>
      <div className="flex-1 -mt-1">
        <h4
          className="font-mono font-bold tracking-wide uppercase mb-1"
          style={{ fontSize: "0.8rem", color: index === 4 ? "#ef4444" : "rgba(255,255,255,0.7)" }}
        >
          {step.title}
        </h4>
        {step.desc && (
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>{step.desc}</p>
        )}
        {step.noticed && (
          <p className="mt-1" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
            ✓ {step.noticed}
          </p>
        )}
        {step.missed?.map((m, i) => (
          <div key={i} className="flex items-center gap-2 mt-1">
            <span className="line-through" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.2)" }}>
              {m.label}
            </span>
            <span
              className="font-mono uppercase px-1.5 py-0.5 rounded text-[10px] tracking-wider"
              style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444" }}
            >
              {m.status}
            </span>
          </div>
        ))}
        {step.detail?.map((d, i) => (
          <p
            key={i}
            className={`mt-1 ${d.strikethrough ? "line-through" : ""}`}
            style={{ fontSize: "0.8rem", color: d.strikethrough ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.3)" }}
          >
            {d.text}
          </p>
        ))}
        {step.outcome && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-3 p-4 rounded-sm border"
            style={{
              borderColor: "rgba(239,68,68,0.4)",
              backgroundColor: "rgba(239,68,68,0.05)",
              boxShadow: "0 0 30px rgba(239,68,68,0.1)",
            }}
          >
            {step.outcome.lines.map((l, i) => (
              <p key={i} className="font-mono" style={{ fontSize: "0.8rem", color: "#ef4444" }}>
                {l}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const WithStep = ({ step, index }: { step: (typeof WITH_STEPS)[0]; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const brightFactor = 0.7 + index * 0.075;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: brightFactor, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="flex gap-4 pb-10 relative"
    >
      <div className="flex flex-col items-center">
        <TimelineNode color="#00d4aa" isOutcome={index === 4} />
        {index < 4 && (
          <div className="w-px flex-1 min-h-[20px]" style={{ backgroundColor: "rgba(0,212,170,0.25)" }} />
        )}
      </div>
      <div className="flex-1 -mt-1">
        <h4
          className="font-mono font-bold tracking-wide uppercase mb-1"
          style={{ fontSize: "0.8rem", color: index === 4 ? "#00d4aa" : "rgba(255,255,255,0.9)" }}
        >
          {step.title}
        </h4>
        {step.desc && (
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>{step.desc}</p>
        )}
        {step.risks?.map((r, i) => (
          <div key={i} className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)" }}>{r.label}</span>
            <span
              className="font-mono uppercase px-1.5 py-0.5 rounded text-[10px] tracking-wider"
              style={{ backgroundColor: `${r.tagColor}20`, color: r.tagColor }}
            >
              {r.tag}
            </span>
          </div>
        ))}
        {step.pipeline && (
          <div className="mt-3">
            <div className="flex items-center gap-1 mb-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,212,170,0.1)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: "100%" } : {}}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#00d4aa" }}
                />
              </div>
              <span className="font-mono text-[10px] ml-2" style={{ color: "#00d4aa" }}>3/3</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {step.pipeline.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="font-mono uppercase px-2 py-0.5 rounded-sm text-[10px] tracking-wider border"
                  style={{ borderColor: "rgba(0,212,170,0.3)", color: "#00d4aa" }}
                >
                  {p}
                </motion.span>
              ))}
            </div>
          </div>
        )}
        {step.ordered?.map((o, i) => (
          <div key={i} className="flex items-start gap-2 mt-1.5">
            <span style={{ color: "#00d4aa", fontSize: "0.85rem" }}>✓</span>
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)" }}>{o}</span>
          </div>
        ))}
        {step.outcome && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-3 p-4 rounded-sm border"
            style={{
              borderColor: "rgba(0,212,170,0.4)",
              backgroundColor: "rgba(0,212,170,0.05)",
              boxShadow: "0 0 30px rgba(0,212,170,0.1)",
            }}
          >
            {step.outcome.lines.map((l, i) => (
              <p key={i} className="font-mono" style={{ fontSize: "0.8rem", color: "#00d4aa" }}>
                {l}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const PatientNarrativeSection = () => {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: "#1a1d21" }}>
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono font-bold text-white mb-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            Same patient. Same clinic.
          </h2>
          <h2 className="font-mono font-bold mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#00d4aa" }}>
            Different outcome.
          </h2>
          <p className="mx-auto" style={{ maxWidth: 560, fontSize: "1rem", color: "rgba(255,255,255,0.5)" }}>
            Sarah Mitchell, 52 — 3 undetected risks enter the same clinical workflow.
          </p>
        </motion.div>

        {/* Dual Timelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
          {/* Center divider pulse — desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px">
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)",
              }}
            />
          </div>

          {/* LEFT: Without Medient */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.6)" }} />
              <span className="font-mono uppercase tracking-[0.2em] text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Without Medient
              </span>
            </div>
            {WITHOUT_STEPS.map((step, i) => (
              <WithoutStep key={i} step={step} index={i} />
            ))}
          </div>

          {/* RIGHT: With Medient */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00d4aa" }} />
              <span className="font-mono uppercase tracking-[0.2em] text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                With Medient
              </span>
            </div>
            {WITH_STEPS.map((step, i) => (
              <WithStep key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientNarrativeSection;

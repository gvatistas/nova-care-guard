import { useRef, useState, useEffect, type FC } from "react";
import { motion } from "framer-motion";

const TEAL = "#00d4aa";
const RED = "#cc3333";

const Badge: FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <span
    className="inline-block px-2 py-0.5 text-[10px] font-medium uppercase"
    style={{ background: `${color}18`, color, border: `1px solid ${color}33`, letterSpacing: "0.1em" }}
  >
    {children}
  </span>
);

const Check = () => <span className="text-[#00d4aa] shrink-0">✓</span>;
const Cross = () => <span className="text-[#cc3333] shrink-0">✕</span>;

const tests = [
  {
    name: "LDCT Lung Screening",
    with: { status: "Ordered, USPSTF criteria met", badge: "ORDERED" },
    without: { status: "Not flagged, no order", badge: "MISSED" },
  },
  {
    name: "Colonoscopy",
    with: { status: "Scheduled, ACS guidelines", badge: "SCHEDULED" },
    without: { status: "Patient told to ask PCP", badge: "DEFERRED" },
  },
  {
    name: "BP + Lipid Panel",
    with: { status: "Flagged, statin pathway compiled", badge: "FLAGGED" },
    without: { status: "Normal visit, no follow-up", badge: "MISSED" },
  },
  {
    name: "HbA1c",
    with: { status: "Pre-diabetes detected, monitoring initiated", badge: "DETECTED" },
    without: { status: "Not tested", badge: "MISSED" },
  },
];

const PatientNarrativeSection = () => {
  const [visibleNodes, setVisibleNodes] = useState<Set<number>>(new Set());
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute("data-node"));
          if (entry.isIntersecting) setVisibleNodes((prev) => new Set(prev).add(idx));
        });
      },
      { threshold: 0.3 }
    );
    nodeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVis = (n: number) => visibleNodes.has(n);

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "#1a1d21" }}>
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[12px] font-medium uppercase text-white/30 mb-4"
          style={{ letterSpacing: "0.1em" }}
        >
          Clinical Decision Divergence
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-white"
          style={{ letterSpacing: "-0.03em" }}
        >
          Jane Doe, 52
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/40 mt-3 text-base"
          style={{ letterSpacing: "-0.01em" }}
        >
          One patient. Two pathways. Every test matters.
        </motion.p>
      </div>

      {/* Root node */}
      <div className="max-w-5xl mx-auto">
        <div
          ref={(el) => { nodeRefs.current[0] = el; }}
          data-node={0}
          className="flex justify-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVis(0) ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="border border-white/20 px-8 py-4 text-center"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p className="text-white font-semibold text-lg" style={{ letterSpacing: "-0.02em" }}>Jane Doe, 52 — Routine Visit</p>
            <p className="text-white/40 text-sm mt-1">3 undetected risk factors in chart</p>
          </motion.div>
        </div>

        {/* Fork divider */}
        <div className="flex justify-center mb-8">
          <svg width="200" height="40" viewBox="0 0 200 40">
            <line x1="100" y1="0" x2="50" y2="40" stroke={RED} strokeWidth="1" opacity="0.4" />
            <line x1="100" y1="0" x2="150" y2="40" stroke={TEAL} strokeWidth="1" opacity="0.4" />
            <circle cx="100" cy="0" r="3" fill="white" opacity="0.5" />
          </svg>
        </div>

        {/* Column headers — LEFT=WITHOUT, RIGHT=WITH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="text-center md:text-left">
            <span className="text-[12px] font-medium uppercase" style={{ color: RED, letterSpacing: "0.1em" }}>
              Without Medient
            </span>
            <p className="text-white/30 text-[11px] mt-1" style={{ letterSpacing: "0.05em" }}>Standard of Care</p>
          </div>
          <div className="text-center md:text-right">
            <span className="text-[12px] font-medium uppercase" style={{ color: TEAL, letterSpacing: "0.1em" }}>
              With Medient
            </span>
            <p className="text-white/30 text-[11px] mt-1" style={{ letterSpacing: "0.05em" }}>Clinic UI · Consumer AI · Full Pipeline</p>
          </div>
        </div>

        {/* Test nodes — LEFT=WITHOUT, RIGHT=WITH */}
        {tests.map((test, idx) => (
          <div
            key={idx}
            ref={(el) => { nodeRefs.current[idx + 1] = el; }}
            data-node={idx + 1}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
          >
            {/* WITHOUT (left) */}
            <motion.div
              className="border p-4 transition-all duration-700"
              style={{
                borderColor: isVis(idx + 1) ? `${RED}33` : "rgba(255,255,255,0.06)",
                background: isVis(idx + 1) ? "rgba(204,51,51,0.03)" : "rgba(255,255,255,0.01)",
                opacity: isVis(idx + 1) ? 1 : 0,
                transform: isVis(idx + 1) ? "translateY(0)" : "translateY(16px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium uppercase text-white/50" style={{ letterSpacing: "0.1em" }}>{test.name}</span>
                <Badge color={RED}>{test.without.badge}</Badge>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Cross />
                <span className="text-white/40">{test.without.status}</span>
              </div>
            </motion.div>

            {/* WITH (right) */}
            <motion.div
              className="border p-4 transition-all duration-700"
              style={{
                borderColor: isVis(idx + 1) ? `${TEAL}44` : "rgba(255,255,255,0.06)",
                background: isVis(idx + 1) ? "rgba(0,212,170,0.03)" : "rgba(255,255,255,0.01)",
                opacity: isVis(idx + 1) ? 1 : 0,
                transform: isVis(idx + 1) ? "translateY(0)" : "translateY(16px)",
                transitionDelay: "0.1s",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium uppercase text-white/50" style={{ letterSpacing: "0.1em" }}>{test.name}</span>
                <Badge color={TEAL}>{test.with.badge}</Badge>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Check />
                <span className="text-white/80">{test.with.status}</span>
              </div>
            </motion.div>
          </div>
        ))}

        {/* Outcomes — LEFT=WITHOUT (red), RIGHT=WITH (teal) */}
        <div
          ref={(el) => { nodeRefs.current[5] = el; }}
          data-node={5}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
        >
          {/* WITHOUT outcome (left) */}
          <motion.div
            className="border p-6 transition-all duration-700"
            style={{
              borderColor: isVis(5) ? `${RED}44` : "rgba(255,255,255,0.06)",
              background: isVis(5) ? "rgba(204,51,51,0.05)" : "rgba(255,255,255,0.01)",
              opacity: isVis(5) ? 1 : 0,
              transform: isVis(5) ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <p className="text-[12px] font-medium uppercase mb-3" style={{ color: RED, letterSpacing: "0.1em" }}>
              18 Months Later
            </p>
            <p className="text-xl font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>Late-stage — Stage IIIB</p>
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-white/50">Treatment cost: <span style={{ color: RED }} className="font-semibold">$288K+</span></p>
              <p className="text-white/50">5-year survival: <span style={{ color: RED }} className="font-semibold">23%</span></p>
            </div>
          </motion.div>

          {/* WITH outcome (right) */}
          <motion.div
            className="border p-6 transition-all duration-700"
            style={{
              borderColor: isVis(5) ? `${TEAL}55` : "rgba(255,255,255,0.06)",
              background: isVis(5) ? "linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,212,170,0.02))" : "rgba(255,255,255,0.01)",
              boxShadow: isVis(5) ? "0 0 40px rgba(0,212,170,0.06)" : "none",
              opacity: isVis(5) ? 1 : 0,
              transform: isVis(5) ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "0.1s",
            }}
          >
            <p className="text-[12px] font-medium uppercase mb-3" style={{ color: TEAL, letterSpacing: "0.1em" }}>
              Same Visit. Same Day.
            </p>
            <p className="text-xl font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>Caught early — Stage IA</p>
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-white/50">Screening cost: <span style={{ color: TEAL }} className="font-semibold">$4,200</span></p>
              <p className="text-white/50">5-year survival: <span style={{ color: TEAL }} className="font-semibold">92%</span></p>
            </div>
          </motion.div>
        </div>

        {/* Macro scale */}
        <div
          ref={(el) => { nodeRefs.current[6] = el; }}
          data-node={6}
          className="mt-12"
        >
          <motion.div
            className="border border-white/[0.06] p-6 transition-all duration-700"
            style={{
              background: "rgba(255,255,255,0.015)",
              opacity: isVis(6) ? 1 : 0,
              transform: isVis(6) ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <p className="text-[12px] font-medium uppercase text-white/30 mb-4 text-center" style={{ letterSpacing: "0.1em" }}>
              At Scale: 10,000 Patients/Year
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-semibold text-white" style={{ letterSpacing: "-0.03em" }}>340+</p>
                <p className="text-white/40 text-sm mt-1">Early detections per year</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white" style={{ letterSpacing: "-0.03em" }}>$96M</p>
                <p className="text-white/40 text-sm mt-1">Downstream costs avoided</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white" style={{ letterSpacing: "-0.03em" }}>94%</p>
                <p className="text-white/40 text-sm mt-1">Screening gaps closed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PatientNarrativeSection;

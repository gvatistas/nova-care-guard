import { useRef, useEffect, useState, type FC } from "react";
import { motion } from "framer-motion";

/* ─── stage data ─── */
const STAGES = [
  { id: 1, label: "PATIENT ARRIVES" },
  { id: 2, label: "RISK SIGNALS PRESENT" },
  { id: 3, label: "CLINICAL DECISION" },
  { id: 4, label: "SCREENINGS ORDERED" },
  { id: 5, label: "OUTCOME" },
];

/* ─── reusable pieces ─── */
const Badge: FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <span
    className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded shrink-0"
    style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
  >
    {children}
  </span>
);

const CheckLine: FC<{ text: string; status: string }> = ({ text, status }) => (
  <div className="flex items-start gap-2 text-sm">
    <span className="text-[#00d4aa] mt-0.5 shrink-0">✓</span>
    <span className="font-mono text-white/90 flex-1">{text}</span>
    <Badge color="#00d4aa">{status}</Badge>
  </div>
);

const FailLine: FC<{ text: string; strikethrough?: boolean }> = ({ text, strikethrough }) => (
  <div className="flex items-start gap-2 text-sm">
    <span className="text-red-400 mt-0.5 shrink-0">✗</span>
    <span className={`font-sans text-white/40 ${strikethrough ? "line-through" : ""}`}>{text}</span>
  </div>
);

/* ─── individual stage cards ─── */

function Stage1Left() {
  return (
    <div className="border border-white/15 rounded-lg p-5 bg-white/[0.02]">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-400/60" />
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Intake</span>
      </div>
      <p className="font-sans text-white/70 text-sm">Sarah Mitchell, 52 — Routine 15-min visit</p>
      <p className="font-sans text-white/30 text-xs mt-2">Standard appointment. No flags raised.</p>
    </div>
  );
}

function Stage1Right() {
  return (
    <div className="border border-white/15 rounded-lg p-5 bg-white/[0.02]">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-400/60" />
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Intake</span>
      </div>
      <p className="font-sans text-white/70 text-sm">Sarah Mitchell, 52 — Routine 15-min visit</p>
      <p className="font-sans text-white/30 text-xs mt-2">Standard appointment. No flags raised.</p>
    </div>
  );
}

function Stage2Left() {
  return (
    <div className="border border-amber-500/30 rounded-lg p-5 bg-amber-900/[0.05] relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-amber-400/60 uppercase tracking-wider">Chart Review</span>
        <span className="text-[10px] font-mono text-red-400/60 bg-red-400/10 px-2 py-0.5 rounded animate-pulse">UNDETECTED</span>
      </div>
      <p className="font-sans text-white/40 text-xs mb-3">3 risk factors in chart</p>
      <div className="space-y-2">
        <p className="font-sans text-white/25 text-xs">Lung: 20 pack-year history</p>
        <p className="font-sans text-white/15 text-xs">Colorectal: No colonoscopy, age 52</p>
        <p className="font-sans text-white/20 text-xs">Cardiovascular: BP 142/88 — buried in vitals</p>
      </div>
    </div>
  );
}

function Stage2Right({ active }: { active: boolean }) {
  return (
    <div className="border border-[#00d4aa]/40 rounded-lg overflow-hidden bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="font-mono text-[10px] text-[#00d4aa]/50 uppercase tracking-widest">Medient Clinical Engine v2.4</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
      </div>
      <div className="mx-4 mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[2000ms] ease-out"
          style={{
            width: active ? "100%" : "0%",
            background: "linear-gradient(90deg, #00d4aa, #00d4aa88)",
          }}
        />
      </div>
      <div className="p-4 space-y-2.5">
        {[
          { text: "Lung — LDCT eligible, USPSTF criteria met", tag: "CRITICAL", color: "#ef4444", delay: "0.6s" },
          { text: "Colorectal — Colonoscopy overdue per ACS", tag: "HIGH", color: "#f59e0b", delay: "1.1s" },
          { text: "Cardiovascular — Statin eval per ACC/AHA", tag: "ELEVATED", color: "#eab308", delay: "1.6s" },
        ].map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-xs transition-all duration-500"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(6px)",
              transitionDelay: active ? r.delay : "0s",
            }}
          >
            <span className="text-[#00d4aa] mt-0.5 shrink-0">▸</span>
            <span className="font-mono text-white/80 flex-1">{r.text}</span>
            <Badge color={r.color}>{r.tag}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stage3Left() {
  return (
    <div className="border border-red-500/25 rounded-lg p-5 bg-red-900/[0.06] opacity-80">
      <span className="font-mono text-xs text-red-400/60 uppercase tracking-wider">MD Manual Review</span>
      <div className="flex items-center gap-2 mt-3 text-white/30 text-xs font-sans">
        <span className="text-base">⏱</span>
        <span>Time pressure · No decision support · Guidelines not consulted</span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-[10px] font-mono text-white/30 mb-1">
          <span>Risks addressed</span><span>1 / 3</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5">
          <div className="h-full rounded-full bg-red-500/50" style={{ width: "33%" }} />
        </div>
      </div>
    </div>
  );
}

function Stage3Right({ active }: { active: boolean }) {
  const pills = ["INGEST", "COMPILE", "VERIFY", "EXECUTE"];
  return (
    <div
      className="border border-[#00d4aa]/40 rounded-lg p-5 transition-shadow duration-1000"
      style={{
        background: "linear-gradient(135deg, rgba(0,212,170,0.04), rgba(0,212,170,0.01))",
        boxShadow: active ? "0 0 30px rgba(0,212,170,0.08)" : "none",
      }}
    >
      <span className="font-mono text-xs text-[#00d4aa]/70 uppercase tracking-wider">Medient Compiles Action Plan</span>
      <div className="flex flex-wrap gap-2 mt-4">
        {pills.map((p, i) => (
          <span
            key={p}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-all duration-500"
            style={{
              borderColor: active ? "#00d4aa66" : "#ffffff10",
              color: active ? "#00d4aa" : "#ffffff30",
              background: active ? "rgba(0,212,170,0.08)" : "transparent",
              transitionDelay: `${i * 0.3}s`,
            }}
          >
            <span
              className="transition-opacity duration-300"
              style={{ opacity: active ? 1 : 0, transitionDelay: `${i * 0.3 + 0.2}s` }}
            >
              ✓
            </span>
            {p}
          </span>
        ))}
      </div>
      <p className="font-sans text-white/40 text-xs mt-4">Deterministic. Guideline-compiled. Every pathway verified.</p>
      <div className="mt-3">
        <div className="flex justify-between text-[10px] font-mono text-[#00d4aa]/50 mb-1">
          <span>Pathways compiled</span><span>3 / 3</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-[1500ms] ease-out"
            style={{ width: active ? "100%" : "0%", background: "#00d4aa" }}
          />
        </div>
      </div>
    </div>
  );
}

function Stage4Left() {
  return (
    <div className="border border-red-500/30 rounded-lg p-5 relative overflow-hidden" style={{ background: "rgba(127,29,29,0.08)" }}>
      <span className="font-mono text-xs text-red-400/60 uppercase tracking-wider">Orders Placed</span>
      <div className="mt-3 space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-red-400 mt-0.5 shrink-0">✗</span>
          <span className="font-sans text-white/60"><strong className="text-red-300/80">Chest X-ray ordered</strong> (not LDCT — wrong test)</span>
        </div>
        <FailLine text="Colonoscopy: Not ordered" strikethrough />
        <FailLine text="BP Management: Not addressed" strikethrough />
      </div>
    </div>
  );
}

function Stage4Right() {
  return (
    <div className="border border-[#00d4aa]/40 rounded-lg p-5" style={{ background: "rgba(0,212,170,0.03)" }}>
      <span className="font-mono text-xs text-[#00d4aa]/70 uppercase tracking-wider">Orders Generated</span>
      <div className="mt-3 space-y-2.5">
        <CheckLine text="Low-Dose CT Lung Screening USPSTF A" status="ORDERED" />
        <CheckLine text="Colonoscopy ACS" status="SCHEDULED" />
        <CheckLine text="Hypertension Mgmt + Statin ACC/AHA" status="FLAGGED" />
      </div>
    </div>
  );
}

function Stage5Left() {
  return (
    <div
      className="border border-red-500/40 rounded-lg p-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.15), rgba(127,29,29,0.05))" }}
    >
      <div className="absolute top-3 right-3 text-red-500/20 text-3xl">⚠</div>
      <span className="font-mono text-[10px] text-red-400/50 uppercase tracking-widest">18 Months Later</span>
      <p className="font-mono text-xl text-red-300 mt-3 font-bold">Late-stage diagnosis: Stage IIIB</p>
      <div className="mt-4 space-y-1.5 text-sm font-sans">
        <p className="text-white/40">Treatment cost: <span className="text-red-300/80 font-mono">$288K+</span></p>
        <p className="text-white/40">Survival rate: <span className="text-red-300/80">Significantly reduced</span></p>
      </div>
    </div>
  );
}

function Stage5Right() {
  return (
    <div
      className="border border-[#00d4aa]/50 rounded-lg p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.02))",
        boxShadow: "0 0 40px rgba(0,212,170,0.08)",
      }}
    >
      <div className="absolute top-3 right-3 text-[#00d4aa]/20 text-3xl">✦</div>
      <span className="font-mono text-[10px] text-[#00d4aa]/70 uppercase tracking-widest animate-pulse">Same Visit. Same Day.</span>
      <p className="font-mono text-xl text-[#00d4aa] mt-3 font-bold">Caught early — Stage IA</p>
      <div className="mt-4 space-y-1.5 text-sm font-sans">
        <p className="text-white/50">Screening cost: <span className="text-[#00d4aa] font-mono">$4,200</span></p>
        <p className="text-white/50">Survival rate: <span className="text-[#00d4aa]">Significantly improved</span></p>
      </div>
    </div>
  );
}

/* ─── fork divider ─── */
function ForkDivider({ visible }: { visible: boolean }) {
  return (
    <div className="flex justify-center my-6 h-12 relative overflow-hidden">
      <svg width="200" height="48" viewBox="0 0 200 48" className="transition-opacity duration-700" style={{ opacity: visible ? 0.5 : 0 }}>
        <line x1="100" y1="0" x2="100" y2="12" stroke="#ffffff" strokeWidth="1" opacity="0.2" />
        <line x1="100" y1="12" x2="40" y2="44" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
        <line x1="100" y1="12" x2="160" y2="44" stroke="#00d4aa" strokeWidth="1" opacity="0.4" />
        <circle cx="100" cy="12" r="2" fill="#ffffff" opacity="0.3" />
      </svg>
    </div>
  );
}

/* ─── main component ─── */
const PatientNarrativeSection = () => {
  const [visibleStages, setVisibleStages] = useState<Set<number>>(new Set());
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute("data-stage"));
          if (entry.isIntersecting) {
            setVisibleStages((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.3 }
    );
    stageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isActive = (s: number) => visibleStages.has(s);

  const leftCards = [
    <Stage1Left key="l1" />,
    <Stage2Left key="l2" />,
    <Stage3Left key="l3" />,
    <Stage4Left key="l4" />,
    <Stage5Left key="l5" />,
  ];
  const rightCards = [
    <Stage1Right key="r1" />,
    <Stage2Right key="r2" active={isActive(2)} />,
    <Stage3Right key="r3" active={isActive(3)} />,
    <Stage4Right key="r4" />,
    <Stage5Right key="r5" />,
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "#1a1d21" }}>
      {/* heading */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-3xl md:text-4xl font-bold text-white"
        >
          Same patient. Same clinic.
          <br />
          <span className="text-[#00d4aa]">Different outcome.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-sans text-white/40 mt-4 text-base"
        >
          Sarah Mitchell, 52 — 3 undetected risks enter the same clinical workflow.
        </motion.p>
      </div>

      {/* column headers */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/25">Without Medient</span>
        </div>
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00d4aa]/50">With Medient</span>
        </div>
      </div>

      {/* stages */}
      <div className="max-w-5xl mx-auto space-y-0">
        {STAGES.map((stage, idx) => (
          <div key={stage.id}>
            {idx === 2 && <ForkDivider visible={isActive(2)} />}

            <div
              ref={(el) => { stageRefs.current[idx] = el; }}
              data-stage={stage.id}
              className="mb-3 mt-8"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="h-px flex-1 max-w-[60px] bg-white/10" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/20">
                  Stage {stage.id} — {stage.label}
                </span>
                <div className="h-px flex-1 max-w-[60px] bg-white/10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="transition-all duration-700"
                style={{
                  opacity: isActive(stage.id) ? 1 : 0,
                  transform: isActive(stage.id) ? "translateY(0) translateX(0)" : "translateY(20px) translateX(-8px)",
                }}
              >
                {leftCards[idx]}
              </div>
              <div
                className="transition-all duration-700"
                style={{
                  opacity: isActive(stage.id) ? 1 : 0,
                  transform: isActive(stage.id) ? "translateY(0) translateX(0)" : "translateY(20px) translateX(8px)",
                  transitionDelay: "0.15s",
                }}
              >
                {rightCards[idx]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { val: "4 Pathways", desc: "Analyzed simultaneously" },
          { val: "23 Decision Points", desc: "Evaluated in <0.3s" },
          { val: "100% Guideline-Backed", desc: "USPSTF · ACC/AHA · ADA" },
          { val: "1 Compiled Output", desc: "Per patient encounter" },
        ].map((s, i) => (
          <div key={i} className="text-center py-4 border border-white/5 rounded-lg bg-white/[0.01]">
            <p className="font-mono text-sm text-[#00d4aa]">{s.val}</p>
            <p className="font-sans text-[11px] text-white/25 mt-1">{s.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default PatientNarrativeSection;

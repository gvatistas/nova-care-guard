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

/* ─── lane config ─── */
const LANES = {
  chatbot: { label: "AI Chatbot", color: "#666666", dimColor: "#444444" },
  frontier: { label: "Frontier Lab AI", color: "#4488ff", dimColor: "#3366cc" },
  medient: { label: "MEDIENT Clinical Engine", color: "#00d4aa", dimColor: "#00b894" },
};

/* ─── reusable pieces ─── */
const Badge: FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <span
    className="inline-block px-2 py-0.5 text-[10px] font-heading font-semibold uppercase tracking-wider rounded shrink-0"
    style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
  >
    {children}
  </span>
);

/* ─── Stage cards per lane ─── */

// STAGE 1 — all identical
function Stage1Card({ lane }: { lane: keyof typeof LANES }) {
  const l = LANES[lane];
  return (
    <div className="border border-white/15 rounded-lg p-4 bg-white/[0.02]">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-green-400/60" />
        <span className="font-heading text-[10px] font-semibold text-white/40 uppercase tracking-wider">Intake</span>
      </div>
      <p className="font-sans text-white/70 text-sm">Sarah Mitchell, 52</p>
      <p className="font-sans text-white/30 text-xs mt-1">Routine 15-min visit. No flags raised.</p>
      <div className="mt-2">
        <span className="text-[9px] font-heading font-medium uppercase tracking-wider" style={{ color: l.color + "80" }}>{l.label}</span>
      </div>
    </div>
  );
}

// STAGE 2
function Stage2Chatbot() {
  return (
    <div className="border border-white/10 rounded-lg p-4 bg-white/[0.01]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-heading text-[10px] font-semibold text-[#666]/80 uppercase tracking-wider">Generic Chat</span>
        <Badge color="#666">NO SCAN</Badge>
      </div>
      <p className="font-sans text-white/30 text-xs italic">"Based on your age, you might want to talk to your doctor about screenings..."</p>
      <p className="font-sans text-white/20 text-[10px] mt-2">No EHR access. No risk stratification. No clinical context.</p>
    </div>
  );
}

function Stage2Frontier() {
  return (
    <div className="border border-[#4488ff]/30 rounded-lg p-4 bg-[#4488ff]/[0.03]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-heading text-[10px] font-semibold text-[#4488ff]/70 uppercase tracking-wider">Analysis</span>
        <Badge color="#4488ff">PARTIAL</Badge>
      </div>
      <div className="space-y-1.5 text-xs">
        <p className="text-white/50">▸ Smoking history detected — "consider screening"</p>
        <p className="text-white/30">▸ Age flag noted — no guideline citation</p>
        <p className="text-white/20">▸ BP reading — not cross-referenced</p>
      </div>
      <p className="font-sans text-white/20 text-[10px] mt-2">Identifies signals but can't compile clinical actions.</p>
    </div>
  );
}

function Stage2Medient({ active }: { active: boolean }) {
  return (
    <div className="border border-[#00d4aa]/40 rounded-lg overflow-hidden bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="font-heading text-[10px] font-semibold text-[#00d4aa]/50 uppercase tracking-widest">Medient Clinical Engine v2.4</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
      </div>
      <div className="mx-4 mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[2000ms] ease-out"
          style={{ width: active ? "100%" : "0%", background: "linear-gradient(90deg, #00d4aa, #00d4aa88)" }}
        />
      </div>
      <div className="p-4 space-y-2">
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
            <span className="font-heading text-[11px] font-medium text-white/80 flex-1">{r.text}</span>
            <Badge color={r.color}>{r.tag}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// STAGE 3
function Stage3Chatbot() {
  return (
    <div className="border border-white/8 rounded-lg p-4 bg-white/[0.01] opacity-60">
      <span className="font-heading text-[10px] font-semibold text-[#666]/60 uppercase tracking-wider">No Action</span>
      <p className="font-sans text-white/20 text-xs mt-2">"I recommend discussing your health concerns with a qualified healthcare provider."</p>
      <p className="font-sans text-white/15 text-[10px] mt-1">Cannot generate clinical orders. No decision support.</p>
    </div>
  );
}

function Stage3Frontier() {
  return (
    <div className="border border-[#4488ff]/20 rounded-lg p-4 bg-[#4488ff]/[0.02]">
      <span className="font-heading text-[10px] font-semibold text-[#4488ff]/60 uppercase tracking-wider">Recommendation Generated</span>
      <p className="font-sans text-white/40 text-xs mt-2">Suggests screening tests but cannot verify against guidelines or integrate with EHR.</p>
      <div className="mt-3 flex justify-between text-[10px] font-heading font-medium text-white/30 mb-1">
        <span>Clinical integration</span><span>0 / 3</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <div className="h-full rounded-full bg-[#4488ff]/30" style={{ width: "15%" }} />
      </div>
    </div>
  );
}

function Stage3Medient({ active }: { active: boolean }) {
  const pills = ["INGEST", "COMPILE", "VERIFY", "EXECUTE"];
  return (
    <div
      className="border border-[#00d4aa]/40 rounded-lg p-4 transition-shadow duration-1000"
      style={{
        background: "linear-gradient(135deg, rgba(0,212,170,0.04), rgba(0,212,170,0.01))",
        boxShadow: active ? "0 0 30px rgba(0,212,170,0.08)" : "none",
      }}
    >
      <span className="font-heading text-[10px] font-semibold text-[#00d4aa]/70 uppercase tracking-wider">Compiles Action Plan</span>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {pills.map((p, i) => (
          <span
            key={p}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-heading font-semibold uppercase tracking-wider border transition-all duration-500"
            style={{
              borderColor: active ? "#00d4aa66" : "#ffffff10",
              color: active ? "#00d4aa" : "#ffffff30",
              background: active ? "rgba(0,212,170,0.08)" : "transparent",
              transitionDelay: `${i * 0.3}s`,
            }}
          >
            <span className="transition-opacity duration-300" style={{ opacity: active ? 1 : 0, transitionDelay: `${i * 0.3 + 0.2}s` }}>✓</span>
            {p}
          </span>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[10px] font-heading font-medium text-[#00d4aa]/50 mb-1">
        <span>Pathways compiled</span><span>3 / 3</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <div className="h-full rounded-full transition-all duration-[1500ms] ease-out" style={{ width: active ? "100%" : "0%", background: "#00d4aa" }} />
      </div>
    </div>
  );
}

// STAGE 4
function Stage4Chatbot() {
  return (
    <div className="border border-white/8 rounded-lg p-4 bg-white/[0.01] opacity-50">
      <span className="font-heading text-[10px] font-semibold text-[#666]/50 uppercase tracking-wider">No Orders</span>
      <div className="mt-2 space-y-1">
        <p className="text-white/15 text-xs line-through">Lung screening: N/A</p>
        <p className="text-white/15 text-xs line-through">Colonoscopy: N/A</p>
        <p className="text-white/15 text-xs line-through">Cardiovascular: N/A</p>
      </div>
    </div>
  );
}

function Stage4Frontier() {
  return (
    <div className="border border-[#4488ff]/20 rounded-lg p-4 bg-[#4488ff]/[0.02]">
      <span className="font-heading text-[10px] font-semibold text-[#4488ff]/60 uppercase tracking-wider">Suggestions Sent</span>
      <div className="mt-2 space-y-1.5">
        <div className="flex items-start gap-2 text-xs">
          <span className="text-yellow-500 mt-0.5">⚠</span>
          <span className="text-white/40">Lung screening suggested — <span className="text-white/25">no order generated</span></span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <span className="text-yellow-500 mt-0.5">⚠</span>
          <span className="text-white/40">Colonoscopy mentioned — <span className="text-white/25">no EHR integration</span></span>
        </div>
      </div>
    </div>
  );
}

function Stage4Medient() {
  return (
    <div className="border border-[#00d4aa]/40 rounded-lg p-4" style={{ background: "rgba(0,212,170,0.03)" }}>
      <span className="font-heading text-[10px] font-semibold text-[#00d4aa]/70 uppercase tracking-wider">Orders Generated</span>
      <div className="mt-2 space-y-2">
        {[
          { text: "Low-Dose CT Lung Screening USPSTF A", status: "ORDERED" },
          { text: "Colonoscopy ACS", status: "SCHEDULED" },
          { text: "Hypertension Mgmt + Statin ACC/AHA", status: "FLAGGED" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className="text-[#00d4aa] mt-0.5 shrink-0">✓</span>
            <span className="font-heading text-[11px] font-medium text-white/90 flex-1">{item.text}</span>
            <Badge color="#00d4aa">{item.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// STAGE 5
function Stage5Chatbot() {
  return (
    <div className="border border-white/8 rounded-lg p-5 opacity-50" style={{ background: "rgba(80,80,80,0.05)" }}>
      <span className="font-heading text-[10px] font-medium text-white/20 uppercase tracking-widest">18 Months Later</span>
      <p className="font-heading text-base font-bold text-white/30 mt-2">No clinical impact</p>
      <p className="font-sans text-white/20 text-xs mt-2">Patient received generic advice. No screenings triggered. Same outcome as no tool.</p>
    </div>
  );
}

function Stage5Frontier() {
  return (
    <div className="border border-[#4488ff]/30 rounded-lg p-5" style={{ background: "rgba(68,136,255,0.04)" }}>
      <span className="font-heading text-[10px] font-medium text-[#4488ff]/50 uppercase tracking-widest">18 Months Later</span>
      <p className="font-heading text-base font-bold text-[#4488ff]/70 mt-2">Partial detection — Stage II</p>
      <div className="mt-3 space-y-1 text-sm font-sans">
        <p className="text-white/30">Some risks flagged but delayed follow-through</p>
        <p className="text-white/30">Treatment cost: <span className="text-[#4488ff]/60 font-heading font-semibold">$142K</span></p>
      </div>
    </div>
  );
}

function Stage5Medient() {
  return (
    <div
      className="border border-[#00d4aa]/50 rounded-lg p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.02))",
        boxShadow: "0 0 40px rgba(0,212,170,0.08)",
      }}
    >
      <div className="absolute top-3 right-3 text-[#00d4aa]/20 text-2xl">✦</div>
      <span className="font-heading text-[10px] font-semibold text-[#00d4aa]/70 uppercase tracking-widest animate-pulse">Same Visit. Same Day.</span>
      <p className="font-heading text-lg font-bold text-[#00d4aa] mt-2">Caught early — Stage IA</p>
      <div className="mt-3 space-y-1 text-sm font-sans">
        <p className="text-white/50">Screening cost: <span className="text-[#00d4aa] font-heading font-semibold">$4,200</span></p>
        <p className="text-white/50">Survival rate: <span className="text-[#00d4aa]">Significantly improved</span></p>
      </div>
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
      { threshold: 0.2 }
    );
    stageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isActive = (s: number) => visibleStages.has(s);

  const leftCards = [
    <Stage1Card key="l1" lane="chatbot" />,
    <Stage2Chatbot key="l2" />,
    <Stage3Chatbot key="l3" />,
    <Stage4Chatbot key="l4" />,
    <Stage5Chatbot key="l5" />,
  ];
  const centerCards = [
    <Stage1Card key="c1" lane="frontier" />,
    <Stage2Frontier key="c2" />,
    <Stage3Frontier key="c3" />,
    <Stage4Frontier key="c4" />,
    <Stage5Frontier key="c5" />,
  ];
  const rightCards = [
    <Stage1Card key="r1" lane="medient" />,
    <Stage2Medient key="r2" active={isActive(2)} />,
    <Stage3Medient key="r3" active={isActive(3)} />,
    <Stage4Medient key="r4" />,
    <Stage5Medient key="r5" />,
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "#1a1d21" }}>
      {/* heading */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl md:text-4xl font-bold text-white"
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
          Sarah Mitchell, 52 — 3 undetected risks. Three different systems. Three different results.
        </motion.p>
      </div>

      {/* column headers */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: LANES.chatbot.color + "80" }}>
            {LANES.chatbot.label}
          </span>
        </div>
        <div className="text-center">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: LANES.frontier.color + "80" }}>
            {LANES.frontier.label}
          </span>
        </div>
        <div className="text-center">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: LANES.medient.color + "80" }}>
            {LANES.medient.label}
          </span>
        </div>
      </div>

      {/* stages */}
      <div className="max-w-6xl mx-auto space-y-0">
        {STAGES.map((stage, idx) => (
          <div key={stage.id}>
            <div
              ref={(el) => { stageRefs.current[idx] = el; }}
              data-stage={stage.id}
              className="mb-3 mt-8"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="h-px flex-1 max-w-[60px] bg-white/10" />
                <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.25em] text-white/20">
                  Stage {stage.id} — {stage.label}
                </span>
                <div className="h-px flex-1 max-w-[60px] bg-white/10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Chatbot lane */}
              <div
                className="transition-all duration-700"
                style={{
                  opacity: isActive(stage.id) ? 1 : 0,
                  transform: isActive(stage.id) ? "translateY(0)" : "translateY(20px)",
                }}
              >
                {leftCards[idx]}
              </div>
              {/* Frontier lane */}
              <div
                className="transition-all duration-700"
                style={{
                  opacity: isActive(stage.id) ? 1 : 0,
                  transform: isActive(stage.id) ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: "0.1s",
                }}
              >
                {centerCards[idx]}
              </div>
              {/* Medient lane */}
              <div
                className="transition-all duration-700"
                style={{
                  opacity: isActive(stage.id) ? 1 : 0,
                  transform: isActive(stage.id) ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: "0.2s",
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
        className="max-w-6xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { val: "4 Pathways", desc: "Analyzed simultaneously" },
          { val: "23 Decision Points", desc: "Evaluated in <0.3s" },
          { val: "100% Guideline-Backed", desc: "USPSTF · ACC/AHA · ADA" },
          { val: "1 Compiled Output", desc: "Per patient encounter" },
        ].map((s, i) => (
          <div key={i} className="text-center py-4 border border-white/5 rounded-lg bg-white/[0.01]">
            <p className="font-heading text-sm font-semibold text-[#00d4aa]">{s.val}</p>
            <p className="font-sans text-[11px] text-white/25 mt-1">{s.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default PatientNarrativeSection;

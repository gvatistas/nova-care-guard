import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { TerminalFrame, CountUp, Ticker } from "@/components/hud/live";
import { site } from "@/content/site";

const GuideBenchSection = () => {
  const c = site.guideBench;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeRow, setActiveRow] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => setActiveRow((p) => (p + 1) % c.guidelines.length), 2400);
    return () => clearInterval(interval);
  }, [inView, c.guidelines.length]);

  return (
    <Section id="guidebench" surface="carbon" scale="generous">
      <DossierNumber number="Nº 06" label="OPEN BENCHMARK" position="tr" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <div ref={ref} className="grid grid-cols-12 gap-6 md:gap-10 mb-12 items-end">
        <header className="col-span-12 lg:col-span-8">
          <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
          <h2 id="guidebench-title" className="mt-4 text-display text-bone font-serif" style={{ fontWeight: 300, textWrap: "balance" }}>
            {c.h1}{" "}
            <span className="italic text-bone/75">{c.h1Tail}</span>
          </h2>
          <p className="mt-6 text-body-lg text-graphite max-w-2xl">{c.body}</p>
        </header>

        {/* Aggregate score callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="col-span-12 lg:col-span-4 border border-rule bg-ink p-6"
        >
          <div className="text-mono-eyebrow text-bone/45 mb-3">AGGREGATE FIDELITY</div>
          <div className="font-serif text-bone tabular leading-none" style={{ fontSize: "clamp(3rem,5vw,4.4rem)", fontWeight: 300, letterSpacing: "-0.04em" }}>
            <CountUp to={c.aggregate.fidelity} decimals={1} suffix="%" duration={2.5} />
          </div>
          <div className="mt-3 flex items-center justify-between text-mono-eyebrow">
            <span className="text-bone/45">INDUSTRY AVG</span>
            <span className="text-bone/85 tabular">{c.industryAvg}%</span>
          </div>
          <div className="mt-2 h-1 bg-bone/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${c.industryAvg}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-graphite/60"
            />
          </div>
          <div className="mt-2 h-1 bg-bone/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${c.aggregate.fidelity}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-signal-blue"
            />
          </div>
        </motion.div>
      </div>

      {/* GuideBench live table */}
      <TerminalFrame
        title="GUIDEBENCH ／ LEADERBOARD"
        status={`● UPDATED ${c.refresh}`}
        statusColor="hsl(var(--signal-green))"
        scan
      >
        <div className="grid grid-cols-[120px_1fr_100px_140px_120px] gap-4 px-6 py-3 border-b border-rule bg-ink/40">
          {["SOURCE", "GUIDELINE", "PATIENTS", "FIDELITY", "STATUS"].map((h) => (
            <span key={h} className="text-mono-eyebrow text-bone/45">{h}</span>
          ))}
        </div>
        {c.guidelines.map((g, i) => (
          <motion.div
            key={g.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className="grid grid-cols-[120px_1fr_100px_140px_120px] gap-4 px-6 py-4 border-b border-rule/60 transition-colors duration-300"
            style={{
              background: activeRow === i ? "hsla(var(--signal-blue) / 0.05)" : "transparent",
            }}
          >
            <span className="text-mono-eyebrow text-bone/65">{g.source}</span>
            <span className="text-body-sm text-bone">{g.name}</span>
            <span className="font-mono tabular text-bone/70 text-[13px]">{g.patients}</span>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-bone/10 overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ background: activeRow === i ? "hsl(var(--signal-blue))" : "hsl(var(--certa-bone) / 0.35)" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${g.fidelity}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="font-mono tabular text-bone text-[13px] w-12 text-right">{g.fidelity}%</span>
            </div>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background: activeRow === i ? "hsl(var(--signal-blue))" : "hsl(var(--signal-green))",
                  boxShadow: activeRow === i ? "0 0 8px hsl(var(--signal-blue))" : "none",
                }}
              />
              <span className="text-mono-eyebrow text-bone/70">{g.status.toUpperCase()}</span>
            </span>
          </motion.div>
        ))}
        {/* Aggregate footer row */}
        <div className="grid grid-cols-[120px_1fr_100px_140px_120px] gap-4 px-6 py-4 bg-ink/40">
          <span className="text-mono-eyebrow text-bone">AGGREGATE</span>
          <span className="text-body-sm text-bone/85">All guidelines</span>
          <span className="font-mono tabular text-bone text-[13px]">{c.aggregate.patients}</span>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-bone/10 overflow-hidden">
              <motion.div
                className="h-full bg-bone"
                initial={{ width: 0 }}
                whileInView={{ width: `${c.aggregate.fidelity}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono tabular text-bone text-[13px] w-12 text-right">{c.aggregate.fidelity}%</span>
          </div>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" style={{ boxShadow: "0 0 8px hsl(var(--signal-green))" }} />
            <span className="text-mono-eyebrow text-bone">LIVE</span>
          </span>
        </div>
      </TerminalFrame>

      {/* Methodology + repo links */}
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`https://arxiv.org/abs/${c.methodology}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-rule-strong text-mono-eyebrow text-bone hover:bg-ink transition-colors"
        >
          ◆ {c.methodology}
        </a>
        <a
          href={`https://${c.repo}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-rule-strong text-mono-eyebrow text-bone hover:bg-ink transition-colors"
        >
          ◆ {c.repo}
        </a>
      </div>

      <Ticker
        items={[
          `${c.aggregate.patients}+ SYNTHETIC PATIENTS`,
          "4 FIDELITY METRICS",
          "EXACT-OUTCOME MATCH",
          "COUNTERFACTUAL ROBUSTNESS",
          "PROVENANCE TRACEABILITY",
          "ERROR-CRITICALITY WEIGHTING",
          "OPEN SOURCE ／ RE-RUNNABLE",
        ]}
        speed={55}
        className="mt-12"
      />
    </Section>
  );
};

export default GuideBenchSection;

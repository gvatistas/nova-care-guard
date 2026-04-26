import { motion } from "framer-motion";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { TerminalFrame, PacketStream, CountUp } from "@/components/hud/live";
import { site } from "@/content/site";
import IsometricStack from "@/components/IsometricStack";

const HowItWorksSection = () => {
  const c = site.howItWorks;
  const accents = [
    "hsl(var(--signal-blue))",
    "hsl(var(--certa-bone))",
    "hsl(var(--signal-amber))",
    "hsl(var(--certa-graphite))",
  ];

  return (
    <Section id="how-it-works" surface="carbon" scale="generous">
      <DossierNumber number="Nº 04" label="ARCHITECTURE" position="tr" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <header className="max-w-4xl mb-14 md:mb-20">
        <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
        <h2 id="how-it-works-title" className="mt-4 text-display text-bone font-serif" style={{ fontWeight: 300, textWrap: "balance" }}>
          Aerospace-grade verification,{" "}
          <span className="italic text-bone/75">applied to medicine.</span>
        </h2>
        <p className="mt-6 text-body-lg text-graphite max-w-2xl">{c.sub}</p>
        <p className="mt-4 text-body text-graphite/85 max-w-2xl">{c.body}</p>
      </header>

      {/* Live stat row above the stack */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-rule mb-10" style={{ background: "hsl(var(--certa-rule))" }}>
        {[
          { k: "LAYERS", v: <CountUp to={4} />, suf: "" },
          { k: "P50 LATENCY", v: <CountUp to={87} />, suf: " MS" },
          { k: "INFERENCE @ RUNTIME", v: <CountUp to={0} />, suf: "" },
          { k: "PROOFS PER ARTIFACT", v: <CountUp to={3} />, suf: "" },
        ].map((s) => (
          <div key={s.k} className="bg-carbon p-5">
            <div className="text-mono-eyebrow text-bone/45 mb-3">{s.k}</div>
            <div className="font-serif text-bone tabular" style={{ fontSize: "clamp(1.7rem,3vw,2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {s.v}
              <span className="text-mono-eyebrow text-bone/45 ml-2">{s.suf}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Isometric stack inside a terminal frame */}
      <TerminalFrame title="CERTA ／ ARCHITECTURE.STACK" status="● COMPILED" statusColor="hsl(var(--signal-green))" scan={false}>
        <div className="p-2 md:p-4">
          <IsometricStack layers={c.layers as unknown as { num: string; name: string; sub: string; desc: string; nodes: string[] }[]} />
        </div>
        <div className="border-t border-rule">
          <PacketStream count={8} color="hsl(var(--signal-blue))" />
        </div>
      </TerminalFrame>

      {/* Layer descriptions */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px border border-rule" style={{ background: "hsl(var(--certa-rule))" }}>
        {c.layers.map((l, i) => (
          <motion.div
            key={l.num}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="bg-carbon p-7 md:p-8 relative group"
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-px opacity-50 group-hover:w-[3px] transition-all duration-500"
              style={{ background: accents[i] }}
            />
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-mono-eyebrow tabular" style={{ color: accents[i] }}>
                {l.num} ／ {l.name}
              </span>
              <span className="w-1.5 h-1.5 rotate-45" style={{ background: accents[i], opacity: 0.6 }} />
            </div>
            <p className="mt-4 text-bone font-serif" style={{ fontWeight: 300, fontSize: "1.35rem", lineHeight: 1.3 }}>
              {l.sub}
            </p>
            <p className="mt-3 text-body-sm text-graphite leading-relaxed">{l.desc}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {l.nodes.map((n) => (
                <span key={n} className="text-mono-eyebrow border border-rule px-2 py-1 text-graphite/80">
                  {n}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compliance pills */}
      <div className="mt-10 flex flex-wrap gap-3">
        {c.compliance.map((cm) => (
          <span key={cm} className="text-mono-eyebrow border border-rule px-3 py-2 text-bone/75">
            ◆ {cm}
          </span>
        ))}
      </div>

      <p className="mt-10 max-w-3xl text-body text-graphite/85 italic font-serif" style={{ fontWeight: 300 }}>
        {c.closer}
      </p>
    </Section>
  );
};

export default HowItWorksSection;

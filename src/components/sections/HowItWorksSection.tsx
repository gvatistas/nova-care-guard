import { motion } from "framer-motion";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { site } from "@/content/site";
import IsometricStack from "@/components/IsometricStack";

const HowItWorksSection = () => {
  const c = site.howItWorks;
  return (
    <Section id="how-it-works" surface="carbon" scale="generous">
      <DossierNumber number="Nº 04" label="ARCHITECTURE" position="tr" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <header className="max-w-4xl mb-14 md:mb-20">
        <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
        <h2 id="how-it-works-title" className="mt-4 text-display text-bone font-serif" style={{ fontWeight: 300 }}>
          {c.h1}
        </h2>
        <p className="mt-6 text-body-lg text-graphite max-w-2xl">{c.sub}</p>
        <p className="mt-4 text-body text-graphite/85 max-w-2xl">{c.body}</p>
      </header>

      {/* Isometric stack */}
      <div className="relative">
        <IsometricStack layers={c.layers as unknown as { num: string; name: string; sub: string; desc: string; nodes: string[] }[]} />
      </div>

      {/* Layer descriptions ─ ledger format underneath the stack */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-px border border-rule" style={{ background: "hsl(var(--certa-rule))" }}>
        {c.layers.map((l, i) => (
          <motion.div
            key={l.num}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="bg-carbon p-6 md:p-8"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-mono-eyebrow text-graphite/70 tabular">{l.num}</span>
              <span className="text-mono-eyebrow text-bone">{l.name}</span>
            </div>
            <p className="mt-3 text-body text-bone font-serif" style={{ fontWeight: 300, fontSize: "1.25rem", lineHeight: 1.35 }}>
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
      <div className="mt-12 flex flex-wrap gap-3">
        {c.compliance.map((cm) => (
          <span key={cm} className="text-mono-eyebrow border border-rule px-3 py-2 text-bone/70">
            ◆ {cm}
          </span>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-body text-graphite/85 italic font-serif" style={{ fontWeight: 300 }}>
        {c.closer}
      </p>
    </Section>
  );
};

export default HowItWorksSection;

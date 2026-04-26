import { motion } from "framer-motion";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { site } from "@/content/site";

const ProblemSection = () => {
  const c = site.problem;
  return (
    <Section id="problem" surface="ink" scale="generous">
      <DossierNumber number="Nº 02" label="THE PROBLEM" position="tr" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <header className="max-w-4xl mb-14 md:mb-20">
        <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
        <h2 id="problem-title" className="mt-4 text-display text-bone font-serif" style={{ fontWeight: 300 }}>
          {c.h1}
        </h2>
        <p className="mt-6 text-body-lg text-graphite max-w-3xl">{c.lead}</p>
      </header>

      {/* Three pillars — ledger format */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-rule" style={{ background: "hsl(var(--certa-rule))" }}>
        {c.pillars.map((p, i) => (
          <motion.article
            key={p.k}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="bg-ink p-8 md:p-10 relative"
          >
            <div className="flex items-start justify-between mb-6">
              <span className="text-mono-eyebrow text-bone tabular">0{i + 1} ／ {p.k}</span>
              <span
                className="w-2 h-2 rotate-45"
                style={{ background: i === 0 ? "hsl(var(--signal-red))" : i === 1 ? "hsl(var(--signal-amber))" : "hsl(var(--signal-blue))" }}
              />
            </div>
            <h3 className="text-h2 text-bone font-serif" style={{ fontWeight: 300 }}>
              {p.h}
            </h3>
            <p className="mt-5 text-body text-graphite leading-relaxed">{p.b}</p>
          </motion.article>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 max-w-3xl text-h2 text-bone font-serif italic"
        style={{ fontWeight: 300 }}
      >
        “{c.closer}”
      </motion.p>
    </Section>
  );
};

export default ProblemSection;

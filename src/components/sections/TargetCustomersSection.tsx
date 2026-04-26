import { motion } from "framer-motion";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { site } from "@/content/site";

const TargetCustomersSection = () => {
  const c = site.segments;
  return (
    <Section id="customers" surface="obsidian" scale="generous">
      <DossierNumber number="Nº 06" label="TARGET CUSTOMERS" position="tr" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <header className="max-w-4xl mb-14 md:mb-20">
        <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
        <h2 id="customers-title" className="mt-4 text-display text-bone font-serif" style={{ fontWeight: 300 }}>
          {c.h1}
        </h2>
        <p className="mt-6 text-body-lg text-graphite max-w-2xl">{c.sub}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-rule" style={{ background: "hsl(var(--certa-rule))" }}>
        {c.items.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="bg-carbon p-8 relative group hover:bg-ink transition-colors duration-500"
          >
            {/* accent edge */}
            <span
              aria-hidden
              className="absolute left-0 top-0 bottom-0 w-px transition-all duration-500 group-hover:w-[3px]"
              style={{ background: s.accent, opacity: 0.6 }}
            />

            {/* header — segment name + stat */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-mono-eyebrow tabular" style={{ color: s.accent }}>
                  0{i + 1} ／ {s.id.toUpperCase().replace("-", " ")}
                </p>
                <h3 className="mt-3 text-h3 text-bone font-serif" style={{ fontWeight: 400 }}>
                  {s.name}
                </h3>
              </div>
              <div className="text-right">
                <div
                  className="text-2xl font-mono tabular leading-none"
                  style={{ color: s.accent, fontWeight: 300 }}
                >
                  {s.stat.value}
                </div>
                <p className="text-mono-eyebrow text-graphite/60 mt-2">{s.stat.label}</p>
              </div>
            </div>

            {/* value prop */}
            <div className="mt-6 pt-5 border-t border-rule">
              <p className="text-mono-eyebrow text-graphite/60 mb-2">VALUE PROP</p>
              <p className="text-body-sm text-bone leading-relaxed">{s.valueProp}</p>
            </div>

            {/* operating impact */}
            <div className="mt-5 pt-5 border-t border-rule">
              <p className="text-mono-eyebrow text-graphite/60 mb-2">OPERATING IMPACT</p>
              <p className="text-body-sm text-graphite leading-relaxed">{s.operatingImpact}</p>
            </div>

            {/* accounts ticker */}
            <div className="mt-6 pt-4 border-t border-rule">
              <p className="text-mono-eyebrow text-graphite/45 leading-relaxed">{s.accounts}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
};

export default TargetCustomersSection;

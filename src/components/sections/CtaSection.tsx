import { motion } from "framer-motion";
import { Section, SectionHeader, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { site } from "@/content/site";

const CtaSection = () => {
  const c = site.cta;
  const f = c.footer;
  return (
    <Section id="contact" surface="ink" scale="standard" className="border-t border-rule">
      <DossierNumber number={c.dossier.num} label={c.dossier.label} position="bl" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <div className="max-w-3xl">
        <EyebrowLabel className="!text-bone/60">{c.eyebrow}</EyebrowLabel>
        <h2 id="contact-title" className="mt-4 text-display text-bone">{c.h1}</h2>
        <p className="mt-6 text-body-lg text-bone/85">{c.body}</p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href={c.primaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-3 border border-bone bg-bone text-ink text-mono-eyebrow hover:bg-bone/90 transition-colors"
          >
            {c.primaryCta.label} →
          </a>
          <a
            href={c.secondaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-3 border border-bone/30 text-bone/85 text-mono-eyebrow hover:border-bone/60 hover:text-bone transition-colors"
          >
            {c.secondaryCta.label}
          </a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-bone/10 pt-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {f.columns.map((col) => (
            <div key={col.title}>
              <EyebrowLabel className="!text-bone/60">{col.title}</EyebrowLabel>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-body-sm text-graphite hover:text-bone transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <EyebrowLabel className="!text-bone/60">Locations</EyebrowLabel>
            <ul className="mt-4 space-y-2.5 text-body-sm text-graphite">
              {f.locations.map((loc) => (
                <li key={loc}>{loc}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-bone/10 pt-6 md:flex-row md:items-center">
          <EyebrowLabel className="!text-bone/55">{f.copyright}</EyebrowLabel>
          <EyebrowLabel className="!text-bone/55">{f.tagline}</EyebrowLabel>
        </div>
      </footer>
    </Section>
  );
};

export default CtaSection;

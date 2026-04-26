import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { site } from "@/content/site";

const PricingSection = () => {
  const c = site.pricing;
  return (
    <Section id="pricing" surface="ink" scale="generous">
      <DossierNumber number="Nº 07" label="PRICING" position="tr" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <header className="max-w-4xl mb-14 md:mb-20">
        <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
        <h2 id="pricing-title" className="mt-4 text-display text-bone font-serif" style={{ fontWeight: 300 }}>
          {c.h1}
        </h2>
        <p className="mt-6 text-body-lg text-graphite max-w-2xl">{c.sub}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px border border-rule" style={{ background: "hsl(var(--certa-rule))" }}>
        {c.tiers.map((t, i) => {
          const accentColor =
            t.accent === "blue" ? "hsl(var(--signal-blue))" : t.accent === "bone" ? "hsl(var(--certa-bone))" : "hsl(var(--certa-graphite))";
          return (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-carbon p-8 md:p-10 flex flex-col"
              style={{
                background: t.featured ? "hsl(var(--certa-obsidian))" : undefined,
              }}
            >
              {t.featured && (
                <span
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: accentColor, opacity: 0.7 }}
                />
              )}

              {/* tier header */}
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-mono-eyebrow text-bone">{t.name}</span>
                <span className="text-mono-eyebrow text-graphite/60">— {t.tag}</span>
              </div>

              {/* price */}
              <div className="border-t border-rule pt-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-bone tabular" style={{ fontWeight: 300, fontSize: "clamp(2.4rem, 4vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {t.price}
                  </span>
                  <span className="text-mono-eyebrow text-graphite">{t.unit}</span>
                </div>
                <p className="mt-4 text-body-sm text-graphite leading-relaxed">{t.blurb}</p>
              </div>

              {/* features */}
              <ul className="mt-8 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={14} strokeWidth={1.5} className="mt-1 shrink-0" style={{ color: accentColor }} />
                    <span className="text-body-sm text-bone/85">{f}</span>
                  </li>
                ))}
              </ul>

              {/* cta */}
              <a
                href={t.cta.href}
                className="mt-10 inline-flex items-center justify-center gap-2 px-5 py-3 border text-mono-eyebrow transition-colors"
                style={{
                  borderColor: t.featured ? accentColor : "hsl(var(--certa-rule-strong))",
                  background: t.featured ? accentColor : "transparent",
                  color: t.featured ? (t.accent === "bone" ? "hsl(var(--certa-ink))" : "hsl(var(--certa-bone))") : "hsl(var(--certa-bone))",
                }}
              >
                {t.cta.label} →
              </a>
            </motion.article>
          );
        })}
      </div>

      <p className="mt-10 text-body-sm text-graphite/70 max-w-2xl">
        All tiers include the same audit pack on every response: artifact id, source page and paragraph,
        compile log, and ed25519 signature. The price is for the surface area, not the certainty.
      </p>
    </Section>
  );
};

export default PricingSection;

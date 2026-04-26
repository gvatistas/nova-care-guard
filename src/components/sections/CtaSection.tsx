import { motion } from "framer-motion";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { Ticker, BlinkingCursor } from "@/components/hud/live";
import { site } from "@/content/site";
import ctaImg from "@/assets/cta-cinematic.jpg";

const CtaSection = () => {
  const c = site.cta;
  const f = c.footer;
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-ink border-t border-rule"
    >
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={ctaImg}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(0.65) contrast(1.05)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--certa-ink)) 0%, hsla(var(--certa-ink)/0.65) 28%, hsla(var(--certa-ink)/0.78) 70%, hsl(var(--certa-ink)) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-content px-6 md:px-10 py-28 md:py-40">
        <div className="flex items-center justify-between border-y border-bone/15 px-4 py-2 mb-12 md:mb-16">
          <p className="text-mono-eyebrow text-bone/55">{c.classified.left}</p>
          <p className="text-mono-eyebrow text-bone/55 hidden sm:block">{c.classified.right}</p>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 lg:col-span-8">
            <EyebrowLabel className="!text-bone/65">{c.eyebrow}</EyebrowLabel>
            <h2
              id="contact-title"
              className="mt-4 font-serif text-bone"
              style={{
                fontSize: "clamp(2.6rem, 6vw, 5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                fontWeight: 300,
                textWrap: "balance",
              }}
            >
              Three lines of code.{" "}
              <span className="italic text-bone/75">The probabilistic-error tax goes away.</span>
            </h2>
            <p className="mt-6 text-body-lg text-bone/85 max-w-2xl">{c.body}</p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href={c.primaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-bone text-ink text-mono-eyebrow hover:bg-bone/90 transition-colors"
              >
                {c.primaryCta.label} →
              </a>
              <a
                href={c.secondaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 border border-bone/35 text-bone/85 text-mono-eyebrow hover:border-bone/70 hover:text-bone transition-colors"
              >
                {c.secondaryCta.label}
              </a>
            </motion.div>
          </div>

          {/* Terminal call-out */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="hidden lg:block col-span-4"
          >
            <div className="border border-bone/25 bg-ink/85 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-bone/15 px-3 py-2">
                <span className="text-mono-eyebrow text-bone/55">CERTA ／ QUICKSTART</span>
                <span className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" />
              </div>
              <pre className="p-4 text-[12px] leading-relaxed text-bone/90 font-mono overflow-x-auto">
{`$ npm i @certa/sdk
$ export CERTA_API_KEY=...
$ certa.recommend({
    patient,
    guideline: "uspstf.lung-cancer"
  })`}
                <BlinkingCursor color="hsl(var(--signal-green))" />
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Live ticker */}
        <div className="mt-16">
          <Ticker
            items={[
              "DECISIONS, NOT ADJECTIVES.",
              "ZERO INFERENCE AT RUNTIME.",
              "AUDIT-PACK ON EVERY CALL.",
              "SOC 2 TYPE II IN PROGRESS.",
              "FHIR R4 ／ MCP ／ CDS HOOKS.",
            ]}
            speed={60}
          />
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-bone/15 pt-12">
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
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-bone/15 pt-6 md:flex-row md:items-center">
            <EyebrowLabel className="!text-bone/55">{f.copyright}</EyebrowLabel>
            <EyebrowLabel className="!text-bone/55">{f.tagline}</EyebrowLabel>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default CtaSection;

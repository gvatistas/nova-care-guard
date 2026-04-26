import { motion } from "framer-motion";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { Ticker } from "@/components/hud/live";
import { site } from "@/content/site";

const TargetCustomersSection = () => {
  const c = site.segments;
  return (
    <Section id="customers" surface="obsidian" scale="generous">
      <DossierNumber number="Nº 06" label="TARGET CUSTOMERS" position="tr" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <header className="max-w-4xl mb-10 md:mb-14">
        <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
        <h2 id="customers-title" className="mt-4 text-display text-bone font-serif" style={{ fontWeight: 300, textWrap: "balance" }}>
          One artifact.{" "}
          <span className="italic text-bone/75">Six places it gets used.</span>
        </h2>
        <p className="mt-6 text-body-lg text-graphite max-w-2xl">{c.sub}</p>
      </header>

      {/* Customer logo ticker — pulled from accounts */}
      <Ticker
        items={c.items.flatMap((it) => it.accounts.split(" · ").map((a) => `${it.name.toUpperCase()} ／ ${a}`))}
        speed={80}
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-rule" style={{ background: "hsl(var(--certa-rule))" }}>
        {c.items.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="bg-carbon p-8 relative group hover:bg-ink transition-colors duration-500 overflow-hidden"
          >
            {/* accent edge */}
            <span
              aria-hidden
              className="absolute left-0 top-0 bottom-0 w-px transition-all duration-500 group-hover:w-[3px]"
              style={{ background: s.accent, opacity: 0.7 }}
            />
            {/* corner ticks */}
            {(["tr", "br"] as const).map((p) => (
              <span
                key={p}
                aria-hidden
                className="absolute pointer-events-none"
                style={{
                  top: p.startsWith("t") ? 10 : "auto",
                  bottom: p.startsWith("b") ? 10 : "auto",
                  right: 10,
                  width: 6,
                  height: 6,
                  borderTop: p.startsWith("t") ? `1px solid ${s.accent}` : "none",
                  borderBottom: p.startsWith("b") ? `1px solid ${s.accent}` : "none",
                  borderRight: `1px solid ${s.accent}`,
                  opacity: 0.5,
                }}
              />
            ))}

            {/* header */}
            <div className="flex items-start justify-between mb-5 gap-3">
              <div className="min-w-0">
                <p className="text-mono-eyebrow tabular truncate" style={{ color: s.accent }}>
                  0{i + 1} ／ {s.id.toUpperCase().replace("-", " ")}
                </p>
                <h3 className="mt-3 text-bone font-serif" style={{ fontWeight: 300, fontSize: "1.7rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {s.name}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="font-serif tabular leading-none whitespace-nowrap"
                  style={{ color: s.accent, fontWeight: 300, fontSize: "clamp(1.4rem,1.8vw,1.8rem)", letterSpacing: "-0.025em" }}
                >
                  {s.stat.value}
                </div>
                <p className="text-mono-eyebrow text-graphite/55 mt-2">{s.stat.label}</p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-rule">
              <p className="text-mono-eyebrow text-graphite/55 mb-2">VALUE PROP</p>
              <p className="text-body-sm text-bone/90 leading-relaxed">{s.valueProp}</p>
            </div>

            <div className="mt-5 pt-5 border-t border-rule">
              <p className="text-mono-eyebrow text-graphite/55 mb-2">OPERATING IMPACT</p>
              <p className="text-body-sm text-graphite leading-relaxed">{s.operatingImpact}</p>
            </div>

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

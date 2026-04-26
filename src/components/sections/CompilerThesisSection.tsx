import { motion } from "framer-motion";
import { Section, SectionHeader, ClassifiedStrip, LockGlyph, EyebrowLabel } from "@/components/hud";
import { site } from "@/content/site";

const Lane = ({ label, items, accent }: { label: string; items: readonly string[]; accent: string }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <span className="h-2 w-2" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
      <EyebrowLabel className="!text-bone/70">{label}</EyebrowLabel>
    </div>
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {items.map((it, i) => (
        <div key={it} className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border border-rule bg-carbon px-3 py-2 text-mono-data text-bone whitespace-nowrap"
          >
            {it}
          </motion.div>
          {i < items.length - 1 && <span className="text-graphite/50">→</span>}
        </div>
      ))}
    </div>
  </div>
);

const CompilerThesisSection = () => {
  const c = site.compiler;
  return (
    <Section id="compiler" surface="obsidian" scale="compact">
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />
      <SectionHeader id="compiler" eyebrow={c.eyebrow} headline={c.h1} maxW="max-w-4xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-body-lg text-bone/85">{c.body1}</p>
          <p className="text-body text-graphite">{c.body2}</p>
          <p className="text-body text-graphite">{c.body3}</p>
        </div>
        <div className="mt-12 lg:mt-0 lg:col-span-5">
          <div className="border border-rule bg-carbon p-6 space-y-8">
            <Lane label="BUILD-TIME" items={c.buildLane} accent="hsl(var(--signal-amber))" />
            <div className="flex items-center justify-center gap-3 py-2 border-y border-rule">
              <LockGlyph size={14} tone="green" />
              <EyebrowLabel className="!text-signal-green">SECURE & AUDITABLE</EyebrowLabel>
            </div>
            <Lane label="RUN-TIME" items={c.runLane} accent="hsl(var(--signal-green))" />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CompilerThesisSection;

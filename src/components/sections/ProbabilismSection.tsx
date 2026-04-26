import { motion } from "framer-motion";
import { Section, SectionHeader, ClassifiedStrip, StatPanel, EyebrowLabel } from "@/components/hud";
import { site } from "@/content/site";

const ProbabilismSection = () => {
  const c = site.probabilism;
  return (
    <Section id="probabilism" surface="ink" scale="standard">
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <SectionHeader id="probabilism" eyebrow={c.eyebrow} headline={c.h1} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <p className="mt-2 text-body-lg text-bone/85">{c.lead}</p>
            <p className="mt-6 text-body text-graphite">{c.body}</p>
            <p className="mt-6 text-body text-graphite">{c.closer}</p>
          </motion.div>
        </div>
        <aside className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:col-span-5 lg:mt-0">
          {c.stats.map((s, i) => (
            <motion.div
              key={s.caption}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <StatPanel value={s.value} caption={s.caption} source={s.source} color={i === 0 ? "signal-red" : "bone"} />
            </motion.div>
          ))}
        </aside>
      </div>
      <div className="mt-12 flex items-center gap-2">
        <EyebrowLabel>END · DOSSIER 02</EyebrowLabel>
      </div>
    </Section>
  );
};

export default ProbabilismSection;

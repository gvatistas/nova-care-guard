import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader, ClassifiedStrip, EyebrowLabel } from "@/components/hud";
import { site } from "@/content/site";

const HowItWorksSection = () => {
  const c = site.howItWorks;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % c.stages.length), 3500);
    return () => clearInterval(t);
  }, [c.stages.length]);

  const cur = c.stages[active];

  return (
    <Section id="how-it-works" surface="ink" scale="standard" className="texture-crosshatch">
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />
      <div className="flex items-start justify-between flex-wrap gap-6 mb-12">
        <SectionHeader id="how-it-works" eyebrow={c.eyebrow} headline={c.h1} maxW="max-w-2xl" />
        <div className="flex flex-col gap-2 mt-2">
          {c.pips.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-green" style={{ boxShadow: "0 0 6px hsl(var(--signal-green))" }} />
              <EyebrowLabel className="!text-signal-green">{p}</EyebrowLabel>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline rail */}
      <div className="relative mb-10 hidden md:block">
        <div className="absolute inset-x-0 top-1/2 h-px bg-rule" />
        <div
          className="absolute left-0 top-1/2 h-px bg-bone/60 transition-all duration-700"
          style={{ width: `${((active + 1) / c.stages.length) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {c.stages.map((s, i) => (
            <button
              key={s.num}
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-3 group"
            >
              <span
                className="h-3 w-3 rotate-45 border transition-all"
                style={{
                  borderColor: i <= active ? "hsl(var(--certa-bone))" : "hsl(var(--certa-rule-strong))",
                  background: i <= active ? "hsl(var(--certa-bone))" : "transparent",
                }}
              />
              <EyebrowLabel className={i === active ? "!text-bone" : "!text-muted-foreground"}>
                {s.num} · {s.name}
              </EyebrowLabel>
            </button>
          ))}
        </div>
      </div>

      {/* Active stage panel */}
      <div className="border border-rule bg-carbon grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        {/* Left: morphing wireframe */}
        <div className="relative aspect-square md:aspect-auto p-8 border-b md:border-b-0 md:border-r border-rule flex items-center justify-center">
          <motion.div
            key={cur.num}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-bone/10 select-none"
            style={{ fontSize: "clamp(120px, 22vw, 280px)", fontWeight: 200, letterSpacing: "-0.05em", lineHeight: 0.9 }}
          >
            {cur.num}
          </motion.div>
        </div>
        {/* Right: copy */}
        <motion.div
          key={cur.num + "-copy"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-12 flex flex-col justify-center"
        >
          <EyebrowLabel className="!text-signal-blue">{cur.num} · {cur.name}</EyebrowLabel>
          <h3 className="text-h2 text-bone mt-3">{cur.short}</h3>
          <p className="mt-4 text-body text-graphite">{cur.desc}</p>
          <div className="mt-6 inline-flex self-start items-center gap-2 border border-rule px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
            <EyebrowLabel className="!text-signal-green">{cur.badge}</EyebrowLabel>
          </div>
        </motion.div>
      </div>

      {/* Compliance trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 mt-8 border border-rule">
        {c.compliance.map((cmp, i) => (
          <div
            key={cmp}
            className={`px-6 py-4 text-center ${i < c.compliance.length - 1 ? "border-b sm:border-b-0 sm:border-r border-rule" : ""}`}
          >
            <EyebrowLabel className="!text-bone/80">{cmp}</EyebrowLabel>
          </div>
        ))}
      </div>

      <p className="mt-10 text-body-lg text-graphite italic max-w-3xl">"{c.closer}"</p>
    </Section>
  );
};

export default HowItWorksSection;

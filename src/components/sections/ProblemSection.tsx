import { motion } from "framer-motion";
import { Section, ClassifiedStrip, EyebrowLabel, DossierNumber } from "@/components/hud";
import { TerminalFrame, Ticker, CountUp, BlinkingCursor } from "@/components/hud/live";
import { site } from "@/content/site";
import problemImg from "@/assets/problem-cinematic.jpg";

const ProblemSection = () => {
  const c = site.problem;
  const tones = ["red", "amber", "blue"] as const;
  const accents = ["hsl(var(--signal-red))", "hsl(var(--signal-amber))", "hsl(var(--signal-blue))"];

  return (
    <Section id="problem" surface="ink" scale="generous">
      <DossierNumber number="Nº 02" label="THE PROBLEM" position="tr" />
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />

      <div className="grid grid-cols-12 gap-6 md:gap-10 items-center mb-16 md:mb-20">
        {/* ─── Headline ─── */}
        <header className="col-span-12 lg:col-span-7">
          <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
          <h2
            id="problem-title"
            className="mt-4 text-display text-bone font-serif"
            style={{ fontWeight: 300, textWrap: "balance" }}
          >
            Generative models are wrong about medicine —{" "}
            <span className="italic text-bone/75">quietly, repeatedly, at scale.</span>
          </h2>
          <p className="mt-6 text-body-lg text-graphite max-w-2xl">{c.lead}</p>
        </header>

        {/* ─── Cinematic image with terminal overlay ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-rule">
            <img
              src={problemImg}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(0.7) contrast(1.1)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsla(var(--certa-ink)/0.4) 0%, hsla(var(--certa-ink)/0.1) 50%, hsla(var(--certa-ink)/0.85) 100%)",
              }}
            />
            {/* Floating overlay readout */}
            <div className="absolute bottom-4 left-4 right-4 border border-bone/25 bg-ink/80 backdrop-blur-sm p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-bone/15">
                <span className="text-mono-eyebrow text-bone/55">HEALTHBENCH ／ FRONTIER MODELS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-signal-red animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-mono-eyebrow text-bone/45">EXPERT-LEVEL CEILING</span>
                  <span className="font-mono tabular text-bone text-base">
                    <CountUp to={75} suffix="%" duration={2} />
                  </span>
                </div>
                <div className="h-1 bg-bone/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-signal-red"
                  />
                </div>
                <div className="flex items-end justify-between pt-1">
                  <span className="text-mono-eyebrow text-bone/45">RESIDUAL ERROR</span>
                  <span className="font-mono tabular text-signal-red text-base">
                    <CountUp to={25} suffix="%" duration={2} />
                  </span>
                </div>
              </div>
            </div>
            {/* corner ticks */}
            {(["tl", "tr", "bl", "br"] as const).map((p) => (
              <span
                key={p}
                className="absolute pointer-events-none"
                style={{
                  top: p.startsWith("t") ? 8 : "auto",
                  bottom: p.startsWith("b") ? 8 : "auto",
                  left: p.endsWith("l") ? 8 : "auto",
                  right: p.endsWith("r") ? 8 : "auto",
                  width: 10,
                  height: 10,
                  borderTop: p.startsWith("t") ? "1px solid hsl(var(--certa-bone))" : "none",
                  borderBottom: p.startsWith("b") ? "1px solid hsl(var(--certa-bone))" : "none",
                  borderLeft: p.endsWith("l") ? "1px solid hsl(var(--certa-bone))" : "none",
                  borderRight: p.endsWith("r") ? "1px solid hsl(var(--certa-bone))" : "none",
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Live ticker ─── */}
      <Ticker
        items={[
          "≈ 250M SUBOPTIMAL CLINICAL RESPONSES PER YEAR",
          "54% MEAN US AMBULATORY GUIDELINE COMPLIANCE",
          "5% ADULTS RECEIVING ALL RECOMMENDED PREVENTIVE SERVICES",
          "≈ 1M PREVENTABLE DEATHS / YEAR · NORTH AMERICA",
          "FDA JANUARY 2026 ／ NON-TRANSPARENT CDS = MEDICAL DEVICE",
        ]}
        speed={55}
        className="mb-14"
      />

      {/* ─── Three pillars as terminal frames ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {c.pillars.map((p, i) => (
          <motion.div
            key={p.k}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <TerminalFrame
              title={`0${i + 1} ／ ${p.k}`}
              status="● FAILING"
              statusColor={accents[i]}
              scan
            >
              <div className="p-7 md:p-8 min-h-[260px] flex flex-col">
                <h3
                  className="text-h2 text-bone font-serif"
                  style={{ fontWeight: 300, letterSpacing: "-0.015em" }}
                >
                  {p.h}
                </h3>
                <p className="mt-5 text-body-sm text-graphite leading-relaxed flex-1">{p.b}</p>
                <div className="mt-5 pt-4 border-t border-rule flex items-center gap-2 text-mono-eyebrow text-bone/45">
                  <span>$ certa.diagnose</span>
                  <BlinkingCursor color={accents[i]} />
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        ))}
      </div>

      {/* ─── Closer ─── */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-16 max-w-3xl text-h2 text-bone font-serif italic"
        style={{ fontWeight: 300 }}
      >
        “{c.closer}”
      </motion.p>
    </Section>
  );
};

export default ProblemSection;

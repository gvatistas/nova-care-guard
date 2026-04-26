import { motion } from "framer-motion";

/**
 * ArchitectureExhibit — Palantir-style animated systems plate.
 * Four horizontal layers with distinct color tones, animated data packets
 * traveling top→bottom through the Certa engine.
 */

const SERIF = "'Newsreader', 'Times New Roman', serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

type Layer = {
  id: string;
  index: string;
  label: string;
  caption: string;
  items: string[];
  tone: string; // hsl
  toneSoft: string;
};

const LAYERS: Layer[] = [
  {
    id: "inputs",
    index: "L01",
    label: "Inputs",
    caption: "Heterogeneous evidence and signal",
    items: ["Primary literature", "Society guidelines", "Payer policy", "Institutional protocol", "EHR signal"],
    tone: "hsl(202, 70%, 62%)",
    toneSoft: "hsl(202, 60%, 22%)",
  },
  {
    id: "core",
    index: "L02",
    label: "Core",
    caption: "Versioned, governed clinical ontology",
    items: ["Node graph", "Provenance", "Version control", "Audit trail"],
    tone: "hsl(168, 55%, 58%)",
    toneSoft: "hsl(168, 50%, 20%)",
  },
  {
    id: "engine",
    index: "L03",
    label: "Engine",
    caption: "Deterministic compilation, not inference",
    items: ["Compiler", "Resolver", "Citation binder", "Reproducibility kernel"],
    tone: "hsl(38, 78%, 62%)",
    toneSoft: "hsl(38, 60%, 22%)",
  },
  {
    id: "surfaces",
    index: "L04",
    label: "Surfaces",
    caption: "Source-grounded artifacts at the point of care",
    items: ["Decision support", "Prior authorization", "Trial matching", "Quality reporting"],
    tone: "hsl(348, 72%, 64%)",
    toneSoft: "hsl(348, 60%, 24%)",
  },
];

/* Animated data packet traveling down the spine */
const Packet = ({ delay, x }: { delay: number; x: number }) => (
  <motion.circle
    cx={x}
    r={2.5}
    fill="hsl(45, 90%, 70%)"
    initial={{ cy: 0, opacity: 0 }}
    animate={{ cy: [0, 720], opacity: [0, 1, 1, 0] }}
    transition={{
      duration: 4.2,
      delay,
      repeat: Infinity,
      ease: "linear",
      times: [0, 0.05, 0.95, 1],
    }}
    style={{ filter: "drop-shadow(0 0 6px hsl(45, 90%, 70%))" }}
  />
);

const ArchitectureExhibit = () => {
  return (
    <section className="py-24 md:py-32 px-6" style={{ background: "#0B1320" }}>
      <div className="max-w-7xl mx-auto">
        {/* Document header */}
        <div
          className="flex items-end justify-between pb-4 mb-12 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-baseline gap-6">
            <span
              className="text-[10px] tracking-[0.24em] uppercase"
              style={{ color: "rgba(243,244,246,0.5)", fontFamily: MONO }}
            >
              Fig. 02
            </span>
            <span
              className="text-[10px] tracking-[0.24em] uppercase hidden md:inline"
              style={{ color: "rgba(243,244,246,0.32)", fontFamily: MONO }}
            >
              System Architecture · Rev 2.4
            </span>
          </div>
          <span
            className="text-[10px] tracking-[0.24em] uppercase"
            style={{ color: "rgba(243,244,246,0.32)", fontFamily: MONO }}
          >
            Certa / Operational Layer
          </span>
        </div>

        {/* Headline */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-16">
          <h2
            className="md:col-span-7 text-4xl md:text-[3.25rem] font-light"
            style={{
              color: "#F3F4F6",
              fontFamily: SERIF,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            One ontology.
            <br />
            <em style={{ fontWeight: 300, color: "rgba(243,244,246,0.65)" }}>Every data source.</em>
            <br />
            Every clinical surface.
          </h2>
          <p
            className="md:col-span-5 md:pt-3 text-[15px] leading-[1.7]"
            style={{ color: "rgba(243,244,246,0.62)" }}
          >
            Certa is the operational layer between fragmented healthcare data and the decisions made on top of
            it. A versioned ontology compiles guidelines, evidence, and institutional protocol into the artifacts
            clinicians actually use — every output deterministic, every claim citable.
          </p>
        </div>

        {/* The plate */}
        <div
          className="relative border"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0F1827" }}
        >
          {/* corner ticks */}
          {[
            { t: 0, l: 0 },
            { t: 0, r: 0 },
            { b: 0, l: 0 },
            { b: 0, r: 0 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 z-20 pointer-events-none"
              style={{
                top: p.t,
                bottom: p.b,
                left: p.l,
                right: p.r,
                borderTop: p.t === 0 ? "1px solid rgba(243,244,246,0.5)" : undefined,
                borderBottom: p.b === 0 ? "1px solid rgba(243,244,246,0.5)" : undefined,
                borderLeft: p.l === 0 ? "1px solid rgba(243,244,246,0.5)" : undefined,
                borderRight: p.r === 0 ? "1px solid rgba(243,244,246,0.5)" : undefined,
              }}
            />
          ))}

          {/* Engineering grid background */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.5 }}
            aria-hidden
          >
            <defs>
              <pattern id="arch-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(243,244,246,0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#arch-grid)" />
          </svg>

          {/* Animated flow spine — runs through every layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block"
            viewBox="0 0 1200 760"
            preserveAspectRatio="none"
            aria-hidden
          >
            {/* vertical guide lines */}
            {[300, 600, 900].map((x) => (
              <line
                key={x}
                x1={x}
                y1={20}
                x2={x}
                y2={740}
                stroke="rgba(243,244,246,0.08)"
                strokeDasharray="2 4"
              />
            ))}
            {/* packets at multiple x positions, staggered */}
            <Packet x={300} delay={0} />
            <Packet x={300} delay={1.4} />
            <Packet x={300} delay={2.8} />
            <Packet x={600} delay={0.6} />
            <Packet x={600} delay={2.0} />
            <Packet x={600} delay={3.4} />
            <Packet x={900} delay={1.0} />
            <Packet x={900} delay={2.6} />
          </svg>

          {/* Layer stack */}
          <div className="relative z-[5]">
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative grid grid-cols-12 gap-0 border-b last:border-b-0"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: `linear-gradient(90deg, ${layer.toneSoft}33 0%, transparent 60%)`,
                }}
              >
                {/* Left rail — index + tone bar */}
                <div
                  className="col-span-12 md:col-span-2 px-6 py-8 md:py-10 flex md:flex-col justify-between md:justify-start gap-2 border-r"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-8"
                      style={{
                        background: layer.tone,
                        boxShadow: `0 0 12px ${layer.tone}`,
                      }}
                    />
                    <span
                      className="text-[10px] tracking-[0.28em] uppercase"
                      style={{ color: "rgba(243,244,246,0.45)", fontFamily: MONO }}
                    >
                      {layer.index}
                    </span>
                  </div>
                  <div
                    className="text-[28px] md:text-[32px] font-light leading-none mt-0 md:mt-3"
                    style={{ color: layer.tone, fontFamily: SERIF, letterSpacing: "-0.01em" }}
                  >
                    {layer.label}
                  </div>
                </div>

                {/* Caption */}
                <div
                  className="col-span-12 md:col-span-3 px-6 py-6 md:py-10 border-r"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="text-[10px] tracking-[0.24em] uppercase mb-3"
                    style={{ color: "rgba(243,244,246,0.4)", fontFamily: MONO }}
                  >
                    Function
                  </div>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: "rgba(243,244,246,0.78)", fontFamily: SERIF }}
                  >
                    {layer.caption}
                  </p>
                </div>

                {/* Items */}
                <div className="col-span-12 md:col-span-7 px-6 py-6 md:py-10">
                  <div
                    className="text-[10px] tracking-[0.24em] uppercase mb-4"
                    style={{ color: "rgba(243,244,246,0.4)", fontFamily: MONO }}
                  >
                    Components
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {layer.items.map((item, j) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.4, delay: i * 0.12 + j * 0.06 }}
                        className="flex items-center gap-2.5"
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full"
                          style={{ background: layer.tone, boxShadow: `0 0 6px ${layer.tone}` }}
                        />
                        <span
                          className="text-[13px] tracking-wide"
                          style={{ color: "rgba(243,244,246,0.85)", fontFamily: MONO }}
                        >
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer caption */}
          <div
            className="px-6 py-4 border-t flex items-center justify-between text-[10px] tracking-[0.24em] uppercase"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              color: "rgba(243,244,246,0.45)",
              fontFamily: MONO,
            }}
          >
            <span>Fig. 02 — Compiled flow, source → surface</span>
            <span className="hidden md:inline">Deterministic · Versioned · Auditable</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureExhibit;

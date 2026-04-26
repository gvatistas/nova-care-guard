import * as React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader, ClassifiedStrip } from "@/components/hud";
import CertaGlyph from "@/components/visuals/CertaGlyph";
import PixelField from "@/components/visuals/PixelField";

/**
 * ArchitectureExhibit — Fig.02. Four-layer system rendered as a stacked
 * pixel diagram with the CertaGlyph as the central engine reactor.
 * Inputs → Core → Engine → Surfaces, with packets streaming top-to-bottom.
 */

const LAYERS = [
  {
    id: "inputs",
    label: "01 · INPUTS",
    title: "Sources of truth",
    items: ["Guideline PDFs", "FHIR R4 records", "Trial protocols", "Institutional policy"],
    color: "hsl(217 91% 60%)",
  },
  {
    id: "core",
    label: "02 · CORE",
    title: "Compiled ontology",
    items: ["Versioned graph", "Citable nodes", "SMT-verified", "Reproducible builds"],
    color: "hsl(188 91% 47%)",
  },
  {
    id: "engine",
    label: "03 · ENGINE",
    title: "Certa runtime",
    items: ["Deterministic resolver", "Provenance trail", "MCP / REST / SDK", "<100ms median"],
    color: "hsl(32 95% 54%)",
  },
  {
    id: "surfaces",
    label: "04 · SURFACES",
    title: "Where it lands",
    items: ["AI agents", "EHR / SDC renderers", "Consumer health", "Payer workflows"],
    color: "hsl(0 73% 51%)",
  },
];

/* small inline pixel chip */
const PixelChip: React.FC<{ color: string }> = ({ color }) => (
  <span
    aria-hidden
    style={{
      display: "inline-block",
      width: 8,
      height: 8,
      background: color,
      boxShadow: `0 0 4px ${color}`,
      marginRight: 10,
    }}
  />
);

/* Vertical packet rail between layers */
const PacketRail: React.FC<{ color: string; delay?: number }> = ({ color, delay = 0 }) => (
  <div className="relative h-10 md:h-14 mx-auto" style={{ width: 1 }}>
    <div className="absolute inset-0" style={{ background: "hsl(220 13% 22%)" }} />
    <motion.div
      initial={{ top: -8, opacity: 0 }}
      animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.6, delay, repeat: Infinity, ease: "linear" }}
      style={{
        position: "absolute",
        left: -3,
        width: 7,
        height: 7,
        background: color,
        boxShadow: `0 0 6px ${color}`,
      }}
    />
  </div>
);

const ArchitectureExhibit: React.FC = () => {
  return (
    <Section id="architecture" surface="ink" scale="generous" hudFrame>
      <PixelField opacity={0.18} cell={18} />
      <ClassifiedStrip
        left="CERTA // DOSSIER 02 · ARCHITECTURE"
        right="FIG.02 · SYSTEM PLATE"
      />

      <SectionHeader
        id="architecture"
        eyebrow="ARCHITECTURE"
        headline={
          <>
            <span className="font-serif italic">Inputs.</span> Core. Engine.{" "}
            <span className="font-serif italic">Surfaces.</span>
          </>
        }
        secondary="One pipeline. Four layers. Every output traceable to its source."
        maxW="max-w-3xl"
      />

      <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-start">
        {/* LEFT: stacked layer plate */}
        <div className="md:col-span-7">
          <div className="border border-rule bg-carbon p-6 md:p-8 relative">
            {/* corner ticks */}
            {(["tl","tr","bl","br"] as const).map((p) => (
              <span key={p} aria-hidden className="absolute"
                style={{
                  top: p.startsWith("t") ? 8 : "auto",
                  bottom: p.startsWith("b") ? 8 : "auto",
                  left: p.endsWith("l") ? 8 : "auto",
                  right: p.endsWith("r") ? 8 : "auto",
                  width: 10, height: 10,
                  borderTop: p.startsWith("t") ? "1px solid hsl(213 11% 88%)" : "none",
                  borderBottom: p.startsWith("b") ? "1px solid hsl(213 11% 88%)" : "none",
                  borderLeft: p.endsWith("l") ? "1px solid hsl(213 11% 88%)" : "none",
                  borderRight: p.endsWith("r") ? "1px solid hsl(213 11% 88%)" : "none",
                  opacity: 0.5,
                }}
              />
            ))}

            {LAYERS.map((layer, i) => (
              <React.Fragment key={layer.id}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="border border-rule bg-obsidian relative overflow-hidden"
                >
                  {/* layer accent rail */}
                  <div className="absolute left-0 top-0 bottom-0" style={{ width: 3, background: layer.color, opacity: 0.85 }} />
                  <div className="grid grid-cols-12 gap-4 p-5 md:p-6 pl-7">
                    <div className="col-span-12 md:col-span-4">
                      <p className="text-mono-eyebrow" style={{ color: layer.color }}>{layer.label}</p>
                      <h3 className="mt-2 font-serif text-bone" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                        {layer.title}
                      </h3>
                    </div>
                    <ul className="col-span-12 md:col-span-8 grid grid-cols-2 gap-x-6 gap-y-2">
                      {layer.items.map((it) => (
                        <li key={it} className="flex items-center text-body-sm text-graphite">
                          <PixelChip color={layer.color} />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
                {i < LAYERS.length - 1 && (
                  <PacketRail color={LAYERS[i + 1].color} delay={i * 0.4} />
                )}
              </React.Fragment>
            ))}

            {/* footer plate */}
            <div className="mt-6 border-t border-rule pt-3 flex items-center justify-between text-mono-eyebrow text-graphite/70">
              <span>FIG.02 · DETERMINISTIC PIPELINE</span>
              <span className="hidden md:inline">REPRODUCIBLE · CITABLE · AUDITABLE</span>
            </div>
          </div>
        </div>

        {/* RIGHT: glyph reactor + thesis */}
        <div className="md:col-span-5 md:sticky md:top-24 flex flex-col items-center">
          <div className="relative">
            <CertaGlyph size={420} unit={24} frame />
          </div>
          <div className="mt-6 max-w-sm">
            <p className="text-mono-eyebrow text-graphite/70 mb-3">THE ENGINE</p>
            <p className="text-body text-graphite leading-relaxed">
              The same compiled ontology runs across every surface — from frontier-lab agents
              to a rural clinic tablet — without re-inference, without drift, without
              re-training.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ArchitectureExhibit;

import * as React from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import CertaGlyph from "@/components/visuals/CertaGlyph";
import PixelField from "@/components/visuals/PixelField";
import { HudFrame, DossierNumber, ClassifiedStrip } from "@/components/hud";

/**
 * HeroSection — spec-aligned dark bookend.
 * Pixelized animated brandmark anchors the page.
 */
const HeroSection: React.FC = () => {
  const h = site.hero;
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-ink text-bone"
      style={{ minHeight: "100vh" }}
    >
      {/* layered backdrop */}
      <div className="absolute inset-0 bg-carbon" />
      <PixelField opacity={0.28} cell={20} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 35%, hsla(217,91%,60%,0.10), transparent 60%)",
        }}
      />
      <HudFrame tone="bone" inset={28} />
      <DossierNumber number={h.dossier.num} label={h.dossier.label} position="br" />

      <div className="relative z-[2] mx-auto max-w-content px-6 md:px-10 pt-28 md:pt-32 pb-20 md:pb-24">
        {/* meta strip */}
        <div className="flex items-center justify-between border-y border-rule py-2 mb-12">
          <span className="text-mono-eyebrow text-graphite">CERTA // DOSSIER 01 · OPERATIONAL LAYER</span>
          <span className="text-mono-eyebrow text-graphite hidden md:inline">CLASSIFIED</span>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* LEFT — type column */}
          <div className="md:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-mono-eyebrow text-graphite mb-8"
            >
              {h.eyebrow}
            </motion.p>

            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-bone"
              style={{
                fontSize: "clamp(2.6rem, 5.6vw, 4.6rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                fontWeight: 300,
              }}
            >
              The operational layer for{" "}
              <span style={{ fontStyle: "italic", color: "hsl(213 11% 96%)" }}>AI</span> in
              healthcare.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45 }}
              className="mt-8 text-body-lg text-graphite max-w-2xl"
            >
              {h.subhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a
                href={h.primaryCta.href}
                className="text-mono-eyebrow px-6 py-3.5 bg-bone text-ink hover:bg-cloud transition-colors duration-300"
              >
                {h.primaryCta.label}
              </a>
              <a
                href={h.secondaryCta.href}
                className="text-mono-eyebrow px-6 py-3.5 border border-rule-strong text-bone hover:bg-obsidian transition-colors duration-300"
              >
                {h.secondaryCta.label}
              </a>
            </motion.div>

            {/* trust strip */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.95 }}
              className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 border-t border-rule pt-6 max-w-2xl"
            >
              {h.trust.map((t) => (
                <li key={t} className="text-mono-eyebrow text-graphite/80">
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT — animated pixel glyph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 flex items-center justify-center"
          >
            <div className="relative">
              <CertaGlyph size={460} unit={24} frame />
              <div className="mt-6 flex items-center justify-between text-mono-eyebrow text-graphite/70 px-1">
                <span>FIG.00 · COMPILED ONTOLOGY</span>
                <span>v0.10.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* bottom rule + classification strip */}
      <div className="relative z-[2] border-t border-rule">
        <div className="mx-auto max-w-content px-6 md:px-10 py-3 flex items-center justify-between">
          <span className="text-mono-eyebrow text-graphite/70">
            {site.brand.fellow}
          </span>
          <span className="text-mono-eyebrow text-graphite/70 hidden md:inline">
            SEED {site.brand.raise.amount} / {site.brand.raise.valuation}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

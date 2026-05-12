import { motion } from "framer-motion";
import heroImg from "@/assets/hero-tactical.jpg";
import { site } from "@/content/site";
import { Ticker, BlinkingCursor } from "@/components/hud/live";

const HeroSection = () => {
  const c = site.hero;
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-ink"
      aria-labelledby="hero-title"
    >
      {/* ─── Cinematic photograph ────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          className="h-full w-full object-cover"
          style={{ filter: "saturate(0.75) contrast(1.15)" }}
        />
        {/* Two-stage scrim — tactical, near-pure black */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--certa-ink)) 0%, hsla(var(--certa-ink)/0.85) 18%, hsla(var(--certa-ink)/0.55) 50%, hsla(var(--certa-ink)/0.78) 85%, hsl(var(--certa-ink)) 100%)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 60%, transparent 0%, hsla(var(--certa-ink)/0.45) 100%)",
          }}
        />
        {/* paper grain */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px",
          }}
        />
      </div>

      {/* ─── Top dossier strip (under navbar) ─────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-24 md:pt-28">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="flex items-center justify-between border-y border-bone/15 py-2.5">
            <span className="text-mono-eyebrow text-bone/65">{c.classified.left}</span>
            <span className="text-mono-eyebrow text-bone/65 hidden md:inline">{c.classified.right}</span>
          </div>
        </div>
      </div>

      {/* ─── Centered content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex min-h-screen w-full items-center pt-44 pb-44 md:pb-52">
        <div className="mx-auto max-w-content px-6 md:px-10 w-full">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            {/* Left — type stack */}
            <div className="col-span-12 lg:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="flex items-center gap-3 mb-7"
              >
                <span className="w-1.5 h-1.5 rotate-45 bg-bone/60" />
                <span className="text-mono-eyebrow text-bone/65">{c.dossier.num} ／ {c.dossier.label}</span>
              </motion.div>

              <motion.h1
                id="hero-title"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-bone"
                style={{
                  fontSize: "clamp(3rem, 7.4vw, 6.4rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.035em",
                  fontWeight: 300,
                  textWrap: "balance",
                }}
              >
                The operational layer<br className="hidden md:inline" />
                <span className="italic text-bone/85"> for AI in healthcare.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="mt-9 mb-7 h-px bg-bone/25 origin-left max-w-md"
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-bone/85 max-w-2xl text-body-lg"
              >
                {c.subhead}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
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
                  className="inline-flex items-center gap-2 px-6 py-3 border border-bone/30 text-bone text-mono-eyebrow hover:border-bone/70 transition-colors"
                >
                  {c.secondaryCta.label}
                </a>
              </motion.div>
            </div>

            {/* Right — terminal call-out (visible on lg+) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block col-span-3"
            >
              <div className="border border-bone/20 bg-ink/70 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-bone/15 px-3 py-2">
                  <span className="text-mono-eyebrow text-bone/55">CERTA ／ STATUS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" />
                </div>
                <div className="p-3 space-y-2.5">
                  <div className="flex justify-between text-mono-eyebrow">
                    <span className="text-bone/45">UPTIME</span>
                    <span className="text-bone tabular">99.997%</span>
                  </div>
                  <div className="flex justify-between text-mono-eyebrow">
                    <span className="text-bone/45">P50 LATENCY</span>
                    <span className="text-bone tabular">87 MS</span>
                  </div>
                  <div className="flex justify-between text-mono-eyebrow">
                    <span className="text-bone/45">CATALOG</span>
                    <span className="text-bone tabular">42 GUIDELINES</span>
                  </div>
                  <div className="flex justify-between text-mono-eyebrow">
                    <span className="text-bone/45">LAST BUILD</span>
                    <span className="text-bone tabular">14:22 UTC</span>
                  </div>
                  <div className="border-t border-bone/15 pt-2.5 mt-2.5">
                    <div className="flex items-center gap-1.5 text-mono-eyebrow text-signal-green">
                      <span>$ certa.compile</span>
                      <BlinkingCursor color="hsl(var(--signal-green))" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Bottom ticker — trust signals ────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <Ticker items={[...c.trust, "DECISIONS, NOT ADJECTIVES.", "ZERO INFERENCE AT RUNTIME.", "AUDIT-PACK ON EVERY CALL.", ...c.trust]} speed={70} />
      </div>
    </section>
  );
};

export default HeroSection;

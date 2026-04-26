import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticleGrid from "@/components/ParticleGrid";
import HeroSection from "@/components/HeroSection";
import PatientNarrativeSection from "@/components/PatientNarrativeSection";
import PipelineSection from "@/components/PipelineSection";
import SegmentsSection from "@/components/SegmentsSection";
import ProjectAlphaSection from "@/components/ProjectAlphaSection";
import GuideBenchSection from "@/components/GuideBenchSection";
import CTASection from "@/components/CTASection";
import ArchitectureExhibit from "@/components/ArchitectureExhibit";

const GeoDivider = () => <div className="divider-geo mx-6 md:mx-8" />;

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);

/* Technical exhibit — Palantir-style figure plate */
const ExhibitBlock = ({
  src,
  figure,
  classification,
  title,
  thesis,
  spec,
}: {
  src: string;
  figure: string;
  classification: string;
  title: string;
  thesis: string;
  spec: { k: string; v: string }[];
}) => (
  <section className="py-24 md:py-32 px-6" style={{ background: "#0F1827" }}>
    <div className="max-w-7xl mx-auto">
      {/* Top metadata strip — like a declassified document header */}
      <div
        className="flex items-end justify-between pb-4 mb-10 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-baseline gap-6">
          <span
            className="text-[10px] tracking-[0.22em] uppercase"
            style={{ color: "rgba(243,244,246,0.45)", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {figure}
          </span>
          <span
            className="text-[10px] tracking-[0.22em] uppercase hidden md:inline"
            style={{ color: "rgba(243,244,246,0.3)", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {classification}
          </span>
        </div>
        <span
          className="text-[10px] tracking-[0.22em] uppercase"
          style={{ color: "rgba(243,244,246,0.3)", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          Certa / Technical Brief
        </span>
      </div>

      {/* Title + thesis */}
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-14">
        <h2
          className="md:col-span-7 text-3xl md:text-[2.75rem] font-light"
          style={{ color: "#F3F4F6", letterSpacing: "-0.025em", lineHeight: 1.08 }}
        >
          {title}
        </h2>
        <p
          className="md:col-span-5 md:pt-3 text-[15px] leading-relaxed"
          style={{ color: "rgba(243,244,246,0.65)" }}
        >
          {thesis}
        </p>
      </div>

      {/* Schematic plate */}
      <figure
        className="relative border"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0B1320" }}
      >
        {/* corner registration ticks */}
        {[
          { top: 0, left: 0, b: "borderTop", b2: "borderLeft" },
          { top: 0, right: 0, b: "borderTop", b2: "borderRight" },
          { bottom: 0, left: 0, b: "borderBottom", b2: "borderLeft" },
          { bottom: 0, right: 0, b: "borderBottom", b2: "borderRight" },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 z-10"
            style={{
              top: p.top as number | undefined,
              left: p.left as number | undefined,
              right: p.right as number | undefined,
              bottom: p.bottom as number | undefined,
              borderColor: "rgba(243,244,246,0.4)",
              [p.b]: "1px solid rgba(243,244,246,0.4)",
              [p.b2]: "1px solid rgba(243,244,246,0.4)",
            } as React.CSSProperties}
          />
        ))}
        <img src={src} alt={title} className="w-full h-auto block" loading="lazy" />
        <figcaption
          className="px-6 py-4 border-t flex items-center justify-between text-[10px] tracking-[0.22em] uppercase"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            color: "rgba(243,244,246,0.5)",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          }}
        >
          <span>{figure} — Comparative inference topology</span>
          <span className="hidden md:inline">Ontology v2.4 · Source-grounded</span>
        </figcaption>
      </figure>

      {/* Spec strip beneath the plate */}
      <div
        className="mt-10 grid grid-cols-1 md:grid-cols-3 border-t border-l"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {spec.map((s, i) => (
          <div
            key={i}
            className="p-6 md:p-8 border-r border-b"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="text-[10px] tracking-[0.24em] uppercase mb-3"
              style={{ color: "rgba(243,244,246,0.4)", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {s.k}
            </div>
            <div
              className="text-[15px] leading-relaxed"
              style={{ color: "rgba(243,244,246,0.85)" }}
            >
              {s.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleGrid />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ScrollReveal>
          <ExhibitBlock
            src="/certa-comparison.png"
            figure="Fig. 01"
            classification="Internal // Technical Brief 001"
            title="Probabilistic medicine has no audit trail. Certa compiles certainty instead."
            thesis="Generative models infer plausible-sounding clinical outputs across an unbounded probability space — without provenance, without reproducibility, without recourse. Certa replaces inference with compilation: every output traces deterministically to a versioned node in a single clinical ontology."
            spec={[
              { k: "Problem", v: "Unbounded inference, no source attribution, non-reproducible outputs across runs and clinicians." },
              { k: "Method", v: "A single source-of-truth ontology compiled from primary literature, guidelines, and institutional protocol." },
              { k: "Guarantee", v: "Every artifact is deterministic, citable to a node ID, and reproducible across time, sites, and reviewers." },
            ]}
          />
        </ScrollReveal>
        <GeoDivider />
        <ScrollReveal>
          <PatientNarrativeSection />
        </ScrollReveal>
        <GeoDivider />
        <ScrollReveal>
          <SegmentsSection />
        </ScrollReveal>
        <GeoDivider />
        <ScrollReveal>
          <ProjectAlphaSection />
        </ScrollReveal>
        <GeoDivider />
        <ScrollReveal>
          <ExhibitBlock
            src="/certa-hero-mesh.png"
            figure="Fig. 02"
            classification="Internal // Architecture Brief"
            title="One ontology. Every data source. Every clinical surface."
            thesis="Certa is the operational layer between fragmented healthcare data and the decisions made on top of it — a single, versioned ontology that compiles guidelines, evidence, and institutional protocol into the artifacts clinicians actually use."
            spec={[
              { k: "Inputs", v: "Primary literature, society guidelines, payer policy, institutional protocol, EHR signal." },
              { k: "Core", v: "A versioned, governed clinical ontology. One source of truth. One graph. One audit trail." },
              { k: "Surfaces", v: "Point-of-care decision support, prior-auth, trial matching, quality reporting — all source-grounded." },
            ]}
          />
        </ScrollReveal>
        <GeoDivider />
        <ScrollReveal>
          <PipelineSection />
        </ScrollReveal>
        <GeoDivider />
        <ScrollReveal>
          <GuideBenchSection />
        </ScrollReveal>
        <GeoDivider />
        <ScrollReveal>
          <CTASection />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Index;

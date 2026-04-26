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

/* Editorial illustration block — Palantir-style poster */
const PosterBlock = ({
  src,
  eyebrow,
  title,
  caption,
}: {
  src: string;
  eyebrow: string;
  title: string;
  caption: string;
}) => (
  <section className="py-20 md:py-28 px-6" style={{ background: "#141d2e" }}>
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.15)" }} />
        <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {eyebrow}
        </span>
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.15)" }} />
      </div>
      <h2
        className="text-3xl md:text-5xl font-light mb-10 max-w-3xl"
        style={{ color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {title}
      </h2>
      <div
        className="relative overflow-hidden border"
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0F1827" }}
      >
        <img src={src} alt={title} className="w-full h-auto block" loading="lazy" />
      </div>
      <p
        className="mt-6 text-[13px] uppercase tracking-[0.12em]"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {caption}
      </p>
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

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticleGrid from "@/components/ParticleGrid";
import HeroSection from "@/components/HeroSection";
import PatientNarrativeSection from "@/components/PatientNarrativeSection";
import DecisionTreeSection from "@/components/DecisionTreeSection";
import Level1Section from "@/components/Level1Section";
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
          <Level1Section />
        </ScrollReveal>
        <GeoDivider />
        <ScrollReveal>
          <PipelineSection />
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

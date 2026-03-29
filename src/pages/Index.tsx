import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticleGrid from "@/components/ParticleGrid";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import Level1Section from "@/components/Level1Section";
import PipelineSection from "@/components/PipelineSection";
import SegmentsSection from "@/components/SegmentsSection";
import ProjectBetaSection from "@/components/ProjectBetaSection";
import GuideBenchSection from "@/components/GuideBenchSection";
import CTASection from "@/components/CTASection";

const GeoDivider = () => <div className="divider-geo mx-6 md:mx-8" />;

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
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
          <ProblemSection />
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
          <ProjectBetaSection />
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

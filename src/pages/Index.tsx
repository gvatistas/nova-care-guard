import Navbar from "@/components/Navbar";
import ParticleGrid from "@/components/ParticleGrid";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import Level1Section from "@/components/Level1Section";
import PipelineSection from "@/components/PipelineSection";

import SegmentsSection from "@/components/SegmentsSection";
import ProjectBetaSection from "@/components/ProjectBetaSection";
import GuideBenchSection from "@/components/GuideBenchSection";
import SecuritySection from "@/components/SecuritySection";

import CTASection from "@/components/CTASection";

const GeoDivider = () => <div className="divider-geo mx-6 md:mx-8" />;

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleGrid />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <GeoDivider />
        <ProblemSection />
        <GeoDivider />
        <Level1Section />
        <GeoDivider />
        <PipelineSection />
        <GeoDivider />
        <SegmentsSection />
        <GeoDivider />
        <ProjectBetaSection />
        <GeoDivider />
        <GuideBenchSection />
        <GeoDivider />
        <SecuritySection />
        <GeoDivider />
        <TractionSection />
        <GeoDivider />
        <CTASection />
      </div>
    </div>
  );
};

export default Index;

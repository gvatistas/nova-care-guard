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

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleGrid />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <Level1Section />
        <PipelineSection />
        <SegmentsSection />
        <ProjectBetaSection />
        <GuideBenchSection />
        <CTASection />
      </div>
    </div>
  );
};

export default Index;

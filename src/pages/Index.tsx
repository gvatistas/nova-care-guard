import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ProjectBetaSection from "@/components/ProjectBetaSection";
import PipelineSection from "@/components/PipelineSection";
import SegmentsSection from "@/components/SegmentsSection";
import GuideBenchSection from "@/components/GuideBenchSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <ProjectBetaSection />
      <PipelineSection />
      <SegmentsSection />
      <GuideBenchSection />
      <CTASection />
    </div>
  );
};

export default Index;

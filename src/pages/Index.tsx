import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Level1Section from "@/components/Level1Section";
import Level2Section from "@/components/Level2Section";
import HighScoresSection from "@/components/HighScoresSection";
import TheBreakSection from "@/components/TheBreakSection";
import PipelineSection from "@/components/PipelineSection";
import SegmentsSection from "@/components/SegmentsSection";
import ProjectBetaSection from "@/components/ProjectBetaSection";
import GuideBenchSection from "@/components/GuideBenchSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      {/* §1 — The Pixel World */}
      <HeroSection />
      {/* §2 — Level 1: The Waiting Game */}
      <Level1Section />
      {/* §3 — Level 2: Compiler Activated */}
      <Level2Section />
      {/* §4 — High Scores */}
      <HighScoresSection />
      {/* §5 — The Break: Pixel World Shatters */}
      <TheBreakSection />
      {/* §6 — The Authority World: Pipeline */}
      <PipelineSection />
      {/* §7 — Market Segments */}
      <SegmentsSection />
      {/* §8 — Project Beta (Case Study) */}
      <ProjectBetaSection />
      {/* §9 — GuideBench */}
      <GuideBenchSection />
      {/* §10 — CTA & Footer */}
      <CTASection />
    </div>
  );
};

export default Index;

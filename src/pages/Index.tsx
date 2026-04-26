import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PatientNarrativeSection from "@/components/PatientNarrativeSection";
import ProblemSection from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TargetCustomersSection from "@/components/sections/TargetCustomersSection";
import PricingSection from "@/components/sections/PricingSection";
import GuideBenchSection from "@/components/GuideBenchSection";
import CtaSection from "@/components/sections/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-ink relative">
      <Navbar />
      {/* 1 — Hero */}
      <HeroSection />
      {/* 2 — Jane Doe */}
      <PatientNarrativeSection />
      {/* 3 — Problem of AI in Healthcare */}
      <ProblemSection />
      {/* 4 — How It Works (isometric stack) */}
      <HowItWorksSection />
      {/* 5 — Target Customers */}
      <TargetCustomersSection />
      {/* 6 — Pricing */}
      <PricingSection />
      {/* 7 — GuideBench */}
      <GuideBenchSection />
      {/* 8 — CTA / Outro */}
      <CtaSection />
    </div>
  );
};

export default Index;

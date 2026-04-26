import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ArchitectureExhibit from "@/components/ArchitectureExhibit";
import ProbabilismSection from "@/components/sections/ProbabilismSection";
import CompilerThesisSection from "@/components/sections/CompilerThesisSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PatientNarrativeSection from "@/components/PatientNarrativeSection";
import ProjectAlphaSection from "@/components/ProjectAlphaSection";
import BuildWithCertaSection from "@/components/sections/BuildWithCertaSection";
import CtaSection from "@/components/sections/CtaSection";

const Divider = () => (
  <div aria-hidden className="relative h-px bg-rule mx-6 md:mx-10">
    <span
      className="absolute left-1/2 -top-[3px] -translate-x-1/2 w-[7px] h-[7px] rotate-45 bg-graphite/60"
    />
  </div>
);

const Index = () => (
  <main className="min-h-screen bg-ink relative">
    <Navbar />
    {/* Hero */}
    <HeroSection />

    {/* 01 Why this exists */}
    <ProbabilismSection />
    <Divider />

    {/* 02 Thesis: build-time vs run-time */}
    <CompilerThesisSection />
    <Divider />

    {/* Architecture exhibit — pixelized brand visual */}
    <ArchitectureExhibit />
    <Divider />

    {/* 03 One patient — Jane Doe (preserved) */}
    <PatientNarrativeSection />
    <Divider />

    {/* 04 How it works (5-stage pipeline) */}
    <HowItWorksSection />
    <Divider />

    {/* 06 Deployed — Project Alpha (preserved) */}
    <ProjectAlphaSection />
    <Divider />

    {/* 07 Build */}
    <BuildWithCertaSection />
    <Divider />

    {/* CTA + footer */}
    <CtaSection />
  </main>
);

export default Index;

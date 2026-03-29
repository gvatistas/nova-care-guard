import { useState, useEffect } from "react";
import FacetedCrownLogo from "@/components/FacetedCrownLogo";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled ? "border-b border-white/[0.08]" : "bg-transparent"
      }`}
      style={{
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        backgroundColor: scrolled ? "rgba(0,0,0,0.8)" : "transparent",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-16 md:h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <FacetedCrownLogo size={32} />
          <span className="font-mono text-white text-lg tracking-[0.08em] font-light">MEDIENT</span>
          <span className="font-mono text-white text-lg tracking-[0.08em] font-extralight">HEALTH</span>
        </a>
        <div className="flex items-center gap-6 md:gap-10">
          <a href="#pipeline" className="hidden md:block font-mono text-base tracking-[0.1em] uppercase hover:text-white transition-colors duration-300" style={{ color: "rgba(255,255,255,0.6)" }}>
            Architecture
          </a>
          <a href="#project-alpha" className="hidden md:block font-mono text-base tracking-[0.1em] uppercase hover:text-white transition-colors duration-300" style={{ color: "rgba(255,255,255,0.6)" }}>
            Project Alpha
          </a>
          <a href="#contact" className="font-mono text-base tracking-[0.1em] uppercase text-white border border-white/20 px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-300">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

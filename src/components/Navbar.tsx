import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out"
      style={{
        background: scrolled
          ? "linear-gradient(180deg, rgba(28,28,28,0.75) 0%, rgba(28,28,28,0.45) 70%, transparent 100%)"
          : "linear-gradient(180deg, rgba(28,28,28,0.4) 0%, rgba(28,28,28,0.15) 60%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "blur(12px) saturate(1.2)",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "blur(12px) saturate(1.2)",
      }}
    >
      {/* Subtle bottom edge line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-700"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 70%, transparent 95%)",
          opacity: scrolled ? 1 : 0,
        }}
      />
      <div className="max-w-[1440px] mx-auto px-8 h-16 md:h-20 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <span className="text-[22px] font-bold" style={{ letterSpacing: "0.12em", color: "#FFFFFF" }}>MEDIENT</span>
        </a>
        <div className="flex items-center gap-6 md:gap-10">
          <a href="#pipeline" className="hidden md:block text-[13px] font-medium uppercase hover:text-white transition-colors duration-300" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
            Architecture
          </a>
          <a href="#project-alpha" className="hidden md:block text-[13px] font-medium uppercase hover:text-white transition-colors duration-300" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
            Project Alpha
          </a>
          <a
            href="#contact"
            className="text-[13px] font-medium uppercase px-6 py-2.5 transition-all duration-500 backdrop-blur-md rounded-sm"
            style={{
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.85)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

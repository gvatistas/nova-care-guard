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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out"
      style={{
        background: scrolled
          ? "linear-gradient(180deg, rgba(17,24,39,0.85) 0%, rgba(17,24,39,0.6) 60%, transparent 100%)"
          : "linear-gradient(180deg, rgba(17,24,39,0.7) 0%, rgba(17,24,39,0.35) 50%, transparent 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-16 md:h-20 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <span className="text-[22px] font-bold" style={{ letterSpacing: "0.12em", color: "#FFFFFF" }}>MEDIENT</span>
        </a>
        <div className="flex items-center gap-6 md:gap-10">
          <a href="#pipeline" className="hidden md:block text-[13px] font-medium uppercase hover:text-white transition-colors duration-300" style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>
            Architecture
          </a>
          <a href="#project-alpha" className="hidden md:block text-[13px] font-medium uppercase hover:text-white transition-colors duration-300" style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>
            Project Alpha
          </a>
          <a
            href="#contact"
            className="text-[13px] font-medium uppercase px-6 py-2.5 transition-all duration-500 backdrop-blur-sm rounded-sm"
            style={{
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.9)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
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

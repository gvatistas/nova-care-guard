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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out`}
      style={{
        backgroundColor: "#0F172A",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-16 md:h-20 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <span className="text-[22px] font-bold" style={{ letterSpacing: "0.12em", color: "#FFFFFF" }}>MEDIENT</span>
        </a>
        <div className="flex items-center gap-6 md:gap-10">
          <a href="#pipeline" className="hidden md:block text-[13px] font-medium uppercase hover:text-[#2563EB] transition-colors duration-300" style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.05em" }}>
            Architecture
          </a>
          <a href="#project-alpha" className="hidden md:block text-[13px] font-medium uppercase hover:text-[#2563EB] transition-colors duration-300" style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.05em" }}>
            Project Alpha
          </a>
          <a href="#contact" className="text-[13px] font-medium uppercase text-white px-6 py-2.5 transition-all duration-300 hover:bg-[#1D4ED8]" style={{ letterSpacing: "0.05em", backgroundColor: "#2563EB" }}>
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

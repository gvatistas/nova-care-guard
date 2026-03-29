import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-void/95 backdrop-blur-sm border-b border-grid-line" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-mono text-pearl font-light tracking-[-0.02em] text-lg">
          <span className="text-teal">[</span>
          CLASSIFIED
          <span className="text-teal">]</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#project-beta" className="font-mono text-warm-gray text-xs tracking-[0.15em] uppercase hover:text-teal transition-colors">
            Project Beta
          </a>
          <a href="#pipeline" className="font-mono text-warm-gray text-xs tracking-[0.15em] uppercase hover:text-teal transition-colors">
            Architecture
          </a>
          <a href="#contact" className="font-mono text-warm-gray text-xs tracking-[0.15em] uppercase hover:text-teal transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

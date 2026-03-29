import { useState, useEffect } from "react";
import medientLogo from "@/assets/medient-logo.jpg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <img src={medientLogo} alt="Medient Health" className="h-8 w-8 object-contain rounded-sm invert brightness-200" />
          <span className="font-mono text-white text-sm tracking-[0.15em] uppercase font-light">Medient</span>
        </a>
        <div className="flex items-center gap-10">
          <a href="#pipeline" className="hidden md:block font-mono text-gray-400 text-sm tracking-[0.15em] uppercase hover:text-white transition-colors duration-300">
            Architecture
          </a>
          <a href="#project-beta" className="hidden md:block font-mono text-gray-400 text-sm tracking-[0.15em] uppercase hover:text-white transition-colors duration-300">
            Project Beta
          </a>
          <a href="#contact" className="font-mono text-sm tracking-[0.15em] uppercase text-white border border-white/20 px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-300">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

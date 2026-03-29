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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
        <div className="font-mono text-white text-sm tracking-[0.2em] uppercase font-light">
          [Classified]
        </div>
        <div className="flex items-center gap-10">
          <a
            href="#"
            className="font-mono text-gray-500 text-[11px] tracking-[0.2em] uppercase hover:text-white transition-colors duration-300"
          >
            Whitepaper
          </a>
          <a
            href="#contact"
            className="font-mono text-[11px] tracking-[0.2em] uppercase text-white border border-white/20 px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

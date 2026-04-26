import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "linear-gradient(180deg, hsla(var(--certa-ink) / 0.92) 0%, hsla(var(--certa-ink) / 0.7) 70%, transparent 100%)"
          : "linear-gradient(180deg, hsla(var(--certa-ink) / 0.55) 0%, hsla(var(--certa-ink) / 0.2) 60%, transparent 100%)",
        backdropFilter: scrolled ? "blur(14px)" : "blur(8px)",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "blur(8px)",
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, hsla(var(--certa-bone) / 0.18) 50%, transparent 95%)",
          opacity: scrolled ? 1 : 0,
        }}
      />
      <div className="mx-auto max-w-content px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <span className="w-2 h-2 rotate-45 bg-bone group-hover:bg-signal-blue transition-colors" />
          <span
            className="text-bone text-mono-eyebrow"
            style={{ fontSize: "0.95rem", letterSpacing: "0.22em" }}
          >
            CERTA
          </span>
          <span className="hidden md:inline-block h-3 w-px bg-bone/20" />
          <span className="hidden md:inline text-mono-eyebrow text-bone/45">DOSSIER 01</span>
        </a>

        <div className="flex items-center gap-2 md:gap-3">
          {[
            { href: "#problem", label: "Problem" },
            { href: "#how-it-works", label: "Architecture" },
            { href: "#customers", label: "Customers" },
            { href: "#guidebench", label: "GuideBench" },
            { href: "#pricing", label: "Pricing" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden md:inline-flex items-center px-3 py-2 text-mono-eyebrow text-bone/55 hover:text-bone transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 inline-flex items-center gap-2 px-4 md:px-5 py-2.5 bg-bone text-ink text-mono-eyebrow hover:bg-bone/90 transition-colors"
          >
            TRY THE API →
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

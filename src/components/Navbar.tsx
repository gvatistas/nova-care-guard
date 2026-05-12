import { useState, useEffect } from "react";

const NEWS_HEADLINE = "Certa raises $3M seed at $15M to ship the operational layer for AI in healthcare";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showNews, setShowNews] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ─── Classification / news bar (Shield AI style) ─── */}
      {showNews && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-carbon border-b border-rule">
          <div className="mx-auto max-w-content px-6 md:px-10 h-8 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-mono-eyebrow text-terra-bright">
              <span className="w-1.5 h-1.5 bg-terra-bright animate-pulse" />
              [NEWS]
            </span>
            <span className="text-mono-eyebrow text-bone/70 truncate text-center flex-1">
              {NEWS_HEADLINE}
            </span>
            <button
              onClick={() => setShowNews(false)}
              aria-label="Dismiss"
              className="text-bone/50 hover:text-bone text-mono-eyebrow"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <nav
        className="fixed left-0 right-0 z-50 transition-all duration-500"
        style={{
          top: showNews ? 32 : 0,
          background: scrolled
            ? "linear-gradient(180deg, hsla(var(--certa-ink) / 0.95) 0%, hsla(var(--certa-ink) / 0.75) 70%, transparent 100%)"
            : "linear-gradient(180deg, hsla(var(--certa-ink) / 0.6) 0%, hsla(var(--certa-ink) / 0.2) 60%, transparent 100%)",
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
        <div className="mx-auto max-w-content px-6 md:px-10 h-14 md:h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <span className="relative inline-flex items-center justify-center w-5 h-5">
              <span className="absolute inset-0 border border-bone/70 group-hover:border-terra-bright transition-colors" />
              <span className="w-1.5 h-1.5 bg-terra-bright" />
            </span>
            <span
              className="text-bone text-mono-eyebrow"
              style={{ fontSize: "0.95rem", letterSpacing: "0.24em" }}
            >
              CERTA
            </span>
            <span className="hidden md:inline-block h-3 w-px bg-bone/20" />
            <span className="hidden md:inline text-mono-eyebrow text-bone/45">
              ／ OPERATIONAL LAYER
            </span>
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
              className="ml-2 inline-flex items-center gap-2 px-4 md:px-5 py-2 bg-terra text-bone text-mono-eyebrow border border-terra-bright/40 hover:bg-terra-bright transition-colors"
            >
              SCHEDULE A DEMONSTRATION
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

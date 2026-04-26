import * as React from "react";
import { motion } from "framer-motion";
import { revealProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
 * Certa HUD chrome — primitives shared across every section.
 * Per spec §3.7. Dark-base override (no light surfaces in this build).
 * ──────────────────────────────────────────────────────────────────────── */

export const EyebrowLabel = ({
  children,
  tone = "muted",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "muted" | "bone" | "blue";
  className?: string;
}) => (
  <span
    className={cn(
      "text-mono-eyebrow",
      tone === "bone" && "text-bone/70",
      tone === "muted" && "text-muted-foreground",
      tone === "blue" && "text-signal-blue",
      className
    )}
  >
    {children}
  </span>
);

/* ───── HudFrame — corner brackets ───────────────────────────────────────*/

export const HudFrame = ({ tone = "bone", inset = 24 }: { tone?: "bone" | "graphite"; inset?: number }) => {
  const color = tone === "bone" ? "hsl(var(--certa-bone))" : "hsl(var(--certa-graphite))";
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {(["tl", "tr", "bl", "br"] as const).map((p) => (
        <span
          key={p}
          className="absolute"
          style={{
            top: p.startsWith("t") ? inset : "auto",
            bottom: p.startsWith("b") ? inset : "auto",
            left: p.endsWith("l") ? inset : "auto",
            right: p.endsWith("r") ? inset : "auto",
            width: 18,
            height: 18,
            borderTop: p.startsWith("t") ? `1px solid ${color}` : "none",
            borderBottom: p.startsWith("b") ? `1px solid ${color}` : "none",
            borderLeft: p.endsWith("l") ? `1px solid ${color}` : "none",
            borderRight: p.endsWith("r") ? `1px solid ${color}` : "none",
            opacity: 0.45,
          }}
        />
      ))}
    </div>
  );
};

/* ───── ClassifiedStrip ─────────────────────────────────────────────────*/

export const ClassifiedStrip = ({
  left,
  right = "CLASSIFIED",
  className = "",
}: {
  left: string;
  right?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center justify-between border-y px-4 py-2 mb-12 md:mb-16",
      "border-rule",
      className
    )}
  >
    <p className="text-mono-eyebrow text-muted-foreground">{left}</p>
    <p className="text-mono-eyebrow text-muted-foreground hidden sm:block">{right}</p>
  </div>
);

/* ───── DossierNumber — Bond-title-style overlay ────────────────────────*/

export const DossierNumber = ({
  number,
  label,
  position = "br",
}: {
  number: string;
  label: string;
  position?: "tl" | "tr" | "bl" | "br";
}) => (
  <div
    className="pointer-events-none absolute z-[2] hidden md:flex flex-col items-end gap-2"
    style={{
      top: position.startsWith("t") ? 32 : "auto",
      bottom: position.startsWith("b") ? 32 : "auto",
      left: position.endsWith("l") ? 32 : "auto",
      right: position.endsWith("r") ? 32 : "auto",
      alignItems: position.endsWith("l") ? "flex-start" : "flex-end",
    }}
  >
    <span
      className="font-sans text-bone tabular leading-none"
      style={{ fontWeight: 200, fontSize: "clamp(48px, 6vw, 96px)", opacity: 0.08, letterSpacing: "-0.04em" }}
    >
      {number}
    </span>
    <span className="text-mono-eyebrow text-bone/40">— {label}</span>
  </div>
);

/* ───── LocationStamp ───────────────────────────────────────────────────*/

export const LocationStamp = ({ position = "bl" }: { position?: "bl" | "br" }) => (
  <div
    className="pointer-events-none absolute z-[2] hidden md:flex flex-col gap-1 text-mono-eyebrow text-bone/45"
    style={{
      bottom: 32,
      left: position === "bl" ? 32 : "auto",
      right: position === "br" ? 32 : "auto",
    }}
  >
    <span>EST. 2024 ／ PALO ALTO, CA</span>
    <span>HQ.   ／ DENVER, CO</span>
    <span>v0.10.0 ／ BUILD 2026.04.25</span>
  </div>
);

/* ───── TargetingReticle (precision crosshair pip) ──────────────────────*/

export const TargetingReticle = ({ size = 12, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    aria-hidden
    className={cn("inline-block text-muted-foreground", className)}
  >
    <line x1="6" y1="0"  x2="6"  y2="3"  stroke="currentColor" strokeWidth="1" />
    <line x1="6" y1="9"  x2="6"  y2="12" stroke="currentColor" strokeWidth="1" />
    <line x1="0" y1="6"  x2="3"  y2="6"  stroke="currentColor" strokeWidth="1" />
    <line x1="9" y1="6"  x2="12" y2="6"  stroke="currentColor" strokeWidth="1" />
    <circle cx="6" cy="6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

/* ───── LockGlyph (secure-and-auditable seal) ───────────────────────────*/

export const LockGlyph = ({ size = 16, tone = "bone" }: { size?: number; tone?: "bone" | "fg" | "green" }) => {
  const c = tone === "green" ? "hsl(var(--signal-green))" : tone === "fg" ? "hsl(var(--certa-fg))" : "hsl(var(--certa-bone))";
  return (
    <svg width={size} height={(size / 16) * 20} viewBox="0 0 16 20" aria-hidden className="inline-block">
      <rect x="2" y="8" width="12" height="10" fill="none" stroke={c} strokeWidth="1" />
      <path d="M5 8 V5 a3 3 0 0 1 6 0 V8" fill="none" stroke={c} strokeWidth="1" />
      <rect x="7" y="12" width="2" height="2" fill={c} />
    </svg>
  );
};

/* ───── PaperGrain ──────────────────────────────────────────────────────*/

export const PaperGrain = () => (
  <div
    className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
    aria-hidden
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
      backgroundSize: "256px 256px",
    }}
  />
);

/* ───── Section wrapper ─────────────────────────────────────────────────*/

type Surface = "ink" | "carbon" | "obsidian";
type Scale = "compact" | "standard" | "generous";

const padY: Record<Scale, string> = {
  compact: "py-20 md:py-24",
  standard: "py-24 md:py-32",
  generous: "py-28 md:py-40",
};

const surfaceCls: Record<Surface, string> = {
  ink: "bg-ink text-bone",
  carbon: "bg-carbon text-bone",
  obsidian: "bg-obsidian text-bone",
};

export const Section = React.forwardRef<
  HTMLElement,
  {
    id: string;
    surface?: Surface;
    scale?: Scale;
    className?: string;
    children: React.ReactNode;
    grain?: boolean;
    hudFrame?: boolean;
  }
>(({ id, surface = "ink", scale = "standard", className = "", children, grain = true, hudFrame = true }, ref) => (
  <motion.section
    ref={ref as React.Ref<HTMLElement>}
    id={id}
    aria-labelledby={`${id}-title`}
    className={cn("relative overflow-hidden", surfaceCls[surface], padY[scale], className)}
    {...revealProps}
  >
    {grain && <PaperGrain />}
    {hudFrame && <HudFrame tone="bone" />}
    <div className="relative z-[2] mx-auto max-w-content px-6 md:px-8">{children}</div>
  </motion.section>
));
Section.displayName = "Section";

/* ───── SectionHeader ───────────────────────────────────────────────────*/

export const SectionHeader = ({
  eyebrow,
  headline,
  secondary,
  id,
  align = "left",
  maxW = "max-w-3xl",
}: {
  eyebrow: string;
  headline: React.ReactNode;
  secondary?: React.ReactNode;
  id: string;
  align?: "left" | "center";
  maxW?: string;
}) => (
  <header className={cn("mb-12 md:mb-16", maxW, align === "center" && "mx-auto text-center")}>
    <EyebrowLabel>{eyebrow}</EyebrowLabel>
    <h2 id={`${id}-title`} className="mt-4 text-h1 text-bone">
      {headline}
      {secondary && <span className="text-graphite"> {secondary}</span>}
    </h2>
  </header>
);

/* ───── StatPanel ───────────────────────────────────────────────────────*/

export const StatPanel = ({
  value,
  caption,
  source,
  color = "bone",
  className = "",
}: {
  value: string;
  caption: string;
  source?: string;
  color?: "bone" | "signal-green" | "signal-blue" | "signal-red" | "signal-amber";
  className?: string;
}) => {
  const colorMap: Record<string, string> = {
    bone: "hsl(var(--certa-bone))",
    "signal-green": "hsl(var(--signal-green))",
    "signal-blue": "hsl(var(--signal-blue))",
    "signal-red": "hsl(var(--signal-red))",
    "signal-amber": "hsl(var(--signal-amber))",
  };
  return (
    <div className={cn("border border-rule bg-carbon p-6", className)}>
      <p
        className="font-mono tabular leading-none"
        style={{
          color: colorMap[color],
          fontWeight: 300,
          fontSize: "clamp(28px, 3.4vw, 36px)",
          letterSpacing: "-0.025em",
        }}
      >
        {value}
      </p>
      <p className="mt-3 text-body-sm text-graphite leading-snug">{caption}</p>
      {source && <p className="mt-2 text-mono-eyebrow text-muted-foreground/70">{source}</p>}
    </div>
  );
};

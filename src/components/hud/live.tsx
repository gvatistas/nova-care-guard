import * as React from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
 * Live HUD primitives — animated chrome that runs continuously.
 * Used across the dark body sections to add Palantir-grade life.
 * ──────────────────────────────────────────────────────────────────────── */

/* ───── ScanLine — slow vertical sweep over a panel ─────────────────────*/
export const ScanLine = ({
  color = "rgba(221,225,230,0.18)",
  duration = 8,
}: {
  color?: string;
  duration?: number;
}) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute left-0 right-0 h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      initial={{ top: "-2%" }}
      animate={{ top: "102%" }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

/* ───── TerminalFrame — bordered panel with header + corner ticks ───────*/
export const TerminalFrame: React.FC<{
  title: string;
  status?: string;
  statusColor?: string;
  children: React.ReactNode;
  className?: string;
  scan?: boolean;
}> = ({ title, status = "● LIVE", statusColor = "hsl(var(--certa-terra-bright))", children, className, scan = true }) => (
  <div className={cn("relative border border-rule bg-carbon/80", className)}>
    {/* corner ticks */}
    {(["tl", "tr", "bl", "br"] as const).map((p) => (
      <span
        key={p}
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: p.startsWith("t") ? -1 : "auto",
          bottom: p.startsWith("b") ? -1 : "auto",
          left: p.endsWith("l") ? -1 : "auto",
          right: p.endsWith("r") ? -1 : "auto",
          width: 6,
          height: 6,
          borderTop: p.startsWith("t") ? "1px solid hsl(var(--certa-bone))" : "none",
          borderBottom: p.startsWith("b") ? "1px solid hsl(var(--certa-bone))" : "none",
          borderLeft: p.endsWith("l") ? "1px solid hsl(var(--certa-bone))" : "none",
          borderRight: p.endsWith("r") ? "1px solid hsl(var(--certa-bone))" : "none",
          opacity: 0.7,
        }}
      />
    ))}
    {/* header bar */}
    <div className="flex items-center justify-between border-b border-rule px-4 py-2.5 bg-ink/60">
      <span className="text-mono-eyebrow text-bone/70">{title}</span>
      <span className="text-mono-eyebrow tabular" style={{ color: statusColor }}>
        {status}
      </span>
    </div>
    <div className="relative">
      {scan && <ScanLine />}
      {children}
    </div>
  </div>
);

/* ───── Ticker — horizontally scrolling marquee strip ──────────────────*/
export const Ticker: React.FC<{
  items: string[];
  speed?: number; // seconds per loop
  className?: string;
}> = ({ items, speed = 60, className }) => {
  // duplicate so the loop is seamless
  const doubled = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden border-y border-rule bg-carbon/60 py-2.5", className)}>
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((it, i) => (
          <span key={i} className="text-mono-eyebrow text-bone/65 inline-flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-terra-bright" />
            {it}
          </span>
        ))}
      </motion.div>
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
};

/* ───── CountUp — animates a numeric counter when in view ──────────────*/
export const CountUp: React.FC<{
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ to, decimals = 0, prefix = "", suffix = "", duration = 2, className, style }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);
  const [display, setDisplay] = React.useState(`${prefix}${(0).toFixed(decimals)}${suffix}`);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: [0.16, 1, 0.3, 1] });
    const unsub = text.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, to, duration, mv, text]);

  return (
    <span ref={ref} className={cn("tabular font-mono", className)} style={style}>
      {display}
    </span>
  );
};

/* ───── DataReadout — labeled tabular metric pair ──────────────────────*/
export const DataReadout: React.FC<{
  label: string;
  value: string;
  accent?: string;
  className?: string;
}> = ({ label, value, accent = "hsl(var(--certa-bone))", className }) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <span className="text-mono-eyebrow text-bone/45">{label}</span>
    <span className="font-mono tabular text-base" style={{ color: accent, fontWeight: 400 }}>
      {value}
    </span>
  </div>
);

/* ───── BlinkingCursor ─────────────────────────────────────────────────*/
export const BlinkingCursor = ({ color = "hsl(var(--certa-bone))" }: { color?: string }) => (
  <motion.span
    className="inline-block w-[8px] h-[1.05em] align-text-bottom translate-y-[2px]"
    style={{ background: color }}
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
  />
);

/* ───── PacketStream — horizontal SVG line with packets racing across ─*/
export const PacketStream: React.FC<{
  count?: number;
  color?: string;
  className?: string;
  height?: number;
}> = ({ count = 6, color = "hsl(var(--signal-blue))", className, height = 24 }) => (
  <div className={cn("relative w-full overflow-hidden", className)} style={{ height }}>
    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2" style={{ background: "hsl(var(--certa-rule))" }} />
    {Array.from({ length: count }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        initial={{ left: "-2%", opacity: 0 }}
        animate={{ left: ["−2%", "102%"], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3 + (i % 3),
          delay: i * 0.6,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

/* ───── KeyValueRow — terminal-style key:value line with color cue ────*/
export const KeyValueRow: React.FC<{ k: string; v: string; tone?: "bone" | "blue" | "amber" | "green" }> = ({
  k,
  v,
  tone = "bone",
}) => {
  const colorMap = {
    bone: "hsl(var(--certa-bone))",
    blue: "hsl(var(--signal-blue))",
    amber: "hsl(var(--signal-amber))",
    green: "hsl(var(--signal-green))",
  };
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-1.5 border-b border-rule/50 last:border-b-0">
      <span className="text-mono-eyebrow text-bone/45">{k}</span>
      <span className="font-mono tabular text-[12px] text-bone/85 break-all" style={{ color: colorMap[tone] }}>
        {v}
      </span>
    </div>
  );
};

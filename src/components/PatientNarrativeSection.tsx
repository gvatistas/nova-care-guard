import { useRef, useState, useEffect, type FC } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

const POSITIVE = "#059669";
const RED = "#E11D48";
const ORANGE = "#D97706";
const GREEN = "#059669";

/* ── Shapeshifting background for right lane — GRAYSCALE ── */
const MORPH_SHAPES = [
  "M 50,90 L 65,40 L 80,60 L 100,15 L 120,60 L 135,40 L 150,90 Z",
  "M 100,10 L 150,55 L 100,100 L 50,55 Z",
  "M 100,8 L 148,32 L 148,75 L 100,98 L 52,75 L 52,32 Z",
  "M 100,5 L 155,30 L 150,80 L 100,105 L 50,80 L 45,30 Z",
  "M 75,10 L 125,10 L 155,40 L 155,70 L 125,100 L 75,100 L 45,70 L 45,40 Z",
  "M 50,90 L 65,40 L 80,60 L 100,15 L 120,60 L 135,40 L 150,90 Z",
];
const INNER_STRUCTURES: string[][] = [
  ["M 65,40 L 100,90", "M 135,40 L 100,90", "M 100,15 L 100,90", "M 50,90 L 100,50 L 150,90", "M 80,60 L 120,60", "M 65,40 L 135,40"],
  ["M 100,10 L 100,100", "M 50,55 L 150,55", "M 75,32 L 125,78", "M 125,32 L 75,78", "M 100,10 L 50,55 L 100,100", "M 100,10 L 150,55 L 100,100"],
  ["M 100,8 L 100,98", "M 52,32 L 148,75", "M 148,32 L 52,75", "M 52,32 L 100,53 L 148,32", "M 52,75 L 100,53 L 148,75", "M 100,8 L 100,53"],
  ["M 100,5 L 100,105", "M 45,30 L 150,80", "M 155,30 L 50,80", "M 100,5 L 45,30 L 50,80 L 100,55", "M 100,5 L 155,30 L 150,80 L 100,55", "M 100,55 L 100,105"],
  ["M 75,10 L 125,100", "M 125,10 L 75,100", "M 45,40 L 155,70", "M 155,40 L 45,70", "M 100,10 L 100,100", "M 45,55 L 155,55"],
  ["M 65,40 L 100,90", "M 135,40 L 100,90", "M 100,15 L 100,90", "M 50,90 L 100,50 L 150,90", "M 80,60 L 120,60", "M 65,40 L 135,40"],
];
const FACET_FILLS = [
  [{ d: "M 65,40 L 100,15 L 100,90 Z", fill: "#E5E7EB" }, { d: "M 100,15 L 135,40 L 100,90 Z", fill: "#D1D5DB" }, { d: "M 50,90 L 65,40 L 100,90 Z", fill: "#E5E7EB" }, { d: "M 135,40 L 150,90 L 100,90 Z", fill: "#F3F4F6" }],
  [{ d: "M 100,10 L 150,55 L 100,55 Z", fill: "#E5E7EB" }, { d: "M 100,10 L 50,55 L 100,55 Z", fill: "#D1D5DB" }, { d: "M 50,55 L 100,100 L 100,55 Z", fill: "#E5E7EB" }, { d: "M 150,55 L 100,100 L 100,55 Z", fill: "#F3F4F6" }],
  [{ d: "M 100,8 L 148,32 L 100,53 Z", fill: "#D1D5DB" }, { d: "M 52,32 L 100,8 L 100,53 Z", fill: "#E5E7EB" }, { d: "M 148,32 L 148,75 L 100,53 Z", fill: "#F3F4F6" }, { d: "M 52,75 L 52,32 L 100,53 Z", fill: "#E5E7EB" }],
  [{ d: "M 100,5 L 155,30 L 100,55 Z", fill: "#E5E7EB" }, { d: "M 45,30 L 100,5 L 100,55 Z", fill: "#D1D5DB" }, { d: "M 155,30 L 150,80 L 100,55 Z", fill: "#F3F4F6" }, { d: "M 50,80 L 45,30 L 100,55 Z", fill: "#E5E7EB" }],
  [{ d: "M 75,10 L 125,10 L 100,55 Z", fill: "#D1D5DB" }, { d: "M 125,10 L 155,40 L 100,55 Z", fill: "#E5E7EB" }, { d: "M 155,40 L 155,70 L 100,55 Z", fill: "#F3F4F6" }, { d: "M 45,40 L 75,10 L 100,55 Z", fill: "#E5E7EB" }],
  [{ d: "M 65,40 L 100,15 L 100,90 Z", fill: "#E5E7EB" }, { d: "M 100,15 L 135,40 L 100,90 Z", fill: "#D1D5DB" }, { d: "M 50,90 L 65,40 L 100,90 Z", fill: "#E5E7EB" }, { d: "M 135,40 L 150,90 L 100,90 Z", fill: "#F3F4F6" }],
];

/* ── Background: animated decision-graph network ── */
const ENGINE_NODES: { x: number; y: number }[] = [
  { x: 20, y: 15 }, { x: 50, y: 8 }, { x: 80, y: 18 }, { x: 110, y: 10 }, { x: 140, y: 16 }, { x: 170, y: 6 },
  { x: 10, y: 35 }, { x: 35, y: 30 }, { x: 65, y: 38 }, { x: 95, y: 28 }, { x: 125, y: 35 }, { x: 155, y: 30 }, { x: 185, y: 38 },
  { x: 25, y: 55 }, { x: 55, y: 50 }, { x: 85, y: 55 }, { x: 115, y: 48 }, { x: 145, y: 55 }, { x: 175, y: 50 },
  { x: 15, y: 72 }, { x: 45, y: 68 }, { x: 75, y: 75 }, { x: 105, y: 65 }, { x: 135, y: 72 }, { x: 165, y: 68 },
  { x: 30, y: 90 }, { x: 60, y: 85 }, { x: 90, y: 92 }, { x: 120, y: 82 }, { x: 150, y: 88 }, { x: 180, y: 94 },
];
const ENGINE_EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[0,7],[1,7],[1,8],[2,8],[2,9],[3,9],[3,10],[4,10],[4,11],[5,11],[5,12],
  [6,7],[7,8],[8,9],[9,10],[10,11],[11,12],
  [6,13],[7,14],[8,14],[8,15],[9,15],[9,16],[10,16],[10,17],[11,17],[11,18],[12,18],
  [13,14],[14,15],[15,16],[16,17],[17,18],
  [13,19],[13,20],[14,20],[15,21],[15,22],[16,22],[16,23],[17,23],[17,24],[18,24],
  [19,20],[20,21],[21,22],[22,23],[23,24],
  [19,25],[20,26],[21,26],[21,27],[22,27],[22,28],[23,28],[23,29],[24,29],[24,30],
  [25,26],[26,27],[27,28],[28,29],[29,30],
];

const EngineBackground: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Grid config
    const spacing = 28;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.003;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      // Draw grid dots
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          ctx.fillStyle = "rgba(209,213,219,0.25)";
          ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
        }
      }

      // Horizontal scan lines (geometric)
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.4 + i * 0.33) % 1;
        const scanY = phase * h;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        const alpha = 0.06 + Math.sin(t * 2 + i) * 0.02;
        grad.addColorStop(0, `rgba(37,99,235,0)`);
        grad.addColorStop(0.2, `rgba(37,99,235,${alpha})`);
        grad.addColorStop(0.8, `rgba(37,99,235,${alpha})`);
        grad.addColorStop(1, `rgba(37,99,235,0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(w, scanY);
        ctx.stroke();
      }

      // Animated geometric circuit paths
      const paths: { sx: number; sy: number; segments: { dx: number; dy: number }[]; phase: number }[] = [
        { sx: 0.1, sy: 0.2, segments: [{ dx: 0.15, dy: 0 }, { dx: 0, dy: 0.15 }, { dx: 0.2, dy: 0 }, { dx: 0, dy: 0.1 }, { dx: 0.15, dy: 0 }], phase: 0 },
        { sx: 0.8, sy: 0.1, segments: [{ dx: 0, dy: 0.2 }, { dx: -0.25, dy: 0 }, { dx: 0, dy: 0.15 }, { dx: -0.15, dy: 0 }], phase: 0.5 },
        { sx: 0.3, sy: 0.7, segments: [{ dx: 0.2, dy: 0 }, { dx: 0, dy: -0.15 }, { dx: 0.2, dy: 0 }, { dx: 0, dy: 0.2 }], phase: 0.25 },
        { sx: 0.05, sy: 0.5, segments: [{ dx: 0.3, dy: 0 }, { dx: 0, dy: 0.25 }, { dx: 0.2, dy: 0 }], phase: 0.7 },
        { sx: 0.6, sy: 0.85, segments: [{ dx: 0, dy: -0.3 }, { dx: 0.2, dy: 0 }, { dx: 0, dy: -0.15 }], phase: 0.4 },
      ];

      paths.forEach((path) => {
        const totalLen = path.segments.reduce((s, seg) => s + Math.abs(seg.dx || seg.dy), 0);
        let cx = path.sx * w;
        let cy = path.sy * h;

        // Draw static path
        ctx.strokeStyle = "rgba(37,99,235,0.06)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        path.segments.forEach((seg) => {
          cx += seg.dx * w;
          cy += seg.dy * h;
          ctx.lineTo(cx, cy);
        });
        ctx.stroke();

        // Draw junction nodes
        cx = path.sx * w;
        cy = path.sy * h;
        path.segments.forEach((seg) => {
          ctx.fillStyle = "rgba(37,99,235,0.08)";
          ctx.beginPath();
          ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
          ctx.fill();
          cx += seg.dx * w;
          cy += seg.dy * h;
        });

        // Animated pulse along path
        const progress = ((t * 0.5 + path.phase) % 1);
        const targetDist = progress * totalLen;
        let traveled = 0;
        let px = path.sx * w;
        let py = path.sy * h;

        for (const seg of path.segments) {
          const segLen = Math.abs(seg.dx || seg.dy);
          if (traveled + segLen >= targetDist) {
            const frac = (targetDist - traveled) / segLen;
            px += seg.dx * w * frac;
            py += seg.dy * h * frac;
            break;
          }
          px += seg.dx * w;
          py += seg.dy * h;
          traveled += segLen;
        }

        // Pulse glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 12);
        grd.addColorStop(0, "rgba(37,99,235,0.2)");
        grd.addColorStop(1, "rgba(37,99,235,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();

        // Pulse core
        ctx.fillStyle = "rgba(37,99,235,0.5)";
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Corner brackets (high-tech frame accents)
      const bracketLen = 20;
      ctx.strokeStyle = "rgba(37,99,235,0.1)";
      ctx.lineWidth = 1;
      // Top-left
      ctx.beginPath(); ctx.moveTo(0, bracketLen); ctx.lineTo(0, 0); ctx.lineTo(bracketLen, 0); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(w - bracketLen, 0); ctx.lineTo(w, 0); ctx.lineTo(w, bracketLen); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(0, h - bracketLen); ctx.lineTo(0, h); ctx.lineTo(bracketLen, h); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(w - bracketLen, h); ctx.lineTo(w, h); ctx.lineTo(w, h - bracketLen); ctx.stroke();
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.7 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

/* ── Small Shapeshifting Crown Logo — grayscale ── */
const ShapeshiftingLogo: FC<{ size?: number }> = ({ size = 120 }) => {
  const [idx, setIdx] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx((p) => (p + 1) % (MORPH_SHAPES.length - 1)), 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let raf: number; let t = 0;
    const spin = () => { t += 0.003; setRotation(t * 15); raf = requestAnimationFrame(spin); };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nextIdx = (idx + 1) % MORPH_SHAPES.length;
  const uid = `crown-${size}`;

  return (
    <svg width={size} height={size} viewBox="0 0 200 110" className="overflow-visible shrink-0">
      <defs>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" in="SourceGraphic" />
          <feMerge><feMergeNode in="blur1" /><feMergeNode in="blur2" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`${uid}-inner`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6B7280" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#6B7280" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#6B7280" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g style={{ transformOrigin: "100px 55px", transform: `rotate(${rotation}deg)` }}>
        <circle cx="100" cy="55" r="52" fill="none" stroke="#9CA3AF" strokeWidth="0.3" opacity="0.15" strokeDasharray="8 12" />
      </g>
      <AnimatePresence mode="wait">
        <motion.g key={idx} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          {FACET_FILLS[idx]?.map((f, i) => (
            <motion.path key={i} d={f.d} fill={f.fill} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0.75] }} transition={{ duration: 1, delay: i * 0.1 }} />
          ))}
          <motion.path d={MORPH_SHAPES[idx]} fill={`url(#${uid}-inner)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
        </motion.g>
      </AnimatePresence>
      <motion.path d={MORPH_SHAPES[idx]} fill="none" stroke="#374151" strokeWidth="1.2" strokeLinejoin="miter" filter={`url(#${uid}-glow)`} initial={false} animate={{ d: MORPH_SHAPES[nextIdx] }} transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }} />
      <AnimatePresence mode="wait">
        <motion.g key={`s${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          {INNER_STRUCTURES[idx]?.map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#9CA3AF" strokeWidth="0.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 0.4, 0.25] }} transition={{ duration: 1.2, delay: i * 0.12 }} />
          ))}
        </motion.g>
      </AnimatePresence>
      <circle cx="100" cy="55" r="2" fill="#374151" opacity="0.7">
        <animate attributeName="r" values="1;5;1" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.08;0.7" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="55" r="1" fill="#9CA3AF" opacity="0.9">
        <animate attributeName="r" values="0.8;2;0.8" dur="3.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

/* ── Animated pulse dot ── */
const PulseDot: FC<{ color: string; delay: number; duration: number }> = ({ color, delay, duration }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
    initial={{ top: 0, opacity: 0 }}
    animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
    transition={{ duration, delay, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
  />
);

/* ── Connector line ── */
const Connector: FC<{ color: string; height?: number }> = ({ color, height = 28 }) => (
  <div className="relative flex justify-center" style={{ height }}>
    <div className="w-px h-full" style={{ background: `${color}30` }} />
    <PulseDot color={color} delay={0.5} duration={1} />
  </div>
);

/* ── Status indicator dot ── */
const StatusDot: FC<{ color: string; pulse?: boolean }> = ({ color, pulse }) => (
  <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2.5 shrink-0 mt-[3px] ${pulse ? "animate-pulse" : ""}`}
    style={{ background: color, boxShadow: pulse ? `0 0 12px ${color}, 0 0 24px ${color}50` : `0 0 6px ${color}40` }} />
);

/* ── Screening Node ── */
const ScreeningNode: FC<{
  label: string; sublabel: string; color: string; status: string;
  delay: number; inView: boolean; critical?: boolean;
}> = ({ label, sublabel, color, status, delay, inView, critical }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay }}
    className="border px-5 py-4 w-full relative overflow-hidden"
    style={{
      borderColor: `${color}30`,
      background: `${color}08`,
      boxShadow: critical ? `inset 0 0 20px ${color}10, 0 0 15px ${color}08` : `0 0 10px ${color}05`,
    }}
  >
    {critical && (
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }} />
    )}
    <div className="flex items-center justify-between mb-1.5 relative">
      <p className="text-[16px] font-normal" style={{ letterSpacing: "-0.01em", color: "#111827" }}>{label}</p>
      <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-0.5 ${critical ? "animate-pulse" : ""}`}
        style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}>{status}</span>
    </div>
    <div className="flex items-center relative">
      <StatusDot color={color} pulse={critical} />
      <p className="text-[14px] leading-relaxed" style={{ color: "#6B7280" }}>{sublabel}</p>
    </div>
  </motion.div>
);

/* ── Alternating lane controller ── */
const CYCLE_DURATION = 5000;

/* ── Main Section ── */
const PatientNarrativeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveSide((s) => (s === "left" ? "right" : "left"));
    }, CYCLE_DURATION);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section ref={ref} className="py-28 px-6 relative overflow-hidden" style={{ background: "#F3F4F6" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── TOP: Jane Doe Patient Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto border p-7 relative"
          style={{ borderColor: "#E5E7EB", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded border flex items-center justify-center shrink-0" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
              <User size={24} color="#6B7280" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-light" style={{ letterSpacing: "-0.02em", color: "#111827" }}>Jane Doe, 52</h3>
              <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>Female · BMI 28.4 · Smoker (12 pk-yr)</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px mt-2">
            {[{ l: "BP", v: "138/88" }, { l: "A1c", v: "6.1%" }, { l: "LDL", v: "142" }].map((x) => (
              <div key={x.l} className="py-2.5 border text-center" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
                <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "#6B7280" }}>{x.l}</p>
                <p className="text-[15px] mt-0.5" style={{ color: "#111827" }}>{x.v}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Decision tree fork ── */}
        <div className="relative mt-2">
          {/* Center stem */}
          <div className="mx-auto" style={{ width: 1, height: 20, background: "#E5E7EB" }} />
          {/* Horizontal bar */}
          <div className="relative mx-auto" style={{ width: "60%", maxWidth: "600px", height: 1 }}>
            <div className="absolute inset-0" style={{ background: "#E5E7EB" }} />
            <motion.div
              className="absolute top-0 h-full"
              animate={{
                left: activeSide === "left" ? "0%" : "50%",
                width: "50%",
              }}
              style={{ background: `#37415130` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {/* Two vertical drops */}
          <div className="flex justify-between mx-auto" style={{ width: "60%", maxWidth: "600px" }}>
            <div style={{ width: 1, height: 32, background: activeSide === "left" ? `#37415130` : "#E5E7EB", transition: "background 0.5s" }} />
            <div style={{ width: 1, height: 32, background: activeSide === "right" ? `#37415130` : "#E5E7EB", transition: "background 0.5s" }} />
          </div>
        </div>

        {/* ── TWO LANES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 mt-0">

          {/* ── LEFT: Without Medient ── */}
          <motion.div
            className="flex flex-col items-center flex-1"
            animate={{
              opacity: activeSide === "left" ? 1 : 0.25,
              scale: activeSide === "left" ? 1 : 0.97,
              filter: activeSide === "left" ? "blur(0px)" : "blur(1px)",
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-[13px] uppercase tracking-[0.15em] mb-6 font-semibold px-5 py-2.5 border self-center"
              style={{ color: RED, borderColor: `${RED}25`, background: "#FFF1F2" }}
            >
              ✕ Without Medient
            </motion.div>

            <div className="w-full max-w-sm flex flex-col items-center gap-0">
              <ScreeningNode label="Colonoscopy" sublabel="Ordered on schedule — completed as routine" color={GREEN} status="Completed" delay={0.5} inView={inView} />
              <Connector color={ORANGE} />
              <ScreeningNode label="Lung Cancer Screening" sublabel="20 pack-year history buried in chart — not reviewed" color={ORANGE} status="Deferred" delay={0.7} inView={inView} />
              <Connector color={RED} />
              <ScreeningNode label="LDCT Scan" sublabel="USPSTF Grade A — eligible but never ordered" color={RED} status="Missed" delay={0.8} inView={inView} critical />
            </div>

            <div className="flex-1" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-6 border-2 p-5 text-center w-full max-w-sm" style={{ borderColor: RED, background: `${RED}12`, boxShadow: `0 0 20px ${RED}15, inset 0 0 12px ${RED}08` }}>
              <p className="text-xs uppercase tracking-[0.15em] mb-1.5 font-bold" style={{ color: RED }}>18 Months Later</p>
              <p className="text-base font-semibold" style={{ color: "#111827" }}>Late-stage diagnosis</p>
              <p className="text-2xl font-bold mt-1" style={{ color: RED }}>$288K+</p>
              <p className="text-[11px] uppercase tracking-[0.1em] mt-0.5" style={{ color: `${RED}BB` }}>treatment cost</p>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: With Medient ── */}
          <motion.div
            className="flex flex-col items-center relative flex-1"
            animate={{
              opacity: activeSide === "right" ? 1 : 0.25,
              scale: activeSide === "right" ? 1 : 0.97,
              filter: activeSide === "right" ? "blur(0px)" : "blur(1px)",
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <EngineBackground />

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-[13px] uppercase tracking-[0.15em] mb-6 font-semibold px-5 py-2.5 border self-center relative z-10"
              style={{ color: "#2563EB", borderColor: "rgba(37,99,235,0.15)", background: "#EFF6FF" }}
            >
              ✓ With Medient
            </motion.div>

            <div className="w-full max-w-sm flex flex-col items-center gap-0 relative z-10">
              <ScreeningNode label="Colonoscopy" sublabel="ACS guideline triggered — order auto-generated" color={GREEN} status="Scheduled" delay={0.5} inView={inView} />
              <Connector color={GREEN} />
              <ScreeningNode label="Lung Cancer Screening" sublabel="20 pack-year history detected — USPSTF Grade A" color={GREEN} status="Detected" delay={0.7} inView={inView} />
              <Connector color={GREEN} />
              <ScreeningNode label="LDCT Scan" sublabel="Order generated with full provenance trail" color={GREEN} status="Ordered" delay={0.8} inView={inView} />
            </div>

            <div className="flex-1" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-6 border-2 p-5 text-center w-full max-w-sm relative z-10" style={{ borderColor: POSITIVE, background: `${POSITIVE}12`, boxShadow: `0 0 20px ${POSITIVE}15, inset 0 0 12px ${POSITIVE}08` }}>
              <p className="text-xs uppercase tracking-[0.15em] mb-1.5 font-bold" style={{ color: POSITIVE }}>Same Visit</p>
              <p className="text-base font-semibold" style={{ color: "#111827" }}>Early detection</p>
              <p className="text-2xl font-bold mt-1" style={{ color: POSITIVE }}>$4,200</p>
              <p className="text-[11px] uppercase tracking-[0.1em] mt-0.5" style={{ color: `${POSITIVE}BB` }}>screening cost</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PatientNarrativeSection;

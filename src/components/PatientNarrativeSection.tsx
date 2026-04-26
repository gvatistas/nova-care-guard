import React, { useRef, useState, useEffect, type FC } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { site } from "@/content/site";
import { ClassifiedStrip } from "@/components/hud";

/* Status color: red = miss, amber = deferred, green = positive */
const COLOR_FOR_STATUS = (status: string, critical?: boolean) => {
  const s = status.toLowerCase();
  if (critical || s === "missed") return "hsl(var(--signal-red))";
  if (s === "deferred") return "hsl(var(--signal-amber))";
  return "hsl(var(--signal-green))";
};

/* Animated geometric decision-network background — toned to brand */
const EngineBackground: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let t = 0;
    const nodes = [
      { x: 10, y: 8 }, { x: 30, y: 12 }, { x: 50, y: 6 }, { x: 70, y: 14 }, { x: 90, y: 8 },
      { x: 5, y: 25 }, { x: 20, y: 28 }, { x: 40, y: 22 }, { x: 60, y: 30 }, { x: 80, y: 24 }, { x: 95, y: 28 },
      { x: 15, y: 42 }, { x: 35, y: 38 }, { x: 55, y: 44 }, { x: 75, y: 40 }, { x: 92, y: 42 },
      { x: 8, y: 58 }, { x: 28, y: 55 }, { x: 48, y: 60 }, { x: 68, y: 56 }, { x: 88, y: 58 },
      { x: 12, y: 74 }, { x: 32, y: 70 }, { x: 52, y: 76 }, { x: 72, y: 72 }, { x: 90, y: 74 },
      { x: 6, y: 90 }, { x: 25, y: 88 }, { x: 45, y: 92 }, { x: 65, y: 86 }, { x: 85, y: 92 },
    ];
    const edges: [number, number][] = [
      [0,1],[1,2],[2,3],[3,4],[0,6],[1,6],[1,7],[2,7],[2,8],[3,8],[3,9],[4,9],[4,10],
      [5,6],[6,7],[7,8],[8,9],[9,10],
      [5,11],[6,12],[7,12],[8,13],[9,14],[10,15],
      [11,12],[12,13],[13,14],[14,15],
      [11,16],[11,17],[12,17],[13,18],[14,19],[15,20],
      [16,17],[17,18],[18,19],[19,20],
      [16,21],[17,22],[18,23],[19,24],[20,25],
      [21,22],[22,23],[23,24],[24,25],
      [21,26],[22,27],[23,28],[24,29],[25,30],
      [26,27],[27,28],[28,29],[29,30],
    ];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.004;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      edges.forEach(([a, b], i) => {
        const ax = nodes[a].x * w / 100, ay = nodes[a].y * h / 100;
        const bx = nodes[b].x * w / 100, by = nodes[b].y * h / 100;
        ctx.strokeStyle = "rgba(5,150,105,0.10)";
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        const speed = 0.3 + (i % 5) * 0.08;
        const phase = (i * 0.17 + t * speed) % 1;
        const px = ax + (bx - ax) * phase;
        const py = ay + (by - ay) * phase;
        const alpha = Math.sin(phase * Math.PI) * 0.6;
        ctx.fillStyle = `rgba(5,150,105,${alpha})`;
        ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
      });
      nodes.forEach((n, i) => {
        const nx = n.x * w / 100, ny = n.y * h / 100;
        const pulse = Math.sin(t * 2 + i * 0.5) * 0.5 + 0.5;
        const sz = 2.5 + pulse * 1;
        ctx.save(); ctx.translate(nx, ny); ctx.rotate(Math.PI / 4);
        ctx.fillStyle = `rgba(5,150,105,${0.06 + pulse * 0.06})`;
        ctx.fillRect(-sz, -sz, sz * 2, sz * 2);
        ctx.strokeStyle = `rgba(5,150,105,${0.18 + pulse * 0.1})`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-sz, -sz, sz * 2, sz * 2);
        ctx.restore();
      });
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.55 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

/* ── Pulse + Connector ── */
const PulseDot: FC<{ color: string; delay: number; duration: number }> = ({ color, delay, duration }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2"
    style={{ width: 6, height: 6, background: color, boxShadow: `0 0 8px ${color}` }}
    initial={{ top: 0, opacity: 0 }}
    animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
    transition={{ duration, delay, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
  />
);
const Connector: FC<{ color: string; height?: number }> = ({ color, height = 28 }) => (
  <div className="relative flex justify-center" style={{ height }}>
    <div className="w-px h-full" style={{ background: `${color}30` }} />
    <PulseDot color={color} delay={0.5} duration={1} />
  </div>
);
const StatusDot: FC<{ color: string; pulse?: boolean }> = ({ color, pulse }) => (
  <span className={`inline-block w-2.5 h-2.5 mr-2.5 shrink-0 mt-[3px] ${pulse ? "animate-pulse" : ""}`}
    style={{ background: color, boxShadow: pulse ? `0 0 12px ${color}, 0 0 24px ${color}50` : `0 0 6px ${color}40` }} />
);

const ScreeningNode: FC<{
  label: string; sublabel: string; status: string;
  delay: number; inView: boolean; critical?: boolean;
}> = ({ label, sublabel, status, delay, inView, critical }) => {
  const color = COLOR_FOR_STATUS(status, critical);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="border px-5 py-4 w-full relative overflow-hidden bg-carbon"
      style={{ borderColor: `${color}30`, boxShadow: critical ? `inset 0 0 20px ${color}10, 0 0 15px ${color}08` : `0 0 10px ${color}05` }}
    >
      {critical && (
        <motion.div className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }} />
      )}
      <div className="flex items-center justify-between mb-1.5 relative">
        <p className="text-body text-bone" style={{ letterSpacing: "-0.01em" }}>{label}</p>
        <span className={`text-mono-eyebrow px-2.5 py-0.5 ${critical ? "animate-pulse" : ""}`}
          style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}>{status}</span>
      </div>
      <div className="flex items-center relative">
        <StatusDot color={color} pulse={critical} />
        <p className="text-body-sm text-graphite leading-relaxed">{sublabel}</p>
      </div>
    </motion.div>
  );
};

const CYCLE_DURATION = 5000;

const PatientNarrativeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");
  const data = site.janeDoe;

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => setActiveSide((s) => (s === "left" ? "right" : "left")), CYCLE_DURATION);
    return () => clearInterval(interval);
  }, [inView]);

  const RED = "hsl(var(--signal-red))";
  const GREEN = "hsl(var(--signal-green))";

  return (
    <section ref={ref} id="patient" className="relative py-24 md:py-32 px-6 overflow-hidden bg-ink">
      <div className="max-w-content mx-auto">
        <ClassifiedStrip left={data.classified.left} right={data.classified.right} />

        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-mono-eyebrow text-graphite">{data.eyebrow}</p>
          <h2 className="mt-4 text-h1 font-serif text-bone">{data.h1}</h2>
          <p className="mt-5 text-body-lg text-graphite">{data.lead}</p>
        </div>

        {/* Patient Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto border p-7 relative bg-carbon"
          style={{ borderColor: "hsl(var(--certa-rule))" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 border flex items-center justify-center shrink-0 bg-obsidian" style={{ borderColor: "hsl(var(--certa-rule))" }}>
              <User size={24} className="text-graphite" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-light text-bone" style={{ letterSpacing: "-0.02em" }}>{data.patient.name}</h3>
              <p className="text-body-sm text-graphite mt-0.5">{data.patient.profile}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px mt-2">
            {data.patient.vitals.map((x) => (
              <div key={x.l} className="py-2.5 border text-center bg-obsidian" style={{ borderColor: "hsl(var(--certa-rule))" }}>
                <p className="text-mono-eyebrow text-graphite">{x.l}</p>
                <p className="text-mono-data text-bone mt-0.5">{x.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-mono-eyebrow text-graphite/60 text-center">{data.patient.caption}</p>
        </motion.div>

        {/* Tree fork */}
        <div className="relative mt-2">
          <div className="mx-auto" style={{ width: 1, height: 20, background: "hsl(var(--certa-rule))" }} />
          <div className="relative mx-auto" style={{ width: "60%", maxWidth: 600, height: 1 }}>
            <div className="absolute inset-0" style={{ background: "hsl(var(--certa-rule))" }} />
            <motion.div className="absolute top-0 h-full"
              animate={{ left: activeSide === "left" ? "0%" : "50%", width: "50%" }}
              style={{ background: "hsl(var(--certa-rule-strong))" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <div className="flex justify-between mx-auto" style={{ width: "60%", maxWidth: 600 }}>
            <div style={{ width: 1, height: 32, background: activeSide === "left" ? RED : "hsl(var(--certa-rule))", transition: "background 0.5s" }} />
            <div style={{ width: 1, height: 32, background: activeSide === "right" ? GREEN : "hsl(var(--certa-rule))", transition: "background 0.5s" }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {/* LEFT: Without Certa */}
          <motion.div className="flex flex-col items-center flex-1"
            animate={{ opacity: activeSide === "left" ? 1 : 0.25, scale: activeSide === "left" ? 1 : 0.97, filter: activeSide === "left" ? "blur(0px)" : "blur(1px)" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-mono-eyebrow mb-6 px-5 py-2.5 border self-center"
              style={{ color: RED, borderColor: `${RED}25`, background: "hsl(var(--certa-carbon))" }}>
              {data.without.pill}
            </motion.div>
            <div className="w-full max-w-sm flex flex-col items-center gap-0">
              {data.without.nodes.map((n, i) => (
                <div key={i} className="w-full">
                  <ScreeningNode label={n.label} sublabel={n.sublabel} status={n.status} delay={0.5 + i * 0.1} inView={inView} critical={(n as any).critical} />
                  {i < data.without.nodes.length - 1 && <Connector color={COLOR_FOR_STATUS(data.without.nodes[i + 1].status, (data.without.nodes[i + 1] as any).critical)} />}
                </div>
              ))}
            </div>
            <div className="flex-1" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-6 border-2 p-5 text-center w-full max-w-sm"
              style={{ borderColor: RED, background: `${RED}12`, boxShadow: `0 0 20px ${RED}15, inset 0 0 12px ${RED}08` }}>
              <p className="text-mono-eyebrow mb-1.5" style={{ color: RED }}>{data.without.stat.time}</p>
              <p className="text-body font-serif text-bone">{data.without.stat.outcome}</p>
              <p className="text-2xl font-mono font-light mt-1 tabular" style={{ color: RED }}>{data.without.stat.cost}</p>
            </motion.div>
          </motion.div>

          {/* RIGHT: With Certa */}
          <motion.div className="flex flex-col items-center relative flex-1"
            animate={{ opacity: activeSide === "right" ? 1 : 0.25, scale: activeSide === "right" ? 1 : 0.97, filter: activeSide === "right" ? "blur(0px)" : "blur(1px)" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <EngineBackground />
            <motion.div initial={{ opacity: 0, x: 10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-mono-eyebrow mb-6 px-5 py-2.5 border self-center relative z-10"
              style={{ color: GREEN, borderColor: `${GREEN}30`, background: "hsl(var(--certa-carbon))" }}>
              {data.with.pill}
            </motion.div>
            <div className="w-full max-w-sm flex flex-col items-center gap-0 relative z-10">
              {data.with.nodes.map((n, i) => (
                <div key={i} className="w-full">
                  <ScreeningNode label={n.label} sublabel={n.sublabel} status={n.status} delay={0.5 + i * 0.1} inView={inView} />
                  {i < data.with.nodes.length - 1 && <Connector color={GREEN} />}
                </div>
              ))}
            </div>
            <div className="flex-1" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-6 border-2 p-5 text-center w-full max-w-sm relative z-10"
              style={{ borderColor: GREEN, background: `${GREEN}12`, boxShadow: `0 0 20px ${GREEN}15, inset 0 0 12px ${GREEN}08` }}>
              <p className="text-mono-eyebrow mb-1.5" style={{ color: GREEN }}>{data.with.stat.time}</p>
              <p className="text-body font-serif text-bone">{data.with.stat.outcome}</p>
              <p className="text-2xl font-mono font-light mt-1 tabular" style={{ color: GREEN }}>{data.with.stat.cost}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Audit pack — verbatim from spec */}
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 border bg-carbon p-6 md:p-8 max-w-3xl mx-auto"
          style={{ borderColor: "hsl(var(--certa-rule))" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-mono-eyebrow text-graphite">AUDIT PACK · CERTA RUNTIME</p>
            <p className="text-mono-eyebrow text-signal-green">VERIFIED</p>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-x-6 gap-y-2">
            {data.auditPack.map((row) => (
              <React.Fragment key={row.k}>
                <dt className="text-mono-eyebrow text-graphite/70">{row.k}</dt>
                <dd className="text-mono-code text-bone break-all">{row.v}</dd>
              </React.Fragment>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
};

export default PatientNarrativeSection;

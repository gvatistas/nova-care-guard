import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { site } from "@/content/site";
import { ClassifiedStrip } from "@/components/hud";

const GREEN = "hsl(var(--signal-green))";
const AMBER = "hsl(var(--signal-amber))";

const QUEBEC_OUTLINE = "M60,20 L90,10 L130,8 L170,15 L200,10 L240,5 L280,12 L320,8 L360,15 L380,25 L390,45 L385,70 L375,95 L360,115 L340,130 L315,140 L285,148 L250,150 L215,148 L180,142 L150,135 L125,125 L105,110 L85,90 L70,65 L58,40 Z";

const regions = [
  { label: "MONTRÉAL", path: "M140,85 L180,78 L200,95 L190,115 L155,112 Z", cx: 172, cy: 97 },
  { label: "QUÉBEC CITY", path: "M220,55 L265,48 L285,68 L270,88 L230,82 Z", cx: 254, cy: 68 },
  { label: "LAURENTIDES", path: "M120,45 L165,38 L185,58 L170,78 L130,72 Z", cx: 154, cy: 58 },
  { label: "ESTRIE", path: "M160,118 L200,112 L220,132 L205,148 L170,142 Z", cx: 190, cy: 130 },
  { label: "OUTAOUAIS", path: "M75,55 L115,48 L130,68 L118,85 L82,78 Z", cx: 104, cy: 66 },
];

const CONNECTIONS: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[2,4],[3,4],
];

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}
function generateClinics(region: typeof regions[0], seed: number) {
  const rand = seededRandom(seed);
  return Array.from({ length: 4 }, (_, i) => {
    const angle = (i / 4) * Math.PI * 2 + rand() * 1.2;
    const dist = 8 + rand() * 14;
    return { x: region.cx + Math.cos(angle) * dist, y: region.cy + Math.sin(angle) * dist, transitionDelay: 0.8 + rand() * 4.5 };
  });
}

const ProjectAlphaSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [greenCount, setGreenCount] = useState(0);
  const [counterDisplay, setCounterDisplay] = useState(0);
  const [cycle, setCycle] = useState(0);
  const data = site.projectAlpha;
  const totalClinics = data.totals.clinics;

  const allClinics = useMemo(() => regions.map((r, i) => generateClinics(r, (i + 1) * 7919)), []);

  const flatClinics = useMemo(() => {
    const flat: { x: number; y: number; transitionDelay: number; regionIdx: number; clinicIdx: number }[] = [];
    allClinics.forEach((rc, ri) => rc.forEach((c, ci) => flat.push({ ...c, regionIdx: ri, clinicIdx: ci })));
    flat.sort((a, b) => a.transitionDelay - b.transitionDelay);
    return flat;
  }, [allClinics]);

  useEffect(() => {
    if (!inView) return;
    setGreenCount(0); setCounterDisplay(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    flatClinics.forEach((c, i) => timers.push(setTimeout(() => setGreenCount(i + 1), c.transitionDelay * 1000)));
    const maxDelay = flatClinics[flatClinics.length - 1]?.transitionDelay ?? 5;
    timers.push(setTimeout(() => setCycle(c => c + 1), (maxDelay + 5) * 1000));
    return () => timers.forEach(clearTimeout);
  }, [inView, flatClinics, cycle]);

  useEffect(() => {
    if (counterDisplay < greenCount) {
      const t = setTimeout(() => setCounterDisplay(p => p + 1), 80);
      return () => clearTimeout(t);
    }
  }, [greenCount, counterDisplay]);

  const getClinicState = useCallback((ri: number, ci: number): "active" | "deploying" | "pending" => {
    const idx = flatClinics.findIndex(c => c.regionIdx === ri && c.clinicIdx === ci);
    if (idx < greenCount) return "active";
    if (idx === greenCount) return "deploying";
    return "pending";
  }, [flatClinics, greenCount]);

  const adherence = Math.round(data.totals.baselineAdherence + (greenCount / totalClinics) * (data.totals.currentAdherence - data.totals.baselineAdherence));

  return (
    <section id="project-alpha" ref={ref} className="relative py-24 md:py-32 bg-ink">
      <div className="relative max-w-content mx-auto px-6 md:px-8">
        <ClassifiedStrip left={data.classified.left} right={data.classified.right} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="mb-10 max-w-3xl">
          <p className="text-mono-eyebrow text-graphite mb-4">{data.eyebrow}</p>
          <h2 className="font-serif text-h1 text-bone">{data.h1}</h2>
          <p className="text-body-lg text-graphite mt-4">{data.body}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="lg:col-span-2 relative border overflow-hidden bg-carbon" style={{ minHeight: 420, borderColor: "hsl(var(--certa-rule))" }}>
            <div className="absolute inset-0 pointer-events-none z-0"
              style={{ backgroundImage: `linear-gradient(hsla(220,13%,22%,0.6) 1px, transparent 1px), linear-gradient(90deg, hsla(220,13%,22%,0.6) 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
            <svg viewBox="30 0 420 170" className="w-full h-full relative z-5" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="alphaGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="greenGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <path d={QUEBEC_OUTLINE} fill="hsl(var(--certa-graphite))" fillOpacity="0.04" stroke="hsl(var(--certa-graphite))" strokeWidth="0.8" opacity="0.35" />
              {regions.map((r, i) => (
                <g key={i}>
                  <path d={r.path} fill="hsl(var(--certa-graphite))" fillOpacity="0.04" stroke="hsl(var(--certa-graphite))" strokeWidth="0.6" opacity="0.25" />
                  <text x={r.cx} y={r.cy - 18} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="4" letterSpacing="1.5" fill="hsl(var(--certa-graphite))" opacity="0.75">{r.label}</text>
                </g>
              ))}
              {CONNECTIONS.map(([a, b], i) => {
                const r1 = regions[a]!; const r2 = regions[b]!;
                const bothActive = allClinics[a]!.every((_, ci) => getClinicState(a, ci) === "active") &&
                                   allClinics[b]!.every((_, ci) => getClinicState(b, ci) === "active");
                return (
                  <g key={`conn-${i}`}>
                    <line x1={r1.cx} y1={r1.cy} x2={r2.cx} y2={r2.cy}
                      stroke={bothActive ? GREEN : "hsl(var(--certa-graphite))"} strokeWidth={bothActive ? 0.6 : 0.3}
                      opacity={bothActive ? 0.45 : 0.1} strokeDasharray={bothActive ? "none" : "2 4"} />
                    {bothActive && (
                      <circle r="1.5" fill={GREEN} opacity="0.7" filter="url(#greenGlow)">
                        <animateMotion dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" path={`M${r1.cx},${r1.cy} L${r2.cx},${r2.cy}`} />
                        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
              {allClinics.map((rc, ri) => rc.map((cl, ci) => {
                const state = getClinicState(ri, ci);
                const hub = regions[ri]!;
                return (
                  <line key={`cl-${ri}-${ci}`} x1={cl.x} y1={cl.y} x2={hub.cx} y2={hub.cy}
                    stroke={state === "active" ? GREEN : "hsl(var(--certa-graphite))"} strokeWidth="0.3"
                    opacity={state === "active" ? 0.35 : 0.08} />
                );
              }))}
              {allClinics.map((rc, ri) => rc.map((cl, ci) => {
                const state = getClinicState(ri, ci);
                const color = state === "active" ? GREEN : state === "deploying" ? AMBER : "hsl(var(--certa-graphite))";
                return (
                  <g key={`c-${ri}-${ci}`}>
                    {state === "active" && (
                      <circle cx={cl.x} cy={cl.y} r="2" fill="none" stroke={GREEN} strokeWidth="0.4" opacity="0" filter="url(#greenGlow)">
                        <animate attributeName="r" values="2;12;12" dur="1.5s" begin="0s" fill="freeze" />
                        <animate attributeName="opacity" values="0.6;0;0" dur="1.5s" begin="0s" fill="freeze" />
                      </circle>
                    )}
                    <circle cx={cl.x} cy={cl.y} r={state === "active" ? 2.5 : state === "deploying" ? 2 : 1.5}
                      fill={color} opacity={state === "active" ? 0.9 : 0.6}
                      filter={state === "active" ? "url(#greenGlow)" : undefined}>
                      <animate attributeName="opacity"
                        values={state === "active" ? "0.7;1;0.7" : state === "deploying" ? "0.4;0.8;0.4" : "0.3;0.6;0.3"}
                        dur={state === "deploying" ? "0.8s" : "2s"} repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              }))}
              {regions.map((r, i) => {
                const allGreen = allClinics[i]!.every((_, ci) => getClinicState(i, ci) === "active");
                return (
                  <g key={`hub-${i}`}>
                    <circle cx={r.cx} cy={r.cy} r="5" fill={allGreen ? GREEN : "hsl(var(--certa-graphite))"} opacity={allGreen ? 0.15 : 0.06} />
                    <circle cx={r.cx} cy={r.cy} r="2" fill={allGreen ? GREEN : "hsl(var(--certa-graphite))"} opacity={allGreen ? 0.9 : 0.4}
                      filter={allGreen ? "url(#greenGlow)" : undefined} />
                    {allGreen && (
                      <circle cx={r.cx} cy={r.cy} r="5" fill="none" stroke={GREEN} strokeWidth="0.4" opacity="0.4">
                        <animate attributeName="r" values="5;14;5" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5" style={{ background: greenCount === totalClinics ? GREEN : AMBER }} />
                <span className="text-mono-eyebrow text-graphite">{counterDisplay}/{totalClinics} CLINICS</span>
              </div>
              <span className="text-mono-eyebrow tabular" style={{ color: greenCount === totalClinics ? GREEN : AMBER }}>
                {greenCount === totalClinics ? "FULLY OPERATIONAL" : "DEPLOYING…"}
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }} className="flex flex-col gap-5">
            <div className="border p-6 flex-1 bg-carbon" style={{ borderColor: "hsl(var(--certa-rule))" }}>
              <h3 className="text-mono-eyebrow text-graphite mb-4">PREVENTIVE-SERVICE ADHERENCE</h3>
              <div className="flex items-end gap-4 h-48">
                <div className="flex-1 h-full relative overflow-hidden border bg-obsidian" style={{ borderColor: "hsl(var(--certa-rule))" }}>
                  <motion.div className="absolute bottom-0 left-0 right-0"
                    initial={{ height: "0%" }}
                    animate={inView ? { height: `${adherence}%` } : {}}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    style={{ background: `linear-gradient(to top, ${GREEN}55, hsla(220,13%,22%,0.1))`, borderTop: `1px solid hsla(220,13%,22%,0.4)` }} />
                  {[25, 50, 75, 100].map(t => (
                    <div key={t} className="absolute left-0 right-0" style={{ bottom: `${t}%` }}>
                      <div className="w-full h-px" style={{ background: "hsl(var(--certa-rule))" }} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-between h-full text-right">
                  {[100, 75, 50, 25, 0].map(v => (
                    <span key={v} className="text-mono-eyebrow text-graphite">{v}%</span>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="font-mono font-light tabular" style={{ fontSize: "3rem", color: adherence >= 90 ? GREEN : "hsl(var(--certa-bone))" }}>{adherence}%</span>
                <span className="ml-2 text-mono-eyebrow text-graphite">CURRENT</span>
              </div>
              <p className="mt-2 text-mono-eyebrow text-graphite/70 text-center">BASELINE {data.totals.baselineAdherence}% → TARGET {data.totals.currentAdherence}%</p>
            </div>

            <div className="border p-6 bg-carbon space-y-3" style={{ borderColor: "hsl(var(--certa-rule))" }}>
              {data.outcomes.map((o) => (
                <div key={o} className="font-serif text-bone" style={{ fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
                  <span className="inline-block w-1.5 h-1.5 mr-2 align-middle" style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
                  {o}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="mt-10 max-w-3xl text-body text-graphite italic font-serif">{data.closer}</p>
      </div>
    </section>
  );
};

export default ProjectAlphaSection;

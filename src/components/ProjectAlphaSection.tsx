import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";

const GREEN = "#4ade80";
const RED = "#ef4444";
const AMBER = "#9ca3af";

// Quebec province rough outline
const QUEBEC_OUTLINE = "M60,20 L90,10 L130,8 L170,15 L200,10 L240,5 L280,12 L320,8 L360,15 L380,25 L390,45 L385,70 L375,95 L360,115 L340,130 L315,140 L285,148 L250,150 L215,148 L180,142 L150,135 L125,125 L105,110 L85,90 L70,65 L58,40 Z";

const regions = [
  { label: "MONTRÉAL", path: "M140,85 L180,78 L200,95 L190,115 L155,112 Z", cx: 172, cy: 97 },
  { label: "QUÉBEC CITY", path: "M220,55 L265,48 L285,68 L270,88 L230,82 Z", cx: 254, cy: 68 },
  { label: "LAURENTIDES", path: "M120,45 L165,38 L185,58 L170,78 L130,72 Z", cx: 154, cy: 58 },
  { label: "ESTRIE", path: "M160,118 L200,112 L220,132 L205,148 L170,142 Z", cx: 190, cy: 130 },
  { label: "OUTAOUAIS", path: "M75,55 L115,48 L130,68 L118,85 L82,78 Z", cx: 104, cy: 66 },
];

// Inter-region connection lines
const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [2, 4], [3, 4],
];

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
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
  const totalClinics = 20;

  const allClinics = useMemo(() => regions.map((r, i) => generateClinics(r, (i + 1) * 7919)), []);

  const flatClinics = useMemo(() => {
    const flat: { x: number; y: number; transitionDelay: number; regionIdx: number; clinicIdx: number }[] = [];
    allClinics.forEach((regionClinics, ri) => regionClinics.forEach((c, ci) => flat.push({ ...c, regionIdx: ri, clinicIdx: ci })));
    flat.sort((a, b) => a.transitionDelay - b.transitionDelay);
    return flat;
  }, [allClinics]);

  useEffect(() => {
    if (!inView) return;
    setGreenCount(0);
    setCounterDisplay(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    flatClinics.forEach((clinic, i) => {
      timers.push(setTimeout(() => setGreenCount(i + 1), clinic.transitionDelay * 1000));
    });
    // After all deployed, wait 5s then restart
    const maxDelay = flatClinics[flatClinics.length - 1]?.transitionDelay ?? 5;
    timers.push(setTimeout(() => setCycle(c => c + 1), (maxDelay + 5) * 1000));
    return () => timers.forEach(clearTimeout);
  }, [inView, flatClinics, cycle]);

  // Animate counter display
  useEffect(() => {
    if (counterDisplay < greenCount) {
      const t = setTimeout(() => setCounterDisplay(prev => prev + 1), 80);
      return () => clearTimeout(t);
    }
  }, [greenCount, counterDisplay]);

  const getClinicState = useCallback((regionIdx: number, clinicIdx: number): "active" | "deploying" | "pending" => {
    const idx = flatClinics.findIndex((c) => c.regionIdx === regionIdx && c.clinicIdx === clinicIdx);
    if (idx < greenCount) return "active";
    if (idx === greenCount) return "deploying";
    return "pending";
  }, [flatClinics, greenCount]);

  const adherence = Math.round(45 + (greenCount / totalClinics) * 49);

  return (
    <section id="project-alpha" ref={ref} className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="mb-8">
          <h2 className="text-white font-mono font-bold leading-[1.15] tracking-[-0.02em]" style={{ fontSize: "2.5rem" }}>
            Project Alpha
          </h2>
          <p className="font-light mt-2 max-w-2xl" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem" }}>
            Real-time deployment monitoring across <span className="text-white font-normal">5 Quebec health networks, 20 clinical sites</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="lg:col-span-2 relative border border-white/[0.06] bg-black/40 overflow-hidden" style={{ minHeight: 420 }}>
            {/* Grid background */}
            <div className="absolute inset-0 pointer-events-none z-0"
              style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "35px 35px" }} />

            <svg viewBox="30 0 420 170" className="w-full h-full relative z-5" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="alphaGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="greenGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>

              {/* Quebec province outline */}
              <path d={QUEBEC_OUTLINE} fill="white" fillOpacity="0.015" stroke="white" strokeWidth="0.8" opacity="0.12" />

              {/* Region shapes */}
              {regions.map((region, i) => (
                <g key={i}>
                  <path d={region.path} fill="white" fillOpacity="0.03" stroke="white" strokeWidth="0.6" opacity="0.15" />
                  <text x={region.cx} y={region.cy - 18} textAnchor="middle" fontFamily="'Inter', system-ui, sans-serif" fontSize="4" letterSpacing="1.5" fill="white" opacity="0.25">{region.label}</text>
                </g>
              ))}

              {/* Inter-region connection lines with traveling pulses */}
              {CONNECTIONS.map(([a, b], i) => {
                const r1 = regions[a!]!;
                const r2 = regions[b!]!;
                const bothActive = allClinics[a!]!.every((_, ci) => getClinicState(a!, ci) === "active") &&
                                   allClinics[b!]!.every((_, ci) => getClinicState(b!, ci) === "active");
                return (
                  <g key={`conn-${i}`}>
                    <line x1={r1.cx} y1={r1.cy} x2={r2.cx} y2={r2.cy}
                      stroke={bothActive ? GREEN : "white"} strokeWidth={bothActive ? 0.6 : 0.3}
                      opacity={bothActive ? 0.3 : 0.06} strokeDasharray={bothActive ? "none" : "2 4"} />
                    {/* Traveling pulse along connection */}
                    {bothActive && (
                      <circle r="1.5" fill={GREEN} opacity="0.7" filter="url(#greenGlow)">
                        <animateMotion dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite"
                          path={`M${r1.cx},${r1.cy} L${r2.cx},${r2.cy}`} />
                        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Clinic-to-hub connections */}
              {allClinics.map((regionClinics, ri) => regionClinics.map((clinic, ci) => {
                const state = getClinicState(ri, ci);
                const hub = regions[ri]!;
                return (
                  <line key={`cl-${ri}-${ci}`} x1={clinic.x} y1={clinic.y} x2={hub.cx} y2={hub.cy}
                    stroke={state === "active" ? GREEN : "white"} strokeWidth="0.3"
                    opacity={state === "active" ? 0.2 : 0.04} />
                );
              }))}

              {/* Clinic dots */}
              {allClinics.map((regionClinics, ri) => regionClinics.map((clinic, ci) => {
                const state = getClinicState(ri, ci);
                const color = state === "active" ? GREEN : state === "deploying" ? AMBER : RED;
                return (
                  <g key={`c-${ri}-${ci}`}>
                    {state === "active" && (
                      <circle cx={clinic.x} cy={clinic.y} r="2" fill="none" stroke={GREEN} strokeWidth="0.4" opacity="0" filter="url(#greenGlow)">
                        <animate attributeName="r" values="2;12;12" dur="1.5s" begin="0s" fill="freeze" />
                        <animate attributeName="opacity" values="0.6;0;0" dur="1.5s" begin="0s" fill="freeze" />
                      </circle>
                    )}
                    <circle cx={clinic.x} cy={clinic.y} r={state === "active" ? 2.5 : state === "deploying" ? 2 : 1.5}
                      fill={color} opacity={state === "active" ? 0.9 : 0.6}
                      filter={state === "active" ? "url(#greenGlow)" : undefined}>
                      <animate attributeName="opacity"
                        values={state === "active" ? "0.7;1;0.7" : state === "deploying" ? "0.4;0.8;0.4" : "0.3;0.6;0.3"}
                        dur={state === "deploying" ? "0.8s" : "2s"} repeatCount="indefinite" />
                      <animate attributeName="r"
                        values={state === "active" ? "2.2;3;2.2" : state === "deploying" ? "1.8;2.5;1.8" : "1.3;1.8;1.3"}
                        dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              }))}

              {/* Hub nodes */}
              {regions.map((r, i) => {
                const regionGreenCount = allClinics[i]!.filter((_, ci) => getClinicState(i, ci) === "active").length;
                const allGreen = regionGreenCount === 4;
                return (
                  <g key={`hub-${i}`}>
                    <circle cx={r.cx} cy={r.cy} r="5" fill={allGreen ? GREEN : "white"} opacity={allGreen ? 0.12 : 0.03} />
                    <circle cx={r.cx} cy={r.cy} r="2" fill={allGreen ? GREEN : "white"} opacity={allGreen ? 0.9 : 0.2}
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

            {/* Status bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: greenCount === totalClinics ? GREEN : AMBER }} />
                <span className="font-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>
                  {counterDisplay}/{totalClinics} clinics deployed
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono" style={{ fontSize: "0.75rem" }}>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: GREEN }} /> Active</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: AMBER }} /> Deploying</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} /> Pending</span>
              </div>
              <span className="font-mono tracking-[0.1em]" style={{ fontSize: "0.875rem", color: greenCount === totalClinics ? GREEN : AMBER }}>
                {greenCount === totalClinics ? "FULLY OPERATIONAL" : "DEPLOYING..."}
              </span>
            </div>
          </motion.div>

          {/* Right stats column */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }} className="flex flex-col gap-5">
            <div className="border border-white/[0.06] bg-black/30 p-6 flex-1">
              <h3 className="font-mono tracking-[0.2em] uppercase mb-4" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>Preventive Service Adherence</h3>
              <div className="flex items-end gap-4 h-48">
                <div className="flex-1 h-full bg-white/[0.04] relative overflow-hidden border border-white/[0.04]">
                  <motion.div className="absolute bottom-0 left-0 right-0"
                    initial={{ height: "0%" }}
                    animate={inView ? { height: `${adherence}%` } : {}}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    style={{ background: `linear-gradient(to top, ${GREEN}33, rgba(255,255,255,0.15))`, borderTop: `1px solid rgba(255,255,255,0.3)` }} />
                  {[25, 50, 75, 100].map((tick) => (
                    <div key={tick} className="absolute left-0 right-0" style={{ bottom: `${tick}%` }}>
                      <div className="w-full h-px bg-white/[0.06]" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-between h-full text-right">
                  {[100, 75, 50, 25, 0].map((v) => (
                    <span key={v} className="font-mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{v}%</span>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="font-mono font-light text-white" style={{ fontSize: "3rem" }}>{adherence}%</span>
                <span className="font-mono ml-2 tracking-[0.1em]" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>CURRENT</span>
              </div>
            </div>

            <div className="border border-white/[0.06] bg-black/30 p-6">
              <div className="mb-4">
                <div className="font-mono font-light tracking-[-0.02em] text-white" style={{ fontSize: "1.5rem" }}>90% INTAKE TIME REDUCTION</div>
              </div>
              <div>
                <div className="font-mono font-light tracking-[-0.02em] text-white" style={{ fontSize: "1.5rem" }}>10x CARE GAP CLOSURE</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}
          className="mt-6 text-center max-w-3xl mx-auto" style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}>
          Enabling nurses to close 10x more care gaps per session — turning reactive visits into proactive prevention at scale.
        </motion.p>
      </div>
    </section>
  );
};

export default ProjectAlphaSection;

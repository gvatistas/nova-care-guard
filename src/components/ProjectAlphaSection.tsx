import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";

const TEAL = "#2dd4bf";
const GREEN = "#22c55e";
const RED = "#ef4444";
const AMBER = "#f59e0b";

/* ─── 5 abstract angular regions ─── */
const regions = [
  {
    label: "REGION 01",
    path: "M80,40 L140,25 L170,50 L155,85 L100,80 Z",
    cx: 125, cy: 55,
  },
  {
    label: "REGION 02",
    path: "M180,30 L240,20 L270,55 L250,80 L190,70 Z",
    cx: 225, cy: 50,
  },
  {
    label: "REGION 03",
    path: "M120,95 L180,85 L200,115 L175,145 L130,135 Z",
    cx: 160, cy: 115,
  },
  {
    label: "REGION 04",
    path: "M210,85 L280,75 L305,110 L280,140 L225,135 Z",
    cx: 255, cy: 108,
  },
  {
    label: "REGION 05",
    path: "M290,30 L350,22 L375,55 L355,85 L300,75 Z",
    cx: 330, cy: 52,
  },
];

/* ─── Seeded random ─── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/* ─── Generate 4 clinic positions per region ─── */
function generateClinics(region: typeof regions[0], seed: number) {
  const rand = seededRandom(seed);
  return Array.from({ length: 4 }, (_, i) => {
    const angle = (i / 4) * Math.PI * 2 + rand() * 1.2;
    const dist = 12 + rand() * 18;
    return {
      x: region.cx + Math.cos(angle) * dist,
      y: region.cy + Math.sin(angle) * dist,
      transitionDelay: 0.5 + rand() * 4, // seconds into the sequence this clinic turns green
    };
  });
}

const ProjectAlphaSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [greenCount, setGreenCount] = useState(0);
  const totalClinics = 20;

  const allClinics = useMemo(
    () => regions.map((r, i) => generateClinics(r, (i + 1) * 7919)),
    []
  );

  // Flatten and sort by transitionDelay for sequential activation
  const flatClinics = useMemo(() => {
    const flat: { x: number; y: number; transitionDelay: number; regionIdx: number; clinicIdx: number }[] = [];
    allClinics.forEach((regionClinics, ri) =>
      regionClinics.forEach((c, ci) => flat.push({ ...c, regionIdx: ri, clinicIdx: ci }))
    );
    flat.sort((a, b) => a.transitionDelay - b.transitionDelay);
    return flat;
  }, [allClinics]);

  // Sequential activation timer
  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    flatClinics.forEach((clinic, i) => {
      timers.push(
        setTimeout(() => setGreenCount(i + 1), clinic.transitionDelay * 1000)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, flatClinics]);

  const isGreen = useCallback(
    (regionIdx: number, clinicIdx: number) => {
      // Find this clinic's position in the sorted flat array
      const idx = flatClinics.findIndex(
        (c) => c.regionIdx === regionIdx && c.clinicIdx === clinicIdx
      );
      return idx < greenCount;
    },
    [flatClinics, greenCount]
  );

  const adherence = Math.round(45 + (greenCount / totalClinics) * 45);

  return (
    <section id="project-alpha" ref={ref} className="relative py-14 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.03),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-8">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-mono font-light leading-[1.15] tracking-[-0.02em]">
            Project Alpha
          </h2>
          <p className="text-gray-400 text-lg font-light mt-2 max-w-2xl">
            Real-time deployment monitoring across <span className="text-white font-normal">5 regions, 20 clinical sites</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ═══════ LEFT: Tactical Map (2 cols) ═══════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 relative border border-white/[0.06] bg-black/40 overflow-hidden"
            style={{ minHeight: 400 }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Scanline */}
            <div className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.01) 3px, rgba(255,255,255,0.01) 6px)",
              }}
            />

            <svg viewBox="40 0 380 175" className="w-full h-full relative z-5" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="alphaGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="ripple">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Region polygons */}
              {regions.map((region, i) => (
                <g key={i}>
                  <path d={region.path}
                    fill={TEAL} fillOpacity="0.03"
                    stroke={TEAL} strokeWidth="0.6" opacity="0.2"
                  />
                  {/* Region label */}
                  <text x={region.cx} y={region.cy - 22} textAnchor="middle"
                    fontFamily="monospace" fontSize="5" letterSpacing="2"
                    fill="white" opacity="0.2">
                    {region.label}
                  </text>
                </g>
              ))}

              {/* Inter-region backbone lines */}
              {regions.map((r, i) =>
                regions.slice(i + 1).map((r2, j) => (
                  <line key={`bb-${i}-${j}`}
                    x1={r.cx} y1={r.cy} x2={r2.cx} y2={r2.cy}
                    stroke="white" strokeWidth="0.2" opacity="0.04"
                    strokeDasharray="2 3"
                  />
                ))
              )}

              {/* Clinic dots */}
              {allClinics.map((regionClinics, ri) =>
                regionClinics.map((clinic, ci) => {
                  const green = isGreen(ri, ci);
                  return (
                    <g key={`c-${ri}-${ci}`}>
                      {/* Ripple ring on transition */}
                      {green && (
                        <circle cx={clinic.x} cy={clinic.y} r="2" fill="none"
                          stroke={GREEN} strokeWidth="0.4" opacity="0">
                          <animate attributeName="r" values="2;10;10" dur="1.5s" begin="0s" fill="freeze" />
                          <animate attributeName="opacity" values="0.5;0;0" dur="1.5s" begin="0s" fill="freeze" />
                        </circle>
                      )}
                      {/* Main dot */}
                      <circle
                        cx={clinic.x} cy={clinic.y}
                        r={green ? 2.2 : 1.8}
                        fill={green ? GREEN : RED}
                        opacity={green ? 0.85 : 0.6}
                      >
                        <animate
                          attributeName="opacity"
                          values={green ? "0.6;0.9;0.6" : "0.3;0.7;0.3"}
                          dur={green ? "2s" : "1.5s"}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="r"
                          values={green ? "2;2.5;2" : "1.5;2;1.5"}
                          dur={green ? "2s" : "1.5s"}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })
              )}

              {/* Region hub indicators */}
              {regions.map((r, i) => {
                const regionGreenCount = allClinics[i]!.filter((_, ci) => isGreen(i, ci)).length;
                const allGreen = regionGreenCount === 4;
                return (
                  <g key={`hub-${i}`}>
                    <circle cx={r.cx} cy={r.cy} r="4"
                      fill={allGreen ? GREEN : TEAL} opacity={allGreen ? 0.15 : 0.05} />
                    <circle cx={r.cx} cy={r.cy} r="1.5"
                      fill={allGreen ? GREEN : "white"} opacity={allGreen ? 0.8 : 0.3} />
                    {allGreen && (
                      <circle cx={r.cx} cy={r.cy} r="4" fill="none"
                        stroke={GREEN} strokeWidth="0.3" opacity="0.3">
                        <animate attributeName="r" values="4;10;4" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Status bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${greenCount === totalClinics ? "bg-green-500" : "bg-amber-400"}`} />
                <span className="font-mono text-[10px] text-gray-500">
                  {greenCount}/{totalClinics} clinics deployed
                </span>
              </div>
              <span className={`font-mono text-[10px] ${greenCount === totalClinics ? "text-green-500/70" : "text-amber-400/60"}`}>
                {greenCount === totalClinics ? "FULLY OPERATIONAL" : "DEPLOYING..."}
              </span>
            </div>
          </motion.div>

          {/* ═══════ RIGHT: Stats + Adherence Bar ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-5"
          >
            {/* Adherence vertical bar */}
            <div className="border border-white/[0.06] bg-black/30 p-6 flex-1">
              <h3 className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-gray-500 mb-4">
                Preventive Service Adherence
              </h3>
              <div className="flex items-end gap-4 h-48">
                {/* Bar */}
                <div className="flex-1 h-full bg-white/[0.04] relative overflow-hidden border border-white/[0.04]">
                  <motion.div
                    className="absolute bottom-0 left-0 right-0"
                    initial={{ height: "0%" }}
                    animate={inView ? { height: `${adherence}%` } : {}}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    style={{
                      background: `linear-gradient(to top, ${GREEN}33, ${TEAL}66)`,
                      borderTop: `1px solid ${TEAL}88`,
                    }}
                  />
                  {/* Tick marks */}
                  {[25, 50, 75, 100].map((tick) => (
                    <div key={tick} className="absolute left-0 right-0 flex items-center"
                      style={{ bottom: `${tick}%` }}>
                      <div className="w-full h-px bg-white/[0.06]" />
                    </div>
                  ))}
                </div>
                {/* Labels */}
                <div className="flex flex-col justify-between h-full text-right">
                  {[100, 75, 50, 25, 0].map((v) => (
                    <span key={v} className="font-mono text-[0.55rem] text-gray-600">{v}%</span>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="font-mono text-3xl font-light" style={{ color: TEAL }}>
                  {adherence}%
                </span>
                <span className="font-mono text-[0.6rem] text-gray-500 ml-2 tracking-[0.1em]">
                  CURRENT
                </span>
              </div>
            </div>

            {/* Stat callouts */}
            <div className="border border-white/[0.06] bg-black/30 p-6">
              <div className="mb-4">
                <div className="font-mono text-2xl md:text-3xl font-light tracking-[-0.02em]"
                  style={{
                    color: TEAL,
                    textShadow: `0 0 30px rgba(45,212,191,0.3), 0 0 60px rgba(45,212,191,0.1)`,
                  }}>
                  90% INTAKE TIME REDUCTION
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl md:text-3xl font-light tracking-[-0.02em]"
                  style={{
                    color: TEAL,
                    textShadow: `0 0 30px rgba(45,212,191,0.3), 0 0 60px rgba(45,212,191,0.1)`,
                  }}>
                  10x PATIENT THROUGHPUT
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
          className="mt-6 text-center"
          style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}
        >
          Enabling nurses to see 10x more patients per day, directly solving the access crisis.
        </motion.p>
      </div>
    </section>
  );
};

export default ProjectAlphaSection;

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const TEAL = "#4AEDC4";
const BG = "#030303";
const WHITE = "#ffffff";
const GRAY = "#666666";
const AMBER = "#F5A623";
const BLUE = "#5B8DEF";
const RED = "#FF5555";
const LILAC = "#B8A9E8";

/* ── Subtle grid ── */
const Grid = ({ frame }: { frame: number }) => {
  const drift = interpolate(frame, [0, 600], [0, -40]);
  return (
    <AbsoluteFill style={{ opacity: 0.02 }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={`v${i}`} style={{ position: "absolute", left: i * 66, top: drift, width: 1, height: 1200, backgroundColor: WHITE }} />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={`h${i}`} style={{ position: "absolute", top: i * 66 + drift, left: 0, width: 1920, height: 1, backgroundColor: WHITE }} />
      ))}
    </AbsoluteFill>
  );
};

/* ── Floating particles ── */
const Particles = ({ frame }: { frame: number }) => {
  const dots = Array.from({ length: 60 }, (_, i) => ({
    x: (i * 37 + 30) % 1920, y: (i * 31 + 50) % 1080,
    speed: 0.12 + (i % 5) * 0.06, phase: i * 0.7, size: 1 + (i % 3) * 0.5,
  }));
  return (
    <AbsoluteFill style={{ opacity: 0.06 }}>
      {dots.map((d, i) => {
        const y = (d.y + frame * d.speed) % 1100 - 10;
        const x = d.x + Math.sin(frame * 0.012 + d.phase) * 20;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: d.size, height: d.size, borderRadius: "50%", backgroundColor: TEAL }} />;
      })}
    </AbsoluteFill>
  );
};

/* ── Medient crown logo (SVG) ── */
const CrownLogo = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame: frame - 5, fps, config: { damping: 40, stiffness: 60 } });
  const breathe = Math.sin(frame * 0.03) * 2;
  // Crown geometry matching the Medient logo
  const cx = 960;
  const cy = 380;
  const scale = 2.5;

  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: appear }}>
      <defs>
        <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.8" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="crownGlow" cx="50%" cy="40%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.1" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow */}
      <circle cx={cx} cy={cy + breathe} r={200} fill="url(#crownGlow)" />
      {/* Crown M shape - 7 points matching the logo */}
      <g transform={`translate(${cx}, ${cy + breathe}) scale(${scale})`} opacity={0.9}>
        {/* Left outer wing */}
        <line x1="-40" y1="30" x2="-25" y2="-15" stroke={TEAL} strokeWidth="1.5" opacity="0.7" />
        <line x1="-25" y1="-15" x2="-15" y2="10" stroke={TEAL} strokeWidth="1.5" opacity="0.7" />
        {/* Left inner peak */}
        <line x1="-15" y1="10" x2="-8" y2="-30" stroke={TEAL} strokeWidth="1.8" opacity="0.9" />
        {/* Center peak */}
        <line x1="-8" y1="-30" x2="0" y2="-45" stroke={WHITE} strokeWidth="2" opacity="1" />
        <line x1="0" y1="-45" x2="8" y2="-30" stroke={WHITE} strokeWidth="2" opacity="1" />
        {/* Right inner peak */}
        <line x1="8" y1="-30" x2="15" y2="10" stroke={TEAL} strokeWidth="1.8" opacity="0.9" />
        {/* Right outer wing */}
        <line x1="15" y1="10" x2="25" y2="-15" stroke={TEAL} strokeWidth="1.5" opacity="0.7" />
        <line x1="25" y1="-15" x2="40" y2="30" stroke={TEAL} strokeWidth="1.5" opacity="0.7" />
        {/* Base line */}
        <line x1="-40" y1="30" x2="40" y2="30" stroke={TEAL} strokeWidth="1" opacity="0.4" />
        {/* Internal facet lines */}
        <line x1="-8" y1="-30" x2="-3" y2="30" stroke={TEAL} strokeWidth="0.6" opacity="0.25" />
        <line x1="8" y1="-30" x2="3" y2="30" stroke={TEAL} strokeWidth="0.6" opacity="0.25" />
        <line x1="0" y1="-45" x2="0" y2="30" stroke={TEAL} strokeWidth="0.4" opacity="0.15" />
      </g>
    </svg>
  );
};

/* ── Patient silhouette with digital scan ── */
const PatientFigure = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame, fps, config: { damping: 30, stiffness: 50 } });
  const breathe = Math.sin(frame * 0.04) * 3;
  const cx = 960;
  const cy = 440;

  // Scanning rings
  const scanAngle = interpolate(frame, [0, 300], [0, 1080]);
  const scanOp = interpolate(frame, [0, 20, 250, 280], [0, 0.35, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Digitization effect - body outline breaks into data points
  const digitizeProgress = interpolate(frame, [30, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Body data points that "digitize"
  const bodyPoints = [
    { x: 0, y: -80, label: "CRANIAL" },
    { x: -15, y: -55, label: "" }, { x: 15, y: -55, label: "" },
    { x: -25, y: -30, label: "THORACIC" }, { x: 25, y: -30, label: "" },
    { x: -35, y: -10, label: "" }, { x: 35, y: -10, label: "" },
    { x: 0, y: -20, label: "CARDIAC" },
    { x: 0, y: 10, label: "ABDOMINAL" },
    { x: -20, y: 40, label: "" }, { x: 20, y: 40, label: "" },
    { x: -22, y: 70, label: "" }, { x: 22, y: 70, label: "" },
  ];

  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: appear }}>
      <defs>
        <radialGradient id="patientGlow" cx="50%" cy="40%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.08" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow */}
      <circle cx={cx} cy={cy} r={180} fill="url(#patientGlow)" />

      {/* Scanning rings */}
      <circle cx={cx} cy={cy + breathe} r={110 + Math.sin(frame * 0.06) * 8} fill="none" stroke={TEAL} strokeWidth="0.6" opacity={scanOp}
        strokeDasharray="6 10" transform={`rotate(${scanAngle}, ${cx}, ${cy + breathe})`} />
      <circle cx={cx} cy={cy + breathe} r={130 + Math.sin(frame * 0.05) * 6} fill="none" stroke={TEAL} strokeWidth="0.3" opacity={scanOp * 0.5}
        strokeDasharray="3 14" transform={`rotate(${-scanAngle * 0.7}, ${cx}, ${cy + breathe})`} />
      <circle cx={cx} cy={cy + breathe} r={150} fill="none" stroke={TEAL} strokeWidth="0.2" opacity={scanOp * 0.3}
        strokeDasharray="2 18" transform={`rotate(${scanAngle * 0.4}, ${cx}, ${cy + breathe})`} />

      {/* Patient figure outline */}
      <g transform={`translate(${cx}, ${cy + breathe})`} opacity={interpolate(digitizeProgress, [0, 0.5], [0.9, 0.3], { extrapolateRight: "clamp" })}>
        <circle cx="0" cy="-65" r="22" fill="none" stroke={WHITE} strokeWidth="1.5" />
        <line x1="0" y1="-43" x2="0" y2="30" stroke={WHITE} strokeWidth="1.5" />
        <line x1="0" y1="-25" x2="-30" y2="10" stroke={WHITE} strokeWidth="1.2" />
        <line x1="0" y1="-25" x2="30" y2="10" stroke={WHITE} strokeWidth="1.2" />
        <line x1="0" y1="30" x2="-20" y2="72" stroke={WHITE} strokeWidth="1.2" />
        <line x1="0" y1="30" x2="20" y2="72" stroke={WHITE} strokeWidth="1.2" />
      </g>

      {/* Digitized data points appearing */}
      <g transform={`translate(${cx}, ${cy + breathe})`}>
        {bodyPoints.map((p, i) => {
          const pointAppear = interpolate(frame, [30 + i * 4, 40 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const pulse = 0.6 + Math.sin(frame * 0.08 + i) * 0.4;
          return (
            <g key={i} opacity={pointAppear}>
              <circle cx={p.x} cy={p.y} r={3} fill={TEAL} opacity={pulse * 0.8} />
              <circle cx={p.x} cy={p.y} r={6} fill="none" stroke={TEAL} strokeWidth="0.5" opacity={pulse * 0.3} />
              {p.label && (
                <text x={p.x + (p.x < 0 ? -12 : 12)} y={p.y + 4} textAnchor={p.x < 0 ? "end" : "start"}
                  fontFamily="monospace" fontSize="9" fill={`${WHITE}66`} letterSpacing="2">{p.label}</text>
              )}
            </g>
          );
        })}
      </g>

      {/* Patient label */}
      <text x={cx} y={cy + breathe + 110} textAnchor="middle" fontFamily="monospace" fontSize="13" fill={`${WHITE}77`} letterSpacing="3">
        SARAH MITCHELL, 52
      </text>
    </svg>
  );
};

/* ── Data source streams ── */
const DataSource = ({ label, icon, x, y, targetX, targetY, frame, fps, delay, color }: {
  label: string; icon: string; x: number; y: number; targetX: number; targetY: number;
  frame: number; fps: number; delay: number; color: string;
}) => {
  const appear = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60 } });
  const streamProgress = interpolate(frame - delay - 10, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const particles = Array.from({ length: 5 }, (_, i) => {
    const t = ((frame - delay) * 0.025 + i * 0.2) % 1;
    return { px: x + (targetX - x) * t, py: y + (targetY - y) * t, op: t > 0.05 && t < 0.95 ? 0.7 : 0 };
  });

  return (
    <g opacity={appear}>
      <rect x={x - 60} y={y - 20} width={120} height={40} rx="3" fill={`${color}0D`} stroke={color} strokeWidth="0.8" opacity={0.6} />
      <text x={x} y={y - 4} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={color} letterSpacing="1" opacity={0.9}>{icon}</text>
      <text x={x} y={y + 11} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={`${WHITE}66`} letterSpacing="2">{label}</text>
      <line x1={x} y1={y} x2={x + (targetX - x) * streamProgress} y2={y + (targetY - y) * streamProgress}
        stroke={color} strokeWidth="0.5" opacity={0.25} />
      {streamProgress > 0.2 && particles.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r="2" fill={color} opacity={p.op * 0.5} />
      ))}
    </g>
  );
};

const DataSources = ({ frame, fps }: { frame: number; fps: number }) => {
  const cx = 960; const cy = 440;
  const sources = [
    { label: "EHR", icon: "📋", x: 160, y: 200, color: BLUE, delay: 10 },
    { label: "LAB DATA", icon: "🧪", x: 200, y: 550, color: LILAC, delay: 20 },
    { label: "IMAGING", icon: "🔬", x: 1760, y: 220, color: AMBER, delay: 30 },
    { label: "PHARMACY", icon: "💊", x: 1720, y: 530, color: TEAL, delay: 40 },
    { label: "GENOMICS", icon: "🧬", x: 160, y: 380, color: `${WHITE}99`, delay: 50 },
    { label: "VITALS", icon: "❤️", x: 1760, y: 380, color: RED, delay: 60 },
  ];
  return (
    <svg width="1920" height="1080" style={{ position: "absolute" }}>
      {sources.map((s, i) => (
        <DataSource key={i} {...s} targetX={cx} targetY={cy} frame={frame} fps={fps} />
      ))}
    </svg>
  );
};

/* ── Screening results that materialize ── */
const ScreeningResults = ({ frame, fps }: { frame: number; fps: number }) => {
  const titleOp = spring({ frame, fps, config: { damping: 30, stiffness: 60 } });
  const screenings = [
    { label: "LDCT LUNG SCREENING", urgency: "CRITICAL — ELIGIBLE", color: RED, delay: 8 },
    { label: "COLORECTAL SCREENING", urgency: "OVERDUE — 3 YEARS", color: AMBER, delay: 18 },
    { label: "HYPERTENSION MGMT", urgency: "ACTIVE MONITORING", color: BLUE, delay: 28 },
    { label: "DIABETES PRE-SCREEN", urgency: "A1C 5.9% — ELIGIBLE", color: AMBER, delay: 38 },
    { label: "BREAST CANCER SCR", urgency: "ON SCHEDULE", color: TEAL, delay: 48 },
  ];

  return (
    <div style={{ position: "absolute", right: 80, top: 160 }}>
      <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 6, color: TEAL, opacity: titleOp * 0.7, marginBottom: 20 }}>
        SCREENING ANALYSIS
      </div>
      {screenings.map((s, i) => {
        const appear = spring({ frame: frame - s.delay, fps, config: { damping: 20, stiffness: 80 } });
        const slideX = interpolate(appear, [0, 1], [30, 0]);
        const glow = 0.7 + Math.sin((frame - s.delay) * 0.06) * 0.3;
        return (
          <div key={i} style={{
            opacity: appear, transform: `translateX(${slideX}px)`,
            display: "flex", alignItems: "center", gap: 14, marginBottom: 14,
          }}>
            <div style={{ width: 3, height: 40, backgroundColor: s.color, opacity: glow }} />
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 16, color: WHITE, fontWeight: 300, letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: s.color, letterSpacing: 3, marginTop: 2 }}>{s.urgency}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Prevention zones highlighted on body ── */
const PreventionZones = ({ frame, fps }: { frame: number; fps: number }) => {
  const cx = 960;
  const cy = 440;
  const zones = [
    { x: -5, y: -75, r: 18, color: RED, label: "LUNG", delay: 5 },
    { x: 0, y: -20, r: 16, color: AMBER, label: "COLON", delay: 15 },
    { x: -12, y: -40, r: 12, color: BLUE, label: "CARDIO", delay: 25 },
    { x: 10, y: 0, r: 14, color: AMBER, label: "PANCREAS", delay: 35 },
    { x: -8, y: -55, r: 10, color: TEAL, label: "BREAST", delay: 45 },
  ];

  return (
    <svg width="1920" height="1080" style={{ position: "absolute" }}>
      {zones.map((z, i) => {
        const appear = spring({ frame: frame - z.delay, fps, config: { damping: 15, stiffness: 80 } });
        const pulse = 0.5 + Math.sin(frame * 0.06 + i * 1.5) * 0.5;
        return (
          <g key={i} opacity={appear}>
            <circle cx={cx + z.x * 2} cy={cy + z.y * 1.5} r={z.r * pulse} fill={z.color} opacity={0.08} />
            <circle cx={cx + z.x * 2} cy={cy + z.y * 1.5} r={z.r * 0.6} fill="none" stroke={z.color} strokeWidth="0.8" opacity={0.5 * pulse} />
          </g>
        );
      })}
    </svg>
  );
};

/* ── Big stat reveal ── */
const StatReveal = ({ frame, fps }: { frame: number; fps: number }) => {
  const s = spring({ frame, fps, config: { damping: 15, stiffness: 60 } });
  const fo = interpolate(frame, [55, 75], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: s * fo,
    }}>
      <div style={{ fontFamily: "monospace", fontSize: 140, color: WHITE, fontWeight: 200, lineHeight: 1 }}>
        5 <span style={{ fontSize: 60, color: TEAL }}>critical</span>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 20, color: `${WHITE}66`, letterSpacing: 6, marginTop: 16 }}>
        SCREENINGS IDENTIFIED IN 0.3 SECONDS
      </div>
    </div>
  );
};

/* ── Scan beam ── */
const ScanBeam = ({ frame }: { frame: number }) => {
  const beamX = interpolate(frame % 140, [0, 140], [-200, 2100]);
  const op = interpolate(frame, [10, 30], [0, 0.25], { extrapolateRight: "clamp" });
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: op }}>
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0" />
          <stop offset="50%" stopColor={TEAL} stopOpacity="0.06" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={beamX - 150} y="150" width="300" height="600" fill="url(#beam)" />
    </svg>
  );
};

/* ── Status bar ── */
const StatusBar = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [5, 25], [0, 0.4], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 36, left: 60, right: 60, display: "flex", justifyContent: "space-between", opacity: op }}>
      <div style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: 5, color: `${WHITE}55` }}>MEDIENT CLINICAL ENGINE</div>
      <div style={{ display: "flex", gap: 30 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: `${WHITE}33` }}>SESSION: 0x4A2F</span>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: TEAL, opacity: 0.5 }}>● LIVE</span>
      </div>
    </div>
  );
};

/* ── Main composition ── */
export const HeroVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [275, 298], [1, 0], { extrapolateRight: "clamp" });
  const masterOp = fadeIn * fadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, #0a0a0a, ${BG})` }} />
      <div style={{ opacity: masterOp }}>
        <Grid frame={frame} />
        <Particles frame={frame} />
        <StatusBar frame={frame} />
        <ScanBeam frame={frame} />

        {/* Crown logo appears first */}
        <Sequence from={5}>
          <CrownLogo frame={frame - 5} fps={fps} />
        </Sequence>

        {/* Patient materializes */}
        <Sequence from={20}>
          <PatientFigure frame={frame - 20} fps={fps} />
        </Sequence>

        {/* Data sources stream in */}
        <Sequence from={40}>
          <DataSources frame={frame - 40} fps={fps} />
        </Sequence>

        {/* Prevention zones light up on body */}
        <Sequence from={90}>
          <PreventionZones frame={frame - 90} fps={fps} />
        </Sequence>

        {/* Screening results materialize */}
        <Sequence from={110}>
          <ScreeningResults frame={frame - 110} fps={fps} />
        </Sequence>

        {/* Big stat */}
        <Sequence from={220}>
          <StatReveal frame={frame - 220} fps={fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

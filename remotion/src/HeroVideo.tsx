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
    <AbsoluteFill style={{ opacity: 0.025 }}>
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
  const dots = Array.from({ length: 50 }, (_, i) => ({
    x: (i * 41 + 30) % 1920, y: (i * 29 + 50) % 1080,
    speed: 0.15 + (i % 5) * 0.08, phase: i * 0.7, size: 1 + (i % 3) * 0.4,
  }));
  return (
    <AbsoluteFill style={{ opacity: 0.08 }}>
      {dots.map((d, i) => {
        const y = (d.y + frame * d.speed) % 1100 - 10;
        const x = d.x + Math.sin(frame * 0.012 + d.phase) * 20;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: d.size, height: d.size, borderRadius: "50%", backgroundColor: TEAL }} />;
      })}
    </AbsoluteFill>
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

/* ── Patient silhouette (center) ── */
const PatientSilhouette = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame: frame - 10, fps, config: { damping: 40, stiffness: 50 } });
  const breathe = Math.sin(frame * 0.04) * 3;
  const cx = 960; const cy = 420;
  const pulseR = 120 + Math.sin(frame * 0.06) * 8;
  const scanAngle = interpolate(frame, [30, 200], [0, 720]);
  const scanOp = interpolate(frame, [30, 50, 180, 200], [0, 0.3, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: appear }}>
      <defs>
        <radialGradient id="patientGlow" cx="50%" cy="40%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.06" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow behind patient */}
      <circle cx={cx} cy={cy} r={200} fill="url(#patientGlow)" />
      {/* Scanning ring */}
      <circle cx={cx} cy={cy + breathe} r={pulseR} fill="none" stroke={TEAL} strokeWidth="0.6" opacity={scanOp}
        strokeDasharray="8 12" transform={`rotate(${scanAngle}, ${cx}, ${cy + breathe})`} />
      <circle cx={cx} cy={cy + breathe} r={pulseR + 20} fill="none" stroke={TEAL} strokeWidth="0.3" opacity={scanOp * 0.5}
        strokeDasharray="4 16" transform={`rotate(${-scanAngle * 0.7}, ${cx}, ${cy + breathe})`} />
      {/* Patient figure */}
      <g transform={`translate(${cx}, ${cy + breathe})`} opacity={0.85}>
        <circle cx="0" cy="-65" r="22" fill="none" stroke={WHITE} strokeWidth="1.5" />
        <line x1="0" y1="-43" x2="0" y2="30" stroke={WHITE} strokeWidth="1.5" />
        <line x1="0" y1="-25" x2="-28" y2="8" stroke={WHITE} strokeWidth="1.2" />
        <line x1="0" y1="-25" x2="28" y2="8" stroke={WHITE} strokeWidth="1.2" />
        <line x1="0" y1="30" x2="-20" y2="72" stroke={WHITE} strokeWidth="1.2" />
        <line x1="0" y1="30" x2="20" y2="72" stroke={WHITE} strokeWidth="1.2" />
      </g>
      {/* Patient label */}
      <text x={cx} y={cy + breathe + 110} textAnchor="middle" fontFamily="monospace" fontSize="14" fill={`${WHITE}88`} letterSpacing="3">SARAH MITCHELL, 52</text>
    </svg>
  );
};

/* ── Data source streams converging on patient ── */
const DataSource = ({ label, icon, x, y, targetX, targetY, frame, fps, delay, color }: {
  label: string; icon: string; x: number; y: number; targetX: number; targetY: number;
  frame: number; fps: number; delay: number; color: string;
}) => {
  const appear = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60 } });
  const streamProgress = interpolate(frame - delay - 15, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseOp = 0.4 + Math.sin((frame - delay) * 0.08) * 0.2;

  // Data stream particles along the line
  const particles = Array.from({ length: 4 }, (_, i) => {
    const t = ((frame - delay) * 0.02 + i * 0.25) % 1;
    return {
      px: x + (targetX - x) * t,
      py: y + (targetY - y) * t,
      op: t > 0.1 && t < 0.9 ? 0.6 : 0,
    };
  });

  return (
    <g opacity={appear}>
      {/* Source node */}
      <rect x={x - 55} y={y - 18} width={110} height={36} rx="2" fill={`${color}11`} stroke={color} strokeWidth="0.8" opacity={0.7} />
      <text x={x} y={y - 4} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={color} letterSpacing="2" opacity={0.8}>{icon}</text>
      <text x={x} y={y + 10} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={`${WHITE}66`} letterSpacing="2">{label}</text>
      {/* Connection line */}
      <line x1={x} y1={y} x2={x + (targetX - x) * streamProgress} y2={y + (targetY - y) * streamProgress}
        stroke={color} strokeWidth="0.5" opacity={0.2} />
      {/* Stream particles */}
      {streamProgress > 0.3 && particles.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r="2" fill={color} opacity={p.op * pulseOp} />
      ))}
    </g>
  );
};

const DataSources = ({ frame, fps }: { frame: number; fps: number }) => {
  const cx = 960; const cy = 420;
  const sources = [
    { label: "EHR", icon: "📋", x: 180, y: 200, color: BLUE, delay: 20 },
    { label: "LAB RESULTS", icon: "🧪", x: 220, y: 550, color: LILAC, delay: 30 },
    { label: "IMAGING", icon: "🔬", x: 1740, y: 220, color: AMBER, delay: 40 },
    { label: "PHARMACY", icon: "💊", x: 1700, y: 530, color: TEAL, delay: 50 },
    { label: "GENETICS", icon: "🧬", x: 180, y: 380, color: `${WHITE}99`, delay: 60 },
    { label: "VITALS", icon: "❤️", x: 1740, y: 380, color: RED, delay: 70 },
  ];
  return (
    <svg width="1920" height="1080" style={{ position: "absolute" }}>
      {sources.map((s, i) => (
        <DataSource key={i} {...s} targetX={cx} targetY={cy} frame={frame} fps={fps} />
      ))}
    </svg>
  );
};

/* ── Screening cards that materialize ── */
const ScreeningCard = ({ label, urgency, color, x, y, frame, fps, delay }: {
  label: string; urgency: string; color: string; x: number; y: number;
  frame: number; fps: number; delay: number;
}) => {
  const appear = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 80 } });
  const slideX = interpolate(appear, [0, 1], [40, 0]);
  const glow = Math.sin((frame - delay) * 0.06) * 0.15 + 0.85;

  return (
    <div style={{
      position: "absolute", left: x, top: y,
      opacity: appear, transform: `translateX(${slideX}px)`,
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ width: 3, height: 44, backgroundColor: color, opacity: glow }} />
      <div>
        <div style={{ fontFamily: "monospace", fontSize: 16, color: WHITE, fontWeight: 300, letterSpacing: 1 }}>{label}</div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color, letterSpacing: 3, marginTop: 3 }}>{urgency}</div>
      </div>
    </div>
  );
};

const ScreeningResults = ({ frame, fps }: { frame: number; fps: number }) => {
  const titleOp = spring({ frame, fps, config: { damping: 30, stiffness: 60 } });
  const screenings = [
    { label: "LDCT LUNG SCREENING", urgency: "CRITICAL — ELIGIBLE", color: RED, delay: 10 },
    { label: "COLORECTAL SCREENING", urgency: "OVERDUE — 3 YEARS", color: AMBER, delay: 22 },
    { label: "HYPERTENSION MGMT", urgency: "ACTIVE MONITORING", color: BLUE, delay: 34 },
    { label: "DIABETES PRE-SCREEN", urgency: "A1C 5.9% — ELIGIBLE", color: AMBER, delay: 46 },
    { label: "BREAST CANCER SCR", urgency: "ON SCHEDULE", color: TEAL, delay: 58 },
  ];
  return (
    <div style={{ position: "absolute", right: 100, top: 170 }}>
      <div style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 6, color: TEAL, opacity: titleOp * 0.6, marginBottom: 24 }}>
        SCREENING ANALYSIS
      </div>
      {screenings.map((s, i) => (
        <ScreeningCard key={i} {...s} x={0} y={i * 62} frame={frame} fps={fps} />
      ))}
    </div>
  );
};

/* ── Crown lines from logo ── */
const CrownLines = ({ frame, fps }: { frame: number; fps: number }) => {
  const expand = spring({ frame: frame - 5, fps, config: { damping: 80, stiffness: 40 } });
  const fade = interpolate(frame, [60, 100], [1, 0.04], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scale = interpolate(expand, [0, 1], [1, 16]);
  const cx = 960; const cy = 420;
  const points = [
    { x: -20, y: 20 }, { x: -12, y: -15 }, { x: -5, y: 5 },
    { x: 0, y: -25 }, { x: 5, y: 5 }, { x: 12, y: -15 }, { x: 20, y: 20 },
  ];
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: fade }}>
      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i - 1]!;
        return (
          <line key={i} x1={cx + prev.x * scale} y1={cy + prev.y * scale}
            x2={cx + p.x * scale} y2={cy + p.y * scale}
            stroke={TEAL} strokeWidth={interpolate(expand, [0, 1], [2.5, 0.4])} opacity={0.5} />
        );
      })}
      <line x1={cx + points[0]!.x * scale} y1={cy + points[0]!.y * scale}
        x2={cx + points[6]!.x * scale} y2={cy + points[6]!.y * scale}
        stroke={TEAL} strokeWidth={interpolate(expand, [0, 1], [1.5, 0.2])} opacity={0.3} />
    </svg>
  );
};

/* ── Big stat reveal ── */
const StatReveal = ({ frame, fps }: { frame: number; fps: number }) => {
  const s = spring({ frame, fps, config: { damping: 15, stiffness: 60 } });
  const fo = interpolate(frame, [50, 70], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: s * fo,
    }}>
      <div style={{ fontFamily: "monospace", fontSize: 140, color: WHITE, fontWeight: 200, lineHeight: 1 }}>
        5 <span style={{ fontSize: 60, color: TEAL }}>critical</span>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 18, color: `${WHITE}66`, letterSpacing: 6, marginTop: 16 }}>
        SCREENINGS IDENTIFIED IN 0.3 SECONDS
      </div>
    </div>
  );
};

/* ── Scan beam ── */
const ScanBeam = ({ frame }: { frame: number }) => {
  const beamX = interpolate(frame % 120, [0, 120], [-200, 2100]);
  const op = interpolate(frame, [20, 40], [0, 0.3], { extrapolateRight: "clamp" });
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: op }}>
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0" />
          <stop offset="50%" stopColor={TEAL} stopOpacity="0.08" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={beamX - 150} y="150" width="300" height="600" fill="url(#beam)" />
    </svg>
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
        <CrownLines frame={frame} fps={fps} />
        <ScanBeam frame={frame} />
        {/* Patient appears */}
        <Sequence from={15}>
          <PatientSilhouette frame={frame - 15} fps={fps} />
        </Sequence>
        {/* Data sources stream in */}
        <Sequence from={30}>
          <DataSources frame={frame - 30} fps={fps} />
        </Sequence>
        {/* Screening results materialize */}
        <Sequence from={100}>
          <ScreeningResults frame={frame - 100} fps={fps} />
        </Sequence>
        {/* Big stat */}
        <Sequence from={220}>
          <StatReveal frame={frame - 220} fps={fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

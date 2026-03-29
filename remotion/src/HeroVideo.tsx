import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const TEAL = "#4AEDC4";
const BG = "#030303";
const WHITE = "#ffffff";
const GRAY = "#888888";
const AMBER = "#F5A623";
const BLUE = "#5B8DEF";

const CrownLines = ({ frame, fps }: { frame: number; fps: number }) => {
  const expand = spring({ frame: frame - 5, fps, config: { damping: 80, stiffness: 40 } });
  const fade = interpolate(frame, [60, 90], [1, 0.06], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scale = interpolate(expand, [0, 1], [1, 14]);
  const cx = 960;
  const cy = 450;
  const points = [
    { x: -20, y: 20 }, { x: -12, y: -15 }, { x: -5, y: 5 },
    { x: 0, y: -25 }, { x: 5, y: 5 }, { x: 12, y: -15 }, { x: 20, y: 20 },
  ];
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: fade }}>
      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        return (
          <line key={i} x1={cx + prev.x * scale} y1={cy + prev.y * scale}
            x2={cx + p.x * scale} y2={cy + p.y * scale}
            stroke={TEAL} strokeWidth={interpolate(expand, [0, 1], [3, 0.5])} opacity={0.6} />
        );
      })}
      <line x1={cx + points[0].x * scale} y1={cy + points[0].y * scale}
        x2={cx + points[6].x * scale} y2={cy + points[6].y * scale}
        stroke={TEAL} strokeWidth={interpolate(expand, [0, 1], [2, 0.3])} opacity={0.4} />
    </svg>
  );
};

const PatientBody = ({ x, y, scale: s, color, opacity: op, label, riskLevel, frame, fps, delay }: {
  x: number; y: number; scale: number; color: string; opacity: number; label: string;
  riskLevel: "high" | "medium" | "low" | "none"; frame: number; fps: number; delay: number;
}) => {
  const appear = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60 } });
  const breathe = Math.sin((frame - delay) * 0.06) * 2;
  const riskColors: Record<string, string> = { high: "#FF5555", medium: AMBER, low: TEAL, none: GRAY };
  const riskLabels: Record<string, string> = { high: "HIGH RISK", medium: "MODERATE", low: "LOW RISK", none: "—" };
  const rc = riskColors[riskLevel];
  return (
    <g transform={`translate(${x}, ${y + breathe}) scale(${s * appear})`} opacity={op * appear}>
      <circle cx="0" cy="-55" r="18" fill="none" stroke={color} strokeWidth="1.8" />
      <line x1="0" y1="-37" x2="0" y2="25" stroke={color} strokeWidth="1.8" />
      <line x1="0" y1="-22" x2="-22" y2="5" stroke={color} strokeWidth="1.4" />
      <line x1="0" y1="-22" x2="22" y2="5" stroke={color} strokeWidth="1.4" />
      <line x1="0" y1="25" x2="-16" y2="60" stroke={color} strokeWidth="1.4" />
      <line x1="0" y1="25" x2="16" y2="60" stroke={color} strokeWidth="1.4" />
      {riskLevel !== "none" && (
        <>
          <circle cx="0" cy="-10" r="35" fill="none" stroke={rc} strokeWidth="0.8" strokeDasharray="4 4" opacity={0.5} />
          <circle cx="0" cy="-10" r="38" fill="none" stroke={rc} strokeWidth="0.3" opacity={0.3}>
            <animate attributeName="r" values="38;42;38" dur="2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      <text x="0" y="82" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={GRAY} letterSpacing="2">{label}</text>
      {riskLevel !== "none" && (
        <text x="0" y="98" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={rc} fontWeight="500" letterSpacing="3">{riskLabels[riskLevel]}</text>
      )}
    </g>
  );
};

const ScanBeam = ({ frame }: { frame: number }) => {
  const beamX = interpolate(frame % 150, [0, 150], [-200, 2100]);
  const op = interpolate(frame, [60, 80], [0, 0.4], { extrapolateRight: "clamp" });
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: op }}>
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0" />
          <stop offset="50%" stopColor={TEAL} stopOpacity="0.12" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={beamX - 120} y="180" width="240" height="550" fill="url(#beam)" />
    </svg>
  );
};

const DataPanel = ({ frame, fps }: { frame: number; fps: number }) => {
  const slideIn = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 60 } });
  const x = interpolate(slideIn, [0, 1], [80, 0]);
  const screenings = [
    { name: "LDCT LUNG SCREENING", status: "ELIGIBLE — CRITICAL", color: "#FF5555", delay: 0 },
    { name: "COLORECTAL SCREENING", status: "ELIGIBLE — OVERDUE", color: AMBER, delay: 10 },
    { name: "HYPERTENSION MGMT", status: "ACTIVE MONITORING", color: BLUE, delay: 20 },
    { name: "DIABETES PRE-SCREEN", status: "ELIGIBLE — A1C 5.9%", color: AMBER, delay: 30 },
    { name: "BREAST CANCER SCR", status: "ON SCHEDULE", color: TEAL, delay: 40 },
  ];
  return (
    <div style={{
      position: "absolute", right: 100, top: 180,
      opacity: slideIn, transform: `translateX(${x}px)`, width: 520,
    }}>
      <div style={{ fontFamily: "monospace", fontSize: 15, letterSpacing: 6, color: TEAL, marginBottom: 28, opacity: 0.7 }}>
        SCREENING ANALYSIS
      </div>
      {screenings.map((s, i) => {
        const itemSpring = spring({ frame: frame - 20 - s.delay, fps, config: { damping: 20, stiffness: 100 } });
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
            opacity: itemSpring, transform: `translateX(${interpolate(itemSpring, [0, 1], [30, 0])}px)`,
          }}>
            <div style={{ width: 4, height: 50, backgroundColor: s.color, opacity: 0.8 }} />
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 20, color: WHITE, fontWeight: 300, letterSpacing: 1 }}>{s.name}</div>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: s.color, letterSpacing: 3, marginTop: 4 }}>{s.status}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PopulationBars = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame, fps, config: { damping: 30, stiffness: 50 } });
  const categories = [
    { label: "LUNG CA", before: 85, after: 22, color: "#FF5555" },
    { label: "COLORECTAL", before: 72, after: 18, color: AMBER },
    { label: "CARDIAC", before: 65, after: 25, color: BLUE },
    { label: "DIABETES", before: 58, after: 15, color: "#B07CFF" },
    { label: "BREAST CA", before: 45, after: 12, color: "#FF8CC8" },
  ];
  const barWidth = 55;
  const totalWidth = categories.length * (barWidth * 2 + 40);
  const startX = (1920 - totalWidth) / 2;
  const transition = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 100, left: 0, right: 0, opacity: appear }}>
      <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 6, textAlign: "center", color: GRAY, marginBottom: 24 }}>
        PREVENTABLE DISEASE BURDEN — POPULATION SCALE
      </div>
      <svg width="1920" height="280" style={{ display: "block" }}>
        {categories.map((cat, i) => {
          const x = startX + i * (barWidth * 2 + 40);
          const beforeH = cat.before * 2.2;
          const currentH = interpolate(transition, [0, 1], [beforeH, cat.after * 2.2]);
          const barColor = transition > 0.5 ? TEAL : cat.color;
          return (
            <g key={i}>
              <rect x={x} y={240 - beforeH} width={barWidth} height={beforeH} fill={cat.color} opacity={0.15} />
              <rect x={x + barWidth + 4} y={240 - currentH} width={barWidth} height={currentH} fill={barColor} opacity={0.7} />
              <text x={x + barWidth} y={258} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={GRAY} letterSpacing="2">{cat.label}</text>
            </g>
          );
        })}
        <rect x={startX} y={8} width={12} height={12} fill={GRAY} opacity={0.3} />
        <text x={startX + 18} y={18} fontFamily="monospace" fontSize="12" fill={GRAY}>WITHOUT</text>
        <rect x={startX + 150} y={8} width={12} height={12} fill={TEAL} opacity={0.7} />
        <text x={startX + 168} y={18} fontFamily="monospace" fontSize="12" fill={TEAL}>WITH MEDIENT</text>
      </svg>
    </div>
  );
};

const StatusBar = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [5, 20], [0, 0.5], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 40, left: 60, right: 60,
      display: "flex", justifyContent: "space-between", opacity: op,
    }}>
      <div style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 5, color: `${WHITE}66` }}>MEDIENT CLINICAL INTELLIGENCE</div>
      <div style={{ display: "flex", gap: 30 }}>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: `${WHITE}44` }}>SESSION: 0x4A2F</span>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: TEAL, opacity: 0.6 }}>● LIVE</span>
      </div>
    </div>
  );
};

const Particles = ({ frame }: { frame: number }) => {
  const dots = Array.from({ length: 35 }, (_, i) => ({
    x: (i * 51 + 80) % 1920, y: (i * 37 + 100) % 1080,
    speed: 0.2 + (i % 4) * 0.1, phase: i * 0.5, size: 1 + (i % 3) * 0.5,
  }));
  return (
    <AbsoluteFill style={{ opacity: 0.12 }}>
      {dots.map((d, i) => {
        const y = (d.y + frame * d.speed) % 1100 - 10;
        const x = d.x + Math.sin(frame * 0.015 + d.phase) * 15;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: d.size, height: d.size, borderRadius: "50%", backgroundColor: TEAL }} />;
      })}
    </AbsoluteFill>
  );
};

const Grid = ({ frame }: { frame: number }) => {
  const drift = interpolate(frame, [0, 300], [0, -15]);
  return (
    <AbsoluteFill style={{ opacity: 0.03 }}>
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={`v${i}`} style={{ position: "absolute", left: i * 80, top: drift, width: 1, height: 1200, backgroundColor: WHITE }} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={`h${i}`} style={{ position: "absolute", top: i * 80 + drift, left: 0, width: 1920, height: 1, backgroundColor: WHITE }} />
      ))}
    </AbsoluteFill>
  );
};

export const HeroVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [280, 300], [1, 0], { extrapolateRight: "clamp" });
  const masterOp = fadeIn * fadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 35% 45%, #0a0a0a, ${BG})` }} />
      <div style={{ opacity: masterOp }}>
        <Grid frame={frame} />
        <Particles frame={frame} />
        <StatusBar frame={frame} />
        <CrownLines frame={frame} fps={fps} />
        <ScanBeam frame={frame} />
        <Sequence from={40}>
          <AbsoluteFill>
            <svg width="1920" height="1080" style={{ position: "absolute" }}>
              <PatientBody x={260} y={370} scale={1.4} color={`${WHITE}88`} opacity={0.9}
                label="SARAH, 52" riskLevel="high" frame={frame - 40} fps={fps} delay={0} />
              <PatientBody x={500} y={380} scale={1.15} color={`${WHITE}55`} opacity={0.7}
                label="JAMES, 61" riskLevel="medium" frame={frame - 40} fps={fps} delay={14} />
              <PatientBody x={710} y={385} scale={1.05} color={`${WHITE}44`} opacity={0.6}
                label="MARIA, 48" riskLevel="low" frame={frame - 40} fps={fps} delay={28} />
              <PatientBody x={900} y={383} scale={1.1} color={`${WHITE}44`} opacity={0.5}
                label="CHEN, 55" riskLevel="medium" frame={frame - 40} fps={fps} delay={42} />
            </svg>
          </AbsoluteFill>
        </Sequence>
        <Sequence from={80}>
          <DataPanel frame={frame - 80} fps={fps} />
        </Sequence>
        <Sequence from={200}>
          <PopulationBars frame={frame - 200} fps={fps} />
        </Sequence>
        <Sequence from={220}>
          {(() => {
            const s = spring({ frame: frame - 220, fps, config: { damping: 15, stiffness: 60 } });
            const fo = interpolate(frame, [270, 290], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            return (
              <div style={{
                position: "absolute", right: 160, top: 200,
                opacity: s * fo, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 110, color: TEAL, fontWeight: 200, lineHeight: 1 }}>92%</div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: `${WHITE}77`, letterSpacing: 5, marginTop: 10 }}>EARLY DETECTION RATE</div>
              </div>
            );
          })()}
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

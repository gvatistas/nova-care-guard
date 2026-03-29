import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const TEAL = "#4AEDC4";
const BG = "#050505";
const DARK = "#0a0a0a";

// Persistent grid background
const Grid = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [0, -20]);
  
  return (
    <AbsoluteFill style={{ opacity: 0.04 }}>
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={`v${i}`} style={{ position: "absolute", left: i * 80, top: drift, width: 1, height: 1200, backgroundColor: "white" }} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={`h${i}`} style={{ position: "absolute", top: i * 80 + drift, left: 0, width: 1920, height: 1, backgroundColor: "white" }} />
      ))}
    </AbsoluteFill>
  );
};

// Scan line that sweeps
const ScanLine = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame % 120, [0, 120], [-50, 1130]);
  const opacity = interpolate(frame % 120, [0, 30, 90, 120], [0, 0.6, 0.6, 0]);
  
  return (
    <div style={{
      position: "absolute", top: y, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, transparent 5%, ${TEAL}44 30%, ${TEAL} 50%, ${TEAL}44 70%, transparent 95%)`,
      opacity,
      boxShadow: `0 0 40px ${TEAL}44, 0 0 80px ${TEAL}22`,
    }} />
  );
};

// Patient body outline — abstract wireframe figure
const PatientFigure = ({ frame, fps }: { frame: number; fps: number }) => {
  const enterScale = spring({ frame, fps, config: { damping: 200 } });
  const breathe = Math.sin(frame * 0.05) * 3;
  const opacity = interpolate(enterScale, [0, 1], [0, 0.5]);
  
  // Heart pulse effect
  const heartPulse = Math.sin(frame * 0.15) * 0.5 + 0.5;
  
  return (
    <div style={{
      position: "absolute",
      left: 300,
      top: 180 + breathe,
      opacity,
      transform: `scale(${enterScale})`,
      transformOrigin: "center center",
    }}>
      {/* Head */}
      <div style={{
        width: 70, height: 70, borderRadius: "50%",
        border: `1.5px solid ${TEAL}66`,
        position: "absolute", left: 85, top: 0,
      }} />
      
      {/* Neck */}
      <div style={{
        width: 1.5, height: 30, backgroundColor: `${TEAL}44`,
        position: "absolute", left: 120, top: 70,
      }} />
      
      {/* Torso */}
      <svg width="240" height="300" style={{ position: "absolute", left: 0, top: 95 }}>
        {/* Shoulders */}
        <line x1="40" y1="10" x2="200" y2="10" stroke={`${TEAL}44`} strokeWidth="1.5" />
        {/* Left arm */}
        <line x1="40" y1="10" x2="20" y2="120" stroke={`${TEAL}33`} strokeWidth="1" />
        <line x1="20" y1="120" x2="10" y2="200" stroke={`${TEAL}22`} strokeWidth="1" />
        {/* Right arm */}
        <line x1="200" y1="10" x2="220" y2="120" stroke={`${TEAL}33`} strokeWidth="1" />
        <line x1="220" y1="120" x2="230" y2="200" stroke={`${TEAL}22`} strokeWidth="1" />
        {/* Spine */}
        <line x1="120" y1="10" x2="120" y2="200" stroke={`${TEAL}33`} strokeWidth="1" />
        {/* Ribs */}
        {[30, 55, 80, 105, 130].map((y, i) => (
          <g key={i}>
            <line x1="70" y1={y} x2="120" y2={y - 5} stroke={`${TEAL}22`} strokeWidth="0.8" />
            <line x1="120" y1={y - 5} x2="170" y2={y} stroke={`${TEAL}22`} strokeWidth="0.8" />
          </g>
        ))}
        {/* Pelvis */}
        <line x1="70" y1="200" x2="170" y2="200" stroke={`${TEAL}33`} strokeWidth="1" />
        {/* Legs */}
        <line x1="80" y1="200" x2="70" y2="300" stroke={`${TEAL}22`} strokeWidth="1" />
        <line x1="160" y1="200" x2="170" y2="300" stroke={`${TEAL}22`} strokeWidth="1" />
        
        {/* Heart glow */}
        <circle cx="105" cy="50" r={8 + heartPulse * 4} fill="none" stroke={TEAL} strokeWidth="0.5" opacity={heartPulse * 0.4} />
        <circle cx="105" cy="50" r="3" fill={TEAL} opacity={0.3 + heartPulse * 0.3} />
        
        {/* Lung highlight zones */}
        <ellipse cx="90" cy="70" rx="25" ry="40" fill="none" stroke={`${TEAL}22`} strokeWidth="0.5" strokeDasharray="4 4" />
        <ellipse cx="150" cy="70" rx="25" ry="40" fill="none" stroke={`${TEAL}22`} strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    </div>
  );
};

// Data points streaming in
const DataStream = ({ frame, fps }: { frame: number; fps: number }) => {
  const dataPoints = [
    { label: "AGE", value: "52", delay: 30 },
    { label: "SEX", value: "FEMALE", delay: 38 },
    { label: "SMOKING", value: "30 PACK-YRS", delay: 46, highlight: true },
    { label: "BMI", value: "27.4", delay: 54 },
    { label: "BP", value: "138/88", delay: 62 },
    { label: "A1C", value: "5.9%", delay: 70 },
    { label: "FAMILY_HX", value: "LUNG_CA", delay: 78, highlight: true },
    { label: "LAST_LDCT", value: "NEVER", delay: 86, highlight: true },
    { label: "LIPIDS", value: "ELEVATED", delay: 94 },
    { label: "COLON_SCR", value: "OVERDUE", delay: 102 },
  ];
  
  return (
    <div style={{ position: "absolute", right: 180, top: 160 }}>
      <div style={{
        fontFamily: "monospace", fontSize: 11, letterSpacing: 5,
        color: `${TEAL}88`, marginBottom: 16,
        opacity: interpolate(frame, [25, 35], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        PATIENT RECORD EXTRACTION
      </div>
      {dataPoints.map((dp, i) => {
        const s = spring({ frame: frame - dp.delay, fps, config: { damping: 20, stiffness: 120 } });
        const x = interpolate(s, [0, 1], [30, 0]);
        const op = interpolate(s, [0, 1], [0, 1]);
        
        return (
          <div key={i} style={{
            fontFamily: "monospace", fontSize: 15, marginBottom: 6,
            opacity: op, transform: `translateX(${x}px)`,
            display: "flex", gap: 12,
          }}>
            <span style={{ color: "rgba(255,255,255,0.35)", width: 110 }}>{dp.label}</span>
            <span style={{ color: dp.highlight ? TEAL : "rgba(255,255,255,0.7)" }}>{dp.value}</span>
            {dp.highlight && <span style={{ color: TEAL, fontSize: 11, opacity: 0.6 }}>▲</span>}
          </div>
        );
      })}
    </div>
  );
};

// AI Analysis rings
const AnalysisRings = ({ frame, fps }: { frame: number; fps: number }) => {
  const ringScale1 = spring({ frame: frame - 60, fps, config: { damping: 15, stiffness: 40 } });
  const ringScale2 = spring({ frame: frame - 70, fps, config: { damping: 15, stiffness: 40 } });
  const ringScale3 = spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 40 } });
  
  const rotation = interpolate(frame, [60, 300], [0, 180]);
  const pulseOp = Math.sin(frame * 0.08) * 0.3 + 0.5;
  
  const cx = 420;
  const cy = 460;
  
  return (
    <>
      {[
        { scale: ringScale1, r: 160, op: 0.15 },
        { scale: ringScale2, r: 220, op: 0.1 },
        { scale: ringScale3, r: 280, op: 0.06 },
      ].map((ring, i) => (
        <div key={i} style={{
          position: "absolute",
          left: cx - ring.r, top: cy - ring.r,
          width: ring.r * 2, height: ring.r * 2,
          borderRadius: "50%",
          border: `1px solid ${TEAL}`,
          opacity: ring.op * ring.scale * pulseOp,
          transform: `scale(${ring.scale}) rotate(${rotation + i * 30}deg)`,
        }} />
      ))}
      
      {/* Scanning text */}
      {frame >= 60 && frame < 180 && (
        <div style={{
          position: "absolute", left: cx - 100, top: cy + 200,
          fontFamily: "monospace", fontSize: 12, letterSpacing: 6,
          color: TEAL,
          opacity: Math.floor(frame / 10) % 2 === 0 ? 0.8 : 0.3,
        }}>
          ANALYZING RISK PROFILE
        </div>
      )}
    </>
  );
};

// Screening results panel
const ScreeningResults = ({ frame, fps }: { frame: number; fps: number }) => {
  const screenings = [
    { name: "LOW-DOSE CT LUNG", urgency: "CRITICAL", color: "#FF4444", delay: 0 },
    { name: "COLORECTAL SCREENING", urgency: "HIGH", color: "#FFAA33", delay: 10 },
    { name: "HYPERTENSION MGMT", urgency: "MODERATE", color: TEAL, delay: 20 },
  ];
  
  return (
    <div style={{
      position: "absolute", left: 120, bottom: 120,
      opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
    }}>
      <div style={{
        fontFamily: "monospace", fontSize: 11, letterSpacing: 5,
        color: `${TEAL}88`, marginBottom: 14,
      }}>
        ELIGIBLE SCREENINGS IDENTIFIED
      </div>
      {screenings.map((s, i) => {
        const sp = spring({ frame: frame - s.delay, fps, config: { damping: 18 } });
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
            opacity: interpolate(sp, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(sp, [0, 1], [40, 0])}px)`,
          }}>
            <div style={{
              width: 3, height: 28, backgroundColor: s.color,
              opacity: i === 0 ? (Math.sin(frame * 0.12) * 0.4 + 0.6) : 0.5,
            }} />
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: "white", fontWeight: 300 }}>{s.name}</div>
              <div style={{
                fontFamily: "monospace", fontSize: 10, letterSpacing: 3,
                color: s.color, marginTop: 2,
              }}>{s.urgency}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Connection lines from body to data
const ConnectionLines = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [50, 80], [0, 0.15], { extrapolateRight: "clamp" });
  
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0, opacity: op }}>
      {/* Lines from patient chest area to right data panel */}
      <line x1="520" y1="350" x2="1100" y2="220" stroke={TEAL} strokeWidth="0.5" strokeDasharray="6 6" />
      <line x1="520" y1="380" x2="1100" y2="300" stroke={TEAL} strokeWidth="0.5" strokeDasharray="6 6" />
      <line x1="500" y1="420" x2="1100" y2="380" stroke={TEAL} strokeWidth="0.5" strokeDasharray="6 6" />
      
      {/* Particle dots along lines */}
      {[0, 1, 2].map((lineIdx) => {
        const t = ((frame * 2 + lineIdx * 40) % 200) / 200;
        const startX = 520;
        const startY = 350 + lineIdx * 35;
        const endX = 1100;
        const endY = 220 + lineIdx * 80;
        const px = startX + (endX - startX) * t;
        const py = startY + (endY - startY) * t;
        return (
          <circle key={lineIdx} cx={px} cy={py} r="2" fill={TEAL} opacity={0.6} />
        );
      })}
    </svg>
  );
};

// Floating particles
const Particles = ({ frame }: { frame: number }) => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 67 + 100) % 1920,
    y: (i * 43 + 200) % 1080,
    size: 1 + (i % 3),
    speed: 0.3 + (i % 5) * 0.15,
    phase: i * 0.7,
  }));
  
  return (
    <AbsoluteFill style={{ opacity: 0.15 }}>
      {particles.map((p, i) => {
        const y = (p.y + frame * p.speed) % 1100 - 10;
        const x = p.x + Math.sin(frame * 0.02 + p.phase) * 20;
        const op = interpolate(y, [0, 200, 900, 1080], [0, 1, 1, 0]);
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: p.size, height: p.size,
            borderRadius: "50%",
            backgroundColor: TEAL,
            opacity: op,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Top status bar
const StatusBar = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  
  return (
    <div style={{
      position: "absolute", top: 40, left: 60, right: 60,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      opacity: op * 0.5,
    }}>
      <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.4)" }}>
        MEDIENT CLINICAL INTELLIGENCE
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          SESSION: 0x4A2F
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: TEAL, opacity: 0.5 }}>
          ● LIVE
        </span>
      </div>
    </div>
  );
};

// Big result overlay at end
const ResultOverlay = ({ frame, fps }: { frame: number; fps: number }) => {
  const s = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const fadeOut = interpolate(frame, [80, 110], [1, 0], { extrapolateRight: "clamp" });
  
  return (
    <div style={{
      position: "absolute",
      right: 180, bottom: 350,
      opacity: s * fadeOut,
      transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
    }}>
      <div style={{
        fontFamily: "monospace", fontSize: 80, color: TEAL,
        fontWeight: 200, lineHeight: 1, letterSpacing: -3,
      }}>
        92%
      </div>
      <div style={{
        fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.5)",
        letterSpacing: 4, marginTop: 8,
      }}>
        EARLY DETECTION SURVIVAL
      </div>
    </div>
  );
};

export const HeroVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Loop-friendly fade
  const loopFadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const loopFadeOut = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: "clamp" });
  const masterOp = loopFadeIn * loopFadeOut;
  
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Background gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 50%, ${DARK} 0%, ${BG} 70%)`,
      }} />
      
      <div style={{ opacity: masterOp }}>
        <Grid />
        <Particles frame={frame} />
        <ScanLine />
        <StatusBar frame={frame} />
        
        {/* Patient figure — appears immediately */}
        <PatientFigure frame={frame} fps={fps} />
        
        {/* Analysis rings around patient */}
        <AnalysisRings frame={frame} fps={fps} />
        
        {/* Connection lines */}
        <ConnectionLines frame={frame} />
        
        {/* Data stream — right side */}
        <Sequence from={20}>
          <DataStream frame={frame - 20} fps={fps} />
        </Sequence>
        
        {/* Screening results — bottom left */}
        <Sequence from={160}>
          <ScreeningResults frame={frame - 160} fps={fps} />
        </Sequence>
        
        {/* Big 92% result */}
        <Sequence from={200}>
          <ResultOverlay frame={frame - 200} fps={fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

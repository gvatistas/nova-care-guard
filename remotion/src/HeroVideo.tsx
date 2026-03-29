import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const TEAL = "#4AEDC4";
const TEAL_DIM = "#2A8B73";
const BG = "#030303";
const WHITE = "#ffffff";
const AMBER = "#F5A623";
const BLUE = "#5B8DEF";
const RED = "#FF5555";
const LILAC = "#B8A9E8";
const DARK_TEAL = "#0D2B23";

/* ── Dense hex grid background ── */
const HexGrid = ({ frame }: { frame: number }) => {
  const drift = frame * 0.08;
  const hexSize = 30;
  const cols = 35;
  const rows = 22;
  return (
    <AbsoluteFill style={{ opacity: 0.04 }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const xOff = r % 2 === 0 ? 0 : hexSize * 0.866;
          const x = c * hexSize * 1.732 + xOff;
          const y = r * hexSize * 1.5 + drift;
          const pulse = Math.sin(frame * 0.02 + c * 0.3 + r * 0.5) * 0.5 + 0.5;
          return (
            <div key={`${r}-${c}`} style={{
              position: "absolute", left: x, top: y % 1200 - 50,
              width: hexSize, height: hexSize,
              border: `0.5px solid ${TEAL}`,
              opacity: pulse * 0.3 + 0.1,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }} />
          );
        })
      )}
    </AbsoluteFill>
  );
};

/* ── Radial scan rings around center ── */
const ScanSystem = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame: frame - 5, fps, config: { damping: 40, stiffness: 30 } });
  const cx = 960, cy = 440;

  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: appear }}>
      <defs>
        <radialGradient id="coreGlow">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.12" />
          <stop offset="40%" stopColor={TEAL} stopOpacity="0.03" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central glow */}
      <circle cx={cx} cy={cy} r={300} fill="url(#coreGlow)" />

      {/* Concentric scan rings */}
      {[80, 120, 170, 230, 300, 380].map((r, i) => {
        const speed = 0.3 + i * 0.15;
        const angle = frame * speed * (i % 2 === 0 ? 1 : -1);
        const dashLen = 4 + i * 2;
        const gapLen = 8 + i * 4;
        const op = interpolate(i, [0, 5], [0.35, 0.08]);
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={TEAL} strokeWidth={i < 2 ? 0.8 : 0.4}
            opacity={op} strokeDasharray={`${dashLen} ${gapLen}`}
            transform={`rotate(${angle}, ${cx}, ${cy})`} />
        );
      })}

      {/* Crosshair lines */}
      {[0, 45, 90, 135].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = 350;
        const x1 = cx + Math.cos(rad) * 60;
        const y1 = cy + Math.sin(rad) * 60;
        const x2 = cx + Math.cos(rad) * len;
        const y2 = cy + Math.sin(rad) * len;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={TEAL} strokeWidth="0.3" opacity={0.12}
            strokeDasharray="1 6" />
        );
      })}

      {/* Rotating sweep arm */}
      {(() => {
        const sweepAngle = (frame * 1.2) % 360;
        const rad = (sweepAngle * Math.PI) / 180;
        const len = 350;
        return (
          <line x1={cx} y1={cy}
            x2={cx + Math.cos(rad) * len} y2={cy + Math.sin(rad) * len}
            stroke={TEAL} strokeWidth="1" opacity={0.15} />
        );
      })()}

      {/* Sweep trail */}
      {Array.from({ length: 20 }).map((_, i) => {
        const sweepAngle = ((frame * 1.2) - i * 2) % 360;
        const rad = (sweepAngle * Math.PI) / 180;
        const r = 100 + i * 12;
        return (
          <circle key={`trail${i}`}
            cx={cx + Math.cos(rad) * r} cy={cy + Math.sin(rad) * r}
            r="1.5" fill={TEAL} opacity={0.15 - i * 0.007} />
        );
      })}
    </svg>
  );
};

/* ── Holographic patient body — detailed wireframe ── */
const HoloPatient = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame, fps, config: { damping: 25, stiffness: 40 } });
  const breathe = Math.sin(frame * 0.035) * 2;
  const cx = 960, cy = 430;
  const scale = 2.2;

  // Detailed body contour — organic curves
  const bodyPath = `
    M ${cx} ${cy - 85 * scale + breathe}
    C ${cx - 18 * scale} ${cy - 85 * scale + breathe},
      ${cx - 22 * scale} ${cy - 70 * scale + breathe},
      ${cx - 20 * scale} ${cy - 55 * scale + breathe}
    L ${cx - 30 * scale} ${cy - 40 * scale + breathe}
    C ${cx - 42 * scale} ${cy - 35 * scale + breathe},
      ${cx - 45 * scale} ${cy - 25 * scale + breathe},
      ${cx - 40 * scale} ${cy - 15 * scale + breathe}
    L ${cx - 30 * scale} ${cy + breathe}
    L ${cx - 22 * scale} ${cy + 25 * scale + breathe}
    L ${cx - 18 * scale} ${cy + 45 * scale + breathe}
    L ${cx - 20 * scale} ${cy + 65 * scale + breathe}
    L ${cx - 10 * scale} ${cy + 65 * scale + breathe}
    L ${cx - 5 * scale} ${cy + 30 * scale + breathe}
    L ${cx} ${cy + 25 * scale + breathe}
    L ${cx + 5 * scale} ${cy + 30 * scale + breathe}
    L ${cx + 10 * scale} ${cy + 65 * scale + breathe}
    L ${cx + 20 * scale} ${cy + 65 * scale + breathe}
    L ${cx + 18 * scale} ${cy + 45 * scale + breathe}
    L ${cx + 22 * scale} ${cy + 25 * scale + breathe}
    L ${cx + 30 * scale} ${cy + breathe}
    L ${cx + 40 * scale} ${cy - 15 * scale + breathe}
    C ${cx + 45 * scale} ${cy - 25 * scale + breathe},
      ${cx + 42 * scale} ${cy - 35 * scale + breathe},
      ${cx + 30 * scale} ${cy - 40 * scale + breathe}
    L ${cx + 20 * scale} ${cy - 55 * scale + breathe}
    C ${cx + 22 * scale} ${cy - 70 * scale + breathe},
      ${cx + 18 * scale} ${cy - 85 * scale + breathe},
      ${cx} ${cy - 85 * scale + breathe}
    Z
  `;

  // Cross-section scan lines
  const scanLines = Array.from({ length: 16 }, (_, i) => {
    const y = cy + (-75 + i * 10) * scale + breathe;
    const progress = interpolate(frame, [10 + i * 2, 25 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const width = 15 + Math.sin(i * 0.8) * 8;
    return { y, progress, width: width * scale };
  });

  // Data nodes on body
  const dataNodes = [
    { x: -5, y: -70, label: "NEUROLOGICAL", color: BLUE, delay: 30 },
    { x: -18, y: -35, label: "RESPIRATORY", color: RED, delay: 38 },
    { x: 18, y: -35, label: "CARDIOVASCULAR", color: RED, delay: 42 },
    { x: -12, y: -10, label: "HEPATIC", color: AMBER, delay: 48 },
    { x: 12, y: 5, label: "RENAL", color: LILAC, delay: 52 },
    { x: 0, y: 15, label: "GI TRACT", color: AMBER, delay: 56 },
    { x: -8, y: -50, label: "THYROID", color: TEAL, delay: 60 },
  ];

  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: appear }}>
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.06" />
          <stop offset="50%" stopColor={TEAL} stopOpacity="0.02" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.04" />
        </linearGradient>
        <filter id="holoGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Body fill */}
      <path d={bodyPath} fill="url(#bodyGrad)" stroke={TEAL} strokeWidth="0.8" opacity={0.5} />

      {/* Internal wireframe mesh */}
      <path d={bodyPath} fill="none" stroke={TEAL} strokeWidth="0.3" opacity={0.15}
        strokeDasharray="2 4" />

      {/* Cross-section scan lines */}
      {scanLines.map((sl, i) => (
        <line key={`scan${i}`}
          x1={cx - sl.width * sl.progress} y1={sl.y}
          x2={cx + sl.width * sl.progress} y2={sl.y}
          stroke={TEAL} strokeWidth="0.5"
          opacity={0.2 + Math.sin(frame * 0.05 + i) * 0.1} />
      ))}

      {/* Spine line */}
      <line x1={cx} y1={cy - 80 * scale + breathe} x2={cx} y2={cy + 25 * scale + breathe}
        stroke={TEAL} strokeWidth="0.4" opacity="0.2" strokeDasharray="3 5" />

      {/* Rib cage hints */}
      {[-30, -20, -10].map((yOff, i) => (
        <g key={`rib${i}`}>
          <path d={`M ${cx} ${cy + yOff * scale + breathe} Q ${cx - 25 * scale} ${cy + (yOff - 5) * scale + breathe} ${cx - 30 * scale} ${cy + yOff * scale + breathe}`}
            fill="none" stroke={TEAL} strokeWidth="0.3" opacity="0.12" />
          <path d={`M ${cx} ${cy + yOff * scale + breathe} Q ${cx + 25 * scale} ${cy + (yOff - 5) * scale + breathe} ${cx + 30 * scale} ${cy + yOff * scale + breathe}`}
            fill="none" stroke={TEAL} strokeWidth="0.3" opacity="0.12" />
        </g>
      ))}

      {/* Data analysis nodes */}
      {dataNodes.map((node, i) => {
        const nodeAppear = interpolate(frame, [node.delay, node.delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pulse = 0.5 + Math.sin(frame * 0.06 + i * 1.2) * 0.5;
        const nx = cx + node.x * scale;
        const ny = cy + node.y * scale + breathe;
        // Connector line going outward
        const outX = node.x < 0 ? nx - 80 : nx + 80;
        const outY = ny - 5;
        return (
          <g key={i} opacity={nodeAppear}>
            {/* Highlight zone */}
            <circle cx={nx} cy={ny} r={12} fill={node.color} opacity={0.06 * pulse} />
            <circle cx={nx} cy={ny} r={6} fill={node.color} opacity={0.15 * pulse} />
            <circle cx={nx} cy={ny} r={2.5} fill={node.color} opacity={0.8} />

            {/* Connector line */}
            <line x1={nx} y1={ny} x2={outX} y2={outY}
              stroke={node.color} strokeWidth="0.5" opacity={0.3}
              strokeDasharray="2 3" />

            {/* Label */}
            <text x={outX + (node.x < 0 ? -5 : 5)} y={outY + 3}
              textAnchor={node.x < 0 ? "end" : "start"}
              fontFamily="monospace" fontSize="8" fill={node.color}
              letterSpacing="2" opacity={0.7}>
              {node.label}
            </text>

            {/* Mini status */}
            <text x={outX + (node.x < 0 ? -5 : 5)} y={outY + 14}
              textAnchor={node.x < 0 ? "end" : "start"}
              fontFamily="monospace" fontSize="6" fill={`${WHITE}44`}
              letterSpacing="1.5">
              {i < 3 ? "SCANNING..." : "ANALYZED"}
            </text>
          </g>
        );
      })}

      {/* Patient ID */}
      <text x={cx} y={cy + 72 * scale + breathe} textAnchor="middle"
        fontFamily="monospace" fontSize="11" fill={`${WHITE}55`} letterSpacing="4">
        PATIENT_0xA7F2 — SARAH MITCHELL, 52
      </text>
    </svg>
  );
};

/* ── Streaming data feeds — left and right panels ── */
const DataFeeds = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame, fps, config: { damping: 30, stiffness: 50 } });

  const leftFeeds = [
    { label: "EHR EPIC FHIR", value: "INGESTING", color: BLUE },
    { label: "LAB HL7v2.5", value: "12 RESULTS", color: LILAC },
    { label: "RADIOLOGY DICOM", value: "3 STUDIES", color: AMBER },
    { label: "PHARMACY NCPDP", value: "8 ACTIVE Rx", color: TEAL },
    { label: "GENOMIC VCF", value: "BRCA1 VARIANT", color: RED },
    { label: "VITAL SIGNS", value: "BP 142/88", color: AMBER },
    { label: "SOCIAL HXDX", value: "SMOKING 20PY", color: RED },
    { label: "CLAIMS X12", value: "24 ENCOUNTERS", color: BLUE },
  ];

  const rightResults = [
    { label: "LDCT LUNG SCREENING", priority: "CRITICAL", color: RED, delay: 8 },
    { label: "COLONOSCOPY", priority: "HIGH", color: AMBER, delay: 16 },
    { label: "HYPERTENSION MGMT", priority: "MODERATE", color: BLUE, delay: 24 },
    { label: "HBA1C MONITORING", priority: "MODERATE", color: AMBER, delay: 32 },
    { label: "MAMMOGRAPHY", priority: "ROUTINE", color: TEAL, delay: 40 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: appear }}>
      {/* Left panel — data sources */}
      <div style={{ position: "absolute", left: 40, top: 120, width: 260 }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 4, color: `${WHITE}44`, marginBottom: 12 }}>
          DATA SOURCES — LIVE
        </div>
        {leftFeeds.map((feed, i) => {
          const feedAppear = interpolate(frame, [5 + i * 4, 12 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const streamPulse = 0.4 + Math.sin(frame * 0.08 + i * 0.7) * 0.3;
          return (
            <div key={i} style={{
              opacity: feedAppear,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "5px 0", borderBottom: `0.5px solid ${WHITE}0A`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 4, height: 4, backgroundColor: feed.color, opacity: streamPulse }} />
                <span style={{ fontFamily: "monospace", fontSize: 9, color: `${WHITE}66`, letterSpacing: 1.5 }}>{feed.label}</span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 8, color: feed.color, opacity: 0.7, letterSpacing: 1 }}>{feed.value}</span>
            </div>
          );
        })}

        {/* Stream animation — data flowing right */}
        <svg width="260" height="40" style={{ marginTop: 8 }}>
          {Array.from({ length: 15 }).map((_, i) => {
            const x = ((frame * 2 + i * 18) % 280) - 10;
            const op = x > 20 && x < 240 ? 0.3 : 0;
            return (
              <rect key={i} x={x} y={16} width={8 + (i % 3) * 4} height={2}
                fill={TEAL} opacity={op} rx="1" />
            );
          })}
          <text x="130" y="38" textAnchor="middle" fontFamily="monospace" fontSize="7"
            fill={`${WHITE}33`} letterSpacing="3">STREAMING TO ENGINE</text>
        </svg>
      </div>

      {/* Right panel — screening results */}
      <div style={{ position: "absolute", right: 40, top: 120, width: 280 }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 4, color: `${WHITE}44`, marginBottom: 12 }}>
          ELIGIBLE SCREENINGS — PRIORITIZED
        </div>
        {rightResults.map((result, i) => {
          const resultAppear = interpolate(frame, [result.delay, result.delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const slideX = interpolate(resultAppear, [0, 1], [20, 0]);
          return (
            <div key={i} style={{
              opacity: resultAppear,
              transform: `translateX(${slideX}px)`,
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px", marginBottom: 4,
              borderLeft: `2px solid ${result.color}`,
              background: `linear-gradient(90deg, ${result.color}08, transparent)`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: WHITE, fontWeight: 300, letterSpacing: 0.5 }}>
                  {result.label}
                </div>
              </div>
              <span style={{
                fontFamily: "monospace", fontSize: 7, letterSpacing: 2,
                color: result.color, padding: "2px 5px",
                border: `0.5px solid ${result.color}44`,
                background: `${result.color}11`,
              }}>
                {result.priority}
              </span>
            </div>
          );
        })}

        {/* Score */}
        <div style={{
          marginTop: 12, padding: "10px 12px",
          border: `0.5px solid ${TEAL}33`,
          background: `${TEAL}08`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: `${WHITE}55`, letterSpacing: 2 }}>IDENTIFIED</span>
          <span style={{ fontFamily: "monospace", fontSize: 22, color: TEAL, fontWeight: 200 }}>
            {Math.min(5, Math.floor(interpolate(frame, [8, 48], [0, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))}
            <span style={{ fontSize: 12, color: `${WHITE}44` }}> / 5</span>
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Floating data particles connecting sources to patient ── */
const DataStreams = ({ frame }: { frame: number }) => {
  const streams = [
    { sx: 300, sy: 200, color: BLUE },
    { sx: 300, sy: 400, color: LILAC },
    { sx: 300, sy: 600, color: AMBER },
    { sx: 300, sy: 800, color: RED },
    { sx: 1620, sy: 200, color: TEAL },
    { sx: 1620, sy: 400, color: BLUE },
    { sx: 1620, sy: 600, color: AMBER },
    { sx: 1620, sy: 800, color: LILAC },
  ];
  const cx = 960, cy = 440;

  return (
    <svg width="1920" height="1080" style={{ position: "absolute" }}>
      {streams.map((s, si) => {
        const particles = Array.from({ length: 6 }, (_, pi) => {
          const t = ((frame * 0.015 + pi * 0.16 + si * 0.1) % 1);
          const x = s.sx + (cx - s.sx) * t;
          const y = s.sy + (cy - s.sy) * t;
          const op = t > 0.05 && t < 0.95 ? 0.4 * (1 - Math.abs(t - 0.5) * 2) : 0;
          return { x, y, op };
        });

        return (
          <g key={si}>
            {/* Faint connection line */}
            <line x1={s.sx} y1={s.sy} x2={cx} y2={cy}
              stroke={s.color} strokeWidth="0.3" opacity="0.04" />
            {/* Particles */}
            {particles.map((p, pi) => (
              <circle key={pi} cx={p.x} cy={p.y} r="1.5" fill={s.color} opacity={p.op} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/* ── Status HUD — top bar ── */
const StatusHUD = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const processingPct = Math.min(100, Math.floor(interpolate(frame, [15, 200], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: op }}>
      {/* Top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 40px",
        borderBottom: `0.5px solid ${WHITE}08`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 5, color: `${WHITE}44` }}>MEDIENT</span>
          <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 3, color: `${WHITE}22` }}>CLINICAL ENGINE v4.2.1</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: `${WHITE}22`, letterSpacing: 2 }}>SESSION 0x4A2F</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: TEAL, opacity: 0.6 }}>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: TEAL, opacity: 0.5, letterSpacing: 2 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Processing bar */}
      <div style={{ height: 1, background: `${WHITE}06`, position: "relative" }}>
        <div style={{
          height: 1, backgroundColor: TEAL, opacity: 0.4,
          width: `${processingPct}%`,
          transition: "width 0.1s linear",
        }} />
      </div>

      {/* Bottom status */}
      <div style={{
        position: "absolute", bottom: 30, left: 40, right: 40,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 30 }}>
          {["FHIR R4", "HL7v2", "DICOM", "NCPDP"].map((proto, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 3, height: 3, backgroundColor: TEAL, opacity: 0.3 + Math.sin(frame * 0.1 + i) * 0.2 }} />
              <span style={{ fontFamily: "monospace", fontSize: 8, color: `${WHITE}33`, letterSpacing: 2 }}>{proto}</span>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: `${WHITE}22`, letterSpacing: 2 }}>
          LATENCY: 0.{Math.floor(Math.sin(frame * 0.1) * 3 + 3)}ms
        </span>
      </div>
    </div>
  );
};

/* ── Big stat reveal — dramatic ── */
const StatReveal = ({ frame, fps }: { frame: number; fps: number }) => {
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 50 } });
  const fo = interpolate(frame, [55, 75], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: s * fo,
    }}>
      <div style={{
        fontFamily: "monospace", fontSize: 160, color: WHITE, fontWeight: 100,
        lineHeight: 1, letterSpacing: -5,
      }}>
        5
        <span style={{ fontSize: 50, color: TEAL, letterSpacing: 2, marginLeft: 15 }}>critical</span>
      </div>
      <div style={{
        fontFamily: "monospace", fontSize: 16, color: `${WHITE}44`,
        letterSpacing: 8, marginTop: 20,
      }}>
        SCREENINGS IDENTIFIED IN 0.3 SECONDS
      </div>
      <div style={{
        width: 120, height: 1, backgroundColor: TEAL, opacity: 0.3, marginTop: 20,
      }} />
    </div>
  );
};

/* ── Crown logo watermark ── */
const CrownWatermark = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame, fps, config: { damping: 50, stiffness: 30 } });
  const cx = 960, cy = 430;
  const s = 3.5;

  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: appear * 0.06 }}>
      <g transform={`translate(${cx}, ${cy}) scale(${s})`}>
        <path d="M-40,30 L-25,-15 L-15,10 L-8,-30 L0,-45 L8,-30 L15,10 L25,-15 L40,30 Z"
          fill="none" stroke={TEAL} strokeWidth="0.8" />
        <line x1="-40" y1="30" x2="40" y2="30" stroke={TEAL} strokeWidth="0.4" />
      </g>
    </svg>
  );
};

/* ── Main composition ── */
export const HeroVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [278, 298], [1, 0], { extrapolateRight: "clamp" });
  const masterOp = fadeIn * fadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Subtle radial background */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse at 50% 40%, ${DARK_TEAL}, transparent 60%),
          radial-gradient(ellipse at 20% 80%, #0a0a1a, transparent 50%),
          radial-gradient(ellipse at 80% 20%, #0a1a0a, transparent 50%)
        `,
      }} />

      <div style={{ opacity: masterOp }}>
        <HexGrid frame={frame} />
        <CrownWatermark frame={frame} fps={fps} />
        <StatusHUD frame={frame} />

        {/* Scan system — always present */}
        <Sequence from={3}>
          <ScanSystem frame={frame - 3} fps={fps} />
        </Sequence>

        {/* Data streams flowing */}
        <Sequence from={10}>
          <DataStreams frame={frame - 10} />
        </Sequence>

        {/* Holographic patient */}
        <Sequence from={8}>
          <HoloPatient frame={frame - 8} fps={fps} />
        </Sequence>

        {/* Data feeds — left and right panels */}
        <Sequence from={15}>
          <DataFeeds frame={frame - 15} fps={fps} />
        </Sequence>

        {/* Big stat reveal */}
        <Sequence from={220}>
          <StatReveal frame={frame - 220} fps={fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

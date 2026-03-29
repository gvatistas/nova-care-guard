import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const TEAL = "#4AEDC4";
const TEAL_DIM = "#2A8B73";
const BG = "#030303";
const WHITE = "#ffffff";
const AMBER = "#F5A623";
const BLUE = "#5B8DEF";
const RED = "#FF4444";
const LILAC = "#B8A9E8";
const DARK_TEAL = "#0D2B23";
const GREEN = "#4AED7C";

/* ── Subtle hex grid background ── */
const HexGrid = ({ frame }: { frame: number }) => {
  const drift = frame * 0.05;
  const hexSize = 35;
  const cols = 30;
  const rows = 18;
  return (
    <AbsoluteFill style={{ opacity: 0.035 }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const xOff = r % 2 === 0 ? 0 : hexSize * 0.866;
          const x = c * hexSize * 1.732 + xOff;
          const y = r * hexSize * 1.5 + drift;
          const pulse = Math.sin(frame * 0.015 + c * 0.3 + r * 0.5) * 0.5 + 0.5;
          return (
            <div key={`${r}-${c}`} style={{
              position: "absolute", left: x, top: y % 1200 - 50,
              width: hexSize, height: hexSize,
              border: `0.5px solid ${TEAL}`,
              opacity: pulse * 0.25 + 0.05,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }} />
          );
        })
      )}
    </AbsoluteFill>
  );
};

/* ── 3D Patient Model — realistic anatomical silhouette with depth ── */
const Patient3D = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame, fps, config: { damping: 20, stiffness: 30 } });
  const breathe = Math.sin(frame * 0.03) * 3;
  const cx = 960, cy = 460;

  // 3D rotation effect
  const rotateY = Math.sin(frame * 0.008) * 3;

  // Realistic human body silhouette — front view, anatomically proportioned
  const headPath = `
    M ${cx - 28} ${cy - 215 + breathe}
    C ${cx - 28} ${cy - 260 + breathe}, ${cx - 22} ${cy - 280 + breathe}, ${cx} ${cy - 282 + breathe}
    C ${cx + 22} ${cy - 280 + breathe}, ${cx + 28} ${cy - 260 + breathe}, ${cx + 28} ${cy - 215 + breathe}
    C ${cx + 30} ${cy - 200 + breathe}, ${cx + 18} ${cy - 195 + breathe}, ${cx} ${cy - 195 + breathe}
    C ${cx - 18} ${cy - 195 + breathe}, ${cx - 30} ${cy - 200 + breathe}, ${cx - 28} ${cy - 215 + breathe}
    Z
  `;

  // Neck
  const neckPath = `
    M ${cx - 12} ${cy - 195 + breathe}
    L ${cx - 14} ${cy - 175 + breathe}
    L ${cx + 14} ${cy - 175 + breathe}
    L ${cx + 12} ${cy - 195 + breathe}
  `;

  // Torso — broad shoulders tapering to waist
  const torsoPath = `
    M ${cx - 14} ${cy - 175 + breathe}
    C ${cx - 60} ${cy - 170 + breathe}, ${cx - 90} ${cy - 155 + breathe}, ${cx - 95} ${cy - 140 + breathe}
    L ${cx - 90} ${cy - 60 + breathe}
    C ${cx - 85} ${cy - 20 + breathe}, ${cx - 70} ${cy + 10 + breathe}, ${cx - 55} ${cy + 30 + breathe}
    L ${cx - 45} ${cy + 50 + breathe}
    L ${cx + 45} ${cy + 50 + breathe}
    L ${cx + 55} ${cy + 30 + breathe}
    C ${cx + 70} ${cy + 10 + breathe}, ${cx + 85} ${cy - 20 + breathe}, ${cx + 90} ${cy - 60 + breathe}
    L ${cx + 95} ${cy - 140 + breathe}
    C ${cx + 90} ${cy - 155 + breathe}, ${cx + 60} ${cy - 170 + breathe}, ${cx + 14} ${cy - 175 + breathe}
  `;

  // Left arm
  const leftArmPath = `
    M ${cx - 95} ${cy - 140 + breathe}
    C ${cx - 110} ${cy - 130 + breathe}, ${cx - 120} ${cy - 100 + breathe}, ${cx - 125} ${cy - 50 + breathe}
    L ${cx - 130} ${cy + 10 + breathe}
    L ${cx - 128} ${cy + 60 + breathe}
    L ${cx - 118} ${cy + 65 + breathe}
    L ${cx - 112} ${cy + 15 + breathe}
    L ${cx - 108} ${cy - 45 + breathe}
    C ${cx - 105} ${cy - 85 + breathe}, ${cx - 100} ${cy - 115 + breathe}, ${cx - 90} ${cy - 130 + breathe}
  `;

  // Right arm
  const rightArmPath = `
    M ${cx + 95} ${cy - 140 + breathe}
    C ${cx + 110} ${cy - 130 + breathe}, ${cx + 120} ${cy - 100 + breathe}, ${cx + 125} ${cy - 50 + breathe}
    L ${cx + 130} ${cy + 10 + breathe}
    L ${cx + 128} ${cy + 60 + breathe}
    L ${cx + 118} ${cy + 65 + breathe}
    L ${cx + 112} ${cy + 15 + breathe}
    L ${cx + 108} ${cy - 45 + breathe}
    C ${cx + 105} ${cy - 85 + breathe}, ${cx + 100} ${cy - 115 + breathe}, ${cx + 90} ${cy - 130 + breathe}
  `;

  // Left leg
  const leftLegPath = `
    M ${cx - 45} ${cy + 50 + breathe}
    L ${cx - 48} ${cy + 100 + breathe}
    L ${cx - 50} ${cy + 180 + breathe}
    L ${cx - 52} ${cy + 260 + breathe}
    L ${cx - 58} ${cy + 275 + breathe}
    L ${cx - 32} ${cy + 275 + breathe}
    L ${cx - 30} ${cy + 260 + breathe}
    L ${cx - 28} ${cy + 180 + breathe}
    L ${cx - 25} ${cy + 100 + breathe}
    L ${cx - 10} ${cy + 50 + breathe}
  `;

  // Right leg
  const rightLegPath = `
    M ${cx + 10} ${cy + 50 + breathe}
    L ${cx + 25} ${cy + 100 + breathe}
    L ${cx + 28} ${cy + 180 + breathe}
    L ${cx + 30} ${cy + 260 + breathe}
    L ${cx + 32} ${cy + 275 + breathe}
    L ${cx + 58} ${cy + 275 + breathe}
    L ${cx + 52} ${cy + 260 + breathe}
    L ${cx + 50} ${cy + 180 + breathe}
    L ${cx + 48} ${cy + 100 + breathe}
    L ${cx + 45} ${cy + 50 + breathe}
  `;

  // Horizontal scan lines moving down the body
  const scanY = interpolate(frame % 120, [0, 120], [cy - 290, cy + 280]);
  const scanY2 = interpolate((frame + 60) % 120, [0, 120], [cy - 290, cy + 280]);

  // Internal organ outlines for 3D depth
  const organs = [
    // Heart
    { path: `M ${cx - 8} ${cy - 110 + breathe} C ${cx - 20} ${cy - 125 + breathe}, ${cx - 25} ${cy - 100 + breathe}, ${cx - 8} ${cy - 85 + breathe} C ${cx + 10} ${cy - 100 + breathe}, ${cx + 5} ${cy - 125 + breathe}, ${cx - 8} ${cy - 110 + breathe}`, color: RED },
    // Lungs left
    { path: `M ${cx - 50} ${cy - 140 + breathe} C ${cx - 65} ${cy - 120 + breathe}, ${cx - 65} ${cy - 70 + breathe}, ${cx - 30} ${cy - 65 + breathe} L ${cx - 20} ${cy - 130 + breathe} Z`, color: BLUE },
    // Lungs right
    { path: `M ${cx + 50} ${cy - 140 + breathe} C ${cx + 65} ${cy - 120 + breathe}, ${cx + 65} ${cy - 70 + breathe}, ${cx + 30} ${cy - 65 + breathe} L ${cx + 20} ${cy - 130 + breathe} Z`, color: BLUE },
    // Liver
    { path: `M ${cx + 10} ${cy - 50 + breathe} C ${cx + 50} ${cy - 55 + breathe}, ${cx + 60} ${cy - 30 + breathe}, ${cx + 40} ${cy - 15 + breathe} L ${cx + 5} ${cy - 20 + breathe} Z`, color: AMBER },
    // Kidneys
    { path: `M ${cx - 35} ${cy - 25 + breathe} C ${cx - 45} ${cy - 35 + breathe}, ${cx - 45} ${cy - 5 + breathe}, ${cx - 35} ${cy + 5 + breathe} C ${cx - 25} ${cy - 5 + breathe}, ${cx - 25} ${cy - 35 + breathe}, ${cx - 35} ${cy - 25 + breathe}`, color: LILAC },
  ];

  // Wireframe grid lines for 3D effect
  const gridLines = Array.from({ length: 24 }, (_, i) => {
    const y = cy - 280 + i * 24 + breathe;
    const bodyWidth = i < 4 ? 25 + i * 8 : i < 8 ? 55 + (i - 4) * 10 : i < 14 ? 95 - (i - 8) * 4 : i < 18 ? 50 - (i - 14) * 3 : 40;
    return { y, width: bodyWidth };
  });

  return (
    <svg width="1920" height="1080" style={{
      position: "absolute",
      opacity: appear,
      transform: `perspective(1200px) rotateY(${rotateY}deg)`,
    }}>
      <defs>
        <linearGradient id="bodyGlow3D" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.15" />
          <stop offset="30%" stopColor={TEAL} stopOpacity="0.06" />
          <stop offset="70%" stopColor={TEAL} stopOpacity="0.03" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="bodyEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.7" />
          <stop offset="30%" stopColor={TEAL} stopOpacity="0.15" />
          <stop offset="70%" stopColor={TEAL} stopOpacity="0.15" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.7" />
        </linearGradient>
        <filter id="glow3d">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="bodyClip">
          <path d={headPath} />
          <path d={neckPath} />
          <path d={torsoPath} />
          <path d={leftArmPath} />
          <path d={rightArmPath} />
          <path d={leftLegPath} />
          <path d={rightLegPath} />
        </clipPath>
      </defs>

      {/* Outer glow aura */}
      <g filter="url(#softGlow)" opacity={0.3}>
        <path d={torsoPath} fill="none" stroke={TEAL} strokeWidth="3" />
        <path d={headPath} fill="none" stroke={TEAL} strokeWidth="3" />
      </g>

      {/* Body parts — filled with gradient for 3D depth */}
      {[headPath, neckPath, torsoPath, leftArmPath, rightArmPath, leftLegPath, rightLegPath].map((p, i) => (
        <g key={i}>
          <path d={p} fill="url(#bodyGlow3D)" stroke={TEAL} strokeWidth="1.2" opacity={0.6} />
          <path d={p} fill="none" stroke="url(#bodyEdge)" strokeWidth="0.5" opacity={0.4} />
        </g>
      ))}

      {/* 3D wireframe grid across body */}
      <g clipPath="url(#bodyClip)">
        {gridLines.map((gl, i) => {
          const scanProximity = Math.max(0, 1 - Math.abs(gl.y - scanY) / 40);
          return (
            <line key={i}
              x1={cx - gl.width} y1={gl.y} x2={cx + gl.width} y2={gl.y}
              stroke={TEAL} strokeWidth={0.3 + scanProximity * 1.5}
              opacity={0.08 + scanProximity * 0.4}
            />
          );
        })}
        {/* Vertical lines for mesh */}
        {Array.from({ length: 8 }, (_, i) => {
          const xOff = (i - 3.5) * 22;
          return (
            <line key={`v${i}`}
              x1={cx + xOff} y1={cy - 280 + breathe} x2={cx + xOff} y2={cy + 275 + breathe}
              stroke={TEAL} strokeWidth="0.2" opacity="0.06"
            />
          );
        })}
      </g>

      {/* Scan line — bright horizontal sweep */}
      <line x1={cx - 150} y1={scanY} x2={cx + 150} y2={scanY}
        stroke={TEAL} strokeWidth="2" opacity={0.5} filter="url(#glow3d)" />
      <line x1={cx - 120} y1={scanY2} x2={cx + 120} y2={scanY2}
        stroke={TEAL} strokeWidth="1" opacity={0.25} />

      {/* Internal organs — semi-transparent for depth */}
      {organs.map((organ, i) => {
        const organPulse = 0.3 + Math.sin(frame * 0.04 + i * 1.5) * 0.15;
        return (
          <g key={`organ${i}`}>
            <path d={organ.path} fill={organ.color} opacity={organPulse * 0.12} />
            <path d={organ.path} fill="none" stroke={organ.color} strokeWidth="0.8" opacity={organPulse} />
          </g>
        );
      })}

      {/* Spine — 3D vertebrae dots */}
      {Array.from({ length: 18 }, (_, i) => {
        const vy = cy - 170 + i * 25 + breathe;
        if (vy > cy + 50) return null;
        return (
          <g key={`vert${i}`}>
            <circle cx={cx} cy={vy} r="2.5" fill={TEAL} opacity={0.15} />
            <circle cx={cx} cy={vy} r="1" fill={TEAL} opacity={0.4} />
          </g>
        );
      })}

      {/* Patient ID */}
      <text x={cx} y={cy + 310} textAnchor="middle"
        fontFamily="monospace" fontSize="11" fill={`${WHITE}44`} letterSpacing="4">
        SUBJECT_A7F2 — FULL BODY SCAN
      </text>
    </svg>
  );
};

/* ── Alert system — red alerts that pop up then get remedied green ── */
const AlertSystem = ({ frame, fps }: { frame: number; fps: number }) => {
  const cx = 960;

  const alerts = [
    { label: "LUNG CANCER SCREENING", detail: "LDCT overdue — 20 pack-year history", x: -320, y: 200, delay: 25, remedyDelay: 130 },
    { label: "COLORECTAL SCREENING", detail: "Colonoscopy — age 52, no record", x: 320, y: 250, delay: 40, remedyDelay: 145 },
    { label: "CARDIOVASCULAR RISK", detail: "BP 142/88 — statin evaluation needed", x: -310, y: 350, delay: 55, remedyDelay: 155 },
    { label: "DIABETES MONITORING", detail: "HbA1c — last check 14 months ago", x: 310, y: 310, delay: 65, remedyDelay: 165 },
    { label: "BREAST CANCER SCREENING", detail: "Mammography — biennial, overdue", x: -300, y: 500, delay: 80, remedyDelay: 175 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {alerts.map((alert, i) => {
        // Alert appears
        const alertAppear = spring({ frame: frame - alert.delay, fps, config: { damping: 12, stiffness: 200 } });
        // Remedy transition
        const remedying = interpolate(frame, [alert.remedyDelay, alert.remedyDelay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const isRemedied = remedying > 0.5;

        const borderColor = isRemedied ? GREEN : RED;
        const bgColor = isRemedied ? `${GREEN}12` : `${RED}12`;
        const iconColor = isRemedied ? GREEN : RED;
        const statusText = isRemedied ? "RESOLVED" : "ALERT";
        const shake = !isRemedied && alertAppear > 0.9 ? Math.sin(frame * 0.5 + i * 2) * 1.5 : 0;
        const pulse = !isRemedied ? 0.7 + Math.sin(frame * 0.15 + i) * 0.3 : 1;

        // Connector line from alert to body center
        const alertX = cx + alert.x;
        const alertY = alert.y;
        const bodyEdgeX = cx + (alert.x < 0 ? -100 : 100);

        if (alertAppear <= 0) return null;

        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: alertAppear }}>
            {/* Connector line */}
            <svg width="1920" height="1080" style={{ position: "absolute" }}>
              <line x1={alertX + (alert.x < 0 ? 200 : -10)} y1={alertY + 20}
                x2={bodyEdgeX} y2={alertY}
                stroke={borderColor} strokeWidth="0.8" opacity={0.3}
                strokeDasharray="4 4" />
              <circle cx={bodyEdgeX} cy={alertY} r="4" fill={borderColor} opacity={0.5}>
                {!isRemedied && (
                  <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
                )}
              </circle>
            </svg>

            {/* Alert card */}
            <div style={{
              position: "absolute",
              left: alert.x < 0 ? alertX - 10 : alertX - 180,
              top: alertY,
              width: 210,
              padding: "10px 14px",
              background: bgColor,
              border: `1px solid ${borderColor}44`,
              borderLeft: `3px solid ${borderColor}`,
              transform: `translateX(${shake}px)`,
              opacity: pulse,
            }}>
              {/* Status badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6, marginBottom: 5,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: iconColor,
                  opacity: isRemedied ? 0.8 : 0.6 + Math.sin(frame * 0.2) * 0.4,
                  boxShadow: isRemedied ? `0 0 8px ${GREEN}66` : `0 0 8px ${RED}66`,
                }} />
                <span style={{
                  fontFamily: "monospace", fontSize: 8, letterSpacing: 3,
                  color: iconColor,
                }}>
                  {statusText}
                </span>
                {isRemedied && (
                  <span style={{
                    fontFamily: "monospace", fontSize: 7, letterSpacing: 2,
                    color: GREEN, opacity: 0.6, marginLeft: "auto",
                  }}>✓ ORDERED</span>
                )}
              </div>

              <div style={{
                fontFamily: "monospace", fontSize: 10, color: WHITE,
                fontWeight: 500, letterSpacing: 0.8, lineHeight: 1.3,
              }}>
                {alert.label}
              </div>
              <div style={{
                fontFamily: "monospace", fontSize: 8, color: `${WHITE}55`,
                letterSpacing: 0.5, marginTop: 3, lineHeight: 1.3,
              }}>
                {alert.detail}
              </div>

              {/* Remedy progress bar */}
              {remedying > 0 && remedying < 1 && (
                <div style={{
                  marginTop: 6, height: 2, background: `${WHITE}11`,
                  borderRadius: 1, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", width: `${remedying * 100}%`,
                    background: `linear-gradient(90deg, ${GREEN}, ${TEAL})`,
                  }} />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Medient Pipeline activation label */}
      {(() => {
        const pipelineAppear = interpolate(frame, [115, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (pipelineAppear <= 0) return null;
        return (
          <div style={{
            position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)",
            opacity: pipelineAppear, textAlign: "center",
          }}>
            <div style={{
              fontFamily: "monospace", fontSize: 10, letterSpacing: 6, color: TEAL,
              marginBottom: 8, opacity: 0.7,
            }}>
              MEDIENT CLINICAL LOGIC PIPELINE — ACTIVE
            </div>
            <div style={{
              display: "flex", gap: 20, justifyContent: "center", alignItems: "center",
            }}>
              {["INGEST", "COMPILE", "VERIFY", "EXECUTE", "MONITOR"].map((stage, i) => {
                const stageActive = interpolate(frame, [125 + i * 8, 133 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      fontFamily: "monospace", fontSize: 9, letterSpacing: 3,
                      color: stageActive > 0.5 ? TEAL : `${WHITE}33`,
                      padding: "4px 8px",
                      border: `0.5px solid ${stageActive > 0.5 ? `${TEAL}44` : `${WHITE}11`}`,
                      background: stageActive > 0.5 ? `${TEAL}0A` : "transparent",
                    }}>
                      {stage}
                    </div>
                    {i < 4 && (
                      <span style={{ color: stageActive > 0.5 ? TEAL : `${WHITE}22`, fontSize: 10 }}>→</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

/* ── Rotating scan rings ── */
const ScanRings = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame: frame - 5, fps, config: { damping: 40, stiffness: 30 } });
  const cx = 960, cy = 460;

  return (
    <svg width="1920" height="1080" style={{ position: "absolute", opacity: appear * 0.6 }}>
      <defs>
        <radialGradient id="coreGlow2">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.08" />
          <stop offset="40%" stopColor={TEAL} stopOpacity="0.02" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={350} fill="url(#coreGlow2)" />

      {[100, 160, 230, 310, 400].map((r, i) => {
        const speed = 0.2 + i * 0.12;
        const angle = frame * speed * (i % 2 === 0 ? 1 : -1);
        const dashLen = 3 + i * 3;
        const gapLen = 12 + i * 6;
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={TEAL} strokeWidth={i < 2 ? 0.6 : 0.3}
            opacity={interpolate(i, [0, 4], [0.2, 0.05])}
            strokeDasharray={`${dashLen} ${gapLen}`}
            transform={`rotate(${angle}, ${cx}, ${cy})`} />
        );
      })}
    </svg>
  );
};

/* ── Data source feeds — left panel ── */
const DataSources = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame, fps, config: { damping: 30, stiffness: 50 } });
  const sources = [
    { label: "EHR · EPIC FHIR R4", value: "47 RECORDS", color: BLUE },
    { label: "LABORATORY · HL7v2", value: "12 PANELS", color: LILAC },
    { label: "IMAGING · DICOM", value: "3 STUDIES", color: AMBER },
    { label: "PHARMACY · NCPDP", value: "8 ACTIVE", color: TEAL },
    { label: "GENOMICS · VCF", value: "BRCA1+", color: RED },
    { label: "VITAL SIGNS", value: "BP 142/88", color: AMBER },
    { label: "SOCIAL DX", value: "20PY SMOKE", color: RED },
  ];

  return (
    <div style={{ position: "absolute", left: 45, top: 100, width: 240, opacity: appear }}>
      <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 5, color: `${WHITE}33`, marginBottom: 14 }}>
        DATA INGESTION
      </div>
      {sources.map((s, i) => {
        const sAppear = interpolate(frame, [3 + i * 5, 10 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const streamPulse = 0.5 + Math.sin(frame * 0.08 + i * 0.9) * 0.3;
        return (
          <div key={i} style={{
            opacity: sAppear, display: "flex", justifyContent: "space-between",
            padding: "5px 0", borderBottom: `0.5px solid ${WHITE}08`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 4, height: 4, backgroundColor: s.color, opacity: streamPulse }} />
              <span style={{ fontFamily: "monospace", fontSize: 8.5, color: `${WHITE}55`, letterSpacing: 1 }}>{s.label}</span>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 7.5, color: s.color, opacity: 0.6 }}>{s.value}</span>
          </div>
        );
      })}

      {/* Streaming particles */}
      <svg width="240" height="30" style={{ marginTop: 8 }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const x = ((frame * 2.5 + i * 20) % 260) - 10;
          const op = x > 10 && x < 230 ? 0.25 : 0;
          return <rect key={i} x={x} y={12} width={6 + (i % 3) * 3} height={1.5} fill={TEAL} opacity={op} rx="0.5" />;
        })}
      </svg>
    </div>
  );
};

/* ── Status HUD ── */
const StatusHUD = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const processingPct = Math.min(100, Math.floor(interpolate(frame, [15, 200], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: op }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 40px", borderBottom: `0.5px solid ${WHITE}08`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: 6, color: `${WHITE}55`, fontWeight: 500 }}>MEDIENT</span>
          <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 3, color: `${WHITE}22` }}>CLINICAL ENGINE v4.2</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: TEAL, opacity: 0.5 + Math.sin(frame * 0.1) * 0.3 }} />
          <span style={{ fontFamily: "monospace", fontSize: 9, color: TEAL, opacity: 0.5, letterSpacing: 2 }}>LIVE</span>
        </div>
      </div>
      <div style={{ height: 1, background: `${WHITE}06`, position: "relative" }}>
        <div style={{ height: 1, backgroundColor: TEAL, opacity: 0.4, width: `${processingPct}%` }} />
      </div>

      {/* Bottom protocols */}
      <div style={{
        position: "absolute", bottom: 25, left: 40, right: 40,
        display: "flex", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", gap: 25 }}>
          {["FHIR R4", "HL7v2", "DICOM", "NCPDP"].map((p, i) => (
            <span key={i} style={{ fontFamily: "monospace", fontSize: 8, color: `${WHITE}22`, letterSpacing: 2 }}>{p}</span>
          ))}
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 8, color: `${WHITE}22`, letterSpacing: 2 }}>
          LATENCY: 0.{Math.floor(Math.sin(frame * 0.1) * 3 + 4)}ms
        </span>
      </div>
    </div>
  );
};

/* ── Flowing data streams from sides to center ── */
const DataStreams = ({ frame }: { frame: number }) => {
  const cx = 960, cy = 460;
  const streams = [
    { sx: 285, sy: 180, color: BLUE },
    { sx: 285, sy: 330, color: LILAC },
    { sx: 285, sy: 480, color: AMBER },
    { sx: 285, sy: 620, color: RED },
  ];

  return (
    <svg width="1920" height="1080" style={{ position: "absolute" }}>
      {streams.map((s, si) => {
        const particles = Array.from({ length: 8 }, (_, pi) => {
          const t = ((frame * 0.012 + pi * 0.12 + si * 0.08) % 1);
          const x = s.sx + (cx - 100 - s.sx) * t;
          const y = s.sy + (cy - s.sy) * t;
          const op = t > 0.05 && t < 0.95 ? 0.35 * (1 - Math.abs(t - 0.5) * 1.8) : 0;
          return { x, y, op };
        });
        return (
          <g key={si}>
            <line x1={s.sx} y1={s.sy} x2={cx - 100} y2={cy}
              stroke={s.color} strokeWidth="0.3" opacity="0.03" />
            {particles.map((p, pi) => (
              <circle key={pi} cx={p.x} cy={p.y} r="2" fill={s.color} opacity={p.op} />
            ))}
          </g>
        );
      })}
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
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse at 50% 42%, ${DARK_TEAL}88, transparent 55%),
          radial-gradient(ellipse at 20% 80%, #0a0a1a, transparent 50%),
          radial-gradient(ellipse at 80% 20%, #0a1a0a, transparent 50%)
        `,
      }} />

      <div style={{ opacity: masterOp }}>
        <HexGrid frame={frame} />
        <StatusHUD frame={frame} />

        <Sequence from={3}>
          <ScanRings frame={frame - 3} fps={fps} />
        </Sequence>

        <Sequence from={5}>
          <Patient3D frame={frame - 5} fps={fps} />
        </Sequence>

        <Sequence from={8}>
          <DataStreams frame={frame - 8} />
        </Sequence>

        <Sequence from={10}>
          <DataSources frame={frame - 10} fps={fps} />
        </Sequence>

        <Sequence from={20}>
          <AlertSystem frame={frame - 20} fps={fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

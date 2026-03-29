import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  interpolateColors,
} from "remotion";

const TEAL = "#4AEDC4";
const WHITE = "#FFFFFF";
const RED = "#FF4D57";
const BLUE = "#5B8DEF";
const AMBER = "#F5A623";
const BG = "#040507";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const GridBackdrop = ({ frame }: { frame: number }) => {
  const drift = frame * 0.12;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(74,237,196,0.10), transparent 58%), radial-gradient(ellipse at 20% 85%, rgba(91,141,239,0.11), transparent 45%), radial-gradient(ellipse at 86% 20%, rgba(245,166,35,0.08), transparent 38%), #040507",
        }}
      />

      <svg width="1920" height="1080" style={{ position: "absolute", opacity: 0.08 }}>
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 90 + ((drift * 0.4) % 90)}
            y1="0"
            x2={i * 90 + ((drift * 0.4) % 90)}
            y2="1080"
            stroke={WHITE}
            strokeWidth="0.4"
          />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 90 + (drift % 90)}
            x2="1920"
            y2={i * 90 + (drift % 90)}
            stroke={WHITE}
            strokeWidth="0.4"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const PatientScanModel = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame: frame - 8, fps, config: { damping: 22, stiffness: 60 } });
  const breathe = Math.sin(frame * 0.05) * 3;
  const rotateY = Math.sin(frame * 0.01) * 5;
  const cx = 960;
  const cy = 455;
  const scanY = interpolate(frame % 150, [0, 150], [cy - 260, cy + 260]);

  const slices = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    const y = cy - 230 + t * 470 + breathe;
    const torsoProfile = Math.sin(t * Math.PI);
    const width = 30 + torsoProfile * 130 - Math.max(0, t - 0.72) * 80;
    const opacity = 0.07 + torsoProfile * 0.24;
    return { y, width: Math.max(20, width), opacity };
  });

  const organs = [
    { x: -42, y: -105, color: BLUE, r: 12 },
    { x: 42, y: -105, color: BLUE, r: 12 },
    { x: -8, y: -66, color: RED, r: 8 },
    { x: 30, y: -18, color: AMBER, r: 10 },
    { x: -28, y: 12, color: TEAL, r: 8 },
  ];

  return (
    <svg
      width="1920"
      height="1080"
      style={{
        position: "absolute",
        opacity: appear,
        transform: `perspective(1400px) rotateY(${rotateY}deg)`,
        transformOrigin: "960px 455px",
      }}
    >
      <defs>
        <linearGradient id="bodyDepth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={WHITE} stopOpacity="0.36" />
          <stop offset="60%" stopColor={TEAL} stopOpacity="0.14" />
          <stop offset="100%" stopColor={WHITE} stopOpacity="0.08" />
        </linearGradient>
        <filter id="modelGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="bodyClip">
          <path d={`
            M ${cx - 30} ${cy - 210 + breathe}
            C ${cx - 110} ${cy - 198 + breathe}, ${cx - 150} ${cy - 124 + breathe}, ${cx - 142} ${cy - 32 + breathe}
            C ${cx - 136} ${cy + 45 + breathe}, ${cx - 105} ${cy + 112 + breathe}, ${cx - 72} ${cy + 182 + breathe}
            C ${cx - 58} ${cy + 240 + breathe}, ${cx - 38} ${cy + 268 + breathe}, ${cx - 20} ${cy + 272 + breathe}
            L ${cx + 20} ${cy + 272 + breathe}
            C ${cx + 38} ${cy + 268 + breathe}, ${cx + 58} ${cy + 240 + breathe}, ${cx + 72} ${cy + 182 + breathe}
            C ${cx + 105} ${cy + 112 + breathe}, ${cx + 136} ${cy + 45 + breathe}, ${cx + 142} ${cy - 32 + breathe}
            C ${cx + 150} ${cy - 124 + breathe}, ${cx + 110} ${cy - 198 + breathe}, ${cx + 30} ${cy - 210 + breathe}
            C ${cx + 34} ${cy - 258 + breathe}, ${cx + 20} ${cy - 285 + breathe}, ${cx} ${cy - 288 + breathe}
            C ${cx - 20} ${cy - 285 + breathe}, ${cx - 34} ${cy - 258 + breathe}, ${cx - 30} ${cy - 210 + breathe}
            Z
          `} />
        </clipPath>
      </defs>

      <ellipse cx={cx} cy={cy + 300} rx="170" ry="22" fill={WHITE} opacity="0.05" />

      <path
        d={`
          M ${cx - 30} ${cy - 210 + breathe}
          C ${cx - 110} ${cy - 198 + breathe}, ${cx - 150} ${cy - 124 + breathe}, ${cx - 142} ${cy - 32 + breathe}
          C ${cx - 136} ${cy + 45 + breathe}, ${cx - 105} ${cy + 112 + breathe}, ${cx - 72} ${cy + 182 + breathe}
          C ${cx - 58} ${cy + 240 + breathe}, ${cx - 38} ${cy + 268 + breathe}, ${cx - 20} ${cy + 272 + breathe}
          L ${cx + 20} ${cy + 272 + breathe}
          C ${cx + 38} ${cy + 268 + breathe}, ${cx + 58} ${cy + 240 + breathe}, ${cx + 72} ${cy + 182 + breathe}
          C ${cx + 105} ${cy + 112 + breathe}, ${cx + 136} ${cy + 45 + breathe}, ${cx + 142} ${cy - 32 + breathe}
          C ${cx + 150} ${cy - 124 + breathe}, ${cx + 110} ${cy - 198 + breathe}, ${cx + 30} ${cy - 210 + breathe}
          C ${cx + 34} ${cy - 258 + breathe}, ${cx + 20} ${cy - 285 + breathe}, ${cx} ${cy - 288 + breathe}
          C ${cx - 20} ${cy - 285 + breathe}, ${cx - 34} ${cy - 258 + breathe}, ${cx - 30} ${cy - 210 + breathe}
          Z
        `}
        fill="url(#bodyDepth)"
        stroke={WHITE}
        strokeWidth="1.2"
        opacity="0.75"
      />

      <g clipPath="url(#bodyClip)">
        {slices.map((s, i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={s.y}
            rx={s.width}
            ry="3.8"
            fill="none"
            stroke={WHITE}
            strokeWidth="0.65"
            opacity={s.opacity}
          />
        ))}

        {Array.from({ length: 11 }).map((_, i) => {
          const x = cx - 110 + i * 22;
          return (
            <line
              key={`v${i}`}
              x1={x}
              y1={cy - 290 + breathe}
              x2={x}
              y2={cy + 275 + breathe}
              stroke={TEAL}
              strokeWidth="0.25"
              opacity="0.14"
            />
          );
        })}
      </g>

      <line x1={cx - 200} y1={scanY} x2={cx + 200} y2={scanY} stroke={WHITE} strokeWidth="2" opacity="0.65" filter="url(#modelGlow)" />
      <line x1={cx - 170} y1={scanY + 4} x2={cx + 170} y2={scanY + 4} stroke={TEAL} strokeWidth="0.9" opacity="0.35" />

      {organs.map((o, i) => {
        const pulse = 0.45 + Math.sin(frame * 0.09 + i * 1.2) * 0.25;
        return (
          <g key={i}>
            <circle cx={cx + o.x} cy={cy + o.y + breathe} r={o.r + 6} fill={o.color} opacity={0.05 * pulse} />
            <circle cx={cx + o.x} cy={cy + o.y + breathe} r={o.r} fill={o.color} opacity={0.14 * pulse} />
            <circle cx={cx + o.x} cy={cy + o.y + breathe} r="2.3" fill={WHITE} opacity="0.8" />
          </g>
        );
      })}
    </svg>
  );
};

const SidePanels = ({ frame }: { frame: number }) => {
  const leftItems = ["EHR", "LABS", "IMAGING", "PHARMACY", "CLAIMS", "RISK HISTORY"];
  const rightItems = ["LDCT Lung Screening", "Colorectal Screening", "BP Management", "HbA1c Monitoring", "Mammography"];

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 34, top: 118, width: 260 }}>
        <div style={{ fontFamily: "monospace", color: `${WHITE}66`, fontSize: 9, letterSpacing: 3, marginBottom: 10 }}>PATIENT SIGNALS</div>
        {leftItems.map((item, i) => {
          const op = interpolate(frame, [8 + i * 4, 20 + i * 4], [0, 1], clamp);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: `0.5px solid ${WHITE}14`, padding: "6px 0", opacity: op }}>
              <span style={{ color: `${WHITE}88`, fontFamily: "monospace", fontSize: 9 }}>{item}</span>
              <span style={{ color: `${WHITE}44`, fontFamily: "monospace", fontSize: 8 }}>INGESTED</span>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", right: 34, top: 118, width: 300 }}>
        <div style={{ fontFamily: "monospace", color: `${WHITE}66`, fontSize: 9, letterSpacing: 3, marginBottom: 10 }}>ELIGIBLE ACTIONS</div>
        {rightItems.map((item, i) => {
          const op = interpolate(frame, [20 + i * 5, 34 + i * 5], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                borderLeft: `2px solid ${WHITE}`,
                padding: "6px 10px",
                marginBottom: 4,
                background: `linear-gradient(90deg, rgba(255,255,255,0.08), transparent)`,
                opacity: op * 0.92,
              }}
            >
              <span style={{ color: WHITE, fontFamily: "monospace", fontSize: 10 }}>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AlertAndTrajectories = ({ frame, fps }: { frame: number; fps: number }) => {
  const cx = 960;
  const alerts = [
    { title: "LUNG", detail: "LDCT overdue", x: 635, y: 192, delay: 18 },
    { title: "COLON", detail: "No screening record", x: 1200, y: 246, delay: 32 },
    { title: "CARDIO", detail: "Unmanaged risk", x: 654, y: 322, delay: 44 },
    { title: "DIABETES", detail: "Monitoring gap", x: 1200, y: 366, delay: 54 },
    { title: "BREAST", detail: "Mammo overdue", x: 646, y: 444, delay: 66 },
  ];

  const remediationStart = 128;
  const resolvedCount = Math.min(5, Math.floor(interpolate(frame, [remediationStart, remediationStart + 85], [0, 5], clamp)));

  const leftBoxX = 370;
  const rightBoxX = 1540;
  const boxY = 812;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        <line x1={cx} y1={610} x2={leftBoxX} y2={boxY} stroke={RED} strokeWidth="1.1" strokeDasharray="5 5" opacity="0.32" />
        <line x1={cx} y1={610} x2={rightBoxX} y2={boxY} stroke={WHITE} strokeWidth="1.2" opacity="0.4" />

        {Array.from({ length: 3 }).map((_, i) => {
          const t = (frame * 0.022 + i * 0.24) % 1;
          return <circle key={`l${i}`} cx={cx + (leftBoxX - cx) * t} cy={610 + (boxY - 610) * t} r="2.1" fill={RED} opacity="0.75" />;
        })}

        {Array.from({ length: 4 }).map((_, i) => {
          const t = ((frame - 95) * 0.02 + i * 0.2) % 1;
          const visible = frame > 95 ? 1 : 0;
          return <circle key={`r${i}`} cx={cx + (rightBoxX - cx) * t} cy={610 + (boxY - 610) * t} r="2.1" fill={WHITE} opacity={0.8 * visible} />;
        })}
      </svg>

      {alerts.map((a, i) => {
        const appear = spring({ frame: frame - a.delay, fps, config: { damping: 13, stiffness: 170 } });
        const remedy = interpolate(frame, [remediationStart + i * 10, remediationStart + i * 10 + 18], [0, 1], clamp);
        const border = interpolateColors(remedy, [0, 1], [RED, WHITE]);
        const status = remedy < 0.95 ? "ALERT" : "ORDERED";

        if (appear <= 0) return null;

        return (
          <div
            key={a.title}
            style={{
              position: "absolute",
              left: a.x,
              top: a.y,
              width: 206,
              padding: "10px 12px",
              borderLeft: `3px solid ${border}`,
              border: `1px solid ${border}55`,
              background: `linear-gradient(90deg, ${border}18, rgba(0,0,0,0.15))`,
              opacity: appear,
              transform: `translateY(${(1 - appear) * 18}px)`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontFamily: "monospace", letterSpacing: 2.5, fontSize: 8, color: border }}>{status}</span>
              <span style={{ fontFamily: "monospace", letterSpacing: 1.8, fontSize: 8, color: `${WHITE}66` }}>{Math.round(remedy * 100)}%</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: WHITE, marginBottom: 2 }}>{a.title}</div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: `${WHITE}82` }}>{a.detail}</div>
            <div style={{ marginTop: 6, height: 2, background: `${WHITE}22` }}>
              <div style={{ width: `${Math.round(remedy * 100)}%`, height: "100%", background: border }} />
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", bottom: 136, left: 294, width: 152, textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 3, color: `${RED}AA` }}>WITHOUT MEDIENT</div>
        <div style={{ fontFamily: "monospace", fontSize: 34, color: RED, marginTop: 4 }}>5</div>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 2, color: `${WHITE}66` }}>MISSED SCREENINGS</div>
      </div>

      <div style={{ position: "absolute", bottom: 136, right: 290, width: 180, textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 3, color: `${WHITE}CC` }}>WITH MEDIENT</div>
        <div style={{ fontFamily: "monospace", fontSize: 34, color: WHITE, marginTop: 4 }}>{resolvedCount}</div>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 2, color: `${WHITE}66` }}>SCREENINGS ORDERED</div>
      </div>

      <div style={{ position: "absolute", bottom: 84, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 5, color: `${WHITE}88`, marginBottom: 8 }}>
          MEDIENT CLINICAL LOGIC PIPELINE
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["INGEST", "COMPILE", "VERIFY", "EXECUTE", "MONITOR"].map((step, i) => {
            const active = interpolate(frame, [102 + i * 9, 112 + i * 9], [0, 1], clamp);
            return (
              <div
                key={step}
                style={{
                  fontFamily: "monospace",
                  fontSize: 8,
                  letterSpacing: 2.2,
                  color: interpolateColors(active, [0, 1], [`${WHITE}44`, WHITE]),
                  border: `1px solid ${interpolateColors(active, [0, 1], ["rgba(255,255,255,0.16)", "rgba(255,255,255,0.46)"])}`,
                  padding: "4px 8px",
                  background: `rgba(255,255,255,${0.03 + active * 0.07})`,
                }}
              >
                {step}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HUD = ({ frame }: { frame: number }) => {
  const progress = Math.min(100, Math.floor(interpolate(frame, [10, 230], [0, 100], clamp)));

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          borderBottom: `0.5px solid ${WHITE}22`,
          padding: "16px 34px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", color: `${WHITE}CC`, fontSize: 11, letterSpacing: 5 }}>MEDIENT</span>
          <span style={{ fontFamily: "monospace", color: `${WHITE}55`, fontSize: 8, letterSpacing: 3 }}>AGI CLINICAL ENGINE</span>
        </div>
        <span style={{ fontFamily: "monospace", color: `${WHITE}66`, fontSize: 8, letterSpacing: 2 }}>SESSION LIVE</span>
      </div>

      <div style={{ position: "absolute", top: 50, left: 0, right: 0, height: 1, background: `${WHITE}12` }}>
        <div style={{ width: `${progress}%`, height: "100%", background: WHITE, opacity: 0.55 }} />
      </div>
    </div>
  );
};

export const HeroVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 16], [0, 1], clamp);
  const fadeOut = interpolate(frame, [282, 299], [1, 0], clamp);
  const master = fadeIn * fadeOut;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ opacity: master }}>
        <GridBackdrop frame={frame} />
        <HUD frame={frame} />

        <Sequence from={4}>
          <PatientScanModel frame={frame - 4} fps={fps} />
        </Sequence>

        <Sequence from={8}>
          <SidePanels frame={frame - 8} />
        </Sequence>

        <Sequence from={14}>
          <AlertAndTrajectories frame={frame - 14} fps={fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

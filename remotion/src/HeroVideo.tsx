import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  interpolateColors,
  Img,
  staticFile,
} from "remotion";

const WHITE = "#FFFFFF";
const RED = "#FF4D57";
const CYAN = "#00D4FF";
const AMBER = "#F5A623";
const BG = "#030508";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/* ── Ambient grid backdrop ── */
const GridBackdrop = ({ frame }: { frame: number }) => {
  const drift = frame * 0.1;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, rgba(0,212,255,0.07), transparent 55%),
                       radial-gradient(ellipse at 30% 80%, rgba(0,100,200,0.04), transparent 40%),
                       ${BG}`,
        }}
      />
      <svg width="1920" height="1080" style={{ position: "absolute", opacity: 0.06 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 80 + ((drift * 0.3) % 80)} y1="0" x2={i * 80 + ((drift * 0.3) % 80)} y2="1080" stroke={CYAN} strokeWidth="0.4" />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 80 + ((drift * 0.5) % 80)} x2="1920" y2={i * 80 + ((drift * 0.5) % 80)} stroke={CYAN} strokeWidth="0.4" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* ── 3D Patient Body (image-based) with scan effects ── */
const PatientModel = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame: frame - 5, fps, config: { damping: 28, stiffness: 50 } });
  const breathe = Math.sin(frame * 0.04) * 4;
  const slowRotate = Math.sin(frame * 0.008) * 3;

  // Scan line sweeping vertically
  const scanProgress = (frame * 2.2) % 700;
  const scanY = 190 + scanProgress;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) perspective(1600px) rotateY(${slowRotate}deg) translateY(${breathe}px)`,
        opacity: appear,
        width: 480,
        height: 820,
      }}
    >
      {/* Glow behind body */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          width: 360,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(0,180,255,0.12), transparent 70%)`,
        }}
      />

      {/* The 3D body image */}
      <Img
        src={staticFile("images/patient-body.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          top: scanY,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${CYAN}, ${WHITE}, ${CYAN}, transparent)`,
          opacity: 0.7,
          zIndex: 3,
          boxShadow: `0 0 20px ${CYAN}, 0 0 40px rgba(0,180,255,0.3)`,
        }}
      />

      {/* Second trailing scan line */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: scanY + 6,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${CYAN}88, transparent)`,
          opacity: 0.4,
          zIndex: 3,
        }}
      />

      {/* Floor reflection */}
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          height: 40,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(0,180,255,0.15), transparent 70%)`,
          zIndex: 1,
        }}
      />
    </div>
  );
};

/* ── Alert callouts pointing to body regions ── */
const AlertCallouts = ({ frame, fps }: { frame: number; fps: number }) => {
  const alerts = [
    { title: "LUNG", detail: "LDCT screening overdue", bodyY: 260, side: "left" as const, delay: 22 },
    { title: "CARDIAC", detail: "BP 142/88 unmanaged", bodyY: 310, side: "right" as const, delay: 36 },
    { title: "COLORECTAL", detail: "No colonoscopy on record", bodyY: 430, side: "left" as const, delay: 50 },
    { title: "METABOLIC", detail: "HbA1c monitoring gap", bodyY: 380, side: "right" as const, delay: 64 },
    { title: "BREAST", detail: "Mammography overdue", bodyY: 290, side: "right" as const, delay: 78 },
  ];

  const remediationStart = 140;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width="1920" height="1080" style={{ position: "absolute", zIndex: 5 }}>
        <defs>
          <filter id="alertGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {alerts.map((a, i) => {
          const appear = spring({ frame: frame - a.delay, fps, config: { damping: 15, stiffness: 160 } });
          if (appear <= 0.01) return null;

          const remedy = interpolate(frame, [remediationStart + i * 12, remediationStart + i * 12 + 20], [0, 1], clamp);
          const dotColor = interpolateColors(remedy, [0, 1], [RED, WHITE]);

          // Body center
          const bodyCx = 960;
          // Alert card position
          const cardX = a.side === "left" ? 180 : 1480;
          const cardY = a.bodyY;
          // Connection point on body edge
          const bodyEdgeX = a.side === "left" ? bodyCx - 200 : bodyCx + 200;

          return (
            <g key={a.title} opacity={appear}>
              {/* Connection line from card to body */}
              <line x1={cardX + (a.side === "left" ? 230 : -10)} y1={cardY + 20} x2={bodyEdgeX} y2={a.bodyY + 10}
                stroke={dotColor} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
              {/* Dot on body */}
              <circle cx={bodyEdgeX} cy={a.bodyY + 10} r="5" fill={dotColor} opacity="0.8" filter="url(#alertGlow)">
                {remedy < 0.5 && (
                  <>
                    <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
                  </>
                )}
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Alert cards */}
      {alerts.map((a, i) => {
        const appear = spring({ frame: frame - a.delay, fps, config: { damping: 15, stiffness: 160 } });
        if (appear <= 0.01) return null;

        const remedy = interpolate(frame, [remediationStart + i * 12, remediationStart + i * 12 + 20], [0, 1], clamp);
        const borderColor = interpolateColors(remedy, [0, 1], [RED, WHITE]);
        const status = remedy < 0.95 ? "ALERT" : "RESOLVED";

        const cardX = a.side === "left" ? 140 : 1460;

        return (
          <div
            key={a.title}
            style={{
              position: "absolute",
              left: cardX,
              top: a.bodyY,
              width: 240,
              padding: "12px 14px",
              borderLeft: `3px solid ${borderColor}`,
              border: `1px solid ${borderColor}44`,
              background: `linear-gradient(135deg, ${borderColor}15, rgba(0,0,0,0.4))`,
              opacity: appear,
              transform: `translateX(${(1 - appear) * (a.side === "left" ? -40 : 40)}px)`,
              zIndex: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontFamily: "monospace", letterSpacing: 2.5, fontSize: 8, color: borderColor }}>{status}</span>
              <div style={{ width: 40, height: 2, background: `${WHITE}22`, borderRadius: 1 }}>
                <div style={{ width: `${Math.round(remedy * 100)}%`, height: "100%", background: borderColor, borderRadius: 1 }} />
              </div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: WHITE, fontWeight: 600, marginBottom: 2 }}>{a.title}</div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: `${WHITE}99` }}>{a.detail}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Dual trajectory outcomes at bottom ── */
const Trajectories = ({ frame, fps }: { frame: number; fps: number }) => {
  const appear = spring({ frame: frame - 130, fps, config: { damping: 22, stiffness: 80 } });
  const resolvedCount = Math.min(5, Math.floor(interpolate(frame, [140, 210], [0, 5], clamp)));

  return (
    <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, opacity: appear, zIndex: 8 }}>
      {/* Diverging lines from body center */}
      <svg width="1920" height="200" style={{ position: "absolute", top: -120, left: 0 }}>
        {/* Left path — red dashed */}
        <path d="M 960 0 Q 700 60 380 140" fill="none" stroke={RED} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
        {Array.from({ length: 3 }).map((_, i) => {
          const t = ((frame - 130) * 0.015 + i * 0.3) % 1;
          const x = 960 + (380 - 960) * t * t;
          const y = 0 + 140 * t;
          return <circle key={`lp${i}`} cx={x} cy={y} r="2.5" fill={RED} opacity={frame > 130 ? 0.8 : 0} />;
        })}

        {/* Right path — white solid */}
        <path d="M 960 0 Q 1220 60 1540 140" fill="none" stroke={WHITE} strokeWidth="1.5" opacity="0.5" />
        {Array.from({ length: 4 }).map((_, i) => {
          const t = ((frame - 145) * 0.013 + i * 0.22) % 1;
          const x = 960 + (1540 - 960) * t * t;
          const y = 0 + 140 * t;
          return <circle key={`rp${i}`} cx={x} cy={y} r="2.5" fill={WHITE} opacity={frame > 145 ? 0.8 : 0} />;
        })}
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 140px" }}>
        {/* WITHOUT */}
        <div style={{ textAlign: "center", width: 220 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 4, color: `${RED}BB`, marginBottom: 6 }}>WITHOUT MEDIENT</div>
          <div style={{ fontFamily: "monospace", fontSize: 48, color: RED, fontWeight: 300, lineHeight: 1 }}>5</div>
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 2.5, color: `${WHITE}55`, marginTop: 4 }}>MISSED SCREENINGS</div>
          <div style={{ marginTop: 8, display: "flex", gap: 3, justifyContent: "center" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: RED, opacity: 0.7 }} />
            ))}
          </div>
        </div>

        {/* Pipeline badge */}
        <div style={{ textAlign: "center", alignSelf: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: 5, color: `${WHITE}66`, marginBottom: 8 }}>
            CLINICAL LOGIC PIPELINE
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {["INGEST", "COMPILE", "VERIFY", "EXECUTE", "MONITOR"].map((step, i) => {
              const active = interpolate(frame, [110 + i * 8, 118 + i * 8], [0, 1], clamp);
              return (
                <div
                  key={step}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 7,
                    letterSpacing: 2,
                    color: interpolateColors(active, [0, 1], [`${WHITE}33`, WHITE]),
                    border: `1px solid ${interpolateColors(active, [0, 1], [`${WHITE}15`, `${WHITE}44`])}`,
                    padding: "3px 6px",
                    background: `rgba(255,255,255,${0.02 + active * 0.06})`,
                  }}
                >
                  {step}
                </div>
              );
            })}
          </div>
        </div>

        {/* WITH */}
        <div style={{ textAlign: "center", width: 220 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 4, color: `${WHITE}CC`, marginBottom: 6 }}>WITH MEDIENT</div>
          <div style={{ fontFamily: "monospace", fontSize: 48, color: WHITE, fontWeight: 300, lineHeight: 1 }}>{resolvedCount}</div>
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: 2.5, color: `${WHITE}55`, marginTop: 4 }}>SCREENINGS ORDERED</div>
          <div style={{ marginTop: 8, display: "flex", gap: 3, justifyContent: "center" }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const lit = i < resolvedCount;
              return <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: lit ? WHITE : `${WHITE}22`, opacity: lit ? 0.9 : 0.3 }} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── HUD overlay ── */
const HUD = ({ frame }: { frame: number }) => {
  const progress = Math.min(100, Math.floor(interpolate(frame, [10, 240], [0, 100], clamp)));

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        borderBottom: `0.5px solid ${WHITE}18`,
        padding: "14px 34px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", color: `${WHITE}CC`, fontSize: 11, letterSpacing: 5 }}>MEDIENT</span>
          <span style={{ fontFamily: "monospace", color: `${WHITE}44`, fontSize: 8, letterSpacing: 3 }}>CLINICAL ENGINE v2.4</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", color: `${WHITE}55`, fontSize: 8, letterSpacing: 2 }}>PATIENT SCAN</span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: CYAN, opacity: 0.5 + Math.sin(frame * 0.1) * 0.4 }} />
          <span style={{ fontFamily: "monospace", color: `${CYAN}AA`, fontSize: 8, letterSpacing: 2 }}>LIVE</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", top: 48, left: 0, right: 0, height: 1, background: `${WHITE}0A` }}>
        <div style={{ width: `${progress}%`, height: "100%", background: `${CYAN}66` }} />
      </div>

      {/* Side data readouts */}
      <div style={{ position: "absolute", left: 34, bottom: 34, fontFamily: "monospace", fontSize: 8, color: `${WHITE}44`, letterSpacing: 2 }}>
        FRAME {String(frame).padStart(4, "0")} / 0300
      </div>
      <div style={{ position: "absolute", right: 34, bottom: 34, fontFamily: "monospace", fontSize: 8, color: `${WHITE}44`, letterSpacing: 2 }}>
        ANALYSIS COMPLETE: {progress}%
      </div>
    </div>
  );
};

/* ── Data ingest indicators ── */
const DataIngest = ({ frame }: { frame: number }) => {
  const items = ["EHR", "LAB RESULTS", "IMAGING", "PHARMACY", "CLAIMS", "RISK HISTORY"];

  return (
    <div style={{ position: "absolute", left: 34, top: 70, width: 200, zIndex: 7 }}>
      <div style={{ fontFamily: "monospace", color: `${WHITE}55`, fontSize: 8, letterSpacing: 3.5, marginBottom: 8 }}>
        DATA SOURCES
      </div>
      {items.map((item, i) => {
        const op = interpolate(frame, [6 + i * 5, 18 + i * 5], [0, 1], clamp);
        return (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "4px 0",
            borderBottom: `0.5px solid ${WHITE}0A`,
            opacity: op,
          }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: `${WHITE}77` }}>{item}</span>
            <span style={{ fontFamily: "monospace", fontSize: 7, color: `${CYAN}88`, letterSpacing: 1.5 }}>SYNCED</span>
          </div>
        );
      })}
    </div>
  );
};

/* ── Main export ── */
export const HeroVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 18], [0, 1], clamp);
  const fadeOut = interpolate(frame, [280, 299], [1, 0], clamp);
  const master = fadeIn * fadeOut;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ opacity: master }}>
        <GridBackdrop frame={frame} />
        <HUD frame={frame} />

        <Sequence from={0}>
          <DataIngest frame={frame} />
        </Sequence>

        <Sequence from={3}>
          <PatientModel frame={frame - 3} fps={fps} />
        </Sequence>

        <Sequence from={15}>
          <AlertCallouts frame={frame - 15} fps={fps} />
        </Sequence>

        <Sequence from={20}>
          <Trajectories frame={frame - 20} fps={fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

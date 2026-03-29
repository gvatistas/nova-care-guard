import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const TEAL = "#4AEDC4";
const BG = "#030303";
const WHITE = "#ffffff";
const RED = "#FF5555";
const AMBER = "#F5A623";
const BLUE = "#5B8DEF";

// Scene 1: WITHOUT - Patient visits, nothing happens
const SceneWithout = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame: frame - 5, fps, config: { damping: 30 } });
  const bodyEnter = spring({ frame: frame - 20, fps, config: { damping: 25 } });

  // Patient figure walking in
  const walkX = interpolate(frame, [15, 50], [-100, 350], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Clock ticking
  const clockAngle = interpolate(frame, [0, 180], [0, 720]);

  // Warning signs appearing
  const warn1 = spring({ frame: frame - 80, fps, config: { damping: 20 } });
  const warn2 = spring({ frame: frame - 100, fps, config: { damping: 20 } });
  const warn3 = spring({ frame: frame - 120, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, #0c0505, #030303)" }} />

      {/* Title */}
      <div style={{
        position: "absolute", top: 80, left: 120,
        opacity: titleIn, transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
      }}>
        <div style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 8, color: `${RED}99`, marginBottom: 12 }}>
          WITHOUT MEDIENT
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 56, color: WHITE, fontWeight: 200, lineHeight: 1.1 }}>
          Sarah, 52
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 22, color: `${WHITE}66`, marginTop: 8, fontWeight: 300 }}>
          30-pack-year smoker · Routine checkup
        </div>
      </div>

      {/* Patient wireframe */}
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        <g transform={`translate(${walkX}, 300)`} opacity={bodyEnter}>
          <circle cx="0" cy="-55" r="20" fill="none" stroke={`${WHITE}66`} strokeWidth="2" />
          <line x1="0" y1="-35" x2="0" y2="30" stroke={`${WHITE}55`} strokeWidth="2" />
          <line x1="0" y1="-20" x2="-25" y2="10" stroke={`${WHITE}44`} strokeWidth="1.5" />
          <line x1="0" y1="-20" x2="25" y2="10" stroke={`${WHITE}44`} strokeWidth="1.5" />
          <line x1="0" y1="30" x2="-18" y2="70" stroke={`${WHITE}44`} strokeWidth="1.5" />
          <line x1="0" y1="30" x2="18" y2="70" stroke={`${WHITE}44`} strokeWidth="1.5" />

          {/* No scanning — empty space around patient */}
        </g>
      </svg>

      {/* Missed screenings panel */}
      <div style={{
        position: "absolute", right: 120, top: 250,
        opacity: warn1,
      }}>
        <div style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 5, color: `${WHITE}44`, marginBottom: 20 }}>
          SCREENINGS: NOT CHECKED
        </div>
        {[
          { name: "LDCT LUNG SCREENING", status: "NOT ORDERED", op: warn1 },
          { name: "COLORECTAL SCREENING", status: "NOT CONSIDERED", op: warn2 },
          { name: "DIABETES PRE-SCREEN", status: "OVERLOOKED", op: warn3 },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 18,
            opacity: item.op,
            transform: `translateX(${interpolate(item.op, [0, 1], [20, 0])}px)`,
          }}>
            <div style={{ width: 4, height: 44, backgroundColor: RED, opacity: 0.5 }} />
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 20, color: `${WHITE}88`, fontWeight: 300 }}>{item.name}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: RED, letterSpacing: 3, opacity: 0.7 }}>{item.status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 18 MONTHS LATER text */}
      {frame > 130 && (() => {
        const laterIn = spring({ frame: frame - 130, fps, config: { damping: 15, stiffness: 80 } });
        return (
          <div style={{
            position: "absolute", bottom: 160, left: 120, right: 120,
            opacity: laterIn,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 30,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 80, color: RED, fontWeight: 200, opacity: 0.8 }}>
                18 mo
              </div>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 26, color: WHITE, fontWeight: 300 }}>
                  Stage IIIB Lung Cancer
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 18, color: `${WHITE}55`, marginTop: 4 }}>
                  5-year survival: 8% · Treatment cost: $280,000+
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 50, left: 120, right: 120,
        display: "flex", justifyContent: "space-between",
        fontFamily: "monospace", fontSize: 12, letterSpacing: 4, color: `${WHITE}33`,
      }}>
        <span>STANDARD OF CARE</span>
        <span>NO DECISION SUPPORT</span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: WITH - Patient gets instant AI analysis
const SceneWith = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame: frame - 5, fps, config: { damping: 30 } });
  const bodyEnter = spring({ frame: frame - 15, fps, config: { damping: 25 } });

  // Scanning rings
  const ring1 = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 40 } });
  const ring2 = spring({ frame: frame - 38, fps, config: { damping: 15, stiffness: 40 } });
  const ring3 = spring({ frame: frame - 46, fps, config: { damping: 15, stiffness: 40 } });
  const ringPulse = Math.sin(frame * 0.08) * 0.3 + 0.7;

  // Results cascade
  const resultsIn = spring({ frame: frame - 60, fps, config: { damping: 20, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, #030c0a, #030303)" }} />

      {/* Title */}
      <div style={{
        position: "absolute", top: 80, left: 120,
        opacity: titleIn, transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
      }}>
        <div style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 8, color: TEAL, marginBottom: 12, opacity: 0.8 }}>
          WITH MEDIENT
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 56, color: WHITE, fontWeight: 200, lineHeight: 1.1 }}>
          Same Patient. Instant Analysis.
        </div>
      </div>

      {/* Patient with scanning effect */}
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        <g transform="translate(380, 300)" opacity={bodyEnter}>
          <circle cx="0" cy="-55" r="20" fill="none" stroke={TEAL} strokeWidth="2" opacity={0.8} />
          <line x1="0" y1="-35" x2="0" y2="30" stroke={`${TEAL}aa`} strokeWidth="2" />
          <line x1="0" y1="-20" x2="-25" y2="10" stroke={`${TEAL}88`} strokeWidth="1.5" />
          <line x1="0" y1="-20" x2="25" y2="10" stroke={`${TEAL}88`} strokeWidth="1.5" />
          <line x1="0" y1="30" x2="-18" y2="70" stroke={`${TEAL}77`} strokeWidth="1.5" />
          <line x1="0" y1="30" x2="18" y2="70" stroke={`${TEAL}77`} strokeWidth="1.5" />

          {/* Heart */}
          <circle cx="-5" cy="-8" r="4" fill={TEAL} opacity={0.5 + Math.sin(frame * 0.15) * 0.3} />

          {/* Scanning rings */}
          {[
            { r: 50, s: ring1 }, { r: 70, s: ring2 }, { r: 90, s: ring3 },
          ].map((ring, i) => (
            <circle key={i} cx="0" cy="0" r={ring.r} fill="none" stroke={TEAL}
              strokeWidth="0.8" opacity={ring.s * ringPulse * 0.4}
              strokeDasharray="8 8"
              transform={`rotate(${frame * (1 + i * 0.5)})`}
            />
          ))}

          {/* Lung highlight */}
          <ellipse cx="-12" cy="-12" rx="14" ry="20" fill="none" stroke={TEAL} strokeWidth="0.6" opacity={ring1 * 0.4} strokeDasharray="3 3" />
          <ellipse cx="12" cy="-12" rx="14" ry="20" fill="none" stroke={TEAL} strokeWidth="0.6" opacity={ring1 * 0.4} strokeDasharray="3 3" />
        </g>

        {/* Connection lines to results */}
        {frame > 55 && (
          <>
            <line x1="440" y1="310" x2="800" y2="280" stroke={TEAL} strokeWidth="0.5" strokeDasharray="5 5" opacity={0.2} />
            <line x1="440" y1="340" x2="800" y2="350" stroke={TEAL} strokeWidth="0.5" strokeDasharray="5 5" opacity={0.2} />
            <line x1="440" y1="370" x2="800" y2="420" stroke={TEAL} strokeWidth="0.5" strokeDasharray="5 5" opacity={0.2} />
          </>
        )}
      </svg>

      {/* Results panel */}
      <div style={{
        position: "absolute", right: 120, top: 230,
        opacity: resultsIn, width: 520,
        transform: `translateX(${interpolate(resultsIn, [0, 1], [40, 0])}px)`,
      }}>
        <div style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 6, color: TEAL, marginBottom: 24, opacity: 0.7 }}>
          SCREENINGS IDENTIFIED IN {"<"}1 SECOND
        </div>
        {[
          { name: "LDCT LUNG SCREENING", status: "ORDERED → EARLY DETECTION", color: TEAL, delay: 0 },
          { name: "COLORECTAL", status: "SCHEDULED", color: BLUE, delay: 10 },
          { name: "A1C MONITORING", status: "FLAGGED — PRE-DIABETIC", color: AMBER, delay: 20 },
        ].map((item, i) => {
          const itemIn = spring({ frame: frame - 70 - item.delay, fps, config: { damping: 20 } });
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16, marginBottom: 18,
              opacity: itemIn,
              transform: `translateX(${interpolate(itemIn, [0, 1], [20, 0])}px)`,
            }}>
              <div style={{ width: 4, height: 48, backgroundColor: item.color }} />
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 22, color: WHITE, fontWeight: 300 }}>{item.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: item.color, letterSpacing: 3, marginTop: 3 }}>{item.status}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom result */}
      {frame > 120 && (() => {
        const resultIn = spring({ frame: frame - 120, fps, config: { damping: 15, stiffness: 80 } });
        return (
          <div style={{
            position: "absolute", bottom: 140, left: 120, right: 120,
            opacity: resultIn, display: "flex", alignItems: "center", gap: 40,
          }}>
            <div style={{ fontFamily: "monospace", fontSize: 90, color: TEAL, fontWeight: 200 }}>92%</div>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 28, color: WHITE, fontWeight: 300 }}>
                Stage IA — Early Detection
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 16, color: `${WHITE}66`, marginTop: 6 }}>
                Screening cost: $4,200 · Quality bonus: +$8,000
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 50, left: 120, right: 120,
        display: "flex", justifyContent: "space-between",
        fontFamily: "monospace", fontSize: 12, letterSpacing: 4, color: `${TEAL}55`,
      }}>
        <span>MEDIENT CLINICAL INTELLIGENCE</span>
        <span>DETERMINISTIC · VERIFIED · AUDITABLE</span>
      </div>
    </AbsoluteFill>
  );
};

export const JourneyVideo = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence from={0} durationInFrames={180}>
        <SceneWithout />
      </Sequence>
      {/* Transition flash */}
      <Sequence from={175} durationInFrames={15}>
        <AbsoluteFill>
          {(() => {
            const f = frame - 175;
            const flash = interpolate(f, [0, 5, 15], [0, 0.3, 0], { extrapolateRight: "clamp" });
            return <div style={{ position: "absolute", inset: 0, backgroundColor: TEAL, opacity: flash }} />;
          })()}
        </AbsoluteFill>
      </Sequence>
      <Sequence from={185} durationInFrames={175}>
        <SceneWith />
      </Sequence>
    </AbsoluteFill>
  );
};

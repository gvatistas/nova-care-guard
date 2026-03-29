import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TEAL = "#4AEDC4";

const dataPoints = [
  "AGE: 52",
  "SEX: F",
  "SMOKING: 30 pack-years",
  "BMI: 27.4",
  "FAMILY_HX: LUNG_CA",
  "LAST_LDCT: NEVER",
  "BP: 138/88",
  "A1C: 5.9%",
  "LIPIDS: ELEVATED",
  "COLONOSCOPY: OVERDUE",
];

export const Scene2_AIScan = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scan ring expanding
  const ringScale = spring({ frame, fps, config: { damping: 15, stiffness: 40 } });
  const ringOp = interpolate(frame, [0, 30, 70, 90], [0, 0.6, 0.6, 0], { extrapolateRight: "clamp" });

  // Data stream
  const streamOp = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });

  // "SCANNING" text
  const scanTextOp = interpolate(frame, [5, 15, 70, 85], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const scanTextBlink = Math.floor(frame / 8) % 2;

  // Result flash
  const resultOp = interpolate(frame, [75, 90], [0, 1], { extrapolateRight: "clamp" });
  const resultScale = spring({ frame: frame - 75, fps, config: { damping: 12 } });

  // Exit
  const exitOp = interpolate(frame, [105, 120], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOp }}>
      {/* Central scan ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "35%",
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: `1px solid ${TEAL}`,
          opacity: ringOp,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "35%",
          transform: `translate(-50%, -50%) scale(${ringScale * 0.7})`,
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: `1px solid ${TEAL}44`,
          opacity: ringOp * 0.5,
        }}
      />

      {/* Patient figure in center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "35%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0.5,
        }}
      >
        <div style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid white" }} />
        <div style={{ width: 1.5, height: 60, backgroundColor: "rgba(255,255,255,0.4)", marginTop: 4 }} />
      </div>

      {/* Scanning text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "35%",
          transform: "translate(-50%, 130px)",
          fontFamily: "monospace",
          fontSize: 14,
          color: TEAL,
          letterSpacing: 8,
          opacity: scanTextOp * (scanTextBlink ? 1 : 0.4),
        }}
      >
        SCANNING PATIENT RECORD
      </div>

      {/* Data stream on the right */}
      <div
        style={{
          position: "absolute",
          right: 200,
          top: 180,
          opacity: streamOp,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          PATIENT DATA EXTRACTION
        </div>
        {dataPoints.map((point, i) => {
          const pointOp = interpolate(frame, [20 + i * 4, 25 + i * 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: "monospace",
                fontSize: 16,
                color: i < 3 ? TEAL : "rgba(255,255,255,0.6)",
                marginBottom: 8,
                opacity: pointOp,
                transform: `translateX(${interpolate(pointOp, [0, 1], [20, 0])}px)`,
              }}
            >
              {point}
            </div>
          );
        })}
      </div>

      {/* Result badge */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 120,
          opacity: resultOp,
          transform: `scale(${resultScale})`,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: TEAL,
            letterSpacing: 6,
            marginBottom: 12,
          }}
        >
          ASSESSMENT COMPLETE — 14ms
        </div>
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 48,
            color: "white",
            fontWeight: 200,
          }}
        >
          3 eligible screenings identified
        </div>
      </div>
    </AbsoluteFill>
  );
};

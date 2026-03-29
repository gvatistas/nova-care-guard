import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TEAL = "#4AEDC4";

const screenings = [
  {
    name: "Low-Dose CT Lung Screening",
    guideline: "USPSTF Grade B",
    urgency: "CRITICAL",
    reason: "30 pack-year history, age 50-80, active smoker",
    color: "#FF4444",
  },
  {
    name: "Colorectal Cancer Screening",
    guideline: "USPSTF Grade A",
    urgency: "HIGH",
    reason: "Age 52, no prior colonoscopy on record",
    color: "#FFAA33",
  },
  {
    name: "Hypertension Management",
    guideline: "ACC/AHA Stage 1",
    urgency: "MODERATE",
    reason: "BP 138/88 — lifestyle intervention threshold",
    color: TEAL,
  },
];

export const Scene3_ScreeningsIdentified = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Critical highlight pulse
  const pulseOp = interpolate(frame % 30, [0, 15, 30], [0.3, 1, 0.3]);

  // Exit
  const exitOp = interpolate(frame, [105, 120], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOp }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 120,
          opacity: headerOp,
        }}
      >
        <div style={{ fontFamily: "monospace", fontSize: 12, color: TEAL, letterSpacing: 6, marginBottom: 16 }}>
          ELIGIBLE SCREENINGS
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 44, color: "white", fontWeight: 200 }}>
          Prioritized by clinical urgency
        </div>
      </div>

      {/* Screening cards */}
      {screenings.map((s, i) => {
        const cardSpring = spring({ frame: frame - (15 + i * 12), fps, config: { damping: 15 } });
        const cardX = interpolate(cardSpring, [0, 1], [60, 0]);
        const cardOp = interpolate(cardSpring, [0, 1], [0, 1]);
        const isFirst = i === 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 260 + i * 200,
              left: 120,
              right: 200,
              opacity: cardOp,
              transform: `translateX(${cardX}px)`,
              display: "flex",
              alignItems: "stretch",
            }}
          >
            {/* Priority indicator */}
            <div
              style={{
                width: 4,
                backgroundColor: s.color,
                marginRight: 30,
                opacity: isFirst ? pulseOp : 0.6,
              }}
            />

            {/* Card content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    letterSpacing: 4,
                    color: s.color,
                    padding: "4px 12px",
                    border: `1px solid ${s.color}44`,
                    backgroundColor: `${s.color}11`,
                  }}
                >
                  {s.urgency}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
                  {s.guideline}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: isFirst ? 32 : 26,
                  color: "white",
                  fontWeight: isFirst ? 300 : 200,
                  marginBottom: 8,
                }}
              >
                {s.name}
              </div>
              <div style={{ fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>
                {s.reason}
              </div>
            </div>

            {/* Arrow for critical */}
            {isFirst && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: s.color,
                  letterSpacing: 4,
                  opacity: pulseOp,
                }}
              >
                ← MOST PRESSING
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom info */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 120,
          fontFamily: "monospace",
          fontSize: 14,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: 3,
          opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        ZERO INFERENCE · DETERMINISTIC · GUIDELINE-TRACED
      </div>
    </AbsoluteFill>
  );
};

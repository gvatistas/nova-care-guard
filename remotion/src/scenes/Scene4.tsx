import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TEAL = "#4AEDC4";

const steps = [
  { label: "LDCT ordered", time: "0:30s" },
  { label: "Scan scheduled", time: "0:45s" },
  { label: "9mm nodule detected", time: "Day 3" },
  { label: "Biopsy ordered", time: "Day 5" },
  { label: "Stage IA confirmed", time: "Day 8" },
  { label: "Treatment plan active", time: "Day 10" },
];

export const Scene4_TreatmentExecuted = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Exit
  const exitOp = interpolate(frame, [105, 120], [1, 0], { extrapolateRight: "clamp" });

  // Progress line that grows
  const lineProgress = interpolate(frame, [20, 100], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOp }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 100, left: 120, opacity: headerOp }}>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: TEAL, letterSpacing: 6, marginBottom: 16 }}>
          TREATMENT PATHWAY
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 44, color: "white", fontWeight: 200 }}>
          From screening to early detection
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 20, color: "rgba(255,255,255,0.4)", fontWeight: 300, marginTop: 8 }}>
          Deterministic care pathway — zero bottlenecks
        </div>
      </div>

      {/* Vertical timeline */}
      <div style={{ position: "absolute", left: 200, top: 280, bottom: 100 }}>
        {/* Progress line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 2,
            height: `${lineProgress * 100}%`,
            background: `linear-gradient(to bottom, ${TEAL}, ${TEAL}44)`,
          }}
        />

        {/* Steps */}
        {steps.map((step, i) => {
          const stepFrame = 25 + i * 13;
          const stepSpring = spring({ frame: frame - stepFrame, fps, config: { damping: 18 } });
          const stepOp = interpolate(stepSpring, [0, 1], [0, 1]);
          const stepX = interpolate(stepSpring, [0, 1], [30, 0]);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: i * 110,
                left: -6,
                display: "flex",
                alignItems: "center",
                gap: 30,
                opacity: stepOp,
                transform: `translateX(${stepX}px)`,
              }}
            >
              {/* Node */}
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: i === steps.length - 1 ? TEAL : "transparent",
                  border: `2px solid ${TEAL}`,
                  flexShrink: 0,
                }}
              />

              {/* Content */}
              <div>
                <div style={{ fontFamily: "sans-serif", fontSize: 22, color: "white", fontWeight: 300 }}>
                  {step.label}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginTop: 4 }}>
                  {step.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right side — big stat */}
      <div
        style={{
          position: "absolute",
          right: 200,
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "right",
          opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ fontFamily: "monospace", fontSize: 120, color: TEAL, fontWeight: 200, lineHeight: 1 }}>
          92%
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: 4, marginTop: 12 }}>
          5-YEAR SURVIVAL RATE
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.3)", letterSpacing: 4, marginTop: 4 }}>
          STAGE IA · EARLY DETECTION
        </div>
      </div>
    </AbsoluteFill>
  );
};

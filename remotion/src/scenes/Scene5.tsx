import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TEAL = "#4AEDC4";
const RED = "#FF4444";

export const Scene5_Outcome = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split screen reveal
  const splitSpring = spring({ frame, fps, config: { damping: 200 } });
  const dividerX = interpolate(splitSpring, [0, 1], [1920, 960]);

  // Left side (without) fades in
  const leftOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  // Right side (with) fades in
  const rightOp = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  // Final message
  const finalOp = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });
  const finalY = interpolate(frame, [80, 100], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* LEFT — Without Medient */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 960,
          height: 1080,
          backgroundColor: "#080808",
          opacity: leftOp,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 120,
          paddingRight: 80,
        }}
      >
        <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 6, color: RED, marginBottom: 20 }}>
          WITHOUT MEDIENT
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 36, color: "rgba(255,255,255,0.7)", fontWeight: 200, lineHeight: 1.3, marginBottom: 40 }}>
          Screening never ordered.
          <br />
          Cancer found at stage IIIB.
        </div>

        <div style={{ fontFamily: "monospace", fontSize: 80, color: RED, fontWeight: 200, lineHeight: 1 }}>
          8%
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 4, marginTop: 8 }}>
          5-YEAR SURVIVAL
        </div>

        <div style={{ marginTop: 40, fontFamily: "monospace", fontSize: 14, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>
          $280K+ treatment cost
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          position: "absolute",
          left: dividerX,
          top: 0,
          width: 2,
          height: 1080,
          background: `linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)`,
        }}
      />

      {/* RIGHT — With Medient */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 960,
          height: 1080,
          backgroundColor: "#050505",
          opacity: rightOp,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 80,
          paddingRight: 120,
        }}
      >
        <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 6, color: TEAL, marginBottom: 20 }}>
          WITH MEDIENT
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 36, color: "rgba(255,255,255,0.9)", fontWeight: 200, lineHeight: 1.3, marginBottom: 40 }}>
          Screening flagged instantly.
          <br />
          Cancer caught at stage IA.
        </div>

        <div style={{ fontFamily: "monospace", fontSize: 80, color: TEAL, fontWeight: 200, lineHeight: 1 }}>
          92%
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 4, marginTop: 8 }}>
          5-YEAR SURVIVAL
        </div>

        <div style={{ marginTop: 40, fontFamily: "monospace", fontSize: 14, color: TEAL, letterSpacing: 2, opacity: 0.6 }}>
          $4,200 screening cost · physician earns +$8K quality bonus
        </div>
      </div>

      {/* Final overlay message */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: finalOp,
          transform: `translateY(${finalY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 16,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 8,
            padding: "16px 40px",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          DETERMINISTIC CLINICAL INFRASTRUCTURE
        </div>
      </div>
    </AbsoluteFill>
  );
};

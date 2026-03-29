import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TEAL = "#4AEDC4";

export const Scene1_PatientEnters = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [10, 35], [40, 0], { extrapolateRight: "clamp" });

  const subtitleOp = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });

  // Patient silhouette walking in from left
  const patientX = interpolate(frame, [0, 90], [-300, 500], { extrapolateRight: "clamp" });
  const patientOp = interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: "clamp" });

  // Clinic door / entrance visual
  const doorScale = spring({ frame: frame - 5, fps, config: { damping: 200 } });

  // Ambient gradient
  const gradientOp = interpolate(frame, [0, 60], [0, 0.4], { extrapolateRight: "clamp" });

  // Exit fade
  const exitOp = interpolate(frame, [100, 120], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOp }}>
      {/* Ambient teal glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${TEAL}08, transparent 70%)`,
          opacity: gradientOp,
        }}
      />

      {/* Clinic entrance — abstract door frame */}
      <div
        style={{
          position: "absolute",
          right: 300,
          top: 200,
          width: 200,
          height: 500,
          border: `1px solid rgba(255,255,255,0.1)`,
          transform: `scaleY(${doorScale})`,
          transformOrigin: "bottom",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "monospace",
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 4,
          }}
        >
          CLINIC
        </div>
        {/* Cross symbol */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: TEAL,
            fontSize: 40,
            opacity: 0.3,
          }}
        >
          +
        </div>
      </div>

      {/* Patient silhouette — abstract circle + line figure */}
      <div
        style={{
          position: "absolute",
          left: patientX,
          top: 350,
          opacity: patientOp,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.4)",
          }}
        />
        <div
          style={{
            width: 2,
            height: 80,
            backgroundColor: "rgba(255,255,255,0.3)",
            marginTop: 5,
          }}
        />
        {/* Arms */}
        <div
          style={{
            position: "absolute",
            top: 60,
            width: 60,
            height: 2,
            backgroundColor: "rgba(255,255,255,0.2)",
            left: -10,
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 120,
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 14,
            color: TEAL,
            letterSpacing: 6,
            marginBottom: 16,
          }}
        >
          PATIENT INTAKE
        </div>
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 56,
            color: "white",
            fontWeight: 200,
            lineHeight: 1.1,
          }}
        >
          Sarah, 52
        </div>
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 56,
            color: "rgba(255,255,255,0.4)",
            fontWeight: 200,
            lineHeight: 1.1,
          }}
        >
          walks into a clinic.
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 120,
          opacity: subtitleOp,
          fontFamily: "sans-serif",
          fontSize: 20,
          color: "rgba(255,255,255,0.5)",
          fontWeight: 300,
        }}
      >
        30-pack-year smoker · routine checkup · no symptoms
      </div>
    </AbsoluteFill>
  );
};

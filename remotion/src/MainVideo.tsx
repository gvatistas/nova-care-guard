import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { Scene1_PatientEnters } from "./scenes/Scene1";
import { Scene2_AIScan } from "./scenes/Scene2";
import { Scene3_ScreeningsIdentified } from "./scenes/Scene3";
import { Scene4_TreatmentExecuted } from "./scenes/Scene4";
import { Scene5_Outcome } from "./scenes/Scene5";

const TEAL = "#4AEDC4";
const BG = "#050505";

export const MainVideo = () => {
  const frame = useCurrentFrame();

  // Persistent scan line
  const scanY = interpolate(frame % 180, [0, 180], [-50, 1130]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Persistent subtle grid */}
      <AbsoluteFill style={{ opacity: 0.03 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v${i}`}
            style={{
              position: "absolute",
              left: i * 96,
              top: 0,
              width: 1,
              height: 1080,
              backgroundColor: "white",
            }}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`h${i}`}
            style={{
              position: "absolute",
              top: i * 96,
              left: 0,
              width: 1920,
              height: 1,
              backgroundColor: "white",
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Persistent scan line */}
      <div
        style={{
          position: "absolute",
          top: scanY,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${TEAL}22, transparent)`,
        }}
      />

      {/* Scenes */}
      <Sequence from={0} durationInFrames={120}>
        <Scene1_PatientEnters />
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <Scene2_AIScan />
      </Sequence>
      <Sequence from={240} durationInFrames={120}>
        <Scene3_ScreeningsIdentified />
      </Sequence>
      <Sequence from={360} durationInFrames={120}>
        <Scene4_TreatmentExecuted />
      </Sequence>
      <Sequence from={480} durationInFrames={120}>
        <Scene5_Outcome />
      </Sequence>
    </AbsoluteFill>
  );
};

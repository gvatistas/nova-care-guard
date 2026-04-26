import * as React from "react";

/**
 * PixelField — ambient pixelized backdrop. Tiled CSS-only, very cheap.
 * Used behind hero / divider sections to reinforce the chunky-pixel motif.
 */
const PixelField: React.FC<{ className?: string; opacity?: number; cell?: number }> = ({
  className = "",
  opacity = 0.35,
  cell = 16,
}) => (
  <div
    aria-hidden
    className={className}
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      opacity,
      backgroundImage:
        `linear-gradient(hsla(220,13%,22%,1) 1px, transparent 1px),` +
        `linear-gradient(90deg, hsla(220,13%,22%,1) 1px, transparent 1px),` +
        `radial-gradient(circle at 50% 50%, hsla(220,13%,22%,0.35) 1px, transparent 1.5px)`,
      backgroundSize: `${cell}px ${cell}px, ${cell}px ${cell}px, ${cell * 4}px ${cell * 4}px`,
      maskImage:
        "radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 90%)",
      WebkitMaskImage:
        "radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 90%)",
    }}
  />
);

export default PixelField;

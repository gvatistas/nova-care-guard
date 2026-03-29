const FacetedCrownLogo = ({ size = 40, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 200 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer crown silhouette */}
    <path
      d="M20,120 L42,50 L68,30 L100,15 L132,30 L158,50 L180,120 Z"
      stroke={color}
      strokeWidth={2.5}
      fill="none"
      strokeLinejoin="miter"
    />

    {/* Base band */}
    <rect x={20} y={120} width={160} height={5} fill={color} opacity={0.85} />

    {/* LEFT section facets (peak 42,50 base 20-60) */}
    <polygon points="42,50 20,120 60,120" fill={color} opacity={0.12} />
    <polygon points="42,50 20,120 42,120" fill={color} opacity={0.18} />
    <polygon points="42,50 42,120 60,120" fill={color} opacity={0.14} />

    {/* LEFT-CENTER section facets (peak 68,30 base 48-88) */}
    <polygon points="68,30 48,120 88,120" fill={color} opacity={0.16} />
    <polygon points="68,30 48,120 68,120" fill={color} opacity={0.22} />
    <polygon points="68,30 68,120 88,120" fill={color} opacity={0.13} />

    {/* CENTER section facets (peak 100,15 base 72-128) */}
    <polygon points="100,15 72,120 128,120" fill={color} opacity={0.2} />
    <polygon points="100,15 72,120 100,120" fill={color} opacity={0.28} />
    <polygon points="100,15 100,120 128,120" fill={color} opacity={0.15} />

    {/* RIGHT-CENTER section facets (peak 132,30 base 112-152) */}
    <polygon points="132,30 112,120 152,120" fill={color} opacity={0.16} />
    <polygon points="132,30 112,120 132,120" fill={color} opacity={0.22} />
    <polygon points="132,30 132,120 152,120" fill={color} opacity={0.13} />

    {/* RIGHT section facets (peak 158,50 base 140-180) */}
    <polygon points="158,50 140,120 180,120" fill={color} opacity={0.12} />
    <polygon points="158,50 140,120 158,120" fill={color} opacity={0.18} />
    <polygon points="158,50 158,120 180,120" fill={color} opacity={0.14} />

    {/* Internal facet edge lines from peaks to base */}
    <line x1={42} y1={50} x2={42} y2={120} stroke={color} strokeWidth={0.7} opacity={0.5} />
    <line x1={68} y1={30} x2={68} y2={120} stroke={color} strokeWidth={0.7} opacity={0.5} />
    <line x1={100} y1={15} x2={100} y2={120} stroke={color} strokeWidth={0.7} opacity={0.5} />
    <line x1={132} y1={30} x2={132} y2={120} stroke={color} strokeWidth={0.7} opacity={0.5} />
    <line x1={158} y1={50} x2={158} y2={120} stroke={color} strokeWidth={0.7} opacity={0.5} />

    {/* Horizontal cross-facet lines */}
    <line x1={26} y1={85} x2={174} y2={85} stroke={color} strokeWidth={0.7} opacity={0.2} />
    <line x1={35} y1={65} x2={165} y2={65} stroke={color} strokeWidth={0.7} opacity={0.25} />
    <line x1={40} y1={50} x2={160} y2={50} stroke={color} strokeWidth={0.7} opacity={0.3} />

    {/* Diamond accents at peak tips */}
    <polygon points="42,44 46,50 42,56 38,50" fill={color} opacity={0.6} />
    <polygon points="68,24 72,30 68,36 64,30" fill={color} opacity={0.6} />
    <polygon points="100,9 104,15 100,21 96,15" fill={color} opacity={0.7} />
    <polygon points="132,24 136,30 132,36 128,30" fill={color} opacity={0.6} />
    <polygon points="158,44 162,50 158,56 154,50" fill={color} opacity={0.6} />
  </svg>
);

export default FacetedCrownLogo;

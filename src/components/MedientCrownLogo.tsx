const MedientCrownLogo = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Crown shape — 5 angular faceted points */}
    <defs>
      <linearGradient id="crownGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(160, 82%, 61%)" />
        <stop offset="100%" stopColor="hsl(160, 82%, 45%)" />
      </linearGradient>
      <linearGradient id="crownGrad2" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="hsl(160, 82%, 70%)" stopOpacity="0.9" />
        <stop offset="100%" stopColor="hsl(160, 82%, 40%)" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="crownGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(160, 60%, 35%)" />
        <stop offset="100%" stopColor="hsl(160, 82%, 55%)" />
      </linearGradient>
    </defs>

    {/* Left outer facet */}
    <polygon points="5,70 20,15 30,45" fill="url(#crownGrad2)" opacity="0.85" />
    {/* Left inner facet */}
    <polygon points="30,45 20,15 38,8 50,70" fill="url(#crownGrad1)" opacity="0.7" />
    {/* Center-left facet */}
    <polygon points="38,8 50,35 50,70 30,45" fill="url(#crownGrad3)" opacity="0.6" />
    {/* Center point (tallest) */}
    <polygon points="38,8 50,0 62,8 50,35" fill="url(#crownGrad1)" />
    {/* Center-right facet */}
    <polygon points="62,8 70,45 50,70 50,35" fill="url(#crownGrad2)" opacity="0.6" />
    {/* Right inner facet */}
    <polygon points="62,8 80,15 70,45 50,70" fill="url(#crownGrad3)" opacity="0.7" />
    {/* Right outer facet */}
    <polygon points="80,15 95,70 70,45" fill="url(#crownGrad1)" opacity="0.85" />

    {/* Base band */}
    <polygon points="5,70 95,70 90,82 10,82" fill="url(#crownGrad1)" opacity="0.95" />
    {/* Base bottom edge */}
    <polygon points="10,82 90,82 87,88 13,88" fill="hsl(160, 82%, 35%)" opacity="0.8" />

    {/* Edge highlights */}
    <polyline points="5,70 20,15 38,8 50,0 62,8 80,15 95,70" stroke="hsl(160, 82%, 70%)" strokeWidth="0.8" fill="none" opacity="0.5" />
    <line x1="50" y1="0" x2="50" y2="70" stroke="hsl(160, 82%, 65%)" strokeWidth="0.4" opacity="0.3" />
    <line x1="20" y1="15" x2="50" y2="70" stroke="hsl(160, 82%, 65%)" strokeWidth="0.3" opacity="0.2" />
    <line x1="80" y1="15" x2="50" y2="70" stroke="hsl(160, 82%, 65%)" strokeWidth="0.3" opacity="0.2" />
  </svg>
);

export default MedientCrownLogo;

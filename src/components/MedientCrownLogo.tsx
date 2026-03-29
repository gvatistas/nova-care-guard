const MedientCrownLogo = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="facetLight" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="hsl(0, 0%, 90%)" />
        <stop offset="100%" stopColor="hsl(0, 0%, 70%)" />
      </linearGradient>
      <linearGradient id="facetMid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(0, 0%, 65%)" />
        <stop offset="100%" stopColor="hsl(0, 0%, 40%)" />
      </linearGradient>
      <linearGradient id="facetDark" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(0, 0%, 38%)" />
        <stop offset="100%" stopColor="hsl(0, 0%, 22%)" />
      </linearGradient>
      <linearGradient id="baseBand" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(0, 0%, 40%)" />
        <stop offset="50%" stopColor="hsl(0, 0%, 70%)" />
        <stop offset="100%" stopColor="hsl(0, 0%, 40%)" />
      </linearGradient>
    </defs>

    <polygon points="2,68 18,12 28,42" fill="url(#facetLight)" />
    <polygon points="2,68 28,42 22,68" fill="url(#facetDark)" />

    <polygon points="18,12 36,6 32,38" fill="url(#facetLight)" />
    <polygon points="18,12 32,38 28,42" fill="url(#facetMid)" />
    <polygon points="28,42 32,38 38,68 22,68" fill="url(#facetDark)" />

    <polygon points="36,6 50,0 50,32" fill="url(#facetLight)" />
    <polygon points="36,6 50,32 32,38" fill="url(#facetMid)" />
    <polygon points="50,0 64,6 50,32" fill="url(#facetMid)" />
    <polygon points="32,38 50,32 50,68 38,68" fill="url(#facetDark)" />
    <polygon points="50,32 68,38 62,68 50,68" fill="hsl(0, 0%, 25%)" />

    <polygon points="64,6 82,12 72,42" fill="url(#facetMid)" />
    <polygon points="64,6 72,42 68,38" fill="url(#facetDark)" />
    <polygon points="68,38 72,42 78,68 62,68" fill="hsl(0, 0%, 22%)" />

    <polygon points="82,12 98,68 72,42" fill="url(#facetMid)" />
    <polygon points="72,42 98,68 78,68" fill="url(#facetDark)" />

    <polygon points="2,68 98,68 93,78 7,78" fill="url(#baseBand)" />
    <polygon points="7,78 93,78 90,85 10,85" fill="hsl(0, 0%, 30%)" />

    <polyline
      points="2,68 18,12 36,6 50,0 64,6 82,12 98,68"
      stroke="hsl(0, 0%, 85%)"
      strokeWidth="0.7"
      fill="none"
      opacity="0.6"
    />
    <line x1="18" y1="12" x2="28" y2="42" stroke="hsl(0, 0%, 75%)" strokeWidth="0.4" opacity="0.4" />
    <line x1="28" y1="42" x2="22" y2="68" stroke="hsl(0, 0%, 65%)" strokeWidth="0.3" opacity="0.25" />
    <line x1="36" y1="6" x2="32" y2="38" stroke="hsl(0, 0%, 75%)" strokeWidth="0.4" opacity="0.4" />
    <line x1="32" y1="38" x2="38" y2="68" stroke="hsl(0, 0%, 65%)" strokeWidth="0.3" opacity="0.25" />
    <line x1="50" y1="0" x2="50" y2="68" stroke="hsl(0, 0%, 80%)" strokeWidth="0.5" opacity="0.35" />
    <line x1="64" y1="6" x2="68" y2="38" stroke="hsl(0, 0%, 70%)" strokeWidth="0.4" opacity="0.35" />
    <line x1="68" y1="38" x2="62" y2="68" stroke="hsl(0, 0%, 55%)" strokeWidth="0.3" opacity="0.2" />
    <line x1="82" y1="12" x2="72" y2="42" stroke="hsl(0, 0%, 70%)" strokeWidth="0.4" opacity="0.35" />
    <line x1="72" y1="42" x2="78" y2="68" stroke="hsl(0, 0%, 55%)" strokeWidth="0.3" opacity="0.2" />

    <circle cx="50" cy="2" r="1.2" fill="hsl(0, 0%, 90%)" opacity="0.5" />
    <circle cx="18" cy="14" r="0.8" fill="hsl(0, 0%, 85%)" opacity="0.35" />
    <circle cx="82" cy="14" r="0.8" fill="hsl(0, 0%, 85%)" opacity="0.35" />
  </svg>
);

export default MedientCrownLogo;

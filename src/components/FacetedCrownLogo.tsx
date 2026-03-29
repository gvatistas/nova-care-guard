import React from 'react';

interface FacetedCrownLogoProps {
  size?: number;
  className?: string;
}

const FacetedCrownLogo: React.FC<FacetedCrownLogoProps> = ({ size = 40, className = '' }) => {
  // Crown portion is roughly y:280-570 in 1000x1000 viewBox
  // We crop to just the crown: viewBox="340 250 320 350"
  return (
    <svg 
      width={size} 
      height={size * 0.85} 
      viewBox="340 250 320 350" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center spire - left shadow */}
      <path d="M500 280 L440 420 L500 550 Z" fill="rgba(255,255,255,0.5)" />
      {/* Center spire - right shadow */}
      <path d="M500 280 L560 420 L500 550 Z" fill="rgba(255,255,255,0.7)" />
      {/* Left wing - inner facet */}
      <path d="M400 340 L500 550 L460 470 Z" fill="rgba(255,255,255,0.8)" />
      {/* Left wing - outer leg */}
      <path d="M400 340 L370 570 L460 470 Z" fill="rgba(255,255,255,0.25)" />
      {/* Left wing - bottom connector */}
      <path d="M370 570 L430 510 L460 470 Z" fill="rgba(255,255,255,0.55)" />

      {/* Right wing - inner facet */}
      <path d="M600 340 L500 550 L540 470 Z" fill="rgba(255,255,255,0.6)" />
      {/* Right wing - outer leg */}
      <path d="M600 340 L630 570 L540 470 Z" fill="rgba(255,255,255,0.15)" />
      {/* Right wing - bottom connector */}
      <path d="M630 570 L570 510 L540 470 Z" fill="rgba(255,255,255,0.8)" />

      {/* Structural line overlays */}
      <g stroke="rgba(255,255,255,0.9)" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" fill="none">
        {/* Outer perimeter */}
        <path d="M370 570 L400 340 L500 280 L600 340 L630 570" />
        {/* Interior structural lines */}
        <path d="M370 570 L500 550 L630 570" />
        <path d="M400 340 L500 550 L600 340" />
        <path d="M500 280 L500 550" />
      </g>
    </svg>
  );
};

export default FacetedCrownLogo;

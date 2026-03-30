import React from 'react';

interface FacetedCrownLogoProps {
  size?: number;
  className?: string;
}

const FacetedCrownLogo: React.FC<FacetedCrownLogoProps> = ({ size = 40, className = '' }) => {
  const fontSize = size * 0.35;
  return (
    <span
      className={`text-white font-bold select-none ${className}`}
      style={{ fontSize, letterSpacing: "0.12em", lineHeight: 1 }}
    >
      MEDIENT
    </span>
  );
};

export default FacetedCrownLogo;

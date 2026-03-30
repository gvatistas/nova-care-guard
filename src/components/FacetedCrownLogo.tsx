import React from 'react';

interface FacetedCrownLogoProps {
  size?: number;
  className?: string;
}

const FacetedCrownLogo: React.FC<FacetedCrownLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <img
      src="/medient-icon-white.svg"
      alt="Medient"
      className={`select-none ${className}`}
      style={{ width: size, height: 'auto' }}
      draggable={false}
    />
  );
};

export default FacetedCrownLogo;

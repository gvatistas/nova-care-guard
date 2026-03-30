import React from 'react';

interface FacetedCrownLogoProps {
  size?: number;
  className?: string;
}

const FacetedCrownLogo: React.FC<FacetedCrownLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="/medient-crown-white.svg" 
      alt="Medient" 
      height={size}
      className={className}
      style={{ objectFit: 'contain', height: size, width: 'auto' }}
    />
  );
};

export default FacetedCrownLogo;

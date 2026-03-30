import React from 'react';

interface FacetedCrownLogoProps {
  size?: number;
  className?: string;
}

const FacetedCrownLogo: React.FC<FacetedCrownLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="/medient-icon.svg" 
      alt="Medient" 
      height={size}
      className={className}
      style={{ objectFit: 'contain', filter: 'invert(1)', height: size, width: 'auto' }}
    />
  );
};

export default FacetedCrownLogo;
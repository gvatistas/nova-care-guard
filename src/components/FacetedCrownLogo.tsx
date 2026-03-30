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
      className={className}
      style={{ height: size, width: 'auto', objectFit: 'contain' }}
    />
  );
};

export default FacetedCrownLogo;

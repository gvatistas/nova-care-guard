import React from 'react';

interface FacetedCrownLogoProps {
  size?: number;
  className?: string;
}

const FacetedCrownLogo: React.FC<FacetedCrownLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="/medient-crown-light.svg" 
      alt="Medient Health" 
      width={size} 
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default FacetedCrownLogo;
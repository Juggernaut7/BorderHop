import React from 'react';
import borderhopLogo from '../../assets/borderhop-logo.png';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-28 h-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={borderhopLogo}
        alt="BorderHop"
        className={`${sizeClasses[size]} w-full h-full object-cover rounded-2xl`}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};

export default Logo; 
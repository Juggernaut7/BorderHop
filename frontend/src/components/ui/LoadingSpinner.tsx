import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-500',
    secondary: 'border-secondary-200 border-t-secondary-500',
    white: 'border-white/20 border-t-white'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
        );
      
      case 'dots':
        return (
          <div className="loading-dots">
            <motion.div
              className={`w-2 h-2 bg-${color === 'white' ? 'white' : `${color}-500`} rounded-full`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className={`w-2 h-2 bg-${color === 'white' ? 'white' : `${color}-500`} rounded-full`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
              className={`w-2 h-2 bg-${color === 'white' ? 'white' : `${color}-500`} rounded-full`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </div>
        );
      
      case 'pulse':
        return (
          <motion.div
            className={`w-${size === 'sm' ? '4' : size === 'md' ? '6' : size === 'lg' ? '8' : '12'} h-${size === 'sm' ? '4' : size === 'md' ? '6' : size === 'lg' ? '8' : '12'} bg-${color === 'white' ? 'white' : `${color}-500`} rounded-full`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderSpinner()}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-text-secondary ${textSizeClasses[size]} font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner; 
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning' | 'info';
  showIcon?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  variant = 'error',
  showIcon = true,
  showRetry = false,
  onRetry,
  onDismiss,
  className = ''
}) => {
  const variantClasses = {
    error: 'status-error',
    warning: 'status-warning',
    info: 'status-info'
  };

  const iconClasses = {
    error: 'text-error-600',
    warning: 'text-warning-600',
    info: 'text-primary-600'
  };

  const icon = {
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle
  };

  const IconComponent = icon[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${variantClasses[variant]} rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconClasses[variant]}`} />
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm leading-relaxed">
            {message}
          </p>
          
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorMessage; 
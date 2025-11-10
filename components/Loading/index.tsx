import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * Loading component with customizable size and text
 */
function Loading({ size = 'md', text, className = '' }: LoadingProps): React.ReactElement {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinnerSizeClasses = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${spinnerSizeClasses[size]}
          border-gray-300 
          border-t-blue-600 
          rounded-full 
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export default Loading;

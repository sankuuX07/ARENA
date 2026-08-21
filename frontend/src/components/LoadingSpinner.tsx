import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 24,
}) => {
  return (
    <div className="spinner-container">
      <Loader2 className="spinner-icon" size={size} />
      {message && <span className="spinner-text">{message}</span>}
    </div>
  );
};

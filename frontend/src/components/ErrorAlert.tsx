import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="error-alert">
      <div className="error-alert-header">
        <AlertTriangle className="error-icon" size={20} />
        <h4 className="error-title">{title}</h4>
      </div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
};

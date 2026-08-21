import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  expiresAt: string; // ISO String
  onExpire: () => void;
}

export const CompetitionTimer: React.FC<Props> = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expirationDate = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const difference = expirationDate - now;

      if (difference <= 0) {
        setTimeLeft(0);
        if (!isExpired) {
          setIsExpired(true);
          onExpire();
        }
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    };

    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire, isExpired]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft > 0 && timeLeft <= 300; // Under 5 minutes

  return (
    <div 
      aria-label="Time Remaining"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        fontSize: '1.25rem',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: isExpired ? 'var(--danger)' : (isWarning ? 'var(--warning)' : 'var(--text-primary)'),
        padding: '0.5rem 1rem',
        background: 'var(--bg-main)',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isWarning ? 'var(--warning)' : 'var(--border-color)'}`
      }}
    >
      <Clock size={20} className={isWarning ? 'pulse' : ''} />
      {formatTime(timeLeft)}
    </div>
  );
};

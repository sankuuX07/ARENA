import React, { useEffect, useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Sparkles, StopCircle, Clock } from 'lucide-react';

export interface SessionHeaderProps {
  mode: string;
  onEndSession: () => void;
  messageCount: number;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ mode, onEndSession, messageCount }) => {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number): string => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeLabel = (m: string): string => {
    switch (m) {
      case 'general':
        return 'General Practice';
      case 'fluency':
        return 'Spoken Fluency';
      case 'formal':
        return 'Formal Corporate';
      case 'situational':
        return 'Situational';
      case 'group_discussion':
        return 'Group Discussion';
      default:
        return m;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Badge variant="primary" icon={<Sparkles size={13} />}>
          {getModeLabel(mode)}
        </Badge>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Clock size={14} />
          <span>{formatTimer(seconds)}</span>
        </div>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          • {messageCount} Messages
        </span>
      </div>

      <Button variant="secondary" size="sm" icon={<StopCircle size={15} />} onClick={onEndSession}>
        End Session
      </Button>
    </div>
  );
};

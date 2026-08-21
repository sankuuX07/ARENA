import React from 'react';
import { PlacementRoundSession } from '../../types/placement';
import { CheckCircle, Circle, Lock, XCircle, ArrowRight } from 'lucide-react';

interface PlacementProgressTrackerProps {
  rounds: PlacementRoundSession[];
  currentRoundOrder: number;
}

export const PlacementProgressTracker: React.FC<PlacementProgressTrackerProps> = ({
  rounds,
  currentRoundOrder
}) => {
  const sortedRounds = [...rounds].sort((a, b) => a.order - b.order);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'completed':
        return <CheckCircle size={24} style={{ color: 'var(--success)' }} />;
      case 'failed':
        return <XCircle size={24} style={{ color: 'var(--danger)' }} />;
      case 'in_progress':
      case 'not_started':
        return <Circle size={24} style={{ color: 'var(--primary)' }} />;
      case 'locked':
      default:
        return <Lock size={24} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'passed': return 'PASSED';
      case 'failed': return 'NOT CLEARED';
      case 'completed': return 'COMPLETED';
      case 'in_progress': return 'IN PROGRESS';
      case 'not_started': return 'AVAILABLE';
      case 'locked': return 'LOCKED';
      default: return status.toUpperCase();
    }
  };

  return (
    <div className="placement-progress-tracker" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {sortedRounds.map((round, index) => {
        const isCurrent = round.order === currentRoundOrder;
        
        return (
          <div key={round.roundSessionId} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {getStatusIcon(round.status)}
              {index < sortedRounds.length - 1 && (
                <div style={{
                  width: '2px',
                  height: '40px',
                  background: round.status === 'passed' || round.status === 'completed' 
                    ? 'var(--success)' 
                    : 'var(--border-color)',
                  margin: '4px 0'
                }} />
              )}
            </div>
            
            <div style={{
              flex: 1,
              padding: '1rem',
              background: isCurrent ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
              border: `1px solid ${isCurrent ? 'var(--primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              opacity: round.status === 'locked' ? 0.6 : 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Round {round.order}: {round.roundId.split('_')[1]?.toUpperCase()}
                  {isCurrent && <ArrowRight size={16} style={{ color: 'var(--primary)' }} />}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Status: <strong style={{ color: 
                    round.status === 'passed' ? 'var(--success)' : 
                    round.status === 'failed' ? 'var(--danger)' : 
                    'inherit'
                  }}>{getStatusText(round.status)}</strong>
                  {round.score !== undefined && round.score !== null && ` | Score: ${round.score}%`}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlacementRoundSession } from '../../types/placement';
import { CheckCircle, XCircle } from 'lucide-react';

interface RoundTransitionProps {
  round: PlacementRoundSession;
  nextRoundName?: string;
  onContinue: () => void;
  onSummary: () => void;
}

export const RoundTransition: React.FC<RoundTransitionProps> = ({
  round,
  nextRoundName,
  onContinue,
  onSummary
}) => {
  const isPassed = round.passed;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <Card style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem' }}>
        {isPassed ? (
          <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
        ) : (
          <XCircle size={64} style={{ color: 'var(--danger)', margin: '0 auto 1rem auto' }} />
        )}

        <h2 style={{ marginBottom: '1rem' }}>Round Complete</h2>
        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
          {round.roundId.split('_')[1]?.toUpperCase()}
        </h3>

        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Score: {round.score !== undefined ? `${round.score}%` : 'N/A'}
          </div>
          <div style={{ 
            color: isPassed ? 'var(--success)' : 'var(--danger)',
            fontWeight: 'bold' 
          }}>
            Status: {isPassed ? 'PASSED' : 'NOT CLEARED'}
          </div>
        </div>

        {isPassed && nextRoundName ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Next Round:</div>
            <div style={{ fontWeight: 'bold' }}>{nextRoundName}</div>
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            This simulation has ended.
          </div>
        )}

        {isPassed && nextRoundName ? (
          <Button fullWidth onClick={onContinue}>
            Continue
          </Button>
        ) : (
          <Button fullWidth variant="outline" onClick={onSummary}>
            View Simulation Summary
          </Button>
        )}
      </Card>
    </div>
  );
};

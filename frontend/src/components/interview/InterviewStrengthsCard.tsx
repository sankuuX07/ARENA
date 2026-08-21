import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2 } from 'lucide-react';

interface InterviewStrengthsCardProps {
  strengths: string[];
}

export const InterviewStrengthsCard: React.FC<InterviewStrengthsCardProps> = ({ strengths }) => {
  if (!strengths || strengths.length === 0) return null;

  return (
    <Card style={{ background: 'var(--bg-surface-elevated)' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
        <CheckCircle2 size={20} /> Your Strengths
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {strengths.map((s, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--success)', marginTop: '2px' }}>✓</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

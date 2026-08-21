import React from 'react';
import { Card } from '../ui/Card';
import { AlertCircle } from 'lucide-react';

interface InterviewImprovementCardProps {
  improvementAreas: string[];
}

export const InterviewImprovementCard: React.FC<InterviewImprovementCardProps> = ({ improvementAreas }) => {
  if (!improvementAreas || improvementAreas.length === 0) return null;

  return (
    <Card style={{ background: 'var(--bg-surface-elevated)' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
        <AlertCircle size={20} /> Focus Areas
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {improvementAreas.map((a, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--warning)', marginTop: '2px' }}>•</span>
            <span>{a}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

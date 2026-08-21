import React from 'react';
import { Card } from '../ui/Card';
import { AnalyticsStrength, AnalyticsImprovementArea } from '../../types/analytics';
import { Trophy, Compass } from 'lucide-react';

interface Props {
  strengths: AnalyticsStrength[];
  improvementAreas: AnalyticsImprovementArea[];
}

export const AnalyticsStrengthsCard: React.FC<Props> = ({ strengths, improvementAreas }) => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Trophy size={20} style={{ color: 'var(--primary)' }} />
        <h3 style={{ margin: 0 }}>Top Strengths</h3>
      </div>
      
      {strengths.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Insufficient data to identify strengths.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {strengths.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontWeight: 'bold' }}>{item.categoryName}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.score}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Compass size={20} style={{ color: 'var(--warning)' }} />
        <h3 style={{ margin: 0 }}>Focus Areas</h3>
      </div>

      {improvementAreas.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Complete more activities to identify focus areas.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {improvementAreas.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontWeight: 'bold' }}>{item.categoryName}</span>
              <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{item.score}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

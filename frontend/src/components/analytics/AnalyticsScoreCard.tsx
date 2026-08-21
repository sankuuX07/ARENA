import React from 'react';
import { Card } from '../ui/Card';
import { AnalyticsPerformanceLevel } from '../../types/analytics';

interface Props {
  title: string;
  score: number;
  performanceLevel: AnalyticsPerformanceLevel;
  subtitle?: string;
}

export const AnalyticsScoreCard: React.FC<Props> = ({ title, score, performanceLevel, subtitle }) => {
  return (
    <Card style={{ textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{title}</h2>
      <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: 1 }}>
        {score}
      </div>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
        {performanceLevel}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          {subtitle}
        </div>
      )}
    </Card>
  );
};

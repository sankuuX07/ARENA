import React from 'react';
import { Card } from '../ui/Card';
import { AnalyticsCoverage } from '../../types/analytics';
import { Target } from 'lucide-react';

interface Props {
  coverage: AnalyticsCoverage;
}

export const AnalyticsCoverageCard: React.FC<Props> = ({ coverage }) => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Target size={20} style={{ color: 'var(--primary)' }} />
        <h3 style={{ margin: 0 }}>Preparation Coverage</h3>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          {Math.round(coverage.coveragePercentage)}%
        </div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          {coverage.exploredCategories} / {coverage.availableCategories} Areas
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ width: `${coverage.coveragePercentage}%`, height: '100%', background: 'var(--primary)' }} />
      </div>

      {coverage.unexploredCategories.length > 0 && (
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Not Yet Explored
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            {coverage.unexploredCategories.map((cat, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>{cat}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

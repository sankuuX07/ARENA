import React from 'react';
import { StudentRecommendation } from '../../types/recommendation';
import { RecommendationCard } from './RecommendationCard';

interface Props {
  title: string;
  recommendations: StudentRecommendation[];
  onDismissed: () => void;
}

export const RecommendationSection: React.FC<Props> = ({ title, recommendations, onDismissed }) => {
  if (recommendations.length === 0) return null;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {title} ({recommendations.length})
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {recommendations.map(rec => (
          <RecommendationCard 
            key={rec.recommendationId} 
            recommendation={rec} 
            onDismissed={onDismissed}
          />
        ))}
      </div>
    </div>
  );
};

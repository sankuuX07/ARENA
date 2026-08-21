import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RecommendationItem } from '../../services/dashboardService';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface RecommendedPracticeGridProps {
  recommendations: RecommendationItem[];
}

export const RecommendedPracticeGrid: React.FC<RecommendedPracticeGridProps> = ({ recommendations }) => {
  const navigate = useNavigate();

  const getDifficultyBadge = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return <Badge variant="success">Easy</Badge>;
      case 'Medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'Hard':
        return <Badge variant="error">Hard</Badge>;
      default:
        return <Badge variant="neutral">{diff}</Badge>;
    }
  };

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div className="arena-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)' }} />
          <h2 className="card-title">Recommended for You</h2>
        </div>
        <Badge variant="primary">UI Demo</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            hoverLift
            style={{
              padding: '1rem',
              background: 'var(--bg-surface-elevated)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Badge variant="neutral" style={{ fontSize: '0.7rem' }}>
                {rec.category}
              </Badge>
              {getDifficultyBadge(rec.difficulty)}
            </div>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              {rec.title}
            </h3>

            <p className="caption-text" style={{ fontSize: '0.8rem', marginBottom: '0.85rem' }}>
              {rec.description}
            </p>

            <button
              type="button"
              onClick={() => navigate(rec.path)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: 0,
              }}
            >
              <span>Practice Now</span>
              <ArrowRight size={12} />
            </button>
          </Card>
        ))}
      </div>
    </Card>
  );
};

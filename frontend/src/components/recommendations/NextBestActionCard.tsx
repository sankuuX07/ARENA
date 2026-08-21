import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StudentRecommendation } from '../../types/recommendation';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  recommendation: StudentRecommendation;
  onAction?: () => void;
}

export const NextBestActionCard: React.FC<Props> = ({ recommendation, onAction }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) onAction();
    navigate(recommendation.actionRoute);
  };

  return (
    <Card style={{ border: '2px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--primary)' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
        <Star size={20} fill="currentColor" />
        <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Next Best Action</h3>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {recommendation.title}
      </h2>
      
      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {recommendation.description}
      </p>

      <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
          Why this?
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
          {recommendation.reasonSummary}
        </div>
      </div>

      <Button onClick={handleAction} icon={<ArrowRight size={18} />} style={{ width: '100%' }}>
        {recommendation.actionLabel}
      </Button>
    </Card>
  );
};

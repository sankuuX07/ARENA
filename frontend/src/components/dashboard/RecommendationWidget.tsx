import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Compass, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../../services/recommendationService';
import { StudentRecommendation } from '../../types/recommendation';

export const RecommendationWidget: React.FC = () => {
  const navigate = useNavigate();
  const [nextAction, setNextAction] = useState<StudentRecommendation | null>(null);

  useEffect(() => {
    recommendationService.getNextAction()
      .then(setNextAction)
      .catch(console.error); // Silently ignore if no action
  }, []);

  if (!nextAction) return null;

  return (
    <Card style={{ marginBottom: '2rem', border: '2px solid var(--primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
        <Compass size={20} />
        <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Next Step</h3>
      </div>
      
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{nextAction.title}</h2>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        {nextAction.description}
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => navigate(nextAction.actionRoute)} icon={<ArrowRight size={16} />}>
          {nextAction.actionLabel}
        </Button>
        <Button variant="outline" onClick={() => navigate('/recommendations')}>
          View My Plan
        </Button>
      </div>
    </Card>
  );
};

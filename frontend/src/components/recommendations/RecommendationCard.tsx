import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StudentRecommendation } from '../../types/recommendation';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../../services/recommendationService';

interface Props {
  recommendation: StudentRecommendation;
  onDismissed?: () => void;
}

export const RecommendationCard: React.FC<Props> = ({ recommendation, onDismissed }) => {
  const navigate = useNavigate();
  const [isDismissing, setIsDismissing] = useState(false);

  const handleAction = async () => {
    // Optionally mark as complete right away, or just navigate.
    // We'll navigate, the backend should ideally auto-complete based on actual activity later.
    navigate(recommendation.actionRoute);
  };

  const handleDismiss = async () => {
    setIsDismissing(true);
    try {
      await recommendationService.dismissRecommendation(recommendation.recommendationId);
      if (onDismissed) onDismissed();
    } catch (err) {
      console.error(err);
      setIsDismissing(false);
    }
  };

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'critical': return 'var(--danger)';
      case 'high': return 'var(--warning)';
      case 'medium': return 'var(--primary)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <Card style={{ opacity: isDismissing ? 0.5 : 1, transition: 'opacity 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <Badge style={{ background: getPriorityColor(), color: 'white' }}>
          {recommendation.priority.toUpperCase()} PRIORITY
        </Badge>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {recommendation.targetCategory.toUpperCase()}
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {recommendation.title}
      </h3>
      
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
        {recommendation.description}
      </p>

      <div style={{ borderLeft: '3px solid var(--border-color)', paddingLeft: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          Based on your data:
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          {recommendation.reasonSummary}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button onClick={handleAction} style={{ flex: 1 }}>
          {recommendation.actionLabel}
        </Button>
        <Button variant="outline" onClick={handleDismiss} disabled={isDismissing}>
          Dismiss
        </Button>
      </div>
    </Card>
  );
};

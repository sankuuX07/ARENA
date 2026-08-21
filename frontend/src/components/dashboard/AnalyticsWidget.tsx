import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsOverview } from '../../types/analytics';

export const AnalyticsWidget: React.FC = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    analyticsService.getOverview().then(setOverview).catch(console.error);
  }, []);

  if (!overview) return null;

  return (
    <Card style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Your Performance</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Overall Preparation Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {overview.overallScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Based on {overview.coverage.exploredCategories} of {overview.coverage.availableCategories} areas
          </div>
        </div>

        <div>
          {overview.strengths.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Top Strength:</div>
              <div style={{ fontWeight: 'bold' }}>{overview.strengths[0].categoryName}</div>
            </div>
          )}
          {overview.improvementAreas.length > 0 && (
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Focus Area:</div>
              <div style={{ fontWeight: 'bold' }}>{overview.improvementAreas[0].categoryName}</div>
            </div>
          )}
        </div>
      </div>

      <Button style={{ width: '100%' }} onClick={() => navigate('/analytics')}>View Full Analytics</Button>
    </Card>
  );
};

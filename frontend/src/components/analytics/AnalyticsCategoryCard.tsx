import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnalyticsCategory } from '../../types/analytics';
import { TrendingUp, TrendingDown, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  category: AnalyticsCategory;
  viewRoute: string;
}

export const AnalyticsCategoryCard: React.FC<Props> = ({ category, viewRoute }) => {
  const navigate = useNavigate();
  
  const getTrendIcon = () => {
    switch (category.trend) {
      case 'Improving': return <TrendingUp size={16} style={{ color: 'var(--success)' }} />;
      case 'Declining': return <TrendingDown size={16} style={{ color: 'var(--danger)' }} />;
      case 'Stable': return <Minus size={16} style={{ color: 'var(--text-secondary)' }} />;
      default: return <HelpCircle size={16} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>{category.name}</h3>
        {category.score !== null ? (
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {category.score}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
        ) : (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No Data
          </div>
        )}
      </div>

      {category.score !== null ? (
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Performance</span>
            <span style={{ fontWeight: 'bold' }}>{category.performanceLevel}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Activities</span>
            <span>{category.completedActivities} completed</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Trend</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {getTrendIcon()}
              <span>{category.trend}</span>
            </div>
          </div>
          <Button variant="outline" style={{ width: '100%' }} onClick={() => navigate(viewRoute)}>View Details</Button>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Start practicing to build your performance analytics.
          </p>
          <Button onClick={() => navigate(viewRoute)} icon={<ArrowRight size={16} />}>Start Practice</Button>
        </div>
      )}
    </Card>
  );
};

import React from 'react';
import { Card } from '../ui/Card';
import { AnalyticsInsight } from '../../types/analytics';
import { Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  insights: AnalyticsInsight[];
}

export const AnalyticsInsightsCard: React.FC<Props> = ({ insights }) => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Lightbulb size={20} style={{ color: 'var(--warning)' }} />
        <h3 style={{ margin: 0 }}>Analytics Insights</h3>
      </div>
      
      {insights.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
          Complete more activities to receive personalized insights.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {insights.map((insight) => (
            <div key={insight.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              {insight.isPositive ? (
                <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={18} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
              )}
              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {insight.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

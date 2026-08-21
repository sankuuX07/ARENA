import React from 'react';
import { Card } from '../ui/Card';
import { AnalyticsActivity } from '../../types/analytics';
import { Clock } from 'lucide-react';

interface Props {
  activities: AnalyticsActivity[];
}

export const AnalyticsActivityTimeline: React.FC<Props> = ({ activities }) => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Clock size={20} style={{ color: 'var(--primary)' }} />
        <h3 style={{ margin: 0 }}>Recent Activity</h3>
      </div>
      
      {activities.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
          No recent activity found.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map((activity, idx) => (
            <div key={activity.activityId} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
              {/* Timeline line */}
              {idx !== activities.length - 1 && (
                <div style={{ position: 'absolute', left: '0.35rem', top: '1.5rem', bottom: '-1rem', width: '2px', background: 'var(--border-color)' }} />
              )}
              
              {/* Timeline dot */}
              <div style={{ width: '0.8rem', height: '0.8rem', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '0.25rem' }} />
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{activity.activityName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{activity.module}</div>
                  </div>
                  {activity.score !== null && (
                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{activity.score}</div>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { RecentActivityItem } from '../../services/dashboardService';
import { Activity, CheckCircle2 } from 'lucide-react';

export interface RecentActivityListProps {
  activities: RecentActivityItem[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities = [] }) => {
  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div className="arena-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} style={{ color: 'var(--secondary)' }} />
          <h2 className="card-title">Recent Activity</h2>
        </div>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          title="No recent activity yet"
          description="Start practicing to build your ARENA activity history."
          icon={<Activity size={32} />}
        />
      ) : (
        <div className="activity-list">
          {activities.map((act) => (
            <div key={act.id} className="activity-item">
              <div className="activity-icon-badge">
                <CheckCircle2 size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-title">{act.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="activity-time">{act.timeAgo}</span>
                  {act.scoreBadge && (
                    <Badge variant="success" style={{ fontSize: '0.65rem' }}>
                      {act.scoreBadge}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

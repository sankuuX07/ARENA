import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  badge,
}) => {
  return (
    <Card className="stat-card" hoverLift>
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon">{icon}</div>
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {subtext && <span className="stat-card-subtext">{subtext}</span>}
          {badge}
        </div>
      </div>
    </Card>
  );
};

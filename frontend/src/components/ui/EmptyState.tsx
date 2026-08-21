import React from 'react';
import { Card } from './Card';
import { Layers } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon = <Layers size={36} />,
}) => {
  return (
    <Card style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 1.5rem auto' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </Card>
  );
};

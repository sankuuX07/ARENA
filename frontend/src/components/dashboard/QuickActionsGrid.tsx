import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { QuickActionItem } from '../../services/dashboardService';
import {
  Brain,
  Puzzle,
  MessageSquare,
  Code2,
  ClipboardCheck,
  Video,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface QuickActionsGridProps {
  actions: QuickActionItem[];
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Brain':
      return <Brain size={18} />;
    case 'Puzzle':
      return <Puzzle size={18} />;
    case 'MessageSquare':
      return <MessageSquare size={18} />;
    case 'Code2':
      return <Code2 size={18} />;
    case 'ClipboardCheck':
      return <ClipboardCheck size={18} />;
    case 'Video':
      return <Video size={18} />;
    default:
      return <Zap size={18} />;
  }
};

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div className="arena-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} style={{ color: 'var(--warning)' }} />
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <Badge variant="warning">Direct Practice</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {actions.map((act) => (
          <Card
            key={act.id}
            hoverLift
            style={{
              padding: '1rem',
              background: 'var(--bg-surface-elevated)',
              cursor: 'pointer',
            }}
            onClick={() => navigate(act.path)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                }}
              >
                {getIcon(act.iconName)}
              </div>
              <Badge variant="neutral" style={{ fontSize: '0.68rem' }}>
                {act.category}
              </Badge>
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              {act.title}
            </h3>
            <p className="caption-text" style={{ fontSize: '0.78rem', marginBottom: '0.65rem' }}>
              {act.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
              <span>Launch</span>
              <ArrowRight size={12} />
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

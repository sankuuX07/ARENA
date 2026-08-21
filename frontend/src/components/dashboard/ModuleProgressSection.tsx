import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ModuleProgressItem } from '../../services/dashboardService';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ModuleProgressSectionProps {
  modules: ModuleProgressItem[];
}

export const ModuleProgressSection: React.FC<ModuleProgressSectionProps> = ({ modules }) => {
  const navigate = useNavigate();

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div className="arena-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
          <h2 className="card-title">Module Progress</h2>
        </div>
        <Badge variant="neutral">Placement Modules</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => navigate(mod.path)}
            style={{ cursor: 'pointer' }}
            className="skill-item"
          >
            <div className="skill-info" style={{ marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{mod.name}</span>
                <ChevronRight size={14} style={{ color: 'var(--text-dim)' }} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {mod.progressPercentage}%
              </span>
            </div>
            <div className="skill-track">
              <div className="skill-fill" style={{ width: `${mod.progressPercentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

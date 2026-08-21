import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PerformanceOverviewCard: React.FC = () => {
  const navigate = useNavigate();

  const mockCategories = [
    { name: 'Communication & GD', score: 70, color: 'var(--primary)' },
    { name: 'Aptitude & Logic', score: 50, color: 'var(--secondary)' },
    { name: 'Problem Solving & Coding', score: 80, color: 'var(--warning)' },
    { name: 'Technical Fundamentals', score: 40, color: 'var(--success)' },
  ];

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div className="arena-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={20} style={{ color: 'var(--secondary)' }} />
          <h2 className="card-title">Performance Overview</h2>
        </div>
        <Badge variant="neutral">Visual Demo</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
        {mockCategories.map((cat, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ fontWeight: 500 }}>{cat.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>{cat.score}%</span>
            </div>
            <div className="skill-track" style={{ height: 6 }}>
              <div
                className="skill-fill"
                style={{
                  width: `${cat.score}%`,
                  background: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/assessments')}>
        View Assessments
      </Button>
    </Card>
  );
};

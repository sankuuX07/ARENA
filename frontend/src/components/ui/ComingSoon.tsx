import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Clock, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export interface ComingSoonFeature {
  title: string;
  description: string;
}

export interface ComingSoonProps {
  moduleTitle: string;
  moduleDescription: string;
  icon: React.ReactNode;
  features?: ComingSoonFeature[];
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  moduleTitle,
  moduleDescription,
  icon,
  features = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="placeholder-page-wrapper">
      <Card className="coming-soon-card">
        <div className="coming-soon-icon-ring">{icon}</div>

        <Badge variant="warning" icon={<Clock size={12} />} className="mb-3">
          Coming Soon
        </Badge>

        <h2 className="coming-soon-title">{moduleTitle}</h2>
        <p className="coming-soon-desc">{moduleDescription}</p>

        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>

        {features.length > 0 && (
          <div className="feature-preview-grid">
            {features.map((feat, index) => (
              <div key={index} className="preview-item">
                <div className="preview-item-title">
                  <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                  <span>{feat.title}</span>
                </div>
                <div className="preview-item-desc">{feat.description}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

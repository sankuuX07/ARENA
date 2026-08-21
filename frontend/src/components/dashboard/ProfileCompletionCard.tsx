import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../types';
import { calculateProfileCompletion } from '../../services/dashboardService';

export interface ProfileCompletionCardProps {
  profile: UserProfile | null;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { percentage, isComplete, missingFields } = calculateProfileCompletion(profile);

  if (isComplete) return null; // Hide card if profile is 100% complete

  return (
    <Card
      style={{
        marginBottom: '1.75rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid var(--border-color-glow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            <h3 className="card-title" style={{ fontSize: '1.15rem' }}>
              Complete Your Student Profile
            </h3>
            <Badge variant="warning">{percentage}% Complete</Badge>
          </div>

          <p className="caption-text" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Your profile is {percentage}% complete. Adding missing details (e.g. {missingFields.slice(0, 3).join(', ')}) helps tailor your placement readiness roadmap.
          </p>

          {/* Progress Bar Track */}
          <div className="skill-track" style={{ height: 8, maxWidth: 400 }}>
            <div className="skill-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          onClick={() => navigate('/profile')}
        >
          Complete Profile
        </Button>
      </div>
    </Card>
  );
};

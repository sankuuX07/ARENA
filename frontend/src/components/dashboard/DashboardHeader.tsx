import React from 'react';
import { UserProfile } from '../../types';
import { getTimeOfDayGreeting } from '../../services/dashboardService';
import { Badge } from '../ui/Badge';
import { GraduationCap, Shield } from 'lucide-react';

export interface DashboardHeaderProps {
  profile: UserProfile | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ profile }) => {
  const greeting = getTimeOfDayGreeting();
  const studentName = profile?.fullName || 'Student';

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
        <Badge variant="primary" icon={<Shield size={12} />}>
          ARENA Student Dashboard
        </Badge>
      </div>

      <h1 className="page-title" style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>
        {greeting}, <span className="text-gradient">{studentName}</span> 👋
      </h1>

      <p className="page-header-description" style={{ fontSize: '1.05rem' }}>
        Ready to continue your placement preparation and competitive learning journey?
      </p>

      {profile?.college && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <GraduationCap size={16} style={{ color: 'var(--primary)' }} />
          <span>
            {profile.college} {profile.branch ? `• ${profile.branch}` : ''} {profile.graduationYear ? `(Batch '${profile.graduationYear.slice(-2)})` : ''}
          </span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Competition } from '../../types/competition';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Trophy } from 'lucide-react';

interface Props {
  competition: Competition;
  showStatusBadge?: boolean;
}

export const CompetitionCard: React.FC<Props> = ({ competition, showStatusBadge = true }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'var(--success)';
      case 'upcoming': return 'var(--warning)';
      case 'completed': return 'var(--text-muted)';
      default: return 'var(--border-color)';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'hard': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'easy': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge style={{ background: 'var(--primary)', color: 'white', textTransform: 'uppercase' }}>
            {competition.type}
          </Badge>
          <Badge style={{ border: `1px solid ${getDifficultyColor(competition.difficulty)}`, color: getDifficultyColor(competition.difficulty), background: 'transparent' }}>
            {competition.difficulty.toUpperCase()}
          </Badge>
        </div>
        {showStatusBadge && (
          <Badge style={{ background: getStatusColor(competition.status), color: 'white' }}>
            {competition.status.toUpperCase()}
          </Badge>
        )}
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {competition.title}
      </h3>
      
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
        {competition.description}
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={16} />
          {competition.durationMinutes} mins
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Users size={16} />
          {competition.participantCount} / {competition.maxParticipants}
        </div>
        {competition.status === 'completed' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Trophy size={16} />
            Results
          </div>
        )}
      </div>

      <Button onClick={() => navigate(`/competitions/${competition.competitionId}`)} style={{ width: '100%' }}>
        {competition.status === 'completed' ? 'View Results' : 'View Details'}
      </Button>
    </Card>
  );
};

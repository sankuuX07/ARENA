import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { competitionService } from '../../services/competitionService';
import { Competition } from '../../types/competition';
import { Clock, Users, ArrowLeft, ShieldAlert } from 'lucide-react';

export const CompetitionDetailsPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (competitionId) {
      competitionService.getById(competitionId)
        .then(setCompetition)
        .catch(err => setError(err.response?.data?.detail || "Competition not found"))
        .finally(() => setIsLoading(false));
    }
  }, [competitionId]);

  const handleRegister = async () => {
    if (!competitionId) return;
    setIsRegistering(true);
    try {
      await competitionService.register(competitionId);
      // Reload to update state
      const updated = await competitionService.getById(competitionId);
      setCompetition(updated);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to register");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleJoin = () => {
    navigate(`/competitions/${competitionId}/participate`);
  };

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  if (error || !competition) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Error</h2><p>{error}</p></div>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title={competition.title} 
        subtitle={competition.type.toUpperCase() + " COMPETITION"}
        action={<Button variant="outline" onClick={() => navigate('/competitions')} icon={<ArrowLeft size={16} />}>Back</Button>}
      />

      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Badge style={{ background: 'var(--primary)', color: 'white' }}>{competition.status.toUpperCase()}</Badge>
          <Badge style={{ border: '1px solid var(--border-color)' }}>{competition.difficulty.toUpperCase()}</Badge>
        </div>

        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          {competition.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Start Time</div>
            <div style={{ fontWeight: 'bold' }}>{new Date(competition.startTime).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Duration</div>
            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> {competition.durationMinutes} Minutes
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Participants</div>
            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} /> {competition.participantCount} / {competition.maxParticipants}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Scoring</div>
            <div style={{ fontWeight: 'bold' }}>{competition.rules.scoringMethod.toUpperCase()}</div>
          </div>
        </div>

        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ShieldAlert size={20} /> Rules & Information
        </h3>
        <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          <li>Timer is strictly enforced on the server. Do not refresh unnessarily.</li>
          <li>Auto-saving is enabled, but manual submission before the deadline is recommended.</li>
          <li>Leaderboard is visible: <strong>{competition.rules.leaderboardVisibility.replace('_', ' ')}</strong></li>
          <li>Once submitted, you cannot edit your answers or retry.</li>
        </ul>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          {competition.status === 'upcoming' && (
            <Button onClick={handleRegister} disabled={isRegistering} size="lg">
              {isRegistering ? 'Registering...' : 'Register Now'}
            </Button>
          )}
          
          {competition.status === 'live' && (
            <Button onClick={handleJoin} size="lg" style={{ background: 'var(--success)' }}>
              Join Competition
            </Button>
          )}

          {competition.status === 'completed' && (
            <Button onClick={() => navigate(`/competitions/${competitionId}/result`)} size="lg">
              View Results
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

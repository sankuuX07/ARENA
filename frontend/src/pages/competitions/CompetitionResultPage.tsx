import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { competitionService } from '../../services/competitionService';
import { CompetitionResult } from '../../types/competition';
import { CheckCircle, Trophy, BarChart2, ArrowRight } from 'lucide-react';

export const CompetitionResultPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  
  const [result, setResult] = useState<CompetitionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (competitionId) {
      competitionService.getResult(competitionId)
        .then(setResult)
        .catch(err => setError(err.response?.data?.detail || "Could not load result"))
        .finally(() => setIsLoading(false));
    }
  }, [competitionId]);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  if (error || !result) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Error</h2><p>{error}</p></div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Competition Complete" 
        subtitle="Your answers have been securely submitted."
        icon={<CheckCircle size={32} style={{ color: 'var(--success)' }} />}
      />

      <Card style={{ marginBottom: '2rem', textAlign: 'center', padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {result.score} <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>pts</span>
        </h2>
        
        {result.rank && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.25rem', color: 'var(--warning)', fontWeight: 'bold', marginBottom: '2rem' }}>
            <Trophy size={24} /> Rank: #{result.rank}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Challenges Completed</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{result.challengesCompleted}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Time Used</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatTime(result.timeUsedSeconds)}</div>
          </div>
        </div>

        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
          {result.performanceSummary}
        </p>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Button onClick={() => navigate(`/competitions/${competitionId}/leaderboard`)} icon={<BarChart2 size={16} />}>
          View Leaderboard
        </Button>
        <Button variant="outline" onClick={() => navigate('/analytics')} icon={<ArrowRight size={16} />}>
          View Analytics
        </Button>
      </div>
    </div>
  );
};

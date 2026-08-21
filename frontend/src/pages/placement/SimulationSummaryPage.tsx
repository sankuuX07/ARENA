import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { placementService } from '../../services/placementService';
import { PlacementSimulationSummary } from '../../types/placement';
import { Briefcase, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export const SimulationSummaryPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<PlacementSimulationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!sessionId) return;
      try {
        const data = await placementService.getSummary(sessionId);
        setSummary(data);
      } catch (err) {
        console.error('Failed to load summary', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [sessionId]);

  if (isLoading) return <div className="page-container">Loading summary...</div>;
  if (!summary) return <div className="page-container">Summary not found.</div>;

  const isSuccess = summary.status === 'completed';

  return (
    <div className="page-container">
      <PageHeader
        title="Placement Simulation Complete"
        subtitle={summary.simulationName}
        icon={<Briefcase size={28} />}
        action={
          <Button variant="outline" onClick={() => navigate('/placement')} icon={<ArrowLeft size={16} />}>
            Back to Placement
          </Button>
        }
      />

      <Card style={{ textAlign: 'center', padding: '3rem', marginBottom: '2rem' }}>
        {isSuccess ? (
          <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
        ) : (
          <XCircle size={64} style={{ color: 'var(--danger)', margin: '0 auto 1rem auto' }} />
        )}
        
        <h2 style={{ marginBottom: '0.5rem' }}>Final Status</h2>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: isSuccess ? 'var(--success)' : 'var(--danger)',
          marginBottom: '2rem'
        }}>
          {summary.status.toUpperCase()}
        </div>
        
        <div style={{ color: 'var(--text-muted)' }}>
          Completed At: {new Date(summary.completedAt).toLocaleString()}
        </div>
      </Card>

      <h3 style={{ marginBottom: '1rem' }}>Rounds Overview</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {summary.rounds.map(round => (
          <Card key={round.roundSessionId} style={{ 
            opacity: round.status === 'locked' || round.status === 'not_started' ? 0.6 : 1,
            borderLeft: `4px solid ${round.passed ? 'var(--success)' : round.status === 'failed' ? 'var(--danger)' : 'var(--border-color)'}`
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Round {round.order}
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{round.roundId.split('_')[1]?.toUpperCase()}</h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ 
                fontWeight: 'bold',
                color: round.passed ? 'var(--success)' : round.status === 'failed' ? 'var(--danger)' : 'inherit'
              }}>
                {round.status === 'passed' ? 'PASSED' : round.status === 'failed' ? 'FAILED' : round.status.toUpperCase()}
              </span>
              {round.score !== undefined && round.score !== null && (
                <span style={{ fontWeight: 'bold' }}>{round.score}%</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

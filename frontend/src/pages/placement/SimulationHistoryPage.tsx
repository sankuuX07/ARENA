import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { placementService } from '../../services/placementService';
import { PlacementSimulationSession } from '../../types/placement';
import { EmptyState } from '../../components/ui/EmptyState';
import { Briefcase, ArrowLeft, Clock } from 'lucide-react';

export const SimulationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PlacementSimulationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await placementService.getHistory();
        setHistory(data.sort((a, b) => new Date(b.startedAt!).getTime() - new Date(a.startedAt!).getTime()));
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) return <div className="page-container">Loading history...</div>;

  return (
    <div className="page-container">
      <PageHeader
        title="Simulation History"
        subtitle="Review your past placement simulation attempts."
        icon={<Briefcase size={28} />}
        action={
          <Button variant="outline" onClick={() => navigate('/placement')} icon={<ArrowLeft size={16} />}>
            Back to Placement
          </Button>
        }
      />

      {history.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {history.map(session => {
            const completedRounds = session.rounds.filter(r => ['passed', 'completed', 'failed'].includes(r.status)).length;
            
            return (
              <Card key={session.sessionId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Simulation Attempt</h3>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: session.status === 'completed' ? 'var(--success-light, #d4edda)' : 
                              session.status === 'failed' ? 'var(--danger-light, #f8d7da)' : 
                              'var(--bg-surface-elevated)',
                    color: session.status === 'completed' ? 'var(--success)' : 
                           session.status === 'failed' ? 'var(--danger)' : 
                           'var(--text-main)'
                  }}>
                    {session.status.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <Clock size={16} />
                  {new Date(session.startedAt!).toLocaleDateString()}
                </div>
                
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {completedRounds} / {session.rounds.length} rounds completed
                </div>
                
                <Button 
                  fullWidth 
                  variant="outline"
                  icon={<Clock size={16} />}
                  onClick={() => navigate(`/placement/sessions/${session.sessionId}/summary`)}
                >
                  View Summary
                </Button>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase size={36} />}
          title="No History Found"
          description="You haven't completed or abandoned any placement simulations yet."
          action={<Button onClick={() => navigate('/placement')}>Start a Simulation</Button>}
        />
      )}
    </div>
  );
};

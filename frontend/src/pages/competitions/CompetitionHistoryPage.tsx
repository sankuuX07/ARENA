import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { competitionService } from '../../services/competitionService';
import { CompetitionHistoryItem } from '../../types/competition';
import { History, Trophy, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CompetitionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<CompetitionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    competitionService.getHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <PageHeader 
        title="Competition History" 
        subtitle="Review your past competitive performances."
        icon={<History size={28} />}
      />

      {history.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '4rem' }}>
          <Trophy size={48} style={{ color: 'var(--border-color)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-secondary)' }}>No history yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Participate in a competition to see your history here.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item, idx) => (
            <Card 
              key={idx} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => navigate(`/competitions/${item.competitionId}/result`)}
            >
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Badge style={{ background: 'var(--primary)', color: 'white', textTransform: 'uppercase' }}>
                    {item.type}
                  </Badge>
                  <Badge style={{ border: '1px solid var(--border-color)' }}>
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <Clock size={14} /> Completed: {new Date(item.dateCompleted).toLocaleDateString()}
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {item.score} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>pts</span>
                </div>
                {item.rank && (
                  <div style={{ color: 'var(--warning)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                    <Trophy size={14} /> Rank: #{item.rank}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

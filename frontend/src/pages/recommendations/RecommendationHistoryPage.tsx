import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { recommendationService } from '../../services/recommendationService';
import { RecommendationHistoryItem } from '../../types/recommendation';
import { History, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecommendationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<RecommendationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await recommendationService.getHistory();
        // Sort descending
        setHistory(data.sort((a, b) => new Date(b.resolvedAt).getTime() - new Date(a.resolvedAt).getTime()));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Recommendation History" 
        subtitle="Review your completed and dismissed actions."
        icon={<History size={28} />}
        action={<Button variant="outline" onClick={() => navigate('/recommendations')} icon={<ArrowLeft size={16} />}>Back to Plan</Button>}
      />

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No history found. You haven't completed or dismissed any recommendations yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '0.25rem' }}>
                {item.resolutionType === 'completed' ? (
                  <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />
                ) : (
                  <XCircle size={24} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.recommendation.title}</span>
                  <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--border-color)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {item.resolutionType}
                  </span>
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {item.recommendation.description}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Resolved on: {new Date(item.resolvedAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { interviewEvaluationService } from '../../services/interviewEvaluationService';
import { InterviewHistoryItem } from '../../types/interviewEvaluation';
import { EmptyState } from '../../components/ui/EmptyState';
import { MessageSquare, ArrowLeft, Clock } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const InterviewHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await interviewEvaluationService.getHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading interview history..." size={22} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Interview History"
        subtitle="Review your past AI interview evaluations and feedback."
        icon={<MessageSquare size={28} />}
        action={
          <Button variant="outline" onClick={() => navigate('/interview')} icon={<ArrowLeft size={16} />}>
            Back to Interview Hub
          </Button>
        }
      />

      {history.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {history.map(item => (
            <Card key={item.resultId}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', textTransform: 'capitalize' }}>
                    {item.mode} Interview
                  </h3>
                  {item.topic && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Topic: {item.topic}
                    </div>
                  )}
                </div>
                {item.overallScore !== undefined && item.overallScore !== null ? (
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)', background: 'var(--bg-surface)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {item.overallScore}%
                  </div>
                ) : null}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Clock size={16} />
                {new Date(item.createdAt).toLocaleDateString()}
              </div>

              {item.performanceLevel && (
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                  Performance: <span style={{ color: 'var(--primary)' }}>{item.performanceLevel.replace(/_/g, ' ')}</span>
                </div>
              )}
              
              <Button 
                fullWidth 
                variant="outline"
                onClick={() => navigate(`/interview/results/${item.resultId}`)}
              >
                View Full Result
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<MessageSquare size={36} />}
          title="No History Found"
          description="You haven't completed any AI interviews yet."
          action={<Button onClick={() => navigate('/interview')}>Start an Interview</Button>}
        />
      )}
    </div>
  );
};

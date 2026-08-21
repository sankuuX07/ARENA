import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { History, ArrowLeft, ArrowRight } from 'lucide-react';
import { resumeImprovementService } from '../../services/resumeImprovementService';
import { ResumeImprovementSession } from '../../types/resumeImprovement';

export const ResumeImprovementHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ResumeImprovementSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await resumeImprovementService.getSessions();
        setSessions(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Improvement History" 
        subtitle="Review your past resume improvement sessions and drafts."
        icon={<History size={28} />}
        action={<Button variant="outline" onClick={() => navigate('/resume/improve')} icon={<ArrowLeft size={16} />}>Back</Button>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sessions.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <History size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h3>No history available</h3>
            <p>You haven't started any resume improvement sessions yet.</p>
          </Card>
        ) : (
          sessions.map(session => (
            <Card key={session.sessionId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '1.1rem' }}>
                  {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString()}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>{session.suggestionsCount} Suggestions</span>
                  <span><span style={{ color: 'var(--success)' }}>{session.acceptedCount} Accepted</span></span>
                  <span><span style={{ color: 'var(--danger)' }}>{session.rejectedCount} Rejected</span></span>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate(`/resume/improvement/${session.sessionId}`)} icon={<ArrowRight size={16} />}>
                View Session
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

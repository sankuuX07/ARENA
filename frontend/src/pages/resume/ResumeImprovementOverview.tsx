import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileText, ArrowRight, Activity, ArrowLeft } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { resumeImprovementService } from '../../services/resumeImprovementService';
import { ResumeDetail } from '../../types/resume';
import { ResumeImprovementSession } from '../../types/resumeImprovement';

export const ResumeImprovementOverview: React.FC = () => {
  const { resumeId } = useParams<{ resumeId?: string }>();
  const navigate = useNavigate();
  
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [sessions, setSessions] = useState<ResumeImprovementSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentResume: ResumeDetail | null = null;
        if (resumeId) {
          currentResume = await resumeService.getResumeDetails(resumeId);
        } else {
          currentResume = await resumeService.getActiveResume();
        }
        
        setResume(currentResume);

        if (currentResume) {
          const userSessions = await resumeImprovementService.getSessions();
          setSessions(userSessions.filter(s => s.resumeId === currentResume!.resumeId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [resumeId]);

  const handleStartImprovement = async () => {
    if (!resume) return;
    setIsStarting(true);
    try {
      const activeSession = sessions.find(s => s.status === 'active');
      if (activeSession) {
        navigate(`/resume/improvement/${activeSession.sessionId}`);
        return;
      }
      
      const session = await resumeImprovementService.createSession(resume.resumeId);
      navigate(`/resume/improvement/${session.sessionId}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to start improvement session');
      setIsStarting(false);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;

  if (!resume) {
    return (
      <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--text-muted)' }} />
          <h2>No Resume Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Upload a resume before starting improvement.</p>
          <Button onClick={() => navigate('/resume/upload')}>Upload Resume</Button>
        </Card>
      </div>
    );
  }

  const activeSession = sessions.find(s => s.status === 'active');

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Resume Improvement" 
        subtitle="AI-assisted guidance to rewrite and polish your resume content."
        icon={<Activity size={28} />}
        action={<Button variant="outline" onClick={() => navigate('/resume')} icon={<ArrowLeft size={16} />}>Back to Center</Button>}
      />

      <Card style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Active Resume</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <FileText size={32} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{resume.originalFileName}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}</div>
          </div>
        </div>

        {activeSession ? (
          <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>Resume improvement in progress</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You have an active session with {activeSession.suggestionsCount} total suggestions generated.</div>
            </div>
            <Button onClick={() => navigate(`/resume/improvement/${activeSession.sessionId}`)} icon={<ArrowRight size={16} />}>Continue</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Ready to improve your resume?</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Our AI will analyze your content and provide section-by-section rewriting suggestions.</div>
            </div>
            <Button onClick={handleStartImprovement} disabled={isStarting} icon={<ArrowRight size={16} />}>
              {isStarting ? 'Starting...' : 'Start Improving'}
            </Button>
          </div>
        )}
      </Card>

      {sessions.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="ghost" onClick={() => navigate('/resume/improvement/history')}>View Improvement History</Button>
        </div>
      )}
    </div>
  );
};

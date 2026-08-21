import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CompetitionTimer } from '../../components/competitions/CompetitionTimer';
import { competitionService } from '../../services/competitionService';
import { CompetitionSession, Competition } from '../../types/competition';
import { Save, Send } from 'lucide-react';

export const CompetitionParticipationPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [session, setSession] = useState<CompetitionSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initSession = async () => {
      if (!competitionId) return;
      try {
        const comp = await competitionService.getById(competitionId);
        setCompetition(comp);
        
        let activeSession;
        try {
          activeSession = await competitionService.start(competitionId);
        } catch (e: any) {
          // If we can't start, try to get existing (might already be started)
          activeSession = await competitionService.getSession(competitionId);
        }
        
        if (activeSession.status !== 'active') {
          navigate(`/competitions/${competitionId}/result`);
          return;
        }

        setSession(activeSession);
        setAnswers(activeSession.answers || {});
      } catch (err: any) {
        setError(err.message || "Failed to initialize session");
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, [competitionId, navigate]);

  const handleAnswerChange = (challengeId: string, answer: any) => {
    const newAnswers = { ...answers, [challengeId]: answer };
    setAnswers(newAnswers);
    
    // Debounce save
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveAnswers(newAnswers);
    }, 2000);
  };

  const saveAnswers = async (currentAnswers: Record<string, any>) => {
    if (!competitionId) return;
    setIsSaving(true);
    try {
      await competitionService.updateSession(competitionId, currentAnswers);
    } catch (e) {
      console.error("Autosave failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!competitionId || !session) return;
    
    const uncompleted = competition?.challenges.length || 0 - Object.keys(answers).length;
    if (uncompleted > 0) {
      if (!window.confirm(`You have unanswered questions. Submit anyway?`)) return;
    }

    setIsSubmitting(true);
    try {
      await competitionService.submit(competitionId);
      navigate(`/competitions/${competitionId}/result`);
    } catch (err: any) {
      alert(err.message || "Submission failed");
      setIsSubmitting(false);
    }
  };

  const handleExpire = async () => {
    if (!competitionId) return;
    alert("Time is up! Submitting automatically.");
    setIsSubmitting(true);
    try {
      await competitionService.submit(competitionId);
    } catch (e) {
      console.error(e);
    } finally {
      navigate(`/competitions/${competitionId}/result`);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  if (error || !competition || !session) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Error</h2><p>{error}</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-main)' }}>
      
      {/* Header / Navbar */}
      <div style={{ padding: '1rem 2rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{competition.title}</h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{competition.type.toUpperCase()} COMPETITION</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isSaving ? 'var(--warning)' : 'var(--success)', fontSize: '0.9rem' }}>
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Saved'}
          </div>
          
          <CompetitionTimer expiresAt={session.expiresAt} onExpire={handleExpire} />
          
          <Button onClick={handleSubmit} disabled={isSubmitting} icon={<Send size={16} />}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Mockup for displaying challenges reusing existing systems in production */}
          <Card style={{ marginBottom: '2rem', padding: '2rem', textAlign: 'center', border: '2px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              [In a full implementation, this area mounts the existing CodingEditor or AptitudeQuestion UI based on `competition.type`.]
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              For M38 validation, simulate answering by clicking the mock button below to trigger autosave and test the submission flow.
            </p>
            <Button variant="outline" onClick={() => handleAnswerChange('mock_q1', 'option_A')} style={{ marginTop: '1rem' }}>
              Simulate Answering a Question
            </Button>
          </Card>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
             <div>Answered: {Object.keys(answers).length} / {competition.challenges.length}</div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { startTechnicalSession, completeTechnicalSession, TechnicalSession, TechnicalLanguage, TechnicalDifficulty } from '../../services/technicalService';
import { recordStudentActivity } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';

export const TechnicalSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [session, setSession] = useState<TechnicalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Note: For Milestone 21, the session is purely structural with 1 question.
  // In full implementation, we'll iterate through `session.questions`.

  useEffect(() => {
    if (sessionId === 'new') {
      initSession();
    }
  }, [sessionId]);

  const initSession = async () => {
    try {
      setLoading(true);
      const language = searchParams.get('language') as TechnicalLanguage;
      const topic = searchParams.get('topic') || '';
      const difficulty = searchParams.get('difficulty') as TechnicalDifficulty;
      
      const newSession = await startTechnicalSession(language, topic, difficulty, 1);
      setSession(newSession);
      // For a real app, we'd navigate to replace '/new' with the actual ID, but keeping it simple for foundation
    } catch (err: any) {
      setError(err.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!session || selectedOption === null || !currentUser) return;
    
    const q = session.questions[session.currentQuestionIndex];
    const isCorrect = selectedOption === q.correctOption;
    const score = isCorrect ? 100 : 0;
    
    try {
      setLoading(true);
      await completeTechnicalSession(session.sessionId, score);
      
      // Update Progress Engine
      await recordStudentActivity(currentUser.uid, {
        module: 'technical',
        activityType: 'quiz', // Using quiz as a proxy for MCQ tech questions
        topic: session.topic,
        difficulty: session.difficulty,
        status: 'completed',
        isCorrect: isCorrect,
        score: score
      });
      
      navigate('/technical');
    } catch (err: any) {
      setError(err.message || 'Failed to complete session');
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Generating Technical Session...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--error)' }}>{error}</div>;
  if (!session || session.questions.length === 0) return null;

  const currentQ = session.questions[session.currentQuestionIndex];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Practice: <span style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{session.language} / {session.topic.replace('_', ' ')}</span>
        </h2>
        <div style={{ fontWeight: 600 }}>Question {session.currentQuestionIndex + 1} of {session.questionCount}</div>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {currentQ.question}
        </div>
        
        {currentQ.codeSnippet && (
          <pre style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            <code>{currentQ.codeSnippet}</code>
          </pre>
        )}

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {currentQ.options?.map((opt, idx) => (
            <div 
              key={idx}
              onClick={() => !showExplanation && setSelectedOption(idx)}
              style={{
                padding: '1rem',
                border: `2px solid ${selectedOption === idx ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                cursor: showExplanation ? 'default' : 'pointer',
                background: selectedOption === idx ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${selectedOption === idx ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedOption === idx && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />}
              </div>
              <span style={{ fontSize: '1rem' }}>{opt}</span>
              
              {showExplanation && idx === currentQ.correctOption && (
                <CheckCircle size={20} color="var(--success)" style={{ marginLeft: 'auto' }} />
              )}
              {showExplanation && selectedOption === idx && idx !== currentQ.correctOption && (
                <XCircle size={20} color="var(--error)" style={{ marginLeft: 'auto' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div style={{ padding: '1.5rem', background: selectedOption === currentQ.correctOption ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${selectedOption === currentQ.correctOption ? 'var(--success)' : 'var(--error)'}`, borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', color: selectedOption === currentQ.correctOption ? 'var(--success)' : 'var(--error)' }}>
            {selectedOption === currentQ.correctOption ? 'Correct!' : 'Incorrect'}
          </h3>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{currentQ.explanation}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        {!showExplanation ? (
          <Button variant="primary" disabled={selectedOption === null} onClick={() => setShowExplanation(true)}>
            Submit Answer
          </Button>
        ) : (
          <Button variant="primary" onClick={handleComplete}>
            Complete Session
          </Button>
        )}
      </div>
    </div>
  );
};

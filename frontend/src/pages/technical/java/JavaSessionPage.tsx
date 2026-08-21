import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { startJavaSession, completeJavaSession } from '../../../services/javaService';
import { TechnicalSession, TechnicalDifficulty, TechnicalQuestionType } from '../../../services/technicalService';
import { recordStudentActivity } from '../../../services/progressService';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export const JavaSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [session, setSession] = useState<TechnicalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (sessionId === 'new') {
      initSession();
    }
  }, [sessionId]);

  const initSession = async () => {
    try {
      setLoading(true);
      const topic = searchParams.get('topic') || '';
      const difficulty = searchParams.get('difficulty') as TechnicalDifficulty;
      const qType = searchParams.get('qType') as TechnicalQuestionType;
      const count = parseInt(searchParams.get('count') || '5', 10);
      
      const newSession = await startJavaSession(topic, difficulty, qType, count);
      setSession(newSession);
    } catch (err: any) {
      setError(err.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!session || selectedOption === null || !currentUser) return;
    
    const q = session.questions[currentIndex];
    const isCorrect = selectedOption === q.correctOption;
    if (isCorrect) setScore(s => s + 1);

    if (currentIndex + 1 < session.questionCount) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Complete Session
      const finalScore = score + (isCorrect ? 1 : 0);
      try {
        setLoading(true);
        await completeJavaSession(session.sessionId, finalScore);
        
        await recordStudentActivity(currentUser.uid, {
          module: 'technical',
          activityType: 'quiz',
          topic: session.topic,
          difficulty: session.difficulty,
          status: 'completed',
          isCorrect: (finalScore / session.questionCount) > 0.5,
          score: Math.round((finalScore / session.questionCount) * 100)
        });
        
        navigate('/technical/java/result', { state: { result: { score: finalScore, total: session.questionCount, topic: session.topic } }});
      } catch (err: any) {
        setError(err.message || 'Failed to complete session');
        setLoading(false);
      }
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Generating Java Programming Questions...<br/><small style={{color:'var(--text-secondary)'}}>(This may take a moment for larger sets)</small></div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--error)' }}>{error}</div>;
  if (!session || session.questions.length === 0) return null;

  const currentQ = session.questions[currentIndex];
  const isConceptual = !currentQ.options || currentQ.options.length === 0;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Practice: <span style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>Java / {session.topic.replace('_', ' ')}</span>
        </h2>
        <div style={{ fontWeight: 600 }}>Question {currentIndex + 1} of {session.questionCount}</div>
      </div>
      
      <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--primary)', width: `${((currentIndex) / session.questionCount) * 100}%`, transition: 'width 0.3s' }} />
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

        {!isConceptual && (
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
        )}
      </div>

      {showExplanation && (
        <div style={{ padding: '1.5rem', background: (isConceptual || selectedOption === currentQ.correctOption) ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${(isConceptual || selectedOption === currentQ.correctOption) ? 'var(--success)' : 'var(--error)'}`, borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
          {!isConceptual && (
            <h3 style={{ margin: '0 0 0.5rem', color: selectedOption === currentQ.correctOption ? 'var(--success)' : 'var(--error)' }}>
              {selectedOption === currentQ.correctOption ? 'Correct!' : 'Incorrect'}
            </h3>
          )}
          <p style={{ margin: 0, lineHeight: 1.5 }}>{currentQ.explanation}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        {!showExplanation ? (
          <Button variant="primary" disabled={!isConceptual && selectedOption === null} onClick={() => setShowExplanation(true)}>
            {isConceptual ? 'Show Answer' : 'Submit Answer'}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext} icon={<ArrowRight size={16} />}>
            {currentIndex + 1 < session.questionCount ? 'Next Question' : 'Complete Session'}
          </Button>
        )}
      </div>
    </div>
  );
};

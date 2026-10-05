import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  startTechnicalSession,
  completeTechnicalSession,
  submitTechnicalAnswer,
  TechnicalSession,
  TechnicalLanguage,
  TechnicalDifficulty,
  TechnicalAnswerResponse,
} from '../../services/technicalService';
import { recordStudentActivity } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { CheckCircle, XCircle, ChevronRight, Flag } from 'lucide-react';

export const TechnicalSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [session, setSession] = useState<TechnicalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Per-question state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerData, setAnswerData] = useState<TechnicalAnswerResponse | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

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
      const count = parseInt(searchParams.get('count') || '5', 10);

      const newSession = await startTechnicalSession(language, topic, difficulty, count);
      setSession(newSession);
    } catch (err: any) {
      setError(err.message || 'Failed to start session. Please check if the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || selectedOption === null || submittingAnswer) return;
    const q = session.questions[currentIndex];
    try {
      setSubmittingAnswer(true);
      const data = await submitTechnicalAnswer(session.sessionId, q.questionId, selectedOption);
      setAnswerData(data);
      setShowExplanation(true);
    } catch (e: any) {
      setError(e.message || 'Failed to submit answer.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleNext = () => {
    if (!session) return;
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setAnswerData(null);
      setShowExplanation(false);
    }
  };

  const handleComplete = async () => {
    if (!session || !currentUser) return;
    try {
      setLoading(true);
      const result = await completeTechnicalSession(session.sessionId);
      const accuracy = result.totalQuestions > 0
        ? Math.round((result.score / result.totalQuestions) * 100)
        : 0;

      await recordStudentActivity(currentUser.uid, {
        module: 'technical',
        activityType: 'quiz',
        topic: session.topic,
        difficulty: session.difficulty,
        status: 'completed',
        isCorrect: accuracy >= 50,
        score: accuracy,
      });

      navigate('/technical');
    } catch (err: any) {
      setError(err.message || 'Failed to complete session.');
      setLoading(false);
    }
  };

  // ── Loading / Error States ─────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Generating Technical Questions...</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Asking Gemma AI — this may take 15–30 seconds.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ color: 'var(--error)', fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Ensure Ollama is running: <code>ollama serve</code>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  if (!session || session.questions.length === 0) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--error)' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Could not load session questions.</div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The AI may be busy or unavailable. Please try again.
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const currentQ = session.questions[currentIndex];
  const isLastQuestion = currentIndex === session.questions.length - 1;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Practice:{' '}
          <span style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>
            {session.language} / {session.topic.replace(/_/g, ' ')}
          </span>
        </h2>
        <div style={{ fontWeight: 600 }}>
          Question {currentIndex + 1} of {session.questionCount}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'var(--primary)',
          borderRadius: '4px',
          width: `${((currentIndex + 1) / session.questionCount) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Question Card */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '1.15rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {currentQ.question}
        </div>

        {currentQ.codeSnippet && (
          <pre style={{
            background: 'var(--bg-surface-elevated)',
            padding: '1rem',
            borderRadius: '4px',
            overflowX: 'auto',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)',
            fontSize: '0.9rem',
          }}>
            <code>{currentQ.codeSnippet}</code>
          </pre>
        )}

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {currentQ.options?.map((opt, idx) => {
            let borderColor = 'var(--border-color)';
            let bg = 'transparent';
            if (showExplanation && answerData) {
              if (idx === answerData.correctOption) {
                borderColor = 'var(--success)';
                bg = 'rgba(34,197,94,0.07)';
              } else if (selectedOption === idx && idx !== answerData.correctOption) {
                borderColor = 'var(--error)';
                bg = 'rgba(239,68,68,0.07)';
              }
            } else if (selectedOption === idx) {
              borderColor = 'var(--primary)';
              bg = 'rgba(59,130,246,0.05)';
            }
            return (
              <div
                key={idx}
                onClick={() => !showExplanation && setSelectedOption(idx)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${borderColor}`,
                  borderRadius: '8px',
                  cursor: showExplanation ? 'default' : 'pointer',
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${selectedOption === idx && !showExplanation ? 'var(--primary)' : 'var(--text-muted)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedOption === idx && !showExplanation && (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />
                  )}
                </div>
                <span style={{ fontSize: '1rem', flex: 1 }}>{opt}</span>
                {showExplanation && idx === answerData?.correctOption && (
                  <CheckCircle size={20} color="var(--success)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                )}
                {showExplanation && selectedOption === idx && idx !== answerData?.correctOption && (
                  <XCircle size={20} color="var(--error)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation Panel */}
      {showExplanation && answerData && (
        <div style={{
          padding: '1.5rem',
          background: selectedOption === answerData.correctOption
            ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${selectedOption === answerData.correctOption ? 'var(--success)' : 'var(--error)'}`,
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{
            margin: '0 0 0.5rem',
            color: selectedOption === answerData.correctOption ? 'var(--success)' : 'var(--error)',
          }}>
            {selectedOption === answerData.correctOption ? '✓ Correct!' : '✗ Incorrect'}
          </h3>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{answerData.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        {!showExplanation ? (
          <Button
            variant="primary"
            disabled={selectedOption === null || submittingAnswer}
            loading={submittingAnswer}
            onClick={handleSubmitAnswer}
          >
            Submit Answer
          </Button>
        ) : isLastQuestion ? (
          <Button variant="primary" icon={<Flag size={16} />} onClick={handleComplete}>
            Finish Session
          </Button>
        ) : (
          <Button variant="primary" icon={<ChevronRight size={16} />} onClick={handleNext}>
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

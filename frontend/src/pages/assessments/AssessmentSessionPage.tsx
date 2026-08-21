import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, ArrowLeft, Bookmark, CheckCircle, AlertTriangle } from 'lucide-react';
import { 
  getAssessmentSession, 
  saveAssessmentAnswer, 
  submitAssessment, 
  getAssessmentSessionStatus,
  AssessmentSession,
  AssessmentAnswer
} from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';
import { CodeEditor } from '../../components/puzzles/CodeEditor';
import { VoiceInput } from '../../components/communication/VoiceInput';

export const AssessmentSessionPage: React.FC = () => {
  const { sessionId, assessmentId } = useParams<{ sessionId: string, assessmentId: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
    return () => clearTimer();
  }, [sessionId]);

  const loadSession = async (id: string) => {
    try {
      const data = await getAssessmentSession(id);
      if (data.status === 'submitted' || data.status === 'evaluated') {
        if (data.metadata?.resultId) {
          navigate(`/assessments/results/${data.metadata.resultId}`, { replace: true });
        } else {
          navigate('/assessments', { replace: true });
        }
        return;
      }
      setSession(data);
      
      // Calculate initial time left from server expiration
      if (data.expiresAt) {
        const expires = new Date(data.expiresAt).getTime();
        const now = new Date().getTime();
        const remain = Math.max(0, Math.floor((expires - now) / 1000));
        setTimeLeft(remain);
        startTimer(expires);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to load session');
      navigate(`/assessments/${assessmentId}`);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (expiresMs: number) => {
    clearTimer();
    timerRef.current = window.setInterval(async () => {
      const now = new Date().getTime();
      const remain = Math.max(0, Math.floor((expiresMs - now) / 1000));
      setTimeLeft(remain);
      
      if (remain <= 0) {
        clearTimer();
        await handleAutoSubmit();
      } else if (remain % 60 === 0) {
        // Sync with server every minute
        syncStatus();
      }
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const syncStatus = async () => {
    if (!sessionId) return;
    try {
      const status = await getAssessmentSessionStatus(sessionId);
      if (status.status === 'expired' || status.status === 'submitted') {
        clearTimer();
        alert('Session has expired or been submitted remotely.');
        navigate('/assessments');
      }
    } catch (err) {
      console.error('Failed to sync status', err);
    }
  };

  const handleAutoSubmit = async () => {
    if (!sessionId) return;
    try {
      setSubmitting(true);
      const res = await submitAssessment(sessionId);
      alert('Time expired. Assessment automatically submitted.');
      if (res.metadata?.resultId) {
        navigate(`/assessments/results/${res.metadata.resultId}`, { replace: true });
      } else {
        navigate('/assessments', { replace: true });
      }
    } catch (err) {
      console.error(err);
      navigate('/assessments');
    }
  };

  const handleManualSubmit = async () => {
    if (!sessionId) return;
    try {
      setSubmitting(true);
      const res = await submitAssessment(sessionId);
      if (res.metadata?.resultId) {
        navigate(`/assessments/results/${res.metadata.resultId}`, { replace: true });
      } else {
        navigate('/assessments', { replace: true });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit');
      setSubmitting(false);
    }
  };

  const handleOptionSelect = async (optIndex: number) => {
    await saveCurrentAnswer({ selectedOption: optIndex });
  };

  const handleTextResponse = async (text: string) => {
    await saveCurrentAnswer({ textResponse: text });
  };

  const saveCurrentAnswer = async (updates: Partial<AssessmentAnswer>) => {
    if (!session || !sessionId) return;
    const q = session.questions[currentIndex];
    
    // Optimistic update
    const updatedAnswers = [...session.answers];
    const existingIdx = updatedAnswers.findIndex(a => a.questionId === q.questionId);
    
    const newState = 'answered';

    if (existingIdx >= 0) {
      updatedAnswers[existingIdx] = { ...updatedAnswers[existingIdx], ...updates, state: newState };
    } else {
      updatedAnswers.push({ sessionId, questionId: q.questionId, selectedOption: null, textResponse: undefined, ...updates, state: newState });
    }
    
    setSession({ ...session, answers: updatedAnswers });
    
    // Background save
    try {
      const a = updatedAnswers.find(x => x.questionId === q.questionId)!;
      await saveAssessmentAnswer(sessionId, {
        questionId: a.questionId,
        selectedOption: a.selectedOption,
        textResponse: a.textResponse,
        state: a.state
      });
    } catch (err) {
      console.error("Failed to save answer", err);
    }
  };

  const toggleReviewMark = async () => {
    if (!session || !sessionId) return;
    const q = session.questions[currentIndex];
    
    const updatedAnswers = [...session.answers];
    const existingIdx = updatedAnswers.findIndex(a => a.questionId === q.questionId);
    
    let newState: 'answered' | 'marked_for_review' = 'marked_for_review';
    
    if (existingIdx >= 0) {
      const current = updatedAnswers[existingIdx];
      newState = current.state === 'marked_for_review' ? (current.selectedOption !== null ? 'answered' : 'unanswered' as any) : 'marked_for_review';
      updatedAnswers[existingIdx] = { ...current, state: newState };
    } else {
      updatedAnswers.push({ sessionId, questionId: q.questionId, selectedOption: null, state: 'marked_for_review' });
    }
    
    setSession({ ...session, answers: updatedAnswers });
    
    try {
      const a = updatedAnswers.find(x => x.questionId === q.questionId)!;
      await saveAssessmentAnswer(sessionId, {
        questionId: a.questionId,
        selectedOption: a.selectedOption,
        textResponse: a.textResponse,
        state: a.state
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading || !session) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Session...</div>;

  const currentQ = session.questions[currentIndex];
  const currentAnswer = session.answers.find((a: AssessmentAnswer) => a.questionId === currentQ.questionId);
  
  const answeredCount = session.answers.filter((a: AssessmentAnswer) => a.selectedOption !== null || a.textResponse).length;
  const reviewCount = session.answers.filter((a: AssessmentAnswer) => a.state === 'marked_for_review').length;
  const unansweredCount = session.questions.length - answeredCount;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Technical Assessment</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: (timeLeft && timeLeft < 300) ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface-elevated)', padding: '0.5rem 1rem', borderRadius: '20px', color: (timeLeft && timeLeft < 300) ? 'var(--error)' : 'var(--text-main)', border: `1px solid ${(timeLeft && timeLeft < 300) ? 'var(--error)' : 'var(--border-color)'}` }}>
            <Clock size={16} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem', fontVariantNumeric: 'tabular-nums' }}>
              {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
            </span>
          </div>
          <Button variant="primary" onClick={() => setShowSubmitConfirm(true)}>Submit Assessment</Button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left: Navigator */}
        <div style={{ width: '300px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Navigator</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {session.questions.map((q: any, idx: number) => {
                const ans = session.answers.find((a: AssessmentAnswer) => a.questionId === q.questionId);
                const isCurrent = idx === currentIndex;
                const isAnswered = ans && (ans.selectedOption !== null || !!ans.textResponse);
                const isReview = ans && ans.state === 'marked_for_review';
                
                let bg = 'var(--bg-surface-elevated)';
                let color = 'var(--text-main)';
                let border = '1px solid var(--border-color)';
                
                if (isCurrent) {
                  border = '1px solid var(--primary)';
                  bg = 'rgba(59, 130, 246, 0.1)';
                  color = 'var(--primary)';
                } else if (isReview) {
                  bg = 'rgba(234, 179, 8, 0.1)';
                  border = '1px solid var(--warning)';
                  color = 'var(--warning)';
                } else if (isAnswered) {
                  bg = 'rgba(34, 197, 94, 0.1)';
                  border = '1px solid var(--success)';
                  color = 'var(--success)';
                }

                return (
                  <button
                    key={q.questionId}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '4px',
                      background: bg, border: border, color: color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--success)', borderRadius: '2px' }} /> Answered ({answeredCount})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid var(--warning)', borderRadius: '2px' }} /> Marked for Review ({reviewCount})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '2px' }} /> Unanswered ({unansweredCount})
            </div>
          </div>
        </div>

        {/* Right: Question Area */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Question {currentIndex + 1} of {session.questions.length}</h2>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Marks: +{currentQ.marks}</span>
                {currentQ.negativeMarks > 0 && <span>Penalty: -{currentQ.negativeMarks}</span>}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {currentQ.questionText}
              </div>

              {currentQ.codeSnippet && (
                <pre style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '4px', overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}

              {currentQ.type === 'mcq' && (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {currentQ.options?.map((opt: string, idx: number) => {
                    const isSelected = currentAnswer?.selectedOption === idx;
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        style={{
                          padding: '1rem',
                          border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                        </div>
                        <span style={{ fontSize: '1rem' }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQ.type === 'coding' && (
                <div style={{ height: '400px', marginTop: '1rem' }}>
                  <CodeEditor 
                    language={currentQ.metadata?.language || 'python'}
                    value={currentAnswer?.textResponse || currentQ.metadata?.starterCode || ''}
                    onChange={handleTextResponse}
                  />
                  <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Your code is automatically saved. Background evaluation will run upon submission.
                  </div>
                </div>
              )}

              {currentQ.type === 'communication' && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <textarea 
                    value={currentAnswer?.textResponse || ''}
                    onChange={(e) => handleTextResponse(e.target.value)}
                    placeholder="Type your response here or use Voice Input..."
                    style={{
                      width: '100%', height: '120px', padding: '1rem',
                      background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)',
                      borderRadius: '8px', color: 'var(--text-main)', resize: 'vertical'
                    }}
                  />
                  {currentQ.metadata?.mode === 'voice' && (
                    <VoiceInput onSpeechResult={(text) => handleTextResponse((currentAnswer?.textResponse ? currentAnswer.textResponse + ' ' : '') + text)} />
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outline" 
                icon={<ArrowLeft size={16} />} 
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button 
                  variant={currentAnswer?.state === 'marked_for_review' ? 'primary' : 'outline'} 
                  icon={<Bookmark size={16} />} 
                  onClick={toggleReviewMark}
                >
                  {currentAnswer?.state === 'marked_for_review' ? 'Unmark Review' : 'Mark for Review'}
                </Button>
                
                <Button 
                  variant="primary" 
                  onClick={() => setCurrentIndex(i => Math.min(session.questions.length - 1, i + 1))}
                  disabled={currentIndex === session.questions.length - 1}
                >
                  Next <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle color="var(--warning)" /> Submit Assessment?
            </h2>
            
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Answered</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>{answeredCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Marked for Review</span>
                <span style={{ fontWeight: 600, color: 'var(--warning)' }}>{reviewCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Unanswered</span>
                <span style={{ fontWeight: 600 }}>{unansweredCount}</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Once you submit, you will not be able to change your answers. Are you sure you want to finish?
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} disabled={submitting}>Cancel</Button>
              <Button variant="primary" onClick={handleManualSubmit} disabled={submitting} icon={<CheckCircle size={16} />}>
                {submitting ? 'Submitting...' : 'Confirm Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

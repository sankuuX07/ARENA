import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  getInterviewSession, 
  respondToInterview, 
  endInterviewSession, 
  InterviewSession, 
  InterviewMessage
} from '../../services/interviewService';
import { interviewEvaluationService } from '../../services/interviewEvaluationService';
import { Button } from '../../components/ui/Button';
import { MessageBubble } from '../../components/communication/MessageBubble';
import { TypingIndicator } from '../../components/communication/TypingIndicator';
import { VoiceInput } from '../../components/communication/VoiceInput';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Clock } from 'lucide-react';

export const InterviewSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [textInput, setTextInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) {
      getInterviewSession(sessionId)
        .then(data => {
          setSession(data);
          if (data.expiresAt) {
            const exp = new Date(data.expiresAt).getTime();
            const remain = Math.max(0, Math.floor((exp - Date.now()) / 1000));
            setTimeLeft(remain);
          }
        })
        .catch(err => {
          console.error(err);
          navigate('/interview');
        })
        .finally(() => setLoading(false));
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleEndInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [session?.messages, processing]);

  const handleEndInterview = async () => {
    if (!sessionId) return;
    if (window.confirm("Are you sure you want to end the interview?")) {
      try {
        await endInterviewSession(sessionId);
        triggerEvaluation(sessionId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const triggerEvaluation = async (id: string) => {
    setEvaluating(true);
    try {
      const result = await interviewEvaluationService.evaluateSession(id);
      
      // If we came from a placement round, we need to pass back the resultReference
      const locationState = location.state as any;
      if (locationState && locationState.placementSessionId) {
        navigate(`/placement/sessions/${locationState.placementSessionId}`, {
          state: {
            completedRoundRef: result.resultId,
            roundId: locationState.placementRoundId
          }
        });
      } else {
        navigate(`/interview/results/${result.resultId}`);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
      alert('Failed to evaluate interview. Please try checking your history later.');
      navigate('/interview');
    } finally {
      setEvaluating(false);
    }
  };

  const submitResponse = async (content: string) => {
    if (!content.trim() || processing || !sessionId || !session) return;
    if (session.status !== 'in_progress') return;

    setProcessing(true);
    const mode = session.responseMode;
    
    // Optimistic UI update for student
    const tempMsg: InterviewMessage = {
      messageId: `temp_${Date.now()}`,
      sessionId,
      role: 'student',
      content,
      timestamp: new Date().toISOString()
    };
    
    setSession(prev => prev ? { ...prev, messages: [...prev.messages, tempMsg] } : prev);
    setTextInput('');

    try {
      const res = await respondToInterview(sessionId, { responseMode: mode, content });
      setSession(prev => {
        if (!prev) return prev;
        const newMessages = prev.messages.filter(m => !m.messageId.startsWith('temp_'));
        newMessages.push(res.studentMessage, res.interviewerMessage);
        return {
          ...prev,
          messages: newMessages,
          status: res.sessionStatus as any,
          difficulty: res.currentDifficulty
        };
      });
      if (res.sessionStatus === 'completed') {
        triggerEvaluation(sessionId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to communicate with AI interviewer.');
      // Revert optimistic update
      setSession(prev => {
        if (!prev) return prev;
        return { ...prev, messages: prev.messages.filter(m => !m.messageId.startsWith('temp_')) };
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleVoiceSubmit = (transcript: string) => {
    submitResponse(transcript);
  };

  if (loading) return <LoadingSpinner />;
  if (evaluating) return (
    <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner message="Analyzing your interview performance..." size={22} />
    </div>
  );
  if (!session) return <div>Session not found</div>;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h2 style={{ margin: 0 }}>ARENA AI Interviewer</h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {session.mode.toUpperCase()} Interview {session.topic && `• ${session.topic}`} • {session.difficulty}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: timeLeft < 120 ? 'var(--error)' : 'var(--text-primary)' }}>
            <Clock size={20} /> {formatTime(timeLeft)}
          </div>
          <Button onClick={handleEndInterview} variant="outline" size="sm" disabled={session.status !== 'in_progress'}>
            End Interview
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatRef}
        style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-background)' }}
      >
        {session.messages.map((msg) => (
          <MessageBubble 
            key={msg.messageId}
            message={{
              messageId: msg.messageId,
              sessionId: msg.sessionId,
              role: msg.role === 'interviewer' ? 'system' : 'student',
              content: msg.content,
              timestamp: msg.timestamp
            } as any}
          />
        ))}
        {processing && <TypingIndicator />}
        {session.status !== 'in_progress' && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Interview {session.status}
          </div>
        )}
      </div>

      {/* Input Area */}
      {session.status === 'in_progress' && (
        <div style={{ padding: '1rem 2rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
          {session.responseMode === 'voice' ? (
            <VoiceInput 
              onSpeechResult={handleVoiceSubmit} 
              disabled={processing} 
            />
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                value={textInput} 
                onChange={e => setTextInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && submitResponse(textInput)}
                placeholder="Type your answer here..."
                disabled={processing}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '24px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
              />
              <Button onClick={() => submitResponse(textInput)} disabled={!textInput.trim() || processing} variant="primary">
                Send
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

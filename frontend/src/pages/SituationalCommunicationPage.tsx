import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  startSituationalSession,
  submitSituationalTurn,
  completeSituationalSession,
  getSituationalSessionHistory,
  SituationalEvaluationData,
  SituationalHistoryItem,
  SituationalStartResponseData,
} from '../services/situationalCommunicationService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VoiceInput } from '../components/communication/VoiceInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Send,
  CheckCircle2,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: 'college_situation', label: 'College Situation' },
  { id: 'team_situation', label: 'Team Situation' },
  { id: 'workplace_situation', label: 'Workplace Situation' },
  { id: 'manager_situation', label: 'Manager Situation' },
  { id: 'customer_situation', label: 'Customer Situation' },
  { id: 'conflict_situation', label: 'Conflict Situation' },
  { id: 'interview_situation', label: 'Interview Situation' },
  { id: 'leadership_situation', label: 'Leadership Situation' },
  { id: 'problem_solving_situation', label: 'Problem-Solving Situation' },
  { id: 'professional_etiquette', label: 'Professional Etiquette' },
];

export const SituationalCommunicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Session State
  const [session, setSession] = useState<SituationalStartResponseData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_OPTIONS[0].id);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Turn State
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [turnEvaluations, setTurnEvaluations] = useState<SituationalEvaluationData[]>([]);
  const [latestEvaluation, setLatestEvaluation] = useState<SituationalEvaluationData | null>(null);

  // Status & History
  const [loading, setLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<any | null>(null);
  const [history, setHistory] = useState<SituationalHistoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadHistoryData(currentUser.uid);
    }
  }, [currentUser]);

  const loadHistoryData = async (uid: string) => {
    try {
      const hist = await getSituationalSessionHistory(uid);
      setHistory(hist);
    } catch (e) {
      console.error('[SituationalCommunicationPage] Error loading history:', e);
    }
  };

  const handleStartSession = async () => {
    if (!currentUser) return;
    setLoading(true);
    setErrorMessage(null);
    setIsSessionComplete(false);
    setFinalResult(null);
    setTurnEvaluations([]);
    setLatestEvaluation(null);
    setCurrentTurn(1);

    try {
      const data = await startSituationalSession(currentUser.uid, selectedCategory, difficulty);
      setSession(data);
      setCurrentPrompt(data.scenario);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start Situational session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTurn = async () => {
    if (!currentUser || !session || !responseText.trim() || isEvaluating) return;

    if (responseText.trim().length < 5) {
      setErrorMessage('Please explain how you would respond in this situation.');
      return;
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const data = await submitSituationalTurn(
        currentUser.uid,
        session.session_id,
        responseText.trim(),
        currentTurn,
        session.category,
        session.difficulty
      );

      const updatedEvals = [...turnEvaluations, data.evaluation];
      setTurnEvaluations(updatedEvals);
      setLatestEvaluation(data.evaluation);
      setResponseText('');

      if (data.is_completed || currentTurn >= 5) {
        const completion = await completeSituationalSession(
          currentUser.uid,
          session.session_id,
          session.category,
          session.difficulty,
          updatedEvals
        );
        setFinalResult(completion);
        setIsSessionComplete(true);
        loadHistoryData(currentUser.uid);
      } else {
        setCurrentTurn((prev) => prev + 1);
        setCurrentPrompt(data.next_prompt);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to evaluate response. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitTurn();
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Generating situation..." size={22} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto', width: '100%' }}>
      <PageHeader
        title="Situational Communication"
        description="Practice real-world workplace, team, and placement situations."
        icon={<Sparkles size={24} />}
        action={
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/communication')}
          >
            Communication Landing
          </Button>
        }
      />

      {errorMessage && (
        <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
          <div className="error-alert-header">
            <AlertCircle size={18} />
            <span className="error-title">Error</span>
          </div>
          <div className="error-message" style={{ marginBottom: 0 }}>
            {errorMessage}
          </div>
        </div>
      )}

      {/* VIEW 1: Setup & History */}
      {!session && !isSessionComplete && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <Card style={{ gridColumn: 'span 2' }}>
            <div className="arena-card-header" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} style={{ color: 'var(--primary)' }} />
                <h2 className="card-title">Setup Practice Session</h2>
              </div>
              <Badge variant="primary">5-Turn Session</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                  Select Scenario Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                  }}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                  Select Difficulty
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: difficulty === level ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: difficulty === level ? 'var(--primary-light)' : 'var(--bg-surface-elevated)',
                        color: difficulty === level ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="primary" fullWidth size="lg" onClick={handleStartSession}>
              Generate Situation & Start
            </Button>
          </Card>

          <Card style={{ gridColumn: 'span 2' }}>
            <div className="arena-card-header" style={{ marginBottom: '1.25rem' }}>
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Session History</h3>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Complete more sessions to see your progress.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {history.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                        {CATEGORY_OPTIONS.find(c => c.id === h.category)?.label || h.category}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {h.dateStr} • {h.difficulty}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {h.score}/100
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* VIEW 2: Active Session (Turns 1-5) */}
      {session && !isSessionComplete && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Situational Practice</h2>
            <Badge variant="neutral">Interaction {currentTurn} of 5</Badge>
          </div>

          <Card style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              SITUATION
            </div>
            <div style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
              {currentPrompt}
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Your Response:
              </div>
              <textarea
                rows={5}
                placeholder="How would you respond in this situation? (Type or speak)"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isEvaluating}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <VoiceInput
                  disabled={isEvaluating}
                  onSpeechResult={(text) => setResponseText((prev) => (prev ? `${prev} ${text}` : text))}
                />
                <Button
                  variant="primary"
                  icon={<Send size={16} />}
                  loading={isEvaluating}
                  disabled={!responseText.trim() || isEvaluating}
                  onClick={handleSubmitTurn}
                >
                  Submit Response
                </Button>
              </div>
            </div>
          </Card>

          {/* Previous Turn Feedback */}
          {latestEvaluation && (
            <Card style={{ marginTop: '1rem', borderLeft: '4px solid var(--success-main)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>AI Evaluation</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {latestEvaluation.overallScore}/100
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Score</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success-main)', marginBottom: '0.5rem' }}>STRENGTHS</div>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {latestEvaluation.strengths.map((s, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--warning-main)', marginBottom: '0.5rem' }}>TO IMPROVE</div>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {latestEvaluation.improvements.map((s, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {latestEvaluation.betterResponse && (
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>BETTER RESPONSE SUGGESTION</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                    "{latestEvaluation.betterResponse}"
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* VIEW 3: Session Complete Summary */}
      {isSessionComplete && finalResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <Card style={{ width: '100%', maxWidth: 700, textAlign: 'center', padding: '3rem 2rem' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--success-main)', margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Situational Session Complete</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>{finalResult.summary}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>OVERALL SCORE</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                  {finalResult.overall_score}
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>out of 100</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'left', marginBottom: '2.5rem' }}>
              {Object.entries(finalResult.category_breakdown).map(([key, val]) => (
                <div key={key} style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{key}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{String(val)}/100</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => navigate('/communication')}>
                Back to Communication
              </Button>
              <Button variant="primary" onClick={() => {
                setSession(null);
                setIsSessionComplete(false);
              }}>
                Practice Again
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  startFluencySession,
  submitFluencyTurn,
  completeFluencySession,
  getFluencySessionHistory,
  FluencyEvaluationData,
  FluencyHistoryItem,
  FluencyStartResponseData,
} from '../services/fluencyService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VoiceInput } from '../components/communication/VoiceInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Mic,
  Send,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Zap,
} from 'lucide-react';

const TOPIC_OPTIONS = [
  "Introduce yourself and your career goals",
  "My college experience and key learnings",
  "Technology's role in modern education",
  "A major technical challenge I solved",
  "The importance of effective communication",
  "Teamwork and handling project conflicts",
  "Time management strategies during exams",
];

export const FluencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Session State
  const [session, setSession] = useState<FluencyStartResponseData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPIC_OPTIONS[0]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Turn State
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [turnEvaluations, setTurnEvaluations] = useState<FluencyEvaluationData[]>([]);
  const [latestEvaluation, setLatestEvaluation] = useState<FluencyEvaluationData | null>(null);

  // Status & History
  const [loading, setLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<any | null>(null);
  const [history, setHistory] = useState<FluencyHistoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadHistoryData(currentUser.uid);
    }
  }, [currentUser]);

  const loadHistoryData = async (uid: string) => {
    try {
      const hist = await getFluencySessionHistory(uid);
      setHistory(hist);
    } catch (e) {
      console.error('[FluencyPage] Error loading history:', e);
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
      const data = await startFluencySession(currentUser.uid, difficulty, selectedTopic);
      setSession(data);
      setCurrentPrompt(data.prompt);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start Fluency session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTurn = async () => {
    if (!currentUser || !session || !responseText.trim() || isEvaluating) return;

    if (responseText.trim().length < 10) {
      setErrorMessage('Please provide a little more detail in your response for accurate evaluation.');
      return;
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const data = await submitFluencyTurn(
        currentUser.uid,
        session.session_id,
        responseText.trim(),
        currentTurn,
        difficulty
      );

      const updatedEvals = [...turnEvaluations, data.evaluation];
      setTurnEvaluations(updatedEvals);
      setLatestEvaluation(data.evaluation);
      setResponseText('');

      if (data.is_completed || currentTurn >= 5) {
        // Complete 5-turn session
        const completion = await completeFluencySession(currentUser.uid, session.session_id, updatedEvals);
        setFinalResult(completion);
        setIsSessionComplete(true);
        loadHistoryData(currentUser.uid);
      } else {
        // Move to next turn
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
        <LoadingSpinner message="Starting AI Fluency Practice Session..." size={22} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto', width: '100%' }}>
      <PageHeader
        title="Spoken & Written Fluency Module"
        description="Improve English speaking rhythm, vocabulary flow, and sentence clarity through 5-turn AI practice sessions."
        icon={<Mic size={24} />}
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

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
          <div className="error-alert-header">
            <AlertCircle size={18} />
            <span className="error-title">Fluency Error</span>
          </div>
          <div className="error-message" style={{ marginBottom: 0 }}>
            {errorMessage}
          </div>
        </div>
      )}

      {/* VIEW 1: Session Setup & History Landing View */}
      {!session && !isSessionComplete && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Setup Card */}
          <Card style={{ gridColumn: 'span 2' }}>
            <div className="arena-card-header" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} style={{ color: 'var(--primary)' }} />
                <h2 className="card-title">Setup Your Fluency Practice Session</h2>
              </div>
              <Badge variant="primary">5-Turn AI Coaching</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
              {/* Topic Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                  Select Practice Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
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
                  {TOPIC_OPTIONS.map((t, idx) => (
                    <option key={idx} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                  Select Difficulty Level
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
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="primary" fullWidth size="lg" icon={<Play size={18} />} onClick={handleStartSession}>
              Start Fluency Practice
            </Button>
          </Card>

          {/* History & Score Trend Side Card */}
          <Card style={{ gridColumn: 'span 1' }}>
            <div className="arena-card-header" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} style={{ color: 'var(--secondary)' }} />
                <h3 className="card-title">Fluency History</h3>
              </div>
            </div>

            {history.length === 0 ? (
              <EmptyState
                title="No completed sessions yet"
                description="Complete your first 5-turn session to see your fluency score history."
                icon={<Award size={28} />}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item.sessionId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.dateStr}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Difficulty: {item.difficulty}
                      </div>
                    </div>
                    <Badge variant="success" style={{ fontWeight: 800 }}>
                      {item.score} / 100
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* VIEW 2: Active 5-Turn Practice Session */}
      {session && !isSessionComplete && (
        <div>
          {/* Active Session Header Bar */}
          <Card style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Badge variant="primary">Turn {currentTurn} of 5</Badge>
                <Badge variant="neutral" style={{ textTransform: 'capitalize' }}>
                  Difficulty: {difficulty}
                </Badge>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Topic: {session.topic}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSession(null);
                  setCurrentTurn(1);
                }}
              >
                Exit Session
              </Button>
            </div>

            {/* Turn Step Track */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background:
                      step < currentTurn
                        ? 'var(--success)'
                        : step === currentTurn
                        ? 'var(--primary)'
                        : 'var(--bg-surface-elevated)',
                  }}
                />
              ))}
            </div>
          </Card>

          {/* Active AI Prompt Card */}
          <Card style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  padding: '0.5rem',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#ffffff',
                  display: 'flex',
                }}
              >
                <Sparkles size={20} />
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  AI Coach Prompt (Turn {currentTurn})
                </span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {currentPrompt}
                </p>
              </div>
            </div>
          </Card>

          {/* Student Response Area */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              Your Response (Speak via Microphone or Type Below)
            </label>

            <textarea
              rows={4}
              placeholder="Speak using the voice button or type your response here... (Press Enter to submit)"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isEvaluating}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '0.75rem',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <VoiceInput
                  disabled={isEvaluating}
                  onSpeechResult={(text) => setResponseText((prev) => (prev ? `${prev} ${text}` : text))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {responseText.length} chars
                </span>
              </div>

              <Button
                variant="primary"
                icon={<Send size={16} />}
                loading={isEvaluating}
                disabled={!responseText.trim() || isEvaluating}
                onClick={handleSubmitTurn}
              >
                {currentTurn === 5 ? 'Submit & Complete Session' : 'Submit Turn Response'}
              </Button>
            </div>
          </Card>

          {/* Latest Response AI Evaluation Card */}
          {latestEvaluation && (
            <Card style={{ marginBottom: '1.5rem', border: '1px solid var(--border-color-glow)' }}>
              <div className="arena-card-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={18} style={{ color: 'var(--warning)' }} />
                  <h3 className="card-title">Turn {currentTurn - 1} AI Evaluation Breakdown</h3>
                </div>
                <Badge variant="success" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                  Turn Score: {latestEvaluation.overallScore} / 100
                </Badge>
              </div>

              {/* 7 Category Progress Meters Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                  { name: 'Grammar', val: latestEvaluation.grammar },
                  { name: 'Vocabulary', val: latestEvaluation.vocabulary },
                  { name: 'Structure', val: latestEvaluation.sentenceStructure },
                  { name: 'Clarity', val: latestEvaluation.clarity },
                  { name: 'Coherence', val: latestEvaluation.coherence },
                  { name: 'Relevance', val: latestEvaluation.relevance },
                  { name: 'Fluency', val: latestEvaluation.fluency },
                ].map((cat, i) => (
                  <div key={i} style={{ background: 'var(--bg-surface-elevated)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{cat.name}</span>
                      <span style={{ fontWeight: 700 }}>{cat.val}</span>
                    </div>
                    <div className="skill-track" style={{ height: 4 }}>
                      <div className="skill-fill" style={{ width: `${cat.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Correction Suggestion Box */}
              {latestEvaluation.betterVersion && (
                <div
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                    Suggested Polished Version:
                  </div>
                  <div style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--text-main)' }}>
                    "{latestEvaluation.betterVersion}"
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.3rem' }}>
                    ✓ Key Strengths
                  </div>
                  <ul style={{ paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {latestEvaluation.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.3rem' }}>
                    • Areas to Refine
                  </div>
                  <ul style={{ paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {latestEvaluation.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* VIEW 3: Session Completion Summary Results Screen */}
      {isSessionComplete && finalResult && (
        <Card
          style={{
            textAlign: 'center',
            padding: '2.5rem 1.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(34, 197, 94, 0.08) 100%)',
            border: '2px solid var(--border-color-glow)',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h2 className="section-title" style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
            Fluency Session Complete! 🎉
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {finalResult.summary}
          </p>

          {/* Overall AI Fluency Score Gauge */}
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: '4px solid var(--primary)',
              background: 'var(--bg-surface-elevated)',
              marginBottom: '1.75rem',
            }}
          >
            <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
              {finalResult.overall_score}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              out of 100
            </span>
            <Badge variant="primary" style={{ marginTop: '0.35rem', fontSize: '0.62rem' }}>
              AI Evaluation
            </Badge>
          </div>

          {/* 7 Category Metrics Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.85rem',
              maxWidth: 800,
              margin: '0 auto 2rem',
              textAlign: 'left',
            }}
          >
            {Object.entries(finalResult.category_breakdown || {}).map(([key, scoreVal]: any, idx) => (
              <div key={idx} style={{ background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {key}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {scoreVal} / 100
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/communication')}
            >
              Back to Communication
            </Button>
            <Button
              variant="primary"
              icon={<RotateCcw size={16} />}
              onClick={() => {
                setSession(null);
                setIsSessionComplete(false);
                setFinalResult(null);
              }}
            >
              Practice Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  startGroupDiscussion,
  respondGroupDiscussion,
  completeGroupDiscussion,
  getGroupDiscussionHistory,
  GroupDiscussionStartResponse,
  GroupDiscussionHistoryItem,
  GroupDiscussionSummary
} from '../services/groupDiscussionService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VoiceInput } from '../components/communication/VoiceInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Users,
  Send,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowLeft,
  Settings,
  BarChart
} from 'lucide-react';

const CATEGORIES = [
  'Technology', 'Education', 'Business', 'Society', 'Environment',
  'Career', 'Current Trends', 'Abstract Topics', 'Workplace', 'Placement Topics'
];

export const GroupDiscussionPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Session State
  const [session, setSession] = useState<GroupDiscussionStartResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>('');

  // Status & History
  const [loading, setLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<GroupDiscussionSummary | null>(null);
  const [history, setHistory] = useState<GroupDiscussionHistoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadHistoryData(currentUser.uid);
    }
  }, [currentUser]);

  const loadHistoryData = async (uid: string) => {
    try {
      const hist = await getGroupDiscussionHistory(uid);
      setHistory(hist);
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const handleStartSession = async () => {
    if (!currentUser) return;
    setLoading(true);
    setErrorMessage(null);
    setIsSessionComplete(false);
    setFinalResult(null);
    setCurrentRound(1);
    setMessages([]);

    try {
      const data = await startGroupDiscussion(currentUser.uid, selectedCategory, difficulty);
      setSession(data);
      setMessages([{ role: 'moderator', content: data.moderator_intro }]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start Group Discussion session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser || !session || !inputText.trim() || isEvaluating) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsEvaluating(true);
    setErrorMessage(null);

    const studentMsg = { role: 'student', content: textToSend };
    const updatedMessages = [...messages, studentMsg];
    setMessages(updatedMessages);

    try {
      if (currentRound >= 5) {
        // Complete the session
        const summary = await completeGroupDiscussion(
          currentUser.uid,
          session.session_id,
          session.topic,
          session.category,
          session.difficulty,
          updatedMessages
        );
        setFinalResult(summary);
        setIsSessionComplete(true);
        loadHistoryData(currentUser.uid);
      } else {
        const data = await respondGroupDiscussion(
          currentUser.uid,
          session.session_id,
          textToSend,
          currentRound,
          session.topic,
          updatedMessages
        );
        
        setCurrentRound(data.round);
        
        const aiMessages = data.ai_responses.map(resp => ({
          role: resp.speaker,
          content: resp.content
        }));
        
        setMessages(prev => [...prev, ...aiMessages]);
        
        if (data.is_complete) {
          // If the AI says it's complete, end it (though we track round client side primarily)
          const summary = await completeGroupDiscussion(
            currentUser.uid,
            session.session_id,
            session.topic,
            session.category,
            session.difficulty,
            [...updatedMessages, ...aiMessages]
          );
          setFinalResult(summary);
          setIsSessionComplete(true);
          loadHistoryData(currentUser.uid);
        }
      }
    } catch (err: any) {
      setErrorMessage('Failed to generate AI response. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const getSpeakerLabel = (role: string) => {
    if (role === 'student') return 'You';
    if (role === 'moderator') return 'Moderator';
    if (role === 'participant_A') return 'AI Participant A';
    if (role === 'participant_B') return 'AI Participant B';
    if (role === 'participant_C') return 'AI Participant C';
    return role;
  };

  const getSpeakerColor = (role: string) => {
    if (role === 'student') return 'var(--primary)';
    if (role === 'moderator') return 'var(--text-secondary)';
    if (role === 'participant_A') return '#eab308';
    if (role === 'participant_B') return '#3b82f6';
    if (role === 'participant_C') return '#10b981';
    return 'var(--text-secondary)';
  };

  if (showHistory) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => setShowHistory(false)} style={{ marginRight: '1rem' }}>
            Back
          </Button>
          <h2 className="section-title" style={{ margin: 0 }}>Group Discussion History</h2>
        </div>
        
        {history.length === 0 ? (
          <EmptyState icon={<TrendingUp />} title="No History Yet" description="Complete your first group discussion to see your progress." />
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {history.map((h, i) => (
              <Card key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{h.topic}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {h.dateStr} — {h.category} — {h.difficulty}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge variant={h.status === 'completed' ? 'success' : 'neutral'}>
                    {h.status.toUpperCase()}
                  </Badge>
                  {h.status === 'completed' && (
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem', color: 'var(--primary)' }}>
                      {h.score}/100
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <PageHeader
          title="Group Discussion"
          description="Simulate a realistic placement group discussion with AI participants."
          icon={<Users size={24} />}
        />
        {!session && (
          <Button variant="outline" icon={<BarChart size={16} />} onClick={() => setShowHistory(true)}>
            View History
          </Button>
        )}
      </div>

      {errorMessage && (
        <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} /> {errorMessage}
        </div>
      )}

      {/* SETUP PHASE */}
      {!session && !isSessionComplete && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: 600, margin: '0 auto' }}>
          <Card>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} /> Session Settings
            </h3>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Difficulty</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['easy', 'medium', 'hard'].map(level => (
                  <Button
                    key={level}
                    variant={difficulty === level ? 'primary' : 'outline'}
                    onClick={() => setDifficulty(level as any)}
                    style={{ flex: 1, textTransform: 'capitalize' }}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              icon={<Play size={18} />}
              loading={loading}
              onClick={handleStartSession}
            >
              Start Group Discussion
            </Button>
          </Card>
        </div>
      )}

      {/* ACTIVE SESSION PHASE */}
      {session && !isSessionComplete && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Topic</div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{session.topic}</h3>
              </div>
              <Badge variant="neutral">Round {currentRound} / 5</Badge>
            </div>
          </Card>

          <Card style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
            {messages.map((msg, idx) => {
              const isStudent = msg.role === 'student';
              return (
                <div key={idx} style={{ alignSelf: isStudent ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textAlign: isStudent ? 'right' : 'left' }}>
                    {getSpeakerLabel(msg.role)}
                  </div>
                  <div style={{
                    background: isStudent ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                    color: isStudent ? '#fff' : 'var(--text-main)',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    borderLeft: !isStudent ? `3px solid ${getSpeakerColor(msg.role)}` : 'none',
                    lineHeight: 1.5
                  }}>
                    {msg.content}
                  </div>
                </div>
              )
            })}
            {isEvaluating && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LoadingSpinner /> AI is typing...
              </div>
            )}
          </Card>

          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontWeight: 500 }}>Your Contribution:</div>
              <textarea
                rows={3}
                placeholder="Type your response here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isEvaluating}
                style={{
                  width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                  color: 'var(--text-main)', outline: 'none', resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <VoiceInput
                  disabled={isEvaluating}
                  onSpeechResult={(text) => setInputText((prev) => (prev ? `${prev} ${text}` : text))}
                />
                <Button
                  variant="primary"
                  icon={<Send size={16} />}
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isEvaluating}
                  loading={isEvaluating}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* FINAL REPORT PHASE */}
      {isSessionComplete && finalResult && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="health-status success" style={{ marginBottom: '0.5rem' }}>
            <CheckCircle2 size={24} />
            <div>
              <div className="status-label">Discussion Completed</div>
              <div className="status-detail">Your progress has been recorded.</div>
            </div>
          </div>

          <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Award size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>ARENA Group Discussion Report</h2>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>
              {finalResult.evaluation.overallScore} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/ 100</span>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Score Breakdown</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Communication', val: finalResult.evaluation.communication },
                  { label: 'Clarity', val: finalResult.evaluation.clarity },
                  { label: 'Relevance', val: finalResult.evaluation.relevance },
                  { label: 'Confidence', val: finalResult.evaluation.confidence },
                  { label: 'Participation', val: finalResult.evaluation.participation },
                  { label: 'Leadership', val: finalResult.evaluation.leadership },
                  { label: 'Teamwork', val: finalResult.evaluation.teamwork },
                  { label: 'Argument Quality', val: finalResult.evaluation.argumentQuality },
                  { label: 'Respectfulness', val: finalResult.evaluation.respectfulness },
                  { label: 'Vocabulary', val: finalResult.evaluation.vocabulary },
                  { label: 'Grammar', val: finalResult.evaluation.grammar },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}:</span>
                    <span style={{ fontWeight: 600 }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card>
                <h3 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Strengths</h3>
                <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {finalResult.evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </Card>

              <Card>
                <h3 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>Areas to Improve</h3>
                <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {finalResult.evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </Card>
            </div>
          </div>

          {finalResult.evaluation.improved_responses && finalResult.evaluation.improved_responses.length > 0 && (
            <Card>
              <h3 style={{ marginBottom: '1.25rem' }}>Sample Improvements</h3>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {finalResult.evaluation.improved_responses.map((ir, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--error)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontStyle: 'normal' }}>Student statement: </span>
                      "{ir.original}"
                    </div>
                    <div style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Improved: </span>
                      "{ir.improved}"
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 600 }}>Why: </span>{ir.reason}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button variant="primary" onClick={() => setSession(null)}>
              Start New Discussion
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

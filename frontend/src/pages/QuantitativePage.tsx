import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  startAptitudeSession,
  completeAptitudeSession,
  getAptitudeHistory,
  AptitudeStartResponse,
  AptitudeHistoryItem,
  AptitudeSessionSummary,
  AptitudeQuestion
} from '../services/aptitudeService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Calculator,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BarChart,
  Settings,
  ListOrdered,
  RefreshCcw,
  BookOpen,
  Play
} from 'lucide-react';

const TOPICS = [
  'Number System', 'LCM and HCF', 'Percentages', 'Profit and Loss',
  'Simple Interest', 'Compound Interest', 'Ratio and Proportion',
  'Average', 'Time and Work', 'Pipes and Cisterns',
  'Time, Speed and Distance', 'Problems on Trains', 'Boats and Streams',
  'Mixtures and Allegations', 'Partnership', 'Permutation and Combination',
  'Probability', 'Algebra', 'Ages', 'Data Interpretation'
];

export const QuantitativePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Session State
  const [session, setSession] = useState<AptitudeStartResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('Percentages');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  
  // UI State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(600);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  
  // Status & History
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<AptitudeSessionSummary | null>(null);
  const [history, setHistory] = useState<AptitudeHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadHistoryData(currentUser.uid);
    }
    return () => clearInterval(timerRef.current!);
  }, [currentUser]);

  useEffect(() => {
    if (session && !isSessionComplete) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleCompleteSession(true);
            return 0;
          }
          return prev - 1;
        });
        setTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [session, isSessionComplete]);

  const loadHistoryData = async (uid: string) => {
    try {
      const hist = await getAptitudeHistory(uid);
      setHistory(hist.filter(h => h.category === 'quantitative'));
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const handleStartSession = async () => {
    if (!currentUser) return;
    setLoading(true);
    setErrorMessage(null);
    setIsSessionComplete(false);
    setIsReviewMode(false);
    setFinalResult(null);
    setCurrentIndex(0);
    setAnswers({});
    
    // 1 min per question
    const totalTimeSecs = numQuestions * 60;
    setTimeRemaining(totalTimeSecs);
    setTimeTaken(0);

    try {
      const data = await startAptitudeSession(currentUser.uid, 'quantitative', difficulty, numQuestions, selectedTopic);
      setSession(data);
      setQuestions(data.questions);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start Quantitative session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSessionComplete || isReviewMode) return;
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.question_id]: optionIndex
    }));
  };

  const handleCompleteSession = async (autoSubmit: boolean = false) => {
    if (!currentUser || !session) return;
    
    if (!autoSubmit && Object.keys(answers).length < questions.length) {
      if (!window.confirm(`You have unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    clearInterval(timerRef.current!);

    try {
      const summary = await completeAptitudeSession(
        currentUser.uid,
        session.session_id,
        session.category,
        session.difficulty,
        questions,
        answers,
        timeTaken,
        selectedTopic
      );
      
      setFinalResult(summary);
      setIsSessionComplete(true);
      loadHistoryData(currentUser.uid);
    } catch (err: any) {
      setErrorMessage('Failed to submit test. Please try again.');
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
        setTimeTaken(prev => prev + 1);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ----------------------------------------------------
  // RENDER VIEWS
  // ----------------------------------------------------

  if (showHistory) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => setShowHistory(false)} style={{ marginRight: '1rem' }}>
            Back
          </Button>
          <h2 className="section-title" style={{ margin: 0 }}>Quantitative History</h2>
        </div>
        
        {history.length === 0 ? (
          <EmptyState icon={<BarChart />} title="No History Yet" description="Complete your first quantitative test to see your progress." />
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {history.map((h, i) => (
              <Card key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{h.topic || 'Mixed'}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', textTransform: 'capitalize' }}>
                    {h.dateStr} — {h.difficulty} Difficulty
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge variant={h.status === 'completed' ? 'success' : 'neutral'}>
                    {h.status.toUpperCase()}
                  </Badge>
                  {h.status === 'completed' && (
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem', color: 'var(--primary)' }}>
                      {h.score} / {h.accuracy}%
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

  if (session && (isReviewMode || !isSessionComplete)) {
    const currentQ = questions[currentIndex];
    const selectedOpt = answers[currentQ.question_id];
    
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{session.topic || 'Quantitative Mathematics'}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span style={{ textTransform: 'capitalize' }}>{session.difficulty}</span> | Question {currentIndex + 1} of {questions.length}
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            {!isSessionComplete ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeRemaining < 60 ? 'var(--error)' : 'var(--text-main)', fontWeight: 600, fontSize: '1.25rem' }}>
                <Clock size={20} /> {formatTime(timeRemaining)}
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => { setIsReviewMode(false); setSession(null); }}>
                Exit Review
              </Button>
            )}
          </div>
        </div>

        <Card style={{ marginBottom: '1.5rem', padding: '2rem' }}>
          <div style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {currentQ.question}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              let bgColor = 'var(--bg-surface-elevated)';
              let borderColor = 'var(--border-color)';
              
              if (isSelected) {
                bgColor = 'var(--bg-active)';
                borderColor = 'var(--primary)';
              }
              
              if (isReviewMode) {
                const isCorrect = idx === currentQ.correctOption;
                if (isCorrect) {
                  bgColor = 'rgba(16, 185, 129, 0.1)';
                  borderColor = 'var(--success)';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'rgba(239, 68, 68, 0.1)';
                  borderColor = 'var(--error)';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${borderColor}`,
                    background: bgColor,
                    cursor: isSessionComplete ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${isSelected || (isReviewMode && idx === currentQ.correctOption) ? borderColor : 'var(--text-secondary)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {(isSelected || (isReviewMode && idx === currentQ.correctOption)) && (
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: borderColor }} />
                    )}
                  </div>
                  <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{opt}</span>
                  
                  {isReviewMode && idx === currentQ.correctOption && (
                    <CheckCircle2 size={18} color="var(--success)" style={{ marginLeft: 'auto' }} />
                  )}
                  {isReviewMode && isSelected && idx !== currentQ.correctOption && (
                    <XCircle size={18} color="var(--error)" style={{ marginLeft: 'auto' }} />
                  )}
                </div>
              );
            })}
          </div>
          
          {isReviewMode && currentQ.explanation && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={18} /> Explanation & Formula
              </div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {currentQ.explanation}
              </div>
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outline"
            icon={<ArrowLeft size={18} />}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {Object.keys(answers).length} / {questions.length} Answered
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          ) : (
            !isSessionComplete && (
              <Button
                variant="primary"
                icon={<CheckCircle2 size={18} />}
                onClick={() => handleCompleteSession()}
                loading={isSubmitting}
              >
                Submit Test
              </Button>
            )
          )}
        </div>
      </div>
    );
  }

  if (isSessionComplete && finalResult && !isReviewMode) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Award size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Quantitative Mathematics Complete 🎉</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Your results for <strong>{finalResult.topic}</strong> have been recorded in the Progress Engine.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <Card style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Score</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>
              {finalResult.score} <span style={{ fontSize: '1.25rem', color: 'var(--text-dim)' }}>/ {finalResult.total_questions}</span>
            </div>
          </Card>
          
          <Card style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Accuracy</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--success)' }}>
              {finalResult.accuracy}%
            </div>
          </Card>
        </div>

        <Card style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Performance Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--success)"/> Correct
              </span>
              <span style={{ fontWeight: 600 }}>{finalResult.correct}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <XCircle size={16} color="var(--error)"/> Incorrect
              </span>
              <span style={{ fontWeight: 600 }}>{finalResult.incorrect}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ListOrdered size={16} color="var(--warning)"/> Unanswered
              </span>
              <span style={{ fontWeight: 600 }}>{finalResult.unanswered}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--primary)"/> Time Taken
              </span>
              <span style={{ fontWeight: 600 }}>{formatTime(finalResult.time_taken)}</span>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="outline" icon={<BookOpen size={18} />} onClick={() => { setIsReviewMode(true); setCurrentIndex(0); }}>
            Review Answers
          </Button>
          <Button variant="primary" icon={<RefreshCcw size={18} />} onClick={() => setSession(null)}>
            Practice Again
          </Button>
        </div>
      </div>
    );
  }

  // Setup / Landing Phase
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <Button variant="ghost" icon={<ArrowLeft size={16}/>} onClick={() => navigate('/aptitude')} style={{ marginBottom: '1rem' }}>
            Back to Aptitude
          </Button>
          <PageHeader
            title="Quantitative Mathematics"
            description="Master mathematics for elite placement tests."
            icon={<Calculator size={28} />}
          />
        </div>
        <Button variant="outline" icon={<BarChart size={16} />} onClick={() => setShowHistory(true)}>
          View History
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Choose Topic</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {TOPICS.map(topic => (
              <div 
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${selectedTopic === topic ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: selectedTopic === topic ? 'var(--bg-active)' : 'transparent',
                  color: selectedTopic === topic ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>

        <Card style={{ alignSelf: 'start', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} /> Practice Settings
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Difficulty</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['easy', 'medium', 'hard'].map(level => (
                <Button
                  key={level}
                  variant={difficulty === level ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(level as any)}
                  style={{ flex: 1, textTransform: 'capitalize' }}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Number of Questions</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[5, 10, 20].map(count => (
                <Button
                  key={count}
                  variant={numQuestions === count ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setNumQuestions(count)}
                  style={{ flex: 1 }}
                >
                  {count}
                </Button>
              ))}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
              Time limit: {numQuestions} minutes
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            icon={<Play size={18} />}
            loading={loading}
            onClick={handleStartSession}
          >
            Start Topic Practice
          </Button>
          
          {errorMessage && (
            <div style={{ color: 'var(--error)', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { getInterviewModes, startInterviewSession, InterviewConfig, InterviewMode } from '../../services/interviewService';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const InterviewLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [modes, setModes] = useState<InterviewMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const [mode, setMode] = useState('technical');
  const [difficulty, setDifficulty] = useState('medium');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [responseMode, setResponseMode] = useState('text');
  const [topic, setTopic] = useState('General');

  useEffect(() => {
    getInterviewModes()
      .then(setModes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      const config: InterviewConfig = {
        mode,
        difficulty,
        durationMinutes,
        maxQuestions: Math.max(5, Math.floor(durationMinutes * 0.5)),
        responseMode,
        topic: mode === 'technical' ? topic : undefined
      };
      const session = await startInterviewSession(config);
      navigate(`/interview/session/${session.sessionId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to start interview');
      setStarting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>ARENA AI Interview</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Practice real interview conversations with an AI interviewer.
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Interview Mode</label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
            >
              {modes.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {mode === 'technical' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Technical Topic</label>
              <select 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
              >
                {['General', 'C', 'C++', 'Java', 'Python', 'DBMS', 'OS', 'Networks', 'DSA', 'OOP'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Duration (Minutes)</label>
              <select 
                value={durationMinutes} 
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
              >
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Response Mode</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" value="text" checked={responseMode === 'text'} onChange={(e) => setResponseMode(e.target.value)} />
                Text
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" value="voice" checked={responseMode === 'voice'} onChange={(e) => setResponseMode(e.target.value)} />
                Voice
              </label>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Button onClick={handleStart} variant="primary" fullWidth disabled={starting}>
              {starting ? 'Preparing Interview...' : 'Start Interview'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

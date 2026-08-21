import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export const CppResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        No result data found.
        <br/>
        <Button onClick={() => navigate('/technical/cpp')} style={{ marginTop: '1rem' }}>Back to Dashboard</Button>
      </div>
    );
  }

  const accuracy = Math.round((result.score / result.total) * 100) || 0;
  const incorrect = result.total - result.score;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/technical/cpp')} style={{ marginBottom: '2rem' }}>
        Back to C++ Programming
      </Button>

      <div style={{ background: 'var(--bg-surface)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Practice Complete</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Topic: <span style={{ textTransform: 'capitalize', color: 'var(--text-main)' }}>{result.topic?.replace('_', ' ')}</span></p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', background: `conic-gradient(var(--primary) ${accuracy}%, var(--border-color) ${accuracy}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '130px', height: '130px', background: 'var(--bg-surface)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700 }}>{accuracy}%</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Accuracy</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--success)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle size={24} color="var(--success)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }}>{result.score}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Correct</div>
            </div>
          </div>
          
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <XCircle size={24} color="var(--error)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--error)' }}>{incorrect}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Incorrect</div>
            </div>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/technical/cpp')}>
          Continue Learning
        </Button>
      </div>
    </div>
  );
};

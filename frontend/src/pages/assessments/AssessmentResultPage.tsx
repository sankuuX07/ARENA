import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessmentResult, AssessmentResult } from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';
import { CheckCircle, XCircle, AlertTriangle, BarChart } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AssessmentResultPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      getAssessmentResult(resultId)
        .then(setResult)
        .catch((err) => {
          console.error(err);
          navigate('/assessments');
        })
        .finally(() => setLoading(false));
    }
  }, [resultId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!result) return <div>Result not found.</div>;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ 
        background: 'var(--bg-surface)', 
        borderRadius: '16px', 
        padding: '2rem', 
        border: '1px solid var(--border-color)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.5rem 1rem', borderRadius: '20px', 
          background: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: result.passed ? 'var(--success)' : 'var(--error)',
          fontWeight: 600, marginBottom: '1rem' 
        }}>
          {result.passed ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {result.passed ? 'PASSED' : 'FAILED'}
        </div>
        
        <h1 style={{ margin: '0 0 0.5rem' }}>Assessment Complete</h1>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Performance: {result.performanceClassification}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'left' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{result.score} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>/ {result.maxScore}</span></div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Percentage</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{result.percentage}%</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accuracy</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{result.accuracy}%</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Time Used</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {formatTime(result.timeUsedSeconds)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} color="var(--success)"/> Correct: {result.correct}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><XCircle size={16} color="var(--error)"/> Incorrect: {result.incorrect}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle size={16} color="var(--warning)"/> Unanswered: {result.unanswered}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Sections */}
        <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart size={20} /> Section Performance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {result.sections.map((sec) => (
              <div key={sec.sectionId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>{sec.title}</span>
                  <span style={{ fontWeight: 600 }}>{sec.percentage}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sec.percentage}%`, background: 'var(--primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', flex: 1 }}>
            <h3 style={{ margin: '0 0 1rem', color: 'var(--success)' }}>Strengths</h3>
            {result.strengths.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                {result.strengths.map(s => <li key={s}>{s}</li>)}
              </ul>
            ) : <span style={{ color: 'var(--text-muted)' }}>Not enough data.</span>}
          </div>
          
          <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', flex: 1 }}>
            <h3 style={{ margin: '0 0 1rem', color: 'var(--warning)' }}>Focus Areas</h3>
            {result.improvementAreas.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                {result.improvementAreas.map(s => <li key={s}>{s}</li>)}
              </ul>
            ) : <span style={{ color: 'var(--text-muted)' }}>Keep practicing!</span>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => navigate(`/assessments/results/${result.resultId}/review`)} variant="primary" fullWidth>
          Review Answers
        </Button>
        <Button onClick={() => navigate('/assessments/history')} variant="outline" fullWidth>
          View History
        </Button>
      </div>
    </div>
  );
};

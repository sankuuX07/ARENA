import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessmentHistory, AssessmentResult } from '../../services/assessmentService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { Target, Calendar, CheckCircle, XCircle } from 'lucide-react';

export const AssessmentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessmentHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Target size={28} /> Assessment History
        </h1>
        <Button variant="outline" onClick={() => navigate('/assessments')}>
          Back to Assessments
        </Button>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: '16px', color: 'var(--text-muted)' }}>
          You have not completed any assessments yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {history.map((res) => (
            <div key={res.resultId} style={{
              background: 'var(--bg-surface)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} /> {new Date(res.completedAt).toLocaleDateString()}
                </div>
                <h3 style={{ margin: '0 0 0.5rem' }}>{res.assessmentId}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>{res.percentage}%</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', color: res.passed ? 'var(--success)' : 'var(--error)' }}>
                    {res.passed ? <CheckCircle size={14} /> : <XCircle size={14} />} {res.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>
              <div>
                <Button onClick={() => navigate(`/assessments/results/${res.resultId}`)}>
                  View Result
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessments, Assessment } from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Clock, FileText, Target, BarChart2, AlertCircle, RefreshCw, ClipboardCheck } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  aptitude: BarChart2,
  technical: FileText,
  coding: Target,
  communication: Target,
  mixed: Target,
  placement: Target
};

export const AssessmentLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = () => {
    setLoading(true);
    setError(null);
    getAssessments()
      .then(setAssessments)
      .catch((err: any) => setError(err.message || 'Failed to load assessments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Assessments...</div>;

  if (error) {
    return (
      <div style={{ maxWidth: 500, margin: '3rem auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', marginBottom: '1rem' }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>Failed to load assessments</span>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <Button variant="primary" icon={<RefreshCw size={16} />} onClick={fetchAssessments}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ARENA Assessments</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Test your skills. Measure your preparation. Get placement ready.
        </p>
      </div>

      {assessments.length === 0 ? (
        <EmptyState
          title="No assessments available yet"
          description="Assessments will appear here once they are published by your administrator."
          icon={<ClipboardCheck size={36} />}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {assessments.map(a => {
            const Icon = CATEGORY_ICONS[a.category] || Target;
            return (
              <div key={a.assessmentId} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem' }}>{a.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, textTransform: 'capitalize' }}>Published</div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, margin: '0 0 1.5rem' }}>
                  {a.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {a.durationMinutes}m</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={14} /> {a.questionCount} Qs</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'capitalize' }}><Target size={14} /> {a.difficulty}</div>
                </div>

                <Button variant="primary" fullWidth onClick={() => navigate(`/assessments/${a.assessmentId}`)}>
                  View Details
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

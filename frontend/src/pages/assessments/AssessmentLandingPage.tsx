import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessments, Assessment } from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';
import { Clock, FileText, Target, BarChart2 } from 'lucide-react';

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

  useEffect(() => {
    getAssessments()
      .then(setAssessments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Assessments...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ARENA Assessments</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Test your skills. Measure your preparation. Get placement ready.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Render published assessments from backend */}
        {assessments.map(a => {
          const Icon = CATEGORY_ICONS[a.category] || Target;
          return (
            <div key={a.assessmentId} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
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
    </div>
  );
};

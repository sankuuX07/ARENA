import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, Target, Play, ShieldAlert } from 'lucide-react';
import { getAssessment, startAssessmentSession, Assessment } from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';

export const AssessmentDetailsPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (assessmentId) {
      getAssessment(assessmentId)
        .then(setAssessment)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [assessmentId]);

  const handleStart = async () => {
    if (!assessment) return;
    setStarting(true);
    try {
      const session = await startAssessmentSession(assessment.assessmentId);
      navigate(`/assessments/${assessment.assessmentId}/session/${session.sessionId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to start assessment.');
      setStarting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Assessment Details...</div>;
  if (!assessment) return <div style={{ padding: '2rem', textAlign: 'center' }}>Assessment not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => navigate('/assessments')} style={{ marginBottom: '1.5rem' }}>
        Back to Assessments
      </Button>

      <div style={{ background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{assessment.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
          {assessment.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Duration</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--primary)" /> {assessment.durationMinutes} minutes
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Questions</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--primary)" /> {assessment.questionCount}
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Difficulty</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
              <Target size={18} color="var(--primary)" /> {assessment.difficulty}
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Passing Score</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--success)" /> {assessment.config.passingScore}%
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid var(--error)' }}>
          <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)' }}>
            <ShieldAlert size={18} /> Rules & Instructions
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.5rem' }}>
            <li>The timer will not pause if you close the browser.</li>
            <li>Once time expires, the assessment is automatically submitted.</li>
            <li>{assessment.config.negativeMarking ? 'Negative marking IS enabled.' : 'No negative marking.'}</li>
            <li>{assessment.config.allowBackNavigation ? 'You CAN navigate back to previous questions.' : 'You CANNOT navigate back to previous questions.'}</li>
            <li>Ensure you have a stable internet connection before starting.</li>
          </ul>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          icon={<Play size={18} />} 
          onClick={handleStart}
          disabled={starting}
        >
          {starting ? 'Initializing Session...' : 'Start Assessment'}
        </Button>
      </div>
    </div>
  );
};

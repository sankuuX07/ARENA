import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessmentReview, QuestionResult } from '../../services/assessmentService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AssessmentReviewPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      getAssessmentReview(resultId)
        .then(setReview)
        .catch(err => {
          console.error(err);
          navigate(`/assessments/results/${resultId}`);
        })
        .finally(() => setLoading(false));
    }
  }, [resultId, navigate]);

  if (loading) return <LoadingSpinner />;
  
  if (review.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Review data is not available yet.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Button variant="outline" onClick={() => navigate(`/assessments/results/${resultId}`)}>
          <ArrowLeft size={16} /> Back to Results
        </Button>
        <h2 style={{ margin: 0 }}>Answer Review</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {review.map((q, idx) => (
          <div key={q.questionId} style={{ 
            background: 'var(--bg-surface)', 
            padding: '1.5rem', 
            borderRadius: '12px',
            border: `1px solid ${q.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Question {idx + 1}</span>
              <span style={{ 
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                color: q.isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 600
              }}>
                {q.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {q.marksAwarded} Marks
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Answer</div>
                <div>{q.studentAnswer || <span style={{ color: 'var(--text-muted)' }}>Unanswered</span>}</div>
              </div>
              
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Correct Answer</div>
                <div>{q.correctAnswer || <span style={{ color: 'var(--text-muted)' }}>Hidden or Dynamic Evaluation</span>}</div>
              </div>
            </div>

            {q.explanation && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px' }}>
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

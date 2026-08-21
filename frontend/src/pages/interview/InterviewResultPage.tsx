import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { interviewEvaluationService } from '../../services/interviewEvaluationService';
import { InterviewEvaluation } from '../../types/interviewEvaluation';
import { InterviewPerformanceBreakdown } from '../../components/interview/InterviewPerformanceBreakdown';
import { InterviewStrengthsCard } from '../../components/interview/InterviewStrengthsCard';
import { InterviewImprovementCard } from '../../components/interview/InterviewImprovementCard';
import { InterviewQuestionReview } from '../../components/interview/InterviewQuestionReview';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { MessageSquare, ArrowLeft, Target } from 'lucide-react';

export const InterviewResultPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) return;
      try {
        const data = await interviewEvaluationService.getResult(resultId);
        setEvaluation(data);
      } catch (err: any) {
        console.error('Failed to load evaluation', err);
        setError('Unable to load interview results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading your interview evaluation..." size={22} />
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="page-container">
        <PageHeader title="Interview Result" icon={<MessageSquare />} />
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'Result not found.'}</div>
          <Button onClick={() => navigate('/interview')}>Return to Interview Hub</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="AI Interview Complete"
        subtitle={`${evaluation.mode.charAt(0).toUpperCase() + evaluation.mode.slice(1)} Interview Evaluation`}
        icon={<MessageSquare size={28} />}
        action={
          <Button variant="outline" onClick={() => navigate('/interview/history')} icon={<ArrowLeft size={16} />}>
            Back to History
          </Button>
        }
      />

      {evaluation.status === 'failed' ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Evaluation Failed</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            We could not complete the AI evaluation for this session. The transcript is saved, but the evaluation service is temporarily unavailable.
          </p>
        </Card>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Left Col: Overall Score & Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card style={{ textAlign: 'center', padding: '2rem', background: 'var(--primary)', color: 'white' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>Overall Score</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: 1 }}>
                  {evaluation.overallScore}<span style={{ fontSize: '1.5rem', opacity: 0.8 }}>/100</span>
                </div>
                {evaluation.performanceLevel && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '0.5rem 1rem', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '2rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {evaluation.performanceLevel.replace(/_/g, ' ')}
                  </div>
                )}
              </Card>

              <InterviewPerformanceBreakdown evaluation={evaluation} />
            </div>

            {/* Right Col: Summary, Strengths, Weaknesses */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card>
                <h3 style={{ marginBottom: '1rem' }}>Interview Summary</h3>
                <p style={{ margin: 0, lineHeight: 1.6 }}>{evaluation.summary}</p>
              </Card>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InterviewStrengthsCard strengths={evaluation.strengths} />
                <InterviewImprovementCard improvementAreas={evaluation.improvementAreas} />
              </div>

              {evaluation.practiceAreas && evaluation.practiceAreas.length > 0 && (
                <Card>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={20} style={{ color: 'var(--primary)' }} /> Recommended Practice
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {evaluation.practiceAreas.map((pa, i) => (
                      <div key={i} style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{pa.area}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{pa.reason}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

          <h3 style={{ marginBottom: '1.5rem' }}>Question-by-Question Review</h3>
          <InterviewQuestionReview evaluations={evaluation.questionEvaluations} />
        </>
      )}
    </div>
  );
};

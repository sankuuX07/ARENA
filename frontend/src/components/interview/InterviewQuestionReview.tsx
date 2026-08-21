import React from 'react';
import { Card } from '../ui/Card';
import { InterviewQuestionEvaluation } from '../../types/interviewEvaluation';

interface InterviewQuestionReviewProps {
  evaluations: InterviewQuestionEvaluation[];
}

export const InterviewQuestionReview: React.FC<InterviewQuestionReviewProps> = ({ evaluations }) => {
  if (!evaluations || evaluations.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {evaluations.map((ev, i) => (
        <Card key={ev.questionId || i} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', flex: 1, paddingRight: '1rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>Q{i + 1}.</span>
              {ev.question}
            </h4>
            {ev.score !== undefined && ev.score !== null && (
              <div style={{ fontWeight: 'bold', color: 'var(--primary)', background: 'var(--bg-surface)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                {ev.score}%
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Answer:</div>
            <div style={{ fontStyle: 'italic' }}>"{ev.studentAnswer}"</div>
          </div>

          {ev.feedback && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.25rem' }}>Feedback:</div>
              <div style={{ fontSize: '0.95rem' }}>{ev.feedback}</div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            {ev.strengths && ev.strengths.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '0.5rem' }}>What went well:</div>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem' }}>
                  {ev.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
            )}
            
            {ev.improvementAreas && ev.improvementAreas.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Focus Area:</div>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem' }}>
                  {ev.improvementAreas.map((a, idx) => <li key={idx}>{a}</li>)}
                </ul>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

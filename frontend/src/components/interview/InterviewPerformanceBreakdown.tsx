import React from 'react';
import { InterviewEvaluation } from '../../types/interviewEvaluation';

interface InterviewPerformanceBreakdownProps {
  evaluation: InterviewEvaluation;
}

export const InterviewPerformanceBreakdown: React.FC<InterviewPerformanceBreakdownProps> = ({ evaluation }) => {
  const renderMetric = (label: string, score?: number | null) => {
    if (score === undefined || score === null) return null;
    
    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{label}</span>
          <span style={{ fontWeight: 'bold' }}>{score}%</span>
        </div>
        <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${score}%`, 
            background: 'var(--primary)',
            borderRadius: '4px'
          }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '1.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Performance Breakdown</h3>
      {renderMetric('Technical Knowledge', evaluation.technicalScore)}
      {renderMetric('Communication', evaluation.communicationScore)}
      {renderMetric('Relevance', evaluation.relevanceScore)}
      {renderMetric('Clarity', evaluation.clarityScore)}
      {renderMetric('Answer Structure', evaluation.structureScore)}
    </div>
  );
};

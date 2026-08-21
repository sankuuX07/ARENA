import React from 'react';

interface ResumeBeforeAfterComparisonProps {
  originalText: string;
  suggestedText: string;
}

export const ResumeBeforeAfterComparison: React.FC<ResumeBeforeAfterComparisonProps> = ({ originalText, suggestedText }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
      <div style={{ flex: 1, padding: '1rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--danger)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Before (Original)</div>
        <p style={{ margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{originalText || '(No previous content)'}</p>
      </div>

      <div style={{ flex: 1, padding: '1rem', background: 'var(--success-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--success)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>After (Suggested)</div>
        <p style={{ margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{suggestedText}</p>
      </div>
    </div>
  );
};

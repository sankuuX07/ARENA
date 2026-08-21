import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sparkles size={18} />
      </div>

      <div
        style={{
          padding: '0.65rem 1rem',
          borderRadius: '18px 18px 18px 4px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI is typing</span>
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: 'pulse 1.2s infinite ease-in-out',
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: 'pulse 1.2s infinite ease-in-out 0.2s',
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: 'pulse 1.2s infinite ease-in-out 0.4s',
            }}
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CommunicationMessage } from '../../services/communicationService';
import { Sparkles } from 'lucide-react';

export interface MessageBubbleProps {
  message: CommunicationMessage;
  studentName?: string;
  studentPhotoUrl?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  studentName = 'Student',
  studentPhotoUrl,
}) => {
  const isStudent = message.role === 'student';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div style={{ textAlign: 'center', margin: '0.85rem 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        <span>{message.content}</span>
      </div>
    );
  }

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatTime = (isoString?: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isStudent ? 'flex-end' : 'flex-start',
        marginBottom: '1.1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isStudent ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: '0.75rem',
          maxWidth: '82%',
        }}
      >
        {/* Avatar Circle */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            flexShrink: 0,
            background: isStudent ? 'var(--primary-gradient)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.82rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {isStudent ? (
            studentPhotoUrl ? (
              <img
                src={studentPhotoUrl}
                alt={studentName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              getInitials(studentName)
            )
          ) : (
            <Sparkles size={18} />
          )}
        </div>

        {/* Bubble Box */}
        <div>
          <div
            style={{
              padding: '0.85rem 1.15rem',
              borderRadius: isStudent ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: isStudent
                ? 'var(--primary)'
                : 'var(--bg-surface-elevated)',
              border: isStudent ? 'none' : '1px solid var(--border-color)',
              color: isStudent ? '#ffffff' : 'var(--text-main)',
              fontSize: '0.94rem',
              lineHeight: 1.55,
              whiteSpace: 'pre-wrap',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {message.content}
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              marginTop: '0.25rem',
              textAlign: isStudent ? 'right' : 'left',
              paddingLeft: isStudent ? 0 : '0.25rem',
              paddingRight: isStudent ? '0.25rem' : 0,
            }}
          >
            {isStudent ? studentName : 'ARENA AI Coach'} • {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

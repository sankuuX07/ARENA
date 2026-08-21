import React, { useEffect, useRef } from 'react';
import { CommunicationMessage } from '../../services/communicationService';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

export interface ConversationWindowProps {
  messages: CommunicationMessage[];
  isGenerating: boolean;
  studentName?: string;
  studentPhotoUrl?: string;
}

export const ConversationWindow: React.FC<ConversationWindowProps> = ({
  messages,
  isGenerating,
  studentName,
  studentPhotoUrl,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem',
        minHeight: 340,
        maxHeight: 520,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          studentName={studentName}
          studentPhotoUrl={studentPhotoUrl}
        />
      ))}

      {isGenerating && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
};

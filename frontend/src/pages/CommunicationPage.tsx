import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  startCommunicationSession,
  sendChatMessage,
  endCommunicationSession,
  CommunicationSession,
  CommunicationMessage,
} from '../services/communicationService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CommunicationModeSelector } from '../components/communication/CommunicationModeSelector';
import { SessionHeader } from '../components/communication/SessionHeader';
import { ConversationWindow } from '../components/communication/ConversationWindow';
import { VoiceInput } from '../components/communication/VoiceInput';
import { MessageSquare, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CommunicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [activeSession, setActiveSession] = useState<CommunicationSession | null>(null);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStartSession = async (
    mode: 'general' | 'fluency' | 'formal' | 'situational' | 'group_discussion'
  ) => {
    if (mode === 'fluency') {
      navigate('/communication/fluency');
      return;
    }
    
    if (mode === 'formal') {
      navigate('/communication/formal');
      return;
    }

    if (mode === 'situational') {
      navigate('/communication/situational');
      return;
    }

    if (mode === 'group_discussion') {
      navigate('/communication/group-discussion');
      return;
    }

    if (!currentUser) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { session, initialMessage } = await startCommunicationSession(currentUser.uid, mode);
      setActiveSession(session);
      setMessages([initialMessage]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start communication session.');
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser || !activeSession || !inputMessage.trim() || isGenerating) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsGenerating(true);
    setErrorMessage(null);

    // Optimistic UI update: append student message immediately
    const tempStudentMsg: CommunicationMessage = {
      id: `msg_std_temp_${Date.now()}`,
      role: 'student',
      content: userText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempStudentMsg]);

    try {
      const { studentMessage, aiMessage } = await sendChatMessage(
        currentUser.uid,
        activeSession.sessionId,
        userText,
        activeSession.mode,
        messages
      );

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempStudentMsg.id),
        studentMessage,
        aiMessage,
      ]);
    } catch (err: any) {
      setErrorMessage('Communication AI response failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEndSession = async () => {
    if (!currentUser || !activeSession) return;

    try {
      await endCommunicationSession(currentUser.uid, activeSession.sessionId, messages.length);
      setSuccessMessage('Communication session completed successfully. Progress recorded.');
    } catch (err: any) {
      console.error('[CommunicationPage] Error ending session:', err);
    } finally {
      setActiveSession(null);
      setMessages([]);
      setInputMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      <PageHeader
        title="AI Communication Module"
        description="Practice verbal and written communication with AI coaching, placement interview warm-ups, and fluency drills."
        icon={<MessageSquare size={24} />}
      />

      {/* Notifications */}
      {successMessage && (
        <div className="health-status success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={20} />
          <div>
            <div className="status-label">Session Completed</div>
            <div className="status-detail">{successMessage}</div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
          <div className="error-alert-header">
            <AlertCircle size={18} />
            <span className="error-title">Communication Error</span>
          </div>
          <div className="error-message" style={{ marginBottom: 0 }}>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Mode Selector Landing View when no active session */}
      {!activeSession ? (
        <CommunicationModeSelector onSelectMode={handleStartSession} />
      ) : (
        /* Active Conversation Workspace */
        <div>
          <SessionHeader
            mode={activeSession.mode}
            onEndSession={handleEndSession}
            messageCount={messages.length}
          />

          <ConversationWindow
            messages={messages}
            isGenerating={isGenerating}
            studentName={userProfile?.fullName || 'Student'}
            studentPhotoUrl={userProfile?.profilePhotoUrl}
          />

          {/* Chat Message Input Container */}
          <Card style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <textarea
                rows={3}
                placeholder="Type your response... (Press Enter to send, Shift+Enter for new line)"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <VoiceInput
                    disabled={isGenerating}
                    onSpeechResult={(text) => setInputMessage((prev) => (prev ? `${prev} ${text}` : text))}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {inputMessage.length} / 2000 chars
                  </span>
                </div>

                <Button
                  variant="primary"
                  icon={<Send size={16} />}
                  loading={isGenerating}
                  disabled={!inputMessage.trim() || isGenerating}
                  onClick={handleSendMessage}
                >
                  Send Response
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

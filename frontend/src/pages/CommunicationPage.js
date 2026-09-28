import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startCommunicationSession, sendChatMessage, endCommunicationSession, CommunicationSession, CommunicationMessage, } from '../services/communicationService';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CommunicationModeSelector } from '../components/communication/CommunicationModeSelector';
import { SessionHeader } from '../components/communication/SessionHeader';
import { ConversationWindow } from '../components/communication/ConversationWindow';
import { VoiceInput } from '../components/communication/VoiceInput';
import { MessageSquare, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
export const CommunicationPage = () => {
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const handleStartSession = async (mode) => {
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
        if (!currentUser)
            return;
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const { session, initialMessage } = await startCommunicationSession(currentUser.uid, mode);
            setActiveSession(session);
            setMessages([initialMessage]);
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to start communication session.');
        }
    };
    const handleSendMessage = async () => {
        if (!currentUser || !activeSession || !inputMessage.trim() || isGenerating)
            return;
        const userText = inputMessage.trim();
        setInputMessage('');
        setIsGenerating(true);
        setErrorMessage(null);
        // Optimistic UI update: append student message immediately
        const tempStudentMsg = {
            id: `msg_std_temp_${Date.now()}`,
            role: 'student',
            content: userText,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempStudentMsg]);
        try {
            const { studentMessage, aiMessage } = await sendChatMessage(currentUser.uid, activeSession.sessionId, userText, activeSession.mode, messages);
            setMessages((prev) => [
                ...prev.filter((m) => m.id !== tempStudentMsg.id),
                studentMessage,
                aiMessage,
            ]);
        }
        catch (err) {
            setErrorMessage('Communication AI response failed. Please try again.');
        }
        finally {
            setIsGenerating(false);
        }
    };
    const handleEndSession = async () => {
        if (!currentUser || !activeSession)
            return;
        try {
            await endCommunicationSession(currentUser.uid, activeSession.sessionId, messages.length);
            setSuccessMessage('Communication session completed successfully. Progress recorded.');
        }
        catch (err) {
            console.error('[CommunicationPage] Error ending session:', err);
        }
        finally {
            setActiveSession(null);
            setMessages([]);
            setInputMessage('');
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (_jsxs("div", { style: { maxWidth: 1100, margin: '0 auto', width: '100%' }, children: [_jsx(PageHeader, { title: "AI Communication Module", description: "Practice verbal and written communication with AI coaching, placement interview warm-ups, and fluency drills.", icon: _jsx(MessageSquare, { size: 24 }) }), successMessage && (_jsxs("div", { className: "health-status success", style: { marginBottom: '1.5rem' }, children: [_jsx(CheckCircle2, { size: 20 }), _jsxs("div", { children: [_jsx("div", { className: "status-label", children: "Session Completed" }), _jsx("div", { className: "status-detail", children: successMessage })] })] })), errorMessage && (_jsxs("div", { className: "error-alert", style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "error-alert-header", children: [_jsx(AlertCircle, { size: 18 }), _jsx("span", { className: "error-title", children: "Communication Error" })] }), _jsx("div", { className: "error-message", style: { marginBottom: 0 }, children: errorMessage })] })), !activeSession ? (_jsx(CommunicationModeSelector, { onSelectMode: handleStartSession })) : (_jsxs("div", { children: [_jsx(SessionHeader, { mode: activeSession.mode, onEndSession: handleEndSession, messageCount: messages.length }), _jsx(ConversationWindow, { messages: messages, isGenerating: isGenerating, studentName: userProfile?.fullName || 'Student', studentPhotoUrl: userProfile?.profilePhotoUrl }), _jsx(Card, { style: { padding: '1rem' }, children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: [_jsx("textarea", { rows: 3, placeholder: "Type your response... (Press Enter to send, Shift+Enter for new line)", value: inputMessage, onChange: (e) => setInputMessage(e.target.value), onKeyDown: handleKeyDown, disabled: isGenerating, style: {
                                        width: '100%',
                                        padding: '0.85rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.95rem',
                                        resize: 'vertical',
                                        outline: 'none',
                                    } }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx(VoiceInput, { disabled: isGenerating, onSpeechResult: (text) => setInputMessage((prev) => (prev ? `${prev} ${text}` : text)) }), _jsxs("span", { style: { fontSize: '0.75rem', color: 'var(--text-dim)' }, children: [inputMessage.length, " / 2000 chars"] })] }), _jsx(Button, { variant: "primary", icon: _jsx(Send, { size: 16 }), loading: isGenerating, disabled: !inputMessage.trim() || isGenerating, onClick: handleSendMessage, children: "Send Response" })] })] }) })] }))] }));
};
//# sourceMappingURL=CommunicationPage.js.map
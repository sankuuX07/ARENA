import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import { CommunicationMessage } from '../../services/communicationService';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
export const ConversationWindow = ({ messages, isGenerating, studentName, studentPhotoUrl, }) => {
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isGenerating]);
    return (_jsxs("div", { style: {
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
        }, children: [messages.map((msg) => (_jsx(MessageBubble, { message: msg, studentName: studentName, studentPhotoUrl: studentPhotoUrl }, msg.id))), isGenerating && _jsx(TypingIndicator, {}), _jsx("div", { ref: bottomRef })] }));
};
//# sourceMappingURL=ConversationWindow.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CommunicationMessage } from '../../services/communicationService';
import { Sparkles } from 'lucide-react';
export const MessageBubble = ({ message, studentName = 'Student', studentPhotoUrl, }) => {
    const isStudent = message.role === 'student';
    const isSystem = message.role === 'system';
    if (isSystem) {
        return (_jsx("div", { style: { textAlign: 'center', margin: '0.85rem 0', color: 'var(--text-dim)', fontSize: '0.8rem' }, children: _jsx("span", { children: message.content }) }));
    }
    const getInitials = (name) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2)
            return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };
    const formatTime = (isoString) => {
        if (!isoString)
            return '';
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        catch (e) {
            return '';
        }
    };
    return (_jsx("div", { style: {
            display: 'flex',
            justifyContent: isStudent ? 'flex-end' : 'flex-start',
            marginBottom: '1.1rem',
        }, children: _jsxs("div", { style: {
                display: 'flex',
                flexDirection: isStudent ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: '0.75rem',
                maxWidth: '82%',
            }, children: [_jsx("div", { style: {
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
                    }, children: isStudent ? (studentPhotoUrl ? (_jsx("img", { src: studentPhotoUrl, alt: studentName, style: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' } })) : (getInitials(studentName))) : (_jsx(Sparkles, { size: 18 })) }), _jsxs("div", { children: [_jsx("div", { style: {
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
                            }, children: message.content }), _jsxs("div", { style: {
                                fontSize: '0.72rem',
                                color: 'var(--text-dim)',
                                marginTop: '0.25rem',
                                textAlign: isStudent ? 'right' : 'left',
                                paddingLeft: isStudent ? 0 : '0.25rem',
                                paddingRight: isStudent ? '0.25rem' : 0,
                            }, children: [isStudent ? studentName : 'ARENA AI Coach', " \u2022 ", formatTime(message.timestamp)] })] })] }) }));
};
//# sourceMappingURL=MessageBubble.js.map
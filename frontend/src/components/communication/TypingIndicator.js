import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Sparkles } from 'lucide-react';
export const TypingIndicator = () => {
    return (_jsxs("div", { style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
        }, children: [_jsx("div", { style: {
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }, children: _jsx(Sparkles, { size: 18 }) }), _jsxs("div", { style: {
                    padding: '0.65rem 1rem',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }, children: [_jsx("span", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: "AI is typing" }), _jsxs("div", { style: { display: 'flex', gap: '0.25rem', alignItems: 'center' }, children: [_jsx("div", { style: {
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    animation: 'pulse 1.2s infinite ease-in-out',
                                } }), _jsx("div", { style: {
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    animation: 'pulse 1.2s infinite ease-in-out 0.2s',
                                } }), _jsx("div", { style: {
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    animation: 'pulse 1.2s infinite ease-in-out 0.4s',
                                } })] })] })] }));
};
//# sourceMappingURL=TypingIndicator.js.map
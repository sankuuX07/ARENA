import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from './Card';
import { Layers } from 'lucide-react';
export const EmptyState = ({ title, description, action, icon = _jsx(Layers, { size: 36 }), }) => {
    return (_jsxs(Card, { style: { textAlign: 'center', padding: '3rem 1.5rem' }, children: [_jsx("div", { style: {
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                }, children: icon }), _jsx("h3", { style: { fontSize: '1.25rem', marginBottom: '0.5rem' }, children: title }), _jsx("p", { style: { color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 1.5rem auto' }, children: description }), action && _jsx("div", { children: action })] }));
};
//# sourceMappingURL=EmptyState.js.map
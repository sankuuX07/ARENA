import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2 } from 'lucide-react';
export const InterviewStrengthsCard = ({ strengths }) => {
    if (!strengths || strengths.length === 0)
        return null;
    return (_jsxs(Card, { style: { background: 'var(--bg-surface-elevated)' }, children: [_jsxs("h3", { style: { marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }, children: [_jsx(CheckCircle2, { size: 20 }), " Your Strengths"] }), _jsx("ul", { style: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: strengths.map((s, i) => (_jsxs("li", { style: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.95rem' }, children: [_jsx("span", { style: { color: 'var(--success)', marginTop: '2px' }, children: "\u2713" }), _jsx("span", { children: s })] }, i))) })] }));
};
//# sourceMappingURL=InterviewStrengthsCard.js.map
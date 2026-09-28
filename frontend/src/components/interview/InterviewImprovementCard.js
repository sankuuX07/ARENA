import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { AlertCircle } from 'lucide-react';
export const InterviewImprovementCard = ({ improvementAreas }) => {
    if (!improvementAreas || improvementAreas.length === 0)
        return null;
    return (_jsxs(Card, { style: { background: 'var(--bg-surface-elevated)' }, children: [_jsxs("h3", { style: { marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }, children: [_jsx(AlertCircle, { size: 20 }), " Focus Areas"] }), _jsx("ul", { style: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: improvementAreas.map((a, i) => (_jsxs("li", { style: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.95rem' }, children: [_jsx("span", { style: { color: 'var(--warning)', marginTop: '2px' }, children: "\u2022" }), _jsx("span", { children: a })] }, i))) })] }));
};
//# sourceMappingURL=InterviewImprovementCard.js.map
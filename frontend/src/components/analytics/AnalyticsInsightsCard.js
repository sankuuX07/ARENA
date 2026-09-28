import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { AnalyticsInsight } from '../../types/analytics';
import { Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
export const AnalyticsInsightsCard = ({ insights }) => {
    return (_jsxs(Card, { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }, children: [_jsx(Lightbulb, { size: 20, style: { color: 'var(--warning)' } }), _jsx("h3", { style: { margin: 0 }, children: "Analytics Insights" })] }), insights.length === 0 ? (_jsx("p", { style: { color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }, children: "Complete more activities to receive personalized insights." })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: insights.map((insight) => (_jsxs("div", { style: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }, children: [insight.isPositive ? (_jsx(CheckCircle2, { size: 18, style: { color: 'var(--success)', flexShrink: 0, marginTop: '2px' } })) : (_jsx(AlertCircle, { size: 18, style: { color: 'var(--warning)', flexShrink: 0, marginTop: '2px' } })), _jsx("div", { style: { fontSize: '0.95rem', color: 'var(--text-primary)' }, children: insight.text })] }, insight.id))) }))] }));
};
//# sourceMappingURL=AnalyticsInsightsCard.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { AnalyticsPerformanceLevel } from '../../types/analytics';
export const AnalyticsScoreCard = ({ title, score, performanceLevel, subtitle }) => {
    return (_jsxs(Card, { style: { textAlign: 'center', padding: '2rem' }, children: [_jsx("h2", { style: { fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }, children: title }), _jsx("div", { style: { fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: 1 }, children: score }), _jsx("div", { style: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.5rem' }, children: performanceLevel }), subtitle && (_jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }, children: subtitle }))] }));
};
//# sourceMappingURL=AnalyticsScoreCard.js.map
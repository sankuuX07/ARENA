import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StudentRecommendation } from '../../types/recommendation';
import { RecommendationCard } from './RecommendationCard';
export const RecommendationSection = ({ title, recommendations, onDismissed }) => {
    if (recommendations.length === 0)
        return null;
    return (_jsxs("div", { style: { marginBottom: '2.5rem' }, children: [_jsxs("h3", { style: { fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }, children: [title, " (", recommendations.length, ")"] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }, children: recommendations.map(rec => (_jsx(RecommendationCard, { recommendation: rec, onDismissed: onDismissed }, rec.recommendationId))) })] }));
};
//# sourceMappingURL=RecommendationSection.js.map
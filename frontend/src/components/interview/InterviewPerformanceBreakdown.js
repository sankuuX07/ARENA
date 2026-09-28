import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { InterviewEvaluation } from '../../types/interviewEvaluation';
export const InterviewPerformanceBreakdown = ({ evaluation }) => {
    const renderMetric = (label, score) => {
        if (score === undefined || score === null)
            return null;
        return (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }, children: [_jsx("span", { style: { fontWeight: 500, fontSize: '0.9rem' }, children: label }), _jsxs("span", { style: { fontWeight: 'bold' }, children: [score, "%"] })] }), _jsx("div", { style: { height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }, children: _jsx("div", { style: {
                            height: '100%',
                            width: `${score}%`,
                            background: 'var(--primary)',
                            borderRadius: '4px'
                        } }) })] }));
    };
    return (_jsxs("div", { style: { padding: '1.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)' }, children: [_jsx("h3", { style: { marginBottom: '1.5rem', fontSize: '1.2rem' }, children: "Performance Breakdown" }), renderMetric('Technical Knowledge', evaluation.technicalScore), renderMetric('Communication', evaluation.communicationScore), renderMetric('Relevance', evaluation.relevanceScore), renderMetric('Clarity', evaluation.clarityScore), renderMetric('Answer Structure', evaluation.structureScore)] }));
};
//# sourceMappingURL=InterviewPerformanceBreakdown.js.map
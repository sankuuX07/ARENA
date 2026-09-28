import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessmentResult, AssessmentResult } from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';
import { CheckCircle, XCircle, AlertTriangle, BarChart } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
export const AssessmentResultPage = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (resultId) {
            getAssessmentResult(resultId)
                .then(setResult)
                .catch((err) => {
                console.error(err);
                navigate('/assessments');
            })
                .finally(() => setLoading(false));
        }
    }, [resultId, navigate]);
    if (loading)
        return _jsx(LoadingSpinner, {});
    if (!result)
        return _jsx("div", { children: "Result not found." });
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto', padding: '2rem' }, children: [_jsxs("div", { style: {
                    background: 'var(--bg-surface)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid var(--border-color)',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }, children: [_jsxs("div", { style: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1rem', borderRadius: '20px',
                            background: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: result.passed ? 'var(--success)' : 'var(--error)',
                            fontWeight: 600, marginBottom: '1rem'
                        }, children: [result.passed ? _jsx(CheckCircle, { size: 20 }) : _jsx(XCircle, { size: 20 }), result.passed ? 'PASSED' : 'FAILED'] }), _jsx("h1", { style: { margin: '0 0 0.5rem' }, children: "Assessment Complete" }), _jsxs("div", { style: { fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }, children: ["Performance: ", result.performanceClassification] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'left' }, children: [_jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '12px' }, children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: "Score" }), _jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 700 }, children: [result.score, " ", _jsxs("span", { style: { fontSize: '1rem', color: 'var(--text-muted)' }, children: ["/ ", result.maxScore] })] })] }), _jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '12px' }, children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: "Percentage" }), _jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }, children: [result.percentage, "%"] })] }), _jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '12px' }, children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: "Accuracy" }), _jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 700 }, children: [result.accuracy, "%"] })] }), _jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '12px' }, children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: "Time Used" }), _jsx("div", { style: { fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: formatTime(result.timeUsedSeconds) })] })] }), _jsxs("div", { style: { display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(CheckCircle, { size: 16, color: "var(--success)" }), " Correct: ", result.correct] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(XCircle, { size: 16, color: "var(--error)" }), " Incorrect: ", result.incorrect] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(AlertTriangle, { size: 16, color: "var(--warning)" }), " Unanswered: ", result.unanswered] })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }, children: [_jsxs("div", { style: { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }, children: [_jsxs("h3", { style: { margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(BarChart, { size: 20 }), " Section Performance"] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: result.sections.map((sec) => (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: [_jsx("span", { children: sec.title }), _jsxs("span", { style: { fontWeight: 600 }, children: [sec.percentage, "%"] })] }), _jsx("div", { style: { height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }, children: _jsx("div", { style: { height: '100%', width: `${sec.percentage}%`, background: 'var(--primary)' } }) })] }, sec.sectionId))) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { style: { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', flex: 1 }, children: [_jsx("h3", { style: { margin: '0 0 1rem', color: 'var(--success)' }, children: "Strengths" }), result.strengths.length > 0 ? (_jsx("ul", { style: { margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }, children: result.strengths.map(s => _jsx("li", { children: s }, s)) })) : _jsx("span", { style: { color: 'var(--text-muted)' }, children: "Not enough data." })] }), _jsxs("div", { style: { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', flex: 1 }, children: [_jsx("h3", { style: { margin: '0 0 1rem', color: 'var(--warning)' }, children: "Focus Areas" }), result.improvementAreas.length > 0 ? (_jsx("ul", { style: { margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }, children: result.improvementAreas.map(s => _jsx("li", { children: s }, s)) })) : _jsx("span", { style: { color: 'var(--text-muted)' }, children: "Keep practicing!" })] })] })] }), _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx(Button, { onClick: () => navigate(`/assessments/results/${result.resultId}/review`), variant: "primary", fullWidth: true, children: "Review Answers" }), _jsx(Button, { onClick: () => navigate('/assessments/history'), variant: "outline", fullWidth: true, children: "View History" })] })] }));
};
//# sourceMappingURL=AssessmentResultPage.js.map
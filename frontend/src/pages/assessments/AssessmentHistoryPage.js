import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessmentHistory, AssessmentResult } from '../../services/assessmentService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { Target, Calendar, CheckCircle, XCircle } from 'lucide-react';
export const AssessmentHistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getAssessmentHistory()
            .then(setHistory)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { style: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }, children: [_jsxs("h1", { style: { margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [_jsx(Target, { size: 28 }), " Assessment History"] }), _jsx(Button, { variant: "outline", onClick: () => navigate('/assessments'), children: "Back to Assessments" })] }), history.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: '16px', color: 'var(--text-muted)' }, children: "You have not completed any assessments yet." })) : (_jsx("div", { style: { display: 'grid', gap: '1rem' }, children: history.map((res) => (_jsxs("div", { style: {
                        background: 'var(--bg-surface)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }, children: [_jsxs("div", { children: [_jsxs("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Calendar, { size: 14 }), " ", new Date(res.completedAt).toLocaleDateString()] }), _jsx("h3", { style: { margin: '0 0 0.5rem' }, children: res.assessmentId }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsxs("span", { style: { fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }, children: [res.percentage, "%"] }), _jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', color: res.passed ? 'var(--success)' : 'var(--error)' }, children: [res.passed ? _jsx(CheckCircle, { size: 14 }) : _jsx(XCircle, { size: 14 }), " ", res.passed ? 'Passed' : 'Failed'] })] })] }), _jsx("div", { children: _jsx(Button, { onClick: () => navigate(`/assessments/results/${res.resultId}`), children: "View Result" }) })] }, res.resultId))) }))] }));
};
//# sourceMappingURL=AssessmentHistoryPage.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessments, Assessment } from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Clock, FileText, Target, BarChart2, AlertCircle, RefreshCw, ClipboardCheck } from 'lucide-react';
const CATEGORY_ICONS = {
    aptitude: BarChart2,
    technical: FileText,
    coding: Target,
    communication: Target,
    mixed: Target,
    placement: Target
};
export const AssessmentLandingPage = () => {
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchAssessments = () => {
        setLoading(true);
        setError(null);
        getAssessments()
            .then(setAssessments)
            .catch((err) => setError(err.message || 'Failed to load assessments.'))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchAssessments();
    }, []);
    if (loading)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading Assessments..." });
    if (error) {
        return (_jsxs("div", { style: { maxWidth: 500, margin: '3rem auto', textAlign: 'center' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', marginBottom: '1rem' }, children: [_jsx(AlertCircle, { size: 20 }), _jsx("span", { style: { fontWeight: 600 }, children: "Failed to load assessments" })] }), _jsx("p", { style: { color: 'var(--text-muted)', marginBottom: '1.5rem' }, children: error }), _jsx(Button, { variant: "primary", icon: _jsx(RefreshCw, { size: 16 }), onClick: fetchAssessments, children: "Try Again" })] }));
    }
    return (_jsxs("div", { style: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' }, children: [_jsxs("div", { style: { marginBottom: '3rem' }, children: [_jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '0.5rem' }, children: "ARENA Assessments" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '1.1rem' }, children: "Test your skills. Measure your preparation. Get placement ready." })] }), assessments.length === 0 ? (_jsx(EmptyState, { title: "No assessments available yet", description: "Assessments will appear here once they are published by your administrator.", icon: _jsx(ClipboardCheck, { size: 36 }) })) : (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }, children: assessments.map(a => {
                    const Icon = CATEGORY_ICONS[a.category] || Target;
                    return (_jsxs("div", { style: { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }, children: [_jsx("div", { style: { width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Icon, { size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 0.25rem', fontSize: '1.2rem' }, children: a.title }), _jsx("div", { style: { fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, textTransform: 'capitalize' }, children: "Published" })] })] }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, margin: '0 0 1.5rem' }, children: a.description }), _jsxs("div", { style: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }, children: [_jsx(Clock, { size: 14 }), " ", a.durationMinutes, "m"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }, children: [_jsx(FileText, { size: 14 }), " ", a.questionCount, " Qs"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'capitalize' }, children: [_jsx(Target, { size: 14 }), " ", a.difficulty] })] }), _jsx(Button, { variant: "primary", fullWidth: true, onClick: () => navigate(`/assessments/${a.assessmentId}`), children: "View Details" })] }, a.assessmentId));
                }) }))] }));
};
//# sourceMappingURL=AssessmentLandingPage.js.map
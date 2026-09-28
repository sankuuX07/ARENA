import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, Target, Play, ShieldAlert } from 'lucide-react';
import { getAssessment, startAssessmentSession, Assessment } from '../../services/assessmentService';
import { Button } from '../../components/ui/Button';
export const AssessmentDetailsPage = () => {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    useEffect(() => {
        if (assessmentId) {
            getAssessment(assessmentId)
                .then(setAssessment)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [assessmentId]);
    const handleStart = async () => {
        if (!assessment)
            return;
        setStarting(true);
        try {
            const session = await startAssessmentSession(assessment.assessmentId);
            navigate(`/assessments/${assessment.assessmentId}/session/${session.sessionId}`);
        }
        catch (err) {
            alert(err.message || 'Failed to start assessment.');
            setStarting(false);
        }
    };
    if (loading)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Loading Assessment Details..." });
    if (!assessment)
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Assessment not found." });
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto', padding: '2rem' }, children: [_jsx(Button, { variant: "ghost", icon: _jsx(ArrowLeft, { size: 16 }), onClick: () => navigate('/assessments'), style: { marginBottom: '1.5rem' }, children: "Back to Assessments" }), _jsxs("div", { style: { background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }, children: [_jsx("h1", { style: { fontSize: '2.5rem', marginBottom: '0.5rem' }, children: assessment.title }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }, children: assessment.description }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }, children: [_jsxs("div", { style: { padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }, children: "Duration" }), _jsxs("div", { style: { fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Clock, { size: 18, color: "var(--primary)" }), " ", assessment.durationMinutes, " minutes"] })] }), _jsxs("div", { style: { padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }, children: "Questions" }), _jsxs("div", { style: { fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(FileText, { size: 18, color: "var(--primary)" }), " ", assessment.questionCount] })] }), _jsxs("div", { style: { padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }, children: "Difficulty" }), _jsxs("div", { style: { fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }, children: [_jsx(Target, { size: 18, color: "var(--primary)" }), " ", assessment.difficulty] })] }), _jsxs("div", { style: { padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }, children: [_jsx("div", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }, children: "Passing Score" }), _jsxs("div", { style: { fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Target, { size: 18, color: "var(--success)" }), " ", assessment.config.passingScore, "%"] })] })] }), _jsxs("div", { style: { marginBottom: '2.5rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid var(--error)' }, children: [_jsxs("h3", { style: { margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)' }, children: [_jsx(ShieldAlert, { size: 18 }), " Rules & Instructions"] }), _jsxs("ul", { style: { margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.5rem' }, children: [_jsx("li", { children: "The timer will not pause if you close the browser." }), _jsx("li", { children: "Once time expires, the assessment is automatically submitted." }), _jsx("li", { children: assessment.config.negativeMarking ? 'Negative marking IS enabled.' : 'No negative marking.' }), _jsx("li", { children: assessment.config.allowBackNavigation ? 'You CAN navigate back to previous questions.' : 'You CANNOT navigate back to previous questions.' }), _jsx("li", { children: "Ensure you have a stable internet connection before starting." })] })] }), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, icon: _jsx(Play, { size: 18 }), onClick: handleStart, disabled: starting, children: starting ? 'Initializing Session...' : 'Start Assessment' })] })] }));
};
//# sourceMappingURL=AssessmentDetailsPage.js.map
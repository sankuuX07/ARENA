import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { interviewEvaluationService } from '../../services/interviewEvaluationService';
import { InterviewEvaluation } from '../../types/interviewEvaluation';
import { InterviewPerformanceBreakdown } from '../../components/interview/InterviewPerformanceBreakdown';
import { InterviewStrengthsCard } from '../../components/interview/InterviewStrengthsCard';
import { InterviewImprovementCard } from '../../components/interview/InterviewImprovementCard';
import { InterviewQuestionReview } from '../../components/interview/InterviewQuestionReview';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { MessageSquare, ArrowLeft, Target } from 'lucide-react';
export const InterviewResultPage = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [evaluation, setEvaluation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchResult = async () => {
            if (!resultId)
                return;
            try {
                const data = await interviewEvaluationService.getResult(resultId);
                setEvaluation(data);
            }
            catch (err) {
                console.error('Failed to load evaluation', err);
                setError('Unable to load interview results. Please try again.');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchResult();
    }, [resultId]);
    if (isLoading) {
        return (_jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, { message: "Loading your interview evaluation...", size: 22 }) }));
    }
    if (error || !evaluation) {
        return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: "Interview Result", icon: _jsx(MessageSquare, {}) }), _jsxs(Card, { style: { textAlign: 'center', padding: '3rem' }, children: [_jsx("div", { style: { color: 'var(--danger)', marginBottom: '1rem' }, children: error || 'Result not found.' }), _jsx(Button, { onClick: () => navigate('/interview'), children: "Return to Interview Hub" })] })] }));
    }
    return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: "AI Interview Complete", subtitle: `${evaluation.mode.charAt(0).toUpperCase() + evaluation.mode.slice(1)} Interview Evaluation`, icon: _jsx(MessageSquare, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/interview/history'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back to History" }) }), evaluation.status === 'failed' ? (_jsxs(Card, { style: { textAlign: 'center', padding: '3rem' }, children: [_jsx("h2", { style: { color: 'var(--danger)', marginBottom: '1rem' }, children: "Evaluation Failed" }), _jsx("p", { style: { color: 'var(--text-muted)' }, children: "We could not complete the AI evaluation for this session. The transcript is saved, but the evaluation service is temporarily unavailable." })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: [_jsxs(Card, { style: { textAlign: 'center', padding: '2rem', background: 'var(--primary)', color: 'white' }, children: [_jsx("h3", { style: { margin: '0 0 0.5rem 0', color: 'white' }, children: "Overall Score" }), _jsxs("div", { style: { fontSize: '3.5rem', fontWeight: 'bold', lineHeight: 1 }, children: [evaluation.overallScore, _jsx("span", { style: { fontSize: '1.5rem', opacity: 0.8 }, children: "/100" })] }), evaluation.performanceLevel && (_jsx("div", { style: {
                                                    marginTop: '1rem',
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255,255,255,0.2)',
                                                    borderRadius: '2rem',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                }, children: evaluation.performanceLevel.replace(/_/g, ' ') }))] }), _jsx(InterviewPerformanceBreakdown, { evaluation: evaluation })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: [_jsxs(Card, { children: [_jsx("h3", { style: { marginBottom: '1rem' }, children: "Interview Summary" }), _jsx("p", { style: { margin: 0, lineHeight: 1.6 }, children: evaluation.summary })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }, children: [_jsx(InterviewStrengthsCard, { strengths: evaluation.strengths }), _jsx(InterviewImprovementCard, { improvementAreas: evaluation.improvementAreas })] }), evaluation.practiceAreas && evaluation.practiceAreas.length > 0 && (_jsxs(Card, { children: [_jsxs("h3", { style: { marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Target, { size: 20, style: { color: 'var(--primary)' } }), " Recommended Practice"] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: evaluation.practiceAreas.map((pa, i) => (_jsxs("div", { style: { padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }, children: [_jsx("div", { style: { fontWeight: 'bold', marginBottom: '0.25rem' }, children: pa.area }), _jsx("div", { style: { fontSize: '0.9rem', color: 'var(--text-muted)' }, children: pa.reason })] }, i))) })] }))] })] }), _jsx("h3", { style: { marginBottom: '1.5rem' }, children: "Question-by-Question Review" }), _jsx(InterviewQuestionReview, { evaluations: evaluation.questionEvaluations })] }))] }));
};
//# sourceMappingURL=InterviewResultPage.js.map
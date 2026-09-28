import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessmentReview, QuestionResult } from '../../services/assessmentService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
export const AssessmentReviewPage = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (resultId) {
            getAssessmentReview(resultId)
                .then(setReview)
                .catch(err => {
                console.error(err);
                navigate(`/assessments/results/${resultId}`);
            })
                .finally(() => setLoading(false));
        }
    }, [resultId, navigate]);
    if (loading)
        return _jsx(LoadingSpinner, {});
    if (review.length === 0) {
        return _jsx("div", { style: { padding: '2rem', textAlign: 'center' }, children: "Review data is not available yet." });
    }
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto', padding: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }, children: [_jsxs(Button, { variant: "outline", onClick: () => navigate(`/assessments/results/${resultId}`), children: [_jsx(ArrowLeft, { size: 16 }), " Back to Results"] }), _jsx("h2", { style: { margin: 0 }, children: "Answer Review" })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' }, children: review.map((q, idx) => (_jsxs("div", { style: {
                        background: 'var(--bg-surface)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: `1px solid ${q.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }, children: [_jsxs("span", { style: { fontWeight: 600 }, children: ["Question ", idx + 1] }), _jsxs("span", { style: {
                                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                                        color: q.isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 600
                                    }, children: [q.isCorrect ? _jsx(CheckCircle, { size: 16 }) : _jsx(XCircle, { size: 16 }), q.marksAwarded, " Marks"] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }, children: [_jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }, children: "Your Answer" }), _jsx("div", { children: q.studentAnswer || _jsx("span", { style: { color: 'var(--text-muted)' }, children: "Unanswered" }) })] }), _jsxs("div", { style: { background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }, children: "Correct Answer" }), _jsx("div", { children: q.correctAnswer || _jsx("span", { style: { color: 'var(--text-muted)' }, children: "Hidden or Dynamic Evaluation" }) })] })] }), q.explanation && (_jsxs("div", { style: { marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px' }, children: [_jsx("strong", { children: "Explanation:" }), " ", q.explanation] }))] }, q.questionId))) })] }));
};
//# sourceMappingURL=AssessmentReviewPage.js.map
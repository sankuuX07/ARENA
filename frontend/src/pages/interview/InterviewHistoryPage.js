import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { interviewEvaluationService } from '../../services/interviewEvaluationService';
import { InterviewHistoryItem } from '../../types/interviewEvaluation';
import { EmptyState } from '../../components/ui/EmptyState';
import { MessageSquare, ArrowLeft, Clock } from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
export const InterviewHistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await interviewEvaluationService.getHistory();
                setHistory(data);
            }
            catch (err) {
                console.error('Failed to load history', err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);
    if (isLoading) {
        return (_jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, { message: "Loading interview history...", size: 22 }) }));
    }
    return (_jsxs("div", { className: "page-container", children: [_jsx(PageHeader, { title: "Interview History", subtitle: "Review your past AI interview evaluations and feedback.", icon: _jsx(MessageSquare, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/interview'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back to Interview Hub" }) }), history.length > 0 ? (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }, children: history.map(item => (_jsxs(Card, { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }, children: [_jsxs("div", { children: [_jsxs("h3", { style: { margin: 0, fontSize: '1.1rem', textTransform: 'capitalize' }, children: [item.mode, " Interview"] }), item.topic && (_jsxs("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }, children: ["Topic: ", item.topic] }))] }), item.overallScore !== undefined && item.overallScore !== null ? (_jsxs("div", { style: { fontWeight: 'bold', color: 'var(--primary)', background: 'var(--bg-surface)', padding: '0.25rem 0.5rem', borderRadius: '4px' }, children: [item.overallScore, "%"] })) : null] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }, children: [_jsx(Clock, { size: 16 }), new Date(item.createdAt).toLocaleDateString()] }), item.performanceLevel && (_jsxs("div", { style: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase' }, children: ["Performance: ", _jsx("span", { style: { color: 'var(--primary)' }, children: item.performanceLevel.replace(/_/g, ' ') })] })), _jsx(Button, { fullWidth: true, variant: "outline", onClick: () => navigate(`/interview/results/${item.resultId}`), children: "View Full Result" })] }, item.resultId))) })) : (_jsx(EmptyState, { icon: _jsx(MessageSquare, { size: 36 }), title: "No History Found", description: "You haven't completed any AI interviews yet.", action: _jsx(Button, { onClick: () => navigate('/interview'), children: "Start an Interview" }) }))] }));
};
//# sourceMappingURL=InterviewHistoryPage.js.map
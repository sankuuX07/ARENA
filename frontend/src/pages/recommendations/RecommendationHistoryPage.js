import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { recommendationService } from '../../services/recommendationService';
import { RecommendationHistoryItem } from '../../types/recommendation';
import { History, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const RecommendationHistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await recommendationService.getHistory();
                // Sort descending
                setHistory(data.sort((a, b) => new Date(b.resolvedAt).getTime() - new Date(a.resolvedAt).getTime()));
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Recommendation History", subtitle: "Review your completed and dismissed actions.", icon: _jsx(History, { size: 28 }), action: _jsx(Button, { variant: "outline", onClick: () => navigate('/recommendations'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back to Plan" }) }), history.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }, children: "No history found. You haven't completed or dismissed any recommendations yet." })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: history.map((item, idx) => (_jsxs("div", { style: { background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }, children: [_jsx("div", { style: { marginTop: '0.25rem' }, children: item.resolutionType === 'completed' ? (_jsx(CheckCircle2, { size: 24, style: { color: 'var(--success)' } })) : (_jsx(XCircle, { size: 24, style: { color: 'var(--text-muted)' } })) }), _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }, children: [_jsx("span", { style: { fontWeight: 'bold', fontSize: '1.1rem' }, children: item.recommendation.title }), _jsx("span", { style: { fontSize: '0.8rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--border-color)', color: 'var(--text-secondary)', textTransform: 'uppercase' }, children: item.resolutionType })] }), _jsx("div", { style: { fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }, children: item.recommendation.description }), _jsxs("div", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' }, children: ["Resolved on: ", new Date(item.resolvedAt).toLocaleString()] })] })] }, idx))) }))] }));
};
//# sourceMappingURL=RecommendationHistoryPage.js.map
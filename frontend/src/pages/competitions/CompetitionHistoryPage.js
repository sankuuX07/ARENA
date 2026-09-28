import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { competitionService } from '../../services/competitionService';
import { CompetitionHistoryItem } from '../../types/competition';
import { History, Trophy, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const CompetitionHistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        competitionService.getHistory()
            .then(setHistory)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '1000px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Competition History", subtitle: "Review your past competitive performances.", icon: _jsx(History, { size: 28 }) }), history.length === 0 ? (_jsxs(Card, { style: { textAlign: 'center', padding: '4rem' }, children: [_jsx(Trophy, { size: 48, style: { color: 'var(--border-color)', marginBottom: '1rem' } }), _jsx("h3", { style: { color: 'var(--text-secondary)' }, children: "No history yet" }), _jsx("p", { style: { color: 'var(--text-muted)' }, children: "Participate in a competition to see your history here." })] })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: history.map((item, idx) => (_jsxs(Card, { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }, onClick: () => navigate(`/competitions/${item.competitionId}/result`), children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }, children: [_jsx(Badge, { style: { background: 'var(--primary)', color: 'white', textTransform: 'uppercase' }, children: item.type }), _jsx(Badge, { style: { border: '1px solid var(--border-color)' }, children: item.status.toUpperCase() })] }), _jsx("h3", { style: { margin: 0, fontSize: '1.2rem' }, children: item.title }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }, children: [_jsx(Clock, { size: 14 }), " Completed: ", new Date(item.dateCompleted).toLocaleDateString()] })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsxs("div", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }, children: [item.score, " ", _jsx("span", { style: { fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }, children: "pts" })] }), item.rank && (_jsxs("div", { style: { color: 'var(--warning)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }, children: [_jsx(Trophy, { size: 14 }), " Rank: #", item.rank] }))] })] }, idx))) }))] }));
};
//# sourceMappingURL=CompetitionHistoryPage.js.map
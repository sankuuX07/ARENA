import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { competitionService } from '../../services/competitionService';
import { CompetitionResult } from '../../types/competition';
import { CheckCircle, Trophy, BarChart2, ArrowRight } from 'lucide-react';
export const CompetitionResultPage = () => {
    const { competitionId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (competitionId) {
            competitionService.getResult(competitionId)
                .then(setResult)
                .catch(err => setError(err.response?.data?.detail || "Could not load result"))
                .finally(() => setIsLoading(false));
        }
    }, [competitionId]);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (error || !result)
        return _jsxs("div", { style: { textAlign: 'center', padding: '4rem' }, children: [_jsx("h2", { children: "Error" }), _jsx("p", { children: error })] });
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Competition Complete", subtitle: "Your answers have been securely submitted.", icon: _jsx(CheckCircle, { size: 32, style: { color: 'var(--success)' } }) }), _jsxs(Card, { style: { marginBottom: '2rem', textAlign: 'center', padding: '3rem 2rem' }, children: [_jsxs("h2", { style: { fontSize: '3rem', color: 'var(--primary)', marginBottom: '0.5rem' }, children: [result.score, " ", _jsx("span", { style: { fontSize: '1.25rem', color: 'var(--text-muted)' }, children: "pts" })] }), result.rank && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.25rem', color: 'var(--warning)', fontWeight: 'bold', marginBottom: '2rem' }, children: [_jsx(Trophy, { size: 24 }), " Rank: #", result.rank] })), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }, children: [_jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem' }, children: "Challenges Completed" }), _jsx("div", { style: { fontSize: '1.2rem', fontWeight: 'bold' }, children: result.challengesCompleted })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem' }, children: "Time Used" }), _jsx("div", { style: { fontSize: '1.2rem', fontWeight: 'bold' }, children: formatTime(result.timeUsedSeconds) })] })] }), _jsx("p", { style: { marginTop: '2rem', color: 'var(--text-secondary)' }, children: result.performanceSummary })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'center', gap: '1rem' }, children: [_jsx(Button, { onClick: () => navigate(`/competitions/${competitionId}/leaderboard`), icon: _jsx(BarChart2, { size: 16 }), children: "View Leaderboard" }), _jsx(Button, { variant: "outline", onClick: () => navigate('/analytics'), icon: _jsx(ArrowRight, { size: 16 }), children: "View Analytics" })] })] }));
};
//# sourceMappingURL=CompetitionResultPage.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CompetitionLeaderboard } from '../../components/competitions/CompetitionLeaderboard';
import { competitionService } from '../../services/competitionService';
import { CompetitionLeaderboardResponse, Competition } from '../../types/competition';
import { Trophy, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export const CompetitionLeaderboardPage = () => {
    const { competitionId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [competition, setCompetition] = useState(null);
    const [leaderboard, setLeaderboard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const fetchData = async (refresh = false) => {
        if (!competitionId)
            return;
        if (refresh)
            setIsRefreshing(true);
        try {
            if (!competition) {
                const comp = await competitionService.getById(competitionId);
                setCompetition(comp);
            }
            const lb = await competitionService.getLeaderboard(competitionId);
            setLeaderboard(lb);
        }
        catch (err) {
            setError(err.response?.data?.detail || "Could not load leaderboard");
        }
        finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };
    useEffect(() => {
        fetchData();
        // Optional: Setup polling if it's a live leaderboard
        // const interval = setInterval(() => fetchData(true), 15000);
        // return () => clearInterval(interval);
    }, [competitionId]);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (error || !competition || !leaderboard)
        return _jsxs("div", { style: { textAlign: 'center', padding: '4rem' }, children: [_jsx("h2", { children: "Error" }), _jsx("p", { children: error })] });
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '1000px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: `${competition.title} - Leaderboard`, subtitle: "See how you stack up against the competition.", icon: _jsx(Trophy, { size: 28 }), action: _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx(Button, { variant: "outline", onClick: () => navigate(`/competitions/${competitionId}`), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back to Details" }), _jsx(Button, { onClick: () => fetchData(true), disabled: isRefreshing, icon: _jsx(RefreshCw, { size: 16, className: isRefreshing ? 'spin' : '' }), children: "Refresh" })] }) }), _jsxs("div", { style: { textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }, children: ["Last updated: ", new Date(leaderboard.lastUpdated).toLocaleString()] }), _jsx(CompetitionLeaderboard, { entries: leaderboard.entries, currentUserId: currentUser?.uid })] }));
};
//# sourceMappingURL=CompetitionLeaderboardPage.js.map
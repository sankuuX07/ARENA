import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CompetitionCard } from '../../components/competitions/CompetitionCard';
import { competitionService } from '../../services/competitionService';
import { Competition } from '../../types/competition';
import { Trophy } from 'lucide-react';
export const CompetitionsPage = () => {
    const [live, setLive] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const [liveData, upcomingData] = await Promise.all([
                    competitionService.getLive(),
                    competitionService.getUpcoming()
                ]);
                setLive(liveData);
                setUpcoming(upcomingData);
            }
            catch (err) {
                console.error("Failed to load competitions", err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCompetitions();
    }, []);
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '1200px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: "Competitive Environment", subtitle: "Challenge yourself in coding, aptitude, and technical competitions.", icon: _jsx(Trophy, { size: 28 }) }), _jsxs("div", { style: { marginBottom: '3rem' }, children: [_jsx("h2", { style: { marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }, children: "Live Now" }), live.length === 0 ? (_jsx("div", { style: { padding: '2rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }, children: "No live competitions at the moment. Check the upcoming schedule!" })) : (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }, children: live.map(c => _jsx(CompetitionCard, { competition: c }, c.competitionId)) }))] }), _jsxs("div", { children: [_jsx("h2", { style: { marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }, children: "Upcoming" }), upcoming.length === 0 ? (_jsx("div", { style: { padding: '2rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }, children: "No upcoming competitions scheduled right now." })) : (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }, children: upcoming.map(c => _jsx(CompetitionCard, { competition: c }, c.competitionId)) }))] })] }));
};
//# sourceMappingURL=CompetitionsPage.js.map
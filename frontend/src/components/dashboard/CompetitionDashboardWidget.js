import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { competitionService } from '../../services/competitionService';
export const CompetitionDashboardWidget = () => {
    const navigate = useNavigate();
    const [liveCount, setLiveCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [live, upcoming] = await Promise.all([
                    competitionService.getLive(),
                    competitionService.getUpcoming()
                ]);
                setLiveCount(live.length);
                setUpcomingCount(upcoming.length);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCounts();
    }, []);
    if (isLoading)
        return null; // Or a small skeleton
    return (_jsxs(Card, { style: { marginBottom: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }, children: [_jsx(Trophy, { size: 20 }), _jsx("h3", { style: { margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }, children: "Competitions" })] }), liveCount === 0 && upcomingCount === 0 ? (_jsx("p", { style: { fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }, children: "No competitions are currently available. Check back soon!" })) : (_jsxs("div", { style: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' }, children: [_jsxs("div", { style: { flex: 1, background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: liveCount > 0 ? 'var(--success)' : 'var(--text-main)' }, children: liveCount }), _jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: "Live Now" })] }), _jsxs("div", { style: { flex: 1, background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }, children: upcomingCount }), _jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: "Upcoming" })] })] })), _jsx(Button, { onClick: () => navigate('/competitions'), icon: _jsx(ArrowRight, { size: 16 }), style: { width: '100%' }, children: "Explore Competitions" })] }));
};
//# sourceMappingURL=CompetitionDashboardWidget.js.map
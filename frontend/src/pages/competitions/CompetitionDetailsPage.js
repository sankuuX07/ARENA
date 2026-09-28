import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { competitionService } from '../../services/competitionService';
import { Competition } from '../../types/competition';
import { Clock, Users, ArrowLeft, ShieldAlert } from 'lucide-react';
export const CompetitionDetailsPage = () => {
    const { competitionId } = useParams();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (competitionId) {
            competitionService.getById(competitionId)
                .then(setCompetition)
                .catch(err => setError(err.response?.data?.detail || "Competition not found"))
                .finally(() => setIsLoading(false));
        }
    }, [competitionId]);
    const handleRegister = async () => {
        if (!competitionId)
            return;
        setIsRegistering(true);
        try {
            await competitionService.register(competitionId);
            // Reload to update state
            const updated = await competitionService.getById(competitionId);
            setCompetition(updated);
        }
        catch (err) {
            alert(err.response?.data?.detail || "Failed to register");
        }
        finally {
            setIsRegistering(false);
        }
    };
    const handleJoin = () => {
        navigate(`/competitions/${competitionId}/participate`);
    };
    if (isLoading)
        return _jsx("div", { style: { display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center' }, children: _jsx(LoadingSpinner, {}) });
    if (error || !competition)
        return _jsxs("div", { style: { textAlign: 'center', padding: '4rem' }, children: [_jsx("h2", { children: "Error" }), _jsx("p", { children: error })] });
    return (_jsxs("div", { className: "page-container", style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsx(PageHeader, { title: competition.title, subtitle: competition.type.toUpperCase() + " COMPETITION", action: _jsx(Button, { variant: "outline", onClick: () => navigate('/competitions'), icon: _jsx(ArrowLeft, { size: 16 }), children: "Back" }) }), _jsxs(Card, { style: { marginBottom: '2rem' }, children: [_jsxs("div", { style: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' }, children: [_jsx(Badge, { style: { background: 'var(--primary)', color: 'white' }, children: competition.status.toUpperCase() }), _jsx(Badge, { style: { border: '1px solid var(--border-color)' }, children: competition.difficulty.toUpperCase() })] }), _jsx("p", { style: { fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', color: 'var(--text-secondary)' }, children: competition.description }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }, children: [_jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }, children: "Start Time" }), _jsx("div", { style: { fontWeight: 'bold' }, children: new Date(competition.startTime).toLocaleString() })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }, children: "Duration" }), _jsxs("div", { style: { fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Clock, { size: 16 }), " ", competition.durationMinutes, " Minutes"] })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }, children: "Participants" }), _jsxs("div", { style: { fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Users, { size: 16 }), " ", competition.participantCount, " / ", competition.maxParticipants] })] }), _jsxs("div", { children: [_jsx("div", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }, children: "Scoring" }), _jsx("div", { style: { fontWeight: 'bold' }, children: competition.rules.scoringMethod.toUpperCase() })] })] }), _jsxs("h3", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }, children: [_jsx(ShieldAlert, { size: 20 }), " Rules & Information"] }), _jsxs("ul", { style: { paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }, children: [_jsx("li", { children: "Timer is strictly enforced on the server. Do not refresh unnessarily." }), _jsx("li", { children: "Auto-saving is enabled, but manual submission before the deadline is recommended." }), _jsxs("li", { children: ["Leaderboard is visible: ", _jsx("strong", { children: competition.rules.leaderboardVisibility.replace('_', ' ') })] }), _jsx("li", { children: "Once submitted, you cannot edit your answers or retry." })] }), _jsxs("div", { style: { borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }, children: [competition.status === 'upcoming' && (_jsx(Button, { onClick: handleRegister, disabled: isRegistering, size: "lg", children: isRegistering ? 'Registering...' : 'Register Now' })), competition.status === 'live' && (_jsx(Button, { onClick: handleJoin, size: "lg", style: { background: 'var(--success)' }, children: "Join Competition" })), competition.status === 'completed' && (_jsx(Button, { onClick: () => navigate(`/competitions/${competitionId}/result`), size: "lg", children: "View Results" }))] })] })] }));
};
//# sourceMappingURL=CompetitionDetailsPage.js.map
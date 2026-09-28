import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Competition } from '../../types/competition';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Trophy } from 'lucide-react';
export const CompetitionCard = ({ competition, showStatusBadge = true }) => {
    const navigate = useNavigate();
    const getStatusColor = (status) => {
        switch (status) {
            case 'live': return 'var(--success)';
            case 'upcoming': return 'var(--warning)';
            case 'completed': return 'var(--text-muted)';
            default: return 'var(--border-color)';
        }
    };
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'hard': return 'var(--danger)';
            case 'medium': return 'var(--warning)';
            case 'easy': return 'var(--success)';
            default: return 'var(--text-muted)';
        }
    };
    return (_jsxs(Card, { style: { display: 'flex', flexDirection: 'column', height: '100%' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx(Badge, { style: { background: 'var(--primary)', color: 'white', textTransform: 'uppercase' }, children: competition.type }), _jsx(Badge, { style: { border: `1px solid ${getDifficultyColor(competition.difficulty)}`, color: getDifficultyColor(competition.difficulty), background: 'transparent' }, children: competition.difficulty.toUpperCase() })] }), showStatusBadge && (_jsx(Badge, { style: { background: getStatusColor(competition.status), color: 'white' }, children: competition.status.toUpperCase() }))] }), _jsx("h3", { style: { fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }, children: competition.title }), _jsx("p", { style: { fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }, children: competition.description }), _jsxs("div", { style: { display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }, children: [_jsx(Clock, { size: 16 }), competition.durationMinutes, " mins"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }, children: [_jsx(Users, { size: 16 }), competition.participantCount, " / ", competition.maxParticipants] }), competition.status === 'completed' && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }, children: [_jsx(Trophy, { size: 16 }), "Results"] }))] }), _jsx(Button, { onClick: () => navigate(`/competitions/${competition.competitionId}`), style: { width: '100%' }, children: competition.status === 'completed' ? 'View Results' : 'View Details' })] }));
};
//# sourceMappingURL=CompetitionCard.js.map
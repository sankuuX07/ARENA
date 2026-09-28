import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MessageSquare, Mic, Briefcase, Users, Play, Clock, Sparkles } from 'lucide-react';
export const CommunicationModeSelector = ({ onSelectMode }) => {
    const modes = [
        {
            id: 'general',
            title: 'General Practice',
            description: 'Interactive conversation practice covering self-introductions, technical summaries, and interview warm-ups.',
            icon: _jsx(MessageSquare, { size: 22 }),
            badge: _jsx(Badge, { variant: "success", children: "Active" }),
            isAvailable: true,
            milestone: 'Milestone 8 Foundation',
        },
        {
            id: 'fluency',
            title: 'Spoken Fluency Drill',
            description: 'Interactive 5-turn English speaking fluency coaching with 7-criteria AI score evaluations.',
            icon: _jsx(Mic, { size: 22 }),
            badge: _jsx(Badge, { variant: "success", children: "Active Module" }),
            isAvailable: true,
            milestone: 'Milestone 9',
        },
        {
            id: 'formal',
            title: 'Formal Corporate Tone',
            description: 'Corporate etiquette, executive vocabulary, and professional email/verbal tone practice.',
            icon: _jsx(Briefcase, { size: 22 }),
            badge: _jsx(Badge, { variant: "success", children: "Active Module" }),
            isAvailable: true,
            milestone: 'Milestone 10',
        },
        {
            id: 'situational',
            title: 'Situational & Behavioral',
            description: 'STAR method response drills for behavioral workplace scenarios.',
            icon: _jsx(Sparkles, { size: 22 }),
            badge: _jsx(Badge, { variant: "success", children: "Active Module" }),
            isAvailable: true,
            milestone: 'Milestone 11',
        },
        {
            id: 'group_discussion',
            title: 'AI Group Discussion',
            description: 'Multi-persona AI group discussion simulator with topic arguments and counter-points.',
            icon: _jsx(Users, { size: 22 }),
            badge: _jsx(Badge, { variant: "success", children: "Active Module" }),
            isAvailable: true,
            milestone: 'Milestone 12',
        },
    ];
    return (_jsxs("div", { style: { maxWidth: 1000, margin: '0 auto', width: '100%' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '2.5rem' }, children: [_jsx("h2", { className: "section-title", style: { fontSize: '1.75rem', marginBottom: '0.5rem' }, children: "Select Communication Practice Mode" }), _jsx("p", { className: "page-header-description", style: { fontSize: '1rem', maxWidth: 650, margin: '0 auto' }, children: "Choose a practice mode to start an interactive AI coaching session. Build confidence and placement readiness." })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }, children: modes.map((mode) => (_jsxs(Card, { hoverLift: mode.isAvailable, style: {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        opacity: mode.isAvailable ? 1 : 0.72,
                        background: mode.isAvailable
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%)'
                            : 'var(--bg-surface)',
                        border: mode.isAvailable ? '1.5px solid var(--border-color-glow)' : '1px solid var(--border-color)',
                    }, children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }, children: [_jsx("div", { style: {
                                                padding: '0.6rem',
                                                borderRadius: 'var(--radius-md)',
                                                background: mode.isAvailable ? 'var(--primary-gradient)' : 'var(--bg-surface-elevated)',
                                                color: '#ffffff',
                                                display: 'flex',
                                            }, children: mode.icon }), mode.badge] }), _jsx("h3", { style: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.45rem' }, children: mode.title }), _jsx("p", { className: "caption-text", style: { fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }, children: mode.description })] }), _jsx(Button, { variant: mode.isAvailable ? 'primary' : 'outline', fullWidth: true, disabled: !mode.isAvailable, icon: mode.isAvailable ? _jsx(Play, { size: 16 }) : _jsx(Clock, { size: 16 }), onClick: () => mode.isAvailable && onSelectMode(mode.id), children: mode.isAvailable ? 'Start Session' : mode.milestone })] }, mode.id))) })] }));
};
//# sourceMappingURL=CommunicationModeSelector.js.map
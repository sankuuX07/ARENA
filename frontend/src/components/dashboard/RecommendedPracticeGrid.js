import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RecommendationItem } from '../../services/dashboardService';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const RecommendedPracticeGrid = ({ recommendations }) => {
    const navigate = useNavigate();
    const getDifficultyBadge = (diff) => {
        switch (diff) {
            case 'Easy':
                return _jsx(Badge, { variant: "success", children: "Easy" });
            case 'Medium':
                return _jsx(Badge, { variant: "warning", children: "Medium" });
            case 'Hard':
                return _jsx(Badge, { variant: "error", children: "Hard" });
            default:
                return _jsx(Badge, { variant: "neutral", children: diff });
        }
    };
    return (_jsxs(Card, { style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "arena-card-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Sparkles, { size: 20, style: { color: 'var(--primary)' } }), _jsx("h2", { className: "card-title", children: "Recommended for You" })] }), _jsx(Badge, { variant: "primary", children: "UI Demo" })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }, children: recommendations.map((rec) => (_jsxs(Card, { hoverLift: true, style: {
                        padding: '1rem',
                        background: 'var(--bg-surface-elevated)',
                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }, children: [_jsx(Badge, { variant: "neutral", style: { fontSize: '0.7rem' }, children: rec.category }), getDifficultyBadge(rec.difficulty)] }), _jsx("h3", { style: { fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem' }, children: rec.title }), _jsx("p", { className: "caption-text", style: { fontSize: '0.8rem', marginBottom: '0.85rem' }, children: rec.description }), _jsxs("button", { type: "button", onClick: () => navigate(rec.path), style: {
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: 0,
                            }, children: [_jsx("span", { children: "Practice Now" }), _jsx(ArrowRight, { size: 12 })] })] }, rec.id))) })] }));
};
//# sourceMappingURL=RecommendedPracticeGrid.js.map